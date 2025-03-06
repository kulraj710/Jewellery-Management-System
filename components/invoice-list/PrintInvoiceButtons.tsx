"use client"

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import Invoice from "../invoice/Invoice";
import { useReactToPrint } from "react-to-print";

const PrintInvoiceButtons = ({ invoiceData, invoiceDate, products }: any) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState(true);

  // Updated useReactToPrint hook options: note "contentRef" is used instead of "content"
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    pageStyle: `
    @media print {
      body {
        font-weight: normal !important;
      }
    }
  `,
    onBeforePrint: () =>
      new Promise((resolve) => {
        // Allow state update (like bgImage) to apply before printing
        setTimeout(resolve, 0);
      }),
  });

  const handlePrintWithBgImage = (shouldShowBgImage: boolean) => {
    setBgImage(shouldShowBgImage);
    // Small timeout ensures the state update is applied before printing
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  return (
    <>
      <Button
        onClick={() => handlePrintWithBgImage(false)}
        variant="outline"
        size="sm"
      >
        <Printer className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => handlePrintWithBgImage(true)}
        variant="outline"
        size="sm"
      >
        <FileText className="h-4 w-4" />
      </Button>

      {/* Invoice is hidden on screen but available for printing */}
      <div id="print-invoice-div" style={{ display: "none" }}>
        <Invoice
          ref={contentRef}
          productData={products}
          invoiceDate={invoiceDate}
          invoiceData={invoiceData}
          bgImage={bgImage}
        />
      </div>
    </>
  );
};

export default PrintInvoiceButtons;
