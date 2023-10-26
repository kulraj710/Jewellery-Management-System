import React, {useState} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Invoice from './components/Invoice'
import FormContainer from './components/TextFields/FormContainer'
import "./index.css"
import { format } from 'date-fns'
import CreateInvoice from './CreateInvoice'
import Homepage from './Homepage'
// import InvoicePrint from './components/InvoicePrint'

function App() {

  
  return (
    <div>
      <BrowserRouter>
        
            
           <Routes>
              <Route path="/create" element={<CreateInvoice />} />
              <Route path="/" element={<Homepage />} />
           </Routes>
         


      </BrowserRouter>
    </div>
  )
}

export default App