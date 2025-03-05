/* eslint-disable react/no-unescaped-entities */
import React, { useState, Suspense, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import styles from './UserInformation.module.css';
import UserService from '../Services/UserService';
import ConsultantService from '../Services/ConsultantService';
import EntrepriseService from '../Services/EntrepriseService';
import DomaineService from '../Services/DomaineService';
import CompetenceService from '../Services/CompetenceService';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const userWithToken = JSON.parse(localStorage.getItem("userWithToken")) || {};
const userId=userWithToken?.id;
console.log("user pulled from login",userWithToken)
const defaultPosition = [36.8065, 10.1815];
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Clé API Openrouteservice (remplacez-la par votre clé)
const API_KEY = '5b3ce3597851110001cf62482cbdc17076234bec8173d3b80ed1a1bf';

// Reverse geocoding : coordonnées -> adresse
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lat=${lat}&point.lon=${lng}`
    );
    if (response.data && response.data.features && response.data.features.length > 0) {
      return response.data.features[0].properties.label;
    }
    return '';
  } catch (error) {
    console.error('Erreur dans le reverse geocoding :', error);
    return '';
  }
};

// Forward geocoding : adresse -> coordonnées
const forwardGeocode = async (address) => {
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`
    );
    if (response.data && response.data.features && response.data.features.length > 0) {
      const [lng, lat] = response.data.features[0].geometry.coordinates;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Erreur dans le géocodage direct :', error);
    return null;
  }
};

