import { useEffect, useState, useMemo } from "react";
import TransactionService from "../services/TransactionService";
import styles from "./TransactionsHistory.module.css";
import PaymentService from "../Services/PaymentService";
import EntrepriseService from "../Services/EntrepriseService"; // Adjust path as needed

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [typeFilter, setTypeFilter] = useState("Tous les types");
  const [dateFilter, setDateFilter] = useState("Toutes");
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [frozenBalance, setFrozenBalance] = useState(0);
  const [entrepriseType, setEntrepriseType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const userRole = storedUser?.role;

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balanceResponse = await PaymentService.getCustomerBalance(userId);
        setAvailableBalance(balanceResponse?.available ?? 0);

        if (userRole === "Entreprise") {
          try {
            const entrepriseDetails = await EntrepriseService.getEntrepriseById(userId);
            setEntrepriseType(entrepriseDetails.typeEntreprise || '');
            if (entrepriseDetails.typeEntreprise !== 'SSI') {
              const frozenResponse = await EntrepriseService.getFrozenBalance(userId);
              setFrozenBalance(frozenResponse);
            } else {
              setFrozenBalance(0);
            }
          } catch (error) {
            console.error("Error fetching entreprise details:", error);
            setFrozenBalance(0);
            setEntrepriseType('');
          }
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
        setAvailableBalance(0);
        setFrozenBalance(0);
      } finally {
        setIsLoading(false); // Update loading state
      }
    };

    if (userId) fetchBalances();
  }, [userId, userRole]);

  useEffect(() => {
    if (userId) {
      TransactionService.getUserTransactions(userId)
        .then(async (data) => {
          console.log(data)
          // For each transaction with a missionId, fetch the mission details to get its titre
          const transactionsWithMission = await Promise.all(
            data.map(async (tx) => {
              if (tx.missionName === "" && tx.missionId) {
                try {
                  const mission = await TransactionService.getMissionById(tx.missionId);
                  // Use mission.titre if available; otherwise, use a fallback string
                  return { ...tx, missionName: mission.titre || `Mission ${tx.missionId}` };
                } catch (error) {
                  console.error("Error fetching mission for transaction", tx.id, error);
                  return { ...tx, missionName: `Mission ${tx.missionId}` };
                }
              }
              return tx;
            })
          );
          setTransactions(transactionsWithMission);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          setLoading(false);
        })
        .finally(() => {
          setIsLoading(false); // Update loading state
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  const pendingBalance = useMemo(() => {
    if (userRole !== "Consultant") return 0;
    return transactions
      .filter(tx => tx.type === "Fonds gelés")
      .reduce((sum, tx) => sum + parseFloat(tx.montant), 0);
  }, [transactions, userRole]);

  const displayedTransactions = useMemo(() => {
    if (userRole === "Consultant") {
      return transactions.filter(tx => tx.type !== "Fonds gelés");
    }
    return transactions;
  }, [transactions, userRole]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...displayedTransactions];
    if (typeFilter !== "Tous les types") {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    if (dateFilter !== "Toutes") {
      const now = new Date();
      if (dateFilter === "Ce mois") {
        filtered = filtered.filter((tx) => {
          const txDate = new Date(tx.date);
          return (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear());
        });
      } else if (dateFilter === "6 derniers mois") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        filtered = filtered.filter((tx) => new Date(tx.date) >= sixMonthsAgo);
      }
    }
    return filtered;
  }, [displayedTransactions, typeFilter, dateFilter]);

  const sortedTransactions = useMemo(() => {
    let sortable = [...filteredTransactions];
    if (sortConfig.key !== null) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "date") {
          aVal = new Date(a.date);
          bVal = new Date(b.date);
        }
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredTransactions, sortConfig]);

  const handleAddFunds = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      const response = await PaymentService.createAddFundsSession(userId, parseFloat(amount));
      localStorage.setItem("addFundsData", JSON.stringify({
        sessionId: response.sessionId,
        userId,
        amount: parseFloat(amount)
      }));
      window.location.href = response.sessionUrl;
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("Failed to initiate payment");
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  const resetSorting = () => {
    setSortConfig({ key: null, direction: "ascending" });
  };

  // Combine both loading states to render the same overlay effect as in Subscription
  if (loading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p>Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  const getAmountDisplay = (tx) => {
    if (tx.type === "Résolution de litige") {
      return tx.isOutgoing 
        ? `- ${tx.montant} ${tx.currency}`
        : `+ ${tx.montant} ${tx.currency}`;
    }
    if (userRole === "Admin" && tx.isAdminMissionFee) {
      return `+ ${(tx.applicationFee / 100).toFixed(2)} ${tx.currency}`;
    }
    if (tx.isIncoming) {
      return `+ ${tx.montant} ${tx.currency}`;
    }
    if (tx.isOutgoing) {
      return `- ${tx.montant} ${tx.currency}`;
    }
    return `${tx.montant} ${tx.currency}`;
  };

  const getAmountStyle = (tx) => {
    if (tx.type === "Résolution de litige") {
      return tx.isOutgoing ? styles.sentAmount : styles.receivedAmount;
    }
    if (tx.type === "Résolution de litige" && userRole === "Entreprise") {
      return styles.sentAmount;
    }
    if (userRole === "Admin" && tx.isAdminMissionFee) {
      return styles.receivedAmount;
    }
    if (tx.isIncoming) return styles.receivedAmount;
    if (tx.isOutgoing) return styles.sentAmount;
    return '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Historique des transactions</h1>
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>
            Solde disponible : {(availableBalance ?? 0).toFixed(2)}€
          </span>
          {userRole === "Entreprise" && entrepriseType !== 'SSI' && (
            <span className={styles.frozenBalance}>
              Solde gelé : {(frozenBalance ?? 0).toFixed(2)}€
            </span>
          )}
          {userRole === "Consultant" && (
            <span className={styles.pendingBalance}>
              Argent en attente : {pendingBalance.toFixed(2)}€
            </span>
          )}
          <button 
            onClick={() => setShowAddFundsModal(true)}
            className={styles.addFundsButton}
          >
            Ajouter des fonds
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label>Période</label>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option>Toutes</option>
            <option>Ce mois</option>
            <option>6 derniers mois</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Type de transaction</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option>Tous les types</option>
            <option>Abonnement</option>
            <option>Première tranche de mission</option>
            <option>Ajout de fonds</option>
            <option>Fonds gelés</option>
            <option>Commission SSI</option>
            <option>Résolution de litige</option>
          </select>
        </div>

      </div>

      <div className={styles.filteredTotals}>
        <strong>Totaux filtrés :</strong>
        <p>Sélectionnez un filtre pour voir le détail de vos gains, frais et status.</p>
      </div>

      <div className={styles.transactionHeader}>
        <span className={styles.sortableHeader} onClick={() => requestSort("date")}>
          Date {getSortIcon("date")}
        </span>
        <span className={styles.sortableHeader} onClick={() => requestSort("type")}>
          Type {getSortIcon("type")}
        </span>
        <span className={styles.sortableHeader}>Mission</span>
        <span className={styles.sortableHeader} onClick={() => requestSort("montant")}>
          Montant {getSortIcon("montant")}
        </span>
        <span className={styles.sortableHeader} onClick={() => requestSort("statut")}>
          Statut {getSortIcon("statut")}
        </span>

        {sortConfig.key !== null && (
          <button className={styles.resetSortIcon} onClick={resetSorting}>
            ✖
          </button>
        )}
      </div>

      {sortedTransactions && sortedTransactions.length > 0 ? (
        <div className={styles.transactionsList}>
          {sortedTransactions.map((tx) => (
            <div className={styles.transactionRow} key={tx.id}>
              <span>{new Date(tx.date).toLocaleDateString("fr-FR")}</span>
              <span>{tx.type}</span>
              <span>{tx.missionName}</span>
              <span className={getAmountStyle(tx)}>
                {getAmountDisplay(tx)}
                {userRole === "Admin" && tx.type === "Première tranche de mission" && (
                  <div className={styles.feeText}>
                    (Frais: {(tx.applicationFee / 100).toFixed(2)} {tx.currency})
                  </div>
                )}
              </span>
              <span className={tx.statut === "Réussi" ? styles.successStatus : styles.errorStatus}>
                {tx.statut}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.folderIcon}>📁</div>
          <p>Aucune transaction trouvée</p>
        </div>
      )}

      {showAddFundsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Ajouter des fonds</h3>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Montant</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Entrez le montant"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowAddFundsModal(false)}>
                Annuler
              </button>
              <button type="button" onClick={handleAddFunds}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;
