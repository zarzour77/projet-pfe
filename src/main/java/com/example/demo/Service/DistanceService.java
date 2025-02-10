package com.example.demo.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;

@Service
public class DistanceService {

    @Value("${ors.api.key}") // Clé API depuis application.properties
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public double getDistance(double lat1, double lon1, double lat2, double lon2) {
        String url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + apiKey +
                "&start=" + lon1 + "," + lat1 + "&end=" + lon2 + "," + lat2;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String json = response.getBody();
            return extractDistance(json);
        }
        return -1;
    }

    private double extractDistance(String json) {
        try {
            System.out.println("Réponse API : " + json);  // Log de la réponse brute
            org.json.JSONObject jsonObject = new org.json.JSONObject(json);
            org.json.JSONArray features = jsonObject.getJSONArray("features");
            if (features.length() == 0) {
                System.out.println("Aucun feature trouvé dans la réponse API.");
                return -1;
            }
            org.json.JSONObject firstFeature = features.getJSONObject(0);
            org.json.JSONObject properties = firstFeature.getJSONObject("properties");
            // Vérifier si la propriété "summary" existe et contient la clé "distance"
            if (!properties.has("summary") || properties.getJSONObject("summary").length() == 0) {
                System.out.println("La réponse API ne contient pas de summary avec distance.");
                return 0; // ou -1 selon votre logique (ici on considère 0 km si aucune distance n'est trouvée)
            }
            org.json.JSONObject summary = properties.getJSONObject("summary");
            if (!summary.has("distance")) {
                System.out.println("La réponse API ne contient pas la clé distance dans summary.");
                return 0;
            }
            double distanceMeters = summary.getDouble("distance");
            return distanceMeters / 1000; // Conversion en km
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }


}
