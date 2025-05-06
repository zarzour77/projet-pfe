/* eslint-disable react/no-unescaped-entities */
// File: StatAdmin.js
import React, { useState, useEffect } from 'react';  
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './StatAdmin.module.css';
import { 
  fetchInscriptions, 
  fetchTopTalents, 
  fetchUserRoleStats, 
  fetchCountryStats,
  fetchConnectionStats,
  fetchTransactionsVolume,
  fetchGlobalApplicationFeeStats,  // Pour "Revenus générés par l'admin"
  fetchRevenueDistribution         // Pour "Répartition des revenus"
} from '../services/StatAdminService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Fonction pour générer un range de dates (pour les inscriptions)
const generateDateRange = (filter) => {
  const dates = [];
  const end = new Date();
  let start = new Date();
  if (filter === "lastWeek") {
    start.setDate(end.getDate() - 6);
  } else if (filter === "lastMonth") {
    start.setDate(end.getDate() - 29);
  }
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().slice(0, 10));
  }
  return dates;
};

function StatAdmin() {
  // États pour les différentes sections
  const [inscriptionsData, setInscriptionsData] = useState({ labels: [], datasets: [] });
  const [filter, setFilter] = useState("lastWeek");
  const [topTalentsData, setTopTalentsData] = useState({ labels: [], datasets: [] });
  const [roleDistributionData, setRoleDistributionData] = useState({ labels: [], datasets: [] });
  const [heatmapData, setHeatmapData] = useState(null);
  const [connectionStatsData, setConnectionStatsData] = useState(null);
  const [transactionsVolumeData, setTransactionsVolumeData] = useState({ labels: [], datasets: [] });
  
  // États pour les revenus
  const [revenuePeriod, setRevenuePeriod] = useState("6months");
  const [feeStats, setFeeStats] = useState(null); // Revenus générés par l'admin
  const [revenueDistributionData, setRevenueDistributionData] = useState({ labels: [], datasets: [] }); // Répartition des revenus

  // Animation pour les cartes
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // Options pour le graphique des inscriptions
  const inscriptionsOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { title: { display: true, text: filter === "lastWeek" ? "Jour de la semaine" : "Jour du mois" } },
      y: { title: { display: true, text: "Nombre d'inscriptions" }, beginAtZero: true, ticks: { precision: 0, stepSize: 1 } }
    }
  };

  // Options pour le graphique des connexions
  const connectionStatsOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { title: { display: true, text: "Heures de la journée" }, ticks: { autoSkip: false } },
      y: { title: { display: true, text: "Nombre de connexions" }, beginAtZero: false, min: 1, ticks: { stepSize: 1 } }
    }
  };

  // Options pour le graphique des revenus (Line Chart)
  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { callbacks: { label: (context) => (context.raw || 0).toFixed(2) + "€" } }
    },
    scales: { x: { title: { display: true, text: "Mois" } }, y: { title: { display: true, text: "Montant en €" }, beginAtZero: true } }
  };

  // Options pour le graphique Pie (Répartition des revenus)
  const revenueDistributionOptions = { responsive: true, plugins: { legend: { position: "bottom" } } };

  // UseEffect pour les inscriptions
  useEffect(() => {
    async function getData() {
      try {
        const stats = await fetchInscriptions(filter);
        const allDates = generateDateRange(filter);
        const completeStats = allDates.map(dateStr => {
          const found = stats.find(item => item.date === dateStr);
          return found || { date: dateStr, consultantCount: 0, entrepriseClienteCount: 0, entrepriseSsiCount: 0 };
        });
        setInscriptionsData({
          labels: completeStats.map(item => item.date),
          datasets: [
            {
              label: 'Inscriptions Consultant',
              data: completeStats.map(item => Number(item.consultantCount)),
              borderColor: '#005293',
              backgroundColor: 'rgba(0,82,147,0.2)',
              fill: true
            },
            {
              label: 'Inscriptions Entreprise Cliente',
              data: completeStats.map(item => Number(item.entrepriseClienteCount)),
              borderColor: '#F39C12',
              backgroundColor: 'rgba(243,156,18,0.2)',
              fill: true
            },
            {
              label: 'Inscriptions Entreprise SSI',
              data: completeStats.map(item => Number(item.entrepriseSsiCount)),
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46,204,113,0.2)',
              fill: true
            }
          ]
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions:', error);
      }
    }
    getData();
  }, [filter]);

  // UseEffect pour les Top Talents
  useEffect(() => {
    async function getTopTalentsData() {
      try {
        const data = await fetchTopTalents();
        const labels = Object.keys(data);
        const counts = Object.values(data);
        setTopTalentsData({
          labels,
          datasets: [
            {
              label: 'Missions réalisées',
              data: counts,
              backgroundColor: ['#F39C12', '#FF8C00', '#FF4500', '#008000'],
              borderColor: ['#F39C12', '#FF8C00', '#FF4500', '#008000'],
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des Top Talents:", error);
      }
    }
    getTopTalentsData();
  }, []);

  // UseEffect pour les statistiques des rôles
  useEffect(() => {
    async function getUserRoleStats() {
      try {
        const data = await fetchUserRoleStats();
        const labels = Object.keys(data);
        const counts = Object.values(data);
        setRoleDistributionData({
          labels,
          datasets: [
            {
              label: 'Répartition par rôle',
              data: counts,
              backgroundColor: ['#005293', '#F39C12', '#FF0000'],
              borderColor: ['#005293', '#F39C12', '#FF0000'],
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques des rôles:", error);
      }
    }
    getUserRoleStats();
  }, []);

  // UseEffect pour la heatmap
  useEffect(() => {
    async function getHeatmapData() {
      try {
        const data = await fetchCountryStats();
        const labels = Object.keys(data);
        const counts = Object.values(data);
        setHeatmapData({
          labels,
          datasets: [
            {
              label: "Activité par pays",
              data: counts,
              backgroundColor: '#F39C12'
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de la heatmap:", error);
      }
    }
    getHeatmapData();
  }, []);

  // UseEffect pour les statistiques de connexions
  useEffect(() => {
    async function getConnectionStats() {
      try {
        const data = await fetchConnectionStats();
        const labels = Object.keys(data);
        const counts = Object.values(data);
        const backgroundColors = labels.map(label => {
          const count = data[label];
          if (count > 5) return '#FF4500';
          if (count > 2) return '#FFA500';
          return '#2ecc71';
        });
        setConnectionStatsData({
          labels,
          datasets: [
            {
              label: "Connexions par heure",
              data: counts,
              backgroundColor: backgroundColors
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des connexions:", error);
      }
    }
    getConnectionStats();
  }, []);

  // UseEffect pour le volume des transactions
  useEffect(() => {
    async function getTransactionsVolume() {
      try {
        const data = await fetchTransactionsVolume("month");
        const coloredDatasets = data.datasets.map(ds => ({
          ...ds,
          backgroundColor: ds.data.map(() => "#36A2EB")
        }));
        setTransactionsVolumeData({
          labels: data.labels,
          datasets: coloredDatasets
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du volume des transactions:", error);
      }
    }
    getTransactionsVolume();
  }, []);

  // UseEffect pour les revenus générés par l'admin (utilisation de fetchGlobalApplicationFeeStats)
  useEffect(() => {
    async function getGlobalRevenue() {
      try {
        const data = await fetchGlobalApplicationFeeStats(revenuePeriod);
        // Conversion des montants de centimes en euros pour chaque série
        const feeDataEuro = data.applicationFee.map(value => value / 100);
        const subscriptionDataEuro = data.subscription.map(value => value / 100);
        
        // Création des deux séries pour le Line Chart
        const datasets = [
          {
            label: "Application Fee (en €)",
            data: feeDataEuro,
            borderColor: "#F39C12", // orange
            backgroundColor: "rgba(243,156,18,0.2)",
            fill: false,
          },
          {
            label: "Abonnements (en €)",
            data: subscriptionDataEuro,
            borderColor: "#005293", // bleu
            backgroundColor: "rgba(0,82,147,0.2)",
            fill: false,
          }
        ];
        
        setFeeStats({
          labels: data.labels,
          datasets,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des revenus globaux :", error);
      }
    }
    getGlobalRevenue();
  }, [revenuePeriod]);

  // UseEffect pour la répartition des revenus (utilise son API dédiée)
  useEffect(() => {
    async function getRevenueDistributionData() {
      try {
        const data = await fetchRevenueDistribution();
        // Conversion des montants de centimes en euros
        const subscriptionEuro = data.subscriptionRevenue / 100;
        const commissionEuro = data.commissionRevenue / 100;
        setRevenueDistributionData({
          labels: ['Abonnements', 'Commissions'],
          datasets: [
            {
              label: 'Répartition des revenus',
              data: [subscriptionEuro, commissionEuro],
              backgroundColor: ['#005293', '#F39C12'],
              borderColor: ['#005293', '#F39C12'],
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de la répartition des revenus:", error);
      }
    }
    getRevenueDistributionData();
  }, []);

  return (
    <div className={styles.statsContainer}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Admin
      </motion.h1>
      <motion.p 
        className={styles.subTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Visualisez les statistiques clés de la plateforme.
      </motion.p>

      {/* Section Inscriptions */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Statistiques des utilisateurs
        </motion.h2>
        <div className={styles.cardContainer}>
          <motion.div 
            className={`${styles.card} ${styles.smallCard}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Inscriptions</h3>
              <div className={styles.selectContainer}>
                <select 
                  className={styles.select}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="lastWeek">Dernière semaine</option>
                  <option value="lastMonth">Dernier mois</option>
                </select>
              </div>
            </div>
            <Line data={inscriptionsData} options={inscriptionsOptions} />
          </motion.div>
          <motion.div 
            className={`${styles.card} ${styles.smallCard}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.cardTitle}>Répartition par Rôle</h3>
            <div className={styles.smallPie}>
              <Pie data={roleDistributionData} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Transactions & Performance */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Suivi des transactions et Performance des talents
        </motion.h2>
        <div className={styles.dualColumn}>
          <div className={styles.column}>
            <motion.div 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={styles.cardTitle}>Volume des transactions</h3>
              <Bar data={transactionsVolumeData} />
            </motion.div>
          </div>
          <div className={styles.column}>
            <motion.div 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={styles.cardTitle}>Top Talents</h3>
              <Bar data={topTalentsData} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section Revenus */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Indicateurs financiers et revenus
        </motion.h2>
        <div className={styles.cardContainer}>
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Carte "Revenus générés par l'admin" utilisant fetchGlobalApplicationFeeStats */}
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Revenus générés par l'admin</h3>
              <div className={styles.periodSelect}>
                <select
                  className={styles.select}
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value)}
                >
                  <option value="6months">Derniers 6 mois</option>
                  <option value="year">Dernière année</option>
                </select>
              </div>
            </div>
            {feeStats ? (
              <Line data={feeStats} options={revenueOptions} />
            ) : (
              <p>Chargement des revenus...</p>
            )}
          </motion.div>
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Carte Répartition des revenus utilisant son API dédiée */}
            <h3 className={styles.cardTitle}>Répartition des revenus</h3>
            <div className={styles.smallPie}>
              <Pie data={revenueDistributionData} options={revenueDistributionOptions} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Engagement */}
      <div className={styles.section}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Engagement et activité sur la plateforme
        </motion.h2>
        <div className={styles.dualColumn}>
          <div className={styles.column}>
            <motion.div 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={styles.cardTitle}>Périodes de forte activité</h3>
              <div className={styles.heatmap} style={{ height: '400px' }}>
                {connectionStatsData ? (
                  <Bar data={connectionStatsData} options={connectionStatsOptions} />
                ) : (
                  <p>Chargement des connexions...</p>
                )}
              </div>
            </motion.div>
          </div>
          <div className={styles.column}>
            <motion.div 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={styles.cardTitle}>Heatmap de l'activité</h3>
              <div className={styles.heatmap} style={{ height: '400px' }}>
                {heatmapData ? (
                  <Bar data={heatmapData} />
                ) : (
                  <p>Chargement de la heatmap...</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatAdmin;