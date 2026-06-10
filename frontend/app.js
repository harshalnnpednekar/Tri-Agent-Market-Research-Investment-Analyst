document.addEventListener('DOMContentLoaded', () => {
    
    // Parallax Ambient Background
    document.addEventListener('mousemove', (e) => {
        const bg = document.getElementById('ambient-bg');
        if (bg) {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            bg.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    const form = document.getElementById('evaluation-form');
    const skeletonContainer = document.getElementById('skeleton-container');
    const dataContainer = document.getElementById('data-container');
    const errorBanner = document.getElementById('error-banner');
    const errorText = document.getElementById('error-text');
    const closeErrorBtn = document.getElementById('close-error');

    closeErrorBtn.addEventListener('click', () => {
        errorBanner.classList.remove('opacity-100');
        setTimeout(() => errorBanner.classList.add('hidden'), 300);
    });

    function showError(message) {
        errorText.textContent = message;
        errorBanner.classList.remove('hidden');
        setTimeout(() => errorBanner.classList.add('opacity-100'), 10);
        
        skeletonContainer.classList.remove('opacity-100');
        setTimeout(() => skeletonContainer.classList.add('hidden'), 500);
    }

    function formatCurrency(value) {
        if (value === null || value === undefined || value === '--') return '--';
        return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    }
    
    function formatNumber(value, decimals=2) {
        if (value === null || value === undefined || value === '--') return '--';
        return typeof value === 'number' ? value.toFixed(decimals) : value;
    }

    function escapeHTML(str) {
        if (typeof str !== 'string') return String(str);
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    function renderSkeletons() {
        skeletonContainer.innerHTML = `
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
            <div class="xl:col-span-2 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="glass-panel rounded-2xl p-6 h-[300px] flex flex-col animate-entry">
                        <div class="skeleton h-6 w-1/3 mb-8"></div>
                        <div class="skeleton h-10 w-1/2 mb-8"></div>
                        <div class="skeleton h-20 w-full mt-auto"></div>
                    </div>
                    <div class="glass-panel rounded-2xl p-6 h-[300px] flex flex-col animate-entry delay-100">
                        <div class="skeleton h-6 w-1/3 mb-8"></div>
                        <div class="skeleton h-10 w-1/2 mb-8"></div>
                        <div class="skeleton h-20 w-full mt-auto"></div>
                    </div>
                </div>
                <div class="glass-panel rounded-2xl p-6 h-[250px] animate-entry delay-200">
                    <div class="skeleton h-6 w-1/4 mb-6"></div>
                    <div class="space-y-4">
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-5/6"></div>
                        <div class="skeleton h-4 w-4/6"></div>
                    </div>
                </div>
            </div>
            <div class="space-y-8">
                <div class="glass-panel rounded-2xl p-6 min-h-[600px] animate-entry delay-300">
                    <div class="skeleton h-6 w-3/4 mb-8"></div>
                    <div class="space-y-8">
                        <div>
                            <div class="skeleton h-4 w-1/3 mb-4"></div>
                            <div class="skeleton h-3 w-full mb-2"></div>
                            <div class="skeleton h-3 w-5/6"></div>
                        </div>
                        <div>
                            <div class="skeleton h-4 w-1/3 mb-4"></div>
                            <div class="skeleton h-3 w-full mb-2"></div>
                            <div class="skeleton h-3 w-4/6"></div>
                        </div>
                        <div class="pt-8">
                            <div class="skeleton h-4 w-1/3 mb-4"></div>
                            <div class="skeleton h-3 w-full mb-4"></div>
                            <div class="skeleton h-3 w-full mb-4"></div>
                            <div class="skeleton h-3 w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        dataContainer.classList.remove('opacity-100');
        dataContainer.classList.add('hidden');
        
        skeletonContainer.classList.remove('hidden');
        setTimeout(() => skeletonContainer.classList.add('opacity-100'), 10);
    }

    function renderData(data, stockTicker, mfQuery) {
        const raw = data.Raw_Metrics || {};
        const bear = data.Bear_Analysis || {};
        const synthesis = data.Synthesis || {};
        
        // Equity parsing
        const stockData = raw.stock_data || {};
        const ticker = escapeHTML(stockData.ticker || stockTicker.toUpperCase());
        const price = escapeHTML(stockData.error ? 'Error' : formatCurrency(stockData.current_price));
        const pe = escapeHTML(stockData.error ? '--' : formatNumber(stockData.pe_ratio));
        const beta = escapeHTML(stockData.error ? '--' : formatNumber(stockData.beta));
        const betaVal = stockData.error || isNaN(stockData.beta) ? 1 : stockData.beta;
        const betaAngle = Math.min(Math.max((betaVal - 1) * 90, -90), 90);
        
        // MF parsing
        const mfData = raw.mutual_fund_data || {};
        const mfName = escapeHTML(mfData.error ? mfQuery : (mfData.fund_name || mfQuery));
        const nav = escapeHTML(mfData.error ? 'Error' : formatCurrency(mfData.latest_nav));
        const cat = escapeHTML(mfData.error ? '--' : (mfData.scheme_category || 'N/A'));
        
        let mockExpense = mfData.error ? 0 : (((mfData.fund_name || "").length % 15) * 0.1 + 0.5);
        const expPct = Math.min((mockExpense / 2.5) * 100, 100);
        let expGradient = 'linear-gradient(to right, #10b981, #34d399)';
        if(mockExpense >= 1.5) expGradient = 'linear-gradient(to right, #fbbf24, #f43f5e)';
        else if(mockExpense >= 0.8) expGradient = 'linear-gradient(to right, #10b981, #fbbf24)';
        
        // News parsing
        const headlines = (raw.news_data || {}).headlines || [];
        let newsHtml = headlines.length === 0 ? '<li class="italic text-slate-500">No significant news detected.</li>' : '';
        headlines.forEach((hl, i) => {
            newsHtml += `<li class="flex items-start text-slate-300 stagger-line" style="animation-delay: ${i*100}ms"><span class="text-indigo-400 mr-3 mt-0.5">›</span> <span>${escapeHTML(hl)}</span></li>`;
        });

        const points = bear.analysis_points || [];
        let prosHtml = '';
        let consHtml = '';
        points.forEach((pt, i) => {
            let safePt = pt.replace(/Bearish/gi, "Negative").replace(/Bear/gi, "Risk").replace(/Fund Risk/gi, "Market Exposure Risk");
            let escapedPt = escapeHTML(safePt);
            if (safePt.includes("Risk") || safePt.includes("Error") || safePt.includes("Negative") || safePt.includes("High")) {
                consHtml += `<li class="flex items-start stagger-line text-slate-300 leading-relaxed" style="animation-delay: ${(i*100)+400}ms"><span class="text-amber-500 mr-2 mt-0.5">⚠</span> <span>${escapedPt}</span></li>`;
            } else {
                prosHtml += `<li class="flex items-start stagger-line text-slate-300 leading-relaxed" style="animation-delay: ${(i*100)+400}ms"><span class="text-emerald-500 mr-2 mt-0.5">✓</span> <span>${escapedPt}</span></li>`;
            }
        });
        if(!prosHtml) prosHtml = '<li class="italic text-slate-500 text-xs">No specific strengths identified.</li>';
        if(!consHtml) consHtml = '<li class="italic text-slate-500 text-xs">No specific risk factors identified.</li>';

        // Allocation parsing
        const alloc = synthesis.Allocation_Breakdown || {};
        const stockPctStr = escapeHTML(alloc["Recommended Stock Allocation"] || "0%");
        const mfPctStr = escapeHTML(alloc["Recommended Mutual Fund Allocation"] || "0%");
        const cashPctStr = escapeHTML(alloc["Cash/Safe Haven"] || "0%");

        dataContainer.innerHTML = `
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full pb-10">
            
            <div class="xl:col-span-2 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Equity Card -->
                    <div class="glass-panel rounded-2xl p-6 relative overflow-hidden animate-entry delay-100 h-[320px] flex flex-col group">
                        <div class="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                        <h3 class="text-sm font-bold text-slate-300 mb-4 flex justify-between items-center uppercase tracking-widest border-b border-slate-700/50 pb-3">
                            <span class="text-white text-lg">${ticker}</span>
                            <span class="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 py-1 px-3 rounded-full text-[10px]">EQUITY</span>
                        </h3>
                        
                        <div class="flex justify-between items-end mb-6">
                            <div>
                                <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Market Price</p>
                                <p class="text-3xl font-mono text-white font-light tracking-tight">${price}</p>
                            </div>
                            <div class="text-right relative has-tooltip cursor-help z-20">
                                <p class="text-xs text-slate-400 uppercase tracking-wider border-b border-dashed border-slate-500 inline-block mb-1">P/E Ratio</p>
                                <p class="text-xl font-mono text-slate-200">${pe}</p>
                                <div class="tooltip-text absolute bottom-full right-0 mb-2 w-64 p-3 glass-panel rounded-lg shadow-2xl text-xs text-slate-200 text-left">
                                    <strong class="text-cyan-400">Valuation:</strong> The price tag of earnings. High P/E means premium pricing.
                                </div>
                            </div>
                        </div>

                        <div class="mt-auto relative z-10">
                            <div class="flex justify-between items-end mb-2 relative has-tooltip cursor-help z-20">
                                <p class="text-xs text-slate-400 uppercase tracking-wider border-b border-dashed border-slate-500 inline-block">Volatility (Beta)</p>
                                <p class="text-lg font-mono text-slate-200">${beta}</p>
                                <div class="tooltip-text absolute bottom-full left-0 mb-2 w-64 p-3 glass-panel rounded-lg shadow-2xl text-xs text-slate-200 text-left">
                                    <strong class="text-amber-400">Beta:</strong> Measures price swings against the market. >1.0 implies higher volatility and risk.
                                </div>
                            </div>
                            <!-- Speedometer Gauge -->
                            <div class="gauge-container mt-2">
                                <div class="gauge-arc"></div>
                                <div class="gauge-needle" style="transform: rotate(${betaAngle}deg)"></div>
                                <div class="gauge-center"></div>
                            </div>
                        </div>
                    </div>

                    <!-- MF Card -->
                    <div class="glass-panel rounded-2xl p-6 relative overflow-hidden animate-entry delay-200 h-[320px] flex flex-col group">
                        <div class="absolute -right-10 -top-10 w-32 h-32 bg-magenta-500/10 rounded-full blur-2xl group-hover:bg-magenta-500/20 transition-all"></div>
                        <h3 class="text-sm font-bold text-slate-300 mb-4 flex justify-between items-center uppercase tracking-widest border-b border-slate-700/50 pb-3">
                            <span class="text-white text-lg truncate pr-3" title="${mfName}">${mfName}</span>
                            <span class="bg-magenta-500/20 text-magenta-300 border border-magenta-500/30 py-1 px-3 rounded-full text-[10px]">FUND</span>
                        </h3>

                        <div class="flex justify-between items-end mb-6">
                            <div>
                                <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Latest NAV</p>
                                <p class="text-3xl font-mono text-white font-light tracking-tight">${nav}</p>
                            </div>
                            <div class="text-right max-w-[120px]">
                                <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Category</p>
                                <p class="text-sm font-medium text-slate-200 truncate">${cat}</p>
                            </div>
                        </div>

                        <div class="mt-auto relative z-10">
                            <div class="flex justify-between items-end mb-4 relative has-tooltip cursor-help z-20">
                                <p class="text-xs text-slate-400 uppercase tracking-wider border-b border-dashed border-slate-500 inline-block">Expense Ratio</p>
                                <p class="text-lg font-mono text-slate-200">${mfData.error ? '--' : mockExpense.toFixed(2)+ '%'}</p>
                                <div class="tooltip-text absolute bottom-full right-0 mb-2 w-64 p-3 glass-panel rounded-lg shadow-2xl text-xs text-slate-200 text-left">
                                    <strong class="text-rose-400">Fees:</strong> Annual management fee. Color shifts to amber/red as fees exceed 1.2%.
                                </div>
                            </div>
                            <div class="w-full bg-slate-800/80 rounded-full h-2 border border-slate-700/50 overflow-hidden">
                                <div class="h-full transition-all duration-[1500ms] ease-out w-0" style="width: ${expPct}%; background: ${expGradient}"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- News -->
                <div class="glass-panel rounded-2xl overflow-hidden animate-entry delay-300">
                    <div class="px-6 py-4 border-b border-slate-700/50 bg-slate-800/40">
                        <h2 class="text-xs font-bold text-slate-300 uppercase tracking-widest">Algorithmic News Sentiment</h2>
                    </div>
                    <div class="p-6">
                        <ul class="space-y-4 text-sm">${newsHtml}</ul>
                    </div>
                </div>
            </div>

            <!-- Synthesis -->
            <div class="space-y-8 animate-entry delay-400">
                <div class="glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500"></div>
                    <div class="px-6 py-5 border-b border-slate-700/50 bg-slate-800/40">
                        <h2 class="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center">
                            Strategic Intelligence Report
                        </h2>
                    </div>
                    <div class="p-6 space-y-6">
                        
                        <div>
                            <h3 class="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-4 flex items-center">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Strengths
                            </h3>
                            <ul class="space-y-4 text-sm">${prosHtml}</ul>
                        </div>

                        <div class="border-t border-slate-700/50"></div>

                        <div>
                            <h3 class="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-4 flex items-center">
                                <span class="w-2 h-2 rounded-full bg-amber-500 mr-2 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Risk Factors
                            </h3>
                            <ul class="space-y-4 text-sm">${consHtml}</ul>
                        </div>

                        <div class="border-t border-slate-700/50"></div>

                        <div class="space-y-5 pt-2">
                            <h3 class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Optimal Allocation Matrix</h3>
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-300 font-medium">Equity Exposure</span>
                                    <span class="font-mono text-cyan-400">${stockPctStr}</span>
                                </div>
                                <div class="w-full bg-slate-800/80 rounded-full h-1.5 border border-slate-700/30 overflow-hidden">
                                    <div class="bg-cyan-500 h-1.5 rounded-full transition-all duration-[1500ms] shadow-[0_0_8px_rgba(6,182,212,0.6)]" style="width: 0%" id="anim-alloc-stock"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-300 font-medium">Mutual Fund Guardrails</span>
                                    <span class="font-mono text-magenta-400">${mfPctStr}</span>
                                </div>
                                <div class="w-full bg-slate-800/80 rounded-full h-1.5 border border-slate-700/30 overflow-hidden">
                                    <div class="bg-magenta-500 h-1.5 rounded-full transition-all duration-[1500ms] shadow-[0_0_8px_rgba(217,70,239,0.6)]" style="width: 0%" id="anim-alloc-mf"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-slate-300 font-medium">Cash / Safe Haven</span>
                                    <span class="font-mono text-slate-400">${cashPctStr}</span>
                                </div>
                                <div class="w-full bg-slate-800/80 rounded-full h-1.5 border border-slate-700/30 overflow-hidden">
                                    <div class="bg-slate-500 h-1.5 rounded-full transition-all duration-[1500ms]" style="width: 0%" id="anim-alloc-cash"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        // Crossfade
        skeletonContainer.classList.remove('opacity-100');
        setTimeout(() => {
            skeletonContainer.classList.add('hidden');
            dataContainer.classList.remove('hidden');
            setTimeout(() => {
                dataContainer.classList.add('opacity-100');
                
                // Trigger allocation bar animations slightly after DOM insertion
                setTimeout(() => {
                    const barS = document.getElementById('anim-alloc-stock');
                    const barM = document.getElementById('anim-alloc-mf');
                    const barC = document.getElementById('anim-alloc-cash');
                    if(barS) barS.style.width = stockPctStr;
                    if(barM) barM.style.width = mfPctStr;
                    if(barC) barC.style.width = cashPctStr;
                }, 100);
                
            }, 50);
        }, 500);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        errorBanner.classList.remove('opacity-100');
        setTimeout(() => errorBanner.classList.add('hidden'), 300);

        const stockTicker = document.getElementById('stock_ticker').value.trim();
        const mfQuery = document.getElementById('mutual_fund_query').value.trim();

        if (!stockTicker || !mfQuery) {
            showError("Both Equity Ticker and Mutual Fund Query are required.");
            return;
        }

        // Show Skeleton Loaders
        dataContainer.classList.remove('opacity-100');
        setTimeout(() => {
            dataContainer.classList.add('hidden');
            renderSkeletons();
        }, 300); // If data was showing, hide it first

        try {
            const response = await fetch('http://127.0.0.1:8000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stock_ticker: stockTicker,
                    mutual_fund_query: mfQuery
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Map JSON Data to HTML Components & Render
            renderData(data, stockTicker, mfQuery);

        } catch (error) {
            console.error("Evaluation Error:", error);
            showError(`Evaluation Engine Failure: ${error.message}`);
        }
    });
});
