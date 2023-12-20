import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  })

const ProductEditFormManual = ({ product, onSave, setOpen, open }) => {

    const [editedProduct, setEditedProduct] = useState(product)

    const handleClose = () => {
        setOpen(false)
      };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedProduct({ ...editedProduct, [name]: value });
    };
  
    const handleSave = () => {
      onSave(editedProduct);
    };
  
    return (
      <div>
        <Dialog open={open} keepMounted TransitionComponent={Transition} onClose={handleClose} fullWidth maxWidth={'md'} aria-describedby="Edit Products">
        <DialogTitle>{editedProduct.pd}</DialogTitle>
        <DialogContent>
        <TextField style={{margin : '10px'}} label="SR NO" name="sno" value={editedProduct.sno} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Product Description" name="pd" value={editedProduct.pd} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="HSN Code" name="hsn" value={editedProduct.hsn} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Pcs" name="pcs" value={editedProduct.pcs} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Gr Wt" name="gr" value={editedProduct.gr} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Net Wt" name="net" value={editedProduct.net} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Rate" name="rate" value={editedProduct.rate} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Amount" name="amt" value={editedProduct.amt} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Lbr Amt" name="lbr" value={editedProduct.lbr} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Total Amount" name="tval" value={editedProduct.tval} onChange={handleChange} />
        </DialogContent>
        <DialogActions>

            <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  };
  export default ProductEditFormManual