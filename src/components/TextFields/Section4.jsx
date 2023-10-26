import React, {useState, useEffect} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Section4 = ({sec4, setSec4, calculate, setCalculate}) => {
    const [values, setValues] = useState({})
    const [currentTval, setCurrentTval] = useState(0)
    const [currentAmt, setCurrentAmt] = useState(0)

    useEffect(() => {
        calculateAutoFillValue()
      }, [values.amt, values.lbr]);
    useEffect(() => {
        calculateAutoFillValue1()
      }, [values.net, values.rate]);

      const calculateAutoFillValue = () => {
        const num1 = parseFloat(values.amt);
        const num2 = parseFloat(values.lbr);
        
        if (!isNaN(num1) && !isNaN(num2)) {
            const b = Math.round((num1 + num2) * 0.97)
            setCurrentTval(b)
            setValues(prev => ({...prev, tval : b}))
        } else {
            setCurrentTval(0);
        }
      }

      const calculateAutoFillValue1 = () => {
        const num1 = parseFloat(values.rate);
        const netw = parseFloat(values.net)
        
        if(!isNaN(netw) && !isNaN(num1)){
          setCurrentAmt((num1 * netw))
          setValues(prev => ({...prev, amt : (num1 * netw)}))
        }
         else {
            setCurrentAmt(0)
        }
      }


    function calculateTotalTval(arr) {
        let total = 0;
        for (const val of arr) {
            total += parseFloat(val.tval);
        }
        return total;
      }
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
        let total_to_show = calculateTotalTval([...sec4, values])
        setCalculate({tvalTotal : total_to_show})
        console.log(total_to_show)
        setValues({sno: '', pd: '', hsn: '', pcs : '', gr : '', net : '', rate : '', amt : '', lbr : '', tval : 0})
      }
  return (
   <div>
     <div>
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
        <TextField disabled value={currentAmt} required label="Amount" name='amt' onChange={handleChange} placeholder="Amount" type='number' />
        </div>
        </div>

        <div style={styles}>

        <div>
        <TextField value={values.lbr} required label="Lbr Amt" name='lbr' onChange={handleChange} placeholder="Lbr Amt" />
        </div>
        <div>
        <TextField disabled value={(currentTval).toFixed(2)} required label="Total Amount" name='tval' onChange={handleChange} />
        </div>
        </div>
    </div>

    <div>
        <Button variant="contained" onClick={addProduct}>Add</Button>
        
    </div>
   </div>
  )
}

export default Section4