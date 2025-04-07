package com.example.demo.Service;

import com.github.jfasttext.JFastText;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FastTextService {

    private final JFastText jFastText;

    public FastTextService() {
        jFastText = new JFastText();
        // Assurez-vous que le chemin vers le modèle binaire est correct
        jFastText.loadModel("C:/Users/mrabe/OneDrive/Desktop/Projet PFE/cc.fr.300.bin/cc.fr.300.bin");
    }

    /**
     * Calcule la similarité cosinus entre deux textes en obtenant leurs vecteurs d'embedding.
     *
     * @param text1 premier texte
     * @param text2 deuxième texte
     * @return similarité cosinus (entre -1 et 1)
     */
    public double compareTextes(String text1, String text2) {
        float[] vec1 = convertListToArray(jFastText.getVector(text1));
        float[] vec2 = convertListToArray(jFastText.getVector(text2));
        return cosineSimilarity(vec1, vec2);
    }

    private float[] convertListToArray(List<Float> list) {
        float[] array = new float[list.size()];
        for (int i = 0; i < list.size(); i++) {
            array[i] = list.get(i);
        }
        return array;
    }

    private double cosineSimilarity(float[] vec1, float[] vec2) {
        double dot = 0.0;
        double normVec1 = 0.0;
        double normVec2 = 0.0;
        for (int i = 0; i < vec1.length; i++) {
            dot += vec1[i] * vec2[i];
            normVec1 += Math.pow(vec1[i], 2);
            normVec2 += Math.pow(vec2[i], 2);
        }
        return dot / (Math.sqrt(normVec1) * Math.sqrt(normVec2));
    }
}
