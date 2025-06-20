import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_multiple_users_login_and_analysis():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Generujemy unikalne nazwy userów
        user1_name = f"user1_{uuid.uuid4().hex[:8]}"
        user2_name = f"user2_{uuid.uuid4().hex[:8]}"

        # Register and login first user
        res1 = await ac.post("/auth/signup", json={"name": user1_name, "password": "pass123"})
        assert res1.status_code == 200
        login1 = await ac.post("/auth/login", json={"username": user1_name, "password": "pass123"})
        assert login1.status_code == 200
        token1 = login1.json().get("access_token")
        assert token1 is not None

        # Register and login second user
        res2 = await ac.post("/auth/signup", json={"name": user2_name, "password": "pass456"})
        assert res2.status_code == 200
        login2 = await ac.post("/auth/login", json={"username": user2_name, "password": "pass456"})
        assert login2.status_code == 200
        token2 = login2.json().get("access_token")
        assert token2 is not None

        # Perform analysis as user1
        headers1 = {"Authorization": f"Bearer {token1}"}
        files1 = {"file": ("img1.jpg", b"image1", "image/jpeg")}
        res_analysis_1 = await ac.post("/analyze-image", files=files1, headers=headers1)
        assert res_analysis_1.status_code == 200

        # Perform analysis as user2
        headers2 = {"Authorization": f"Bearer {token2}"}
        files2 = {"file": ("img2.jpg", b"image2", "image/jpeg")}
        res_analysis_2 = await ac.post("/analyze-image", files=files2, headers=headers2)
        assert res_analysis_2.status_code == 200
