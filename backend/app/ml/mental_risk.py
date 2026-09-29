import json
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_DIR = PROJECT_ROOT / "Mental_Risk_Assessment" / "Step1_BML_Models"
MODEL_PATH = MODEL_DIR / "Best_Mental_Behaviour_Model.pkl"
ENCODER_PATH = MODEL_DIR / "Model_Encoders.pkl"
WORKER_PATH = Path(__file__).with_name("mental_worker.py")


@lru_cache(maxsize=1)
def load_mental_assets():
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    return model, encoders


def predict_mental_risk(payload: dict):
    try:
        return predict_mental_risk_in_process(payload)
    except Exception:
        return run_mental_worker("predict", payload)


def predict_mental_risk_in_process(payload: dict):
    model, encoders = load_mental_assets()

    gender = encoders["le_gender"].transform([payload["gender"]])[0]
    occupation = encoders["le_occ"].transform([payload["occupation"]])[0]
    bmi = encoders["le_bmi"].transform([payload["bmi_category"]])[0]

    features = np.array(
        [
            [
                gender,
                payload["age"],
                occupation,
                bmi,
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

    probability_map = {
        str(class_name): round(float(probability) * 100, 2)
        for class_name, probability in zip(classes, probabilities)
    }

    return {
        "label": str(label),
        "confidence": round(float(np.max(probabilities)) * 100, 2),
        "probabilities": probability_map,
    }


def mental_options():
    try:
        _, encoders = load_mental_assets()
    except Exception:
        return run_mental_worker("options", {})

    return {
        "genders": encoders["le_gender"].classes_.tolist(),
        "occupations": encoders["le_occ"].classes_.tolist(),
        "bmi_categories": encoders["le_bmi"].classes_.tolist(),
        "risk_classes": encoders["le_target"].classes_.tolist(),
    }


def run_mental_worker(action: str, payload: dict):
    python_executable = getattr(sys, "_base_executable", sys.executable)

    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as handle:
        json.dump({"action": action, "payload": payload}, handle)
        input_path = Path(handle.name)

    try:
        completed = subprocess.run(
            [python_executable, str(WORKER_PATH), str(input_path)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "Mental worker failed")
        return json.loads(completed.stdout)
    finally:
        try:
            input_path.unlink()
        except OSError:
            pass
