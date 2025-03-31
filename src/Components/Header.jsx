import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationService from "../Services/NotificationService";
import UserService from "../Services/UserService"; // Updated import
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const [fullUser, setFullUser] = useState(null);
  const storedUser = localStorage.getItem("user");
  const basicUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = fullUser?.id;
  const role = fullUser?.role;

  // Fetch user data using UserService
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      if (!basicUser?.id) return;
      
      try {
        const fetchedData = await UserService.getById(basicUser.id);
        
        if (isMounted) {
          const updatedUser = { ...basicUser, ...fetchedData };
          setFullUser(updatedUser);
          if (JSON.stringify(updatedUser) !== JSON.stringify(basicUser)) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (basicUser?.id) {
      fetchUserData();
    }

    return () => { isMounted = false };
  }, [basicUser?.id]);

  // State for notifications and dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const [openMenuId, setOpenMenuId] = useState(null); // which notification menu is open
  const [showMarkAllMenu, setShowMarkAllMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    if (userId) {
      try {
        const data = await notificationService.getNotifications(userId);
        // Sort notifications in descending order by date
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications", error);
      }
    }
  };

  useEffect(() => {
    if (showNotifications && userId) {
      fetchNotifications();
    }
  }, [showNotifications, userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.readStatus);
      await Promise.all(
        unreadNotifications.map(n => notificationService.markAsRead(n.id))
      );
      fetchNotifications();
      setShowMarkAllMenu(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications", error);
    }
  };

  // Mark individual notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      setOpenMenuId(null); // close the options menu
    } catch (error) {
      console.error("Erreur lors du marquage comme lu", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification", error);
    }
  };

  // Format date for display
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

  // Filter notifications based on readStatus
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.readStatus);

  // Paginate notifications
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showNotifications) {
      setOpenMenuId(null);
    }
  };

  // Toggle profile dropdown
  const toggleProfileMenu = () => setShowProfileMenu(prev => !prev);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close notifications when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Close options menu or "mark all" menu if clicked outside
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
    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => document.removeEventListener('mousedown', handleMenuClickOutside);
  }, [openMenuId, showMarkAllMenu]);

  // Close profile dropdown when clicking outside
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
      document.addEventListener('mousedown', handleClickOutsideProfile);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideProfile);
  }, [showProfileMenu]);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>

          {/* Left: Logo */}
          <div className={styles.leftSection}>
            <div className={styles.logo}>
              <Link to={role === "Entreprise" ? "/EntrepriseMission" : "/SearchMission"}>
                Trade for talent
              </Link>
            </div>
          </div>

          {/* Center: Nav links with new dropdown for "Manage Finances" */}
          <div className={styles.centerSection}>
            <ul className={styles.navLinks}>
              {role === "Admin" ? (
                <>
                  <li>
                    <Link to="/admin-dashboard">Dashboard</Link>
                  </li>
                  <li className={styles.dropdown}>
                    <span className={styles.dropdownTitle}>Management</span>
                    <ul className={styles.dropdownMenu}>
                      <li><Link to="/manage-users">Users</Link></li>
                      <li><Link to="/manage-missions">Missions</Link></li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  {role === "Entreprise" ? (
                    fullUser?.typeEntreprise === "CLIENTE" ? (
                      <li>
                        <Link to="/landingEntreprise">Find Talent</Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/SearchMission">Find Work</Link>
                      </li>
                    )
                  ) : (
                    <li>
                      <Link to="/SearchMission">Find Work</Link>
                    </li>
                  )}

                  {role === "Entreprise" && fullUser?.typeEntreprise !== "SSI" && 
                   fullUser?.typeEntreprise !== "Cliente" && (
                    <li className={styles.dropdown}>
                      <span className={styles.dropdownTitle}>Missions</span>
                      <ul className={styles.dropdownMenu}>
                        <li><Link to="/publierMission">Publier une mission</Link></li>
                        <li><Link to="/EntrepriseMission">Mes Missions</Link></li>
                      </ul>
                    </li>
                  )}

                  {role === "Entreprise" && fullUser?.typeEntreprise === "SSI" && (
                    <li>
                      <Link to="/CollaboratorsList">Collaborators</Link>
                    </li>
                  )}

                  {role === "Consultant" && (
                    <li>
                      <Link to="/ConsultantPropositions">Mes Propositions</Link>
                    </li>
                  )}
                </>
              )}

              {/* Finance dropdown for all roles except Admin */}
              
                <li className={styles.dropdown}>
                  <span className={styles.dropdownTitle}>Manage Finances</span>
                  <ul className={styles.dropdownMenu}>
                    <li><Link to="/transactions">Transactions</Link></li>
                  </ul>
                </li>
             
            </ul>
          </div>



          {/* Right: Search, Messages, Notifications, Profile */}
          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Search missions..." />
              <button className={styles.searchButton}>Search</button>
            </div>

            {/* Messages */}
            <button
              className={styles.iconButton}
              onClick={() => navigate("/Messenger")}
            >
              <i className="fa fa-comment"></i>
            </button>

            {/* Notifications */}
            <button className={styles.iconButton} onClick={toggleNotifications}>
              <div className={styles.notificationIconContainer}>
                <i className="fa fa-bell"></i>
                {notifications.filter(n => !n.readStatus).length > 0 && (
                  <span className={styles.notificationBadge}>
                    {Math.min(notifications.filter(n => !n.readStatus).length, 9)}
                    {notifications.filter(n => !n.readStatus).length > 9 && "+"}
                  </span>
                )}
              </div>
            </button>

            {/* Profile */}
            <button
              className={styles.profileButton}
              onClick={toggleProfileMenu}
            >
              <img
                src={fullUser?.photoprofile || "default-avatar.png"}
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
                src={fullUser?.photoprofile || "default-avatar.png"}
                alt="Profile"
                className={styles.profileHeaderImage}
              />
              <div className={styles.profileHeaderInfo}>
                <h4 className={styles.userName}>
                  {fullUser?.prenom} {fullUser?.nom}
                </h4>
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
              <i className="fa fa-user"></i> Your profile
            </button> )}
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/settings");
              }}
            >
              <i className="fa fa-cog"></i> Account settings
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                handleLogout();
              }}
            >
              <i className="fa fa-sign-out-alt"></i> Log out
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
                      Mark all as read
                    </button>
                    <button
                      onClick={() => {
                        navigate('/notification');
                        setShowMarkAllMenu(false);
                      }}
                    >
                      <i className="fas fa-list me-2"></i>
                      See notifications
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
                <div className={styles.noNotifications}>
                  Aucune notification.
                </div>
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
                      {/* Ellipsis button */}
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

                      {/* Options menu */}
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
                <button
                  className={styles.loadMoreButton}
                  onClick={() => setVisibleCount(visibleCount + 5)}
                >
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