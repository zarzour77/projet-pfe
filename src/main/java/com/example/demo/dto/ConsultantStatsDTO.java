package com.example.demo.dto;

public class ConsultantStatsDTO {
    private Long id;  // Ajout du champ id
    private String consultantName;
    private long missionCount;
    private Long revenue;
    private Double jobSuccess;
    private String photo;

    public ConsultantStatsDTO(Long id, String consultantName, long missionCount, Long revenue, Double jobSuccess, String photo) {
        this.id = id;
        this.consultantName = consultantName;
        this.missionCount = missionCount;
        this.revenue = revenue;
        this.jobSuccess = jobSuccess;
        this.photo = photo;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getConsultantName() {
        return consultantName;
    }
    public void setConsultantName(String consultantName) {
        this.consultantName = consultantName;
    }

    public long getMissionCount() {
        return missionCount;
    }
    public void setMissionCount(long missionCount) {
        this.missionCount = missionCount;
    }

    public Long getRevenue() {
        return revenue;
    }
    public void setRevenue(Long revenue) {
        this.revenue = revenue;
    }

    public Double getJobSuccess() {
        return jobSuccess;
    }
    public void setJobSuccess(Double jobSuccess) {
        this.jobSuccess = jobSuccess;
    }

    public String getPhoto() {
        return photo;
    }
    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
