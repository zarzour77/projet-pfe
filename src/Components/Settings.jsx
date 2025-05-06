/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Services/UserService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Settings.module.css";

const Settings = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmail, setNewEmail] = useState(storedUser.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    try {
      const response = await UserService.updateUser(storedUser.id, { email: newEmail });
      if (response.reAuth) {
        toast.success("Profil mis à jour avec succès!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Erreur lors de la mise à jour de l'email");
    } finally {
      setLoadingEmail(false);
      setShowEmailModal(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setLoadingPassword(true);
    try {
      await UserService.updateUser(storedUser.id, { password: newPassword });
      toast.success("Mot de passe mis à jour avec succès!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoadingPassword(false);
      setShowPasswordModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Paramètres du Compte</h2>
      <p className={styles.subtitle}>Gérez vos informations de compte</p>

      <div className={styles.infoSection}>
        <div className={styles.infoRow}>
          <label className={styles.infoLabel}>Adresse Email</label>
          <div className={styles.emailWrapper}>
            <input 
              type="text" 
              className={styles.readOnlyInput} 
              value={storedUser.email || ""} 
              readOnly 
            />
            <button 
              className={styles.editIconButton}
              onClick={() => setShowEmailModal(true)}
              aria-label="Modifier l'email"
            >
              <svg className={styles.editIcon} viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button 
          className={styles.actionButton} 
          onClick={() => setShowPasswordModal(true)}
        >
          Modifier le Mot de Passe
        </button>
      </div>

      <button className={styles.cancelButton} onClick={() => navigate(storedUser.role === 'Entreprise' ? "/EntrepriseProfilePage" : "/ProfilePage")}>
      ← Retour au Profil
      </button>

      {/* Email Modal */}
      {showEmailModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Modifier l'Email</h3>
            <form onSubmit={handleEmailSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Nouvel Email</label>
                <input 
                  type="email" 
                  className={styles.modalInput}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className={styles.modalButtons}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowEmailModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton} 
                  disabled={loadingEmail}
                >
                  {loadingEmail ? "En cours..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Réinitialisation du Mot de Passe</h3>
            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Nouveau Mot de Passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.modalInput}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Confirmer le Mot de Passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.modalInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.passwordToggle}>
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword">Afficher le mot de passe</label>
              </div>
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loadingPassword}
                >
                  {loadingPassword ? "En cours..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Settings;