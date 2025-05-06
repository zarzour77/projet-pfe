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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from './StatConsultant.module.css';
import StatConsultantService from '../services/StatConsultantService';
import ProfileViewService from '../Services/ProfileViewService';
import ConsultantService from '../Services/ConsultantService';

// Import des icônes pour les badges
import RisingTalent from '../assets/icons/RisingTalent.svg';
import TopViewed from '../assets/icons/TopViewed.svg';
import ExcellentCommunicator from '../assets/icons/ExcellentCommunicator.svg';
import TopRated from '../assets/icons/TopRated.svg';
import TopRatedPlus from '../assets/icons/TopRatedPlus.svg';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function StatConsultant() {
  // États généraux
  const [proposalPeriod, setProposalPeriod] = useState('Last 7 days');
  const [proposalsStats, setProposalsStats] = useState(null);
  const [profilePeriod, setProfilePeriod] = useState('Last 7 days');
  const [profileStats, setProfileStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [earningsPeriod, setEarningsPeriod] = useState('month');
  const [donutData, setDonutData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(0);
  const [consultantData, setConsultantData] = useState(null);
  const [conversationCount, setConversationCount] = useState(0);

  // Récupération des informations de l'utilisateur stockées en local
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const consultantId = storedUser?.user?.id || storedUser?.id;
  const token = storedUser?.token;

  // Extraction des méthodes du service StatConsultantService
  const { getConsultantStats, getConsultantEarnings, updateBadge, getConversationCount } = StatConsultantService;

  // 1. Récupération des statistiques des propositions
  useEffect(() => {
    if (consultantId) {
      const periodDays = proposalPeriod === 'Last 7 days' ? 7 : proposalPeriod === 'Last 14 days' ? 14 : 30;
      getConsultantStats(consultantId, periodDays)
        .then(data => setProposalsStats(data))
        .catch(error => console.error("Erreur lors de la récupération des stats :", error));
    }
  }, [consultantId, proposalPeriod, getConsultantStats]);

  // 2. Récupération des statistiques des vues de profil
  useEffect(() => {
    if (consultantId) {
      const periodDays = profilePeriod === 'Last 7 days' ? 7 : profilePeriod === 'Last 14 days' ? 14 : 30;
      ProfileViewService.getProfileViews(consultantId, periodDays)
        .then(data => setProfileStats(data))
        .catch(error => console.error("Erreur lors de la récupération des profile views :", error));
    }
  }, [consultantId, profilePeriod]);

  // 3. Récupération des données complètes du consultant via l’API
  useEffect(() => {
    if (consultantId) {
      ConsultantService.getConsultantById(consultantId)
        .then(data => setConsultantData(data))
        .catch(err => console.error("Erreur lors de la récupération du consultant :", err));
    }
  }, [consultantId]);

  // 4. Récupération du nombre de conversations
  useEffect(() => {
    if (consultantId) {
      getConversationCount(consultantId)
        .then(response => setConversationCount(response.count))
        .catch(error => console.error("Erreur lors de la récupération du nombre de conversations :", error));
    }
  }, [consultantId, getConversationCount]);

  // 5. Récupération des earnings selon la période choisie
  useEffect(() => {
    if (consultantId) {
      getConsultantEarnings(consultantId, earningsPeriod)
        .then(data => setEarnings(data))
        .catch(error => console.error("Erreur lors de la récupération des earnings :", error));
    }
  }, [consultantId, earningsPeriod, getConsultantEarnings]);

  // 6. Récupération des données du donut chart via l’API payments
  useEffect(() => {
    if (consultantId) {
      axios.get(`http://localhost:8081/api/payments/donut/${consultantId}?period=${earningsPeriod}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
         const data = response.data;
         const frozenFunds = Number(data.frozenFunds);
         const applicationFee = Number(data.applicationFee);
         const amountReceived = Number(data.amountReceived);
         setDonutData({
           labels: ["Frozen Funds", "Application Fee", "Amount Received"],
           datasets: [
             {
               data: [frozenFunds, applicationFee, amountReceived],
               backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
             }
           ]
         });
      })
      .catch(error => console.error("Erreur lors de la récupération du donut chart :", error));
    }
  }, [consultantId, earningsPeriod, token]);

  // Options pour le donut chart
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };



  const handleEarnBadge = async () => {
    try {
      // Tableau simplifié des noms de badge dans l'ordre (vous pouvez le remplacer par votre tableau de badges complet)
      const badgeNames = ["Rising Talent", "Top Viewed", "Excellent Communicator", "Top Rated", "Top Rated Plus"];
      const selectedBadgeName = badgeNames[selectedBadgeIndex];
      await updateBadge(consultantId, selectedBadgeName);
      toast.success(`Félicitations, vous avez gagné le badge ${selectedBadgeName} !`);
    } catch (err) {
      console.error("Erreur lors de l'association du badge :", err);
      toast.error("Échec de l'association du badge. Veuillez réessayer.");
    }
  };

  // Données pour le graphique des profile views
  const profileChartData = profileStats ? {
    labels: profileStats.labels,
    datasets: [{
      label: 'Profile Views',
      data: profileStats.data,
      borderColor: '#0C68FF',
      backgroundColor: 'rgba(12,104,255,0.2)'
    }]
  } : null;

  const profileOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Profile Views' } }
    }
  };

  // Données pour le graphique des propositions
  const proposalsChartData = proposalsStats ? {
    labels: proposalsStats.labels,
    datasets: proposalsStats.datasets.map(ds => {
      const statusMapping = {
        sent: { label: "Proposals sent", borderColor: "#0C68FF", backgroundColor: "rgba(12,104,255,0.2)" },
        invited: { label: "Invited", borderColor: "#FFA500", backgroundColor: "rgba(255,165,0,0.2)" },
        inProgress: { label: "In Progress", borderColor: "#2ecc71", backgroundColor: "rgba(46,204,113,0.2)" },
        terminated: { label: "Terminated", borderColor: "#FF0000", backgroundColor: "rgba(255,0,0,0.2)" },
        refused: { label: "Refused", borderColor: "#8e44ad", backgroundColor: "rgba(142,68,173,0.2)" }
      };
      const design = statusMapping[ds.label] || { label: ds.label };
      return {
        label: design.label,
        data: ds.data,
        borderColor: design.borderColor,
        backgroundColor: design.backgroundColor
      };
    })
  } : null;

  const proposalsOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Date' } },
      y: { stacked: true, title: { display: true, text: 'Nombre de propositions' } }
    }
  };

  // --- Affichage du Job Success Score avec design similaire à StatEntrepriseSSI ---
  const jobSuccessScore = consultantData && consultantData.jobSuccess !== null ? consultantData.jobSuccess : 0;
  const getJobSuccessRating = (score) => {
    if (score < 40) return "Mauvais";
    if (score < 70) return "Pas mal";
    return "Excellent";
  };

  return (
    <div className={styles.statsContainer}>
      <ToastContainer />
      <motion.h1 className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        My Stats
      </motion.h1>
      <motion.p className={styles.subTitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        View your proposals, earnings, profile analytics and Job Success Score.
      </motion.p>
      <motion.p className={styles.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        Stats may take up to 24 hours to update.
      </motion.p>

      <div className={styles.mainColumns}>
        {/* Colonne de gauche */}
        <div className={styles.leftColumn}>
          {/* Earnings et Donut Chart */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className={styles.earningsHeader}>
              <h2 className={styles.cardTitle}>Earnings</h2>
              <div className={styles.earningsPeriodSelect}>
                <select className={styles.select} value={earningsPeriod} onChange={e => setEarningsPeriod(e.target.value)}>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <a href="#transaction-history" className={styles.link}>Transaction history</a>
            <div className={styles.earningsAmount}>
              {earnings !== null ? `${(earnings / 100).toFixed(2)} EUR` : "Loading..."}
            </div>
            <div className={styles.donutChart}>
              {donutData ? (
                <Doughnut data={donutData} options={donutOptions} />
              ) : (
                <p>Loading donut chart...</p>
              )}
            </div>
          </motion.div>

          {/* Job Success Score avec cercle de progression */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className={styles.cardTitle}>Job Success Score</h2>
            <div className={styles.scoreContainer}>
              <div 
                className={styles.scoreCircle} 
                style={{
                  background: `conic-gradient(#31BF0D ${jobSuccessScore * 3.6}deg, #e1e8ed ${jobSuccessScore * 3.6}deg 360deg)`
                }}
              ></div>
              <div className={styles.scoreTextOutside}>
                <div className={styles.scoreValue}>
                  {jobSuccessScore ? `${jobSuccessScore}%` : "0%"}
                </div>
                <div className={styles.scoreRating}>
                  {getJobSuccessRating(jobSuccessScore)}
                </div>
              </div>
            </div>
            <button className={styles.btn}>View insights</button>
          </motion.div>

          {/* Profile Views */}
          <motion.div className={styles.profileMetrics} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h3 className={styles.profileMetricsTitle}>Profile Views</h3>
            <div className={styles.metricsNav}>
              <select className={styles.select} value={profilePeriod} onChange={e => setProfilePeriod(e.target.value)}>
                <option>Last 7 days</option>
                <option>Last 14 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className={styles.profileChart}>
              {profileChartData ? <Bar data={profileChartData} options={profileOptions} /> : <p>Loading chart...</p>}
            </div>
            <a href="/ProfilePage" className={styles.link}>My profile</a>
          </motion.div>
        </div>

        {/* Colonne de droite */}
        <div className={styles.rightColumn}>
          {/* Proposals */}
          <motion.div className={`${styles.card} ${styles.proposalsCard}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className={styles.proposalsHeader}>
              <h2 className={styles.cardTitle}>Proposals</h2>
              <select className={styles.select} value={proposalPeriod} onChange={e => setProposalPeriod(e.target.value)}>
                <option>Last 7 days</option>
                <option>Last 14 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className={styles.proposalsChart}>
              {proposalsChartData ? (
                <Bar data={proposalsChartData} options={proposalsOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
            <a href="/ConsultantPropositions" className={styles.link}>My proposals</a>
            <p className={styles.searchJobs}>
              Browse available jobs and send your proposal.{' '}
              <a href="#search-jobs">Search jobs</a>
            </p>
          </motion.div>

          {/* Exemple de carte Client Relationships */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className={styles.clientRelTitle}>Client Relationships</h3>
            <p className={styles.clientRelDescription}>
              Client relationships longer than 90 days can positively impact your Job Success Score.{' '}
              <a href="#explore">Explore how it works</a>
            </p>
            <div className={styles.clientRelCircle}>
              <span className={styles.clientRelValue}>80%</span>
            </div>
            <div className={styles.clientRelLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#0C68FF' }} />
                <span>More than 90 days</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#00C4CC' }} />
                <span>Less than 90 days</span>
              </div>
            </div>
          </motion.div>

          {/* Exemple de carte pour gagner un badge */}
          <motion.div className={styles.risingTalentBox} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <img src={RisingTalent} alt="Rising Talent" width="40" height="40" style={{ display: 'block', margin: '0 auto 8px' }} />
            <span className={styles.risingTalentLabel}>Rising Talent</span>
            <a href="#earn-rising-talent" className={styles.link} onClick={e => { e.preventDefault(); setShowModal(true); }}>
              Earn Rising Talent
            </a>
          </motion.div>
        </div>
      </div>

      {/* Modal pour l'attribution des badges */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Badges</h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>
              Badges are awarded after you complete jobs.
              Select a badge to view its requirements.
            </p>
            <div className={styles.modalBody}>
              <div className={styles.badgesColumn}>
                {["Rising Talent", "Top Viewed", "Excellent Communicator", "Top Rated", "Top Rated Plus"].map((name, index) => (
                  <div
                    key={index}
                    className={`${styles.badgeListItem} ${index === selectedBadgeIndex ? styles.activeBadge : ""}`}
                    onClick={() => setSelectedBadgeIndex(index)}
                  >
                    <img src={
                      index === 0 ? RisingTalent :
                      index === 1 ? TopViewed :
                      index === 2 ? ExcellentCommunicator :
                      index === 3 ? TopRated :
                      TopRatedPlus
                    } alt={name} width="40" height="40" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <div className={styles.requirementsColumn}>
                <p className={styles.badgeDescription}>
                  Description for {["Rising Talent", "Top Viewed", "Excellent Communicator", "Top Rated", "Top Rated Plus"][selectedBadgeIndex]}
                </p>
                <h3 style={{ marginTop: '20px' }}>Requirements</h3>
                <div className={styles.requirementsList}>
                  <div className={styles.requirementItem}>
                    <span style={{ color: 'green', marginRight: '8px' }}>✓</span>
                    Requirement 1
                  </div>
                  <div className={styles.requirementItem}>
                    <span style={{ color: 'red', marginRight: '8px' }}>✗</span>
                    Requirement 2
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button className={styles.earnButton} onClick={handleEarnBadge}>
                    Earn {["Rising Talent", "Top Viewed", "Excellent Communicator", "Top Rated", "Top Rated Plus"][selectedBadgeIndex]}
                  </button>
                </div>
              </div>
            </div>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatConsultant;