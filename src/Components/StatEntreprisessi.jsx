/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect } from 'react'; 
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
import styles from './StatEntreprisessi.module.css';
import RisingTalent from '../assets/Poduim.svg';
import StatEntreprisessiService from '../services/StatEntreprisessiService';

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function StatEntrepriseSSI() {
  const [earningsPeriod, setEarningsPeriod] = useState('month');
  const [proposalPeriod, setProposalPeriod] = useState('Derniers 7 jours');
  const [profilePeriod, setProfilePeriod] = useState('Derniers 7 jours');
  
  // Etat pour stocker les données dynamiques du graphique "Propositions"
  const [proposalsChartData, setProposalsChartData] = useState(null);
  
  // Etat pour stocker les revenus récupérés dynamiquement
  const [enterpriseEarnings, setEnterpriseEarnings] = useState(null);

  // Récupération de l'identifiant de l'entreprise depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = user?.id || 0;
  console.log("Entreprise ID:", entrepriseId);

  // Déterminer periodDays à partir de la valeur sélectionnée dans le select
  const getPeriodDays = (periodStr) => {
    if (periodStr.includes("7")) return 7;
    if (periodStr.includes("14")) return 14;
    if (periodStr.includes("30")) return 30;
    return 7; // valeur par défaut
  };

  // Appel API pour récupérer les statistiques de l'entreprise
  useEffect(() => {
    const periodDays = getPeriodDays(proposalPeriod);
    StatEntreprisessiService.getEntreprisessiStats(entrepriseId, periodDays)
      .then(data => {
        console.log("Données reçues depuis l'API :", data);
        // Adapter les données reçues pour Chart.js
        const chartData = {
          labels: data.labels,
          datasets: data.datasets.map(ds => ({
            label: ds.label,
            data: ds.data,
            borderColor: '#0C68FF',
            backgroundColor: 'rgba(12,104,255,0.2)',
          }))
        };
        setProposalsChartData(chartData);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des stats de l'entreprise :", error);
      });
  }, [entrepriseId, proposalPeriod]);

  // Appel API pour récupérer les revenus de l'entreprise
  useEffect(() => {
    StatEntreprisessiService.getEnterpriseEarnings(entrepriseId, earningsPeriod)
      .then(data => {
        console.log("Données de revenus reçues :", data);
        // On suppose que data contient le montant en centimes
        setEnterpriseEarnings(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des revenus de l'entreprise :", error);
      });
  }, [entrepriseId, earningsPeriod]);

  // Données statiques pour les vues de profil
  const staticProfileStats = {
    labels: ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04', '2025-03-05'],
    data: [100, 150, 120, 130, 110]
  };

  const profileChartData = {
    labels: staticProfileStats.labels,
    datasets: [
      {
        label: 'Profile Views',
        data: staticProfileStats.data,
        borderColor: '#0C68FF',
        backgroundColor: 'rgba(12,104,255,0.2)'
      }
    ]
  };

  const profileOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Profile Views' } }
    }
  };

  // Données statiques pour le donut chart des revenus
  // Les données du donut ne changent pas ici mais le montant affiché au-dessus est dynamique
  const staticDonutData = {
    labels: ['Frozen Funds', 'Application Fee', 'Amount Received'],
    datasets: [
      {
        data: [50000, 30000, 170000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  // Données statiques pour les meilleurs collaborateurs
  const topCollaborators = [
    {
      name: 'Alice',
      photo: '/path/to/alice.jpg',
      missions: 20,
      jobSuccess: '95%'
    },
    {
      name: 'Bob',
      photo: '/path/to/bob.jpg',
      missions: 15,
      jobSuccess: '90%'
    },
    {
      name: 'Charlie',
      photo: '/path/to/charlie.jpg',
      missions: 18,
      jobSuccess: '92%'
    }
  ];

  // Options pour le graphique des propositions (dynamique)
  const proposalsOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Date' } },
      y: { stacked: true, title: { display: true, text: 'Nombre de propositions' } }
    }
  };

  return (
    <div className={styles.statsContainer}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Statistiques Entreprise SSI
      </motion.h1>
      <motion.p 
        className={styles.subTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Aperçu des propositions, des revenus et des analyses de profil.
      </motion.p>
      <motion.p 
        className={styles.note}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Les statistiques des propositions sont récupérées dynamiquement depuis l'API.
      </motion.p>

      <div className={styles.mainColumns}>
        {/* Colonne de gauche */}
        <div className={styles.leftColumn}>
          {/* Carte : Revenus */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.earningsHeader}>
              <h2 className={styles.cardTitle}>Revenus</h2>
              <div className={styles.earningsPeriodSelect}>
                <select
                  className={styles.select}
                  value={earningsPeriod}
                  onChange={(e) => setEarningsPeriod(e.target.value)}
                >
                  <option value="month">Dernier Mois</option>
                  <option value="year">Dernière Année</option>
                </select>
              </div>
            </div>
            <a href="#transaction-history" className={styles.link}>
              Historique des transactions
            </a>
            <div className={styles.earningsAmount}>
              {enterpriseEarnings !== null 
                ? (enterpriseEarnings / 100).toFixed(2) + " EUR" 
                : "Chargement..."}
            </div>
            <div className={styles.donutChart}>
              <Doughnut data={staticDonutData} options={donutOptions} />
            </div>
          </motion.div>

          {/* Carte : Job Success Score */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.cardTitle}>Job Success Score</h2>
            <p className={styles.cardDescription}>
              Analysez vos performances pour améliorer votre score.
            </p>
            <button className={styles.btn}>Voir les insights</button>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreValue}>88%</span>
              </div>
              <span className={styles.noScoreText}>Bon</span>
            </div>
          </motion.div>

          {/* Carte : Vues de Profil */}
          <motion.div 
            className={styles.profileMetrics}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.profileMetricsTitle}>Vues de Profil</h3>
            <div className={styles.metricsNav}>
              <select
                className={styles.select}
                value={profilePeriod}
                onChange={(e) => setProfilePeriod(e.target.value)}
              >
                <option>Derniers 7 jours</option>
                <option>Derniers 14 jours</option>
                <option>Derniers 30 jours</option>
              </select>
            </div>
            <div className={styles.profileChart}>
              <Bar data={profileChartData} options={profileOptions} />
            </div>
            <a href="/ProfilePage" className={styles.link}>Mon profil</a>
          </motion.div>
        </div>

        {/* Colonne de droite */}
        <div className={styles.rightColumn}>
          {/* Carte : Propositions */}
          <motion.div 
            className={`${styles.card} ${styles.proposalsCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.proposalsHeader}>
              <h2 className={styles.cardTitle}>Propositions</h2>
              <select
                className={styles.select}
                value={proposalPeriod}
                onChange={(e) => setProposalPeriod(e.target.value)}
              >
                <option>Derniers 7 jours</option>
                <option>Derniers 14 jours</option>
                <option>Derniers 30 jours</option>
              </select>
            </div>
            <div className={styles.proposalsChart}>
              { proposalsChartData ? (
                <Bar data={proposalsChartData} options={proposalsOptions} />
              ) : <p>Chargement...</p> }
            </div>
            <a href="/ConsultantPropositions" className={styles.link}>Mes propositions</a>
            <p className={styles.searchJobs}>
              Découvrez de nouvelles opportunités sur notre plateforme.{' '}
              <a href="#search-jobs">Rechercher des jobs</a>
            </p>
          </motion.div>

          {/* Carte : Meilleurs Collaborateurs avec Podium */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.cardTitle}>Meilleurs Collaborateurs</h3>
            <div className={styles.collaboratorsPodium}>
              <img src={RisingTalent} alt="Podium" className={styles.podiumImage} />
              {topCollaborators.map((collab, index) => (
                <div key={index} className={`${styles.collaboratorItem} ${styles[`collaboratorPosition${index + 1}`]}`}>
                  <img src={collab.photo} alt={collab.name} className={styles.collaboratorPhoto} />
                  <div className={styles.collaboratorName}>{collab.name}</div>
                  <div className={styles.collaboratorOverlay}>
                    <div>Missions : {collab.missions}</div>
                    <div>Job Success : {collab.jobSuccess}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StatEntrepriseSSI;