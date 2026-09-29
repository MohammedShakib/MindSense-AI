import json
import sys
from pathlib import Path

import joblib
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_DIR = PROJECT_ROOT / "Mental_Risk_Assessment" / "Step1_BML_Models"
MODEL_PATH = MODEL_DIR / "Best_Mental_Behaviour_Model.pkl"
ENCODER_PATH = MODEL_DIR / "Model_Encoders.pkl"


def load_assets():
    return joblib.load(MODEL_PATH), joblib.load(ENCODER_PATH)


def options():
    _, encoders = load_assets()
    return {
        "genders": encoders["le_gender"].classes_.tolist(),
        "occupations": encoders["le_occ"].classes_.tolist(),
        "bmi_categories": encoders["le_bmi"].classes_.tolist(),
        "risk_classes": encoders["le_target"].classes_.tolist(),
    }


def predict(payload: dict):
    model, encoders = load_assets()
    features = np.array(
        [
            [
                encoders["le_gender"].transform([payload["gender"]])[0],
                payload["age"],
                encoders["le_occ"].transform([payload["occupation"]])[0],
                encoders["le_bmi"].transform([payload["bmi_category"]])[0],
                payload["sleep_duration"],
                payload["sleep_quality"],
                payload["physical_activity"],
                payload["stress_level"],
                payload["heart_rate"],
                payload["daily_steps"],
                payload["systolic_bp"],
                payload["diastolic_bp"],
            ]
        ]
    )
    predicted_index = model.predict(features)[0]
    label = encoders["le_target"].inverse_transform([predicted_index])[0]
    probabilities = model.predict_proba(features)[0]
    classes = encoders["le_target"].classes_

    return {
        "label": str(label),
        "confidence": round(float(np.max(probabilities)) * 100, 2),
        "probabilities": {
            str(class_name): round(float(probability) * 100, 2)
            for class_name, probability in zip(classes, probabilities)
        },
    }


if __name__ == "__main__":
    with open(sys.argv[1], encoding="utf-8") as handle:
        request = json.load(handle)

    if request["action"] == "options":
        result = options()
    else:
        result = predict(request["payload"])

    print(json.dumps(result))
