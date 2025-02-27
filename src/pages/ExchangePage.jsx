import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../layouts/Layout';
import '../styles/ExchangePage.css';

function ExchangePage() {
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    fetchExchanges();
  }, []);

  useEffect(() => {
    // Filter exchanges whenever searchTerm or exchanges changes
    filterExchanges();
  }, [searchTerm, exchanges]);

  const fetchExchanges = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/exchanges');
      setExchanges(response.data.data.slice(0, 50));
      setFilteredExchanges(response.data.data.slice(0, 50)); // Initialize filteredExchanges with the same data
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const sortedExchanges = [...filteredExchanges].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting applied

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    // Convert values to numbers if sorting by 'volumeUsd' or 'tradingPairs'
    if (sortConfig.key === 'volumeUsd' || sortConfig.key === 'tradingPairs') {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Function to change sorting
  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Function to filter exchanges based on search term
  const filterExchanges = () => {
    const filteredData = exchanges.filter((exchange) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        exchange.name.toLowerCase().includes(searchLower) ||
        exchange.volumeUsd.toString().includes(searchLower) ||
        exchange.tradingPairs.toString().includes(searchLower)
      );
    });
    setFilteredExchanges(filteredData);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="crypto-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('volumeUsd')} style={{ cursor: 'pointer' }}>
                  Volume {sortConfig.key === 'volumeUsd' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('tradingPairs')} style={{ cursor: 'pointer' }}>
                  Trading Pairs {sortConfig.key === 'tradingPairs' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedExchanges.map((exchange) => (
                <tr key={exchange.id} style={{ cursor: 'pointer' }} onClick={() => window.open(exchange.exchangeUrl, '_blank')}>
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