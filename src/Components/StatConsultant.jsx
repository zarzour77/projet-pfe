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
import { FaEnvelope, FaBell, FaSpinner, FaStop, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from './StatConsultant.module.css';
import StatConsultantService from '../services/StatConsultantService';
import ProfileViewService from '../services/ProfileViewService';
import ConsultantService from '../services/ConsultantService';

// Imports des SVG comme images
import RisingTalent from '../assets/icons/RisingTalent.svg';
import TopRated from '../assets/icons/TopRated.svg';
import TopRatedPlus from '../assets/icons/TopRatedPlus.svg';
import ExpertVetted from '../assets/icons/ExpertVetted.svg';
import TopViewed from '../assets/icons/TopViewed.svg';
import ExcellentCommunicator from '../assets/icons/ExcellentCommunicator.svg';

// Enregistrement des composants Chart.js utilisés
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Tableau de badges (SVG + nom + description + requirements)
const badges = [
  {
    name: "Rising Talent",
    icon: (
      <img
        src={RisingTalent}
        alt="Rising Talent"
        width="40"
        height="40"
      />
    ),
    description: "Awarded to promising new talent.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "100% complete profile" }
    ]
  },
  {
    name: "Top Rated",
    icon: (
      <img
        src={TopRated}
        alt="Top Rated"
        width="40"
        height="40"
      />
    ),
    description: "Recognized for consistent high performance.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "Job Success Score of 90% or higher", status: true },
      { label: "$1,000+ earnings in the last 12 months", status: false }
    ]
  },
  {
    name: "Top Rated Plus",
    icon: (
      <img
        src={TopRatedPlus}
        alt="Top Rated Plus"
        width="40"
        height="40"
      />
    ),
    description: "Elite professionals with exceptional results.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "Top Rated badge for at least 3 months", status: false },
      { label: "Excellent history with multiple clients", status: false }
    ]
  },
  {
    name: "Expert-Vetted",
    icon: (
      <img
        src={ExpertVetted}
        alt="Expert-Vetted"
        width="40"
        height="40"
      />
    ),
    description: "Top 1% of talent verified by experts.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "Invitation-only program", status: false },
      { label: "Expert interview completed", status: false }
    ]
  },
  {
    name: "Top Viewed",
    icon: (
      <img
        src={TopViewed}
        alt="Top Viewed"
        width="40"
        height="40"
      />
    ),
    description: "Profile viewed by many clients.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "High profile traffic in last 30 days" }
    ]
  },
  {
    name: "Excellent Communicator",
    icon: (
      <img
        src={ExcellentCommunicator}
        alt="Excellent Communicator"
        width="40"
        height="40"
      />
    ),
    description: "Outstanding communication skills.",
    requirementsTitle: "Requirements",
    requirements: [
      { label: "High feedback score for communication", status: false }
    ]
  }
];

