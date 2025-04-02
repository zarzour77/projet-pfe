import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import StatEntrepriseService from '../services/StatEntrepriseService';
import styles from './StatEntreprise.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function StatEntreprise() {
  // Données statiques pour d'autres cartes
  const performanceScore = "88%";

  // Récupération de l'ID de l'entreprise
  const user = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = user?.id || 0;

  // États pour le donut chart des dépenses et son sélecteur (donutPeriod)
  const [donutPeriod, setDonutPeriod] = useState("month"); // "month" ou "year"
  const [donutExpenseData, setDonutExpenseData] = useState(null);
  // Total des dépenses calculé à partir des données du donut (en centimes)
  const [totalExpense, setTotalExpense] = useState(null);

  // États pour le graphique des missions agrégées (Statut des projets)
  const [projectsPeriod, setProjectsPeriod] = useState("month"); // On ajoute la valeur "day"
  const [aggregatedData, setAggregatedData] = useState({
    labels: [],
    datasets: []
  });

  // États pour la période des profile views
  const [profilePeriod, setProfilePeriod] = useState("Last 7 days");
  const [profileChartData, setProfileChartData] = useState({
    labels: [],
    datasets: []
  });

  // Options pour le graphique des missions agrégées
  const projectChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'Périodes' } },
      y: { title: { display: true, text: 'Nombre de missions' }, beginAtZero: true }
    }
  };

  // Options pour le graphique des profile views
  const profileOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Vues du profil' } }
    }
  };

  // Options pour le donut chart des dépenses avec tooltip formaté
  const donutExpenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return (value / 100).toFixed(2) + "€";
          }
        }
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Chargement dynamique des données du donut chart pour les dépenses via l'API
  useEffect(() => {
    async function fetchDonutExpenseData() {
      try {
        const data = await StatEntrepriseService.getDonutExpenseData(entrepriseId, donutPeriod);
        // La réponse doit contenir firstSlice, finalPayment et frozenFunds (en centimes)
        const firstSlice = data.firstSlice || 0;
        const finalPayment = data.finalPayment || 0;
        const frozenFunds = data.frozenFunds || 0;
        setDonutExpenseData({
          labels: ["Première tranche de mission", "Deuxième tranche de mission", "Fonds gelés"],
          datasets: [
            {
              data: [firstSlice, finalPayment, frozenFunds],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
          ]
        });
        // Calcul du total des dépenses en centimes
        setTotalExpense(firstSlice + finalPayment + frozenFunds);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du donut chart des dépenses :", error);
      }
    }
    if (entrepriseId) {
      fetchDonutExpenseData();
    }
  }, [entrepriseId, donutPeriod]);

  // Chargement des missions agrégées pour "Statut des projets"
  useEffect(() => {
    async function fetchAggregatedMissions() {
      try {
        const data = await StatEntrepriseService.getAggregatedMissions(entrepriseId, projectsPeriod);
        // Forcer des couleurs pour chaque dataset
        const forcedDatasets = data.datasets.map((dataset, index) => {
          const borderColors = ["#0C68FF", "#F39C12", "#2ecc71", "#FF0000"];
          const backgroundColors = [
            "rgba(12,104,255,0.2)",
            "rgba(243,156,18,0.2)",
            "rgba(46,204,113,0.2)",
            "rgba(255,0,0,0.2)"
          ];
          return {
            ...dataset,
            borderColor: borderColors[index] || "#000",
            backgroundColor: backgroundColors[index] || "rgba(0,0,0,0.1)"
          };
        });
        setAggregatedData({
          labels: data.labels,
          datasets: forcedDatasets
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des missions agrégées :", error);
      }
    }
    if (entrepriseId) {
      fetchAggregatedMissions();
    }
  }, [entrepriseId, projectsPeriod]);

  // Mappez la sélection de la période en nombre de jours pour les profile views
  const getPeriodDays = (period) => {
    switch (period) {
      case "Last 7 days":
        return 7;
      case "Last 14 days":
        return 14;
      case "Last 30 days":
        return 30;
      default:
        return 7;
    }
  };

  // Chargement des données pour les profile views
  useEffect(() => {
    async function fetchProfileViews() {
      try {
        const periodDays = getPeriodDays(profilePeriod);
        const data = await StatEntrepriseService.getProfileViews(entrepriseId, periodDays);
        setProfileChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Profile Views',
              data: data.data,
              borderColor: '#0C68FF',
              backgroundColor: 'rgba(12,104,255,0.2)'
            }
          ]
        });
      } catch (error) {
        console.error("Erreur lors du chargement des profile views :", error);
      }
    }
    if (entrepriseId) {
      fetchProfileViews();
    }
  }, [entrepriseId, profilePeriod]);

  return (
    <div className={styles.statsContainer}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Entreprise
      </motion.h1>
      <motion.p 
        className={styles.subTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Visualisez les dépenses, le statut des projets et les alertes de risques.
      </motion.p>
      <motion.p 
        className={styles.note}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Données dynamiques récupérées depuis l'API.
      </motion.p>

      <div className={styles.mainColumns}>
        {/* Colonne de gauche (cartes statiques) */}
        <div className={styles.leftColumn}>
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header avec titre et sélecteur indépendant en haut à droite */}
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Dépenses</h2>
              <div className={styles.periodSelect}>
                <select
                  className={styles.select}
                  value={donutPeriod}
                  onChange={(e) => setDonutPeriod(e.target.value)}
                >
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <a href="#expense-history" className={styles.link}>
              Historique des dépenses
            </a>
            {/* Affichage du total des dépenses converti en euros */}
            <div className={styles.earningsAmount}>
              {totalExpense !== null ? (totalExpense / 100).toFixed(2) + "€" : "Loading..."}
            </div>
            {/* Donut chart dynamique pour les dépenses */}
            <div className={styles.donutChart}>
              {donutExpenseData ? (
                <Doughnut data={donutExpenseData} options={donutExpenseOptions} />
              ) : (
                <p>Loading donut chart...</p>
              )}
            </div>
          </motion.div>

          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.cardTitle}>Performance Score</h2>
            <p className={styles.cardDescription}>
              Analysez la performance globale de l'entreprise.
            </p>
            <button className={styles.btn}>Voir les insights</button>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreValue}>{performanceScore}</span>
              </div>
              <span className={styles.noScoreText}>Bon</span>
            </div>
          </motion.div>

          {/* Section Profile Views */}
          <motion.div 
            className={styles.profileMetrics}
            variants={cardVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.profileMetricsTitle}>Profile Views</h3>
            <div className={styles.metricsNav}>
              <select
                className={styles.select}
                value={profilePeriod}
                onChange={(e) => setProfilePeriod(e.target.value)}
              >
                <option>Last 7 days</option>
                <option>Last 14 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className={styles.profileChart}>
              <Bar data={profileChartData} options={profileOptions} />
            </div>
            <a href="/ProfilePage" className={styles.link}>My profile</a>
          </motion.div>
        </div>

        {/* Colonne de droite */}
        <div className={styles.rightColumn}>
          <motion.div 
            className={`${styles.card} ${styles.proposalsCard}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.proposalsHeader}>
              <h2 className={styles.cardTitle}>Statut des projets</h2>
              <select 
                className={styles.select} 
                value={projectsPeriod}
                onChange={(e) => setProjectsPeriod(e.target.value)}
              >
                <option value="day">Ce Mois (par jour)</option>
                <option value="week">Dernier mois (par semaine)</option>
                <option value="month">Derniers 4 mois</option>
                <option value="year">Dernière année</option>

              </select>
            </div>
            <div className={styles.proposalsChart}>
              <Bar data={aggregatedData} options={projectChartOptions} />
            </div>
            <a href="#project-details" className={styles.link}>Détails des projets</a>
          </motion.div>

          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.clientRelTitle}>Relations clients</h3>
            <p className={styles.clientRelDescription}>
              Des relations clients solides pour renforcer la croissance.
            </p>
            <div className={styles.clientRelCircle}>
              <span className={styles.clientRelValue}>85%</span>
            </div>
            <div className={styles.clientRelLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#0C68FF' }} />
                <span>Clients actifs</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#00C4CC' }} />
                <span>Prospects</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StatEntreprise;
