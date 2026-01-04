
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAWEHC7 Analytics Pro</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; padding: 20px; margin: 0; }
        .card { background: #1e293b; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 800px; }
        .search-section { display: grid; grid-template-columns: 2fr 1fr auto; gap: 10px; margin-bottom: 25px; }
        input, select { background: #334155; border: 1px solid #475569; color: white; padding: 12px; border-radius: 10px; outline: none; }
        button { background: #38bdf8; color: #0f172a; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; }
        
        .header-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 20px; }
        .token-main { display: flex; align-items: center; gap: 15px; }
        .token-icon { width: 60px; height: 60px; border-radius: 50%; background: #334155; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-item { background: #0f172a; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #334155; }
        .stat-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; }
        .stat-value { font-size: 16px; font-weight: bold; }

        .converter-box { background: #0f172a; padding: 20px; border-radius: 15px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border: 1px solid #334155; }
        .converter-group { display: flex; flex-direction: column; }
        
        #chart-container { height: 400px; margin: 20px 0; border-radius: 15px; overflow: hidden; background: #161d27; border: 1px solid #334155; }
        .actions { display: flex; gap: 10px; margin-top: 20px; }
        .btn-action { flex: 1; text-align: center; padding: 10px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; color: white; background: #475569; }
        .btn-share { background: #34d399; color: #064e3b; cursor: pointer; border: none; }
        
        #result { display: none; }
        .positive { color: #34d399; }
        .negative { color: #ef4444; }
    </style>
</head>
<body>

<div class="card">
    <h2 style="text-align:center; margin-top:0;">📊 YAWEHC7 Dashboard Final</h2>
    
    <div class="search-section">
        <input type="text" id="address" placeholder="Contrato YAWEHC7" value="">
        <select id="network">
            <option value="ethereum">Ethereum</option>
            <option value="binance-smart-chain">BSC</option>
            <option value="polygon-pos">Polygon</option>
        </select>
        <button onclick="buscarToken()">Analizar</button>
    </div>

    <div id="result">
        <div class="header-info">
            <div class="token-main">
                <img id="tokenImg" class="token-icon" src="" alt="">
                <div>
                    <h3 id="tokenTitle" style="margin:0">Token</h3>
                    <div id="tokenPrice" style="font-size:24px; font-weight:bold; color:#38bdf8;">$0.00</div>
                </div>
            </div>
            <div id="priceChange" style="font-size: 20px; font-weight: bold;">0%</div>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Máx 24h</div>
                <div class="stat-value" id="high24">$0.00</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Mín 24h</div>
                <div class="stat-value" id="low24">$0.00</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Volumen 24h</div>
                <div class="stat-value" id="vol24">$0.00</div>
            </div>
        </div>

        <div class="converter-box">
            <div class="converter-group">
                <label style="font-size:11px; color:#94a3b8;">CANTIDAD TOKEN</label>
                <input type="number" id="inputToken" value="1" oninput="convertir('token')">
            </div>
            <div class="converter-group">
                <label style="font-size:11px; color:#94a3b8;">VALOR EN USD</label>
                <input type="number" id="inputUSD" oninput="convertir('usd')">
            </div>
        </div>

        <div id="chart-container"></div>

        <div class="actions">
            <a id="btnExplorer" href="#" target="_blank" class="btn-action">🔍 Explorador</a>
            <button class="btn-action btn-share" onclick="compartir()">🔗 Compartir Análisis</button>
        </div>
    </div>
</div>

<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script>
let precioActual = 0;
let sym = "";

async function buscarToken() {
    const address = document.getElementById('address').value.trim();
    const network = document.getElementById('network').value;
    
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${network}/contract/${address}`);
        const data = await res.json();

        precioActual = data.market_data.current_price.usd;
        sym = data.symbol.toUpperCase();

        document.getElementById('result').style.display = 'block';
        document.getElementById('tokenImg').src = data.image.large;
        document.getElementById('tokenTitle').innerText = data.name;
        document.getElementById('tokenPrice').innerText = `$${precioActual.toLocaleString()} USD`;
        
        // Stats 24h
        const change = data.market_data.price_change_percentage_24h;
        const changeElem = document.getElementById('priceChange');
        changeElem.innerText = `${change.toFixed(2)}%`;
        changeElem.className = change >= 0 ? 'positive' : 'negative';

        document.getElementById('high24').innerText = `$${data.market_data.high_24h.usd}`;
        document.getElementById('low24').innerText = `$${data.market_data.low_24h.usd}`;
        document.getElementById('vol24').innerText = `$${data.market_data.total_volume.usd.toLocaleString()}`;

        // Reset Convertidor
        document.getElementById('inputToken').value = 1;
        document.getElementById('inputUSD').value = precioActual;

        new TradingView.widget({
            "autosize": true,
            "symbol": `${sym}USDT`,
            "interval": "60",
            "theme": "dark",
            "container_id": "chart-container"
        });

    } catch (e) { alert("Error al cargar datos."); }
}

function convertir(origen) {
    if (origen === 'token') {
        document.getElementById('inputUSD').value = (document.getElementById('inputToken').value * precioActual).toFixed(2);
    } else {
        document.getElementById('inputToken').value = (document.getElementById('inputUSD').value / precioActual).toFixed(6);
    }
}

function compartir() {
    const texto = `Análisis de ${sym}: Precio $${precioActual} USD. 24h Change: ${document.getElementById('priceChange').innerText}`;
    navigator.clipboard.writeText(texto);
    alert("¡Resumen copiado al portapapeles!");
}
</script>
</body>
</html>
<img width="864" height="1184" alt="1000070877" src="https://github.com/user-attachments/assets/85ffab5a-5531-4565-a3f9-31e826aad37f" />
<img width="864" height="1184" alt="1000070877" src="https://github.com/user-attachments/assets/63f6f0fa-2dfd-4cce-9113-b15b9b66f3ef" />
