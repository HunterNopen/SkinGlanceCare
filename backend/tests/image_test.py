import pytest
from io import BytesIO
from unittest.mock import patch, MagicMock

@pytest.fixture
def auth_headers(verified_user):
    from backend.auth.auth import create_access_token
    
    token = create_access_token(data={"user_id": verified_user.id}) 
    
    return {"Authorization": f"Bearer {token}"}

def test_upload_image_success(client, auth_headers):
    file_content = b"fake_image_content"
    file_name = "test_skin.jpg"
    files = {"file": (file_name, BytesIO(file_content), "image/jpeg")}

    mock_gradio_result = {
        "predicted_class": "mel",
        "predicted_probability": 0.95,
        "class_probabilities": {"mel": 0.95, "nv": 0.05},
        "certainty_score": 0.9,
        "certainty_level": "high",
        "cancer_probability": 0.8,
        "cancer_certainty": "high",
        "risk_level": "high",
        "recommendation": "Consult a doctor",
        "is_ood": False,
        "model_uncertainty": 0.05
    }

    with patch("backend.routers.image.get_gradio_client") as mock_gradio_client, \
         patch("backend.routers.image.build_gemini_message") as mock_gemini, \
         patch("backend.routers.image.validate_image"), \
         patch("backend.routers.image.clear_metadata"):

        mock_client_instance = MagicMock()
        mock_client_instance.predict.return_value = mock_gradio_result
        mock_gradio_client.return_value = mock_client_instance

        mock_gemini.return_value = "This is a fake advice from Gemini."

        response = client.post(
            "/images/upload/", 
            headers=auth_headers,
            files=files
        )

        assert response.status_code == 201
        data = response.json()
        assert data["result"]["predicted_class"] == "mel"
        assert data["result"]["llm_message"] == "This is a fake advice from Gemini."
        assert "image_id" in data