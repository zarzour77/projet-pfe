/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './StatEntreprisessi.module.css';
import RisingTalent from '../assets/Poduim.svg';
import StatEntreprisessiService from '../services/StatEntreprisessiService';
import ConsultantService from '../Services/ConsultantService';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StatEntrepriseSSI() {
  const [earningsPeriod, setEarningsPeriod] = useState('month');
  const [proposalPeriod, setProposalPeriod] = useState('Derniers 7 jours');
  const [profilePeriod, setProfilePeriod] = useState('Derniers 7 jours');
  
  // État pour le score moyen de Job Success
  const [jobSuccessAverage, setJobSuccessAverage] = useState(null);
  
  // États pour les graphiques et le podium
  const [proposalsChartData, setProposalsChartData] = useState(null);
  const [enterpriseEarnings, setEnterpriseEarnings] = useState(null);
  const [collaboratorStatsData, setCollaboratorStatsData] = useState(null);
  const [topCollaborators, setTopCollaborators] = useState([]);

  // Récupération de l'ID de l'entreprise depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const entrepriseId = user?.id || 0;
  console.log("Entreprise ID:", entrepriseId);

  // Utilitaire pour déterminer le nombre de jours en fonction de la période sélectionnée
  const getPeriodDays = (periodStr) => {
    if (periodStr.includes("7")) return 7;
    if (periodStr.includes("14")) return 14;
    if (periodStr.includes("30")) return 30;
    return 7;
  };

  // 1. Récupération des statistiques de propositions
  useEffect(() => {
    const periodDays = getPeriodDays(proposalPeriod);
    StatEntreprisessiService.getEntreprisessiStats(entrepriseId, periodDays)
      .then(data => {
        console.log("Données de propositions reçues :", data);
        const statusDesignMapping = {
          sent:       { label: "Proposals sent", borderColor: "#0C68FF", backgroundColor: "rgba(12,104,255,0.2)" },
          invited:    { label: "Invited",       borderColor: "#FFA500", backgroundColor: "rgba(255,165,0,0.2)" },
          inprogress: { label: "In Progress",   borderColor: "#2ecc71", backgroundColor: "rgba(46,204,113,0.2)" },
          terminated: { label: "Terminated",    borderColor: "#FF0000", backgroundColor: "rgba(255,0,0,0.2)" },
          refused:    { label: "Refused",       borderColor: "#8e44ad", backgroundColor: "rgba(142,68,173,0.2)" }
        };

        const filteredDatasets = data.datasets.filter(ds => ds.label.toLowerCase() !== "invited");
        const chartData = {
          labels: data.labels,
          datasets: filteredDatasets.map(ds => {
            const design = statusDesignMapping[ds.label.toLowerCase()] || { 
              label: ds.label,
              borderColor: '#0C68FF',
              backgroundColor: 'rgba(12,104,255,0.2)'
            };
            return {
              label: design.label,
              data: ds.data,
              borderColor: design.borderColor,
              backgroundColor: design.backgroundColor,
            };
          })
        };
        setProposalsChartData(chartData);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des stats de l'entreprise :", error);
      });
  }, [entrepriseId, proposalPeriod]);

  // 2. Récupération des revenus
  useEffect(() => {
    StatEntreprisessiService.getEnterpriseEarnings(entrepriseId, earningsPeriod)
      .then(data => {
        console.log("Données de revenus reçues :", data);
        setEnterpriseEarnings(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des revenus de l'entreprise :", error);
      });
  }, [entrepriseId, earningsPeriod]);

  // 3. Données statiques pour les vues de profil
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

  // 4. Récupération des statistiques des consultants
  useEffect(() => {
    StatEntreprisessiService.getConsultantsStats(entrepriseId, 'month')
      .then(stats => {
        console.log("Données des stats consultants :", stats);
        const labels = stats.map(item => item.consultantName);
        const missions = stats.map(item => item.missionCount);
        const revenues = stats.map(item => item.revenue);
        const jobSuccess = stats.map(item => item.jobSuccess === 0 ? null : item.jobSuccess);

        const chartData = {
          labels,
          datasets: [
            {
              label: "Missions",
              data: missions,
              backgroundColor: "#0C68FF",
              xAxisID: 'x'
            },
            {
              label: "Revenu (EUR)",
              data: revenues,
              backgroundColor: "#2ecc71",
              xAxisID: 'x1'
            },
            {
              label: "Job Success (%)",
              data: jobSuccess,
              backgroundColor: "#FFCE56",
              xAxisID: 'x'
            }
          ]
        };
        setCollaboratorStatsData(chartData);

        const consultantsWithScore = stats.map(item => {
          const score = (item.missionCount * 10) + (item.jobSuccess || 0) + ((item.revenue || 0) / 1000);
          return { ...item, score };
        });
        const sorted = consultantsWithScore.sort((a, b) => b.score - a.score);
        const topThree = sorted.slice(0, 3);
        setTopCollaborators(topThree);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des stats consultants :", error);
      });
  }, [entrepriseId]);

  // 5. Mise à jour des Top Collaborateurs avec leur profil complet
  useEffect(() => {
    if (topCollaborators.length > 0) {
      Promise.all(
        topCollaborators.map(collab =>
          ConsultantService.getConsultantById(collab.id)
            .then(userData => ({ ...collab, photo: userData.photoprofile }))
            .catch(error => {
              console.error("Erreur pour consultant id", collab.id, error);
              return collab;
            })
        )
      )
      .then(updatedCollaborators => {
        updatedCollaborators.forEach(collab => {
          console.log(`Consultant: ${collab.consultantName}, Photo: ${collab.photo}`);
        });
        setTopCollaborators(updatedCollaborators);
      });
    }
  }, [topCollaborators.length]);

  // 6. Récupération de la moyenne du jobSuccess via l'API
  useEffect(() => {
    StatEntreprisessiService.getJobSuccessAverage(entrepriseId)
      .then(average => {
        console.log("Moyenne jobSuccess :", average);
        setJobSuccessAverage(average);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du jobSuccess average :", error);
      });
  }, [entrepriseId]);

  // Fonction pour déterminer la note en français selon la moyenne
  const getJobSuccessRating = (score) => {
    if (score === null) return "";
    if (score < 40) return "Mauvais";
    if (score < 70) return "Pas mal";
    return "Bon";
  };

  // Options du graphique Propositions
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

  // Options du graphique Collaborateurs
  const collaboratorStatsOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Valeur' }
      },
      x1: {
        type: 'linear',
        position: 'top',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Revenu (EUR)' }
      },
      y: {
        title: { display: true, text: 'Consultants' },
        type: 'category'
      }
    },
    plugins: {
      legend: { position: 'bottom' }
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
        {/* COLONNE DE GAUCHE */}
        <div className={styles.leftColumn}>
          {/* Conteneur pour Revenus et Job Success */}
          <div className={styles.doubleCardContainer}>
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
            </motion.div>

            {/* Carte : Job Success Score avec cercle de progress et score affiché à l'extérieur */}
            <motion.div 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className={styles.cardTitle}>Job Success Score</h2>
              <div className={styles.scoreContainer}>
                {/* Cercle de progression */}
                <div 
                  className={styles.scoreCircle} 
                  style={{
                    background: jobSuccessAverage !== null 
                      ? `conic-gradient(#31BF0D ${jobSuccessAverage * 3.6}deg, #e1e8ed ${jobSuccessAverage * 3.6}deg 360deg)` 
                      : "#e1e8ed"
                  }}
                ></div>
                {/* Affichage du score à l'extérieur du cercle */}
                <div className={styles.scoreTextOutside}>
                  <div className={styles.scoreValue}>
                    {jobSuccessAverage !== null 
                      ? `${jobSuccessAverage.toFixed(0)}%`
                      : "0%"}
                  </div>
                  <div className={styles.scoreRating}>
                    {jobSuccessAverage !== null ? getJobSuccessRating(jobSuccessAverage) : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Carte : Statistiques par Collaborateur */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.cardTitle}>Statistiques par Collaborateur</h3>
            <div className={styles.collaboratorStatsChart}>
              { collaboratorStatsData ? (
                <Bar data={collaboratorStatsData} options={collaboratorStatsOptions} />
              ) : <p>Chargement des stats consultants...</p> }
            </div>
          </motion.div>
        </div>

        {/* COLONNE DE DROITE */}
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

          {/* Carte : Meilleurs Collaborateurs */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={styles.cardTitle}>Meilleurs Collaborateurs</h3>
            <div className={styles.collaboratorsPodium}>
              <img src={RisingTalent} alt="Podium" className={styles.podiumImage} />
              {topCollaborators.map((collab, index) => {
                let photoUrl = '/default-photo.jpg';
                if (collab.photo) {
                  photoUrl = collab.photo;
                }
                return (
                  <div
                    key={index}
                    className={`${styles.collaboratorItem} ${styles[`collaboratorPosition${index + 1}`]}`}
                  >
                    <img
                      src={photoUrl}
                      alt={collab.consultantName}
                      className={styles.collaboratorPhoto}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Carte : Vues de Profil */}
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
      </div>
    </div>
  );
}

export default StatEntrepriseSSI;