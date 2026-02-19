import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { GlobalProvider } from './components/GlobalContext.js';
import ArtShow from './components/ArtShow.js';
import NavBar from './components/NavBar.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <Router>
        <div className='min-h-screen flex flex-col'>
          <NavBar />
          <main className='flex-grow'>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/home" element={<App />} />
              <Route path="/artshow" element={<ArtShow />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
