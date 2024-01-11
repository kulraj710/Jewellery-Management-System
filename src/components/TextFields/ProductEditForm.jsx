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

const ProductEditForm = ({ product, onSave, setOpen, open, setCurrentAmt, setCurrentTval }) => {
    const [editedProduct, setEditedProduct] = useState(product)
  
    useEffect(() => {
        calculateAutoFillValue()
      }, [editedProduct.amt, editedProduct.lbr])
    useEffect(() => {
        calculateAutoFillValue1()
      }, [editedProduct.net, editedProduct.rate])

      const calculateAutoFillValue = () => {
        const num1 = parseFloat(editedProduct.amt);
        const num2 = parseFloat(editedProduct.lbr);
        
        if (!isNaN(num1) && !isNaN(num2)) {
            const b = Math.round((num1 + num2) * 0.97)
            setCurrentTval(b)
            setEditedProduct(prev => ({...prev, tval : b}))
        } else {
            setCurrentTval(0);
        }
      }

      const calculateAutoFillValue1 = () => {
        const num1 = parseFloat(editedProduct.rate);
        const netw = parseFloat(editedProduct.net)
        
        if(!isNaN(netw) && !isNaN(num1)){
          const val = Math.round(num1 * netw)
          setCurrentAmt(val)
          setEditedProduct(prev => ({...prev, amt : val}))
        }
         else {
            setCurrentAmt(0)
        }
      }

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
        <TextField style={{margin : '10px'}} disabled label="Amount" name="amt" value={editedProduct.amt} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="Lbr Amt" name="lbr" value={editedProduct.lbr} onChange={handleChange} />
        <TextField style={{margin : '10px'}} label="HUID Amt" name="huid" value={editedProduct.huid} onChange={handleChange} />
        {/* yet to test */}
        <TextField style={{margin : '10px'}} label="O. Charge" name="ochrg" value={editedProduct.ochrg} onChange={handleChange} />
        <TextField style={{margin : '10px'}} disabled label="Total Amount" name="tval" value={editedProduct.tval} onChange={handleChange} />
        </DialogContent>
        <DialogActions>

            <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  };
  export default ProductEditForm