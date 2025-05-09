/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect } from "react";
import styles from "./VoirAllUsers.module.css";
import { motion } from "framer-motion";
import {
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Pagination,
  Breadcrumbs,
  Link,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import VoirAllUsersService from "../services/VoirAllUsersService";
import AuthService from "../services/AuthService"; // Pour l'appel à signup

const VoirAllUsers = () => {
  // États pour les utilisateurs
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Nouvel état pour stocker les missions et leur pagination
  const [missions, setMissions] = useState([]);
  const [missionCurrentPage, setMissionCurrentPage] = useState(1);
  const missionsPerPage = 5;

  // États pour les modaux utilisateur
  const [modalOpen, setModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // États pour le formulaire de modification d'utilisateur
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Formulaire d'ajout d'utilisateur
  const [addFormData, setAddFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // États pour le modal de mise à jour d'une mission
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [missionFormData, setMissionFormData] = useState({
    titre: "",
    description: "",
    budget: "",
    statut: "",
  });

  // État pour la date de suspension (modal suspension)
  const [suspendDate, setSuspendDate] = useState("");

  // Fonction pour déterminer si un utilisateur est suspendu
  const isUserSuspended = (user) => {
    if (user.suspendedUntil) {
      const suspendedUntilDate = new Date(user.suspendedUntil);
      return new Date() < suspendedUntilDate;
    }
    return false;
  };

  // Chargement des utilisateurs (si le rôle sélectionné n'est pas Missions)
  useEffect(() => {
    if (selectedRole !== "Missions") {
      fetchUsers();
    }
  }, [selectedRole]);

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const allUsers = await VoirAllUsersService.fetchAllUsers();
      console.log("[fetchUsers] Données reçues de l'API :", allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  // Fonction pour récupérer les missions
  const fetchMissions = async () => {
    try {
      const fetchedMissions = await VoirAllUsersService.fetchMissions();
      console.log("[fetchMissions] Missions récupérées :", fetchedMissions);
      setMissions(fetchedMissions);
      setMissionCurrentPage(1);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions", error);
    }
  };

  // Filtrage des utilisateurs par nom et rôle
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    const matchName = fullName.includes(searchText.toLowerCase());
    let roleDisplay = user.role;
    if (user.role === "Entreprise") {
      if (user.typeEntreprise === "CLIENTE") roleDisplay = "Entreprise Cliente";
      else if (user.typeEntreprise === "SSI") roleDisplay = "Entreprise SSI";
      else roleDisplay = "Entreprise";
    }
    user.roleDisplay = roleDisplay;
    return matchName && (selectedRole === "" || roleDisplay === selectedRole);
  });

  // Pagination pour les utilisateurs
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Pagination pour les missions
  const missionPageCount = Math.ceil(missions.length / missionsPerPage);
  const indexOfLastMission = missionCurrentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = missions.slice(indexOfFirstMission, indexOfLastMission);

  const handleMissionPageChange = (event, value) => {
    setMissionCurrentPage(value);
  };

  // Gestion des modaux utilisateur
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setFormData({
      prenom: user.prenom || "",
      nom: user.nom || "",
      email: user.email || "",
    });
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setShowPassword(false);
    setModalOpen(true);
  };

  const closeUpdateModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSnackbar({
          open: true,
          message: "Les mots de passe ne correspondent pas.",
          severity: "error",
        });
        return;
      }
    }
    let updatedData = { ...formData };
    if (passwordData.newPassword) {
      updatedData = { ...updatedData, password: passwordData.newPassword };
    }
    try {
      await VoirAllUsersService.updateUser(selectedUser.id, updatedData);
      setSnackbar({
        open: true,
        message: `Mise à jour réussie pour l'utilisateur ${selectedUser.id}.`,
        severity: "success",
      });
      closeUpdateModal();
      fetchUsers();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${selectedUser.id}`, error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la mise à jour.",
        severity: "error",
      });
    }
  };

  // Ouverture et fermeture du modal d'ajout d'utilisateur
  const openAddModal = () => {
    setAddFormData({
      prenom: "",
      nom: "",
      telephone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async () => {
    if (addFormData.password !== addFormData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Les mots de passe ne correspondent pas.",
        severity: "error",
      });
      return;
    }
    const newUserData = {
      prenom: addFormData.prenom,
      nom: addFormData.nom,
      telephone: addFormData.telephone,
      email: addFormData.email,
      password: addFormData.password,
    };
    try {
      await AuthService.signup(newUserData);
      setSnackbar({
        open: true,
        message: "Utilisateur ajouté avec succès.",
        severity: "success",
      });
      closeAddModal();
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'ajout de l'utilisateur.",
        severity: "error",
      });
    }
  };

  // Modal de suspension d'utilisateur
  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setSuspendDate("");
    setSuspendModalOpen(true);
  };

  const closeSuspendModal = () => {
    setSuspendModalOpen(false);
    setSelectedUser(null);
    setSuspendDate("");
  };

  const handleSuspendSubmit = async () => {
    if (!suspendDate) {
      setSnackbar({
        open: true,
        message: "Veuillez sélectionner une date de suspension.",
        severity: "error",
      });
      return;
    }
    try {
      await VoirAllUsersService.suspendUser(selectedUser.id, suspendDate);
      setSnackbar({
        open: true,
        message: `Utilisateur suspendu jusqu'au ${suspendDate}.`,
        severity: "warning",
      });
      closeSuspendModal();
      fetchUsers();
    } catch (error) {
      console.error(`Erreur lors de la suspension de l'utilisateur ${selectedUser.id}`, error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suspension.",
        severity: "error",
      });
    }
  };

  // Levée de suspension d'utilisateur
  const handleUnsuspend = async (user) => {
    try {
      await VoirAllUsersService.unsuspendUser(user.id);
      setSnackbar({
        open: true,
        message: `Suspension levée pour l'utilisateur ${user.id}.`,
        severity: "success",
      });
      fetchUsers();
    } catch (error) {
      console.error(`Erreur lors de la levée de la suspension de l'utilisateur ${user.id}`, error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la levée de la suspension.",
        severity: "error",
      });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Modal de modification d'une mission
  const openMissionUpdateModal = (mission) => {
    setSelectedMission(mission);
    setMissionFormData({
      titre: mission.titre,
      description: mission.description,
      budget: mission.budget,
      statut: mission.statut,
    });
    setMissionModalOpen(true);
  };

  const closeMissionModal = () => {
    setMissionModalOpen(false);
    setSelectedMission(null);
  };

  const handleMissionFormChange = (e) => {
    setMissionFormData({ ...missionFormData, [e.target.name]: e.target.value });
  };

  const handleMissionUpdateSubmit = async () => {
    try {
      await VoirAllUsersService.updateMission(selectedMission.id, missionFormData);
      setSnackbar({
        open: true,
        message: `Mission ${selectedMission.id} mise à jour avec succès.`,
        severity: "success",
      });
      closeMissionModal();
      fetchMissions();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la mission ${selectedMission.id}`, error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la mise à jour de la mission.",
        severity: "error",
      });
    }
  };

  // Animation des lignes du tableau avec Framer Motion
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={styles.container}>
      {/* Navigation / Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Missions
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Utilisateurs
          </Link>
        </Breadcrumbs>
      </nav>

      {/* Entête */}
      <header className={styles.header}>
        <h1 className={styles.title}>Gestion des Utilisateurs</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={openAddModal}
          className={styles.addButton}
        >
          Ajouter un utilisateur
        </Button>
      </header>

      {/* Filtres */}
      <div className={styles.filters}>
        <TextField
          label="Rechercher par nom"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />
        <Select
          displayEmpty
          variant="outlined"
          size="small"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
            if (e.target.value === "Missions") fetchMissions();
          }}
          className={styles.roleSelect}
        >
          <MenuItem value="">Filter</MenuItem>
          <MenuItem value="Consultant">Consultant</MenuItem>
          <MenuItem value="Entreprise Cliente">Entreprise Cliente</MenuItem>
          <MenuItem value="Entreprise SSI">Entreprise SSI</MenuItem>
          <MenuItem value="Missions">Missions</MenuItem>
        </Select>
      </div>

      {/* Affichage conditionnel : Missions ou Utilisateurs */}
      {selectedRole === "Missions" ? (
        <div>
          <h2>Liste des missions</h2>
          <table className={styles.missionTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Budget</th>
                <th>Statut</th>
                <th>Published At</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {missions.length > 0 ? (
                currentMissions.map((mission) => (
                  <tr key={mission.id}>
                    <td>{mission.id}</td>
                    <td>{mission.titre}</td>
                    <td className={styles.descriptionCell}>{mission.description}</td>
                    <td>{mission.budget}</td>
                    <td>{mission.statut}</td>
                    <td>{new Date(mission.publishedAt).toLocaleString()}</td>
                    <td>
                      {mission.startdate
                        ? new Date(mission.startdate).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {mission.enddate
                        ? new Date(mission.enddate).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => openMissionUpdateModal(mission)}
                        >
                          Modifier
                        </button>
                        <button className={styles.actionButton}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.noResults}>
                    Aucune mission trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {missionPageCount > 1 && (
            <div className={styles.pagination}>
              <Pagination
                count={missionPageCount}
                page={missionCurrentPage}
                onChange={handleMissionPageChange}
                color="primary"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom complet</th>
                <th>Rôle</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    transition={{ duration: 0.3 }}
                    className={styles.userRow}
                  >
                    <td>{user.id}</td>
                    <td>{`${user.prenom} ${user.nom}`}</td>
                    <td>{user.roleDisplay}</td>
                    <td>{user.email}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => openUpdateModal(user)}
                      >
                        Modifier
                      </button>
                      {isUserSuspended(user) ? (
                        <button
                          className={styles.actionButton}
                          onClick={() => handleUnsuspend(user)}
                        >
                          Enlever suspendre
                        </button>
                      ) : (
                        <button
                          className={styles.actionButton}
                          onClick={() => openSuspendModal(user)}
                        >
                          Suspendre
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noResults}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pageCount > 1 && (
            <div className={styles.pagination}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal de modification d'utilisateur */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Modifier l'utilisateur</h3>
            <div className={styles.formGroup}>
              <TextField
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleUpdateChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleUpdateChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleUpdateChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Nouveau Mot de Passe"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Confirmer le Mot de Passe"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    color="primary"
                  />
                }
                label="Afficher le mot de passe"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={closeUpdateModal}>
                Annuler
              </button>
              <button type="button" onClick={handleUpdateSubmit}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification d'une mission */}
      {missionModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Modifier la mission</h3>
            <div className={styles.formGroup}>
              <TextField
                label="Titre"
                name="titre"
                value={missionFormData.titre}
                onChange={handleMissionFormChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Description"
                name="description"
                value={missionFormData.description}
                onChange={handleMissionFormChange}
                fullWidth
                margin="dense"
                multiline
                rows={4}
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Budget"
                name="budget"
                type="number"
                value={missionFormData.budget}
                onChange={handleMissionFormChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Statut"
                name="statut"
                value={missionFormData.statut}
                onChange={handleMissionFormChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={closeMissionModal}>
                Annuler
              </button>
              <button type="button" onClick={handleMissionUpdateSubmit}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout d'utilisateur */}
      {addModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Ajouter un utilisateur</h3>
            <div className={styles.formGroup}>
              <TextField
                label="Prénom"
                name="prenom"
                value={addFormData.prenom}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Nom"
                name="nom"
                value={addFormData.nom}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Téléphone"
                name="telephone"
                value={addFormData.telephone}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Email"
                name="email"
                value={addFormData.email}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Mot de passe"
                name="password"
                type="password"
                value={addFormData.password}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={addFormData.confirmPassword}
                onChange={handleAddChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={closeAddModal}>
                Annuler
              </button>
              <button type="button" onClick={handleAddSubmit}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suspension d'utilisateur */}
      {suspendModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Suspendre l'utilisateur</h3>
            <div className={styles.formGroup}>
              <TextField
                label="Date de suspension"
                type="datetime-local"
                value={suspendDate}
                onChange={(e) => setSuspendDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={closeSuspendModal}>
                Annuler
              </button>
              <button type="button" onClick={handleSuspendSubmit}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoirAllUsers;