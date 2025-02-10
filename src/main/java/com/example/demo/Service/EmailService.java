package com.example.demo.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Autowired
    public EmailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }


    public void sendRenewalConfirmation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id: " + userId));
        String toEmail = user.getEmail();
        if (toEmail == null || toEmail.isEmpty()) {
            throw new IllegalArgumentException("L'email de l'utilisateur est invalide");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@votresite.com"); // Remplacez par votre adresse d'envoi
        message.setTo(toEmail);
        message.setSubject("Confirmation de renouvellement");
        message.setText("Cher " + user.getNom() + ",\n\nVotre abonnement a été renouvelé avec succès.");
        mailSender.send(message);
    }


    public void sendPaymentFailureNotification(Long userId, String errorMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id: " + userId));
        String toEmail = user.getEmail();
        if (toEmail == null || toEmail.isEmpty()) {
            throw new IllegalArgumentException("L'email de l'utilisateur est invalide");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@votresite.com"); // Remplacez par votre adresse d'envoi
        message.setTo(toEmail);
        message.setSubject("Échec de paiement");
        message.setText("Cher " + user.getNom() + ",\n\nNous avons rencontré un problème lors du renouvellement de votre abonnement : "
                + errorMessage);
        mailSender.send(message);
    }
}
