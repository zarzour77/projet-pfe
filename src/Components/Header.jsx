// components/Header.jsx
import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { fetchNotifications } from '../services/HeaderService'; // Import du service
import styles from './Header.module.css';

function Header() {
  const [searchType, setSearchType] = useState('Talent');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const categories = [
    { name: 'Development & IT', icon: '👨‍💻', subcats: ['Web Dev', 'Mobile Dev'] },
    { name: 'AI Services',       icon: '🤖',   subcats: ['Machine Learning', 'Data Science'] },
    { name: 'Design & Creative', icon: '🎨',   subcats: ['Graphic Design', 'UI/UX'] },
    { name: 'Sales & Marketing', icon: '📈',   subcats: ['SEO', 'Social Media'] },
    { name: 'Admin & Customer Support', icon: '🖇️', subcats: ['Virtual Assistance', 'Data Entry'] },
    { name: 'More',              icon: '⚙️',   subcats: ['Consulting', 'Writing'] },
  ];

  // Récupération de l'ID de l'entreprise connectée depuis le localStorage
  const storedUser = JSON.parse(localStorage.getItem('userWithToken'));
  const entrepriseId = storedUser?.user?.id || storedUser?.id;
  const token = storedUser?.token;



  // Gère l'effet "sticky + shrink" lors du défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle pour “Find Talent” / “Find Job”
  const handleToggle = (type) => {
    setSearchType(type);
  };

  // Récupération des notifications via le service
  useEffect(() => {
    if (!entrepriseId || !token) {
      return;
    }
    fetchNotifications(entrepriseId, token)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
      });
  }, [entrepriseId, token]);

  const handleNotificationsClick = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
  };

  return (
    <div>
      {/* HEADER PRINCIPAL */}
      <header className={`${styles.mainHeader} ${isScrolled ? styles.shrink : ''}`}>
        <div className={styles.logoSection}>
          <h1 className={styles.brandTitle}>Trade for Talent</h1>
          <p className={styles.tagline}>Connecting Businesses & Freelancers Worldwide</p>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.toggleButtons}>
            <button
              onClick={() => handleToggle('Talent')}
              className={`${styles.toggleBtn} ${searchType === 'Talent' ? styles.active : ''}`}
            >
              Find Talent
            </button>
            <button
              onClick={() => handleToggle('Jobs')}
              className={`${styles.toggleBtn} ${searchType === 'Jobs' ? styles.active : ''}`}
            >
              Find Job
            </button>
          </div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Search for ${searchType}`}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>
        <div className={styles.authButtons}>
          {/* Bouton de notifications */}
          <div className={styles.notificationWrapper} onClick={handleNotificationsClick}>
            <FaBell className={styles.bellIcon} />
            {notifications.length > 0 && (
              <span className={styles.notifCount}>{notifications.length}</span>
            )}
          </div>
          {/* Dropdown affichant les notifications */}
          {showNotifications && (
            <div className={styles.notificationsDropdown}>
              {notifications.length === 0 ? (
                <p className={styles.noNotif}>Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={styles.notificationItem}>
                    <div className={styles.notifMessage}>{notif.message}</div>
                    <div className={styles.notifDate}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <button className={styles.loginBtn}>Log In</button>
          <button className={styles.signupBtn}>Sign Up</button>
        </div>
      </header>
      <nav className={`${styles.subHeader} ${isScrolled ? styles.stickySubHeader : ''}`}>
        <ul className={styles.navList}>
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={styles.navItem}
              onMouseEnter={() => {
                if (cat.name === 'More') {
                  setShowMega(true);
                }
              }}
              onMouseLeave={() => {
                if (cat.name === 'More') {
                  setShowMega(false);
                }
              }}
            >
              <span className={styles.navIcon}>{cat.icon}</span>
              {cat.name}
              {cat.name === 'More' && showMega && (
                <div className={styles.megaMenu}>
                  <ul>
                    {cat.subcats.map((sub) => (
                      <li key={sub}>{sub}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
