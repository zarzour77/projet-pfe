import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationService from "../Services/NotificationService";
// Instead of fetching generic user data, we use these based on role
import EntrepriseService from "../Services/EntrepriseService";
import ConsultantService from "../Services/ConsultantService";
import styles from "./Header.module.css";
import UserService from "../Services/UserService";
import logo from '../assets/TradeForTalentIcon.svg'

const Header = () => {
  const navigate = useNavigate();

  // Initialize state with basicUser data immediately so the header can render
  const storedUser = localStorage.getItem("user");
  const basicUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(basicUser);
  const userId = user?.id;
  const role = basicUser?.role; // role from basic data is used for initial render

  // Fetch extended user data in background and update state when available
  useEffect(() => {
    let isMounted = true;
    const fetchExtendedUser = async () => {
      if (!basicUser?.id) return;
      try {
        let fetchedUser = null;
        if (basicUser.role === "Entreprise") {
          fetchedUser = await EntrepriseService.getEntrepriseById(basicUser.id);
        } else if (basicUser.role === "Consultant") {
          fetchedUser = await ConsultantService.getConsultantById(basicUser.id);
        } else if (basicUser.role === "Admin") {
          fetchedUser = await UserService.getById(basicUser.id);
        }
        if (isMounted && fetchedUser) {
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        }
      } catch (error) {
        console.error("Error fetching extended user details:", error);
      }
    };

    fetchExtendedUser();
    return () => {
      isMounted = false;
    };
  }, [basicUser?.id]);

  // Notification state and fetching
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showMarkAllMenu, setShowMarkAllMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchNotifications = async () => {
    if (userId) {
      try {
        const data = await notificationService.getNotifications(userId);
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications", error);
      }
    }
  };

  // Fetch notifications when userId is available or when notifications dropdown opens.
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
      setOpenMenuId(null);
    }
  }, [showNotifications, userId]);

  // Handlers for marking and deleting notifications
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.readStatus);
      await Promise.all(
        unreadNotifications.map((n) => notificationService.markAsRead(n.id))
      );
      fetchNotifications();
      setShowMarkAllMenu(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Erreur lors du marquage comme lu", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification", error);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.readStatus);
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showNotifications) setOpenMenuId(null);
  };

  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  const notificationsRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.iconButton}`)
      ) {
        setShowNotifications(false);
        setOpenMenuId(null);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const handleMenuClickOutside = (e) => {
      if (
        (openMenuId !== null &&
          !e.target.closest(`.${styles.notificationOptionsMenu}`) &&
          !e.target.closest(`.${styles.optionsButton}`)) ||
        (showMarkAllMenu &&
          !e.target.closest(`.${styles.markAllOptionsMenu}`) &&
          !e.target.closest(`.${styles.optionsButton}`))
      ) {
        setOpenMenuId(null);
        setShowMarkAllMenu(false);
      }
    };
    document.addEventListener("mousedown", handleMenuClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    };
  }, [openMenuId, showMarkAllMenu]);

  const profileMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutsideProfile = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.profileButton}`)
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutsideProfile);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, [showProfileMenu]);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          {/* Left: Logo */}
          <div className={styles.leftSection}>
          <div className={styles.logo}>
  <Link to={role === "Entreprise" ? "/landingEntreprise" : "/SearchMission"}>
    <img 
      src={logo}
      alt="Trade for Talent Logo"
      className={styles.logoImage}
    />
  </Link>
