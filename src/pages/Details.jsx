// eslint-disable-next-line no-unused-vars
import React from "react";
import "../styles/Details.css";

function Details() {
  return (
      <div className="crypto-body container-fluid py-5">
        <h1 className="mb-4">Bitcoin</h1>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="custom-card p-3">
              <h6>Current Price</h6>
              <h3>$66,047.07</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card p-3">
              <h6>Market Cap</h6>
              <h3>$1.3 Trillion</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card p-3">
              <h6>Past 24 hr</h6>
              <h3>
                <span className="text-green">+ $500 (3.4%)</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="custom-card p-4" style={{height: " calc(100vh - 100px)", overflow:"auto"}}>
          <h6>Price History</h6>
          <canvas id="priceChart" className="chart-container"></canvas>
        </div>
      </div>
  );
}

export default Details;
