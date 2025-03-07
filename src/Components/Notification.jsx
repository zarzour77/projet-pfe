import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';
import notificationService from '../services/notificationService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // pour la pagination

  // Extraction de l'objet user depuis le localStorage et récupération de l'id
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications(userId);
      // Tri par date décroissante
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.readStatus);
      await Promise.all(unreadNotifications.map(n => notificationService.markAsRead(n.id)));
      fetchNotifications();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications", error);
    }
  };

  // Supprimer une notification
  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Application de la pagination sur la liste triée
  const visibleNotifications = notifications.slice(0, visibleCount);
  const recentNotifications = visibleNotifications.filter(notif => isToday(new Date(notif.createdAt)));
  const earlierNotifications = visibleNotifications.filter(notif => !isToday(new Date(notif.createdAt)));

  return (
    <div className={`container-fluid ${styles.notificationContainer}`}>
      <h2 className="my-4 text-center">
        <i className="fa-solid fa-bell me-2"></i>Mes notifications
      </h2>
      
      {/* Bouton global "Tout marquer comme lu" */}
      {notifications.some(n => !n.readStatus) && (
        <div className="text-end mb-3">
          <button className="btn btn-success" onClick={handleMarkAllAsRead}>
            <i className="fa-solid fa-check-double me-1"></i> Tout marquer comme lu
          </button>
        </div>
      )}
      
      {/* Section des notifications récentes */}
      <div className="mb-5">
        <h4 className="mb-3">Notifications récentes</h4>
        {recentNotifications.length === 0 ? (
          <div className="card mb-3">
            <div className="card-body text-center">
              <p className="lead m-0">Aucune notification récente.</p>
            </div>
          </div>
        ) : (
          recentNotifications.map(notification => (
            <div key={notification.id} className="col-12">
              <div className={`card mb-3 ${notification.readStatus ? styles.read : styles.unread}`}>
                <div className="card-body d-flex align-items-center">
                  <div className="me-3">
                    <i className="fa-solid fa-message fa-2x text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="card-title mb-1">{notification.message}</h5>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="fa-regular fa-clock me-1"></i>
                        {formatDate(notification.createdAt)}
                      </small>
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Séparateur visuel entre les sections */}
      <hr className={styles.separator} />

      {/* Section des notifications plus anciennes */}
      <div>
        <h4 className="mb-3">Plus anciennes</h4>
        {earlierNotifications.length === 0 ? (
          <div className="card mb-3">
            <div className="card-body text-center">
              <p className="lead m-0">Aucune notification antérieure.</p>
            </div>
          </div>
        ) : (
          earlierNotifications.map(notification => (
            <div key={notification.id} className="col-12">
              <div className={`card mb-3 ${notification.readStatus ? styles.read : styles.unread}`}>
                <div className="card-body d-flex align-items-center">
                  <div className="me-3">
                    <i className="fa-solid fa-message fa-2x text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="card-title mb-1">{notification.message}</h5>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="fa-regular fa-clock me-1"></i>
                        {formatDate(notification.createdAt)}
                      </small>
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bouton "Voir plus" pour charger plus de notifications */}
      {notifications.length > visibleCount && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => setVisibleCount(visibleCount + 5)}>
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
