package com.example.demo.model;


import jakarta.persistence.*;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long consultantId;
    private Long missionId;
    private int matchStatus;

    // Getters et Setters

    public Match(Long consultantId, Long id, int matchStatus, Long missionId) {
        this.consultantId = consultantId;
        this.id = id;
        this.matchStatus = matchStatus;
        this.missionId = missionId;
    }

    public Match() {

    }

    public Long getConsultantId() {
        return consultantId;
    }

    public void setConsultantId(Long consultantId) {
        this.consultantId = consultantId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(int matchStatus) {
        this.matchStatus = matchStatus;
    }

    public Long getMissionId() {
        return missionId;
    }

    public void setMissionId(Long missionId) {
        this.missionId = missionId;
    }
}
