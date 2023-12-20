import React, { useState } from "react";
import "../../css/form/formContainer.css";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Button from "@mui/material/Button";
import { parse } from "date-fns";
import { useNavigate } from "react-router-dom"
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Section4Manual from "./Section4Manual";
import Section5Manual from "./section5Manual";
import TextArea from './TextArea';


const FormContainer = ({
  isManualValues,
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
  discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst, payment, setPayment, totalAmount, setTotalAmount,
  setNote, note
}) => {

  const handleTextChange = (event) => {
    setNote(`${event.target.value}`);
  }
  console.log(calculate)
  const router = useNavigate()
  const [loading, setLoading] = useState(false)

  const handlePrint = async () => {
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, "invoice"), {
        invoiceType: sec2.invoiceType,
        address: sec3.address || "",
        cgst: cgst,
        sgst: sgst,
        discount: discount || 0,
        gstin: sec3.gstin || "",
        invoiceDate: parse(sec1.date, "dd-MM-yyyy", new Date()),
        invoiceNo: sec1.invoice || 0,
        name: sec3.name || "NO NAME GIVEN",
        phone: sec3.phone || "-",
        netAmt: netAmount,
        pan: sec3.pan || "-",
        payment: payment,
        totalAmt: totalAmount,
        productTable: sec4,
        note: note

      })
      console.log("Document written with ID: ", docRef.id)
      setLoading(false)
      router('/')

    } catch (error) {
      setLoading(false)
      console.log(error)
      alert("Something Went Wrong, Check yout Internet Connection!")
    }
  }
  return (
    <div className="form-container">
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
        <Section2 sec2={sec2} setSec2={setSec2} />
      </div>
      <hr className="hr-line" />
      <div id="sec3-form">
        <div className="step">
          <div className="step-number">3</div>
        </div>
        <Section3 sec3={sec3} setSec3={setSec3} />
      </div>
      <hr className="hr-line" />
      <div id="sec4-form">
        <div className="step">
          <div className="step-number">4 </div>
          {isManualValues ? "(Auto Fill Values = OFF)" : null}
        </div>
        {isManualValues ? <Section4Manual sec4={sec4} setSec4={setSec4} /> : <Section4 sec4={sec4} setSec4={setSec4} calculate={calculate} setCalculate={setCalculate} />}
      </div>
      <hr className="hr-line" />
      <div id="sec5-form">
        <div className="step">
          <div className="step-number">5</div>
          {isManualValues ? "(Auto Fill Values = OFF)" : null}
        </div>
        {isManualValues ? <Section5Manual calculate={calculate.tvalTotal} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/> : <Section5 calculate={calculate.tvalTotal} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount} sec4={sec4}/>}
      </div>


    <div className="note-1">

    <div className="step">
        <div className="step-number">6</div>
        <div style={{ paddingBottom: '2rem' }}>

        <div>
      <h3>Notes</h3>
          <TextArea label="Type something..." onChange={handleTextChange} value={note} />
      </div>
        </div>

      </div>
    </div>


      <div className="step">
        <div className="step-number">7</div>
        <div style={{ paddingLeft: '4rem' }}>

          <Button variant="contained" onClick={handlePrint}>{!loading ? "Create Invoice" : "creating..."}</Button>
        </div>

      </div>
    </div>
  );
}

export default FormContainer;
