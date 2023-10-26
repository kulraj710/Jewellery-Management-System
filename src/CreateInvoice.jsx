import React, {useState, useEffect} from 'react'
import Invoice from './components/Invoice'
import FormContainer from './components/TextFields/FormContainer'
import "./index.css"
import { format } from 'date-fns'
import { collection, getDocs } from "firebase/firestore"
import {db} from "./firebase"

const CreateInvoice = () => {

const [data, setData] = useState([])

async function getData() {
    const querySnapshot = await getDocs(collection(db, "invoice"));
    let a = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data())
      a.push(doc.data())
    })
    setData(a)
    }

    useEffect(() => {
        getData()
    }, [])
    

  return (
   <div>
          {/* <div id='home-form'><FormContainer sec1={sec1} setSec1={setSec1} sec2={sec2} setSec2={setSec2} sec3={sec3} setSec3={setSec3} sec4={sec4} setSec4={setSec4} sec5={sec5} setSec5={setSec5} calculate={calculate} setCalculate={setCalculate} discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/></div> */}
          
          
          <div><Invoice sec1={{invoice : data[0].invoiceNo, date : data[0].invoiceDate}} sec2={{invoiceType : data[0].invoiceType}} sec3={{ name : data[0].name, phone : data[0].phone, address : data[0].address, gstin : data[0].gstin, pan : data[0].pan }} sec4={data[0].productTable} sec5={{  }} discount={data[0].discount} netAmount={data[0].netAmt} cgst={data[0].cgst} sgst={data[0].sgst} payment={data[0].payment} totalAmount={data[0].totalAmt} /></div>
    </div>
  )
}

export default CreateInvoice