/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import AuthService from "../Services/AuthService";
import styles from "./Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import user1 from "../assets/hidingUser.png";
import UserService from "../Services/UserService";
import { AuthContext } from "../Services/AuthContext";
import { useContext } from "react";

const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  // States for Sign Up
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // States for Sign In
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  // State for verification code
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  // State to control the popover for password validation
  const [showPopover, setShowPopover] = useState(false);
  // Ref for the password input
  const passwordInputRef = useRef(null);

  const navigate = useNavigate();

  // Clear localStorage when component mounts so no old user remains.
  useEffect(() => {
    localStorage.clear();
  }, []);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
  };

  // Compute popover position and update CSS variables
  useEffect(() => {
    if (showPopover && passwordInputRef.current) {
      const rect = passwordInputRef.current.getBoundingClientRect();
      // Set CSS custom properties for left and top positioning.
      document.documentElement.style.setProperty(
        "--popover-left",
        `${rect.right + 10}px`
      );
      document.documentElement.style.setProperty(
        "--popover-top",
        `${rect.top + rect.height / 2 - 23}px`
      );
    }
  }, [showPopover, password]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      return;
    }
    try {
      const userData = { nom, prenom, email, password };
      await AuthService.signup(userData);
      alert("Signup successful!");
    } catch (err) {
      alert("Signup failed! Please check your information.");
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (showVerify) {
      handleVerifySubmit(e);
      return;
    }
    try {
      const loginResponse = await AuthService.login(signinEmail, signinPassword);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(loginResponse));
      localStorage.setItem("token", loginResponse.token);

      const fullUser = await UserService.getById(loginResponse.id);
      if (!fullUser.token) {
        fullUser.token = loginResponse.token;
      }
      // Store the complete user object under "user"
      localStorage.setItem("user", JSON.stringify(fullUser));
      setCurrentUser(fullUser); // Mise à jour du context
      if (fullUser.role === "ROLE_USER") {
        navigate("/UserInformation");
      } else if (fullUser.role === "Consultant") {
        navigate("/ProfilePage");
      } else {
        navigate("/LandingEntreprise");
      }
    } catch (error) {
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
      alert("Votre compte est désormais vérifié. Veuillez vous reconnecter.");
    } catch (error) {
      alert("Code de vérification invalide. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <>
      <div className={`${styles.customBackground}`}>
        <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
          {/* Sign Up Form */}
          <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
            <form onSubmit={handleSignup}>
              <h1>S'inscrire</h1>
              <div className={styles["social-icons"]}>
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
              {/* Password input wrapped in a container */}
              <div className={styles.popoverContainer}>
                <input
                  ref={passwordInputRef}
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={password}
                  onFocus={() => setShowPopover(true)}
                  onBlur={() => {
                    if (validatePassword(password)) setShowPopover(false);
                  }}
                  onChange={(e) => {
                    const pwd = e.target.value;
                    setPassword(pwd);
                    if (validatePassword(pwd)) {
                      setShowPopover(false);
                    } else {
                      setShowPopover(true);
                    }
                  }}
                />
              </div>
              <button type="submit" className={styles.loginButton}>
                S'inscrire
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div className={`${styles["form-container"]} ${styles["sign-in"]}`}>
            <form onSubmit={handleLogin}>
              <h1>Se connecter</h1>
              <div className={styles["social-icons"]}>
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
              <button type="submit" className={styles.loginButton}>
                Se connecter
              </button>
            </form>
          </div>

          {/* Toggle Panel */}
          <div className={styles["toggle-container"]}>
            <div className={styles.toggle}>
              <div className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}>
                <h1>Bienvenue !</h1>
                <p>Entrez vos informations personnelles pour utiliser toutes les fonctionnalités du site</p>
                <button className={styles.hidden} onClick={() => {setIsActive(false);setShowPopover(false)}}>
                  Se connecter
                </button>
              </div>
              <div className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}>
                <h1>Bonjour !</h1>
                <p>Inscrivez-vous avec vos informations personnelles pour utiliser toutes les fonctionnalités du site</p>
                <button className={styles.hidden} onClick={() => setIsActive(true)}>
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formHero}>
          <img className={styles.user} src={user1} alt="Decorative Icon" />
        </div>
      </div>
      {/* Render the popover using a CSS class */}
      {showPopover && !validatePassword(password) && (
        <div className={styles.passwordPopover}>
          Au moins 8 caractères, 1 majuscule et 1 numéro.
        </div>
      )}
    </>
  );
};

export default Login;