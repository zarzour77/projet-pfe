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
  fetchConnectionStats
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

// Fonction pour générer le range complet de dates (format ISO "YYYY-MM-DD")
const generateDateRange = (filter) => {
  const dates = [];
  const end = new Date(); // aujourd'hui
  let start = new Date();
  if (filter === "lastWeek") {
    start.setDate(end.getDate() - 6); // 7 jours au total
  } else if (filter === "lastMonth") {
    start.setDate(end.getDate() - 29); // 30 jours au total
  }
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().slice(0, 10));
  }
  return dates;
};

function StatAdmin() {
  // États existants
  const [inscriptionsData, setInscriptionsData] = useState({
    labels: [],
    datasets: []
  });
  const [filter, setFilter] = useState("lastWeek");
  const [topTalentsData, setTopTalentsData] = useState({
    labels: [],
    datasets: []
  });
  const [roleDistributionData, setRoleDistributionData] = useState({
    labels: [],
    datasets: []
  });
  const [heatmapData, setHeatmapData] = useState(null);
  const [connectionStatsData, setConnectionStatsData] = useState(null);

  // Animation pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Options du graphique pour les inscriptions
  const inscriptionsOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === "lastWeek" ? "Jour de la semaine" : "Jour du mois"
        }
      },
      y: {
        title: { display: true, text: "Nombre d'inscriptions" },
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          callback: (value) => Number(value).toString()
        }
      }
    }
  };

  // Options pour le graphique des connexions (Périodes de forte activité)
  const connectionStatsOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Heures de la journée" },
        ticks: { autoSkip: false } // Afficher toutes les heures
      },
      y: {
        title: { display: true, text: "Nombre de connexions" },
        beginAtZero: false,
        min: 1,   // Démarre à 1 pour ne pas afficher 0
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Récupération et traitement des données d'inscriptions selon le filtre sélectionné
  useEffect(() => {
    const getData = async () => {
      try {
        const stats = await fetchInscriptions(filter);
        console.log('Statistiques des inscriptions:', stats);

        // Générer le range complet de dates pour la période
        const allDates = generateDateRange(filter);

        // Pour chaque date, récupérer l'objet correspondant (ou créer un objet vide)
        const completeStats = allDates.map(dateStr => {
          const found = stats.find(item => item.date === dateStr);
          return found || {
            date: dateStr,
            consultantCount: 0,
            entrepriseClienteCount: 0,
            entrepriseSsiCount: 0
          };
        });

        const labels = completeStats.map(item => item.date);
        const consultantData = completeStats.map(item => Number(item.consultantCount));
        const entrepriseClienteData = completeStats.map(item => Number(item.entrepriseClienteCount));
        const entrepriseSsiData = completeStats.map(item => Number(item.entrepriseSsiCount));

        setInscriptionsData({
          labels,
          datasets: [
            {
              label: 'Inscriptions Consultant',
              data: consultantData,
              borderColor: '#005293',
              backgroundColor: 'rgba(0,82,147,0.2)',
              fill: true
            },
            {
              label: 'Inscriptions Entreprise Cliente',
              data: entrepriseClienteData,
              borderColor: '#F39C12',
              backgroundColor: 'rgba(243,156,18,0.2)',
              fill: true
            },
            {
              label: 'Inscriptions Entreprise SSI',
              data: entrepriseSsiData,
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46,204,113,0.2)',
              fill: true
            }
          ]
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données d’inscriptions:', error);
      }
    };

    getData();
  }, [filter]);

  // Récupération des données Top Talents depuis l'API via le service
  useEffect(() => {
    const getTopTalentsData = async () => {
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
        console.error("Erreur lors de la récupération des données Top Talents:", error);
      }
    };
    getTopTalentsData();
  }, []);

  // Récupération des statistiques des rôles depuis l'API via le service
  useEffect(() => {
    const getUserRoleStats = async () => {
      try {
        const data = await fetchUserRoleStats();
        console.log('Statistiques des rôles:', data);
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
    };
    getUserRoleStats();
  }, []);

  // Récupération des données de la heatmap via fetchCountryStats
  useEffect(() => {
    const getHeatmapData = async () => {
      try {
        const data = await fetchCountryStats();
        console.log('Statistiques géographiques:', data);
        // On suppose que data est un objet { "Pays1": nombre, "Pays2": nombre, ... }
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
        console.error("Erreur lors de la récupération des données de la heatmap:", error);
      }
    };
    getHeatmapData();
  }, []);

  // Récupération des statistiques de connexions via fetchConnectionStats
  useEffect(() => {
    const getConnectionStats = async () => {
      try {
        const data = await fetchConnectionStats();
        console.log('Statistiques de connexions:', data);
        // data est un objet où chaque clé représente une heure ("00", "01", … "23")
        // et la valeur correspondante est le nombre de connexions.
        const labels = Object.keys(data);
        const counts = Object.values(data);
        const backgroundColors = labels.map(label => {
          const count = data[label];
          if (count > 5) return '#FF4500'; // Rouge pour forte activité
          if (count > 2) return '#FFA500'; // Orange
          return '#2ecc71'; // Vert pour faible activité
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
        console.error("Erreur lors de la récupération des statistiques de connexions:", error);
      }
    };
    getConnectionStats();
  }, []);

  // Données statiques pour les transactions et revenus (exemple)
  const transactionsData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [
      {
        label: 'Volume des transactions',
        data: [150, 200, 170, 220],
        backgroundColor: '#2ecc71',
        borderColor: '#2ecc71',
        borderWidth: 1
      }
    ]
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Revenus générés',
        data: [5000, 7000, 6500, 8000, 7500, 9000],
        backgroundColor: '#005293',
        borderColor: '#005293',
        borderWidth: 1
      }
    ]
  };

  const revenueDistributionData = {
    labels: ['Abonnements', 'Commissions', 'Services premium'],
    datasets: [
      {
        label: 'Répartition des revenus',
        data: [50, 30, 20],
        backgroundColor: ['#005293', '#F39C12', '#2ecc71'],
        borderColor: ['#005293', '#F39C12', '#2ecc71'],
        borderWidth: 1
      }
    ]
  };

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

      {/* Carte Inscriptions avec filtre */}
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
              <Bar data={transactionsData} />
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
            <h3 className={styles.cardTitle}>Revenus générés</h3>
            <Line data={revenueData} />
          </motion.div>
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.cardTitle}>Répartition des revenus</h3>
            <div className={styles.smallPie}>
              <Pie data={revenueDistributionData} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Engagement avec deux cartes côte à côte */}
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
          {/* Carte Gauche : Périodes de forte activité (statistiques de connexion) */}
          <div className={styles.column}>
            <motion.div 
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              animate={{ opacity: 1, y: 0 }}
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
          {/* Carte Droite : Heatmap de l'activité (statistiques géographiques) */}
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
