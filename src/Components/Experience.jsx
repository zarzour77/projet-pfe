import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Experience.module.css";

const Experience = () => {
  const [step, setStep] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // New state for animation
  const navigate = useNavigate();
  const [selectedPhases, setSelectedPhases] = useState([]); // Multiple selections for Step 2

  const handleSelection = (phase) => {
    console.log(selectedPhases)
    if (step === 2) {
      // For Step 2, allow multiple selections
      setSelectedPhases((prevSelectedPhases) =>
        prevSelectedPhases.includes(phase)
          ? prevSelectedPhases.filter((p) => p !== phase) // Remove if already selected
          : [...prevSelectedPhases, phase] // Add if not selected
      );
    } else {
      // For Step 1 and Step 3, only one selection is allowed
      setSelectedPhase(phase);
    }
  };

  const handleNextStep = () => {
    // For Step 2: Check if selectedPhases has values
    if (step === 2 && selectedPhases.length === 0) {
      // Show animation if no phases are selected in Step 2
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000); // Reset animation after 1 second
      return; // Don't advance if no phases are selected
    }
  
    // For Step 1 and Step 3, ensure selectedPhase has a value
    if (step !== 2 && !selectedPhase) {
      setIsAnimating(true); // Trigger animation for Step 1 and Step 3
      setTimeout(() => {
        setIsAnimating(false); // Stop animation after 1 second
      }, 1000);
      return; // Don't advance if no phase is selected
    }
  
    if (step === 3) {
      navigate("/subscription"); // Navigate to subscription on Step 3
    } else {
      setStep(step + 1); // Proceed to the next step
      setSelectedPhase(false); // Reset selected phase for the next step
    }
  };
  
  

  return (
    <div className={styles.container}>
      <p className={styles.stepIndicator}>{step}/3</p>

      {step === 1 && (
        <>
          <h2 className={styles.title}>Choisissez votre niveau d&apos;expérience</h2>
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
              <p>J&apos;ai quelques expériences.</p>
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
              <p>Gagner de l&apos;argent en extra</p>
            </div>

            <div
              className={`${styles.phase} ${selectedPhases.includes("experience") ? styles.selected : ""} ${isAnimating ? styles.animatePhase : ""}`}
              onClick={() => handleSelection("experience")}
            >
              <i className="bi bi-mortarboard"></i>
              <p>Obtenir de l&apos;expérience</p>
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
              <p>Je souhaite empaqueter mon travail pour que les clients l&apos;achètent.</p>
              <p className={styles.subtitle}>
                Définissez votre service avec des prix et des délais, nous le listerons dans notre catalogue pour que les clients l&apos;achètent directement.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className={styles.buttonContainer}>
        <div className={styles.buttonDiv}>
          {step > 1 && (
            <button className={styles.prevButton} onClick={() => setStep(step - 1)}>
              Précédent
            </button>
          )}
        </div>
        <div className={styles.buttonDiv}>
            <button className={styles.nextButton} onClick={handleNextStep}>
              Suivant
            </button>
        </div>
      </div>
    </div>
  );
};

export default Experience;
