import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import StatEntrepriseService from '../services/StatEntrepriseService';
import styles from './StatEntreprise.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatEntreprise() {
  // Données statiques pour d'autres cartes
  const expenseData = "€15,000";
  const performanceScore = "88%";

  // Récupération de l'ID de l'entreprise
  const user = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = user?.id || 0;

  // États pour les périodes et les données du graphique des missions agrégées
  const [period, setPeriod] = useState("week");
  const [aggregatedData, setAggregatedData] = useState({
    labels: [],
    datasets: []
  });

  // État pour la période des profile views
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Chargement des missions agrégées (existant)
  useEffect(() => {
    async function fetchAggregatedMissions() {
      try {
        const data = await StatEntrepriseService.getAggregatedMissions(entrepriseId, period);
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
  }, [entrepriseId, period]);

  // Mappez la sélection de la période en nombre de jours
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
        // Supposons que l'API renvoie un objet avec 'labels' et 'data'
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
            <h2 className={styles.cardTitle}>Dépenses</h2>
            <a href="#expense-history" className={styles.link}>
              Historique des dépenses
            </a>
            <div className={styles.earningsAmount}>{expenseData}</div>
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
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">Dernier mois (4 semaines)</option>
                <option value="month">Derniers 4 mois</option>
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
