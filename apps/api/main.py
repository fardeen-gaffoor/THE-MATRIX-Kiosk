from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Samvidhan Archive API")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    id: str
    title: str
    creator: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    language: Optional[str] = None
    rights: Optional[str] = None
    source: Optional[str] = None
    identifier: Optional[str] = None
    collection: Optional[str] = None
    location: Optional[str] = None
    people: List[str] = []
    places: List[str] = []
    topics: List[str] = []
    related_constitution_articles: List[str] = []
    provenance: Optional[str] = None
    rights_status: str
    ocr_confidence: Optional[float] = None
    digitization_date: Optional[datetime] = None
    checksum_sha256: Optional[str] = None

# SAMPLE IN-MEMORY DATA FOR SEGMENT 1 BROWSE
SAMPLE_ITEMS = [
    Item(
        id="sample-1",
        title="[SAMPLE] Draft of Article 17",
        creator="B. R. Ambedkar",
        date="1947-08-30",
        description="Drafting committee notes on the abolition of untouchability.",
        rights_status="Public Domain",
        collection="Manuscripts"
    ),
    Item(
        id="sample-2",
        title="[SAMPLE] Annihilation of Caste",
        creator="B. R. Ambedkar",
        date="1936",
        description="Undelivered speech prepared for the Jat-Pat Todak Mandal.",
        rights_status="Public Domain",
        collection="Speeches"
    )
]

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/items", response_model=List[Item])
def get_items():
    return SAMPLE_ITEMS

@app.get("/api/items/{item_id}", response_model=Item)
def get_item(item_id: str):
    for item in SAMPLE_ITEMS:
        if item.id == item_id:
            return item
    return {"error": "Not found"}
from fastapi import File, UploadFile, BackgroundTasks
import uuid
import time

from ocr_engine import process_document_ocr

