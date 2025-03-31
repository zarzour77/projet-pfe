import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import styles from "./ProfessionalDetails.module.css";
import langueService from "../services/LangueService"; // Ajustez le chemin si nécessaire
import consultantService from "../Services/ConsultantService"; // Importez votre service consultant
import { useNavigate } from "react-router-dom";

// Convertit une date au format français "JJ/MM/AAAA" en format ISO "AAAA-MM-JJ"
const convertToInputDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const ProfessionalDetails = () => {
  const storedConsultant = JSON.parse(localStorage.getItem("user"));
  const ConsultantId = storedConsultant?.id;
  console.log("Consultant:", storedConsultant);

  // Récupération des données extraites du CV depuis le localStorage
  const cvExtracted = JSON.parse(localStorage.getItem("cvExtracted")) || {};
  console.log("cvExtracted:", cvExtracted);
  const cvLangues = cvExtracted.langues || [];
  const cvFormations = cvExtracted.formations || [];
  const cvCertifications = cvExtracted.certifications || [];

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // États pour chaque section
  const [langues, setLangues] = useState([]);
  const [formations, setFormations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // États pour les options de langue (depuis l'API)
  const [languageOptions, setLanguageOptions] = useState([]);
  const [fetchedLangues, setFetchedLangues] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageName, setLanguageName] = useState("");
  const [languageLevel, setLanguageLevel] = useState(""); // "Débutant", "Courant", "Bilingue"

  // Index pour l'auto-remplissage des langues depuis le CV
  const [cvLanguageIndex, setCvLanguageIndex] = useState(0);

  // Champs pour formations
  const [diplome, setDiplome] = useState("");
  const [universite, setUniversite] = useState("");
  const [formationStart, setFormationStart] = useState("");
  const [formationEnd, setFormationEnd] = useState("");
  const [cvFormationIndex, setCvFormationIndex] = useState(0);

  // Champs pour certifications
  const [certName, setCertName] = useState("");
  const [organisme, setOrganisme] = useState("");
  const [certDate, setCertDate] = useState("");
  const [cvCertificationIndex, setCvCertificationIndex] = useState(0);

  // Récupération des options de langue depuis l'API
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const data = await langueService.getAllLangues();
        setFetchedLangues(data);
        const uniqueNames = [...new Set(data.map((lang) => lang.nom))];
        const options = uniqueNames.map((nom) => ({ value: nom, label: nom }));
        setLanguageOptions(options);
      } catch (error) {
        console.error("Failed to fetch language options", error);
      }
    }
    fetchLanguages();
  }, []);

  // Auto-remplissage de la langue depuis le CV si le champ est vide,
  // en vérifiant si la langue existe dans la BDD (fetchedLangues)
  useEffect(() => {
    if (
      cvLangues.length > 0 &&
      cvLanguageIndex < cvLangues.length &&
      languageName === "" &&
      fetchedLangues.length > 0
    ) {
      let index = cvLanguageIndex;
      let langueValide = null;
      // Parcourt les langues du CV à partir de l'index courant
      while (index < cvLangues.length && !langueValide) {
        const autoLang = cvLangues[index];
        if (
          fetchedLangues.some(
            (l) => l.nom.toLowerCase() === autoLang.toLowerCase()
          )
        ) {
          langueValide = autoLang;
        } else {
          index++;
        }
      }
      if (langueValide) {
        setLanguageName(langueValide);
        setSelectedLanguage({ value: langueValide, label: langueValide });
        setCvLanguageIndex(index);
      } else {
        setLanguageName("");
        setSelectedLanguage(null);
      }
    }
  }, [cvLangues, cvLanguageIndex, languageName, fetchedLangues]);

  // Auto-remplissage pour formations depuis le CV
  useEffect(() => {
    if (cvFormations.length > 0 && cvFormationIndex < cvFormations.length) {
      const formation = cvFormations[cvFormationIndex];
      if (!diplome && formation.diplome) {
        setDiplome(formation.diplome);
      }
      if (!universite && formation.universite) {
        setUniversite(formation.universite);
      }
      if (!formationStart && formation.dateDebut) {
        setFormationStart(convertToInputDate(formation.dateDebut));
      }
      if (!formationEnd && formation.dateFin) {
        setFormationEnd(convertToInputDate(formation.dateFin));
      }
    }
  }, [cvFormations, cvFormationIndex, diplome, universite, formationStart, formationEnd]);

  // Auto-remplissage pour certifications depuis le CV
  useEffect(() => {
    if (
      cvCertifications.length > 0 &&
      cvCertificationIndex < cvCertifications.length
    ) {
      const cert = cvCertifications[cvCertificationIndex];
      if (!certName && cert.nom) {
        setCertName(cert.nom);
      }
      if (!organisme && cert.organisme) {
        setOrganisme(cert.organisme);
      }
      if (!certDate && cert.dateObtention) {
        setCertDate(convertToInputDate(cert.dateObtention));
      }
    }
  }, [cvCertifications, cvCertificationIndex, certName, organisme, certDate]);

  // Handler pour ajouter une langue
  const addLanguage = () => {
    if (!languageName || !languageLevel) {
      toast.error("Veuillez remplir le nom et le niveau de la langue");
      return;
    }
    setLangues([...langues, { languageName, languageLevel }]);
    const nextIndex = cvLanguageIndex + 1;
    setCvLanguageIndex(nextIndex);
    if (nextIndex < cvLangues.length) {
      let index = nextIndex;
      let langueValide = null;
      while (index < cvLangues.length && !langueValide) {
        const nextLang = cvLangues[index];
        if (
          fetchedLangues.some(
            (l) => l.nom.toLowerCase() === nextLang.toLowerCase()
          )
        ) {
          langueValide = nextLang;
        } else {
          index++;
        }
      }
      if (langueValide) {
        setLanguageName(langueValide);
        setSelectedLanguage({ value: langueValide, label: langueValide });
        setCvLanguageIndex(index);
      } else {
        setLanguageName("");
        setSelectedLanguage(null);
      }
    } else {
      setLanguageName("");
      setSelectedLanguage(null);
    }
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
    const nextIndex = cvFormationIndex + 1;
    setCvFormationIndex(nextIndex);
    if (nextIndex < cvFormations.length) {
      const formation = cvFormations[nextIndex];
      setDiplome(formation.diplome || "");
      setUniversite(formation.universite || "");
      setFormationStart(formation.dateDebut ? convertToInputDate(formation.dateDebut) : "");
      setFormationEnd(formation.dateFin ? convertToInputDate(formation.dateFin) : "");
    } else {
      setDiplome("");
      setUniversite("");
      setFormationStart("");
      setFormationEnd("");
    }
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
    const nextIndex = cvCertificationIndex + 1;
    setCvCertificationIndex(nextIndex);
    if (nextIndex < cvCertifications.length) {
      const cert = cvCertifications[nextIndex];
      setCertName(cert.nom || "");
      setOrganisme(cert.organisme || "");
      setCertDate(cert.dateObtention ? convertToInputDate(cert.dateObtention) : "");
    } else {
      setCertName("");
      setOrganisme("");
      setCertDate("");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const ignoreStep = () => setStep((prev) => prev + 1);

  const handleSubmit = async () => {
    const transformedLangues = langues.map((lang) => {
      const existing = fetchedLangues.find(
        (l) => l.nom.toLowerCase() === lang.languageName.toLowerCase()
      );
      return existing
        ? existing
        : { nom: lang.languageName, niveau: lang.languageLevel };
    });

    const allData = {
      langues: transformedLangues,
      formations: formations.map((f) => ({
        diplome: f.diplome,
        universite: f.universite,
        dateDebut: f.formationStart,
        dateFin: f.formationEnd,
      })),
      certifications: certifications.map((c) => ({
        nom: c.certName,
        organisme: c.organisme,
        dateObtention: c.certDate,
      })),
    };

    console.log(allData);

    try {
      const updatedConsultant = await consultantService.updateConsultant(
        ConsultantId,
        allData
      );
      localStorage.setItem("user", JSON.stringify(updatedConsultant));
      toast.success("Vos informations ont été sauvegardées !");
      setTimeout(() => {
        navigate("/experience");
      }, 2000);
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
