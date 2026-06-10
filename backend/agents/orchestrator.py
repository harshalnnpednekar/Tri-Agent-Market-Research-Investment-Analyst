import asyncio
from backend.tools.financial_tools import fetch_stock_data, fetch_mutual_fund_data, scrape_market_news

async def agent_fact_finder(stock_ticker: str, mutual_fund_query: str) -> dict:
    """Agent 1: Assembles raw stock and mutual fund metrics alongside scraped news."""
    # Run data fetches concurrently
    stock_task = asyncio.create_task(fetch_stock_data(stock_ticker))
    mf_task = asyncio.create_task(fetch_mutual_fund_data(mutual_fund_query))
    news_task = asyncio.create_task(scrape_market_news(stock_ticker))
    
    stock_data, mf_data, news_data = await asyncio.gather(stock_task, mf_task, news_task)
    
    return {
        "stock_data": stock_data,
        "mutual_fund_data": mf_data,
        "news_data": news_data
    }

async def agent_two_headed_bear(fact_data: dict) -> dict:
    """Agent 2: Analyzes liabilities (high debt/P/E ratios) and mutual fund risks."""
    analysis = []
    flags = 0
    
    # Stock Analysis
    stock = fact_data.get("stock_data", {})
    if "error" in stock:
        analysis.append(f"Stock Error: {stock['error']}")
    else:
        pe_ratio = stock.get("pe_ratio")
        beta = stock.get("beta")
        
        if pe_ratio is not None:
            if pe_ratio > 25:
                analysis.append(f"High Valuation Risk: P/E ratio is {pe_ratio}, indicating potential overvaluation.")
                flags += 1
            elif pe_ratio < 10:
                analysis.append(f"Value Play: P/E ratio is {pe_ratio}, indicating potential undervaluation.")
        else:
            analysis.append("P/E ratio not available.")
            
        if beta is not None:
            if beta > 1.5:
                analysis.append(f"High Volatility Risk: Beta is {beta}, indicating high market sensitivity.")
                flags += 1
            elif beta < 0.8:
                analysis.append(f"Low Volatility: Beta is {beta}, indicating stability.")
        else:
            analysis.append("Beta not available.")
            
    # Mutual Fund Analysis
    mf = fact_data.get("mutual_fund_data", {})
    if "error" in mf:
        analysis.append(f"Mutual Fund Error: {mf['error']}")
    else:
        # We don't have expense ratio from the basic API, but we have category
        category = mf.get("scheme_category", "")
        if category and "Equity" in category:
            analysis.append("Fund Risk: Equity mutual funds carry higher market risks compared to debt funds.")
            flags += 1
        elif category and "Debt" in category:
            analysis.append("Fund Safety: Debt mutual funds offer stability but lower returns.")
            
    # News Sentiment Heuristic (Basic text analysis)
    news = fact_data.get("news_data", {})
    headlines = news.get("headlines", [])
    bearish_keywords = ["down", "fall", "crash", "loss", "bear", "sell", "lawsuit", "debt", "missed", "drop", "plunge"]
    bearish_count = 0
    for headline in headlines:
        if any(keyword in headline.lower() for keyword in bearish_keywords):
            bearish_count += 1
            
    if bearish_count > 0:
        analysis.append(f"Negative News Sentiment: {bearish_count} out of {len(headlines)} headlines contain bearish keywords.")
        flags += 1
        
    return {
        "risk_flags": flags,
        "analysis_points": analysis
    }

async def agent_synthesizer(fact_data: dict, bear_analysis: dict) -> dict:
    """Agent 3: Formats a balanced investment comparison matrix, Bear Verdict, and allocation breakdown."""
    
    flags = bear_analysis.get("risk_flags", 0)
    
    # Bear Verdict
    if flags >= 3:
        verdict = "Strong Bear: Significant risks identified across valuation, volatility, or market sentiment. High caution advised."
        stock_alloc = "10%"
        mf_alloc = "70%"
        cash_alloc = "20%"
    elif flags == 2:
        verdict = "Moderate Bear: Some risk indicators are elevated. Consider a defensive tilt."
        stock_alloc = "30%"
        mf_alloc = "60%"
        cash_alloc = "10%"
    elif flags == 1:
        verdict = "Neutral/Slight Bear: Normal market risks. Maintain a balanced approach."
        stock_alloc = "45%"
        mf_alloc = "50%"
        cash_alloc = "5%"
    else:
        verdict = "Bullish/Low Risk: Few risk flags identified. Favorable conditions for growth."
        stock_alloc = "60%"
        mf_alloc = "40%"
        cash_alloc = "0%"
        
    allocation_breakdown = {
        "Recommended Stock Allocation": stock_alloc,
        "Recommended Mutual Fund Allocation": mf_alloc,
        "Cash/Safe Haven": cash_alloc
    }
    
    # Structure the final report
    report = {
        "Raw_Metrics": fact_data,
        "Bear_Analysis": bear_analysis,
        "Synthesis": {
            "Bear_Verdict": verdict,
            "Allocation_Breakdown": allocation_breakdown
        }
    }
    return report

async def run_analysis(stock_ticker: str, mutual_fund_query: str) -> dict:
    """Pipeline Orchestrator chaining the three agents."""
    fact_data = await agent_fact_finder(stock_ticker, mutual_fund_query)
    bear_analysis = await agent_two_headed_bear(fact_data)
    final_report = await agent_synthesizer(fact_data, bear_analysis)
    return final_report
