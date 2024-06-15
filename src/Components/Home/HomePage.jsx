import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <button>
        <Link to="/product">Go to Product Page</Link>
      </button>
      {/* <button>
        <Link to="/page2">Go to Page 2</Link>
      </button>
      <button>
        <Link to="/page3">Go to Page 3</Link>
      </button> */}
    </div>
  );
};

export default HomePage;
