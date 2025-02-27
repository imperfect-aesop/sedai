import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation(); // Get current route

  return (
    <nav className="col-md-2 d-md-block sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              to="/crypto" 
              className={`nav-link ${location.pathname === '/crypto' ? 'active' : ''}`}
            >
              <i className="fas fa-coins me-2"></i>
              Crypto Currencies
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/exchanges" 
              className={`nav-link ${location.pathname === '/exchanges' ? 'active' : ''}`}
            >
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
