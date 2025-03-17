import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import notificationService from "../Services/NotificationService";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState("all"); // "all" or "unread"
  const [openMenuId, setOpenMenuId] = useState(null); // track which notification menu is open
  const [showMarkAllMenu, setShowMarkAllMenu] = useState(false);

  const navigate = useNavigate();

  // Extract user info from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;
  const role = user?.role; // e.g., "CONSULTANT" or "Entreprise"

  // Fetch notifications for the user
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
  useEffect(() => {
    // Fetch notifications only when the dropdown is shown
    if (showNotifications && userId) {
      fetchNotifications();
    }
  }, [showNotifications, userId]);



  // Mark individual notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      setOpenMenuId(null); // close the menu
    } catch (error) {
      console.error("Erreur lors du marquage comme lu", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      setOpenMenuId(null); // close the menu
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

  // Filter notifications (all vs. unread)
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.readStatus);

  // Paginate
  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    // Reset open menu if we close the panel
    if (showNotifications) {
      setOpenMenuId(null);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]); 
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
        setOpenMenuId(null); // This remains to close menu when dropdown closes
      }
    };
  
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  
    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => document.removeEventListener('mousedown', handleMenuClickOutside);
  }, [openMenuId, showMarkAllMenu, styles]);
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          {/* Left Section: Sidebar Toggle */}
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

          {/* Center Section: Search Bar */}
          <div className={styles.centerSection}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Search missions..." />
              <button className={styles.searchButton}>Search</button>
            </div>
          </div>

          {/* Right Section: Chat, Notifications, Profile */}
          <div className={styles.rightSection}>
            <button
              className={styles.iconButton}
              onClick={() => navigate("/Messenger")}
            >
              <i className="fa fa-comment"></i>
            </button>

            {/* Clicking the bell toggles the notifications dropdown */}
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

            <button
              className={styles.profileButton}
              onClick={() =>
                navigate(
                  role === "Entreprise" ? "/EntrepriseProfilePage" : "/ProfilePage"
                )
              }
            >
              <img
                src={user?.photoprofile || "default-avatar.png"}
                alt="Profile"
                className={styles.profileIcon}
              />
            </button>
          </div>
        </nav>

        {/* Notifications Dropdown Panel */}
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
    <button onClick={() => {
      navigate('/notification');
      setShowMarkAllMenu(false);
    }}>
      <i className="fas fa-list me-2"></i>
      See notifications
    </button>
  </div>
)}
  </div>
</div>

            {/* Filter Buttons */}
            <div className={styles.notificationsFilter}>
              <button
                className={`${styles.filterButton} ${
                  filter === "all" ? styles.activeFilter : ""
                }`}
                onClick={() => setFilter("all")}
              >
                Tout
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "unread" ? styles.activeFilter : ""
                }`}
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
                    className={`${styles.notificationCard} ${
                      notification.readStatus ? styles.read : styles.unread
                    }`}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.notificationBody}>
                    <i className={`fa-solid ${notification.readStatus ? "fa-bell" : "fa-circle-exclamation"} fa-lg`}></i>                      <div className={styles.notificationText}>
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
      <button
        onClick={() => handleMarkAsRead(notification.id)}
      >
        <i className="fas fa-check me-2"></i>
        Marquer comme lu
      </button>
    )}
    <button
      onClick={() => handleDeleteNotification(notification.id)}
    >
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

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.active : ""}`}>
        <div className={styles.sidebarHeader}>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link to="/StatConsultant" onClick={toggleSidebar}>
                <span className={styles.icon}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/SearchMission" onClick={toggleSidebar}>
                <span className={styles.icon}>📋</span> Missions
              </Link>
            </li>
            <li>
              <Link
                to={role === "Entreprise" ? "/EntrepriseProfilePage" : "/ProfilePage"}
                onClick={toggleSidebar}
              >
                <span className={styles.icon}>👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/transactions" onClick={toggleSidebar}>
                <span className={styles.icon}>🗃️</span> Transactions
              </Link>
            </li>
            {role === "Consultant" ? (
              <li>
                <Link to="/ConsultantPropositions" onClick={toggleSidebar}>
                  <span className={styles.icon}>📝</span> Mes Propositions
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/EnterpriseMissions" onClick={toggleSidebar}>
                  <span className={styles.icon}>📝</span> Mes Missions
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar} />}
    </>
  );
};

export default Header;
