import { useState, useEffect } from 'react';
import styles from './Notification.module.css';
import notificationService from '../Services/NotificationService';
import VirtualAssistant from './VirtualAssistant';
import Header from './Header';
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications(userId);
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.readStatus);
      await Promise.all(unreadNotifications.map(n => notificationService.markAsRead(n.id)));
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className={styles.notificationContainer}>
      <VirtualAssistant />
      <Header />
      <div className={styles.header}>
        <h2>
          <i className="fa-solid fa-bell"></i>
          Notifications
        </h2>
        <button 
          className={styles.markAllButton}
          onClick={handleMarkAllAsRead}
        >
          <i className="fa-solid fa-check-double"></i>
          Tout marquer comme lu
        </button>
      </div>

      <div className={styles.notificationsList}>
        {notifications.slice(0, visibleCount).map(notification => (
          <div 
            key={notification.id} 
            className={`${styles.notificationCard} ${notification.readStatus ? styles.read : ''}`}
          >
            <div className={styles.notificationIcon}>
              <i className={`fa-solid ${notification.readStatus ? "fa-bell" : "fa-circle-exclamation"}`}></i>
            </div>
            
            <div className={styles.notificationContent}>
              <h3>{notification.message}</h3>
              <div className={styles.notificationMeta}>
                <span className={styles.date}>
                  <i className="fa-regular fa-clock"></i>
                  {formatDate(notification.createdAt)}
                </span>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className={styles.emptyState}>
            <i className="fa-regular fa-bell-slash"></i>
            <p>Aucune notification disponible</p>
          </div>
        )}
      </div>

      {notifications.length > visibleCount && (
        <div className={styles.loadMore}>
          <button onClick={() => setVisibleCount(prev => prev + 10)}>
            Voir plus de notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;