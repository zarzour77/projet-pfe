// src/components/PublierMission.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import styles from "./publiermission.module.css";
import publiermissionService from "../services/publiermissionService";
import CompetenceService from "../services/CompetenceService";
import DomaineService from "../services/DomaineService";

// Définition des étapes du formulaire
const steps = [
  "Titre & Description",
  "Domaines & Compétences",
  "Portée & Localisation",
  "Budget",
  "Confirmation",
];

// Position par défaut et icône personnalisée pour la carte
const defaultPosition = [36.8065, 10.1815];
const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Composant pour la carte cliquable
function ClickableMap({ latitude, longitude, onLocationSelect }) {
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const position = (latitude && longitude) ? [latitude, longitude] : defaultPosition;

  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {(latitude && longitude) && (
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>Emplacement sélectionné</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

// Fonction utilitaire pour réinitialiser la localisation
const resetLocation = (setValue) => {
  setValue("latitude", null);
  setValue("longitude", null);
};

const PublierMission = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      domaines: [],
      skills: [],
      scope: "",
      duration: "",
      experience: "",
      latitude: null,
      longitude: null,
      budget: "",
    },
  });

  // États pour stocker les options récupérées depuis la base
  const [competenceOptions, setCompetenceOptions] = useState([]);
  const [domaineOptions, setDomaineOptions] = useState([]);

  // Récupérer et filtrer les compétences et domaines (une seule occurrence par nom, en minuscules)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const competences = await CompetenceService.getAllCompetences();
        const domaines = await DomaineService.getAllDomaines();

        const uniqueCompetences = Array.from(
          new Map(
            competences.map(c => [c.nom.toLowerCase(), { value: c.id, label: c.nom }])
          ).values()
        );
        setCompetenceOptions(uniqueCompetences);

        const uniqueDomaines = Array.from(
          new Map(
            domaines.map(d => [d.nom.toLowerCase(), { value: d.id, label: d.nom }])
          ).values()
        );
        setDomaineOptions(uniqueDomaines);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      setSubStep(0);
    }
  }, [currentStep]);

  const subQuestions = [
    {
      name: "scope",
      title: "Portée du travail",
      description: "(ex: construire un site complet, etc.)",
      options: [
        { value: "Large", label: "Large" },
        { value: "Medium", label: "Medium" },
        { value: "Small", label: "Small" },
      ],
    },
    {
      name: "duration",
      title: "Durée estimée",
      options: [
        { value: "3-6 mois", label: "3 à 6 mois" },
        { value: "1-3 mois", label: "1 à 3 mois" },
        { value: "< 1 mois", label: "Moins d'un mois" },
      ],
    },
    {
      name: "experience",
      title: "Niveau d'expérience requis",
      options: [
        { value: "Entry", label: "Entry (Débutant / Junior)" },
        { value: "Intermediate", label: "Intermediate (Expérience substantielle)" },
        { value: "Expert", label: "Expert (Expertise poussée et complète)" },
      ],
    },
  ];

  const handleOptionSelect = (name, value) => {
    setValue(name, value);
    setSubStep(prev => prev + 1);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Lorsqu'on clique sur "Create" pour une compétence, la nouvelle valeur est créée et ajoutée directement à la sélection
  const handleCreateCompetence = async (inputValue) => {
    const exists = competenceOptions.some(
      option => option.label.toLowerCase() === inputValue.toLowerCase()
    );
    if (exists) {
      const currentSkills = getValues("skills") || [];
      const alreadySelected = currentSkills.some(
        skill => skill.label.toLowerCase() === inputValue.toLowerCase()
      );
      if (!alreadySelected) {
        const existingOption = competenceOptions.find(
          option => option.label.toLowerCase() === inputValue.toLowerCase()
        );
        setValue("skills", [...currentSkills, existingOption]);
      }
      return;
    }
    try {
      const newCompetence = await CompetenceService.createCompetence({ nom: inputValue });
      const newOption = { value: newCompetence.id, label: newCompetence.nom };
      // Ajout de la nouvelle option dans la liste
      setCompetenceOptions(prev => [...prev, newOption]);
      // Mise à jour immédiate de la sélection pour afficher la bulle
      const currentSkills = getValues("skills") || [];
      setValue("skills", [...currentSkills, newOption]);
    } catch (error) {
      console.error("Erreur lors de la création de la compétence :", error);
    }
  };

  // Pareil pour les domaines
  const handleCreateDomain = async (inputValue) => {
    const exists = domaineOptions.some(
      option => option.label.toLowerCase() === inputValue.toLowerCase()
    );
    if (exists) {
      const currentDomaines = getValues("domaines") || [];
      const alreadySelected = currentDomaines.some(
        domaine => domaine.label.toLowerCase() === inputValue.toLowerCase()
      );
      if (!alreadySelected) {
        const existingOption = domaineOptions.find(
          option => option.label.toLowerCase() === inputValue.toLowerCase()
        );
        setValue("domaines", [...currentDomaines, existingOption]);
      }
      return;
    }
    try {
      const newDomaine = await DomaineService.createDomaine({ nom: inputValue });
      const newOption = { value: newDomaine.id, label: newDomaine.nom };
      setDomaineOptions(prev => [...prev, newOption]);
      const currentDomaines = getValues("domaines") || [];
      setValue("domaines", [...currentDomaines, newOption]);
    } catch (error) {
      console.error("Erreur lors de la création du domaine :", error);
    }
  };

  // Transformation des données avant soumission
  const onSubmit = async (data) => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      setIsLoading(true);
      const transformedData = {
        titre: data.title,
        description: data.description,
        budget: data.budget,
        domaines: data.domaines.map(dom => ({
          id: dom.value, // id présent si existant
          nom: dom.label || dom.value,
        })),
        competencesRequises: data.skills.map(skill => ({
          id: skill.value,
          nom: skill.label || skill.value,
        })),
        portetravail: data.scope,
        dureeEstime: data.duration,
        niveauExperienceRequis: data.experience,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      try {
        const missionPublished = await publiermissionService.publishMission(transformedData);
        console.log("Mission publiée :", missionPublished);
        setSubmitted(true);
      } catch (error) {
        console.error("Erreur de publication :", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Titre de la mission *</label>
              <input
                id="title"
                {...register("title", { required: "Le titre est requis" })}
                placeholder="Entrez le titre de la mission"
                className={styles.inputField}
              />
              {errors.title && <span className={styles.errorMsg}>{errors.title.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                {...register("description", { required: "La description est requise" })}
                placeholder="Décrivez la mission ici..."
                className={styles.textAreaField}
              />
              {errors.description && <span className={styles.errorMsg}>{errors.description.message}</span>}
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="domaines">Domaines requis *</label>
              <CreatableSelect
                id="domaines"
                options={domaineOptions}
                isMulti
                placeholder="Choisissez des domaines"
                className={styles.reactSelect}
                value={watch("domaines")}
                onChange={(selected) => {
                  const event = { target: { name: "domaines", value: selected } };
                  register("domaines").onChange(event);
                }}
                onCreateOption={handleCreateDomain}
              />
              {errors.domaines && <span className={styles.errorMsg}>{errors.domaines.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="skills">Compétences requises *</label>
              <CreatableSelect
                id="skills"
                options={competenceOptions}
                isMulti
                placeholder="Choisissez des compétences"
                className={styles.reactSelect}
                value={watch("skills")}
                onChange={(selected) => {
                  const event = { target: { name: "skills", value: selected } };
                  register("skills").onChange(event);
                }}
                onCreateOption={handleCreateCompetence}
              />
              {errors.skills && <span className={styles.errorMsg}>{errors.skills.message}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Estimez la portée de votre travail</h2>
            {subQuestions.map((q, i) => {
              if (i < subStep) {
                return (
                  <div key={q.name} className={styles.subQuestionSummary}>
                    <strong>{q.title} :</strong> {getValues(q.name)}
                  </div>
                );
              } else if (i === subStep) {
                return (
                  <div key={q.name} className={styles.subQuestion}>
                    <h3>{q.title}</h3>
                    {q.description && <p>{q.description}</p>}
                    <div className={styles.radioGroup}>
                      {q.options.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name={q.name}
                            value={option.value}
                            onChange={() => handleOptionSelect(q.name, option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
            {subStep === subQuestions.length && (
              <div className={styles.additionalFields}>
                <div className={styles.formGroup}>
                  <label>Localisation de la mission *</label>
                  <ClickableMap
                    latitude={latitude}
                    longitude={longitude}
                    onLocationSelect={(lat, lng) => {
                      setValue("latitude", lat);
                      setValue("longitude", lng);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => resetLocation(setValue)}
                    className={styles.resetButton}
                  >
                    Réinitialiser la localisation
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="budget">Budget fixe *</label>
              <input
                id="budget"
                type="number"
                {...register("budget", {
                  required: "Le budget est requis",
                  min: { value: 1, message: "Le budget doit être supérieur à 0" },
                })}
                placeholder="Entrez le budget en €"
                className={styles.inputField}
              />
              <small className={styles.helperText}>Veuillez entrer votre budget fixe.</small>
              {errors.budget && <span className={styles.errorMsg}>{errors.budget.message}</span>}
            </div>
          </div>
        );
      case 4:
        const data = getValues();
        return (
          <div className={styles.stepContent}>
            <h2>Revue & Confirmation</h2>
            <div className={styles.summaryItem}>
              <strong>Titre :</strong> {data.title}
            </div>
            <div className={styles.summaryItem}>
              <strong>Description :</strong> {data.description}
            </div>
            <div className={styles.summaryItem}>
              <strong>Domaines :</strong>{" "}
              {(data.domaines || []).map((dom) => dom.label).join(", ")}
            </div>
            <div className={styles.summaryItem}>
              <strong>Compétences :</strong>{" "}
              {(data.skills || []).map((skill) => skill.label).join(", ")}
            </div>
            <div className={styles.summaryItem}>
              <strong>Portée :</strong> {data.scope}
            </div>
            <div className={styles.summaryItem}>
              <strong>Durée :</strong> {data.duration}
            </div>
            <div className={styles.summaryItem}>
              <strong>Niveau d'expérience :</strong> {data.experience}
            </div>
            <div className={styles.summaryItem}>
              <strong>Localisation :</strong> {data.latitude}, {data.longitude}
            </div>
            <div className={styles.summaryItem}>
              <strong>Budget :</strong> {data.budget} €
            </div>
            <p>Veuillez vérifier vos informations avant de publier.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.stepper}>
            {steps.map((stepLabel, index) => (
              <div
                key={index}
                className={`${styles.step} ${
                  currentStep === index
                    ? styles.activeStep
                    : currentStep > index
                    ? styles.completedStep
                    : ""
                }`}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepLabel}>{stepLabel}</div>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(currentStep)}
            </motion.div>
          </AnimatePresence>
          <div className={styles.buttonContainer}>
            {currentStep > 0 && (
              <button type="button" onClick={prevStep} className={styles.backButton}>
                Back
              </button>
            )}
            <button
              type="submit"
              className={styles.nextButton}
              disabled={isLoading || (currentStep === 2 && subStep < subQuestions.length)}
            >
              {isLoading ? <span className={styles.spinner}></span> : currentStep === steps.length - 1 ? "Publier" : "Next"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.successMessage}>
          <h2>Votre mission a bien été publiée !</h2>
          <button onClick={() => window.location.reload()} className={styles.homeButton}>
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
};

export default PublierMission;
