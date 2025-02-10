package com.example.demo.exception;

public class MissionNotFoundException extends RuntimeException {
    public MissionNotFoundException(Long missionId) {
        super("Mission non trouvée avec l'ID : " + missionId);
    }}
