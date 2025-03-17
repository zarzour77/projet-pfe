package com.example.demo.Service;

import com.example.demo.model.Competence;
import com.example.demo.model.Consultant;
import com.example.demo.model.Domaine;
import com.example.demo.model.Mission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private FastTextService fastTextService;

    public double computeGlobalMatchScore(Consultant consultant, Mission mission) {
        // Agrégation des compétences sous forme de chaînes de caractères
        String consultantSkills = consultant.getCompetences().stream()
                .map(Competence::getNom)
                .collect(Collectors.joining(" "));
        String missionSkills = mission.getCompetencesRequises().stream()
                .map(Competence::getNom)
                .collect(Collectors.joining(" "));

        // Agrégation des domaines sous forme de chaînes
        String consultantDomains = consultant.getDomaines().stream()
                .map(Domaine::getNom)
                .collect(Collectors.joining(" "));
        String missionDomains = mission.getDomaines().stream()
                .map(Domaine::getNom)
                .collect(Collectors.joining(" "));

        // Calcul de la similarité à l'aide de FastText (méthode à implémenter dans FastTextService)
        double skillsSimilarity = fastTextService.compareTextes(consultantSkills, missionSkills);
        double domainsSimilarity = fastTextService.compareTextes(consultantDomains, missionDomains);

        // Combinaison des scores avec un poids de 70% pour les compétences et 30% pour les domaines
        return 0.7 * skillsSimilarity + 0.3 * domainsSimilarity;
    }
}
