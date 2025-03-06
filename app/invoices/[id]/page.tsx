"use client"

import React from "react";
import { notFound } from "next/navigation";
import { CreateInvoiceComponent } from "@/components/create-invoice";
// import { InvoiceEditContext } from "@/context/invoiceEditContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

type InvoicePageProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default function InvoicePage({ params }: InvoicePageProps) {
  const { id } = React.use(params);
//   const { current }: any = React.useContext(InvoiceEditContext);
//   console.log("My current context", current);

  
  const [invoice, setInvoice] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchInvoice() {
      const fetchedInvoice = await getInvoiceById(id);
      if (!fetchedInvoice) {
        notFound(); // Show a 404 page if invoice not found
      } else {
        setInvoice(fetchedInvoice);
      }
    }
    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return null; // or a loading spinner
  }

  return (
    <CreateInvoiceComponent
      invoiceDataState={invoice}
      productDataState={invoice?.productTable}
      isUpdate={true}
    />
  );
}

// function to fetch invoice data
async function getInvoiceById(id: string) {
  //   if (!currentInvoice){
  try {
    const invoiceRef = doc(db, "invoice", id);
    const invoiceSnap = await getDoc(invoiceRef);

    if (!invoiceSnap.exists()) {
      return null; // Invoice not found
    }

    console.log(invoiceSnap.data());

    return { id: invoiceSnap.id, ...invoiceSnap.data() };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
  //   }

  //   return currentInvoice;
}
