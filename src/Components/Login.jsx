/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthService from "../Services/AuthService";
import UserService from "../Services/UserService";
import { AuthContext } from "../Services/AuthContext";
import styles from "./Login.module.css";
import logo from '../assets/logo3.png';
import logo2 from '../assets/logo4.png';

import "@fortawesome/fontawesome-free/css/all.min.css";

const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial state based on query parameter: if ?signup=true is present, show sign-up form.
  const initialActive = searchParams.get("signup") === "true";
  const [isActive, setIsActive] = useState(initialActive);

  // States for Sign Up
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error/Success messages for Sign Up
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");

  // States for Sign In
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Error/Success messages for Sign In
  const [signInError, setSignInError] = useState("");
  const [signInSuccess, setSignInSuccess] = useState("");

  // States for email verification
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // State for password validation
  const [showPasswordError, setShowPasswordError] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
  };

  // Common login function
  const performLogin = async () => {
    try {
      const loginResponse = await AuthService.login(signinEmail, signinPassword);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(loginResponse));
      localStorage.setItem("token", loginResponse.token);

      const fullUser = await UserService.getById(loginResponse.id);
      if (!fullUser.token) {
        fullUser.token = loginResponse.token;
      }
      localStorage.setItem("user", JSON.stringify(fullUser));
      setCurrentUser(fullUser);
      console.log(fullUser.role);
      if (fullUser.role === "ROLE_USER") {
        navigate("/UserInformation");
      } else if (fullUser.role === "Consultant" || fullUser.role === "Admin") {
        navigate("/SearchMission");
      } else {
        navigate("/LandingEntreprise");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const serverMessage = error.response.data.message;
        if (serverMessage.includes("n'est pas vérifié")) {
          setSignInError("Votre email n'est pas vérifié. Veuillez saisir le code de vérification.");
          setShowVerify(true);
        } else if (serverMessage.includes("suspendu")) {
          setSignInError(serverMessage);
        } else {
          setSignInError("Échec de la connexion. Veuillez vérifier vos identifiants.");
        }
      } else {
        setSignInError("Échec de la connexion. Veuillez vérifier vos identifiants.");
      }
      console.error(error);
    }
  };

  // Sign Up handling
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");

    if (!validatePassword(password)) {
      setSignUpError("Le mot de passe ne respecte pas les critères.");
      return;
    }

    try {
      const userData = { nom, prenom, email, password };
      await AuthService.signup(userData);
      setSignUpSuccess("Inscription réussie !");
      setNom("");
      setPrenom("");
      setEmail("");
      setPassword("");
      setShowPasswordError(false);

      setTimeout(() => {
        setIsActive(false);
        setSignInSuccess("Votre compte a été créé. Vous pouvez maintenant vous connecter.");
        setSignUpSuccess("");
      }, 1000);
    } catch (err) {
      setSignUpError("Échec de l'inscription. Veuillez vérifier vos informations.");
      console.error(err);
    }
  };

  // Sign In handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setSignInError("");
    setSignInSuccess("");

    if (!showVerify) {
      await performLogin();
    } else {
      await handleVerifySubmit(e);
    }
  };

  // Verification code handling
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setSignInError("");
    setSignInSuccess("");

    try {
      const result = await AuthService.verifyEmail(signinEmail, verificationCode);
      setSignInSuccess(result.message || "Votre compte est désormais vérifié. Connexion en cours...");
      setShowVerify(false);
      setTimeout(() => {
        performLogin();
      }, 2000);
    } catch (error) {
      setSignInError("Code de vérification invalide. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.customBackground}>
      <div className={styles.topLogoContainer}>
      <Link to="/">
        <img src={logo2} alt="Top Logo" className={styles.topLogo} />
      </Link>
    </div>
        <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
          {/* Sign Up Form */}
          <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
            <form onSubmit={handleSignup}>
              <h1>S'inscrire</h1>


              {signUpError && <div className={styles.errorMessage}>{signUpError}</div>}
              {signUpSuccess && <div className={styles.successMessage}>{signUpSuccess}</div>}

              <input type="text" placeholder="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
              <input type="text" placeholder="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />

              <div className={styles.passwordContainer}>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={password}
                  onFocus={() => setShowPasswordError(true)}
                  onBlur={() => setShowPasswordError(false)}
                  onChange={(e) => {
                    const pwd = e.target.value;
                    setPassword(pwd);
                    setShowPasswordError(!validatePassword(pwd));
                  }}
                />
                {showPasswordError && !validatePassword(password) && (
                  <div className={styles.passwordError}>
                    Le mot de passe dois avoir au moins 8 caractères, 1 majuscule et 1 numéro.
                  </div>
                )}
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


              {signInError && <div className={styles.errorMessage}>{signInError}</div>}
              {signInSuccess && <div className={styles.successMessage}>{signInSuccess}</div>}

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

              {/* Verification Code Field */}
              {showVerify && (
                <input
                  type="text"
                  placeholder="Saisir code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              )}

              <button type="submit" className={styles.loginButton}>
                {showVerify ? "Vérifier" : "Se connecter"}
              </button>
            </form>
          </div>

          {/* Toggle Panel */}
          <div className={styles["toggle-container"]}>
            <div className={styles.toggle}>
              <div className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}>
                <img src={logo} className={styles.logo} alt="Logo" />
                <h1>Bienvenue !</h1>
                <p>
                  Entrez vos informations personnelles pour utiliser toutes les fonctionnalités du site
                </p>
                <button
                  className={styles.hidden}
                  onClick={() => {
                    setIsActive(false);
                    setSignUpError("");
                    setSignUpSuccess("");
                  }}
                >
                  Se connecter
                </button>
              </div>
              <div className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}>
                <img src={logo} className={styles.logo} alt="Logo" />
                <h1>Bonjour !</h1>
                <p>
                  Inscrivez-vous avec vos informations personnelles pour utiliser toutes les fonctionnalités du site
                </p>
                <button
                  className={styles.hidden}
                  onClick={() => {
                    setIsActive(true);
                    setSignInError("");
                    setSignInSuccess("");
                  }}
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
