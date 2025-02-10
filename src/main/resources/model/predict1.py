import sys
import logging
import base64
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')

def convert_json_to_pickle(json_path, pickle_path):
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            json_data = json.load(f)
        with open(pickle_path, "wb") as f:
            pickle.dump(json_data, f)
        logging.info("✅ Conversion JSON → Pickle réussie.")
    except Exception as e:
        logging.error("❌ Erreur lors de la conversion JSON → Pickle : %s", e)
        raise

def ensure_pickle_format(model_path):
    try:
        with open(model_path, "rb") as f:
            first_bytes = f.read(2)
        if first_bytes.startswith(b'{') or first_bytes.startswith(b'['):
            logging.warning("⚠️ Le fichier semble être au format JSON. Conversion en Pickle...")
            json_path = model_path
            pickle_path = model_path.replace(".pkl", "_converted.pkl")
            convert_json_to_pickle(json_path, pickle_path)
            return pickle_path
        else:
            return model_path
    except Exception as e:
        logging.error("❌ Erreur lors de la vérification du format : %s", e)
        raise

def main():
    logging.info("🚀 Début du script de prédiction")

    try:
        encoded_consultant = sys.argv[1]
        consultant_json = base64.b64decode(encoded_consultant).decode('utf-8')
        consultant = json.loads(consultant_json)
        logging.info("✅ Consultant JSON analysé avec succès")
    except Exception as e:
        logging.error("❌ Erreur de décodage/analyse du JSON consultant: %s", e)
        sys.exit(1)

    try:
        model_path = r"C:\Users\zinig\Desktop\projetpfe\demo\src\main\resources\model\optimized_model_final777.pkl"
        model_path = ensure_pickle_format(model_path)
        with open(model_path, "rb") as f:
            model_artifacts = pickle.load(f)
        model = model_artifacts['model']
        expected_features = model.feature_names_in_  # ✅ Ajout de la vérification des features
        logging.info("✅ Modèle chargé avec succès")
    except Exception as e:
        logging.error("❌ Erreur lors du chargement du modèle: %s", e)
        sys.exit(1)

    try:
        missions_path = r"C:\Users\zinig\Desktop\projetpfe\demo\src\main\resources\model\generated_data_it_final7.json"
        with open(missions_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        missions = data["missions"]
        df_missions = pd.DataFrame(missions)

        def normalize_skill_name(name):
            return name.strip().lower().replace(' ', '_')

        def extract_skills_mission(competences):
            return {f"skill_{normalize_skill_name(skill['nom'])}": skill.get('niveau_min', 0) for skill in competences}

        def extract_skills_consultant(competences):
            return {f"skill_{normalize_skill_name(skill['nom'])}": skill.get('niveau', 0) for skill in competences}

        missions_expanded = df_missions["competencesRequises"].apply(extract_skills_mission).apply(pd.Series)
        df_missions = pd.concat([df_missions.drop(columns=["competencesRequises"]), missions_expanded], axis=1).fillna(0)
        logging.info("✅ Données des missions traitées avec succès")
    except Exception as e:
        logging.error("❌ Erreur de chargement/traitement des missions: %s", e)
        sys.exit(1)

    try:
        df_consultant = pd.DataFrame([consultant])
        consultant_expanded = df_consultant["competences"].apply(extract_skills_consultant).apply(pd.Series)
        df_consultant = df_consultant.rename(columns={'budgetMin': 'budget_min'})
        df_consultant = pd.concat([df_consultant.drop(columns=["competences"]), consultant_expanded], axis=1).fillna(0)
        logging.info("✅ Données du consultant traitées avec succès")
    except Exception as e:
        logging.error("❌ Erreur de traitement des données du consultant: %s", e)
        sys.exit(1)

    try:
        cols_to_drop = ["id_consultant", "id_mission", "nom", "prenom", "email", "titre", "description", "entreprise", "telephone", "password", "photoprofile", "portfolio", "role"]
        df_consultant.drop(columns=[col for col in cols_to_drop if col in df_consultant.columns], inplace=True)
        df_missions.drop(columns=[col for col in cols_to_drop if col in df_missions.columns], inplace=True)

        df_consultant["key"] = 1
        df_missions["key"] = 1
        df_pred = pd.merge(df_consultant, df_missions, on="key", suffixes=('_consultant', '_mission')).drop("key", axis=1)

        df_pred = df_pred.select_dtypes(include=[np.number])  # Garde uniquement les colonnes numériques
        df_pred.fillna(0, inplace=True)
        logging.info("✅ Fusion des données et nettoyage réussi")
    except Exception as e:
        logging.error("❌ Erreur lors de la fusion et du nettoyage des données: %s", e)
        sys.exit(1)

    try:
        # 📌 Vérification des noms de colonnes avant la prédiction
        logging.info(f"✅ Features disponibles: {df_pred.columns.tolist()}")
        logging.info(f"✅ Features attendues par le modèle: {expected_features.tolist()}")

        # 📌 S'assurer que les colonnes correspondent aux attentes du modèle
        missing_cols = [col for col in expected_features if col not in df_pred.columns]
        extra_cols = [col for col in df_pred.columns if col not in expected_features]

        if missing_cols:
            logging.warning(f"⚠️ Colonnes manquantes: {missing_cols}")
        if extra_cols:
            logging.warning(f"⚠️ Colonnes en trop: {extra_cols}")

        # 📌 Adapter les colonnes pour correspondre aux attentes du modèle
        for col in missing_cols:
            df_pred[col] = 0  # Ajoute les colonnes manquantes avec une valeur par défaut

        df_pred = df_pred[expected_features]  # Trie selon les colonnes attendues par le modèle

        predictions = model.predict(df_pred)
        df_pred["matchStatus"] = predictions
        matching_missions = df_pred[df_pred["matchStatus"] == 1]
        results = matching_missions[["mission_id"]].to_dict(orient="records")

        logging.info("✅ Prédictions terminées avec succès")
        print(json.dumps(results, indent=2))
    except Exception as e:
        logging.error("❌ Erreur lors de la prédiction: %s", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
