import React, {useState} from 'react'
import Invoice from './components/Invoice'
import FormContainer from './components/TextFields/FormContainer'
import "./index.css"
import { format } from 'date-fns'
import Button from "@mui/material/Button";


const CreateInvoice = () => {

const [sec1, setSec1] = useState({ invoice : 0, date : format(new Date(), "dd-MM-yyyy") })
  const [sec2, setSec2] = useState({invoiceType : "Tax Invoice"})
  const [sec3, setSec3] = useState({})
  const [sec4, setSec4] = useState([])
  const [sec5, setSec5] = useState({})
  const [calculate, setCalculate] = useState(0);
  const [discount, setDiscount] = useState('');
  const [netAmount, setNetAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [payment, setPayment] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  return (
    <>
    <div style={{display : 'flex', justifyContent : 'space-between', padding : '1rem', marginBottom : '20px', borderBottom : '2px solid lightgrey', position : 'sticky', top : '0', zIndex : '200'}}>
        <div><h1 className="invoice-heading">New Invoice</h1></div>
        <div><Button variant="outlined" href="/">Go to Home</Button></div>
      </div>
   <div id='main-container'>
          <div id='home-form'><FormContainer sec1={sec1} setSec1={setSec1} sec2={sec2} setSec2={setSec2} sec3={sec3} setSec3={setSec3} sec4={sec4} setSec4={setSec4} sec5={sec5} setSec5={setSec5} calculate={calculate} setCalculate={setCalculate} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/></div>
          
          <div id='invoice-in-createInvoice'><Invoice sec1={sec1} setSec1={setSec1} sec2={sec2} setSec2={setSec2} sec3={sec3} setSec3={setSec3} sec4={sec4} setSec4={setSec4} sec5={sec5} setSec5={setSec5} calculate={calculate} setCalculate={setCalculate} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount} /></div>
    </div>
    </>
  )
}

export default CreateInvoice