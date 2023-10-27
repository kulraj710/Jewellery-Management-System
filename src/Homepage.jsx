import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import InvoiceTableMui from './components/Homepage/InvoiceTableMui'
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from './components/Homepage/Navbar';

const Homepage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  async function getData() {
    setLoading(true)
    const q = query(collection(db, "invoice"), orderBy("invoiceDate", "desc"))
    const querySnapshot = await getDocs(q);
    let a = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data())
      a.push(doc.data())
    })
    setData(a)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])




  return (
    <div>
      <section>
        <Navbar/>
      </section>
      <section>
        {!loading ? <div>
          <InvoiceTableMui rows={data} />
        </div> :
          <div>
            <CircularProgress />
          </div>}
      </section>
    </div>
  )
}

export default Homepage
{/* <Invoice sec1={{invoice : data[0].invoiceNo, date : format(data[0].invoiceDate.toDate(), "dd-MM-yyyy")}} sec2={{invoiceType : data[0].invoiceType}} sec3={{ name : data[0].name, phone : data[0].phone, address : data[0].address, gstin : data[0].gstin, pan : data[0].pan }} sec4={data[0].productTable} discount={data[0].discount} netAmount={data[0].netAmt} cgst={data[0].cgst} sgst={data[0].sgst} payment={data[0].payment} totalAmount={data[0].totalAmt}/> */ }