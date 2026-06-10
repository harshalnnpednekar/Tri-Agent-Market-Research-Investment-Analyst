# Tri-Agent Market Research Investment Analyst 📈🤖

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0+-green.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC.svg)

> **Institutional Asset Evaluation Matrix** offering quantitative risk evaluation, market beta analysis, and plain-English strategic asset allocation.

## 📖 Overview

The **Tri-Agent Market Research Investment Analyst** is an advanced, multi-agent AI pipeline designed to provide institutional-grade investment insights. By simultaneously evaluating individual equities and mutual funds against current market conditions, this application synthesizes complex financial metrics into a clear, actionable asset allocation strategy. 

The project operates through a seamless integration of a high-performance Python/FastAPI backend and a highly responsive, modern "glassmorphism" frontend built with TailwindCSS.

---

## 🏗️ Multi-Agent Architecture

The core of the analysis is driven by a sophisticated asynchronous pipeline comprising three specialized agents:

### 1. Agent Fact Finder (The Researcher) 🕵️‍♂️
Responsible for the rapid, concurrent gathering of raw financial data.
* **Equities:** Fetches real-time stock metrics (P/E ratios, Beta, etc.) using `yfinance`.
* **Mutual Funds:** Retrieves historical performance and risk categorizations.
* **Market Sentiment:** Scrapes recent financial news headlines to gauge market mood using `beautifulsoup4`.

### 2. Agent Two-Headed Bear (The Risk Assessor) 🐻
Acts as the devil's advocate by analyzing potential liabilities.
* **Valuation Risks:** Evaluates if a stock is overvalued (e.g., P/E ratio > 25) or represents a value play.
* **Volatility Analysis:** Measures market sensitivity through Beta scores.
* **Sentiment Heuristics:** Scans recent news for bearish keywords (e.g., "crash", "loss", "plunge") to flag impending risks.

### 3. Agent Synthesizer (The Strategist) 🧠
The final decision-maker that compiles the data into a digestible report.
* **Bear Verdict:** Outputs a clear risk summary ranging from "Strong Bear" to "Bullish/Low Risk".
* **Allocation Breakdown:** Recommends precise portfolio weightings across Stocks, Mutual Funds, and Cash/Safe Havens based on the aggregated risk flags.

---

## 🛠️ Technology Stack

### Backend
* **[FastAPI](https://fastapi.tiangolo.com/):** High-performance web framework for building APIs.
* **[Pydantic](https://pydantic-docs.helpmanual.io/):** Data validation and settings management.
* **[yfinance](https://pypi.org/project/yfinance/):** Yahoo Finance market data downloader.
* **[BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/bs4/doc/):** Web scraping library for extracting news data.
* **Asyncio:** For concurrent, non-blocking agent operations.

### Frontend
* **Vanilla JavaScript & HTML5:** For lightweight, fast execution.
* **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework (used via CDN) styled with a custom dark-mode, glassmorphism aesthetic.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Python 3.8 or higher installed.
* A modern web browser.

### 1. Backend Setup

Navigate to the project root directory and create a virtual environment (recommended):

```bash
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using Uvicorn:

```bash
uvicorn backend.main:app --reload
```

The backend API will be available at `http://localhost:8000`. You can view the interactive API documentation (Swagger UI) at `http://localhost:8000/docs`.

### 2. Frontend Setup

The frontend does not require a build step. You can simply open the `frontend/index.html` file in your browser, or serve it using a simple HTTP server:

```bash
cd frontend
python -m http.server 3000
```

Access the frontend application at `http://localhost:3000`.

---

## 💻 Usage Guide

1. **Launch the Application:** Open the frontend in your web browser.
2. **Input Parameters:**
   * **Equity Ticker:** Enter a valid stock ticker symbol (e.g., `AAPL`, `TSLA`).
   * **Mutual Fund Query:** Enter the name or identifier of a mutual fund (e.g., `HDFC Mid-Cap`).
3. **Execute Analysis:** Click the **Execute** button.
4. **Review Matrix:** The application will trigger the Tri-Agent pipeline and render the following sections:
   * **Raw Metrics:** Real-time data points for the stock and mutual fund.
   * **Risk Evaluation (Bear Analysis):** Flagged risks, valuation warnings, and news sentiment.
   * **Strategic Synthesis:** The final Bear Verdict and recommended percentage allocations for your portfolio.

---

## 👨‍💻 Built By

**Harshal Pednekar**
