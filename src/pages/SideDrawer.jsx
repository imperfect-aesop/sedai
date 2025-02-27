import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; 
import "../styles/SideDrawer.css";

function SideDrawer({ crypto, onClose }) {
  const [currentPrice, setCurrentPrice] = useState(parseFloat(crypto.priceUsd));

  useEffect(() => {
    if (!crypto) return;
    const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${crypto.id}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[crypto.id]) {
        setCurrentPrice(parseFloat(data[crypto.id]));
      }
    };

    return () => {
      ws.close(); 
    };
  }, [crypto]);

  const chartOptions = {
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: crypto.priceHistory.map((entry) => [
          entry.time,
          parseFloat(entry.priceUsd),
        ]),
        type: "line",
      },
    ],
  };

  return (
    <div className="side-drawer">
      <div className="side-drawer-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h1 className="mb-4">{crypto.name}</h1>
        <div className="row mb-4 custom-row">
          <div className="custom-col">
            <div className="custom-card p-3">
              <h6>Current Price</h6>
              <h3>${currentPrice.toFixed(2)}</h3> 
            </div>
          </div>
          <div className="custom-col">
            <div className="custom-card p-3">
              <h6>Market Cap</h6>
              <h3>${parseFloat(crypto.marketCapUsd).toLocaleString()}</h3>
            </div>
          </div>
          <div className="custom-col">
            <div className="custom-card p-3">
              <h6>Past 24 hr</h6>
              <h3>
                <span
                  className={
                    parseFloat(crypto.changePercent24Hr) >= 0
                      ? "text-green"
                      : "text-red"
                  }
                >
                  {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                </span>
              </h3>
            </div>
          </div>
        </div>

        <div
          className="custom-card p-4"
          style={{ height: "calc(100vh - 200px)", overflow: "auto" }}
        >
          <h6>Price History</h6>
          <ReactECharts option={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
