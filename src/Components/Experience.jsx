/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Experience.module.css";
import ConsultantService from "../Services/ConsultantService";
import DomaineService from "../Services/DomaineService";
import CompetenceService from "../Services/CompetenceService";
import UserService from "../Services/UserService"; // Si utilisé ailleurs

// Fonction utilitaire pour convertir "DD/MM/YYYY" en "YYYY-MM-DD"
const convertDateForInput = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("/");
  if (parts.length !== 3) return dateString;
  // Assurez-vous que les mois et jours sont sur deux chiffres
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

const Experience = () => {
  const [consultant, setConsultant] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });
  const [step, setStep] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const [selectedPhases, setSelectedPhases] = useState([]);

  // Etats pour le formulaire Experience (Step 4)
  const [expDateDebut, setExpDateDebut] = useState("");
  const [expDateFin, setExpDateFin] = useState("");
  const [expEntreprise, setExpEntreprise] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expDescription, setExpDescription] = useState("");

  // Etat pour conserver plusieurs expériences ajoutées
  const [experienceList, setExperienceList] = useState([]);

  // Etat pour l'aperçu du CV
  const [showCvModal, setShowCvModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

  // Pour récupérer l'utilisateur à chaque montage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setConsultant(storedUser);
  }, []);
  const consultantId = consultant?.id;
  console.log("Consultant:", consultant);

  // Récupération des expériences extraites du CV depuis le localStorage
  const cvExtracted = JSON.parse(localStorage.getItem("cvExtracted")) || {};
  const cvExperiences = cvExtracted.experiences || [];
  // Index pour suivre l'auto-remplissage des expériences
  const [cvExperienceIndex, setCvExperienceIndex] = useState(0);

  // Auto-remplissage de l'expérience à partir des données du CV si disponibles.
  // Conversion des dates au format ISO pour l'input.
  useEffect(() => {
    if (cvExperiences.length > 0 && cvExperienceIndex < cvExperiences.length) {
      const exp = cvExperiences[cvExperienceIndex];
      if (!expDateDebut && exp.dateDebut) {
        setExpDateDebut(convertDateForInput(exp.dateDebut));
      }
      if (!expDateFin && exp.dateFin) {
        setExpDateFin(convertDateForInput(exp.dateFin));
      }
      if (!expEntreprise && exp.entreprise) {
        setExpEntreprise(exp.entreprise);
      }
      if (!expRole && exp.role) {
        setExpRole(exp.role);
      }
      if (!expDescription && exp.description) {
        setExpDescription(exp.description);
      }
    }
  }, [cvExperiences, cvExperienceIndex, expDateDebut, expDateFin, expEntreprise, expRole, expDescription]);

  const handleSelection = (phase) => {
    if (step === 2) {
      setSelectedPhases((prev) =>
        prev.includes(phase)
          ? prev.filter((p) => p !== phase)
          : [...prev, phase]
      );
    } else {
      setSelectedPhase(phase);
    }
  };

  const handleNextStep = () => {
    if (step === 2 && selectedPhases.length === 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      return;
    }
    if (step !== 2 && !selectedPhase) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      setSelectedPhase(false);
      return;
    }
  };

  // Fonction de calcul de la durée en mois (approx.)
  const calculateDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return Math.round(diffDays / 30);
  };

  // Ajout d'une expérience : si le formulaire est rempli, ajoute l'expérience pré-remplie et passe au prochain index
  const handleAddExperience = () => {
    if (!expDateDebut || !expDateFin || !expEntreprise || !expRole || !expDescription) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      return;
    }
    const duree = calculateDuration(expDateDebut, expDateFin);
    const newExperience = {
      dateDebut: expDateDebut,
      dateFin: expDateFin,
      entreprise: expEntreprise,
      role: expRole,
      description: expDescription,
      duree: duree,
    };

    setExperienceList([...experienceList, newExperience]);

    // Incrémente l'index pour auto-remplissage
    const nextIndex = cvExperienceIndex + 1;
    setCvExperienceIndex(nextIndex);
    if (nextIndex < cvExperiences.length) {
      const nextExp = cvExperiences[nextIndex];
      setExpDateDebut(convertDateForInput(nextExp.dateDebut || ""));
      setExpDateFin(convertDateForInput(nextExp.dateFin || ""));
      setExpEntreprise(nextExp.entreprise || "");
      setExpRole(nextExp.role || "");
      setExpDescription(nextExp.description || "");
    } else {
      // Sinon, vide les champs pour saisie manuelle
      setExpDateDebut("");
      setExpDateFin("");
      setExpEntreprise("");
      setExpRole("");
      setExpDescription("");
    }
  };

  const handleFinishExperience = async () => {
    try {
      // Formatage des expériences pour l'envoi au backend
      const formattedExperiences = experienceList.map(exp => ({
        dateDebut: exp.dateDebut,
        dateFin: exp.dateFin,
        entreprise: exp.entreprise,
        role: exp.role,
        description: exp.description,
      }));
  
      const response = await ConsultantService.updateConsultant(consultantId, { experiences: formattedExperiences });
      if (response){
        console.log("Experiences updated successfully!");
        localStorage.setItem("user", JSON.stringify(response));
        setShowCvModal(true);
      }
    } catch (error) {
      alert("Failed to add experiences.");
      console.error(error);
    }
  };

  // Fonctions de génération et téléchargement du CV (inchangées)
  const handleGenerateCV = async () => {
    try {
      const response = await ConsultantService.generateCv(consultantId);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch (error) {
      console.error("Error generating CV preview:", error);
    }
  };

  const handleSaveAndSubscribe = async () => {
    try {
      await ConsultantService.saveCv(consultantId);
      navigate("/subscription");
    } catch (error) {
      console.error("Error saving CV:", error);
    }
  };

  const handleDownloadCV = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement("a");
      link.href = pdfPreviewUrl;
      link.download = "cv.pdf";
      link.click();
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.stepIndicator}>{step}/4</p>

      {step === 1 && (
        <>
          <h2 className={styles.title}>Choisissez votre niveau d'expérience</h2>
          <div className={styles.phases}>
            <div
              className={`${styles.phase} ${selectedPhase === "new" ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("new")}
            >
              <i className="bi bi-lightbulb"></i>
              <p>Je débute dans ce domaine.</p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhase === "some" ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("some")}
            >
              <i className="bi bi-bar-chart-line"></i>
              <p>J'ai quelques expériences.</p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhase === "expert" ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("expert")}
            >
              <i className="bi bi-briefcase"></i>
              <p>Je suis un expert.</p>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className={styles.title}>Quel est votre objectif ?</h2>
          <div className={styles.phases}>
            <div
              className={`${styles.phase} ${selectedPhases.includes("income") ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("income")}
            >
              <i className="bi bi-cash-stack"></i>
              <p>Gagner un revenu principal</p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhases.includes("side") ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("side")}
            >
              <i className="bi bi-piggy-bank"></i>
              <p>Gagner de l'argent en extra</p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhases.includes("experience") ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("experience")}
            >
              <i className="bi bi-mortarboard"></i>
              <p>Obtenir de l'expérience</p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhases.includes("none") ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("none")}
            >
              <i className="bi bi-question-circle"></i>
              <p>Je ne sais pas encore</p>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <div className={styles.step3}>
          <h2 className={styles.title}>Comment préférez-vous travailler ?</h2>
          <div className={styles.phases}>
            <div
              className={`${styles.phase} ${selectedPhase === "find" ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("find")}
            >
              <i className="bi bi-search"></i>
              <p>Je cherche des opportunités moi-même.</p>
              <p className={styles.subtitle}>
                Les clients postent des jobs sur notre marketplace, vous pouvez les consulter et enchérir, ou être invité par un client.
              </p>
            </div>
            <div
              className={`${styles.phase} ${selectedPhase === "package" ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("package")}
            >
              <i className="bi bi-box"></i>
              <p>Je souhaite empaqueter mon travail pour que les clients l'achètent.</p>
              <p className={styles.subtitle}>
                Définissez votre service avec des prix et des délais, nous le listerons dans notre catalogue pour que les clients l'achètent directement.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={styles.experienceContainer}>
          <div className={styles.experienceForm}>
            <h2 className={styles.formTitle}>Ajouter votre expérience</h2>
            <div className={styles.formGroup}>
              <label>Date de début</label>
              <input 
                type="date" 
                value={expDateDebut}
                onChange={(e) => setExpDateDebut(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Date de fin</label>
              <input 
                type="date" 
                value={expDateFin}
                onChange={(e) => setExpDateFin(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Entreprise</label>
              <input 
                type="text" 
                placeholder="Entreprise" 
                value={expEntreprise}
                onChange={(e) => setExpEntreprise(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Votre rôle</label>
              <input 
                type="text" 
                placeholder="Votre rôle (ex: traducteur, directeur, etc.)" 
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea 
                placeholder="Description de votre expérience"
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                className={styles.formTextarea}
              ></textarea>
            </div>
          </div>

          {experienceList.length > 0 && (
            <div className={styles.experienceList}>
              <h3>Expériences ajoutées</h3>
              <ul>
                {experienceList.map((exp, index) => (
                  <li key={index} className={styles.experienceItem}>
                    <div className={styles.experienceContent}>
                      <span className={styles.entreprise}>{exp.entreprise}</span>
                      <span className={styles.role}>{exp.role}</span>
                      <span className={styles.duree}>({exp.duree} mois)</span>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button 
                className={styles.finishButton}
                onClick={handleFinishExperience}
              >
                Terminer
              </button>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className={styles.formActions}>
          <button 
            className={styles.addExperienceButton}
            onClick={handleAddExperience}
            disabled={!expDateDebut || !expDateFin || !expEntreprise || !expRole || !expDescription}
          >
            Ajouter l'expérience
          </button>
        </div>
      )}

      {step !== 4 && (
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <div className={styles.buttonDiv}>
          {step > 1 && step !== 4 && (
            <button className={styles.prevButton} onClick={() => setStep(step - 1)}>
              Précédent
            </button>
          )}
        </div>
        <div className={styles.buttonDiv}>
          {step < 4 && (
            <button className={styles.nextButton} onClick={handleNextStep}>
              Suivant
            </button>
          )}
        </div>
      </div>

      {showCvModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Aperçu de votre CV</h2>
            {!pdfPreviewUrl ? (
              <div className={styles.modalActions}>
                <button onClick={handleGenerateCV} className={styles.generateButton}>
                  Générer le CV
                </button>
                <button onClick={handleSaveAndSubscribe} className={styles.ignoreButton}>
                  Ignorer pour le moment
                </button>
              </div>
            ) : (
              <>
                <iframe src={pdfPreviewUrl} title="CV Preview" className={styles.pdfPreview} />
                <div className={styles.modalActions}>
                  <div className={styles.actionRow}>
                    <button onClick={handleDownloadCV} className={styles.downloadButton}>
                      Télécharger le CV
                    </button>
                    <button onClick={handleSaveAndSubscribe} className={styles.saveButton}>
                      Valider & S'abonner
                    </button>
                  </div>
                  <div className={styles.closeRow}>
                    <button
                      onClick={() => {
                        setShowCvModal(false);
                        setPdfPreviewUrl("");
                      }}
                      className={styles.closeModal}
                    >
                      Modifier mes expériences
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Experience;
