package com.example.Trade_For_Talent.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Entreprise extends User {
    @OneToMany(mappedBy = "entreprise")
    private List<Mission> missions;

    public Entreprise(List<Mission> missions) {
        this.missions = missions;
    }

    public Entreprise(Long id, String prenom, String nom, String telephone, String email, String password, String role, List<Notification> notifications, List<Competence> competences, List<Avis> avisRediges, List<Avis> avisRecus, List<Mission> missions) {
        super(id, prenom, nom, telephone, email, password, role, notifications, competences, avisRediges, avisRecus);
        this.missions = missions;
    }

    public Entreprise() {}

    public List<Mission> getMissions() {
        return missions;
    }

    public void setMissions(List<Mission> missions) {
        this.missions = missions;
    }
}
