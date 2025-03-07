import  { useState } from 'react';
import styles from './statsconsultant.module.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsConsultant = () => {
  // État pour la période (Proposals)
  const [selectedProposalRange, setSelectedProposalRange] = useState('7');
  // État pour la période (Profile metrics)
  const [selectedProfileRange, setSelectedProfileRange] = useState('7');
  // Onglet sélectionné pour la section "Profile metrics"
  const [selectedTab, setSelectedTab] = useState('profileViews');

  // Gestion du changement de période pour Proposals
  const handleProposalRangeChange = (e) => {
    setSelectedProposalRange(e.target.value);
  };

  // Gestion du changement de période pour Profile metrics
  const handleProfileRangeChange = (e) => {
    setSelectedProfileRange(e.target.value);
  };

  // Gestion du clic sur un onglet
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // -- Données graphiques (placeholder, toutes à 0) --

  // Proposals: deux datasets "Organic" et "Boosted"
  const proposalsData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
    datasets: [
      {
        label: 'Organic',
        data: [0, 0, 0, 0],
        borderColor: '#14a800', // Vert Upwork
        backgroundColor: '#14a800',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Boosted',
        data: [2, 3, 0, 5],
        borderColor: '#0077b5', // Bleu
        backgroundColor: '#0077b5',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  // Profile metrics: un dataset selon l’onglet
  // Pour simplifier, on laisse la même data (0) mais on change juste le label
  let profileLabel = 'Profile Views';
  if (selectedTab === 'invites') profileLabel = 'Invites';
  if (selectedTab === 'impressions') profileLabel = 'Impressions and clicks';

  const profileMetricsData = {
    labels: ['Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21'],
    datasets: [
      {
        label: profileLabel,
        data: [1, 5, 0, 0, 0, 4, 0],
        borderColor: '#14a800',
        backgroundColor: '#14a800',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  // -- Options communes pour Chart.js --
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Cachons la légende pour un look épuré
      tooltip: {
        enabled: false, // Désactivé pour reproduire le style "vide" Upwork
      },
    },
    scales: {
      x: {
        grid: {
          color: '#f2f2f2', // Couleur de la grille (gris clair)
        },
        ticks: {
          display: false, // Masque les labels X pour un style minimal
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f2f2f2',
        },
        ticks: {
          display: false, // Masque les labels Y pour un style minimal
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      {/* SECTION PROPOSALS */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Proposals</h2>
          <select
            value={selectedProposalRange}
            onChange={handleProposalRangeChange}
            className={styles.rangeSelect}
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        {/* Nombre de proposals */}
        <h3 className={styles.bigNumber}>0 proposals sent</h3>

        {/* Résumé */}
        <ul className={styles.statsList}>
          <li>0 proposals sent</li>
          <li>0 were viewed</li>
          <li>0 interviews</li>
          <li>0 hires</li>
        </ul>

        {/* Graphique (placeholder) */}
        <div className={styles.chartContainer}>
          <Line data={proposalsData} options={commonOptions} />
        </div>

        {/* Légende (Organic, Boosted) + lien My proposals */}
        <div className={styles.footerRow}>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.organicDot}></span> Organic
            </span>
            <span className={styles.legendItem}>
              <span className={styles.boostedDot}></span> Boosted
            </span>
          </div>
          <a href="#!" className={styles.link}>
            My proposals
          </a>
        </div>
      </div>

      {/* SECTION PROFILE METRICS */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Profile metrics</h2>
          <select
            value={selectedProfileRange}
            onChange={handleProfileRangeChange}
            className={styles.rangeSelect}
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        {/* Onglets */}
        <div className={styles.tabs}>
          <button
            onClick={() => handleTabClick('profileViews')}
            className={`${styles.tabButton} ${
              selectedTab === 'profileViews' ? styles.activeTab : ''
            }`}
          >
            Profile views
          </button>
          <button
            onClick={() => handleTabClick('invites')}
            className={`${styles.tabButton} ${
              selectedTab === 'invites' ? styles.activeTab : ''
            }`}
          >
            Invites
          </button>
          <button
            onClick={() => handleTabClick('impressions')}
            className={`${styles.tabButton} ${
              selectedTab === 'impressions' ? styles.activeTab : ''
            }`}
          >
            Impressions and clicks
          </button>
        </div>

        {/* Nombre selon l’onglet */}
        <h3 className={styles.bigNumber}>
          {selectedTab === 'profileViews' && '0 profile views'}
          {selectedTab === 'invites' && '0 invites'}
          {selectedTab === 'impressions' && '0 impressions and clicks'}
        </h3>

        {/* Graphique (placeholder) */}
        <div className={styles.chartContainer}>
          <Line data={profileMetricsData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default StatsConsultant;