import React from 'react';
import TextField from '@mui/material/TextField';

const Section5Manual = ({  discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount }) => {

  const styles = {
    display  : 'flex',
        justifyContent : 'space-between',
        padding : '1rem 1rem 1rem 0'
  }
  return (
    <div>
      <div style={styles}>
      <div>
          <TextField label="Discount in % or Rs." placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div>
          <TextField label="Net Amount" value={netAmount} onChange={(e) => setNetAmount(e.target.value)}/>
        </div>
      </div>

      <div style={styles}>
        <div>
          <TextField label="CGST (1.50%)" value={cgst} onChange={(e) => setCgst(e.target.value)}/>
        </div>
        <div>
          <TextField label="SGST (1.50%)" value={sgst} onChange={(e) => setSgst(e.target.value)}/>
        </div>
      </div>

      <div style={styles}>
        <div>
          <TextField label="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
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

export default Section5Manual;
