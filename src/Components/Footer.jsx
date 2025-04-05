/* eslint-disable react/no-unescaped-entities */
import styles from "./Footer.module.css";
// Si vous utilisez des icônes (Font Awesome ou react-icons) :
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Section du haut : colonnes de liens */}
      <div className={styles.topSection}>
        <div className={styles.column}>
          <h3>Pour les clients</h3>
          <ul>
            <li><a href="#">Comment recruter</a></li>
            <li><a href="#">Marketplace de talents</a></li>
            <li><a href="#">Catalogue de projets</a></li>
            <li><a href="#">Engager une agence</a></li>
            <li><a href="#">Entreprise</a></li>
            <li><a href="#">Business Plus</a></li>
            <li><a href="#">Recruter dans le monde entier</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Pour les talents</h3>
          <ul>
            <li><a href="#">Comment trouver du travail</a></li>
            <li><a href="#">Contrats directs</a></li>
            <li><a href="#">Trouvez des missions freelances dans le monde entier</a></li>
            <li><a href="#">Trouvez des missions freelances aux États-Unis</a></li>
            <li><a href="#">Gagnez des missions avec nous</a></li>
            <li><a href="#">Ressources exclusives avec Freelancer Plus</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Ressources</h3>
          <ul>
            <li><a href="#">Aide & support</a></li>
            <li><a href="#">Témoignages de réussite</a></li>
            <li><a href="#">Avis sur Upwork</a></li>
            <li><a href="#">Catalogue de projets</a></li>
            <li><a href="#">Programme freelance</a></li>
            <li><a href="#">Outils Business gratuits</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Entreprise</h3>
          <ul>
            <li><a href="#">À propos de nous</a></li>
            <li><a href="#">Direction</a></li>
            <li><a href="#">Relations investisseurs</a></li>
            <li><a href="#">Carrières</a></li>
            <li><a href="#">Notre impact</a></li>
            <li><a href="#">Presse</a></li>
            <li><a href="#">Nous contacter</a></li>
          </ul>
        </div>
      </div>

      {/* Section intermédiaire : réseaux sociaux et apps */}
      <div className={styles.middleSection}>
        <div className={styles.social}>
          <span>Suivez-nous</span>
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>

      {/* Ligne de séparation */}
      <hr className={styles.divider} />

      {/* Section du bas : mentions légales et liens */}
      <div className={styles.bottomSection}>
        <p>2025 Trade for Talent® </p>
        <div className={styles.legalLinks}>
          <a href="#">Conditions d'utilisation</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Avis de collecte CA</a>
          <a href="#">Paramètres des cookies</a>
          <a href="#">Accessibilité</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;