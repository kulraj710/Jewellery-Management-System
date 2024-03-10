import React, {useEffect} from 'react'
import TextField from '@mui/material/TextField';
import { collection, getCountFromServer } from '@firebase/firestore';
import { db } from '../../firebase';


const Section1 = ({sec1, setSec1}) => {

  useEffect(() => {
    const fetchInvoiceNo = async () => {

      const coll = collection(db, "invoice");
      const snapshot = await getCountFromServer(coll);
      const invoiceCount = snapshot.data().count + 1
      console.log('count: ', snapshot.data().count);
  
      setSec1((prev) => ({...prev, invoice : invoiceCount}));

    }
      
    fetchInvoiceNo()
  }, []); // Run only once on component mount


    const styles = {
        display : 'flex',
        justifyContent : 'space-between',
        padding : '1rem 1rem 1rem 0'
    }

    const handleInputChange = (e) => {
        
        if (e.target.name === "no") {
            setSec1((prev) => ({...prev, invoice : e.target.value}))
        }
        if (e.target.name === "date"){
            setSec1((prev) => ({...prev, date : e.target.value}))
    }
      }

  return (
    <div style={styles}>
    <div>

<TextField
  // required
  disabled
  label="Invoice No"
  name='no'
  placeholder='Invoice No'
  helperText="This is auto-filled, can not be edited."
  value={sec1.invoice}
  onChange={handleInputChange}
  type='number'
/>
    </div>
    <div>
        <TextField
          required
          label="Invoice Date"
          value={sec1.date}
          name='date'
          onChange={handleInputChange}
        />
        </div>
    </div>
  )
}

export default Section1