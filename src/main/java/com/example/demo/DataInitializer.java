/*package com.example.demo;

import com.example.demo.model.Domaine;
import com.example.demo.repository.DomaineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DomaineRepository domaineRepository;

    public DataInitializer(DomaineRepository domaineRepository) {
        this.domaineRepository = domaineRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Définition des domaines par catégorie
        Map<String, List<String>> domainMapping = Map.of(
                "Design", List.of(
                        "Design graphique",
                        "Design UX/UI",
                        "Design d'interface",
                        "Branding et identité visuelle",
                        "Illustration digitale",
                        "Motion design",
                        "Design de packaging",
                        "Design d'expérience utilisateur",
                        "Design d'interaction",
                        "Design produit"
                ),
                "Development & IT", List.of(
                        "Développement web (Front-end)",
                        "Développement web (Back-end)",
                        "Développement mobile (iOS, Android)",
                        "Développement logiciel",
                        "Développement d'applications",
                        "Développement full-stack",
                        "Développement de jeux vidéo",
                        "Développement SaaS",
                        "Intelligence artificielle",
                        "Machine Learning",
                        "Data Science",
                        "DevOps",
                        "Cyber sécurité",
                        "Cloud Computing"
                ),
                "Proofreading", List.of(
                        "Relecture de textes",
                        "Correction orthographique",
                        "Correction grammaticale",
                        "Relecture académique",
                        "Relecture de manuscrits",
                        "Relecture technique",
                        "Relecture publicitaire"
                ),
                "Writing", List.of(
                        "Rédaction de contenu web",
                        "Rédaction technique",
                        "Copywriting / Rédaction publicitaire",
                        "Rédaction créative",
                        "Rédaction journalistique",
                        "Rédaction de scripts",
                        "Rédaction académique",
                        "Écriture de discours"
                ),
                "SEO", List.of(
                        "SEO on-page",
                        "SEO off-page",
                        "SEO technique",
                        "SEO local",
                        "SEO e-commerce",
                        "Analyse de mots-clés",
                        "Optimisation de contenu",
                        "Audit SEO"
                ),
                "Marketing", List.of(
                        "Marketing digital",
                        "Marketing de contenu",
                        "Marketing d'influence",
                        "Marketing sur les réseaux sociaux",
                        "Email marketing",
                        "Publicité en ligne",
                        "Stratégie marketing",
                        "Growth hacking",
                        "Marketing événementiel"
                )
        );

        // Parcours et insertion des domaines dans la base (éviter les doublons)
        domainMapping.forEach((category, domainList) -> {
            domainList.forEach(nom -> {
                if (domaineRepository.findByNom(nom) == null) {
                    // Création d'un domaine avec le nom et sa catégorie
                    Domaine domaine = new Domaine(nom, category);
                    domaineRepository.save(domaine);
                }
            });
        });

        System.out.println("✅ Données initiales insérées avec succès !");
    }
}
*/