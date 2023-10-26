import React, {useState} from "react";
import "../../css/form/formContainer.css";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate  } from "react-router-dom"

const FormContainer = ({
  sec1,
  setSec1,
  sec2,
  setSec2,
  sec3,
  setSec3,
  sec4,
  setSec4,
  sec5,
  setSec5,
  calculate,
  setCalculate,
  discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount 
}) => {


  const router = useNavigate() 
  const [isBackgroundNeeded, setIsBackgroundNeeded] = useState(false)

  const handlePrint = () => {
    // const a = document.getElementById("home-form")
    // const b = document.getElementById("invoice-img")
    // const InvoiceContainer = document.querySelector("img-container")

    // a.style.display = 'none'
    // if (!isBackgroundNeeded){
    //   b.style.display = 'none'
    // }
    // window.print() 
    router('/')
  }
  return (
    <div className="form-container">
      <h1 className="invoice-heading">New Invoice</h1>
      <div id="sec1-form">
        <div className="step">
          <div className="step-number">1</div>
        </div>
        <Section1 sec1={sec1} setSec1={setSec1} />
      </div>

    <hr className="hr-line" />

      <div id="sec2-form">
        <div className="step">
          <div className="step-number">2</div>
        </div>
        <Section2 sec2={sec2} setSec2={setSec2}/>
      </div>
      <hr className="hr-line" />
      <div id="sec3-form">
        <div className="step">
          <div className="step-number">3</div>
        </div>
        <Section3 sec3={sec3} setSec3={setSec3}/>
      </div>
      <hr className="hr-line" />
      <div id="sec4-form">
        <div className="step">
          <div className="step-number">4</div>
        </div>
        <Section4 sec4={sec4} setSec4={setSec4} calculate={calculate} setCalculate={setCalculate}/>
      </div>
      <hr className="hr-line" />
      <div id="sec5-form">
        <div className="step">
          <div className="step-number">5</div>
        </div>
        <Section5 calculate={calculate.tvalTotal} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/>
      </div>


        <div className="step">
        <div className="step-number">6</div>
<div style={{paddingLeft : '4rem', paddingBottom : '1.5rem'}}>

        <FormControlLabel value={isBackgroundNeeded} onChange={(e) => {setIsBackgroundNeeded(e.target.value)}} control={<Checkbox />} label="Background graphics" labelPlacement="end"/>
</div>
<div style={{paddingLeft : '4rem'}}>

        <Button variant="contained" onClick={handlePrint}>Print</Button>
</div>

      </div>
    </div>
  );
}

export default FormContainer;
