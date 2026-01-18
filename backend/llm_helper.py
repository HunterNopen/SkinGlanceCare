import os
from typing import List, Dict, Any

import requests


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


def build_gemini_message(
    prediction: Dict[str, Any],
    confidence_score: float,
    confidence_top3_score: float | None = None,
) -> str:
    label = prediction.get("label", "unknown")
    confidences = prediction.get("confidences", [])
    top_conf = 0.0
    if confidences:
        top_conf = float(confidences[0].get("confidence", 0.0))

    confidences_text = _format_confidences(confidences)

    full_label = CLASS_FULL_NAME.get(label, label)

    top3_conf = "N/A" if confidence_top3_score is None else f"{confidence_top3_score:.1f}"

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
        "The AI model analyzed a photo of a skin lesion. "
        f"Predicted class (non‑diagnostic label): {full_label} ({label}). "
        f"Top model probability: {top_conf * 100:.1f}%. "
        f"Full distribution: {confidences_text}. "
        f"Heuristic confidence based on full distribution and empirical metrics (0–100): {confidence_score:.1f}. "
        f"Additional confidence based mainly on the top three classes (0–100): {top3_conf}. "
        "The classes come from the HAM10000 dataset: a mix of benign "
        "and malignant skin lesions, plus a 'HEAL' class for healthy skin."
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
    except Exception:
        return (
            "The AI has generated an internal summary of your result, but we "
            "couldn’t retrieve the full explanation right now. The most "
            "important next step is to contact a dermatologist or doctor if "
            "you notice any changes or feel worried about this spot."
        )