@app.post("/api/admin/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    item_id = str(uuid.uuid4())
    content = await file.read()
    
    # Dispatch background task for real OCR and storage
    background_tasks.add_task(process_document_ocr, content, item_id, file.filename)
    
    return {
        "status": "processing",
        "item_id": item_id,
        "filename": file.filename,
        "message": "File uploaded successfully and sent for processing."
    }

import random

@app.get("/api/search")
def hybrid_search(q: str, type: Optional[str] = None):
    # Mocking a hybrid search (keyword + semantic reciprocal rank fusion)
    # Normally we'd do:
    # vector = generate_embedding(q)
    # results = db.query(Item).order_by(Item.embedding.cosine_distance(vector)).limit(10).all()
    print(f"Executing Hybrid Search (pgvector + keyword) for query: '{q}'")
    
    # Mock response based on SAMPLE_ITEMS
    results = []
    for item in SAMPLE_ITEMS:
        if q.lower() in item.title.lower() or q.lower() in (item.description or "").lower():
            results.append(item)
            
    if not results and SAMPLE_ITEMS:
        # Fallback to semantic similarity mock
        results = [SAMPLE_ITEMS[0]]
        
    return results

@app.get("/api/graph")
def knowledge_graph():
    # Returns a mocked force-directed graph structure of entities
    return {
        "nodes": [
            {"id": "ambedkar", "label": "B. R. Ambedkar", "group": "person"},
            {"id": "art17", "label": "Article 17", "group": "constitution"},
            {"id": "poona", "label": "Poona Pact", "group": "event"}
        ],
        "links": [
            {"source": "ambedkar", "target": "art17", "value": 5},
            {"source": "ambedkar", "target": "poona", "value": 3}
        ]
    }
from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    mode: str = "quick"
    lang: str = "en" # quick, deep_dive, compare, explain_student

@app.post("/api/chat")
def ask_ai(req: ChatRequest):
    # Mocking RAG Assistant via Anthropic API
    print(f"Executing RAG query: '{req.query}' in mode '{req.mode}' for lang '{req.lang}'")
    
    prefix = ""
    if req.lang == "hi":
        prefix = "[????? ??? ?????] "
    elif req.lang == "mr":
        prefix = "[?????? ?????] "
    
    # Simple mocked retrieval based on query
    if "caste" in req.query.lower():
        return {
            "answer": prefix + "He argued that caste could not be reformed piece by piece — it had to be rejected as a system entirely, since its logic depended on hierarchy itself.",
            "sources": [{"title": "Annihilation of Caste", "id": "sample-2", "type": "Manuscript", "year": "1936"}]
        }
    elif "constitution" in req.query.lower():
        return {
            "answer": prefix + "Article 17 abolishes untouchability outright — a direct line from that 1936 argument to enforceable law.",
            "sources": [{"title": "Draft of Article 17", "id": "sample-1", "type": "Manuscript", "year": "1947"}]
        }
    else:
        return {
            "answer": prefix + "I could not find relevant information in the archive regarding your query. I cannot invent quotes or facts.",
            "sources": []
        }

@app.get("/api/items/{item_id}/summary")
def get_item_summary(item_id: str):
    # Mocked AI summary
    return {
        "short_summary": "[AI-Generated] A foundational document outlining key arguments against systemic discrimination.",
        "detailed_summary": "[AI-Generated] This text serves as a core piece of the archive. It systematically dismantles the arguments for hierarchical social structures and advocates for a society based on liberty, equality, and fraternity.",
        "status": "approved_by_admin"
    }
@app.get("/api/items/{item_id}/translate")
def translate_item(item_id: str, target: str):
    # Mocked machine translation
    return {
        "status": "completed",
        "translated_text": f"[Mocked {target.upper()} Translation] ??????? ?? ????? (Annihilation of Caste) - ?? ???? ???????? ???",
        "original_text": "Annihilation of Caste",
        "target_lang": target
    }

@app.get("/api/items/{item_id}/tts")
def tts_item(item_id: str, lang: str = "en"):
    # Mocked TTS job submission
    return {
        "status": "processing",
        "job_id": f"tts_{item_id}_{lang}",
        "message": "TTS job queued in background.",
        "audio_url": f"http://localhost:8000/media/mock_audio.mp3"
    }


@app.get("/api/media/{media_id}/transcript")
def get_transcript(media_id: str):
    # Mocked Whisper transcript
    return {
        "status": "completed",
        "transcript": [
            {"start": 0.0, "end": 4.5, "text": "This is a mocked audio recording."},
            {"start": 4.5, "end": 9.0, "text": "In a real environment, Whisper would generate this."},
            {"start": 9.0, "end": 14.2, "text": "You can click on any of these sentences to seek the video player."},
            {"start": 14.2, "end": 20.0, "text": "It also integrates with the RAG system to cite specific timestamps."}
        ]
    }

@app.get("/api/media/{media_id}/stream")
def stream_media(media_id: str):
    # In a real app, this would use FastAPI's StreamingResponse or Range requests
    # For the mock, we'll just redirect to a public sample video or return a 404
    return {"error": "Mocked endpoint. Use a local file for React player testing."}
@app.get("/api/timeline")
def get_timeline():
    # Mocked data-driven timeline
    return {
        "events": [
            {"year": "1907", "title": "Enters College", "desc": "Enters Elphinstone College after clearing his matriculation."},
            {"year": "1923", "title": "Academic Return", "desc": "Returns from the LSE and Columbia, doctorate in hand."},
            {"year": "1927", "title": "Mahad Satyagraha", "desc": "Leads a march to assert the right of the depressed classes to draw water from a public tank."},
            {"year": "1936", "title": "Annihilation of Caste", "desc": "Writes 'Annihilation of Caste', undelivered but widely read.", "related_item_id": "sample-2"},
            {"year": "1947", "title": "Drafting Committee", "desc": "Appointed Chairman of the Drafting Committee of the Constitution.", "related_item_id": "sample-1"},
            {"year": "1949", "title": "Constitution Presented", "desc": "Presents the completed Constitution to the Assembly."},
            {"year": "1956", "title": "Nagpur Conversion", "desc": "Leads a mass conversion to Buddhism."}
        ]
    }
from pydantic import BaseModel
class Heartbeat(BaseModel):
    kiosk_id: str
    status: str

@app.post("/api/kiosk/heartbeat")
def kiosk_heartbeat(hb: Heartbeat):
    print(f"[KIOSK {hb.kiosk_id}] Heartbeat received. Status: {hb.status}")
    return {"status": "ack"}
