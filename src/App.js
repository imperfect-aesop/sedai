import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CryptoPage from './pages/CryptoPage'
import ExchangePage from './pages/ExchangePage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/crypto" element={<CryptoPage />} />
      <Route path="/exchanges" element={<ExchangePage />} />
    </Routes>
  </Router>
);

export default App;
