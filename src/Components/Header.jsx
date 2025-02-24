import  { useState, useEffect } from 'react';
import styles from './Header.module.css'; // Assurez-vous d'avoir ce fichier CSS

function Header() {
  const [searchType, setSearchType] = useState('Talent');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMega, setShowMega] = useState(false);

  // Exemple de structure de catégories, avec icônes et sous-catégories
  const categories = [
    { name: 'Development & IT', icon: '👨‍💻', subcats: ['Web Dev', 'Mobile Dev'] },
    { name: 'AI Services',       icon: '🤖',   subcats: ['Machine Learning', 'Data Science'] },
    { name: 'Design & Creative', icon: '🎨',   subcats: ['Graphic Design', 'UI/UX'] },
    { name: 'Sales & Marketing', icon: '📈',   subcats: ['SEO', 'Social Media'] },
    { name: 'Admin & Customer Support', icon: '🖇️', subcats: ['Virtual Assistance', 'Data Entry'] },
    { name: 'More',              icon: '⚙️',   subcats: ['Consulting', 'Writing'] },
  ];

  // Gère l’effet "sticky + shrink" quand on défile
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle pour “Find Talent” / “Find Job”
  const handleToggle = (type) => {
    setSearchType(type);
  };

  return (
    <div>
      {/* HEADER PRINCIPAL */}
      <header className={`${styles.mainHeader} ${isScrolled ? styles.shrink : ''}`}>
        {/* Logo + Titre + Tagline */}
        <div className={styles.logoSection}>
          <h1 className={styles.brandTitle}>Trade for Talent</h1>
          <p className={styles.tagline}>Connecting Businesses & Freelancers Worldwide</p>
        </div>

        {/* Bloc Toggle + Barre de recherche */}
        <div className={styles.searchContainer}>
          {/* Toggle “Find Talent” / “Find Job” */}
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

          {/* Champ de recherche (icône loupe intégrée) */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Search for ${searchType}`}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Boutons d’authentification */}
        <div className={styles.authButtons}>
          <button className={styles.loginBtn}>Log In</button>
          <button className={styles.signupBtn}>Sign Up</button>
        </div>
      </header>

      {/* SUBHEADER (catégories) */}
      <nav className={`${styles.subHeader} ${isScrolled ? styles.stickySubHeader : ''}`}>
        <ul className={styles.navList}>
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={styles.navItem}
              // Exemple d'affichage d'un "Mega-dropdown" sur 'More'
              onMouseEnter={() => cat.name === 'More' && setShowMega(true)}
              onMouseLeave={() => cat.name === 'More' && setShowMega(false)}
            >
              <span className={styles.navIcon}>{cat.icon}</span>
              {cat.name}

              {/* MEGA-DROPDOWN au survol de "More" */}
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