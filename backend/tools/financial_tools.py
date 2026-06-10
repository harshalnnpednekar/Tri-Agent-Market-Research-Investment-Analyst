# pyrefly: ignore [missing-import]
import yfinance as yf
import requests
from bs4 import BeautifulSoup
import asyncio

async def fetch_stock_data(ticker: str) -> dict:
    """Fetches a stock's ticker price, P/E ratio, and Beta using yfinance."""
    loop = asyncio.get_event_loop()
    def _fetch():
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "ticker": ticker,
            "current_price": info.get("currentPrice", info.get("regularMarketPrice")),
            "pe_ratio": info.get("trailingPE", info.get("forwardPE")),
            "beta": info.get("beta")
        }
    try:
        data = await loop.run_in_executor(None, _fetch)
        return data
    except Exception as e:
        return {"ticker": ticker, "error": str(e)}

async def fetch_mutual_fund_data(query: str) -> dict:
    """Uses api.mfapi.in/mf to look up mutual funds, find scheme codes, and fetch live NAV data."""
    loop = asyncio.get_event_loop()
    def _fetch():
        # Step 1: Search for mutual fund scheme code
        search_url = "https://api.mfapi.in/mf"
        response = requests.get(search_url)
        response.raise_for_status()
        funds = response.json()
        
        # Find the first fund that matches the query
        query_lower = query.lower()
        scheme_code = None
        fund_name = None
        for fund in funds:
            if query_lower in fund.get('schemeName', '').lower():
                scheme_code = fund['schemeCode']
                fund_name = fund['schemeName']
                break
                
        if not scheme_code:
            return {"query": query, "error": "Mutual fund not found"}
            
        # Step 2: Fetch scheme details
        details_url = f"https://api.mfapi.in/mf/{scheme_code}"
        details_response = requests.get(details_url)
        details_response.raise_for_status()
        details = details_response.json()
        
        # Extract live NAV and historical info
        nav_data = details.get('data', [])
        latest_nav = nav_data[0] if nav_data else {}
        
        return {
            "query": query,
            "scheme_code": scheme_code,
            "fund_name": fund_name,
            "fund_house": details.get('meta', {}).get('fund_house'),
            "scheme_category": details.get('meta', {}).get('scheme_category'),
            "latest_nav_date": latest_nav.get('date'),
            "latest_nav": latest_nav.get('nav'),
            "historical_data_points": len(nav_data)
        }
    
    try:
        data = await loop.run_in_executor(None, _fetch)
        return data
    except Exception as e:
        return {"query": query, "error": str(e)}

async def scrape_market_news(query: str) -> dict:
    """Scrapes a public market news feed to extract recent headlines and market sentiment alerts."""
    loop = asyncio.get_event_loop()
    def _fetch():
        # Yahoo Finance news search
        url = f"https://finance.yahoo.com/quote/{query}/news"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        headlines = []
        # Fallback approach to get general h3s if class doesn't match
        for h3 in soup.find_all('h3'):
            text = h3.get_text(strip=True)
            if text and len(text) > 15: # Filter out short UI elements
                headlines.append(text)
                
        return {
            "query": query,
            "headlines": headlines[:5] # Return top 5 headlines
        }
        
    try:
        data = await loop.run_in_executor(None, _fetch)
        return data
    except Exception as e:
        return {"query": query, "error": str(e)}
