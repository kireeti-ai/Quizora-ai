import React from 'react';
import ReactDOM from 'react-dom/client'; // <--- YOU ARE LIKELY MISSING THIS LINE
import { BrowserRouter } from 'react-router-dom'; // If you use Router here
import App from './App.jsx';
import './index.css';

// React 18+ Style
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Ensure Router wraps App if not inside App.jsx */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);