import React, { useState, useEffect, Suspense } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import styles from './MissionTinder.module.css';
import { getMissions } from './MissionTinderService'; // Import du service API

// Configuration de l'icône Leaflet
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Coordonnées par défaut
const defaultPosition = [36.8065, 10.1815];

// Composant de la carte (affichage de la localisation)
function ClickableMap({ latitude, longitude }) {
  return (
    <MapContainer
      center={[latitude || defaultPosition[0], longitude || defaultPosition[1]]}
      zoom={10}
      style={{ height: '200px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>Localisation</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

const MissionStories = () => {
  // State pour les missions, l'index actif, flip et modal
  const [missions, setMissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Appel de l'API au montage du composant
  useEffect(() => {
    getMissions()
      .then((data) => {
        setMissions(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des missions :", error);
        toast.error("Erreur lors du chargement des missions");
      });
  }, []);

  // Réinitialise le flip à chaque changement de mission
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Passage à la mission suivante
  const goToNext = () => {
    if (currentIndex < missions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("Fin des missions");
    }
  };

  const handleReject = () => {
    if (!missions.length) return;
    toast.info("Mission rejetée!", { position: "bottom-center" });
    goToNext();
  };

  const handleApply = () => {
    if (!missions.length) return;
    const mission = missions[currentIndex];
    console.log("Postuler à la mission :", mission);
    toast.success("Postulation envoyée !", { icon: '✅', position: "bottom-center" });
    goToNext();
  };

  // Ouvre la modal avec plus d'infos (en complément du flip)
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!missions.length) {
    return <div className="text-center mt-5">Chargement des missions...</div>;
  }

  // Fonction pour afficher les compétences sous forme de liste séparée par des virgules
  const renderCompetences = (competences) => {
    if (!competences || competences.length === 0) {
      return "Aucune";
    }
    return competences.map((comp, index) => (
      <span key={comp.id}>
        {comp.nom}{index < competences.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  return (
    <div className={styles['mission-stories-container']}>
      <ToastContainer />
      {/* Wrapper du slider */}
      <div className={styles['mission-stories-wrapper']}>
        <motion.div
          className={styles['mission-stories-slider']}
          animate={{ x: 50 - currentIndex * (500 + 20), rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {missions.map((mission, index) => (
            <motion.div
              key={`${mission.id}-${index}`}
              className={`${styles['mission-card']} ${index === currentIndex ? styles.active : styles.inactive}`}
              style={{ zIndex: index === currentIndex ? 2 : 1 }}
            >
              {index === currentIndex ? (
                // Carte active avec flip animé
                <motion.div
                  className={styles['flip-card']}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <motion.div
                    className={styles['flip-card-inner']}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Face avant : logo et titre */}
                    <div className={styles['flip-card-front']}>
                      <img
                        src={mission.logo}
                        alt="Logo de l'entreprise"
                        className={styles['mission-logo']}
                      />
                      <div className={styles['mission-title']}>
                        {mission.titre}
                      </div>
                    </div>
                    {/* Face arrière : détails complets */}
                    <div className={styles['flip-card-back']}>
                      <Card className="p-4">
                        <Card.Body>
                          <Card.Title>{mission.titre}</Card.Title>
                          <Card.Text>{mission.description}</Card.Text>
                          <Card.Text>
                            <strong>Domaine :</strong> {mission.domaine}
                          </Card.Text>
                          <Card.Text>
                            <strong>Budget :</strong> {mission.budget}€
                          </Card.Text>
                          <Card.Text>
                            <strong>Deadline :</strong> {mission.deadline}
                          </Card.Text>
                          <Card.Text>
                            <strong>Expérience requise :</strong> {mission.requiredExperience} ans
                          </Card.Text>
                          <Card.Text>
                            <strong>Compétences requises :</strong> {renderCompetences(mission.competencesRequises)}
                          </Card.Text>
                          <Suspense fallback={<div>Chargement de la localisation...</div>}>
                            <ClickableMap
                              latitude={mission.latitude}
                              longitude={mission.longitude}
                            />
                          </Suspense>
                          <Button variant="primary" onClick={openModal} style={{ marginTop: '10px' }}>
                            Plus de détails
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                // Cartes inactives : affichage simplifié (face avant)
                <div className={styles['flip-card']}>
                  <div className={styles['flip-card-inner']}>
                    <div className={styles['flip-card-front']}>
                      <img
                        src={mission.logo}
                        alt="Logo de l'entreprise"
                        className={styles['mission-logo']}
                      />
                      <div className={styles['mission-title']}>
                        {mission.titre}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Indicateurs de progression (dots) */}
      <div className={styles['slider-indicators']}>
        {missions.map((_, index) => (
          <motion.div
            key={index}
            className={`${styles['indicator-dot']} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      {/* Boutons d'action sous le slider */}
      <div className={styles['mission-tinder-buttons']}>
        <Button
          variant="danger"
          onClick={handleReject}
          className={styles['action-button']}
        >
          ✖
        </Button>
        <Button
          variant="success"
          onClick={handleApply}
          className={styles['action-button']}
        >
          ✅
        </Button>
      </div>
      {/* Modal pour plus de détails en plein écran */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{missions[currentIndex]?.titre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{missions[currentIndex]?.description}</p>
          <p><strong>Domaine :</strong> {missions[currentIndex]?.domaine}</p>
          <p><strong>Budget :</strong> {missions[currentIndex]?.budget}€</p>
          <p><strong>Deadline :</strong> {missions[currentIndex]?.deadline}</p>
          <p><strong>Expérience requise :</strong> {missions[currentIndex]?.requiredExperience} ans</p>
          <p>
            <strong>Compétences requises :</strong> {renderCompetences(missions[currentIndex]?.competencesRequises)}
          </p>
          <Suspense fallback={<div>Chargement de la localisation...</div>}>
            <ClickableMap
              latitude={missions[currentIndex]?.latitude}
              longitude={missions[currentIndex]?.longitude}
            />
          </Suspense>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MissionStories;