function StatConsultant() {
  // États pour les statistiques et vues de profil
  const [proposalPeriod, setProposalPeriod] = useState('Last 7 days');
  const [proposalsStats, setProposalsStats] = useState(null);
  const [profilePeriod, setProfilePeriod] = useState('Last 7 days');
  const [profileStats, setProfileStats] = useState(null);

  // États pour les earnings et la période de filtrage (month/year)
  const [earnings, setEarnings] = useState(null);
  const [earningsPeriod, setEarningsPeriod] = useState('year');

  // Nouvel état pour stocker les données du donut chart
  const [donutData, setDonutData] = useState(null);

  // États pour la modal des badges et le badge sélectionné
  const [showModal, setShowModal] = useState(false);
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(0);

  // Stocker les données actualisées du consultant
  const [consultantData, setConsultantData] = useState(null);
  
  // État pour le nombre de conversations
  const [conversationCount, setConversationCount] = useState(0);

  // Récupération de l'ID et du token du consultant depuis le localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const consultantId = storedUser?.user?.id || storedUser?.id;
  const token = storedUser?.token;

  // Extraction des méthodes du service
  const { getConsultantStats, getConsultantEarnings, updateBadge, getConversationCount } = StatConsultantService;

  // Récupération des statistiques de propositions
  useEffect(() => {
    if (consultantId) {
      const periodDays =
        proposalPeriod === 'Last 7 days'
          ? 7
          : proposalPeriod === 'Last 14 days'
          ? 14
          : 30;
      getConsultantStats(consultantId, periodDays)
        .then((data) => setProposalsStats(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération des stats :", error)
        );
    }
  }, [consultantId, proposalPeriod, getConsultantStats]);

  // Récupération des statistiques des vues de profil
  useEffect(() => {
    if (consultantId) {
      const periodDays =
        profilePeriod === 'Last 7 days'
          ? 7
          : profilePeriod === 'Last 14 days'
          ? 14
          : 30;
      ProfileViewService.getProfileViews(consultantId, periodDays)
        .then((data) => setProfileStats(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération des profile views :", error)
        );
    }
  }, [consultantId, profilePeriod]);

  // Récupération des données du consultant
  useEffect(() => {
    if (consultantId) {
      ConsultantService.getConsultantById(consultantId)
        .then((data) => setConsultantData(data))
        .catch((err) =>
          console.error("Erreur lors de la récupération du consultant :", err)
        );
    }
  }, [consultantId]);

  // Récupération du nombre de conversations
  useEffect(() => {
    if (consultantId) {
      getConversationCount(consultantId)
        .then(response => {
          setConversationCount(response.count);
        })
        .catch(error =>
          console.error("Erreur lors de la récupération du nombre de conversations:", error)
        );
    }
  }, [consultantId, getConversationCount]);

  // Récupération dynamique des earnings selon la période choisie
  useEffect(() => {
    if (consultantId) {
      getConsultantEarnings(consultantId, earningsPeriod)
        .then((data) => setEarnings(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération des earnings :", error)
        );
    }
  }, [consultantId, earningsPeriod, getConsultantEarnings]);

  // Récupération dynamique des données du donut chart via l'API
  useEffect(() => {
    if (consultantId) {
      const token = localStorage.getItem("token");
      axios.get(`http://localhost:8081/api/payments/donut/${consultantId}?period=${earningsPeriod}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        // La réponse est un objet contenant frozenFunds, applicationFee et amountReceived
        const data = response.data;
        // Préparation des données pour le Doughnut chart
        setDonutData({
          labels: ["Frozen Funds", "Application Fee", "Amount Received"],
          datasets: [
            {
              data: [data.frozenFunds, data.applicationFee, data.amountReceived],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
          ]
        });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données du donut chart :", error);
      });
    }
  }, [consultantId, earningsPeriod]);

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  // Vérifie si le consultant a plus de 10 conversations
  const isExcellentCommunicatorFulfilled = () => {
    return conversationCount > 10;
  };

  // Graphique des vues de profil
  const profileChartData = profileStats
    ? {
        labels: profileStats.labels,
        datasets: [
          {
            label: 'Profile Views',
            data: profileStats.data,
            borderColor: '#0C68FF',
            backgroundColor: 'rgba(12,104,255,0.2)'
          }
        ]
      }
    : null;

  const profileOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Profile Views' } }
    }
  };

  // Configuration du graphique des propositions
  const statusDesignMapping = {
    sent: { label: "Proposals sent", borderColor: "#0C68FF", backgroundColor: "rgba(12,104,255,0.2)" },
    invited: { label: "Invited", borderColor: "#FFA500", backgroundColor: "rgba(255,165,0,0.2)" },
    inProgress: { label: "In Progress", borderColor: "#2ecc71", backgroundColor: "rgba(46,204,113,0.2)" },
    terminated: { label: "Terminated", borderColor: "#FF0000", backgroundColor: "rgba(255,0,0,0.2)" },
    refused: { label: "Refused", borderColor: "#8e44ad", backgroundColor: "rgba(142,68,173,0.2)" }
  };

  const proposalsChartData = proposalsStats
    ? {
        labels: proposalsStats.labels,
        datasets: proposalsStats.datasets.map(ds => {
          const design = statusDesignMapping[ds.label] || { label: ds.label };
          return {
            label: design.label,
            data: ds.data,
            borderColor: design.borderColor,
            backgroundColor: design.backgroundColor
          };
        })
      }
    : null;

  const proposalsOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Date' } },
      y: { stacked: true, title: { display: true, text: 'Nombre de propositions' } }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Vérifie la complétude du profil
  const isProfileComplete = (consultant) => {
    return (
      consultant &&
      consultant.photoprofile &&
      consultant.prenom &&
      consultant.nom &&
      consultant.email &&
      consultant.telephone &&
      consultant.adresse &&
      consultant.competences && consultant.competences.length > 0 &&
      consultant.domaines && consultant.domaines.length > 0 &&
      consultant.langues && consultant.langues.length > 0
    );
  };

  // Total des vues de profil (pour le badge Top Viewed)
  const getTotalProfileViews = () => {
    if (profileStats && profileStats.data) {
      return profileStats.data.reduce((sum, value) => sum + value, 0);
    }
    return 0;
  };

  // Vérifie si le badge Top Viewed est rempli
  const isTopViewedFulfilled = () => {
    return getTotalProfileViews() >= 1;
  };

  // Gestion de l'attribution du badge
  const handleEarnBadge = async () => {
    try {
      if (badges[selectedBadgeIndex].name === "Rising Talent" && !isProfileComplete(consultantData)) {
        toast.error("Veuillez compléter toutes vos informations personnelles before earning this badge.");
        return;
      }
      if (badges[selectedBadgeIndex].name === "Top Viewed" && !isTopViewedFulfilled()) {
        toast.error("Vous devez avoir at least 5 profile views in the last 30 days to earn this badge.");
        return;
      }
      if (badges[selectedBadgeIndex].name === "Excellent Communicator" && !isExcellentCommunicatorFulfilled()) {
        toast.error("Vous devez avoir plus de 10 conversations pour gagner ce badge.");
        return;
      }
      const selectedBadgeName = badges[selectedBadgeIndex].name;
      await updateBadge(consultantId, selectedBadgeName);
      toast.success(`Félicitations, vous avez gagné le badge ${selectedBadgeName} !`);
    } catch (err) {
      console.error("Erreur lors de l'association du badge :", err);
      toast.error("Échec de l'association du badge. Veuillez réessayer.");
    }
  };

  // Rendu d'un requirement
  const renderRequirement = (req) => {
    let fulfilled = req.status;
    if (badges[selectedBadgeIndex].name === "Rising Talent") {
      fulfilled = isProfileComplete(consultantData);
    }
    if (badges[selectedBadgeIndex].name === "Top Viewed" && req.label === "High profile traffic in last 30 days") {
      fulfilled = isTopViewedFulfilled();
    }
    if (badges[selectedBadgeIndex].name === "Excellent Communicator" && req.label === "High feedback score for communication") {
      fulfilled = isExcellentCommunicatorFulfilled();
    }
    return (
      <div className={styles.requirementItem}>
        <span style={{ color: fulfilled ? 'green' : 'red', marginRight: '8px' }}>
          {fulfilled ? '✓' : '✗'}
        </span>
        {req.label}
      </div>
    );
  };

  // Détermine si le bouton Earn doit être désactivé
  const isEarnDisabled = () => {
    if (badges[selectedBadgeIndex].name === "Rising Talent") {
      return !isProfileComplete(consultantData);
    }
    if (badges[selectedBadgeIndex].name === "Top Viewed") {
      return !isTopViewedFulfilled();
    }
    if (badges[selectedBadgeIndex].name === "Excellent Communicator") {
      return !isExcellentCommunicatorFulfilled();
    }
    return false;
  };

  return (
    <div className={styles.statsContainer}>
      <ToastContainer />
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        My stats
      </motion.h1>
      <motion.p 
        className={styles.subTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        View proposal history, earnings, profile analytics, and your Job Success Score.
      </motion.p>
      <motion.p 
        className={styles.note}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Stats are not updated in real-time and may take up to 24 hours to reflect recent activity.
      </motion.p>

      <div className={styles.mainColumns}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.earningsHeader}>
              <h2 className={styles.cardTitle}>Earnings</h2>
              <div className={styles.earningsPeriodSelect}>
                <select
                  className={styles.select}
                  value={earningsPeriod}
                  onChange={(e) => setEarningsPeriod(e.target.value)}
                >
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <a href="#transaction-history" className={styles.link}>
              Transaction history
            </a>
            <div className={styles.earningsAmount}>
              {earnings !== null ? `${(earnings / 100).toFixed(2)} EUR` : 'Loading...'}
            </div>
            {/* Donut chart dynamique */}
            <div className={styles.donutChart}>
              {donutData ? (
                <Doughnut data={donutData} options={donutOptions} />
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
            <h2 className={styles.cardTitle}>Job Success Score</h2>
            <p className={styles.cardDescription}>
              Leverage Job Success insights to help you learn how to earn or regain a score.
            </p>
            <button className={styles.btn}>View insights</button>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreValue}>95%</span>
              </div>
              <span className={styles.noScoreText}>Excellent</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.profileMetrics}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
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
              {profileChartData ? (
                <Bar data={profileChartData} options={profileOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
            <a href="/ProfilePage" className={styles.link}>My profile</a>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <motion.div 
            className={`${styles.card} ${styles.proposalsCard}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.proposalsHeader}>
              <h2 className={styles.cardTitle}>Proposals</h2>
              <select
                className={styles.select}
                value={proposalPeriod}
                onChange={(e) => setProposalPeriod(e.target.value)}
              >
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
              Upwork has thousands of available jobs. Browse the ones that best suit you and then send your proposal.{' '}
              <a href="#search-jobs">Search jobs</a>
            </p>
          </motion.div>

          <motion.div 
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.clientRelTitle}>Client relationships</h3>
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

          <motion.div 
            className={styles.risingTalentBox}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src={RisingTalent}
              alt="Rising Talent"
              width="40"
              height="40"
              style={{ display: 'block', margin: '0 auto 8px' }}
            />
            <span className={styles.risingTalentLabel}>Rising talent</span>
            <a
              href="#earn-rising-talent"
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              Earn Rising talent
            </a>
          </motion.div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Badges</h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>
              Badges are attached to your profile after you have completed jobs.
              Select a badge to learn more about the requirements for each.
            </p>
            <div className={styles.modalBody}>
              <div className={styles.badgesColumn}>
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`${styles.badgeListItem} ${index === selectedBadgeIndex ? styles.activeBadge : ""}`}
                    onClick={() => setSelectedBadgeIndex(index)}
                  >
                    {badge.icon}
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
              <div className={styles.requirementsColumn}>
                <p className={styles.badgeDescription}>
                  {badges[selectedBadgeIndex].description}
                </p>
                <h3 style={{ marginTop: '20px' }}>Requirements</h3>
                <div className={styles.requirementsList}>
                  {badges[selectedBadgeIndex].requirements.map((req, i) => (
                    <div key={i}>
                      {renderRequirement(req)}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button
                    className={styles.earnButton}
                    onClick={handleEarnBadge}
                    disabled={isEarnDisabled()}
                    style={{
                      opacity: isEarnDisabled() ? 0.5 : 1,
                      cursor: isEarnDisabled() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Earn {badges[selectedBadgeIndex].name}
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
