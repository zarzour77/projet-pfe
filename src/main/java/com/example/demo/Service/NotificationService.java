package com.example.demo.Service;

import com.example.demo.model.Entreprise;
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

    public Notification createNotification(String message, Entreprise entreprise) {
        // Crée la notification en associant l'entreprise (qui étend User)
        Notification notification = new Notification(message, entreprise);
        System.out.println("Notification créée pour l'entreprise ID: " + entreprise.getId() + " avec le message: " + message);
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
}
