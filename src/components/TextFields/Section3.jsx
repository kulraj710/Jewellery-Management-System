import React from 'react'
import TextField from '@mui/material/TextField';

const Section3 = ({sec3,  setSec3}) => {
    const sec1 = {
        display  : 'flex',
        justifyContent : 'space-between',
        padding : '1rem 1rem 1rem 0'
    }

    const handleInputChange = (e) => {
          setSec3((prev) => ({...prev, [e.target.name] : e.target.value}))
    }
  return (
    
        <div>
            <div style={sec1}>
            <div>
        <TextField
          required
          name='name'
          onChange={handleInputChange}
          label="Full Name"
          placeholder="Full Name"
        />
        </div>
        <div>
        <TextField
          label="Phone"
          placeholder="Phone"
          name='phone'
          onChange={handleInputChange}
        />
        </div>
            </div>
        
        <div>
        <TextField
          fullWidth
          name='address'
          onChange={handleInputChange}
          label="Address"
          placeholder="Address"
        />
        </div>
        <div style={sec1}>

        <div>
        <TextField
          name='gstin'
          onChange={handleInputChange}
          label="GSTIN"
          placeholder="GSTIN"
        />
        </div>
        <div>
        <TextField
          name='pan'
          onChange={handleInputChange}
          label="PAN"
          placeholder="PAN"
        />
        </div>
        </div>
        </div>
  )
}

export default Section3