// Composant pour recentrer la carte
function MapUpdater({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom(), { animate: true });
    }
  }, [latitude, longitude, map]);
  return null;
}

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
        height: '300px',
        width: '100%',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Composant pour mettre à jour la vue de la carte */}
      <MapUpdater latitude={latitude} longitude={longitude} />
      <MapClickHandler />
      {(latitude && longitude) && (
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>Emplacement sélectionné</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

const LazyClickableMap = React.lazy(() =>
  Promise.resolve({ default: ClickableMap })
);

const resetLocation = (setFieldValue) => {
  setFieldValue('latitude', defaultPosition[0]);
  setFieldValue('longitude', defaultPosition[1]);
};

const Step1Schema = Yup.object().shape({
  nom: Yup.string().required('Champ requis'),
  prenom: Yup.string().required('Champ requis'),
  email: Yup.string().email('Email invalide').required('Champ requis'),
  telephone: Yup.string().required('Champ requis'),
  adresse: Yup.string().required('Champ requis'),
  latitude: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('La latitude est requise'),
  longitude: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('La longitude est requise'),
});

const Step2Schema = Yup.object().shape({
  domaines: Yup.array().min(1, 'Veuillez sélectionner au moins un domaine'),
  competences: Yup.array().min(1, 'Veuillez sélectionner au moins une compétence'),
  portfolio: Yup.string().required('Champ requis'),
  experienceYears: Yup.number()
    .required('Champ requis')
    .typeError('Doit être un nombre'),
  taux_horaire: Yup.number()
    .required('Champ requis')
    .typeError('Doit être un nombre'),
});


// Composant personnalisé pour le champ adresse (déclenche géocodage direct au blur)
const AddressField = ({ field, form, ...props }) => {
  const { setFieldValue } = form;
  const handleBlur = async (e) => {
    field.onBlur(e);
    const address = e.target.value;
    if (address) {
      const coords = await forwardGeocode(address);
      if (coords) {
        setFieldValue('latitude', coords.lat);
        setFieldValue('longitude', coords.lng);
        toast.success(`Coordonnées mises à jour: lat ${coords.lat}, lng ${coords.lng}`);
      } else {
        toast.error("Impossible de géocoder cette adresse.");
      }
    }
  };

  return <input {...field} {...props} onBlur={handleBlur} />;
};

const UserInformation = () => {
  const [fetchedUser, setFetchedUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await UserService.getById(userId);
        setFetchedUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        toast.error("Erreur lors de la récupération des données utilisateur.");
      }
    }
    fetchUser();
  }, [userId]);

  const initialValues = {
    nom: fetchedUser?.nom || '',
    prenom: fetchedUser?.prenom || '',
    email: fetchedUser?.email || '',
    telephone: '',
    adresse: '',
    photoprofile: null,
    latitude: defaultPosition[0],
    longitude: defaultPosition[1],
    domaines: [],
    competences: [],
    portfolio: '',
    experienceYears: '',
    taux_horaire: '',
  };
  

  const [userRole, setUserRole] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [fetchedDomaines, setFetchedDomaines] = useState([]);
  const [fetchedCompetences, setFetchedCompetences] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const domaines = await DomaineService.getAllDomaines();
        const competences = await CompetenceService.getAllCompetences();
        setFetchedDomaines(domaines);
        setFetchedCompetences(competences);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        toast.error("Erreur lors de la récupération des domaines et compétences.");
      }
      setLoadingData(false);
    }
    fetchData();
  }, []);

  const domainOptions = fetchedDomaines.map(d => ({ value: d.nom, label: d.nom }));
  const competenceOptions = Array.from(
    new Map(
      fetchedCompetences.map(c => [c.nom.toLowerCase(), { value: c.nom, label: c.nom }])
    ).values()
  );

  const formikRef = React.useRef(null);
  React.useEffect(() => {
    if (formikRef.current) {
      formikRef.current.validateForm();
    }
  }, [currentStep]);

  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    console.log(role)
    UserService.updateUserRole(userId, role)
      .then((updatedUser) => {
        setUserRole(updatedUser.role);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Erreur lors de la mise à jour du rôle');
      });
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue('photoprofile', file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handlePreviewSubmit = (values, setSubmitting) => {
    setModalData(values);
    console.log(modalData)
    setShowModal(true);
    setSubmitting(false);
  };

  const handleFinalSubmit = async (values) => {
    setLoading(true);
    try {
      if (values.photoprofile) {
        await UserService.uploadProfilePicture(userId, values.photoprofile);
      }
      
      const transformedCompetences = values.competences.map(comp => {
        const existing = fetchedCompetences.find(c => c.nom.toLowerCase() === comp.nom.toLowerCase());
        return existing ? existing : comp; 
      });
      
      const transformedDomaines = values.domaines.map(dom => {
        const existing = fetchedDomaines.find(
          d => d.nom.toLowerCase() === dom.toLowerCase()
        );
        return existing ? existing : { nom: dom, category: null };
      });
      const consultantData = {
        nom: values.nom,
        prenom: values.prenom,
        adresse: values.adresse,
        email: values.email,
        telephone: values.telephone,
        password: values.password,
        role: userRole,
        competences: transformedCompetences,
        domaines: transformedDomaines,
        portfolio: values.portfolio,
        experienceYears: values.experienceYears,
        taux_horaire: values.taux_horaire,
        latitude: values.latitude,
        longitude: values.longitude,
        workload: values.workload || 0,
      };
      localStorage.removeItem("user")
      const newConsultant = await ConsultantService.updateConsultant(userId, consultantData);
      localStorage.setItem("Consultant", JSON.stringify(newConsultant));
      console.log(newConsultant)
      if (newConsultant) {
        navigate("/SignupSuccess");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
    setLoading(false);
    setShowModal(false);
  };

  // Étape 1 pour les consultants : affichage du formulaire et de la carte interactive
  const renderConsultantStep = (values, setFieldValue, isSubmitting, isValid) => {
    return (
      <AnimatePresence exitBeforeEnter>
        {currentStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <h4 className="mb-3">Informations Personnelles</h4>
            <div className="mb-3">
              <Field type="text" name="nom" placeholder="Nom" className="form-control" />
              <ErrorMessage name="nom" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="text" name="prenom" placeholder="Prénom" className="form-control" />
              <ErrorMessage name="prenom" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="email" name="email" placeholder="Email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="text" name="telephone" placeholder="Téléphone" className="form-control" />
              <ErrorMessage name="telephone" component="div" className="text-danger" />
            </div>
            {/* Utilisation du composant AddressField pour mettre à jour l'adresse et les coordonnées */}
            <div className="mb-3">
              <Field
                name="adresse"
                placeholder="Adresse"
                className="form-control"
                component={AddressField}
              />
              <ErrorMessage name="adresse" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <input
                type="file"
                name="photoprofile"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Aperçu"
                    style={{ width: '150px', height: '150px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <Suspense fallback={<div>Chargement de la carte...</div>}>
                <LazyClickableMap
                  latitude={values.latitude}
                  longitude={values.longitude}
                  onLocationSelect={async (lat, lng) => {
                    // Mise à jour via clic sur la carte (reverse geocoding)
                    setFieldValue('latitude', lat);
                    setFieldValue('longitude', lng);
                    const address = await reverseGeocode(lat, lng);
                    if (address) {
                      setFieldValue('adresse', address);
                      toast.success(`Adresse mise à jour : ${address}`);
                    } else {
                      toast.error("Impossible de récupérer l'adresse pour ces coordonnées.");
                    }
                  }}
                />
              </Suspense>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => resetLocation(setFieldValue)}
                className="mt-2"
              >
                Réinitialiser la localisation
              </Button>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                disabled={!isValid}
              >
                Suivant
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h4 className="mb-3">Informations Professionnelles</h4>
            {loadingData ? (
              <div>Chargement des domaines et compétences...</div>
            ) : (
              <>
                <div className="mb-3">
                  <CreatableSelect
                    isMulti
                    name="domaines"
                    options={domainOptions}
                    value={values.domaines.map(d => ({ value: d, label: d }))}
                    onChange={(selected) =>
                      setFieldValue('domaines', selected ? selected.map(s => s.value) : [])
                    }
                    placeholder="Domaines d'expertise"
                  />
                </div>
                <div className="mb-3">
                <CreatableSelect
  isMulti
  name="competences"
  options={competenceOptions}  // Options are of the form { value, label }
  value={values.competences.map(comp => ({ value: comp.nom, label: comp.nom }))}
  onChange={(selected) => {
    // Map selected options to objects with a default level "Débutant"
    const competencesArray = selected ? selected.map(s => ({
      nom: s.value,
      competenceNiveau: "Débutant"
    })) : [];
    setFieldValue('competences', competencesArray);
  }}
  placeholder="Compétences"
/>

                </div>
              </>
            )}
             {values.competences && values.competences.length > 0 && (
  <div className="mb-3">
    <h5 className="mt-3">Niveaux de compétence</h5>
    {values.competences.map((comp, idx) => (
      <div key={idx} className="mb-2">
        <label>{comp.nom} :</label>
        <select
          className="form-select d-inline-block w-auto ms-2"
          value={comp.competenceNiveau}
          onChange={(e) => {
            const newLevel = e.target.value;
            // Create a copy of the competences array and update the level
            const updatedCompetences = [...values.competences];
            updatedCompetences[idx].competenceNiveau = newLevel;
            setFieldValue('competences', updatedCompetences);
          }}
        >
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
    ))}
  </div>
)}

            <div className="mb-3">
              <Field type="text" name="portfolio" placeholder="Portfolio" className="form-control" />
            </div>
            <div className="mb-3">
              <Field type="number" name="experienceYears" placeholder="Expérience (années)" className="form-control" />
            </div>
            <div className="mb-3">
              <Field type="number" name="taux_horaire" placeholder="Taux Horaire" className="form-control" />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Précédent
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!isValid || isSubmitting || loading}
              >
                {loading ? (
                  <ProgressBar animated now={100} label="Envoi en cours..." />
                ) : (
                  'Vérifier et Envoyer'
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleFinalSubmitEntreprise = async (values) => {
    setLoading(true);
    try {
      if (values.photoprofile) {
        await UserService.uploadProfilePicture(userId, values.photoprofile);
      }
      const entrepriseData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone,
        adresse: values.adresse,
        nomEntreprise: values.nomentreprise,
        role: userRole,
        longitude: values.longitude,
        latitude: values.latitude    
      };
      const updatedEntreprise = await EntrepriseService.updateEntreprise(userId, entrepriseData);
      localStorage.setItem("entreprise", JSON.stringify(updatedEntreprise));
      toast.success("Entreprise mise à jour avec succès!", { icon: "✅" });
    } catch (error) {
      console.error("Error updating entreprise:", error);
      toast.error("Erreur lors de la mise à jour de l'entreprise");
    }
    setLoading(false);
  };

  const renderEntrepriseForm = (values, setFieldValue, isSubmitting) => (
    <>
      <div className="mb-3">
        <Field type="text" name="nom" placeholder="Nom" className="form-control" required />
        <ErrorMessage name="nom" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <Field type="text" name="prenom" placeholder="Prénom" className="form-control" required />
        <ErrorMessage name="prenom" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <Field type="email" name="email" placeholder="Email" className="form-control" required />
        <ErrorMessage name="email" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <Field type="text" name="telephone" placeholder="Téléphone" className="form-control" required />
        <ErrorMessage name="telephone" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <Field type="text" name="adresse" placeholder="Adresse" className="form-control" required component={AddressField} />
        <ErrorMessage name="adresse" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <input
          type="file"
          name="photoprofile"
          className="form-control"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setFieldValue)}
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Aperçu" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
          </div>
        )}
      </div>
      <div className="mb-3">
        <Suspense fallback={<div>Chargement de la carte...</div>}>
        <LazyClickableMap
          latitude={values.latitude}
        longitude={values.longitude}
        onLocationSelect={async (lat, lng) => {
          setFieldValue('latitude', lat);
          setFieldValue('longitude', lng);
          const address = await reverseGeocode(lat, lng);
          if (address) {
            setFieldValue('adresse', address);
            toast.success(`Adresse mise à jour : ${address}`);
          } else {
            toast.error("Impossible de récupérer l'adresse pour ces coordonnées.");
          }
  }}
/>

        </Suspense>
        <Button variant="secondary" size="sm" onClick={() => resetLocation(setFieldValue)} className="mt-2">
          Réinitialiser la localisation
        </Button>
      </div>
      <div className="mb-3">
        <Field type="text" name="nomentreprise" placeholder="Nom de l'entreprise" className="form-control" required />
        <ErrorMessage name="nomentreprise" component="div" className="text-danger" />
      </div>
      <Button
        variant="primary"
        type="button"
        disabled={isSubmitting || loading}
        className="btn btn-warning btn-lg mt-3 w-100"
        onClick={() => handleFinalSubmitEntreprise(values)}
      >
        {loading ? (
          <ProgressBar animated now={100} label="Envoi en cours..." />
        ) : (
          'Envoyer'
        )}
      </Button>
    </>
  );

  return (
    <>
      <div className="container my-5">
        <ToastContainer />
        <h2 className="text-center mb-4">Formulaire d’Inscription</h2>
        {userRole === '' ? (
          <div className="d-flex justify-content-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card p-3 text-center"
              style={{ width: '18rem', cursor: 'pointer' }}
              onClick={() => handleRoleSelection('Consultant')}
            >
              <div className="card-body">
                <i className="bi bi-person-lines-fill display-4 mb-3"></i>
                <h3 className="card-title">Consultant</h3>
                <p className="card-text">Inscrivez-vous en tant que Consultant</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card p-3 text-center"
              style={{ width: '18rem', cursor: 'pointer' }}
              onClick={() => handleRoleSelection('Entreprise')}
            >
              <div className="card-body">
                <i className="bi bi-building display-4 mb-3"></i>
                <h3 className="card-title">Entreprise</h3>
                <p className="card-text">Inscrivez-vous en tant qu'Entreprise</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={currentStep === 1 ? Step1Schema : Step2Schema}
            validateOnMount={true}
            onSubmit={(values, { setSubmitting }) => {
              if (userRole === 'Consultant') {
                if (currentStep === 1) {
                  setCurrentStep(2);
                  setSubmitting(false);
                } else {
                  handlePreviewSubmit(values, setSubmitting);
                }
              } else {
                setLoading(true);
                setTimeout(() => {
                  console.log({ ...values, role: userRole });
                  setLoading(false);
                  toast.success('Inscription réussie !', { icon: '✅' });
                  setSubmitting(false);
                }, 2000);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting, isValid }) => (
              <Form className="mt-4">
                {userRole === 'Consultant'
                  ? renderConsultantStep(values, setFieldValue, isSubmitting, isValid)
                  : renderEntrepriseForm(values, setFieldValue, isSubmitting)}
              </Form>
            )}
          </Formik>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Récapitulatif de vos informations</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {modalData && (
            <div>
              <p><strong>Nom:</strong> {modalData.nom}</p>
              <p><strong>Prénom:</strong> {modalData.prenom}</p>
              <p><strong>Email:</strong> {modalData.email}</p>
              <p><strong>Téléphone:</strong> {modalData.telephone}</p>
              <p><strong>Adresse:</strong> {modalData.adresse}</p>
              {preview && (
                <div>
                  <br />
                  <img src={preview} className={styles.modalPhoto} alt="Aperçu" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
                </div>
              )}
              <p><strong>Domaines:</strong> {modalData.domaines.join(', ')}</p>
              <p><strong>Portfolio:</strong> {modalData.portfolio}</p>
              <p><strong>Expérience (années):</strong> {modalData.experienceYears}</p>
              <p><strong>Taux Horaire:</strong> {modalData.taux_horaire}</p>
              
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Modifier
          </Button>
          <Button variant="primary" onClick={() => handleFinalSubmit(modalData)}>
            Confirmer et Envoyer
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default UserInformation;