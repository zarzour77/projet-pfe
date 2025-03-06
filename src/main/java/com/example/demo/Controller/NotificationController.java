package com.example.demo.Controller;


import com.example.demo.Service.NotificationService;
import com.example.demo.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Endpoint pour récupérer toutes les notifications d'un utilisateur (lues et non lues)
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        // Vous pouvez améliorer ici en distinguant le type d'utilisateur pour choisir la méthode adéquate
        return notificationService.getNotificationsForUser(userId);
    }

    // Endpoint pour marquer une notification comme lue
    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId) {
        return notificationService.markAsRead(notificationId);
    }
    @DeleteMapping("/{notificationId}")
    public void deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
    }

}