</div>
          </div>

          {/* Center: Navigation links */}
          <div className={styles.centerSection}>
            <ul className={styles.navLinks}>
              {role === "Admin" ? (
                <>
                  <li>
                    <Link to="/StatAdmin">Dashboard</Link>
                  </li>
                  <li className={styles.dropdown}>
                    <span className={styles.dropdownTitle}>Management</span>
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <Link to="/manage-users">Utilisateurs</Link>
                      </li>
                      <li>
                        <Link to="/manage-missions">Missions</Link>
                      </li>
                      <li>
                        <Link to="/transactions">Transactions</Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : role === "Entreprise" ? (
                <>
                  <li>
                    <Link to="/StatEntreprise">Dashboard</Link>
                  </li>
                  {user?.typeEntreprise === "CLIENTE" ? (
                    <>
                      <li className={styles.dropdown}>
                        <span className={styles.dropdownTitle}>Missions</span>
                        <ul className={styles.dropdownMenu}>
                          <li>
                            <Link to="/publierMission">Publier une mission</Link>
                          </li>
                          <li>
                            <Link to="/EntrepriseMission">Mes Missions</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to="/landingEntreprise">Trouver des talents</Link>
                      </li>
                    </>
                  ) : user?.typeEntreprise === "SSI" ? (
                    <>
                      <li className={styles.dropdown}>
                        <span className={styles.dropdownTitle}>Consultants</span>
                        <ul className={styles.dropdownMenu}>
                          <li>
                            <Link to="/collaboratorsList">Collaborateurs</Link>
                          </li>
                          <li>
                            <Link to="/landingEntreprise">Voir les consultants</Link>
                          </li>
                          <li>
                            <Link to="/SearchMission">Attribuer des missions</Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/landingEntreprise">Trouver des talents</Link>
                    </li>
                  )}
                </>
              ) : role === "Consultant" ? (
                <>
                  <li>
                    <Link to="/StatConsultant">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/SearchMission">Trouver un emploi</Link>
                  </li>
                  <li>
                    <Link to="/ConsultantPropositions">Mes Propositions</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/SearchMission">Trouver un emploi</Link>
                </li>
              )}

              {/* Finance Dropdown for all non-admin roles */}
              <li className={styles.dropdown}>
                <span className={styles.dropdownTitle}>Gestion Finances</span>
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link to="/transactions">Transactions</Link>
                  </li>
                  {role === "Admin" && (
                    <li>
                      <Link to="/financial-reports">Rapports</Link>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>

          {/* Right: Search, Messages, Notifications, Profile */}
          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Rechercher des missions..." />
              <button className={styles.searchButton}>Rechercher</button>
            </div>

            <button className={styles.iconButton} onClick={() => navigate("/Messenger")}>
              <i className="fa fa-comment"></i>
            </button>

            <button className={styles.iconButton} onClick={toggleNotifications}>
              <div className={styles.notificationIconContainer}>
                <i className="fa fa-bell"></i>
                {notifications.filter((n) => !n.readStatus).length > 0 && (
                  <span className={styles.notificationBadge}>
                    {Math.min(notifications.filter((n) => !n.readStatus).length, 9)}
                    {notifications.filter((n) => !n.readStatus).length > 9 && "+"}
                  </span>
                )}
              </div>
            </button>

            <button className={styles.profileButton} onClick={toggleProfileMenu}>
              <img
                src={user?.photoprofile || "default-avatar.png"}
                alt="Profile"
                className={styles.profileIcon}
              />
            </button>
          </div>
        </nav>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className={styles.profileDropdown} ref={profileMenuRef}>
            <div className={styles.profileHeader}>
              <img
                src={user?.photoprofile || "default-avatar.png"}
                alt="Profile"
                className={styles.profileHeaderImage}
              />
              <div className={styles.profileHeaderInfo}>
                <h4 className={styles.userName}>{user?.prenom} {user?.nom}</h4>
                <p className={styles.userRole}>
                  {role === "Admin" ? "Admin" : role === "Consultant" ? "Freelancer" : "Entreprise"}
                </p>
              </div>
            </div>
            <div className={styles.dropdownDivider}></div>
            {role !== "Admin" && (
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(role === "Entreprise" ? "/EntrepriseProfilePage" : "/ProfilePage");
                }}
              >
                <i className="fa fa-user"></i> Votre profil
              </button>
            )}
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/settings");
              }}
            >
              <i className="fa fa-cog"></i> Paramètres
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                handleLogout();
              }}
            >
              <i className="fa fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        )}

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className={styles.notificationsDropdown} ref={notificationsRef}>
            <div className={styles.notificationsHeader}>
              <h4>Notifications</h4>
              <div className={styles.headerRight}>
                <button
                  className={styles.optionsButton}
                  onClick={() => setShowMarkAllMenu(!showMarkAllMenu)}
                >
                  <i className="fa fa-ellipsis-h"></i>
                </button>
                {showMarkAllMenu && (
                  <div className={styles.markAllOptionsMenu}>
                    <button onClick={handleMarkAllAsRead}>
                      <i className="fas fa-check me-2"></i>
                      Tout marquer comme lu
                    </button>
                    <button
                      onClick={() => {
                        navigate("/notification");
                        setShowMarkAllMenu(false);
                      }}
                    >
                      <i className="fas fa-list me-2"></i>
                      Voir toutes les notifications
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.notificationsFilter}>
              <button
                className={`${styles.filterButton} ${filter === "all" ? styles.activeFilter : ""}`}
                onClick={() => setFilter("all")}
              >
                Tout
              </button>
              <button
                className={`${styles.filterButton} ${filter === "unread" ? styles.activeFilter : ""}`}
                onClick={() => setFilter("unread")}
              >
                Non lus
              </button>
            </div>

            <div className={styles.notificationsContent}>
              {visibleNotifications.length === 0 ? (
                <div className={styles.noNotifications}>Aucune notification.</div>
              ) : (
                visibleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationCard} ${notification.readStatus ? styles.read : styles.unread}`}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.notificationBody}>
                      <i
                        className={`fa-solid ${notification.readStatus ? "fa-bell" : "fa-circle-exclamation"} fa-lg`}
                      ></i>
                      <div className={styles.notificationText}>
                        <h6>{notification.message}</h6>
                        <small>
                          <i className="fa-regular fa-clock me-1"></i>
                          {formatDate(notification.createdAt)}
                        </small>
                      </div>
                      <button
                        className={styles.optionsButton}
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === notification.id ? null : notification.id
                          )
                        }
                      >
                        <i className="fa fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === notification.id && (
                        <div className={styles.notificationOptionsMenu}>
                          {!notification.readStatus && (
                            <button onClick={() => handleMarkAsRead(notification.id)}>
                              <i className="fas fa-check me-2"></i>
                              Marquer comme lu
                            </button>
                          )}
                          <button onClick={() => handleDeleteNotification(notification.id)}>
                            <i className="fas fa-trash me-2"></i>
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredNotifications.length > visibleCount && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreButton} onClick={() => setVisibleCount(visibleCount + 5)}>
                  Voir plus
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;