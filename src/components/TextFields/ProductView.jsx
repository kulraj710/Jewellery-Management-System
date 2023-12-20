import React, {useState} from "react";
import Button from '@mui/material/Button';

const ProductView = ({ product, index, onDelete, setOpen, open }) => {
    
    const openEditDialog = (index) => {
        console.log('clicked on ' + index)
        const updatedModes = [...open]
        updatedModes[index] = true
        setOpen(updatedModes)
      }
    return (
      <div style={{margin : '1rem 0 0.5rem 0', padding : '5px', backgroundColor : 'lightgrey'}}>
        <span>{product.sno}</span>
        <span> - {product.pd}</span>
        <Button onClick={() => openEditDialog(index)}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    );
  };

  export default ProductView