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
      
      a.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    setData(a.sort((k, m) => m.invoiceNo - k.invoiceNo))
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
          <InvoiceTableMui rows={data} setRows={setData} getDataAgainExplicitly={getData}/>
        </div> :
          <div>
            <CircularProgress />
          </div>}
      </section>
    </div>
  )
}

export default Homepage
