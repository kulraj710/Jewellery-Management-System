import React from 'react'
import "../Styles/Layouts/Navbar.css"
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Store Name</h1>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/product" className="nav-link">Inventory</Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
