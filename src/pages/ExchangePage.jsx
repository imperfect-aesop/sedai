import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layouts/Layout';
import '../styles/ExchangePage.css';

function ExchangePage() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch exchange data
  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/exchanges');
      setExchanges(response.data.data.slice(0, 50)); // Limit to 50 exchanges
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="crypto-body">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Exchanges</h1>
        </div>

        <div className="search-bar">
          <div className="input-group">
            <span className="input-group-text bg-dark border-0 text-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark border-0 text-white"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Volume</th>
                <th>Trading Pairs</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange) => (
                <tr key={exchange.id} style={{cursor:"pointer"}} onClick={() => window.open(exchange.exchangeUrl, '_blank')}>
                  <td>{exchange.name}</td>
                  <td>${parseFloat(exchange.volumeUsd).toLocaleString()}</td>
                  <td>{exchange.tradingPairs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default ExchangePage;