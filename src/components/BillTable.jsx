import React from 'react'
import "../css/billTable.css"
import { numberWithComma } from '../helper/numberWithComma'

const BillTable = ({discount, setDiscount, netAmount, setNetAmount, cgst, setCgst, sgst, setSgst,payment, setPayment, totalAmount, setTotalAmount}) => {
  return (
    <table className="bill-info">
        <tbody>
    {(discount === '0' || discount === 0) ? null : <tr>
      <td className="label"><b>Discount</b></td>
      <td className="value">{discount}</td>
    </tr>}
    <tr>
      <td className="label"><b>Net Amount</b></td>
      <td className="value">{numberWithComma(netAmount)} &#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>CGST (1.50%)</b></td>
      <td className="value">{numberWithComma(cgst)} 	&#8377;</td>
    </tr>
    <tr>
      <td className="label"><b>SGST (1.50%)</b></td>
      <td className="value">{numberWithComma(sgst)} 	&#8377; </td>
    </tr>
    <tr className='total-amount'>
      <td className="label"><b>Total Amount</b></td>
      <td className="value bold">{numberWithComma(totalAmount)} 	&#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>Payment</b></td>
      <td className="value">{numberWithComma(payment)} 	&#8377; </td>
    </tr>
    <tr>
      <td className="label"><b>Bill Outstanding</b></td>
      <td className="value bold">{numberWithComma((totalAmount - payment).toFixed(2))} 	&#8377; </td>
    </tr>
    </tbody>
  </table>
  )
}

export default BillTable