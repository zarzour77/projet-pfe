package com.example.demo.Service;

import com.example.demo.model.Entreprise;
import com.example.demo.model.Consultant;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }


    // Notification pour une entreprise
    public Notification createNotification(String message, Entreprise entreprise) {
        Notification notification = new Notification(message, entreprise);
        System.out.println("Notification créée pour l'entreprise ID: " + entreprise.getId() + " avec le message: " + message);
        return notificationRepository.save(notification);
    }

    // Nouvelle méthode pour créer une notification pour un consultant
    public Notification createNotificationConsultant(String message, Consultant consultant) {
        Notification notification = new Notification(message, consultant);
        System.out.println("Notification créée pour le consultant ID: " + consultant.getId() + " avec le message: " + message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotificationsForEntreprise(Entreprise entreprise) {
        List<Notification> notifications = notificationRepository.findByUserAndReadStatusFalse(entreprise);
        System.out.println("Nombre de notifications non lues pour l'entreprise " + entreprise.getId() + " : " + notifications.size());
        return notifications;
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }
    public List<Notification> getNotificationsForUser(Long userId) {
        // Assurez-vous que NotificationRepository possède la méthode findByUserId(Long userId)
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        System.out.println("Nombre de notifications pour l'utilisateur " + userId + " : " + notifications.size());
        return notifications;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

}
