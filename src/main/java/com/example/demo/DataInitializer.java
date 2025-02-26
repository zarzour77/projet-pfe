/*
package com.example.demo;
import com.example.demo.model.Competence;
import com.example.demo.model.Domaine;
import com.example.demo.repository.CompetenceRepository;
import com.example.demo.repository.DomaineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DomaineRepository domaineRepository;
    private final CompetenceRepository competenceRepository;

    public DataInitializer(DomaineRepository domaineRepository, CompetenceRepository competenceRepository) {
        this.domaineRepository = domaineRepository;
        this.competenceRepository = competenceRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Tableau des domaines à ajouter
        String[] availableDomainsArray = {
                "Développement logiciel",
                "Développement Web",
                "Développement mobile",
                "Data Science",
                "Intelligence artificielle",
                "Cybersécurité",
                "Cloud Computing",
                "DevOps",
                "Administration de systèmes",
                "Administration de réseaux",
                "Consultance IT",
                "Business Intelligence",
                "Administration de bases de données",
                "Gestion de projets IT",
                "QA & Testing",
                "Design UX/UI",
                "Systèmes embarqués",
                "Internet des objets (IoT)",
                "Blockchain",
                "Réalité virtuelle / Réalité augmentée",
                "Développement de jeux vidéo",
                "Support informatique"
        };

        // Insertion des domaines dans la base (vérification pour éviter les doublons)
        for (String nom : availableDomainsArray) {
            if (domaineRepository.findByNom(nom) == null) {
                Domaine domaine = new Domaine(nom);
                domaineRepository.save(domaine);
            }
        }

        // Tableau des compétences à ajouter
        String[] availableCompetencesArray = {
                "JavaScript",
                "React",
                "Angular",
                "Vue.js",
                "Node.js",
                "Express.js",
                "TypeScript",
                "HTML5",
                "CSS3 / Sass / Less",
                "Python",
                "Django",
                "Flask",
                "Java",
                "Spring Boot",
                "C#",
                ".NET",
                "Ruby on Rails",
                "PHP",
                "Laravel",
                "SQL",
                "NoSQL",
                "MongoDB",
                "PostgreSQL",
                "MySQL",
                "Git",
                "Docker",
                "Kubernetes",
                "AWS",
                "Azure",
                "Google Cloud Platform",
                "GraphQL",
                "RESTful APIs",
                "Agile / Scrum",
                "Jira",
                "UI/UX Design",
                "Figma",
                "Adobe XD",
                "Penetration Testing",
                "Machine Learning",
                "TensorFlow",
                "PyTorch",
                "Data Analysis",
                "Data Visualization",
                "R",
                "Big Data (Hadoop, Spark)"
        };

        // Insertion des compétences (en utilisant 0 pour competenceNiveaux par défaut)
        for (String nom : availableCompetencesArray) {
            if (competenceRepository.findByNom(nom) == null) {
                Competence competence = new Competence(nom, 0);
                competenceRepository.save(competence);
            }
        }

        System.out.println("✅ Données initiales insérées avec succès !");
    }
}
*/