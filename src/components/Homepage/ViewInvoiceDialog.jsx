import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { format } from 'date-fns';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Invoice from '../Invoice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewInvoiceDialog({open, setOpen, data, printRef}) {


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth={'md'}
        aria-describedby="view Invoice"
      >
        <DialogTitle>Invoice No. {data.invoiceNo}</DialogTitle>
        <DialogContent>
          {/* <Invoice/> */}
           <Invoice ref={printRef} sec1={{invoice : data.invoiceNo, date : format(data.invoiceDate.toDate(), "dd-MM-yyyy")}} sec2={{invoiceType : data.invoiceType}} sec3={{ name : data.name, phone : data.phone, address : data.address, gstin : data.gstin, pan : data.pan }} sec4={data.productTable} discount={data.discount} netAmount={data.netAmt} cgst={data.cgst} sgst={data.sgst} payment={data.payment} totalAmount={data.totalAmt} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}