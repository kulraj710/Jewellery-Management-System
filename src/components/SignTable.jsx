import React from 'react'
import "../css/signTable.css"

const SignTable = () => {
  return (
    <div className='grid-container'>
        <div className="term">&nbsp; Terms & Conditions : </div>
        <div className="cert">Certified that particulars given above are true and correct</div>
        <div className="customer-sign">Customer Signatory</div>
        <div className="auth">
        <div className='vaibhav-head'>Vaibhav Jewellers</div>
        <div>Authorised Signatory</div>
        </div>
    </div>
  )
}

export default SignTable