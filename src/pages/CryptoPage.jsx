import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layouts/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/CryptoPage.css";
import SideDrawer from "./SideDrawer";
import { Loader } from "../utils/Loader";

function CryptoPage() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paginationMode, setPaginationMode] = useState(true); // Default to pagination
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    fetchCryptoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    // Filter crypto data whenever searchTerm or cryptoData changes
    filterCryptoData();
  }, [searchTerm, cryptoData]);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets`, {
        params: { limit: 10, offset },
      });
      if (paginationMode) {
        setCryptoData(response.data.data);
      } else {
        setCryptoData((prevData) => [...prevData, ...response.data.data]);
      }
      setHasMore(response.data.data.length > 0);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async (id) => {
    try {
      const response = await axios.get(
        `https://api.coincap.io/v2/assets/${id}/history`,
        {
          params: {
            interval: "d1",
            start: Date.now() - 30 * 24 * 60 * 60 * 1000,
            end: Date.now(),
          },
        }
      );
      setPriceHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handleCryptoClick = (crypto) => {
    setSelectedCrypto({ ...crypto, priceHistory });
    fetchPriceHistory(crypto.id);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + 10);
  };

  const handlePrevious = () => {
    if (offset >= 10) {
      setOffset((prevOffset) => prevOffset - 10);
    }
  };

  const togglePaginationMode = () => {
    setPaginationMode((prevMode) => !prevMode);
    setOffset(0);
    setCryptoData([]);
    fetchCryptoData();
  };

  const filterCryptoData = () => {
    const filteredData = cryptoData.filter((crypto) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        crypto.name.toLowerCase().includes(searchLower) ||
        crypto.symbol.toLowerCase().includes(searchLower) ||
        crypto.marketCapUsd.toString().includes(searchLower) ||
        crypto.priceUsd.toString().includes(searchLower) ||
        crypto.changePercent24Hr.toString().includes(searchLower)
      );
    });
    setFilteredCryptoData(filteredData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="crypto-body">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Crypto Currencies</h1>
          <button
            className="btn btn-dark"
            onClick={togglePaginationMode}
          >
            {paginationMode ? "Switch to Infinite Scroll" : "Switch to Pagination"}
          </button>
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
          {paginationMode ? (
            <>
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
                  {filteredCryptoData.map((crypto) => (
                    <tr
                      key={crypto.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCryptoClick(crypto)}
                    >
                      <td>{crypto.name}</td>
                      <td>{crypto.symbol}</td>
                      <td>${parseFloat(crypto.marketCapUsd).toLocaleString()}</td>
                      <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
                      <td
                        className={
                          parseFloat(crypto.changePercent24Hr) >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  className="btn btn-dark me-2"
                  onClick={handlePrevious}
                  disabled={offset === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleNext}
                  disabled={!hasMore}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <InfiniteScroll
              dataLength={filteredCryptoData.length}
              next={fetchCryptoData}
              hasMore={hasMore}
              loader={<Loader/>}
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
                  {filteredCryptoData.map((crypto) => (
                    <tr
                      key={crypto.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCryptoClick(crypto)}
                    >
                      <td>{crypto.name}</td>
                      <td>{crypto.symbol}</td>
                      <td>${parseFloat(crypto.marketCapUsd).toLocaleString()}</td>
                      <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
                      <td
                        className={
                          parseFloat(crypto.changePercent24Hr) >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
          )}
        </div>

        {isDrawerOpen && (
          <SideDrawer crypto={selectedCrypto} onClose={closeDrawer} />
        )}
      </div>
    </Layout>
  );
}

export default CryptoPage;