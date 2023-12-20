import React from 'react'
// import img from "../assets/vaibhav.jpg"
import "../css/invoice.css"
import ProductTable from './ProductTable'
import BillTable from './BillTable'
import SignTable from './signTable'

const InvoiceWithoutBg = React.forwardRef(({note, sec1, sec2, sec3, sec4,sec5, calculate, discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount}, ref) => {  
  return (
    <div ref={ref} className='printable-content' id='get-print'>
      <div className='img-container'>
      {/* {addBackgroundInPrint ? <img className='invoice-img' id='invoice-img' src={img} alt="Image" /> : null} */}

      <div className='content-container'>
        <section className='section1'>
          <h2 className='invoice_no'>Invoice No : <span>{sec1.invoice}</span></h2>
          <h2 className='invoice_date'>Invoice Date : <span>{sec1.date}</span></h2>
        </section>
        <section className='section2'>
          <h2 className='tax_head'>{sec2.invoiceType}</h2>
          
          <table className="contact-info">
            <tbody>
      <tr className='personal'>
        <td className="label"><b>Name:</b></td>
        <td className="value" style={{width : '40%'}}>{sec3.name} </td>
        <td className="value">Phone  : {sec3.phone} </td>
      </tr>
      </tbody>
    </table>

          <table className="contact-info" id='add-table'>
            <tbody>
      <tr>
        <td className="label"><b>Address:</b></td>
        <td className="value">{sec3.address} </td>
      </tr>
      </tbody>
      </table>
          <table className="contact-info" id='gst-table'>
            <tbody>
      <tr>
        <td className="label"><b>GSTIN:</b></td>
        <td className="value">{sec3.gstin} </td>
        <td className="value" style={{width : '43%'}}><span>PAN No : <span>{sec3.pan}</span></span> </td>
      </tr>
      </tbody>
      </table>

        </section>
      
        <section className='section3'>
        <div><ProductTable sec4={sec4}/></div>
        {/* <div>
          <div className='total-row'>
          Total : {calculate.tvalTotal}/- &#8377; 
          </div>
        </div> */}

        {/* <section className="section4"> */}
          <div className='section4-flex'>
          <div className='notes'>
             Notes : {note}
          </div>
          <div>
          <BillTable discount={discount} setDiscount={setDiscount} netAmount={netAmount} setNetAmount={setNetAmount} cgst={cgst} setCgst={setCgst} sgst={sgst} setSgst={setSgst} payment={payment} setPayment={setPayment} totalAmount={totalAmount} setTotalAmount={setTotalAmount}/>
          </div>
          </div>
        </section>

        <section className='section5'>
          <SignTable/>
        </section>
      </div>
      </div>
      </div>
  )
})

export default InvoiceWithoutBg