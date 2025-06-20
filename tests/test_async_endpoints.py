import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_analyze_image_async():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {"file": ("test.jpg", b"image-bytes", "image/jpeg")}
        response = await ac.post("/analyze-image", files=files)

        assert response.status_code == 200
        json_data = response.json()
        assert "cancer_probability" in json_data