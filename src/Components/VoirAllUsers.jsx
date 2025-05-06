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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import VoirAllUsersService from "../services/VoirAllUsersService";
import { useSearchParams } from "react-router-dom";

const VoirAllUsers = () => {
  // États pour stocker les utilisateurs, filtres et pagination
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
  const [searchParams] = useSearchParams();

  // États pour les modaux : modification et suspension
  const [modalOpen, setModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Formulaire de modification (existant)
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Etat pour la date de suspension (modal suspension)
  const [suspendDate, setSuspendDate] = useState("");

  // Chargement des utilisateurs lors de l'initialisation
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setSelectedRole(role);
    } else {
      setSelectedRole("");
    }
  }, [searchParams]);
  const fetchUsers = async () => {
    try {
      const allUsers = await VoirAllUsersService.fetchAllUsers();
      console.log("[fetchUsers] Données reçues de l'API :", allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  // Filtrage par nom et rôle
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    const matchName = fullName.includes(searchText.toLowerCase());
    let roleDisplay = user.role;
    if (user.role === "Entreprise") {
      if (user.typeEntreprise === "CLIENTE") {
        roleDisplay = "Entreprise Cliente";
      } else if (user.typeEntreprise === "SSI") {
        roleDisplay = "Entreprise SSI";
      } else {
        roleDisplay = "Entreprise";
      }
    }
    user.roleDisplay = roleDisplay;
    const matchRole = selectedRole === "" || 
      (selectedRole === "Entreprise" ? user.role === "Entreprise" : roleDisplay === selectedRole);
    return matchName && matchRole;
  });
  const getTitle = () => {
    switch (selectedRole) {
      case "Consultant":
        return "Gestion des Consultants";
      case "Entreprise":
        return "Gestion des Entreprises";
      case "Entreprise Cliente":
        return "Gestion des Entreprises Clientes";
      case "Entreprise SSI":
        return "Gestion des Entreprises SSI";
      default:
        return "Gestion des Utilisateurs";
    }
  };
  // Pagination
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Gestion du modal de modification
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
    if (passwordData.newPassword !== "" || passwordData.confirmPassword !== "") {
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
    if (passwordData.newPassword !== "") {
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
        message: `Erreur lors de la mise à jour.`,
        severity: "error",
      });
    }
  };

  // Gestion du modal de suspension
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
        message: `Erreur lors de la suspension.`,
        severity: "error",
      });
    }
  };

  // Gestion pour lever la suspension (unsuspend)
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
      console.error(`Erreur lors de la levée de suspension de l'utilisateur ${user.id}`, error);
      setSnackbar({
        open: true,
        message: `Erreur lors de la levée de la suspension.`,
        severity: "error",
      });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Animation pour l'apparition des lignes du tableau
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Fonction utilitaire pour vérifier la suspension : true si l'utilisateur est suspendu et la suspension n'est pas expirée
  const isUserSuspended = (user) => {
    if (user.suspendedUntil) {
      const suspendedUntilDate = new Date(user.suspendedUntil);
      return new Date() < suspendedUntilDate;
    }
    return false;
  };

  return (
    <div className={styles.container}>


      {/* Entête */}
      <header className={styles.header}>
      <h1 className={styles.title}>{getTitle()}</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSnackbar({
              open: true,
              message: "Ajout d'un nouvel utilisateur.",
              severity: "success",
            });
          }}
          className={styles.addButton}
        >
          Ajouter un utilisateur
        </Button>
      </header>

      {/* Filtres de recherche */}
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
  }}
  className={styles.roleSelect}
>
  <MenuItem value="">Tous les rôles</MenuItem>
  <MenuItem value="Consultant">Consultant</MenuItem>
  <MenuItem value="Entreprise">Entreprise</MenuItem>
  <MenuItem value="Entreprise Cliente">Entreprise Cliente</MenuItem>
  <MenuItem value="Entreprise SSI">Entreprise SSI</MenuItem>
</Select>
      </div>

      {/* Tableau des utilisateurs */}
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

      {/* Pagination */}
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

      {/* Snackbar pour feedback */}
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

      {/* Modal de modification existant */}
      <Dialog open={modalOpen} onClose={closeUpdateModal}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleUpdateChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleUpdateChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleUpdateChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Nouveau Mot de Passe"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Confirmer le Mot de Passe"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="dense"
          />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateModal} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de suspension */}
      <Dialog open={suspendModalOpen} onClose={closeSuspendModal}>
        <DialogTitle>Suspendre l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Date de suspension"
            type="datetime-local"
            value={suspendDate}
            onChange={(e) => setSuspendDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuspendModal} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSuspendSubmit} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoirAllUsers;