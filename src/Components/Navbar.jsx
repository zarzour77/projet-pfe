/* eslint-disable react/no-unescaped-entities */
// Navbar.js
import { Link } from 'react-router-dom';
import styles from './navbar.module.css'; // Import CSS Module styles

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><Link to="/" className={styles.navLink}>Home</Link></li>
        <li className={styles.navItem}><Link to="/login" className={styles.navLink}>Se connecter / S'inscrire</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
