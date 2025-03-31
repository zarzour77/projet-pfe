import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { FaList, FaTh } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material‑UI components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Services et navigation
import { useNavigate } from 'react-router-dom';
import DomaineService from '../Services/DomaineService';
import {
  applyToMission,
  getMissions,
  getMissionsByBudgetRange,
  getMissionsByDomaine,
  getMissionsByDureeEstime,
  getMissionsByExperience,
  getMissionsByPorteDeTravail,
  getSavedMissions,
  saveMissionForConsultant,
  applyWithConsultant, // nouvelle fonction pour l'API entreprise SSI
  createProfileView 
} from '../services/SearchMission';
import ConsultantService from '../Services/ConsultantService';
import EntrepriseService from '../services/EntrepriseService';

import styles from './SearchMission.module.css';

const theme = createTheme({
  palette: {
    primary: { main: "#009990" },
    secondary: { main: "#074799" },
    background: { default: "#E1FFBB" },
    text: { primary: "#001A6E" }
  },
  typography: { fontFamily: "Arial, sans-serif" },
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
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [missions, setMissions] = useState([]);
  const [domainesOptions, setDomainesOptions] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [showSaved, setShowSaved] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour le modal d'application
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [propositionMontant, setPropositionMontant] = useState('');
  const [propositionDuree, setPropositionDuree] = useState('');
  const [propositionMessage, setPropositionMessage] = useState('');

  // Stockage d'informations supplémentaires
  const [consultant, setConsultant] = useState(null);
  const [enterpriseConsultants, setEnterpriseConsultants] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");

  // Récupération de l'utilisateur lors du montage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.error("Utilisateur non trouvé");
      return;
    }
    // Si l'utilisateur est CONSULTANT, charger ses infos
    if (storedUser.role === "Consultant") {
      const consultantId = storedUser.user?.id || storedUser.id;
      if (!consultantId) {
        toast.error("Consultant introuvable");
        return;
      }
      ConsultantService.getConsultantById(consultantId)
        .then(data => setConsultant(data))
        .catch(error => {
          console.error("[ERROR] Erreur lors de la récupération du consultant :", error);
          toast.error("Erreur lors de la récupération du consultant");
        });
    }
    // Si l'utilisateur est une Entreprise SSI, charger la liste de ses consultants disponibles
    else if (storedUser.role === "Entreprise") {
      const entrepriseId = storedUser.user?.id || storedUser.id;
      EntrepriseService.getConsultantsForEntreprise(entrepriseId)
        .then(data => setEnterpriseConsultants(data))
        .catch(error => {
          console.error("[ERROR] Erreur lors de la récupération des consultants :", error);
          toast.error("Erreur lors de la récupération des consultants");
        });
    }
  }, []);

  // Chargement des domaines
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const data = await DomaineService.getAllDomaines();
        setDomainesOptions(data);
      } catch (error) {
        console.error("[ERROR] Erreur lors du chargement des domaines", error);
      }
    };
    fetchDomaines();
  }, []);

  // Chargement des missions (filtres ou sauvegardées)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error("Consultant introuvable");
      return;
    }
    
    if (showSaved) {
      setIsLoading(true);
      getSavedMissions(consultantId)
        .then(data => {
          setMissions(data);
          setIsLoading(false);
          setCurrentPage(1);
        })
        .catch(error => {
          console.error("[ERROR] Erreur lors de la récupération des missions sauvegardées :", error);
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
        let filtered = data;
        if (experience && !selectedDomaine) {
          filtered = filtered.filter(m =>
            m.niveauExperienceRequis &&
            m.niveauExperienceRequis.toLowerCase() === experience.toLowerCase()
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
        console.error("[ERROR] Erreur lors du chargement des missions :", error);
        toast.error("Erreur lors du chargement des missions");
        setIsLoading(false);
      });
  }, [selectedDomaine, experience, portetravail, budgetRange, dureeEstime, showSaved]);

  // Filtrage par mot-clé
  const filteredMissionsList = missions.filter(mission => {
    if (!searchKeyword) return true;
    const lowerKeyword = searchKeyword.toLowerCase();
    return (
      mission.titre.toLowerCase().includes(lowerKeyword) ||
      mission.description.toLowerCase().includes(lowerKeyword) ||
      (mission.domaines && mission.domaines.some(d => d.nom.toLowerCase().includes(lowerKeyword))) ||
      (mission.competencesRequises && mission.competencesRequises.some(c => c.nom.toLowerCase().includes(lowerKeyword)))
    );
  });

  // Tri par date de publication
  const sortedMissions = [...filteredMissionsList].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return sortOption === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMissions = sortedMissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMissions.length / itemsPerPage);

  const clearFilters = () => {
    setSelectedDomaine('');
    setExperience('');
    setPorteDeTravail('');
    setBudgetRange('');
    setDureeEstime('');
    setSearchKeyword('');
  };

  // Sauvegarde d'une mission
  const handleSaveJob = (missionId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error("Consultant introuvable");
      return;
    }
    saveMissionForConsultant(consultantId, missionId)
      .then(() => toast.success("Mission sauvegardée !"))
      .catch(error => {
        console.error("[ERROR] Erreur lors de la sauvegarde de la mission :", error);
        toast.error("Erreur lors de la sauvegarde de la mission");
      });
  };
  const handleProfileClick = (mission) => {
    // On suppose que la mission contient une propriété "entreprise" qui est un objet avec un "id"
    console.log(mission)
    const entrepriseId = mission.entreprise;
    if (!entrepriseId) {
      toast.error("Aucune entreprise associée à cette mission.");
      return;
    }
    createProfileView(entrepriseId)
      .then((profileView) => {
        toast.success("Profile view créée !");
        // Vous pouvez ici rediriger l'utilisateur ou afficher les détails du profileview
      })
      .catch((error) => {
        console.error("[ERROR] Erreur lors de la création du profile view :", error);
        toast.error("Erreur lors de la création du profile view");
      });
  };
  // Bascule entre missions normales et sauvegardées
  const handleShowSavedMissions = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const consultantId = storedUser?.user?.id || storedUser?.id;
    if (!consultantId) {
      toast.error("Consultant introuvable");
      return;
    }
    if (showSaved) {
      setShowSaved(false);
      getMissions()
        .then(data => setMissions(data))
        .catch(error => {
          console.error("[ERROR] Erreur lors de la récupération des missions :", error);
          toast.error("Erreur lors de la récupération des missions");
        });
    } else {
      getSavedMissions(consultantId)
        .then(data => {
          setMissions(data);
          setShowSaved(true);
        })
        .catch(error => {
          console.error("[ERROR] Erreur lors de la récupération des missions sauvegardées :", error);
          toast.error("Erreur lors de la récupération des missions sauvegardées");
        });
    }
  };

  // Ouvre le modal d'application
  const handleApplyClick = (mission) => {
    setSelectedMission(mission);
    setPropositionMontant(mission.budget);
    setPropositionDuree(mission.dureeEstime);
    setShowApplyModal(true);
  };

  // Ferme le modal d'application
  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setSelectedMission(null);
    setPropositionMontant('');
    setPropositionDuree('');
    setPropositionMessage('');
    setSelectedConsultantId('');
  };

  // Envoi de la proposition via l'API
  const handleSubmitProposition = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      toast.error("Utilisateur non trouvé");
      return;
    }
    const isConsultant = (storedUser.user?.role || storedUser.role) === "Consultant";
    const isEntreprise = (storedUser.user?.role || storedUser.role) === "Entreprise";
    const proposerId = storedUser.user?.id || storedUser.id;
    if (!proposerId) {
      toast.error("ID utilisateur introuvable");
      return;
    }
    
    if (isConsultant) {
      // Cas classique pour consultant
      const propositionData = {
        consultant: { id: proposerId },
        mission: { id: selectedMission.id },
        montant: parseFloat(propositionMontant),
        dureeEstime: propositionDuree,
        message: propositionMessage,
        statut: "PENDING",
        origine: "APPLIED",
      };
      applyToMission(proposerId, null, propositionData)
        .then(() => {
          toast.success("Proposition envoyée !");
          handleCloseApplyModal();
        })
        .catch(error => {
          console.error("[ERROR] Erreur lors de l'envoi de la proposition :", error);
          toast.error("Erreur lors de l'envoi de la proposition.");
        });
    } else if (isEntreprise) {
      // Vérifier qu'un consultant est sélectionné
      if (!selectedConsultantId) {
        toast.error("Veuillez sélectionner un consultant");
        return;
      }
      // Appel de la nouvelle API pour entreprise SSI
      applyWithConsultant(proposerId, selectedMission.id, selectedConsultantId, parseFloat(propositionMontant), propositionDuree, propositionMessage)
        .then(() => {
          toast.success("Proposition envoyée !");
          handleCloseApplyModal();
        })
        .catch(error => {
          console.error("[ERROR] Erreur lors de l'envoi de la proposition :", error);
          toast.error("Erreur lors de l'envoi de la proposition.");
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.searchMissionContainer}>
        <ToastContainer />

        {/* Barre de recherche */}
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

        {/* Barre de contrôle */}
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

        {/* Contenu principal */}
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
                  {domainesOptions.map(dom => (
                    <MenuItem key={dom.id} value={dom.id}>{dom.nom}</MenuItem>
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
                <img src="https://undraw.co/api/illustrations/searching.svg" alt="No missions found" />
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
                      {mission.entreprise ? (mission.entreprise.nom || mission.entreprise) : "Unknown"}
                    </span>
                    <span className={styles.published}>
                      Published{" "}
                      {mission.publishedAt && !isNaN(new Date(mission.publishedAt).getTime())
                        ? formatDistanceToNow(new Date(mission.publishedAt), { addSuffix: true })
                        : "N/A"}
                    </span>
                    <span className={styles.propositionsCount}>
                      {mission.propositionsCount} proposition{mission.propositionsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.jobTags}>
                    {mission.domaines && mission.domaines.map((d, i) => (
                      <span key={i} className={styles.tag}>{d.nom}</span>
                    ))}
                    {mission.competencesRequises && mission.competencesRequises.map((c, i) => (
                      <span key={i} className={styles.tag}>{c.nom}</span>
                    ))}
                  </div>
                  <p className={styles.jobDescription}>{mission.description}</p>
                  <div className={styles.actionButtons}>
                    {consultant?.typeConsultant !== 'ENTREPRISE_SSI' && (
                      <MUITooltip title="Apply for this mission" arrow>
                        <Button variant="contained" size="small" onClick={() => handleApplyClick(mission)}>
                          Apply
                        </Button>
                      </MUITooltip>
                    )}
                    <MUITooltip title="Save this mission for later" arrow>
                      <Button variant="outlined" size="small" onClick={() => handleSaveJob(mission.id)}>
                        Save
                      </Button>
                    </MUITooltip>
                    <MUITooltip title="Copy mission link" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          console.log("[INFO] Copie du lien de la mission :", mission.id);
                          toast.info("Link copied!");
                        }}
                      >
                        Share
                      </Button>
                      </MUITooltip>
                      <MUITooltip title="View Profile" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleProfileClick(mission)}
                      >
                        Profile
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
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {showApplyModal && selectedMission && (
          <Dialog open={true} onClose={handleCloseApplyModal}>
            <DialogTitle>Postuler à la mission : {selectedMission.titre}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Montant proposé"
                type="number"
                fullWidth
                value={propositionMontant}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Durée estimée"
                type="text"
                fullWidth
                value={propositionDuree}
                InputProps={{ readOnly: true }}
                helperText="Ex: 3 mois"
              />
              {/* Affichage du select des consultants si l'utilisateur est une entreprise SSI */}
              {JSON.parse(localStorage.getItem("user")).role === "Entreprise" && (
                <Select
                  fullWidth
                  value={selectedConsultantId}
                  onChange={(e) => setSelectedConsultantId(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Sélectionnez un consultant
                  </MenuItem>
                  {enterpriseConsultants.map(consult => (
                    <MenuItem key={consult.id} value={consult.id}>
                      {consult.nom} {consult.prenom}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <TextField
                margin="dense"
                label="Votre message"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={propositionMessage}
                onChange={(e) => setPropositionMessage(e.target.value)}
                helperText="Expliquez brièvement votre proposition"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseApplyModal} color="primary">
                Annuler
              </Button>
              <Button onClick={handleSubmitProposition} color="primary">
                Envoyer la proposition
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </ThemeProvider>
  );
}

export default SearchMission;
