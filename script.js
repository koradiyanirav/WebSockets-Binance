var exampleSocket = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade"
);

var tradeDiv = document.getElementById("treding");

var currentPrice = 0;
var traders = [];
const tableBody = document.getElementById("tableBody");
const maxRows = 50;

exampleSocket.onmessage = function (event) {
  var amountAbove = document.getElementById("searchInput").value;

  var oriPrice = JSON.parse(event.data);
  newrPrice = parseFloat(oriPrice.p).toFixed(2);

  tradeDiv.innerHTML = `<div class='text-[#848e9c]'>$ </div>${newrPrice}`;

  if (newrPrice > currentPrice) {
    document.getElementById("treding").style.color = "#0ecb81";
    tradeDiv.textContent += " \u2191";
  } else if (newrPrice < currentPrice) {
    document.getElementById("treding").style.color = "#f6465d";
    tradeDiv.textContent += " \u2193";
  }

  currentPrice = newrPrice;

  var colors = oriPrice.m;

  var qty = oriPrice.q;

  if (qty > amountAbove) {
    document.getElementById("tableBody").innerHTML = "";

    traders.unshift([newrPrice, qty, oriPrice.T, colors]);

    if (traders.length >= 50) {
      traders = traders.slice(0, 50);
    }

    for (let i = 0; i < traders.length; ++i) {
      const row = document.createElement("tr");
      const price = document.createElement("td");
      const amount = document.createElement("td");
      const time = document.createElement("td");

      if (traders[i][3]) {
        price.style.color = "#f6465d";
      } else {
        price.style.color = "#0ecb81";
      }

      price.textContent = traders[i][0];
      amount.textContent = traders[i][1];
      var seconds = moment(traders[i][2]).startOf("seconds").fromNow();
      time.textContent = seconds;

      row.classList.add("pr-3", "pl-4");
      price.classList.add("text-left");
      amount.classList.add("text-right");
      time.classList.add("text-right", "pr-4");

      row.appendChild(price);
      row.appendChild(amount);
      row.appendChild(time);

      tableBody.appendChild(row);
    }
  }
};

var btcSocket = new WebSocket(
  "wss://fstream.binance.com/stream?streams=btcusdt@depth10"
);

btcSocket.onmessage = function (event) {
  var btcPrice = JSON.parse(event.data);

  // console.log(btcPrice.data);

  const asks = btcPrice.data.a;
  const bids = btcPrice.data.b;
  // console.log(asks);
  // console.log(bids);

  const tabBody = document.getElementById("tabBody");
  const bitBody = document.getElementById("bitBody");

  tabBody.innerHTML = "";
  bitBody.innerHTML = "";
  var asktotal = 0;
  for (let i = 0; i < asks.length; i++) {
    const row = document.createElement("tr");

    const price = document.createElement("td");
    const amount = document.createElement("td");
    const amountp = document.createElement("td");
    price.textContent = parseFloat(asks[i]).toFixed(2);
    amount.textContent = asks[i][1];
    asktotal += parseFloat(asks[i][1]);
    amountp.textContent = asktotal.toFixed(3);

    price.classList.add("text-[#0ecb81]", "pr-2");
    amount.classList.add("text-[#848e9c]", "pl-2");
    amountp.classList.add("text-[#848e9c]", "pl-2");

    row.appendChild(price);
    row.appendChild(amount);
    row.appendChild(amountp);
    tabBody.appendChild(row);
  }

  var bidsTotal = 0;
  for (let j = 0; j < bids.length; j++) {
    const row1 = document.createElement("tr");
    // console.log(bids[j][0]);

    const price1 = document.createElement("td");
    const amount1 = document.createElement("td");
    const amountm = document.createElement("td");

    price1.textContent = parseFloat(bids[j]).toFixed(2);
    amount1.textContent = bids[j][1];
    bidsTotal += parseFloat(bids[j][1]);
    amountm.textContent = bidsTotal.toFixed(3);

    price1.classList.add("text-[#f6465d]", "pr-2");
    amount1.classList.add("text-[#848e9c]", "pl-2");
    amountm.classList.add("text-[#848e9c]", "pl-2");

    row1.appendChild(price1);
    row1.appendChild(amount1);
    row1.appendChild(amountm);
    bitBody.appendChild(row1);
  }
  const tableBody = document.getElementById("bitBody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  rows.reverse();

  tableBody.innerHTML = "";

  for (const row of rows) {
    tableBody.appendChild(row);
  }
};

const chartContainer1 = document.getElementById("chart");
const chart0 = LightweightCharts.createChart(chartContainer1, {
  layout: {
    background: {
      type: "solid",
      color: "transparent",
    },
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Noramal,
  },
  rightPriceScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
  },
});

var candleSeries = chart0.addCandlestickSeries({
  upColor: "#0ecb81",
  downColor: "#f6465d",
  borderDownColor: "rgba(255, 144, 0, 1)",
  borderUpColor: "rgba(255, 144, 0, 1)",
  wickDownColor: "rgba(255, 144, 0, 1)",
  wickUpColor: "rgba(255, 144, 0, 1)",
});

fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=btcusdt&interval=1d`)
  .then((response) => response.json())

  .then((data) => {
    const ohlc = data.map((item) => ({
      time: item[0] / 1000,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    const candleSeries = chart0.addCandlestickSeries();
    candleSeries.setData(ohlc);
  });

const { createChart } = LightweightCharts;

const chartContainer = document.getElementById("chart");

const chart = createChart(chartContainer, {
  layout: {
    background: {
      type: "solid",
      color: "#000000",
    },
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
  },
});

var candleSeries = chart.addCandlestickSeries({
  upColor: "rgba(255, 144, 0, 1)",
  downColor: "#000",
  borderDownColor: "rgba(255, 144, 0, 1)",
  borderUpColor: "rgba(255, 144, 0, 1)",
  wickDownColor: "rgba(255, 144, 0, 1)",
  wickUpColor: "rgba(255, 144, 0, 1)",
});

const candlestickSeries = chart.addCandlestickSeries();

const binanceWebSocketUrl = "wss://stream.binance.com:9443/ws/btcusdt@kline_1m";

const ws = new WebSocket(binanceWebSocketUrl);

ws.onmessage = function (event) {
  var data = JSON.parse(event.data);

  const klineData = data.k;

  candlestickSeries.update({
    time: klineData.t / 1000,
    open: parseFloat(klineData.o),
    high: parseFloat(klineData.h),
    low: parseFloat(klineData.l),
    close: parseFloat(klineData.c),
    symbol: klineData.s,
  });
};
