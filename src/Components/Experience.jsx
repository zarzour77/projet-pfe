import { useState } from "react";
import styles from "./Experience.module.css";

const Experience = () => {
  const [step, setStep] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState(false);

  const handleSelection = (phase) => {
    setSelectedPhase(phase);
  };

  return (
    <div className={styles.container}>
      {/* Step Indicator */}
      <p className={styles.stepIndicator}>{step}/3</p>

      {/* Step 1: Choose Experience Level */}
      {step === 1 && (
        <>
          <h2 className={styles.title}>Choisissez votre niveau d&apos;expérience</h2>
          <div className={styles.phases}>
            <div
              className={`${styles.phase} ${selectedPhase === "new" ? styles.selected : ""}`}
              onClick={() => handleSelection("new")}
            >
              <i className="bi bi-lightbulb"></i>
              <p>Je débute dans ce domaine.</p>
            </div>

            <div
              className={`${styles.phase} ${selectedPhase === "some" ? styles.selected : ""}`}
              onClick={() => handleSelection("some")}
            >
              <i className="bi bi-bar-chart-line"></i>
              <p>J&apos;ai quelques expériences.</p>
            </div>

            <div
              className={`${styles.phase} ${selectedPhase === "expert" ? styles.selected : ""}`}
              onClick={() => handleSelection("expert")}
            >
              <i className="bi bi-briefcase"></i>
              <p>Je suis un expert.</p>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Choose Your Goal */}
      {step === 2 && (
        <>
          <h2 className={styles.title}>Quel est votre objectif ?</h2>
          <div className={styles.phases}>
            <div
              className={styles.phase}
              onClick={() => handleSelection("income")}
            >
              <i className="bi bi-cash-stack"></i>
              <p>Gagner un revenu principal</p>
            </div>

            <div
              className={styles.phase}
              onClick={() => handleSelection("side")}
            >
              <i className="bi bi-piggy-bank"></i>
              <p>Gagner de l&apos;argent en extra</p>
            </div>

            <div
              className={styles.phase}
              onClick={() => handleSelection("experience")}
            >
              <i className="bi bi-mortarboard"></i>
              <p>Obtenir de l&apos;expérience</p>
            </div>

            <div
              className={styles.phase}
              onClick={() => handleSelection("none")}
            >
              <i className="bi bi-question-circle"></i>
              <p>Je ne sais pas encore</p>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Choose How You Prefer to Work */}
      {step === 3 && (
        <div className={styles.step3}>
          <h2 className={styles.title}>Comment préférez-vous travailler ?</h2>
          <div className={styles.phases}>
            <div
              className={`${styles.phase} ${selectedPhase === "find" ? styles.selected : ""}`}
              onClick={() => handleSelection("find")}
            >
              <i className="bi bi-search"></i>
              <p>Je cherche des opportunités moi-même.</p>
              <p className={styles.subtitle}>
                Les clients postent des jobs sur notre marketplace, vous pouvez les consulter et enchérir, ou être invité par un client.
              </p>
            </div>

            <div
              className={`${styles.phase} ${selectedPhase === "package" ? styles.selected : ""}`}
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

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      {/* Navigation Buttons below the progress bar */}
      <div className={styles.buttonContainer}>
        <div className={styles.buttonDiv}>
          {step > 1 && (
            <button
              className={styles.prevButton}
              onClick={() => setStep(step - 1)}
            >
              Précédent
            </button>
          )}
        </div>

        <div className={styles.buttonDiv}>
          {step < 3 && (
            <button
              className={styles.nextButton}
              onClick={() => setStep(step + 1)}
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;
