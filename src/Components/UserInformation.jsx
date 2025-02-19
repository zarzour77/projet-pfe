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
import styles from './UserInformation.module.css';
import UserService from '../Services/UserService';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const getSafeKey = (comp) => comp.replace(/\./g, '_');



const defaultPosition = [36.8065, 10.1815];


const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

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
  budgetMin: Yup.number()
    .required('Champ requis')
    .typeError('Doit être un nombre'),
});
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
  const user = JSON.parse(localStorage.getItem("user")) || {};
// Set initial values (now adding a default for competenceDetails)
const initialValues = {
  nom: user?.nom || '',
  prenom: user?.prenom || '',
  email: user?.email || '',
  password: user?.password || '',
  photoprofile: user?.photoprofile || '',
  latitude: user?.latitude || '',
  longitude: user?.longitude || '',
  domaines: user?.domaines || [],
  competences: user?.competences || [],
  competenceDetails: user?.competenceDetails || {} // <-- added default empty object
};
const [userRole, setUserRole] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const formikRef = React.useRef(null);
  React.useEffect(() => {
    if (formikRef.current) {
      formikRef.current.validateForm();
    }
  }, [currentStep]);

  const handleRoleSelection = (role) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    UserService.updateUserRole(userId, role)
      .then((updatedUser) => {
        // Assume the endpoint returns the updated user data including the role.
        setUserRole(updatedUser.role);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Erreur lors de la mise à jour du rôle');
      });
  };
  
  // Predefined options
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

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue('photoprofile', file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handlePreviewSubmit = (values, setSubmitting) => {
    setModalData(values);
    setShowModal(true);
    setSubmitting(false);
  };

  const handleFinalSubmit = async (values) => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      // Prepare only the fields you want to update
      const updatedData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone,
        adresse: values.adresse
      };
  
      // Call the updateUser endpoint
      const updatedUser = await UserService.updateUser(userId, updatedData);
      console.log("Updated user:", updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
       // If a new profile picture is provided, update it as well
    if (values.photoprofile) {
      console.log(values.photoprofile.name)
      const updatedUserPic = await UserService.updateProfilePicture(userId, values.photoprofile);
      console.log("Updated profile picture:", updatedUserPic);
    }
      toast.success('Mise à jour effectuée !', { icon: '✅' });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
    setLoading(false);
    setShowModal(false);
  };
  

  const chartData = {
    labels: modalData && modalData.competences ? modalData.competences : [],
    datasets: [
      {
        label: 'Niveau de compétence',
        data:
          modalData && modalData.competenceDetails
            ? modalData.competences.map(comp => modalData.competenceDetails[getSafeKey(comp)] || 0)
            : [],
        backgroundColor: 'rgba(75, 85, 192, 0.6)',
      },
    ],
  };
  

  // Consultant form rendering
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
                  onLocationSelect={(lat, lng) => {
                    setFieldValue('latitude', lat);
                    setFieldValue('longitude', lng);
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
            {/* Step 2: Informations Professionnelles */}
            <h4 className="mb-3">Informations Professionnelles</h4>
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
                options={competenceOptions}
                value={values.competences.map(c => ({ value: c, label: c }))}
                onChange={(selected) =>
                  setFieldValue('competences', selected ? selected.map(s => s.value) : [])
                }
                placeholder="Compétences"
              />
            </div>
            {values.competences && values.competences.length > 0 && (
              <div className="mb-3">
                <h5 className="mt-3">Niveaux de compétence</h5>
                {values.competences.map((comp, idx) => {
                  const safeKey = getSafeKey(comp);
                  const level = values.competenceDetails[safeKey] ?? 0;
                  return (
                    <div key={idx} className="mb-2">
                      <label>{comp} :</label>
                      <StarRating
                        rating={level}
                        onChange={(value) => setFieldValue(`competenceDetails.${safeKey}`, value)}
                      />
                      <span className="ms-2">{level} / 5</span>
                    </div>
                  );
                })}
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
  

  // Formulaire pour l'entreprise
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
        <Field type="text" name="adresse" placeholder="Adresse" className="form-control" required />
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
        <Field type="text" name="nomentreprise" placeholder="Nom de l'entreprise" className="form-control" required />
        <ErrorMessage name="nomentreprise" component="div" className="text-danger" />
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
        <h2 className="text-center mb-4">Formulaire d&lsquo;Inscription</h2>
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
          // Inside your Formik render function, include isValid:
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
                // Pour Entreprise
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
                  <strong>Photo de Profil:</strong>
                  <br />
                  <img src={preview} className={styles.modalPhoto} alt="Aperçu" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
                </div>
              )}
              <p><strong>Domaines:</strong> {modalData.domaines.join(', ')}</p>
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
