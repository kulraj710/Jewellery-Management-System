"use client"

import React, { createContext, useState } from "react";


export const InvoiceEditContext = createContext(null);

export const InvoiceEditProvider = ({ children }: any) => {
  const [current, setCurrentInvoice] = useState<any>(null);

  return (
    <InvoiceEditContext.Provider value={{ current, setCurrentInvoice } as any}>
      {children}
    </InvoiceEditContext.Provider>
  );
};