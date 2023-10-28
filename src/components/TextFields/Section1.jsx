import React from 'react'
import TextField from '@mui/material/TextField';
import {format} from "date-fns"

const Section1 = ({sec1, setSec1}) => {
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
  required
  label="Invoice No"
  name='no'
  placeholder='Invoice No'
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