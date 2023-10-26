import React from 'react'
import "../css/billTable.css"


const BillTable = ({discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount}) => {
  return (
    <table className="bill-info">
        <tbody>
    {(discount === '0') ? null : <tr>
      <td className="label"><b>Discount</b></td>
      <td className="value">{discount}</td>
    </tr>}
    <tr>
      <td className="label"><b>Net Amount</b></td>
      <td className="value">{netAmount} &#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>CGST (1.50%) :</b></td>
      <td className="value" contentEditable>{cgst} 	&#8377;</td>
    </tr>
    <tr>
      <td className="label"><b>SGST (1.50%)</b></td>
      <td className="value">{sgst} 	&#8377; </td>
    </tr>
    <tr className='total-amount'>
      <td className="label"><b>Total Amount</b></td>
      <td className="value bold">{totalAmount} 	&#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>Payment</b></td>
      <td className="value">{payment} 	&#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>Bill OutStanding</b></td>
      <td className="value bold">{(totalAmount - payment).toFixed(2)} 	&#8377; </td>
    </tr>
    </tbody>
  </table>
  )
}

export default BillTable