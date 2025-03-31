package com.example.demo.Service;
import com.example.demo.model.ProfileView;
import com.example.demo.repository.ProfileViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProfileViewService {

    @Autowired
    private ProfileViewRepository profileViewRepository;

    // Nouvelle méthode pour récupérer les vues de profil pour une entreprise
    public Map<String, Object> getEntrepriseProfileViews(Long entrepriseId, int periodDays) {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate endDate = LocalDate.now(zone);
        LocalDate startDate = endDate.minusDays(periodDays - 1);

        List<ProfileView> views = profileViewRepository.findByEntrepriseId(entrepriseId);

        List<ProfileView> filtered = views.stream()
                .filter(v -> {
                    LocalDate viewDate = v.getDateView().toInstant().atZone(zone).toLocalDate();
                    return !viewDate.isBefore(startDate) && !viewDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        List<String> labels = Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(periodDays)
                .map(date -> date.format(DateTimeFormatter.ofPattern("dd MMM")))
                .collect(Collectors.toList());

        List<Long> data = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalDate finalDate = date;
            long count = filtered.stream()
                    .filter(v -> {
                        LocalDate viewDate = v.getDateView().toInstant().atZone(zone).toLocalDate();
                        return viewDate.equals(finalDate);
                    })
                    .count();
            data.add(count);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("data", data);
        return response;
    }


    public Map<String, Object> getConsultantProfileViews(Long consultantId, int periodDays) {
        // Utilisation du fuseau horaire local pour conserver l'heure d'affichage attendue
        ZoneId zone = ZoneId.systemDefault();
        LocalDate endDate = LocalDate.now(zone);
        LocalDate startDate = endDate.minusDays(periodDays - 1);

        // Récupérer toutes les vues du consultant
        List<ProfileView> views = profileViewRepository.findByConsultantId(consultantId);

        // Filtrer les vues dans la période demandée
        List<ProfileView> filtered = views.stream()
                .filter(v -> {
                    LocalDate viewDate = v.getDateView().toInstant().atZone(zone).toLocalDate();
                    return !viewDate.isBefore(startDate) && !viewDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        // Générer les labels (ex: "03 Mar", "04 Mar", etc.)
        List<String> labels = Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(periodDays)
                .map(date -> date.format(DateTimeFormatter.ofPattern("dd MMM")))
                .collect(Collectors.toList());

        // Compter les vues par date
        List<Long> data = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalDate finalDate = date;
            long count = filtered.stream()
                    .filter(v -> {
                        LocalDate viewDate = v.getDateView().toInstant().atZone(zone).toLocalDate();
                        return viewDate.equals(finalDate);
                    })
                    .count();
            data.add(count);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("data", data);
        return response;
    }


}
