import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_unauthorized_access_to_save_result():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/auth/analysis/save", json={
            "filename": "file.jpg",
            "cancer_probability": 0.5
        })
        assert res.status_code == 401  # Unauthorized
