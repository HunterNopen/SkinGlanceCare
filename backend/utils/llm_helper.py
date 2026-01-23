import os
from typing import List, Dict, Any
from dotenv import load_dotenv
import requests

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


CLASS_FULL_NAME = {
    "MEL": "Melanoma",
    "BKL": "Benign keratosis-like lesion",
    "NV": "Melanocytic nevus",
    "BCC": "Basal cell carcinoma",
    "AKIEC": "Actinic keratosis / intraepithelial carcinoma",
    "DF": "Dermatofibroma",
    "VASC": "Vascular lesion",
    "HEAL": "Healthy / normal skin",
}


def _format_confidences(confidences: List[Dict[str, Any]]) -> str:
    parts = []
    for item in confidences:
        label = item.get("label", "?")
        score = float(item.get("confidence", 0.0))
        parts.append(f"{label}: {score * 100:.1f}%")
    return ", ".join(parts)


def build_gemini_message(prediction: Dict[str, Any]) -> str:
    """
    Создаёт человекочитаемое сообщение для пользователя
    на основе нового JSON HuggingFace, без зависимости от старых
    label/confidences.
    """
    predicted_class = prediction.get("predicted_class", "unknown")
    predicted_class_full = prediction.get("predicted_class_full", predicted_class)
    predicted_probability = prediction.get("predicted_probability", 0.0)
    risk_level = prediction.get("risk_level", "UNKNOWN")
    certainty_score = prediction.get("certainty_score", 0.0)
    certainty_level = prediction.get("certainty_level", "UNKNOWN")
    cancer_probability = prediction.get("cancer_probability", None)
    cancer_certainty = prediction.get("cancer_certainty", None)
    recommendation = prediction.get("recommendation", "")
    is_ood = prediction.get("is_ood", False)
    model_uncertainty = prediction.get("model_uncertainty", None)

    system_prompt = (
        "You are a supportive digital assistant helping a person who "
        "uploaded a photo of a skin lesion to an AI screening tool. "
        "You are NOT a doctor and this is NOT a diagnosis. "
        "Your job is to explain the AI result in calm, simple language, "
        "reassure the user, and gently encourage them to consult a "
        "dermatologist or doctor for any worries. "
        "Avoid medical jargon and avoid sounding alarming. "
        "Always remind that only a doctor can diagnose skin cancer."
    )

    user_context = (
        f"The AI model analyzed a photo of a skin lesion.\n"
        f"Predicted class: {predicted_class_full} ({predicted_class})\n"
        f"Probability: {predicted_probability:.1f}%\n"
        f"Risk level: {risk_level}\n"
        f"Model certainty: {certainty_score:.1f} ({certainty_level})\n"
        f"Cancer probability: {cancer_probability} (certainty: {cancer_certainty})\n"
        f"Recommendation: {recommendation}\n"
        f"Out-of-distribution flag: {is_ood}, model uncertainty: {model_uncertainty}"
    )

    user_instruction = (
        "Based on this non‑diagnostic AI output, write a short message "
        "(120–220 words) directly to the user that:\n"
        "- Explains in everyday language what this result suggests.\n"
        "- Stresses that this is only a computer estimate, not a medical diagnosis.\n"
        "- Encourages them to see a dermatologist, especially if the lesion is new, changing, painful, or worrying.\n"
        "- If the probability is high, be clear but calm; avoid scary wording.\n"
        "- If the probability is moderate or low, explain uncertainty and still "
        "recommend monitoring and professional advice.\n"
        "- Suggest taking or keeping clear, well‑lit photos to show to a doctor.\n"
        "Do NOT mention model names, probabilities, or internal technical details. "
        "Focus only on what the user should understand and consider doing next."
    )

    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return (
            "Our AI system has analyzed your photo and provided an estimate for "
            "the type of skin lesion. This result is not a diagnosis. For your "
            "safety, please discuss any concerns with a dermatologist or doctor, "
            "especially if the spot is new, changing, or causing symptoms."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": system_prompt},
                    {"text": user_context},
                    {"text": user_instruction},
                ],
            }
        ]
    }
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}

    try:
        response = requests.post(url, headers=headers, params=params, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise ValueError("No candidates returned from Gemini")
        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        if not parts:
            raise ValueError("No content parts returned from Gemini")
        text = parts[0].get("text")
        if not text:
            raise ValueError("Empty text returned from Gemini")
        return text.strip()
    except Exception as e:
        print("Gemini error:", e)
        if "response" in locals():
            print("Response text:", response.text)
        # error handling, return a fallback message
        return "Error"

