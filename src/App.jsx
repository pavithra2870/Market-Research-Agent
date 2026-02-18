import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import LandingPage from './LandingPage';
import ProductResearch from './ProductResearch';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductResearch />} />
          <Route path="/research" element={<div style={{padding: '4rem 2rem', textAlign: 'center', color: '#a3a3a3'}}><h1>Market Research</h1><p>Coming soon...</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
