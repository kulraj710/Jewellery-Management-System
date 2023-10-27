import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import CreateInvoice from './CreateInvoice'
import Homepage from './Homepage'

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