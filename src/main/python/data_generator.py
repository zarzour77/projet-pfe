from faker import Faker
import random
import json
from datetime import datetime, timedelta

fake = Faker('fr_FR')  # Version française

# 1. Générer des compétences
competences = ["Java", "Spring Boot", "React", "Python", "SQL", "DevOps", "AWS"]

# 2. Générer des Consultants
def generate_consultant(id):
    return {
        "id": id,
        "nom": fake.last_name(),
        "prenom": fake.first_name(),
        "email": fake.email(),
        "adresse": fake.city(),
        "competences": random.sample(competences, random.randint(2, 4)),
        "experienceYears": random.randint(1, 10),
        "rating": round(random.uniform(3.5, 5.0), 1),
        "workload": random.randint(0, 3)
    }

# 3. Générer des Missions
def generate_mission(id):
    return {
        "id": id,
        "titre": fake.catch_phrase(),
        "description": fake.text(),
        "budget": random.choice([5000, 10000, 15000, 20000]),
        "competencesRequises": random.sample(competences, random.randint(1, 3)),
        "localisation": fake.city(),
        "deadline": (datetime.now() + timedelta(days=random.randint(10, 60))).strftime("%Y-%m-%d")
    }

if __name__ == "__main__":
    consultants = [generate_consultant(i) for i in range(1, 51)]
    missions = [generate_mission(i) for i in range(1, 21)]

    with open('generated_data.json', 'w', encoding='utf-8') as f:
        json.dump({
            "consultants": consultants,
            "missions": missions
        }, f, ensure_ascii=False, indent=2)