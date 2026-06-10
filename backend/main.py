# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from backend.agents.orchestrator import run_analysis

app = FastAPI(title="Tri-Agent Market Research Investment Analyst")

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    stock_ticker: str
    mutual_fund_query: str

class AnalysisResponse(BaseModel):
    Raw_Metrics: dict
    Bear_Analysis: dict
    Synthesis: dict

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_investment(request: AnalysisRequest):
    """
    Triggers the async Tri-Agent pipeline to analyze a stock and mutual fund.
    """
    try:
        report = await run_analysis(request.stock_ticker, request.mutual_fund_query)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Tri-Agent Market Research API is running."}
