// src/Components/TransactionsHistory.jsx
import  { useEffect, useState } from "react";
import TransactionService from "../Services/TransactionService";
import styles from "./TransactionsHistory.module.css";
import ConsultantHeader from "./ConsultantHeader";

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve the current user's id from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (userId) {
      TransactionService.getUserTransactions(userId)
        .then((data) => {
          setTransactions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading transactions...</h2>
      </div>
    );
  }

  return (

    <div className={styles.container}>
              <ConsultantHeader />
        
      {/* Header with Title and Balance Info */}
      <div className={styles.header}>
        <h1 className={styles.title}>Historique des transactions</h1>
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>Available balance: $0.00</span>
          <span className={styles.pendingLabel}>$0.00 pending</span>
        </div>
      </div>

      {/* Filters Row */}
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label>Date range</label>
          <select>
            <option>All time</option>
            <option>This month</option>
            <option>Last 6 months</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Transaction type</label>
          <select>
            <option>All types</option>
            <option>Subscription</option>
            <option>Mission</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Client</label>
          <select>
            <option>All clients</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Contract</label>
          <select>
            <option>All contracts</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Select download</label>
          <select>
            <option>CSV</option>
            <option>PDF</option>
          </select>
        </div>
      </div>

      {/* Filtered Totals Section */}
      <div className={styles.filteredTotals}>
        <strong>Filtered totals:</strong>
        <p>Select a filter to get a breakdown of your earnings, fees, and taxes.</p>
      </div>

      {/* Transactions List or Empty State */}
      {transactions && transactions.length > 0 ? (
        <div className={styles.transactionsList}>
          <div className={styles.transactionHeader}>
            <span>Date</span>
            <span>Type</span>
            <span>Montant</span>
            <span>Statut</span>
          </div>
          {transactions.map((tx) => (
            <div className={styles.transactionRow} key={tx.id}>
              <span>{new Date(tx.date).toLocaleDateString()}</span>
              <span>{tx.type}</span>
              <span>{tx.montant} DT</span>
              <span>{tx.statut}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.folderIcon}>📁</div>
          <p>No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;