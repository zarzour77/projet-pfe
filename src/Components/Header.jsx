// src/components/Header.js
import styles from "./Header.module.css"; // Import the styles for the header
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Link to="/" className={styles.greatVibesRegular}> {/* Use styles from CSS Module */}
        Trade for Talent
    </Link>
  );
};

export default Header;
