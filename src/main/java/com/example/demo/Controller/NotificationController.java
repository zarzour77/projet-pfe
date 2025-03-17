package com.example.demo.Controller;


import com.example.demo.Service.MatchingService;
import com.example.demo.Service.NotificationService;
import com.example.demo.model.MatchRequest;
import com.example.demo.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private MatchingService matchingService;


    // Par exemple, un endpoint qui évalue la correspondance entre un consultant et une mission
    @PostMapping("/match")
    public String checkMatch(@RequestBody MatchRequest request) {
        double score = matchingService.computeGlobalMatchScore(request.getConsultant(), request.getMission());
        // Définissez un seuil, par exemple 0.8 (ou autre) pour envoyer une notification
        if (score > 0.8) {
            // Logique pour envoyer la notification au consultant
            return "Notification envoyée, score: " + score;
        } else {
            return "Pas de correspondance suffisante, score: " + score;
        }
    }

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

