import { useState } from "react";
import AuthService from "../Services/AuthService";
import styles from "./Login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import user1 from '../assets/hidingUser.png'
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

  const navigate = useNavigate();
  // Password validation function
  const validatePassword = (pwd) => {
    // At least one lowercase, one uppercase, one digit and minimum 8 characters
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
  };
// In your Login component:
const handleSignup = async (e) => {
  e.preventDefault();
  if (!validatePassword(password)) {
    return;
  }
  try {
    const userData = {
      nom,
      prenom,
      email,
      password,
    };
    // Await the signup response
    const response = await AuthService.signup(userData);
    // Store the new user's data in localStorage
    localStorage.setItem("user", JSON.stringify(response));

    alert("Signup successful!");
  } catch (err) {
    alert("Signup failed! Please check your information.");
    console.error(err);
  }
};



  // Handle Sign In
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log(signinEmail, signinPassword);
      const response = await AuthService.login(signinEmail, signinPassword);
      localStorage.setItem("userWithToken", JSON.stringify(response));      
      if (response.roles.includes("ROLE_USER"))  {
        navigate("/UserInformation");
      if(response.roles.includes("Consultant")){
        localStorage.setItem()
        navigate("/UserInformation");

      }
      } else {
        navigate("/MissionTinder");
      }
    } catch {
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className={`${styles.customBackground}`}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`} id="container">
      

        {/* Sign Up Form */}
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSignup}>
            <h1>S&apos;inscrire</h1>
            <div className={styles['social-icons']}>
              <a href="#" className={`${styles.icon} ${styles.google}`}><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className={`${styles.icon} ${styles.facebook}`}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={`${styles.icon} ${styles.github}`}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={`${styles.icon} ${styles.linkedin}`}><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <input type="text" placeholder="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
            <input type="text" placeholder="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mot de passe" required value={password} onChange={(e) => {
                const pwd = e.target.value;
                setPassword(pwd);
                if (!validatePassword(pwd)) {
                  setPasswordError(
                    "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
                  );
                } else {
                  setPasswordError("");
                }
              }}
            />
            {passwordError && (
              <div className={styles.errorMessage}>{passwordError}</div>
            )}
            <button type="submit" className={styles.loginButton}>S&apos;inscrire</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
          <form onSubmit={handleLogin}>
            <h1>Se connecter</h1>
            <div className={styles['social-icons']}>
              <a href="#" className={`${styles.icon} ${styles.google}`}><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className={`${styles.icon} ${styles.facebook}`}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={`${styles.icon} ${styles.github}`}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={`${styles.icon} ${styles.linkedin}`}><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <input type="text" placeholder="Email" required value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} />
            <input type="password" placeholder="Mot de passe" required value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} />
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
              <button className={styles.hidden} onClick={() => setIsActive(true)}>S&apos;inscrire</button>
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