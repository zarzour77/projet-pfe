import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaTh } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Importation du CSS (votre module de styles)
import styles from './SearchMission.module.css';
// Importation du service pour appeler l'API
import { getMissions } from '../services/SearchMission';

function SearchMission() {
  // États pour les filtres et le mode d'affichage
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('list'); // "list" ou "grid"
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [missions, setMissions] = useState([]);

  // Chargement des missions depuis le backend lors du montage du composant
  useEffect(() => {
    setIsLoading(true);
    getMissions()
      .then((data) => {
        setMissions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Erreur lors du chargement des missions");
        setIsLoading(false);
      });
  }, []);

  // Filtrage des missions selon le mot-clé et la catégorie (vous pouvez étendre la logique)
  const filteredMissions = missions.filter((mission) => {
    const matchKeyword =
      !searchKeyword ||
      mission.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchCategory =
      !category ||
      (mission.tags && mission.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase())));

    return matchKeyword && matchCategory;
  });

  // Statistiques pour le dashboard
  const budgets = filteredMissions.map((mission) => mission.budget).filter((b) => !isNaN(b));
  const avgBudget = budgets.length ? (budgets.reduce((a, b) => a + b, 0) / budgets.length).toFixed(0) : 0;
  const totalMissions = filteredMissions.length;

  // Distribution par catégorie pour le graphique (en utilisant quelques catégories principales)
  const mainCategories = ["Design", "Development", "Proofreading", "Writing", "SEO", "Marketing"];
  const distributionData = mainCategories.map((cat) => {
    const count = filteredMissions.filter(
      (mission) =>
        mission.tags && mission.tags.some((tag) => tag.toLowerCase().includes(cat.toLowerCase()))
    ).length;
    return { name: cat, value: count };
  });
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#3366AA'];

  const clearFilters = () => {
    setCategory('');
    setExperience('');
    setJobType('');
    setBudgetRange('');
    setSearchKeyword('');
  };

  const handleSaveJob = () => {
    toast.success("Mission sauvegardée !");
  };

  const handleChat = (missionTitle) => {
    toast.info(`Discussion initiée pour "${missionTitle}" !`);
  };

  return (
    <div className={styles.searchMissionContainer}>
      <ToastContainer />

      {/* Barre de recherche globale */}
      <div className={styles.globalSearchBar}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par mot-clé..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Barre supérieure (actions & tri) */}
      <div className={styles.topBar}>
        <div className={styles.leftActions}>
          <Button variant="contained" onClick={() => toast.info("Recherche sauvegardée !")}>
            Save search
          </Button>
        </div>
        <div className={styles.rightActions}>
          <Button variant="contained" onClick={() => toast.info("Affichage des missions sauvegardées !")}>
            Saved missions
          </Button>
          <Select value="" displayEmpty variant="outlined" size="small">
            <MenuItem value="">Sort by: Newest</MenuItem>
            <MenuItem value="oldest">Sort by: Oldest</MenuItem>
            <MenuItem value="match">Sort by: Best match</MenuItem>
          </Select>
        </div>
      </div>

      {/* Barre de bascule (affichage & filtres) */}
      <div className={styles.toggleBar}>
        <div className={styles.viewToggle}>
          <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? styles.active : ''}>
            <FaList />
          </button>
          <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? styles.active : ''}>
            <FaTh />
          </button>
        </div>
        <Button variant="outlined" onClick={() => setShowFilters(!showFilters)} className={styles.filterToggle}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button variant="outlined" onClick={clearFilters} className={styles.clearFilters}>
          Clear All Filters
        </Button>
      </div>

      {/* Dashboard : Statistiques et graphique */}
      <div className={styles.dashboard}>
        <div className={styles.statsSection}>
          <div className={styles.stat}>
            <strong>Total Missions:</strong> {totalMissions}
          </div>
          <div className={styles.stat}>
            <strong>Average Budget:</strong> ${avgBudget}
          </div>
        </div>
        <div className={styles.chartSection}>
          <PieChart width={600} height={320} margin={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Panneau de filtres */}
        {showFilters && (
          <aside className={styles.filters}>
            <h3>Filter by</h3>
            <div className={styles.filterGroup}>
              <label>Category</label>
              <Select
                fullWidth
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All categories</MenuItem>
                <MenuItem value="Design">Design & Creative</MenuItem>
                <MenuItem value="Development">Development & IT</MenuItem>
                <MenuItem value="Proofreading">Proofreading</MenuItem>
                <MenuItem value="Writing">Writing</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Experience Level</label>
              <Select
                fullWidth
                variant="outlined"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Entry">Entry</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Job Type</label>
              <Select
                fullWidth
                variant="outlined"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Fixed">Fixed Price</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Budget Range</label>
              <Select
                fullWidth
                variant="outlined"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="LessThan2000">Less than $2000</MenuItem>
                <MenuItem value="2000To5000">Between $2000 and $5000</MenuItem>
                <MenuItem value="MoreThan5000">More than $50000</MenuItem>
              </Select>
            </div>
          </aside>
        )}

        {/* Liste des missions */}
        <section className={styles.jobList}>
          {isLoading ? (
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
            </div>
          ) : filteredMissions.length === 0 ? (
            <div className={styles.noJobs}>
              <img
                src="https://undraw.co/api/illustrations/searching.svg"
                alt="No missions found"
              />
              <p>No missions found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                className={`${styles.jobItem} ${viewMode === 'grid' ? styles.gridItem : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h2>{mission.title}</h2>
                <div className={styles.jobInfo}>
                  <span
                    className={mission.paymentVerified ? styles.paymentVerified : styles.paymentNotVerified}
                  >
                    {mission.paymentVerified ? "Payment verified" : "Payment not verified"}
                  </span>
                  <span className={styles.spent}>{mission.spent} spent</span>
                  <span className={styles.location}>{mission.location}</span>
                  <span className={styles.published}>
                    Published {formatDistanceToNow(new Date(mission.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className={styles.jobTags}>
                  {mission.tags &&
                    mission.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                </div>
                <p className={styles.jobDescription}>{mission.description}</p>
                <div className={styles.actionButtons}>
                  <Button variant="contained" size="small" onClick={() => toast.info("Applied!")}>
                    Apply
                  </Button>
                  <Button variant="outlined" size="small" onClick={handleSaveJob}>
                    Save
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => toast.info("Link copied!")}>
                    Share
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => handleChat(mission.title)}>
                    Chat
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default SearchMission;
