import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './Components/Product/ProductPage';
import HomePage from './Components/Home/HomePage';
import Navbar from './Layouts/Navbar';

function App() {
  return (
    <>
  <Router>
  <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        {/* <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
