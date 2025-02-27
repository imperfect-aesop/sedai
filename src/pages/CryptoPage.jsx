import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layouts/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/CryptoPage.css";
import SideDrawer from "./SideDrawer";

function CryptoPage() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility

  // Fetch initial cryptocurrency data
  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets`, {
        params: { limit: 10, offset },
      });
      setCryptoData((prevData) => [...prevData, ...response.data.data]);
      setOffset((prevOffset) => prevOffset + 10);
      setHasMore(response.data.data.length > 0);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch price history for a selected cryptocurrency
  const fetchPriceHistory = async (id) => {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets/${id}/history`, {
        params: { interval: "d1", start: Date.now() - 30 * 24 * 60 * 60 * 1000, end: Date.now() },
      });
      setPriceHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  // Handle click on a cryptocurrency card
  const handleCryptoClick = (crypto) => {
    setSelectedCrypto({ ...crypto, priceHistory }); // Pass crypto data and price history
    fetchPriceHistory(crypto.id);
    setIsDrawerOpen(true); // Open the drawer
  };

  // Close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Layout>
      <div className="crypto-body">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Crypto Currencies</h1>
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
          <InfiniteScroll
            dataLength={cryptoData.length}
            next={fetchCryptoData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <table className="crypto-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Market Cap</th>
                  <th>Price</th>
                  <th>24 hr Change %</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto) => (
                  <tr key={crypto.id} style={{ cursor: "pointer" }} onClick={() => handleCryptoClick(crypto)}>
                    <td>{crypto.name}</td>
                    <td>{crypto.symbol}</td>
                    <td>${parseFloat(crypto.marketCapUsd).toLocaleString()}</td>
                    <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
                    <td className={parseFloat(crypto.changePercent24Hr) >= 0 ? "positive" : "negative"}>
                      {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>

        {/* Side Drawer */}
        {isDrawerOpen && (
          <SideDrawer
            crypto={selectedCrypto}
            onClose={closeDrawer}
          />
        )}
      </div>
    </Layout>
  );
}

export default CryptoPage;