package com.example.demo.model;

import com.example.demo.Payment.PaymentTransaction;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String password;
    private String role;
    @JsonIgnore
    @Lob
    private String photoprofile;
    @JsonIgnore

    private String statut;

    private LocalDateTime lastConnection;
    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Notification> notifications;

    @JsonIgnore
    private Double rating;
    @JsonIgnore

    private boolean emailVerified = false; // par défaut à false

    // Champ pour stocker le code de vérification (vous pouvez également l'expirer avec une date si besoin)
    @JsonIgnore
    private String verificationCode;

    @JsonIgnore
    @OneToMany(mappedBy = "entrepriseSender", fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactionsAsEntrepriseSender = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "consultantSender", fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactionsAsConsultantSender = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "consultantReceiver", fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactionsAsConsultantReceiver = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "adminSender", fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactionsAsAdminSender = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "adminReceiver", fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactionsAsAdminReceiver = new ArrayList<>();
    // --- End PaymentTransaction Associations ---
    @Column(name = "token_version", columnDefinition = "integer DEFAULT 0")
    private Integer tokenVersion = 0;
    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    public User() {}

    public User(String nom) {
        this.nom = nom;
    }

    public User(String adresse, List<Competence> competences, String email, Long id, String nom, List<Notification> notifications, String password, String prenom, String telephone , String role,String photoprofile,String statut) {
        this.adresse = adresse;
        this.email = email;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.prenom = prenom;
        this.telephone = telephone;
        this.role = role;
        this.photoprofile = photoprofile;
        this.statut = statut;
    }

    public User( String adresse, String email, Long id, String nom, List<Notification> notifications, String password, String telephone,String photoprofile) {
        this.adresse = adresse;
        this.email = email;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.telephone = telephone;
        this.photoprofile = photoprofile;
    }

    public User(String nom, String prenom, String telephone, String email, String encodedPassword, String role) {
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.password = encodedPassword;
        this.role = role;
    }
    public User(String nom, String prenom, String email, String encodedPassword) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = encodedPassword;
    }

    public User(String adresse, String email, boolean emailVerified, Long id, String nom, List<Notification> notifications, String password, String photoprofile, String prenom, Double rating, String role, String statut, String telephone, String verificationCode) {
        this.adresse = adresse;
        this.email = email;
        this.emailVerified = emailVerified;
        this.id = id;
        this.nom = nom;
        this.notifications = notifications;
        this.password = password;
        this.photoprofile = photoprofile;
        this.prenom = prenom;
        this.rating = rating;
        this.role = role;
        this.statut = statut;
        this.telephone = telephone;
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getLastConnection() {
        return lastConnection;
    }

    public void setLastConnection(LocalDateTime lastConnection) {
        this.lastConnection = lastConnection;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }
    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    public String getVerificationCode() {
        return verificationCode;
    }
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Double getRating() {
        return rating;
    }
    public void setRating(Double rating) {
        this.rating = rating;
    }
    public String getStatut() {
        return statut;
    }
    public void setStatut(String statut) {
        this.statut = statut;
    }
    public String getPhotoprofile() {
        return photoprofile;
    }
    public void setPhotoprofile(String photoprofile) {
        this.photoprofile = photoprofile;
    }
    public String getAdresse() {
        return adresse;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public List<Notification> getNotifications() {
        return notifications;
    }
    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public List<PaymentTransaction> getTransactionsAsEntrepriseSender() {
        return transactionsAsEntrepriseSender;
    }
    public void setTransactionsAsEntrepriseSender(List<PaymentTransaction> transactionsAsEntrepriseSender) {
        this.transactionsAsEntrepriseSender = transactionsAsEntrepriseSender;
    }

    public List<PaymentTransaction> getTransactionsAsConsultantSender() {
        return transactionsAsConsultantSender;
    }
    public void setTransactionsAsConsultantSender(List<PaymentTransaction> transactionsAsConsultantSender) {
        this.transactionsAsConsultantSender = transactionsAsConsultantSender;
    }

    public List<PaymentTransaction> getTransactionsAsConsultantReceiver() {
        return transactionsAsConsultantReceiver;
    }
    public void setTransactionsAsConsultantReceiver(List<PaymentTransaction> transactionsAsConsultantReceiver) {
        this.transactionsAsConsultantReceiver = transactionsAsConsultantReceiver;
    }

    public List<PaymentTransaction> getTransactionsAsAdminSender() {
        return transactionsAsAdminSender;
    }
    public void setTransactionsAsAdminSender(List<PaymentTransaction> transactionsAsAdminSender) {
        this.transactionsAsAdminSender = transactionsAsAdminSender;
    }

    public List<PaymentTransaction> getTransactionsAsAdminReceiver() {
        return transactionsAsAdminReceiver;
    }
    public void setTransactionsAsAdminReceiver(List<PaymentTransaction> transactionsAsAdminReceiver) {
        this.transactionsAsAdminReceiver = transactionsAsAdminReceiver;
    }
    public Integer getTokenVersion() { return tokenVersion; }
    public void setTokenVersion(Integer tokenVersion) { this.tokenVersion = tokenVersion; }
    // Utilisation de @JsonGetter pour retourner l'image avec le préfixe approprié dans la réponse JSON
    @JsonGetter("photoprofile")
    public String getPhotoprofileUrl() {
        if (photoprofile == null || photoprofile.isEmpty()) {
            return null;
        }
        String prefix = "data:image/png;base64,";
        // Si la chaîne stockée commence déjà par le préfixe, on la retourne telle quelle.
        if (photoprofile.startsWith(prefix)) {
            return photoprofile;
        }
        // Sinon, on vérifie si le préfixe apparaît déjà dans la chaîne (pour éviter un doublon)
        if (photoprofile.contains(prefix)) {
            // On retire toute occurrence du préfixe afin de ne l'ajouter qu'une fois
            String rawData = photoprofile.replace(prefix, "");
            return prefix + rawData;
        }
        // Si le préfixe n'est pas présent, on l'ajoute
        return prefix + photoprofile;
    }
    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }

    private List<PaymentTransaction> getReceivedTransactions() {
        // This will be populated by the service layer
        return new ArrayList<>();
    }


}