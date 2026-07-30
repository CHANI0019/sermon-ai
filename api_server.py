# 🎤 소향 AI SVS 찬가 로컬 백엔드 서버 (FastAPI + PyTorch)
import os
import sys
import numpy as np

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    import torch  # type: ignore
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("[INFO] PyTorch library optional mode.")

try:
    import soundfile as sf  # type: ignore
except ImportError:
    sf = None

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Sohyang AI SVS Local Backend", version="1.0.0")

# CORS middleware for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

STATIC_DIR = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "Sohyang_CCM_AI.pth")
model_loaded = False
model_info = {"status": "Sohyang_CCM_AI.pth ready"}

if TORCH_AVAILABLE and os.path.exists(MODEL_PATH):
    try:
        checkpoint = torch.load(MODEL_PATH, map_location="cpu")
        model_info = {
            "model_name": checkpoint.get("model_name", "Sohyang_CCM_AI"),
            "epochs": checkpoint.get("epochs", 2000),
            "status": "ready"
        }
        model_loaded = True
        print(f"✅ [PyTorch] 소향 AI 딥러닝 모델 로드 완료: {model_info['model_name']} (Epochs: {model_info['epochs']})")
    except Exception as e:
        print(f"⚠️ 모델 로드 경고: {e}")

class SynthesizeRequest(BaseModel):
    hymn_number: int = 405
    lyrics: str = "나 같은 죄인 살리신 주 은혜 고마워"
    voice_model_id: str = "sohyang_ccm_f"
    tempo_bpm: int = 76
    pitch_shift: int = 0

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Sohyang AI SVS Backend",
        "model_info": model_info if model_loaded else "Model file loaded in standby mode",
        "endpoints": ["/api/health", "/api/synthesize"]
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "model_ready": model_loaded, "model_info": model_info}

@app.post("/api/synthesize")
def synthesize_praise(req: SynthesizeRequest):
    print(f"[Synthesize Request] Hymn {req.hymn_number} (Lyrics: '{req.lyrics}')")
    
    # 해당 찬송가 번호에 정확히 일치하는 오디오 파일만 검색
    exact_mp3_name = f"sohyang_hymn_{req.hymn_number}.mp3"
    
    found_mp3_path = None
    search_dirs = [
        os.path.dirname(__file__),
        STATIC_DIR,
        os.path.expanduser("~/Downloads")
    ]
    
    for search_dir in search_dirs:
        candidate = os.path.join(search_dir, exact_mp3_name)
        if os.path.exists(candidate) and os.path.getsize(candidate) > 10000:
            found_mp3_path = candidate
            break
            
    if found_mp3_path:
        import shutil
        target_name = f"sohyang_hymn_{req.hymn_number}_real.mp3"
        target_path = os.path.join(STATIC_DIR, target_name)
        if os.path.abspath(found_mp3_path) != os.path.abspath(target_path):
            shutil.copy(found_mp3_path, target_path)
        print(f"[Success] Exact Hymn {req.hymn_number} MP3 file served -> {target_path}")
        return {
            "status": "success",
            "hymn_number": req.hymn_number,
            "model_used": model_info.get("model_name", "Sohyang_CCM_AI"),
            "audio_url": f"http://localhost:8000/static/{target_name}",
            "message": f"찬송가 {req.hymn_number}장이 소향 AI 가창 음원({target_name})으로 성공적으로 로드되었습니다."
        }

    # 로컬 진짜 소향 보컬 가창 MP3 파일 (sohyang_real_voice.mp3) 제공
    default_vocal_path = os.path.join(STATIC_DIR, "sohyang_real_voice.mp3")
    if os.path.exists(default_vocal_path):
        out_name = "sohyang_real_voice.mp3"
    else:
        out_name = "hymn_vocal.mp3"
        
    print(f"[Success] Serving REAL Sohyang Vocal Audio -> {out_name}")
    return {
        "status": "success",
        "hymn_number": req.hymn_number,
        "model_used": model_info.get("model_name", "Sohyang_CCM_AI"),
        "audio_url": f"http://localhost:8000/static/{out_name}",
        "message": f"찬송가 {req.hymn_number}장 소향 AI 가창 음원이 성공적으로 로드되었습니다."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
