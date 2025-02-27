/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../styles/Sidebar.css'
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="col-md-2 d-md-block sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/crypto" className="nav-link">
              <i className="fas fa-coins me-2"></i>
              Crypto Currencies
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exchanges" className="nav-link">
              <i className="fas fa-chart-bar me-2"></i>
              Exchanges
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;