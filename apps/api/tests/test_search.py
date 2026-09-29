from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_endpoint():
    response = client.get("/api/search?q=caste")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0

def test_chat_endpoint():
    response = client.post("/api/chat", json={"query": "test", "mode": "quick", "lang": "en"})
    assert response.status_code == 200
    assert "answer" in response.json()

def test_timeline_endpoint():
    response = client.get("/api/timeline")
    assert response.status_code == 200
    assert "events" in response.json()
