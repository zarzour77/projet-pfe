// src/Components/TransactionsHistory.jsx
import { useEffect, useState, useMemo } from "react";
import TransactionService from "../Services/TransactionService";
import styles from "./TransactionsHistory.module.css";
import ConsultantHeader from "./Header";

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Sorting state: key and direction.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  // Filtering state for type and date range.
  const [typeFilter, setTypeFilter] = useState("All types");
  const [dateFilter, setDateFilter] = useState("All time");

  // Retrieve the current user's id from localStorage.
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

  // First, filter the transactions.
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (typeFilter !== "All types") {
      filtered = filtered.filter(
        (tx) => tx.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    if (dateFilter !== "All time") {
      const now = new Date();
      if (dateFilter === "This month") {
        filtered = filtered.filter((tx) => {
          const txDate = new Date(tx.date);
          return (
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear()
          );
        });
      } else if (dateFilter === "Last 6 months") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        filtered = filtered.filter((tx) => new Date(tx.date) >= sixMonthsAgo);
      }
    }
    return filtered;
  }, [transactions, typeFilter, dateFilter]);

  // Then, sort the filtered transactions.
  const sortedTransactions = useMemo(() => {
    let sortable = [...filteredTransactions];
    if (sortConfig.key !== null) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // For dates, convert to Date objects.
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

  // Toggle sorting for a given key.
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Return a sort icon based on current sorting.
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  // Reset sorting to original order.
  const resetSorting = () => {
    setSortConfig({ key: null, direction: "ascending" });
  };

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
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option>All time</option>
            <option>This month</option>
            <option>Last 6 months</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <label>Transaction type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option>All types</option>
            <option>Subscription</option>
            <option>Mission</option>
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

      {/* Table Header Row with Reset Icon */}
      <div className={styles.transactionHeader}>
        <span className={styles.sortableHeader} onClick={() => requestSort("date")}>
          Date {getSortIcon("date")}
        </span>
        <span className={styles.sortableHeader} onClick={() => requestSort("type")}>
          Type {getSortIcon("type")}
        </span>
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

      {/* Transactions List */}
      {sortedTransactions && sortedTransactions.length > 0 ? (
        <div className={styles.transactionsList}>
          {sortedTransactions.map((tx) => (
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
