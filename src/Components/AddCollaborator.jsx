/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import AuthService from '../Services/AuthService';
import ConsultantService from '../Services/ConsultantService';
import UserService from '../Services/UserService';
import CompetenceService from '../Services/CompetenceService';
import styles from './AddCollaborator.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCollaborator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [entrepriseId, setEntrepriseId] = useState(null);
  const [createdUserId, setCreatedUserId] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [availableCompetences, setAvailableCompetences] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      setEntrepriseId(storedUser.id);
    }
  }, []);

  // Récupérer les compétences disponibles en base
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const data = await CompetenceService.getAllCompetences();
        setAvailableCompetences(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des compétences :", error);
        toast.error("Erreur lors de la récupération des compétences.");
      }
    };
    fetchCompetences();
  }, []);

  // Validation Schemas
  const Step1Schema = Yup.object().shape({
    nom: Yup.string().required('Champ requis'),
    prenom: Yup.string().required('Champ requis'),
    email: Yup.string().email('Email invalide').required('Champ requis'),
  });

  const Step2Schema = Yup.object().shape({
    competences: Yup.array().min(1, 'Au moins une compétence requise'),
    experienceYears: Yup.number().required('Champ requis').min(0),
    taux_horaire: Yup.number().required('Champ requis').min(0),
  });

  const handleCvUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        // Appel à l'API d'extraction (adapter l'URL selon votre environnement)
        const response = await fetch('http://localhost:5000/extract/all', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        setExtractedData(data);

        // Remplissage automatique des champs de la partie 1
        if (data.nom) setFieldValue('nom', data.nom);
        if (data.prenom) setFieldValue('prenom', data.prenom);
        if (data.email) setFieldValue('email', data.email);

        // Pré-remplissage du champ "competences" dans l'étape 2 :
        // Comparer les compétences extraites aux compétences disponibles en base.
        if (data.competences_list && availableCompetences.length > 0) {
          const availableLower = availableCompetences.map(c => c.nom.toLowerCase());
          const filteredCompetences = data.competences_list.filter(comp => 
            availableLower.includes(comp.toLowerCase())
          );
          setFieldValue('competences', filteredCompetences);
        }
      } catch (error) {
        console.error("Erreur lors de l'extraction du CV", error);
        toast.error("Erreur lors de l'extraction du CV.");
      }
    }
  };

  const uploadDefaultProfilePicture = async (userId) => {
    try {
      const response = await fetch('/assets/defaultProfilePic.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'default-profile.jpg', { type: 'image/jpeg' });
      await UserService.uploadProfilePicture(userId, file);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo par défaut:', error);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (currentStep === 1) {
        const userData = {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          password: 'TempPassword123!',
        };

        const response = await AuthService.signup(userData);
        setCreatedUserId(response.id);
        await UserService.updateUserRole(response.id, 'Consultant');
        await uploadDefaultProfilePicture(response.id);
        setCurrentStep(2);
      } else {
        if (!createdUserId || !entrepriseId) {
          throw new Error("Missing required IDs");
        }
        const consultantData = {
          experienceYears: values.experienceYears,
          taux_horaire: values.taux_horaire,
          typeConsultant: 'ENTREPRISE_SSI',
          entrepriseSsi: { id: entrepriseId },
          dateRecrutement: new Date()
        };
        await ConsultantService.updateConsultant(createdUserId, consultantData);
        toast.success('Collaborateur ajouté avec succès !');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'opération");
      console.error('Erreur:', error);
    }
    setSubmitting(false);
  };

  // Options pour le CreatableSelect basées sur les compétences disponibles
  const competenceOptions = availableCompetences.map(c => ({
    value: c.nom,
    label: c.nom
  }));

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Formik
        initialValues={{
          nom: '',
          prenom: '',
          email: '',
          competences: [],
          experienceYears: 0,
          taux_horaire: 0
        }}
        validationSchema={currentStep === 1 ? Step1Schema : Step2Schema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form>
            {currentStep === 1 ? (
              <div className={styles.stepContainer}>
                <h2>Informations de base</h2>
                <div className={styles.formGroup}>
                  <label>Nom</label>
                  <Field name="nom" placeholder="Nom du collaborateur" />
                  <ErrorMessage name="nom" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label>Prénom</label>
                  <Field name="prenom" placeholder="Prénom du collaborateur" />
                  <ErrorMessage name="prenom" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <Field name="email" type="email" placeholder="Email du collaborateur" />
                  <ErrorMessage name="email" component="div" className={styles.error} />
                </div>
                {/* Bouton d'importation du CV */}
                <div className={styles.cvSection}>
                  <input
                    type="file"
                    id="cvUpload"
                    onChange={(e) => handleCvUpload(e, setFieldValue)}
                    accept=".pdf,.doc,.docx"
                    hidden
                  />
                  <label htmlFor="cvUpload" className={styles.uploadButton}>
                    Importer CV
                  </label>
                </div>
                <button
                  type="submit"
                  className={styles.nextButton}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Création...' : 'Suivant'}
                </button>
              </div>
            ) : (
              <div className={styles.stepContainer}>
                <h2>Informations professionnelles</h2>
                <div className={styles.formGroup}>
                  <label>Compétences</label>
                  <CreatableSelect
                    isMulti
                    name="competences"
                    options={competenceOptions}
                    value={
                      values.competences.map(comp => ({
                        value: comp,
                        label: comp
                      }))
                    }
                    onChange={(selected) =>
                      setFieldValue(
                        'competences',
                        selected ? selected.map(s => s.value) : []
                      )
                    }
                    placeholder="Sélectionnez ou créez des compétences..."
                  />
                  <ErrorMessage name="competences" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label>Années d'expérience</label>
                  <Field 
                    name="experienceYears" 
                    type="number" 
                    min="0"
                    placeholder="Années d'expérience" 
                  />
                  <ErrorMessage name="experienceYears" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label>Taux horaire (€)</label>
                  <Field 
                    name="taux_horaire" 
                    type="number" 
                    min="0"
                    placeholder="Taux horaire" 
                  />
                  <ErrorMessage name="taux_horaire" component="div" className={styles.error} />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setCurrentStep(1)}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Ajouter Collaborateur'}
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCollaborator;