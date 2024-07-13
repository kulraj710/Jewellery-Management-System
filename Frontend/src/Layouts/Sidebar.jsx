import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Layouts/Sidebar.css';

const Sidebar = () => {

  const navigate = useNavigate()

  const navigateToNewProduct = () => {
    navigate('/product/new')
  }

  return (
    <div className="sidebar">
      <h2>Inventory Options</h2>
      <div className="sidebar-section">
        <div className='add-new-product'>
          <button className='apply-button' onClick={navigateToNewProduct}>+ Add New</button>
        </div>
        <h3>Sort By</h3>
        <div className="checkbox-group">
          <label>
            <input type="radio" name="sort" value="price" />
            Price
          </label>
          <label>
            <input type="radio" name="sort" value="name" />
            Name
          </label>
          <label>
            <input type="radio" name="sort" value="date" />
            Date Added
          </label>
        </div>
      </div>
      <div className="sidebar-section">
        <h3>Filter By</h3>
        <div className="filter-group">
          <label>Category:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="rings" />
              Rings
            </label>
            <label>
              <input type="checkbox" value="necklaces" />
              Necklaces
            </label>
            <label>
              <input type="checkbox" value="bracelets" />
              Bracelets
            </label>
          </div>
        </div>
        <div className="filter-group">
          <label>Material:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="gold" />
              Gold
            </label>
            <label>
              <input type="checkbox" value="silver" />
              Silver
            </label>
            <label>
              <input type="checkbox" value="platinum" />
              Platinum
            </label>
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="price-range">Price Range:</label>
          <input type="text" id="price-range" placeholder="e.g. 1000-5000" />
        </div>
      </div>
      <button className="apply-button">Apply</button>
    </div>
  );
};

export default Sidebar;
