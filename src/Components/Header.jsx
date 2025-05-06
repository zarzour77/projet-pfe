/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationService from "../Services/NotificationService";
import EntrepriseService from "../Services/EntrepriseService";
import ConsultantService from "../Services/ConsultantService";
import styles from "./Header.module.css";
import UserService from "../Services/UserService";
import logo from '../assets/logo3.png';
import { debounce } from "lodash";
import MissionService from "../Services/MissionService";
import { AuthContext } from "../Services/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  // Use the context value for user info
  const user = currentUser;
  const isGuest = !user; // true if no user is logged in
  const userId = user?.id;
  const role = user?.role; // use role from context

  // Helper to return a destination if logged in or always /login if guest
  const getLinkDestination = (destination) => isGuest ? "/login" : destination;

  // Search state remains for both cases
  const [selectedSearchType, setSelectedSearchType] = useState('talent');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch extended user data in background if the user exists
  useEffect(() => {
    let isMounted = true;
    const fetchExtendedUser = async () => {
      if (!user?.id) return;
      try {
        let fetchedUser = null;
        if (user.role === "Entreprise") {
          fetchedUser = await EntrepriseService.getEntrepriseById(user.id);
        } else if (user.role === "Consultant") {
          fetchedUser = await ConsultantService.getConsultantById(user.id);
        } else if (user.role === "Admin") {
          fetchedUser = await UserService.getById(user.id);
        }
        if (isMounted && fetchedUser) {
          setCurrentUser(fetchedUser);
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
  }, [user?.id, setCurrentUser]);

  const getSearchOptions = () => {
    if (role === 'Admin') return ['talent', 'entreprise', 'mission'];
    if (role === 'Entreprise') return ['talent', 'entreprise'];
    if (role === 'Consultant') return ['entreprise', 'mission'];
    return ['talent', 'entreprise', 'mission'];
  };

  const debouncedSearch = useRef(
    debounce(async (query, type) => {
      try {
        const results = query ? await performSearch(query, type) : [];
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    }, 100)
  ).current;

  const performSearch = async (query, type) => {
    switch (type) {
      case 'talent':
        return ConsultantService.searchConsultants(query);
      case 'entreprise':
        return EntrepriseService.searchEntreprises(query);
      case 'mission':
        return MissionService.searchMissions(query);
      default:
        return [];
    }
  };

  // Notification and user-specific states/effects run only if a user is logged in.
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState("all");
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

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    if (showNotifications && userId) {
      fetchNotifications();
      setOpenMenuId(null);
    }
  }, [showNotifications, userId]);

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
    setCurrentUser(null); // update context
    localStorage.removeItem("user");
    navigate("/");
  };

  // Close notifications dropdown when clicking outside
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

  // Handler to redirect guests to the login page
  const redirectToLogin = () => navigate("/login");

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          {/* Left: Logo */}
          <div className={styles.leftSection}>
            <div className={styles.logo}>
              <Link to={getLinkDestination("/")}>
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
              {isGuest ? (
                <>
                  <li>
                    <Link to={getLinkDestination("/")}>Home</Link>
                  </li>
                  <li>
                    <Link to={getLinkDestination("/login")}>About</Link>
                  </li>
                  <li>
                    <Link to={getLinkDestination("/login")}>Contact</Link>
                  </li>
                </>
              ) : (
                <>
                  {role === "Admin" ? (
                    <>
<li className={styles.dropdown}>
  <span className={styles.dropdownTitle}>Gestion</span>
  <ul className={styles.dropdownMenu}>
    <li>
      <Link to={getLinkDestination("/VoirAllUsers?role=Consultant")}>Consultants</Link>
    </li>
    <li>
      <Link to={getLinkDestination("/VoirAllUsers?role=Entreprise")}>Entreprises</Link>
    </li>
    <li>
      <Link to={getLinkDestination("/manage-missions")}>Missions</Link>
    </li>
  </ul>
</li>
                    </>
                  ) : role === "Entreprise" ? (
                    <>
                      {user?.typeEntreprise === "CLIENTE" ? (
                        <>
                          <li className={styles.dropdown}>
                            <span className={styles.dropdownTitle}>Missions</span>
                            <ul className={styles.dropdownMenu}>
                              <li>
                                <Link to={getLinkDestination("/publierMission")}>Publier une mission</Link>
                              </li>
                              <li>
                                <Link to={getLinkDestination("/EntrepriseMission")}>Mes Missions</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to={getLinkDestination("/landingEntreprise")}>Trouver des talents</Link>
                          </li>
                        </>
                      ) : user?.typeEntreprise === "SSI" ? (
                        <>
                          <li className={styles.dropdown}>
                            <span className={styles.dropdownTitle}>Consultants</span>
                            <ul className={styles.dropdownMenu}>
                              <li>
                                <Link to={getLinkDestination("/collaboratorsList")}>Collaborateurs</Link>
                              </li>
                              <li>
                                <Link to={getLinkDestination("/landingEntreprise")}>Voir les consultants</Link>
                              </li>
                              <li>
                                <Link to={getLinkDestination("/SearchMission")}>Attribuer des missions</Link>
                              </li>
                            </ul>
                          </li>
                        </>
                      ) : (
                        <li>
                          <Link to={getLinkDestination("/landingEntreprise")}>Trouver des talents</Link>
                        </li>
                      )}
                    </>
                  ) : role === "Consultant" ? (
                    <>
                      <li>
                        <Link to={getLinkDestination("/SearchMission")}>Trouver un emploi</Link>
                      </li>
                      <li>
                        <Link to={getLinkDestination("/ConsultantPropositions")}>Mes Propositions</Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to={getLinkDestination("/SearchMission")}>Trouver un emploi</Link>
                    </li>
                  )}

                  {/* Finance Dropdown for all non-admin roles */}
                  <li className={styles.dropdown}>
                    <span className={styles.dropdownTitle}>Gestion Finances</span>
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <Link to={getLinkDestination("/transactions")}>Transactions</Link>
                      </li>
                      {role === "Admin" && (
                        <li>
                          <Link to={getLinkDestination("/financial-reports")}>Rapports</Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Right: Search (always visible) and authentication or user icons */}
          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <i className={`fa fa-search ${styles.searchIcon}`}></i>
              <input
                type="text"
                placeholder={`Rechercher ${selectedSearchType}s...`}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => {
                  if (isGuest) return redirectToLogin();
                  const query = e.target.value;
                  setSearchQuery(query);
                  setShowResults(true);
                  debouncedSearch(query, selectedSearchType);
                }}
                onFocus={() => {
                  if (isGuest) return redirectToLogin();
                  setShowResults(true);
                }}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              <select 
                className={styles.searchSelect}
                value={selectedSearchType}
                onChange={(e) => {
                  if (isGuest) return redirectToLogin();
                  setSelectedSearchType(e.target.value);
                }}
              >
                {getSearchOptions().map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {showResults && (
                <div className={styles.searchResults}>
                  {searchResults.length === 0 ? (
                    <div className={styles.noResults}>
                      {searchQuery ? "Aucun résultat trouvé" : "Commencez à taper pour rechercher"}
                    </div>
                  ) : (
                    searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={
                          selectedSearchType === 'talent'
                            ? getLinkDestination(`/consultant/${result.id}`)
                            : selectedSearchType === 'entreprise'
                            ? getLinkDestination(`/entreprise/${result.id}`)
                            : getLinkDestination(`/SearchMission?missionId=${result.id}`)
                        }
                        className={styles.searchResultItem}
                      >
                        {selectedSearchType !== 'mission' && (
                          <img
                            src={result.photoprofile || 'default-avatar.png'}
                            alt={result.nom}
                            className={styles.searchResultImage}
                          />
                        )}
                        <div>
                          <div className={styles.searchResultName}>
                            {selectedSearchType === 'mission' ? (
                              <>
                                <div>{result.titre}</div>
                                {result.entreprise?.nom && (
                                  <div className={styles.searchResultCompany}>
                                    {result.entreprise.nom}
                                  </div>
                                )}
                              </>
                            ) : (
                              `${result.prenom} ${result.nom}`
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {isGuest ? (
              <div className={styles.authButtons}>
                <Link 
                  to="/login" 
                  className={`${styles.authButton} ${styles.loginButton}`}
                >
                  Se connecter
                </Link>
                <Link
                  to="/login?signup=true"
                  className={`${styles.authButton} ${styles.signupButton}`}
                >
                  S'inscrire
                </Link>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>

        {/* Profile Dropdown (logged-in users only) */}
        {(!isGuest && showProfileMenu) && (
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
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                navigate(role === "Entreprise" ? "/EntrepriseProfilePage" : "/ProfilePage");
              }}
            >
              <i className="fa fa-user"></i> Mon profil
            </button>
            {role === "Admin" && (
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/StatAdmin");
                }}
              >
                <i className="fa fa-chart-line"></i> Statistiques
              </button>
            )}
            {role === "Entreprise" && (
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/StatEntreprise");
                }}
              >
                <i className="fa fa-chart-line"></i> Statistiques
              </button>
            )}
            {role === "Consultant" && (
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/StatConsultant");
                }}
              >
                <i className="fa fa-chart-line"></i> Statistiques
              </button>
            )}
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setShowProfileMenu(false);
                navigate(role !== "Admin" ? "/Dispute" : "/Admindispute");
              }}
            >
              <i className="fa fa-balance-scale"></i> Litiges
            </button>
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

        {/* Notifications Dropdown for logged-in users only */}
        {(!isGuest && showNotifications) && (
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
