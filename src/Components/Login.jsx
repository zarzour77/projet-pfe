import { useState } from "react";
import AuthService from "../services/AuthService";
import styles from "./Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import user1 from '../assets/hidingUser.png';

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  // States for Sign Up
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // States for Sign In
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State pour le code de vérification
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      return;
    }
    try {
      const userData = { nom, prenom, email, password };
      const response = await AuthService.signup(userData);
      localStorage.setItem("user", JSON.stringify(response));
      alert("Signup successful!");
    } catch (err) {
      alert("Signup failed! Please check your information.");
      console.error(err);
    }
  };

  // Si le formulaire de vérification est affiché, on vérifie le code
  // sinon on procède au login normal.
  const handleLogin = async (e) => {
    e.preventDefault();
    if (showVerify) {
      // On appelle la vérification si le champ de code est visible
      handleVerifySubmit(e);
      return;
    }
    try {
      console.log("Tentative de login:", signinEmail, signinPassword);
      const response = await AuthService.login(signinEmail, signinPassword);
      localStorage.setItem("userWithToken", JSON.stringify(response));
      if (response.roles.includes("ROLE_USER") || response.roles.includes("Consultant")) {
        navigate("/UserInformation");
      } else {
        navigate("/MissionTinder");
      }
    } catch (error) {
      // Vérifier le message d'erreur pour détecter le cas "n'est pas vérifié"
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes("n'est pas vérifié")
      ) {
        alert("Votre email n'est pas vérifié. Veuillez saisir le code de vérification.");
        setShowVerify(true);
      } else {
        alert("Login failed! Please check your credentials.");
      }
      console.error(error);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthService.verifyEmail(signinEmail, verificationCode);
      alert(result.message);
      setShowVerify(false);
      // Après vérification, relancez le login
      const response = await AuthService.login(signinEmail, signinPassword);
      localStorage.setItem("userWithToken", JSON.stringify(response));
      if (response.roles.includes("ROLE_USER") || response.roles.includes("Consultant")) {
        navigate("/UserInformation");
      } else {
        navigate("/MissionTinder");
      }
    } catch (error) {
      alert("Code de vérification invalide. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div className={`${styles.customBackground}`}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
        {/* Sign Up Form */}
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSignup}>
            <h1>S'inscrire</h1>
            <div className={styles['social-icons']}>
              <a href="#" className={`${styles.icon} ${styles.google}`}>
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.facebook}`}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.github}`}>
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.linkedin}`}>
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <input type="text" placeholder="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
            <input type="text" placeholder="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              type="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={(e) => {
                const pwd = e.target.value;
                setPassword(pwd);
                if (!validatePassword(pwd)) {
                  setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.");
                } else {
                  setPasswordError("");
                }
              }}
            />
            {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
            <button type="submit" className={styles.loginButton}>S'inscrire</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
          <form onSubmit={handleLogin}>
            <h1>Se connecter</h1>
            <div className={styles['social-icons']}>
              <a href="#" className={`${styles.icon} ${styles.google}`}>
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.facebook}`}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.github}`}>
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className={`${styles.icon} ${styles.linkedin}`}>
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <input
              type="text"
              placeholder="Email"
              required
              value={signinEmail}
              onChange={(e) => setSigninEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              required
              value={signinPassword}
              onChange={(e) => setSigninPassword(e.target.value)}
            />
            {/* Champ de saisie du code de vérification, intégré au formulaire */}
            {showVerify && (
              <input
                type="text"
                placeholder="Saisir code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            )}
            <a href="#">Mot de passe oublié ?</a>
            <button type="submit" className={styles.loginButton}>Se connecter</button>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className={styles['toggle-container']}>
          <div className={styles.toggle}>
            <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
              <h1>Bienvenue !</h1>
              <p>Entrez vos informations personnelles pour utiliser toutes les fonctionnalités du site</p>
              <button className={styles.hidden} onClick={() => setIsActive(false)}>Se connecter</button>
            </div>
            <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
              <h1>Bonjour !</h1>
              <p>Inscrivez-vous avec vos informations personnelles pour utiliser toutes les fonctionnalités du site</p>
              <button className={styles.hidden} onClick={() => setIsActive(true)}>S'inscrire</button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.formHero}>
        <img className={styles.user} src={user1} alt="Decorative Icon" />
      </div>
    </div>
  );
};

export default Login;
