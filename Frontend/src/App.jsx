import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './Components/Product/ProductPage';
import HomePage from './Components/Home/HomePage';
import Navbar from './Layouts/Navbar';
import Sidebar from './Layouts/Sidebar';
import "./Styles/App.css"

function App() {
  return (
      <Router>
        <div className='app'>
          <Sidebar />
          <div className='home-content'>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product" element={<ProductPage />} />
            </Routes>
          </div>
        </div>
      </Router>
  )
}

export default App
