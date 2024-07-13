import React, { useState } from 'react';
import '../Styles/Layouts/SearchBar.css';
import ButtonComponent from './ButtonComponent';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Add your search functionality here based on searchTerm
  // (e.g., filter data, trigger API call)

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {/* <button className="btn btn-primary">Search</button> */}
      <ButtonComponent title={"Search"}/>
    </div>
  );
};

export default SearchBar;
