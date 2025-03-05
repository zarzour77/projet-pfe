import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import styles from "./ProfessionalDetails.module.css";
import langueService from "../Services/LangueService"; // Adjust the path as needed
import consultantService from "../Services/ConsultantService"; // Import your consultant service
import { useNavigate } from "react-router-dom"; // Import useNavigate

const storedConsultant = JSON.parse(localStorage.getItem("Consultant"));
const ConsultantId = storedConsultant?.id;
console.log(storedConsultant)
const ProfessionalDetails = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate(); // Initialize navigate

  // Data states for each section
  const [langues, setLangues] = useState([]);
  const [formations, setFormations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // State for language options fetched from the API
  const [languageOptions, setLanguageOptions] = useState([]);
  // State to store full fetched languages from the database
  const [fetchedLangues, setFetchedLangues] = useState([]);
  // State for the selected language option (object with { value, label })
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  // This state will hold the string value of the selected or created language
  const [languageName, setLanguageName] = useState("");
  const [languageLevel, setLanguageLevel] = useState(""); // Options: "Débutant", "Courant", "Bilingue"

  // Current inputs for Formations
  const [diplome, setDiplome] = useState("");
  const [universite, setUniversite] = useState("");
  const [formationStart, setFormationStart] = useState("");
  const [formationEnd, setFormationEnd] = useState("");

  // Current inputs for Certifications
  const [certName, setCertName] = useState("");
  const [organisme, setOrganisme] = useState("");
  const [certDate, setCertDate] = useState("");

  // Fetch language options on mount and store full language data
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const data = await langueService.getAllLangues();
        // Save full fetched languages
        setFetchedLangues(data);
        // Remove duplicates based on the "nom" property to build options for the select
        const uniqueNames = [...new Set(data.map(lang => lang.nom))];
        const options = uniqueNames.map(nom => ({ value: nom, label: nom }));
        setLanguageOptions(options);
      } catch (error) {
        console.error("Failed to fetch language options", error);
      }
    }
    fetchLanguages();
  }, []);

  // Handler to add a language
  const addLanguage = () => {
    if (!languageName || !languageLevel) {
      toast.error("Veuillez remplir le nom et le niveau de la langue");
      return;
    }
    setLangues([...langues, { languageName, languageLevel }]);
    // Reset the select and input states
    setSelectedLanguage(null);
    setLanguageName("");
    setLanguageLevel("");
  };

  const addFormation = () => {
    if (!diplome || !universite || !formationStart || !formationEnd) {
      toast.error("Veuillez remplir tous les champs de formation");
      return;
    }
    setFormations([
      ...formations,
      { diplome, universite, formationStart, formationEnd },
    ]);
    setDiplome("");
    setUniversite("");
    setFormationStart("");
    setFormationEnd("");
  };

  const addCertification = () => {
    if (!certName || !organisme || !certDate) {
      toast.error("Veuillez remplir tous les champs de certification");
      return;
    }
    setCertifications([
      ...certifications,
      { certName, organisme, certDate },
    ]);
    setCertName("");
    setOrganisme("");
    setCertDate("");
  };

  const nextStep = () => setStep(prev => prev + 1);
  const ignoreStep = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    // Transform langues: if a language already exists in the database, use it.
    const transformedLangues = langues.map(lang => {
      const existing = fetchedLangues.find(
        l => l.nom.toLowerCase() === lang.languageName.toLowerCase()
      );
      return existing 
        ? existing 
        : { nom: lang.languageName, niveau: lang.languageLevel };
    });

    // Map front-end keys to backend keys so that the attributes match your database:
    const allData = {
      langues: transformedLangues,
      formations: formations.map(f => ({
        diplome: f.diplome,
        universite: f.universite,
        dateDebut: f.formationStart,
        dateFin: f.formationEnd,
      })),
      certifications: certifications.map(c => ({
        nom: c.certName,
        organisme: c.organisme,
        dateObtention: c.certDate,
      })),
    };

    console.log(allData);

    try {
      const updatedConsultant = await consultantService.updateConsultant(ConsultantId, allData);
      localStorage.setItem("Consultant", JSON.stringify(updatedConsultant));
      toast.success("Vos informations ont été sauvegardées !");
      
      setTimeout(() => {
        navigate("/experience"); // Redirect to the experience page
      }, 2000); // Optional delay to let the user see the success message

    } catch (error) {
      console.error("Error updating consultant:", error);
      toast.error("Erreur lors de la sauvegarde du CV");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Complétez votre CV</h2>
      <AnimatePresence exitBeforeEnter>
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={styles.stepContainer}
          >
            <h3>Langues</h3>
            <div className={styles.formGroup}>
              <CreatableSelect
                isClearable
                onChange={(newValue) => {
                  setSelectedLanguage(newValue);
                  setLanguageName(newValue ? newValue.value : "");
                }}
                options={languageOptions}
                value={selectedLanguage}
                placeholder="Nom de la langue"
                className={styles.input}
              />
              <select
                value={languageLevel}
                onChange={(e) => setLanguageLevel(e.target.value)}
                className={styles.input}
              >
                <option value="">--Sélectionnez un niveau--</option>
                <option value="Débutant">Débutant</option>
                <option value="Courant">Courant</option>
                <option value="Bilingue">Bilingue</option>
              </select>
              <button onClick={addLanguage} className={styles.addButton}>
                Ajouter
              </button>
            </div>
            {langues.length > 0 && (
              <ul className={styles.list}>
                {langues.map((lang, idx) => (
                  <li key={idx}>
                    {lang.languageName} - {lang.languageLevel}
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.buttonGroup}>
              <button onClick={ignoreStep} className={styles.skipButton}>
                Ignorer pour le moment
              </button>
              <button onClick={nextStep} className={styles.nextButton}>
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={styles.stepContainer}
          >
            <h3>Formations</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Diplôme"
                value={diplome}
                onChange={(e) => setDiplome(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Université"
                value={universite}
                onChange={(e) => setUniversite(e.target.value)}
                className={styles.input}
              />
              <input
                type="date"
                placeholder="Date de début"
                value={formationStart}
                onChange={(e) => setFormationStart(e.target.value)}
                className={styles.input}
              />
              <input
                type="date"
                placeholder="Date de fin"
                value={formationEnd}
                onChange={(e) => setFormationEnd(e.target.value)}
                className={styles.input}
              />
              <button onClick={addFormation} className={styles.addButton}>
                Ajouter Formation
              </button>
            </div>
            {formations.length > 0 && (
              <ul className={styles.list}>
                {formations.map((f, idx) => (
                  <li key={idx}>
                    {f.diplome} à {f.universite} ({f.formationStart} - {f.formationEnd})
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.buttonGroup}>
              <button onClick={ignoreStep} className={styles.skipButton}>
                Ignorer pour le moment
              </button>
              <button onClick={nextStep} className={styles.nextButton}>
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={styles.stepContainer}
          >
            <h3>Certifications</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Nom de la certification"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Organisme"
                value={organisme}
                onChange={(e) => setOrganisme(e.target.value)}
                className={styles.input}
              />
              <input
                type="date"
                placeholder="Date d'obtention"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className={styles.input}
              />
              <button onClick={addCertification} className={styles.addButton}>
                Ajouter Certification
              </button>
            </div>
            {certifications.length > 0 && (
              <ul className={styles.list}>
                {certifications.map((c, idx) => (
                  <li key={idx}>
                    {c.certName} - {c.organisme} ({c.certDate})
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.buttonGroup}>
              <button onClick={ignoreStep} className={styles.skipButton}>
                Ignorer pour le moment
              </button>
              <button onClick={nextStep} className={styles.nextButton}>
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={styles.stepContainer}
          >
            <h3>Récapitulatif</h3>
            <div>
              <p>
                <strong>Langues:</strong>
              </p>
              <ul>
                {langues.map((l, idx) => (
                  <li key={idx}>
                    {l.languageName} - {l.languageLevel}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Formations:</strong>
              </p>
              <ul>
                {formations.map((f, idx) => (
                  <li key={idx}>
                    {f.diplome} à {f.universite} ({f.formationStart} - {f.formationEnd})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Certifications:</strong>
              </p>
              <ul>
                {certifications.map((c, idx) => (
                  <li key={idx}>
                    {c.certName} - {c.organisme} ({c.certDate})
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleSubmit} className={styles.nextButton}>
              Envoyer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default ProfessionalDetails;
