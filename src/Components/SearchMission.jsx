import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaTh } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Tooltip as ReTooltip, Legend, Cell } from 'recharts';

// Material UI components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MUITooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Importation du CSS
import styles from './SearchMission.module.css';

// Services API
import { 
  getMissions, 
  getMissionsByDomaine, 
  getMissionsByExperience, 
  getMissionsByPorteDeTravail,
  getMissionsByBudgetRange,
  getMissionsByDureeEstime,
  saveMissionForConsultant,
  getSavedMissions
} from '../services/SearchMission';
import DomaineService from '../Services/DomaineService';
import { useNavigate } from 'react-router-dom';

// Création du thème Material‑UI avec la palette demandée
const theme = createTheme({
  palette: {
    primary: {
      main: "#009990", // Couleur principale
    },
    secondary: {
      main: "#074799", // Élément secondaire
    },
    background: {
      default: "#E1FFBB", // Arrière‑plan global
    },
    text: {
      primary: "#001A6E", // Couleur du texte principal
    }
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

function SearchMission() {
  const navigate = useNavigate();

  // États pour filtres, affichage et pagination
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [experience, setExperience] = useState('');
  const [portetravail, setPorteDeTravail] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [dureeEstime, setDureeEstime] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('list'); // "list" ou "grid"
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [missions, setMissions] = useState([]);
  const [domainesOptions, setDomainesOptions] = useState([]);
  const [sortOption, setSortOption] = useState("newest"); // "newest" ou "oldest"
  const [showSaved, setShowSaved] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Palette pour le PieChart
  const COLORS = [
    '#E1FFBB', // Vert pâle
    '#009990', // Turquoise
    '#66D2CE', // Turquoise clair
    '#074799', // Bleu foncé
    '#001A6E', // Bleu nuit
    '#FF9B4E', // Orange doux
    '#F9A8D4'  // Rose pastel
  ];

  // Chargement des domaines depuis le backend
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const data = await DomaineService.getAllDomaines();
        setDomainesOptions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des domaines", error);
      }
    };
    fetchDomaines();
  }, []);

  // Chargement des missions selon filtres ou missions sauvegardées
  useEffect(() => {
    if (showSaved) {
      const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
      const consultantId = storedUser?.user?.id || storedUser?.id;
      if (!consultantId) {
        toast.error("Consultant introuvable");
        return;
      }
      setIsLoading(true);
      getSavedMissions(consultantId)
        .then(data => {
          setMissions(data);
          setIsLoading(false);
          setCurrentPage(1);
        })
        .catch(error => {
          toast.error("Erreur lors de la récupération des missions sauvegardées");
          setIsLoading(false);
        });
      return;
    }

    setIsLoading(true);
    const filtersSelected = [!!selectedDomaine, !!experience, !!portetravail, !!budgetRange, !!dureeEstime].filter(Boolean).length;
    const computeBudgetRange = (range) => {
      let minBudget = 0, maxBudget = 0;
      if (range === "LessThan1000") {
        minBudget = 0;
        maxBudget = 1000;
      } else if (range === "1000To2500") {
        minBudget = 1000;
        maxBudget = 2500;
      } else if (range === "MoreThan2500") {
        minBudget = 2500;
        maxBudget = 1000000;
      }
      return { minBudget, maxBudget };
    };

    let apiCall;
    if (filtersSelected === 1) {
      if (selectedDomaine) apiCall = getMissionsByDomaine([selectedDomaine]);
      else if (experience) apiCall = getMissionsByExperience(experience);
      else if (portetravail) apiCall = getMissionsByPorteDeTravail(portetravail);
      else if (budgetRange) {
        const { minBudget, maxBudget } = computeBudgetRange(budgetRange);
        apiCall = getMissionsByBudgetRange(minBudget, maxBudget);
      } else if (dureeEstime) apiCall = getMissionsByDureeEstime(dureeEstime);
    } else if (filtersSelected > 1) {
      // Remarque : Ici on appelle la même API que pour 1 filtre,
      // mais idéalement on ferait un endpoint qui gère plusieurs filtres.
      if (selectedDomaine) apiCall = getMissionsByDomaine([selectedDomaine]);
      else if (experience) apiCall = getMissionsByExperience(experience);
      else if (portetravail) apiCall = getMissionsByPorteDeTravail(portetravail);
      else if (budgetRange) {
        const { minBudget, maxBudget } = computeBudgetRange(budgetRange);
        apiCall = getMissionsByBudgetRange(minBudget, maxBudget);
      } else if (dureeEstime) apiCall = getMissionsByDureeEstime(dureeEstime);
    } else {
      apiCall = getMissions();
    }

    apiCall
      .then((data) => {
        // Appliquer les autres filtres côté client
        let filtered = data;
        if (experience && !selectedDomaine) {
          filtered = filtered.filter(m =>
            m.niveauExperienceRequis && m.niveauExperienceRequis.toLowerCase() === experience.toLowerCase()
          );
        }
        if (portetravail && !selectedDomaine && !experience) {
          filtered = filtered.filter(m =>
            m.portetravail && m.portetravail.toLowerCase() === portetravail.toLowerCase()
          );
        }
        if (budgetRange && !selectedDomaine && !experience && !portetravail) {
          const { minBudget, maxBudget } = computeBudgetRange(budgetRange);
          filtered = filtered.filter(m => m.budget >= minBudget && m.budget <= maxBudget);
        }
        if (dureeEstime) {
          filtered = filtered.filter(m =>
            m.dureeEstime && m.dureeEstime.toLowerCase() === dureeEstime.toLowerCase()
          );
        }
        setMissions(filtered);
        setIsLoading(false);
        setCurrentPage(1);
      })
      .catch((error) => {
        toast.error("Erreur lors du chargement des missions");
        setIsLoading(false);
      });
  }, [selectedDomaine, experience, portetravail, budgetRange, dureeEstime, showSaved]);

  /**
   * Filtrage client sur le mot-clé :
   *  - Titre
   *  - Description
   *  - Nom des domaines
   *  - Nom des compétences
   */
  const filteredMissions = missions.filter(mission => {
    if (!searchKeyword) return true;

    const lowerKeyword = searchKeyword.toLowerCase();

    // Vérifie si le titre ou la description contiennent le mot-clé
    const inTitleOrDescription = (
      mission.titre.toLowerCase().includes(lowerKeyword) ||
      mission.description.toLowerCase().includes(lowerKeyword)
    );

    // Vérifie si un des domaines contient le mot-clé
    const inDomaines = mission.domaines && mission.domaines.some(d =>
      d.nom && d.nom.toLowerCase().includes(lowerKeyword)
    );

    // Vérifie si une des compétences contient le mot-clé
    const inCompetences = mission.competencesRequises && mission.competencesRequises.some(c =>
      c.nom && c.nom.toLowerCase().includes(lowerKeyword)
    );

    return inTitleOrDescription || inDomaines || inCompetences;
  });

  // Tri basé sur publishedAt
  const sortedMissions = [...filteredMissions].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return sortOption === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMissions = sortedMissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMissions.length / itemsPerPage);

  // Calculs pour dashboard : statistiques & graphique
  const budgetsList = sortedMissions.map(m => m.budget).filter(b => !isNaN(b));
  const avgBudget = budgetsList.length
    ? (budgetsList.reduce((a, b) => a + b, 0) / budgetsList.length).toFixed(0)
    : 0;
  const totalMissions = sortedMissions.length;

  // Graphique par catégories (basé sur le champ "category" des domaines)
  const chartCategories = ["Design", "Development & IT", "Proofreading", "Writing", "SEO", "Marketing", "Others"];
  const distributionCount = {};
  chartCategories.forEach(cat => distributionCount[cat] = 0);
  sortedMissions.forEach(mission => {
    if (mission.domaines && mission.domaines.length > 0) {
      const missionCats = new Set();
      mission.domaines.forEach(domain => {
        const cat = domain.category ? domain.category : "Others";
        missionCats.add(cat);
      });
      missionCats.forEach(cat => distributionCount[cat]++);
    } else {
      distributionCount["Others"]++;
    }
  });
  const distributionData = Object.entries(distributionCount)
    .filter(([cat, count]) => count > 0)
    .map(([cat, count]) => ({ name: cat, value: count }));

  const clearFilters = () => {
    setSelectedDomaine('');
    setExperience('');
    setPorteDeTravail('');
    setBudgetRange('');
    setDureeEstime('');
    setSearchKeyword('');
  };

  // Fonction pour sauvegarder une mission (avec tooltip explicatif)
  const handleSaveJob = (missionId) => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error("Consultant introuvable");
      return;
    }
    saveMissionForConsultant(consultantId, missionId)
      .then(() => {
        toast.success("Mission sauvegardée !");
      })
      .catch((error) => {
        toast.error("Erreur lors de la sauvegarde de la mission");
      });
  };

  // Bascule entre missions normales et sauvegardées
  const handleShowSavedMissions = () => {
    const storedUser = JSON.parse(localStorage.getItem("userWithToken"));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error("Consultant introuvable");
      return;
    }
    if (showSaved) {
      setShowSaved(false);
      getMissions()
        .then(data => setMissions(data))
        .catch(error => toast.error("Erreur lors de la récupération des missions"));
    } else {
      getSavedMissions(consultantId)
        .then(data => {
          setMissions(data);
          setShowSaved(true);
        })
        .catch(error => toast.error("Erreur lors de la récupération des missions sauvegardées"));
    }
  };

  const handleChat = (mission) => {
    toast.info(`Discussion initiée pour "${mission.titre}" !`);
    navigate('/Messenger', { state: { mission } });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.searchMissionContainer}>
        <ToastContainer />

        {/* Barre de recherche globale */}
        <motion.div
          className={styles.globalSearchBar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par mot-clé..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            inputProps={{ 'aria-label': 'Search missions' }}
          />
        </motion.div>

        {/* Dashboard interactif avec PieChart */}
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
            <PieChart width={300} height={300}>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#074799"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Barre de contrôle repositionnée sous les graphiques */}
        <motion.div
          className={styles.controlsBar}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="contained" onClick={handleShowSavedMissions} aria-label="Toggle Saved Missions">
            {showSaved ? "All Missions" : "Saved missions"}
          </Button>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            variant="outlined"
            size="small"
            aria-label="Sort missions"
          >
            <MenuItem value="newest">Sort by: Newest</MenuItem>
            <MenuItem value="oldest">Sort by: Oldest</MenuItem>
          </Select>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? styles.active : ''}
              aria-label="List view"
            >
              <FaList />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? styles.active : ''}
              aria-label="Grid view"
            >
              <FaTh />
            </button>
          </div>
        </motion.div>

        {/* Main content: Filtres et liste des missions */}
        <div className={styles.mainContent}>
          {showFilters && (
            <motion.aside
              className={styles.filters}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Filter by</h3>
              <div className={styles.filterGroup}>
                <label>Domaine</label>
                <Select
                  fullWidth
                  variant="outlined"
                  value={selectedDomaine}
                  onChange={(e) => setSelectedDomaine(e.target.value)}
                >
                  <MenuItem value="">Tous les domaines</MenuItem>
                  {domainesOptions.map((dom) => (
                    <MenuItem key={dom.id} value={dom.id}>
                      {dom.nom}
                    </MenuItem>
                  ))}
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
                <label>Porte de Travail</label>
                <Select
                  fullWidth
                  variant="outlined"
                  value={portetravail}
                  onChange={(e) => setPorteDeTravail(e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
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
                  <MenuItem value="LessThan1000">Less than $1000</MenuItem>
                  <MenuItem value="1000To2500">Between $1000 and $2500</MenuItem>
                  <MenuItem value="MoreThan2500">More than $2500</MenuItem>
                </Select>
              </div>
              <div className={styles.filterGroup}>
                <label>Durée Estimée</label>
                <Select
                  fullWidth
                  variant="outlined"
                  value={dureeEstime}
                  onChange={(e) => setDureeEstime(e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="< 1 mois">{"< 1 mois"}</MenuItem>
                  <MenuItem value="1-3 mois">{"1-3 mois"}</MenuItem>
                  <MenuItem value="3-6 mois">{"3-6 mois"}</MenuItem>
                </Select>
              </div>
              <Button variant="outlined" onClick={clearFilters} className={styles.clearFilters}>
                Clear All Filters
              </Button>
            </motion.aside>
          )}

          <section className={styles.jobList}>
            {isLoading ? (
              <div className={styles.skeletonContainer}>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
              </div>
            ) : sortedMissions.length === 0 ? (
              <div className={styles.noJobs}>
                <img
                  src="https://undraw.co/api/illustrations/searching.svg"
                  alt="No missions found"
                />
                <p>No missions found. Try adjusting your filters.</p>
              </div>
            ) : (
              currentMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  className={`${styles.jobItem} ${viewMode === 'grid' ? styles.gridItem : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h2>{mission.titre}</h2>
                  <div className={styles.jobInfo}>
                    <span className={styles.paymentVerified}>Payment verified</span>
                    <span className={styles.spent}>{"$" + mission.budget + "+"}</span>
                    <span className={styles.location}>
                      {mission.entreprise ? mission.entreprise.nom : "Unknown"}
                    </span>
                    <span className={styles.published}>
                      Published{" "}
                      {mission.publishedAt && !isNaN(new Date(mission.publishedAt).getTime())
                        ? formatDistanceToNow(new Date(mission.publishedAt), { addSuffix: true })
                        : "N/A"}
                    </span>
                  </div>
                  <div className={styles.jobTags}>
                    {mission.domaines &&
                      mission.domaines.map((d, i) => (
                        <span key={i} className={styles.tag}>
                          {d.nom}
                        </span>
                      ))}
                    {mission.competencesRequises &&
                      mission.competencesRequises.map((c, i) => (
                        <span key={i} className={styles.tag}>
                          {c.nom}
                        </span>
                      ))}
                  </div>
                  <p className={styles.jobDescription}>{mission.description}</p>
                  <div className={styles.actionButtons}>
                    <MUITooltip title="Apply for this mission" arrow>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => toast.info("Applied!")}
                      >
                        Apply
                      </Button>
                    </MUITooltip>
                    <MUITooltip title="Save this mission for later" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleSaveJob(mission.id)}
                      >
                        Save
                      </Button>
                    </MUITooltip>
                    <MUITooltip title="Copy mission link" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toast.info("Link copied!")}
                      >
                        Share
                      </Button>
                    </MUITooltip>
                    <MUITooltip title="Start a chat about this mission" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleChat(mission)}
                      >
                        Chat
                      </Button>
                    </MUITooltip>
                  </div>
                </motion.div>
              ))
            )}
          </section>
        </div>

        {sortedMissions.length > itemsPerPage && (
  <div className={styles.paginationContainer}>
    <Button
      variant="outlined"
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <Button
      variant="outlined"
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
)}

      </div>
    </ThemeProvider>
  );
}

export default SearchMission;