import React, { useState, Suspense } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'react-toastify/dist/ReactToastify.css';
// Vos styles personnalisés éventuels
import styles from './UserInformation.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Coordonnées par défaut pour Tunis, Tunisie
const defaultPosition = [36.8065, 10.1815];

// Personnalisation du marqueur pour la carte
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Composant de la carte cliquable
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
      <MapClickHandler />
      {(latitude && longitude) && (
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>Emplacement sélectionné</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

// Lazy loading de la carte
const LazyClickableMap = React.lazy(() =>
  Promise.resolve({ default: ClickableMap })
);

// Schéma de validation du formulaire
const SignupSchema = Yup.object().shape({
  nom: Yup.string().required('Champ requis'),
  prenom: Yup.string().required('Champ requis'),
  email: Yup.string().email('Email invalide').required('Champ requis'),
  telephone: Yup.string().required('Champ requis'),
  adresse: Yup.string().required('Champ requis'),
  // D'autres validations peuvent être ajoutées ici
});

// Composant de notation par étoiles
const StarRating = ({ rating, onChange }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? 'gold' : 'lightgray',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const UserInformation = () => {
  // Si aucun type n'est sélectionné, on affiche les cartes cliquables
  const [userType, setUserType] = useState('');
  // Pour le consultant, le formulaire est en 2 étapes
  const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Options prédéfinies
  const availableDomainsArray = [
    "Développement logiciel",
    "Développement Web",
    "Développement mobile",
    "Data Science",
    "Intelligence artificielle",
    "Cybersécurité",
    "Cloud Computing",
    "DevOps",
    "Administration de systèmes",
    "Administration de réseaux",
    "Consultance IT",
    "Business Intelligence",
    "Administration de bases de données",
    "Gestion de projets IT",
    "QA & Testing",
    "Design UX/UI",
    "Systèmes embarqués",
    "Internet des objets (IoT)",
    "Blockchain",
    "Réalité virtuelle / Réalité augmentée",
    "Développement de jeux vidéo",
    "Support informatique",
  ];
  const availableCompetencesArray = [
    "JavaScript",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "TypeScript",
    "HTML5",
    "CSS3 / Sass / Less",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "GraphQL",
    "RESTful APIs",
    "Agile / Scrum",
    "Jira",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Penetration Testing",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Data Analysis",
    "Data Visualization",
    "R",
    "Big Data (Hadoop, Spark)",
  ];

  const domainOptions = availableDomainsArray.map(domain => ({ value: domain, label: domain }));
  const competenceOptions = availableCompetencesArray.map(comp => ({ value: comp, label: comp }));

  // Valeurs initiales du formulaire
  const initialValues = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    photoprofile: null,
    domaines: [],
    competences: [],
    competenceDetails: {}, // Clé: nom de compétence, valeur: niveau
    portfolio: '',
    experienceYears: '',
    budgetMin: '',
    latitude: '',
    longitude: '',
    nomentreprise: '',
  };

  // Gestion de l'image de profil
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue('photoprofile', file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  // Réinitialiser la localisation
  const resetLocation = (setFieldValue) => {
    setFieldValue('latitude', defaultPosition[0]);
    setFieldValue('longitude', defaultPosition[1]);
  };

  // Lorsque l'utilisateur clique sur "Vérifier", on ouvre la modal de récapitulation
  const handlePreviewSubmit = (values, setSubmitting) => {
    setModalData(values);
    setShowModal(true);
    setSubmitting(false);
  };

  // Soumission finale après confirmation dans la modal
  const handleFinalSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log({ ...values, userType });
      setLoading(false);
      setShowModal(false);
      toast.success('Inscription réussie !', { icon: '✅' });
    }, 2000);
  };

  // Exemple de graphique des compétences (pour le récapitulatif)
  const chartData = {
    labels: modalData && modalData.competences ? modalData.competences : [],
    datasets: [
      {
        label: 'Niveau de compétence',
        data:
          modalData && modalData.competenceDetails
            ? modalData.competences.map(comp => modalData.competenceDetails[comp] || 0)
            : [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  // Rendu de l'étape pour le consultant avec système d'étoiles pour le niveau de compétence
  const renderConsultantStep = (values, setFieldValue, isSubmitting) => {
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
            <div className="mb-3">
              <Field type="text" name="adresse" placeholder="Adresse" className="form-control" />
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
                  onLocationSelect={(lat, lng) => {
                    setFieldValue('latitude', lat);
                    setFieldValue('longitude', lng);
                  }}
                />
              </Suspense>
              <Button variant="secondary" size="sm" onClick={() => resetLocation(setFieldValue)} className="mt-2">
                Réinitialiser la localisation
              </Button>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" onClick={() => setCurrentStep(2)}>
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
            <div className="mb-3">
              <CreatableSelect
                isMulti
                name="domaines"
                options={domainOptions}
                value={values.domaines.map(d => ({ value: d, label: d }))}
                onChange={(selected) => setFieldValue('domaines', selected ? selected.map(s => s.value) : [])}
                placeholder="Domaines d'expertise"
              />
            </div>
            <div className="mb-3">
              <CreatableSelect
                isMulti
                name="competences"
                options={competenceOptions}
                value={values.competences.map(c => ({ value: c, label: c }))}
                onChange={(selected) => setFieldValue('competences', selected ? selected.map(s => s.value) : [])}
                placeholder="Compétences"
              />
            </div>
            {values.competences && values.competences.length > 0 && (
              <div className="mb-3">
                <h5 className="mt-3">Niveaux de compétence</h5>
                {values.competences.map((comp, idx) => (
                  <div key={idx} className="mb-2">
                    <label>{comp} :</label>
                    {/* Composant StarRating pour choisir le niveau */}
                    <StarRating 
                      rating={Number(values.competenceDetails[comp]) || 1}
                      onChange={(value) => setFieldValue(`competenceDetails.${comp}`, value)}
                    />
                    <span className="ms-2">{values.competenceDetails[comp] || 1} / 5</span>
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
              <Field type="number" name="budgetMin" placeholder="Budget Min" className="form-control" />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Précédent
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
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

  // Formulaire pour l'entreprise (identique en style aux autres formulaires)
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
        <Field type="text" name="telephone" placeholder="Téléphone" className="form-control" />
        <ErrorMessage name="telephone" component="div" className="text-danger" />
      </div>
      <div className="mb-3">
        <Field type="text" name="adresse" placeholder="Adresse" className="form-control" />
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
            onLocationSelect={(lat, lng) => {
              setFieldValue('latitude', lat);
              setFieldValue('longitude', lng);
            }}
          />
        </Suspense>
        <Button variant="secondary" size="sm" onClick={() => resetLocation(setFieldValue)} className="mt-2">
          Réinitialiser la localisation
        </Button>
      </div>
      <div className="mb-3">
        <Field type="text" name="nomentreprise" placeholder="Nom de l'entreprise" className="form-control" />
      </div>
      <Button variant="primary" type="submit" disabled={isSubmitting || loading} className="btn btn-warning btn-lg mt-3 w-100">
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
        <h2 className="text-center mb-4">Formulaire d'Inscription</h2>
        {userType === '' ? (
          // Deux cartes cliquables pour choisir le type d'utilisateur
          <div className="d-flex justify-content-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card p-3 text-center"
              style={{ width: '18rem', cursor: 'pointer' }}
              onClick={() => setUserType('consultant')}
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
              onClick={() => setUserType('entreprise')}
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
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (userType === 'consultant') {
                if (currentStep === 1) {
                  setCurrentStep(2);
                  setSubmitting(false);
                } else {
                  handlePreviewSubmit(values, setSubmitting);
                }
              } else {
                setLoading(true);
                setTimeout(() => {
                  console.log({ ...values, userType });
                  setLoading(false);
                  toast.success('Inscription réussie !', { icon: '✅' });
                }, 2000);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="mt-4">
                {userType === 'consultant'
                  ? renderConsultantStep(values, setFieldValue, isSubmitting)
                  : renderEntrepriseForm(values, setFieldValue, isSubmitting)}
              </Form>
            )}
          </Formik>
        )}
      </div>

      {/* Modal de récapitulation pour les consultants */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Récapitulatif de vos informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <div>
              <p><strong>Nom:</strong> {modalData.nom}</p>
              <p><strong>Prénom:</strong> {modalData.prenom}</p>
              <p><strong>Email:</strong> {modalData.email}</p>
              <p><strong>Téléphone:</strong> {modalData.telephone}</p>
              <p><strong>Adresse:</strong> {modalData.adresse}</p>
              {preview && (
                <div>
                  <strong>Photo de Profil:</strong>
                  <br />
                  <img src={preview} alt="Aperçu" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
                </div>
              )}
              <p><strong>Localisation:</strong> {modalData.latitude}, {modalData.longitude}</p>
              <p><strong>Domaines:</strong> {modalData.domaines.join(', ')}</p>
              <p><strong>Compétences:</strong> {modalData.competences.join(', ')}</p>
              {modalData.competences && modalData.competences.length > 0 && (
                <div>
                  <h5>Niveaux de compétence :</h5>
                  {modalData.competences.map((comp, idx) => (
                    <p key={idx}>
                      <strong>{comp} :</strong> {modalData.competenceDetails && modalData.competenceDetails[comp] ? modalData.competenceDetails[comp] : 'Non renseigné'}
                    </p>
                  ))}
                </div>
              )}
              <p><strong>Portfolio:</strong> {modalData.portfolio}</p>
              <p><strong>Expérience (années):</strong> {modalData.experienceYears}</p>
              <p><strong>Budget Min:</strong> {modalData.budgetMin}</p>
              {modalData.competences && modalData.competences.length > 0 && (
                <div className="mt-3">
                  <h5>Visualisation du Profil de Compétences</h5>
                  <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
              )}
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
