import base64
import json
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = (
    PROJECT_ROOT
    / "Facial_Emotion_Recognition"
    / "Step3_FER_Model"
    / "Resnet_model_version_2.keras"
)
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
STEP3_PYTHON = (
    PROJECT_ROOT
    / "Facial_Emotion_Recognition"
    / "Step3_FER_Streamlit"
    / ".venv"
    / "Scripts"
    / "python.exe"
)
WORKER_PATH = Path(__file__).with_name("face_worker.py")


@lru_cache(maxsize=1)
def load_face_assets():
    from tensorflow.keras.models import load_model

    model = load_model(MODEL_PATH, compile=False)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    return model, cascade


def decode_image(image_data: str):
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    image_bytes = base64.b64decode(image_data)
    np_bytes = np.frombuffer(image_bytes, dtype=np.uint8)
    image_bgr = cv2.imdecode(np_bytes, cv2.IMREAD_COLOR)
    if image_bgr is None:
        raise ValueError("Invalid image data")
    return image_bgr


def preprocess_face(face_bgr, model_input_shape):
    height = model_input_shape[1] or 224
    width = model_input_shape[2] or 224
    channels = model_input_shape[3] or 3

    if channels == 1:
        face = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2GRAY)
        face = cv2.resize(face, (width, height))
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=-1)
    else:
        face = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
        face = cv2.resize(face, (width, height))
        face = face.astype("float32") / 255.0

    return np.expand_dims(face, axis=0)


def predict_facial_emotion(image_data: str):
    try:
        return predict_facial_emotion_in_process(image_data)
    except ModuleNotFoundError as exc:
        if exc.name != "tensorflow":
            raise
        return predict_facial_emotion_subprocess(image_data)


def predict_facial_emotion_subprocess(image_data: str):
    if not STEP3_PYTHON.exists():
        raise RuntimeError("TensorFlow is not installed in the backend environment and Step3 Python was not found.")

    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as handle:
        json.dump({"image": image_data}, handle)
        input_path = Path(handle.name)

    try:
        completed = subprocess.run(
            [str(STEP3_PYTHON), str(WORKER_PATH), str(input_path)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=120,
        )
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "Facial worker failed")
        return json.loads(completed.stdout)
    finally:
        try:
            input_path.unlink()
        except OSError:
            pass


def predict_facial_emotion_in_process(image_data: str):
    model, cascade = load_face_assets()
    image_bgr = decode_image(image_data)
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

    if len(faces) == 0:
        return {
            "label": "No face detected",
            "confidence": 0,
            "probabilities": {},
            "face_detected": False,
        }

    x, y, width, height = sorted(faces, key=lambda face: face[2] * face[3], reverse=True)[0]
    pad = int(0.10 * max(width, height))
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(image_bgr.shape[1], x + width + pad)
    y2 = min(image_bgr.shape[0], y + height + pad)

    face_roi = image_bgr[y1:y2, x1:x2]
    model_input = preprocess_face(face_roi, model.input_shape)
    predictions = model.predict(model_input, verbose=0)[0]
    index = int(np.argmax(predictions))
    label = EMOTIONS[index] if index < len(EMOTIONS) else f"Class_{index}"

    probability_map = {
        emotion: round(float(probability) * 100, 2)
        for emotion, probability in zip(EMOTIONS, predictions)
    }

    return {
        "label": label,
        "confidence": round(float(predictions[index]) * 100, 2),
        "probabilities": probability_map,
        "face_detected": True,
        "face_box": {"x": int(x1), "y": int(y1), "width": int(x2 - x1), "height": int(y2 - y1)},
    }
