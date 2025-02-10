import pickle
import pandas as pd
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# Charger le modèle et les label_encoders sauvegardés
model_path = r"C:\Users\zinig\Desktop\projetpfe\demo\src\main\resources\model\optimized_model_final777.pkl"
with open(model_path, "rb") as f:
    model_artifacts = pickle.load(f)
model = model_artifacts['model']
label_encoders = model_artifacts.get('label_encoders', {})

def safe_transform(le, value, default_value):
    """
    Tente de transformer 'value' en utilisant 'le'.
    Si la valeur n'est pas connue, renvoie default_value.
    """
    try:
        return le.transform([str(value)])[0]
    except ValueError:
        return default_value

def create_feature_vector(consultant: dict, mission: dict) -> pd.DataFrame:
    """
    Concatène les données du consultant et de la mission de façon similaire à l'entraînement.
    """
    # Convertir en DataFrame
    df_consultant = pd.DataFrame([consultant])
    df_mission = pd.DataFrame([mission])

    # Ajouter le suffixe pour les colonnes de mission
    df_mission = df_mission.add_suffix("_mission")

    # Fusionner les DataFrames
    df_merged = pd.concat([df_consultant, df_mission], axis=1)

    # Création d'une feature d'interaction pour les compétences (exemple)
    for col in df_merged.columns:
        if col.startswith('skill_') and not col.endswith('_mission'):
            mission_col = col + "_mission"
            if mission_col in df_merged.columns:
                df_merged["met_" + col] = int(df_merged[col].iloc[0] >= df_merged[mission_col].iloc[0])

    # Appliquer la transformation sur les colonnes catégorielles avec les label_encoders
    for col, le in label_encoders.items():
        if col in df_merged.columns:
            # Utiliser la première classe connue comme valeur par défaut
            default_val = le.transform([le.classes_[0]])[0]
            df_merged[col] = df_merged[col].astype(str).apply(lambda x: safe_transform(le, x, default_val))

    return df_merged

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    consultant = data.get("consultant")
    missions = data.get("missions")

    matching_missions = []
    for mission in missions:
        features = create_feature_vector(consultant, mission)
        prediction = model.predict(features)
        if prediction[0] == 1:
            matching_missions.append(mission)

    return jsonify(matching_missions)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
