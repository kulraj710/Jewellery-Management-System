"use client"

import React, {useContext} from "react";
import { CreateInvoiceComponent } from "@/components/create-invoice";
import { InvoiceEditContext } from "@/context/invoiceEditContext";

const Page = () => {
  const { current }: any = useContext(InvoiceEditContext);
  console.log("----------------------------------------")
  console.log(current?.productTable)
  console.log("----------------------------------------")

  return <CreateInvoiceComponent invoiceDataState={current} productDataState={current?.productTable} isUpdate={true}/>;
};

export default Page;
