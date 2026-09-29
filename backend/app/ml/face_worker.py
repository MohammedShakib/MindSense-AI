import base64
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from tensorflow.keras.models import load_model


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_PATH = (
    PROJECT_ROOT
    / "Facial_Emotion_Recognition"
    / "Step3_FER_Model"
    / "Resnet_model_version_2.keras"
)
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]


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


def predict(image_data: str):
    model = load_model(MODEL_PATH, compile=False)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
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
    predictions = model.predict(preprocess_face(face_roi, model.input_shape), verbose=0)[0]
    index = int(np.argmax(predictions))
    label = EMOTIONS[index] if index < len(EMOTIONS) else f"Class_{index}"

    return {
        "label": label,
        "confidence": round(float(predictions[index]) * 100, 2),
        "probabilities": {
            emotion: round(float(probability) * 100, 2)
            for emotion, probability in zip(EMOTIONS, predictions)
        },
        "face_detected": True,
        "face_box": {"x": int(x1), "y": int(y1), "width": int(x2 - x1), "height": int(y2 - y1)},
    }


if __name__ == "__main__":
    with open(sys.argv[1], encoding="utf-8") as handle:
        payload = json.load(handle)
    print(json.dumps(predict(payload["image"])))
