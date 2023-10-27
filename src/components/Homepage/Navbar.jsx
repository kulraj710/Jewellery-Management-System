import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import "../../css/navbar.css"
import { format } from 'date-fns';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Shree Vaibhav Jewellers
      </div>
      <div>
      <Button startIcon={  <AddIcon/> } variant="outlined" href="/create">
        Create New Invoice
      </Button>
      </div>
      <div className="navbar-links">
        <p>Today's Date : {format(new Date(), "dd-MM-yyyy")}</p>
      </div>
    </nav>
  );
}

export default Navbar;
