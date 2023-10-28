import React from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Section5 = ({ calculate, discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount }) => {

  const calculateValuesWithPercent = (val) => {
    setNetAmount(0);
    setCgst(0);
    setSgst(0);
    setTotalAmount(0);
    // Parse the discount input as a float
    const discountValue = parseFloat(val) || 0;
    let netAmountValue;
    if (!val.endsWith('%')){
        // Calculate the net amount
        netAmountValue = calculate - discountValue
    }
    else{
        netAmountValue = calculate - (calculate * (discountValue/100));
    }


    // Calculate CGST and SGST (1.5% of net amount)
    const cgstValue = (netAmountValue * 1.5) / 100;
    const sgstValue = (netAmountValue * 1.5) / 100;

    // Calculate the total amount
    const totalAmountValue = netAmountValue + cgstValue + sgstValue;

    // Update state with the calculated values
    setNetAmount(netAmountValue.toFixed(2));
    setCgst(cgstValue.toFixed(2));
    setSgst(sgstValue.toFixed(2));
    setTotalAmount(Math.round(totalAmountValue));
  }

  

  const handleDiscountChange = (event) => {
    const newValue = event.target.value;
        setDiscount(newValue)    
        calculateValuesWithPercent(newValue);

  };

  const styles = {
    display  : 'flex',
        justifyContent : 'space-between',
        padding : '1rem 1rem 1rem 0'
  }

  return (
    <div>
      <div style={styles}>
      <div>
          <TextField label="Discount in % or Rs." placeholder="Discount" value={discount} onChange={handleDiscountChange} />
        </div>
        <div>
          <TextField label="Net Amount" value={netAmount} />
        </div>
      </div>
{/* 
      <FormControlLabel
          value="start"
          control={<Checkbox />}
          label="Add GST"
          labelPlacement="start"
        /> */}

      <div style={styles}>
        <div>
          <TextField label="CGST (1.50%)" value={cgst} disabled/>
        </div>
        <div>
          <TextField label="SGST (1.50%)" value={sgst} disabled/>
        </div>
      </div>

      <div style={styles}>
        <div>
          <TextField label="Total Amount" value={totalAmount} disabled />
        </div>
        <div>
          <TextField
            label="Payment"
            placeholder="Add payment received"
            value={payment}
            onChange={(event) => setPayment(event.target.value)}
          />
        </div>
        <div>
          <TextField label="Bill Outstanding" value={(totalAmount - payment)} disabled />
        </div>
      </div>
    </div>
  );
};

export default Section5;
