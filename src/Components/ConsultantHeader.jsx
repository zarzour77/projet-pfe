import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ConsultantHeader.module.css";

const ConsultantHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    // Supprimez les données de l'utilisateur (par exemple, pour la déconnexion)
    localStorage.removeItem("user");
    // Redirigez vers la page de login (ajustez la route si nécessaire)
    navigate("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          {/* Section gauche : Toggle de la sidebar */}
          <div className={styles.leftSection}>
            <button className={styles.sidebarToggle} onClick={toggleSidebar}>
              <div className={styles.hamburger}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
              </div>
            </button>
          </div>

          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/SearchMission">Trade for talent</Link>
          </div>

          {/* Section centre : Barre de recherche */}
          <div className={styles.centerSection}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Search missions..." />
              <button className={styles.searchButton}>Search</button>
            </div>
          </div>

          {/* Section droite : Chat, Notification, Profil et Déconnexion */}
          <div className={styles.rightSection}>
            <button
              className={styles.iconButton}
              onClick={() => navigate("/Messenger")}
            >
              <i className="fa fa-comment"></i>
            </button>

            <button
              className={styles.iconButton}
              onClick={() => navigate("/notification")}
            >
              <i className="fa fa-bell"></i>
            </button>

            <button
              className={styles.profileButton}
              onClick={() => navigate("/profilePage")}
            >
              <img
                src={
                  JSON.parse(localStorage.getItem("user"))?.photoprofile ||
                  "default-avatar.png"
                }
                alt="Profile"
                className={styles.profileIcon}
              />
            </button>

            <button
              className={styles.deconnecterButton}
              onClick={handleLogout}
            >
              Déconnecter
            </button>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.active : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link to="/dashboard" onClick={toggleSidebar}>
                <span className={styles.icon}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/missions" onClick={toggleSidebar}>
                <span className={styles.icon}>📋</span> Missions
              </Link>
            </li>
            <li>
              <Link to="/ProfilePage" onClick={toggleSidebar}>
                <span className={styles.icon}>👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={toggleSidebar}>
                <span className={styles.icon}>⚙️</span> Settings
              </Link>
            </li>
            {/* Historique des transactions */}
            <li>
              <Link to="/transactions" onClick={toggleSidebar}>
                <span className={styles.icon}>🗃️</span> Transactions
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar} />
      )}
    </>
  );
};

export default ConsultantHeader;
