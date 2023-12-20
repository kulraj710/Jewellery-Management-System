import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditProductListManual from './EditProductListManual';

const Section4Manual = ({sec4, setSec4}) => {
    const [values, setValues] = useState({})

    const styles = {
        display : 'flex',
        justifyContent : 'space-between',
        padding : '1rem 1rem 1rem 0'
    }


    const handleChange = (e) => {
        
        setValues(prev => ({...prev, [e.target.name] : e.target.value}))
      };

      const addProduct = () => {
        setSec4(prev => [...prev, values])
        setValues({sno: '', pd: '', hsn: '', pcs : '', gr : '', net : '', rate : '', amt : '', lbr : '', tval : 0})
      }
  return (
   <div>
     <div>
     <div>
        <EditProductListManual products={sec4} setSec4={setSec4}/>
      </div>
        <div style={styles}>
        <div>
        <TextField required label="SR NO" value={values.sno} placeholder="SNO" type='number' name='sno' onChange={handleChange} style={{width : '140px'}}/>
        </div>
        <div>
        <TextField value={values.pd} required label="Product Description" name='pd' onChange={handleChange} placeholder="Product Description" style={{width : '480px'}} />
        </div>
        </div>

        <div style={styles}>
        <div>
        <TextField value={values.hsn} required label="HSN Code" name='hsn' onChange={handleChange} placeholder="HSN Code" />
        </div>
        <div>
        <TextField value={values.pcs} required label="Pcs" name='pcs' onChange={handleChange} placeholder="Pcs" />
        </div>

        <div>
        <TextField value={values.gr} required label="Gr Wt" name='gr' onChange={handleChange} placeholder="Gr Wt" />
        </div>
        </div>
        
        <div style={styles}>

        <div>
        <TextField value={values.net} required label="Net Wt" name='net' onChange={handleChange} placeholder="Net Wt" />
        </div>
        <div>
        <TextField value={values.rate} required label="Rate" name='rate' onChange={handleChange} placeholder="Rate" />
        </div>
        <div>
        <TextField value={values.amt} required label="Amount" name='amt' onChange={handleChange} placeholder="Amount" type='number' />
        </div>
        </div>

        <div style={styles}>

        <div>
        <TextField value={values.lbr} required label="Lbr Amt" name='lbr' onChange={handleChange} placeholder="Lbr Amt" />
        </div>
        <div>
        <TextField value={values.tval} label="Total Amount" name='tval' onChange={handleChange} />
        </div>
        </div>
    </div>

    <div>
        <Button variant="contained" onClick={addProduct}>Add</Button>
        
    </div>
   </div>
  )
}

export default Section4Manual