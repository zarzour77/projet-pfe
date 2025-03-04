package com.example.demo.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
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
    public void sendApplicationEmail(String to, String subject, String content, byte[] attachmentBytes, String attachmentFilename) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            // "true" pour multipart (pièces jointes)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, false); // false => contenu en texte brut, true pour HTML

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
}
