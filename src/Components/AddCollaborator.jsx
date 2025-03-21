/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../Services/AuthService';
import ConsultantService from '../Services/ConsultantService';
import styles from './AddCollaborator.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserService from '../Services/UserService';

const AddCollaborator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [entrepriseId, setEntrepriseId] = useState(null);
  const [createdUserId, setCreatedUserId] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      setEntrepriseId(storedUser.id);
    }
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

  const handleCvUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const staticData = {
        competences: ['JavaScript', 'React', 'Node.js'],
        experienceYears: 3,
        taux_horaire: 50
      };
      setExtractedData(staticData);
      setFieldValue('competences', staticData.competences);
      setFieldValue('experienceYears', staticData.experienceYears);
      setFieldValue('taux_horaire', staticData.taux_horaire);
    }
  };

  const uploadDefaultProfilePicture = async (userId) => {
    try {
      // Fetch default image from public folder
      const response = await fetch('/assets/defaultProfilePic.jpg');
      const blob = await response.blob();
      console.log(blob)
      // Convert blob to File object
      const file = new File([blob], 'default-profile.jpg', { type: 'image/jpeg' });
      
      // Upload using existing service method
      await UserService.uploadProfilePicture(userId, file);
    } catch (error) {
      console.error('Error uploading default profile:', error);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (currentStep === 1) {
        // Step 1: Create user account
        const userData = {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          password: 'TempPassword123!',
        };

        const response = await AuthService.signup(userData);
        setCreatedUserId(response.id);
        
        // Update user role to Consultant
        await UserService.updateUserRole(response.id, 'Consultant');
        
        // Upload default profile picture
        await uploadDefaultProfilePicture(response.id);
        
        setCurrentStep(2);
      } else {
        // Step 2: Create consultant profile
        if (!createdUserId || !entrepriseId) {
          throw new Error("Missing required IDs");
        }

        const consultantData = {
          experienceYears: values.experienceYears,
          taux_horaire: values.taux_horaire,
          typeConsultant: 'ENTREPRISE_SSI',
          entrepriseSsi: { id: entrepriseId },
          dateRecrutement : new Date()
        };
        
        await ConsultantService.updateConsultant(createdUserId, consultantData);
        
        toast.success('Collaborateur ajouté avec succès !');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'opération");
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

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

                <div className={styles.formGroup}>
                  <label>Compétences</label>
                  <Field
                    name="competences"
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Compétences (séparées par des virgules)"
                        value={values.competences.join(', ')}
                        onChange={(e) => {
                          const skills = e.target.value.split(',').map(s => s.trim());
                          setFieldValue('competences', skills);
                        }}
                      />
                    )}
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