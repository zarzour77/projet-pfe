package com.example.demo.Service;

import com.example.demo.chat.Conversation;
import com.example.demo.model.Consultant;
import com.example.demo.model.Entreprise;
import com.example.demo.model.User;
import com.example.demo.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class UserService {
    private final UserRepository userRepository;
    private final AvisRepository avisRepository;
    private final ConsultantRepository consultantRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder; // Inject the PasswordEncoder
    private final NotificationRepository notificationRepository;
    private final ConversationRepository conversationRepository;
    private final PropositionRepository propositionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    @Autowired
    public UserService(UserRepository userRepository, AvisRepository avisRepository,
                       ConsultantRepository consultantRepository, EntrepriseRepository entrepriseRepository,
                       EntityManager entityManager, PasswordEncoder passwordEncoder, NotificationRepository notificationRepository, ConversationRepository conversationRepository, PropositionRepository propositionRepository, PaymentTransactionRepository paymentTransactionRepository) {
        this.userRepository = userRepository;
        this.avisRepository = avisRepository;
        this.consultantRepository = consultantRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.entityManager = entityManager;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
        this.conversationRepository = conversationRepository;
        this.propositionRepository = propositionRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }
    public Map<String, Long> getUserRoleStats() {
        Map<String, Long> stats = new HashMap<>();
        long entrepriseCount = userRepository.countByRole("Entreprise");
        long consultantCount = userRepository.countByRole("Consultant");
        long adminCount = userRepository.countByRole("Admin");
        stats.put("Entreprise", entrepriseCount);
        stats.put("Consultant", consultantCount);
        stats.put("Admin", adminCount);

        return stats;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            boolean emailChanged = false;
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
                emailChanged = true;
                user.setTokenVersion(user.getTokenVersion() + 1); // Invalidate existing tokens
            }
            if (updatedUser.getNom() != null) {
                user.setNom(updatedUser.getNom());
            }
            if (updatedUser.getPrenom() != null) {
                user.setPrenom(updatedUser.getPrenom());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getTelephone() != null) {
                user.setTelephone(updatedUser.getTelephone());
            }
            if (updatedUser.getAdresse() != null) {
                user.setAdresse(updatedUser.getAdresse());
            }
            if (updatedUser.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }



    @Transactional
    public void deleteUser(Long id) {
        Logger logger = LoggerFactory.getLogger(getClass());

        logger.info("Début de la suppression de l'utilisateur avec id : {}", id);

        // Récupérer l'utilisateur ou lever une exception s'il n'existe pas
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Utilisateur avec l'id {} non trouvé", id);
                    return new EntityNotFoundException("Utilisateur non trouvé");
                });
        logger.info("Utilisateur récupéré : {}", user);

        // 1. Supprimer les notifications associées
        if (user.getNotifications() != null && !user.getNotifications().isEmpty()) {
            logger.info("Suppression des notifications associées à l'utilisateur id {}: {} notifications",
                    id, user.getNotifications().size());
            notificationRepository.deleteAll(user.getNotifications());
            user.getNotifications().clear();
            logger.info("Notifications supprimées");
        } else {
            logger.info("Aucune notification à supprimer pour l'utilisateur id {}", id);
        }

        // 2. Traiter les conversations : retirer l'utilisateur de chaque conversation
        List<Conversation> conversations = conversationRepository.findByParticipants_Id(user.getId());
        logger.info("Nombre de conversations trouvées pour l'utilisateur id {}: {}", id, conversations.size());
        for (Conversation conversation : conversations) {
            if (conversation.getParticipants() != null && conversation.getParticipants().contains(user)) {
                logger.info("Retrait de l'utilisateur id {} de la conversation id {}", id, conversation.getId());
                conversation.getParticipants().remove(user);
                conversationRepository.save(conversation);
                logger.info("Mise à jour de la conversation id {} effectuée", conversation.getId());
            }
        }

        // 3. Si l'utilisateur est un Consultant, supprimer manuellement les enregistrements liés
        if ("Consultant".equals(user.getRole())) {
            Consultant consultant = consultantRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Consultant avec l'id {} non trouvé", id);
                        return new EntityNotFoundException("Consultant non trouvé");
                    });
            logger.info("L'utilisateur est un consultant. Traitement spécifique sur les associations.");

            // a. Vider les associations ManyToMany et OneToMany
            if (consultant.getCompetences() != null) {
                logger.info("Vidage des compétences (taille initiale : {})", consultant.getCompetences().size());
                consultant.getCompetences().clear();
            }
            if (consultant.getDomaines() != null) {
                logger.info("Vidage des domaines (taille initiale : {})", consultant.getDomaines().size());
                consultant.getDomaines().clear();
            }
            if (consultant.getLangues() != null) {
                logger.info("Vidage des langues (taille initiale : {})", consultant.getLangues().size());
                consultant.getLangues().clear();
            }
            if (consultant.getExperiences() != null) {
                logger.info("Vidage des expériences (taille initiale : {})", consultant.getExperiences().size());
                consultant.getExperiences().clear();
            }
            if (consultant.getFormations() != null) {
                logger.info("Vidage des formations (taille initiale : {})", consultant.getFormations().size());
                consultant.getFormations().clear();
            }
            if (consultant.getSavedMissions() != null) {
                logger.info("Vidage des missions sauvegardées (taille initiale : {})", consultant.getSavedMissions().size());
                consultant.getSavedMissions().clear();
            }
            if (consultant.getSubscriptions() != null) {
                logger.info("Vidage des subscriptions (taille initiale : {})", consultant.getSubscriptions().size());
                consultant.getSubscriptions().clear();
            }

            // b. Supprimer les propositions associées
            if (consultant.getPropositions() != null && !consultant.getPropositions().isEmpty()) {
                logger.info("Suppression de {} propositions associées au consultant id {}",
                        consultant.getPropositions().size(), consultant.getId());
                propositionRepository.deleteAll(consultant.getPropositions());
            } else {
                logger.info("Aucune proposition à supprimer pour le consultant id {}", consultant.getId());
            }

            // c. Supprimer les transactions liées au consultant
            logger.info("Suppression des transactions où le consultant est receiver ou sender");
            paymentTransactionRepository.deleteByConsultantReceiverId(consultant.getId());
            paymentTransactionRepository.deleteByConsultantSenderId(consultant.getId());

            // d. Supprimer les avis liés (en tant que cible et/ou auteur)
            logger.info("Suppression des avis liés au consultant id {} (en tant que cible et auteur)", consultant.getId());
            avisRepository.deleteByCibleId(consultant.getId());
            avisRepository.deleteByAuteurId(consultant.getId());

            // Sauvegarder pour mettre à jour les jointures et forcer le flush
            logger.info("Sauvegarde et flush du consultant avant suppression");
            consultantRepository.save(consultant);
            consultantRepository.flush();

            // Supprimer le Consultant via son repository
            logger.info("Suppression du consultant id {} via consultantRepository", consultant.getId());
            consultantRepository.deleteById(consultant.getId());
            consultantRepository.flush();
            logger.info("Consultant id {} supprimé avec succès", consultant.getId());
            return;
        }

        // 4. Pour les autres types d’utilisateurs, supprimer directement l'entité User
        logger.info("Suppression de l'utilisateur non consultant id {}", user.getId());
        userRepository.delete(user);
        logger.info("Utilisateur id {} supprimé avec succès", user.getId());
    }




    public String encodeImageToBase64(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        return Base64.getEncoder().encodeToString(fileBytes);
    }

    // Méthode pour uploader et mettre à jour la photo de profil d'un utilisateur
    public User updateProfilePicture(Long id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String base64Image = encodeImageToBase64(file);
        // On stocke la chaîne raw sans le préfixe
        user.setPhotoprofile(base64Image);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        User updatedUser = userRepository.save(user);

        if ("Consultant".equalsIgnoreCase(role)) {
            if (!consultantRepository.existsById(updatedUser.getId())) {
                entityManager.createNativeQuery("INSERT INTO consultant (id) VALUES (?)")
                        .setParameter(1, updatedUser.getId())
                        .executeUpdate();
            }
        } else if ("Entreprise".equalsIgnoreCase(role)) {
            if (!entrepriseRepository.existsById(updatedUser.getId())) {
                entityManager.createNativeQuery("INSERT INTO entreprise (id) VALUES (?)")
                        .setParameter(1, updatedUser.getId())
                        .executeUpdate();
            }
        }
        return updatedUser;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public List<User> searchUsers(String query) {
        return userRepository.findByNomContainingIgnoreCase(query);
    }
}
