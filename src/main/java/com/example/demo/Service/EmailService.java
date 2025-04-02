package com.example.demo.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Vérification de votre adresse email");
        message.setText("Votre code de vérification est : " + code);
        mailSender.send(message);
    }

    // Méthode pour envoyer un email de candidature avec le même design (card) que l'email d'invitation
    public void sendApplicationEmail(String to, String subject, String content, byte[] attachmentBytes, String attachmentFilename) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // "true" pour activer le multipart (nécessaire pour les pièces jointes)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);

            // Titre à afficher dans le header pour l'email de candidature
            String headerTitle = "Nouvelle candidature";

            // Construction du template HTML identique pour les deux types d'email
            String htmlContent =
                    "<!DOCTYPE html>" +
                            "<html lang='fr'>" +
                            "<head>" +
                            "  <meta charset='UTF-8'/>" +
                            "  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'/>" +
                            "  <style>" +
                            "    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }" +
                            "    .email-container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; }" +
                            "    .header { text-align: center; margin-bottom: 20px; }" +
                            "    .logo { max-height: 50px; }" +
                            "    .content { font-size: 14px; color: #333; line-height: 1.6; }" +
                            "    .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }" +
                            "    .btn { display: inline-block; background-color: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; }" +
                            "  </style>" +
                            "</head>" +
                            "<body>" +
                            "  <div class='email-container'>" +
                            "    <div class='header'>" +
                            "      <img src='cid:logoImage' alt='Logo' class='logo'/>" +
                            "      <h2 style='margin-top: 10px; color: #333;'>" + headerTitle + "</h2>" +
                            "    </div>" +
                            "    <div class='content'>" +
                            "      <p>Bonjour,</p>" +
                            "      <p>" + content + "</p>" +
                            "      <p style='margin-top: 20px;'>Cordialement,<br/>" +
                            "         <strong>Trade for Talent</strong></p>" +
                            "    </div>" +
                            "    <div class='footer'>" +
                            "      <hr style='border: none; border-top: 1px solid #eee;'/>" +
                            "      <p>&copy; 2025 Trade for Talent</p>" +
                            "    </div>" +
                            "  </div>" +
                            "</body>" +
                            "</html>";

            helper.setText(htmlContent, true);

            // Ajout du logo en inline (assurez-vous que le fichier existe dans src/main/resources/static/img.png)
            ClassPathResource logo = new ClassPathResource("static/img.png");
            helper.addInline("logoImage", logo);

            // Ajout de la pièce jointe si elle existe
            if (attachmentBytes != null && attachmentBytes.length > 0) {
                helper.addAttachment(attachmentFilename, new ByteArrayResource(attachmentBytes));
            }
            mailSender.send(message);
            System.out.println("Email d'application envoyé à " + to);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email d'application: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Méthode pour envoyer un email d'invitation avec le même design (card) que l'email de candidature
    public void sendInvitationEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // "true" pour activer le multipart (pour le logo inline)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);

            // Titre à afficher dans le header pour l'email d'invitation
            String headerTitle = "Invitation pour la mission";

            // Construction du même template HTML
            String htmlContent =
                    "<!DOCTYPE html>" +
                            "<html lang='fr'>" +
                            "<head>" +
                            "  <meta charset='UTF-8'/>" +
                            "  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'/>" +
                            "  <style>" +
                            "    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }" +
                            "    .email-container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; }" +
                            "    .header { text-align: center; margin-bottom: 20px; }" +
                            "    .logo { max-height: 50px; }" +
                            "    .content { font-size: 14px; color: #333; line-height: 1.6; }" +
                            "    .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }" +
                            "    .btn { display: inline-block; background-color: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; }" +
                            "  </style>" +
                            "</head>" +
                            "<body>" +
                            "  <div class='email-container'>" +
                            "    <div class='header'>" +
                            "      <img src='cid:logoImage' alt='Logo' class='logo'/>" +
                            "      <h2 style='margin-top: 10px; color: #333;'>" + headerTitle + "</h2>" +
                            "    </div>" +
                            "    <div class='content'>" +
                            "      <p>Bonjour,</p>" +
                            "      <p>" + content + "</p>" +
                            "      <p style='margin-top: 20px;'>Cordialement,<br/>" +
                            "         <strong>Trade for Talent</strong></p>" +
                            "    </div>" +
                            "    <div class='footer'>" +
                            "      <hr style='border: none; border-top: 1px solid #eee;'/>" +
                            "      <p>&copy; 2025 Trade for Talent</p>" +
                            "    </div>" +
                            "  </div>" +
                            "</body>" +
                            "</html>";

            helper.setText(htmlContent, true);

            // Ajout du logo inline
            ClassPathResource logo = new ClassPathResource("static/img.png");
            helper.addInline("logoImage", logo);

            mailSender.send(message);
            System.out.println("Email d'invitation HTML envoyé à " + to);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email d'invitation: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
