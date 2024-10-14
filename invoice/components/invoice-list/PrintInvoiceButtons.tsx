import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import Invoice from "../invoice/Invoice";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

const PrintInvoiceButtons = ({ invoiceData, invoiceDate, products }: any) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [bgImage, setBgImage] = useState(true);

  // Function to handle printing with background image visibility
  const handlePrintWithBgImage = async (shouldShowBgImage: boolean, handlePrint: Function) => {
    setBgImage(shouldShowBgImage); // Update the bgImage state
    setTimeout(() => {
      handlePrint(); // Wait for the state to update, then call handlePrint
    }, 0); // Short delay to ensure the state change applies before printing
  };

  return (
    <>
      <ReactToPrint content={() => contentRef.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button
              onClick={() => handlePrintWithBgImage(false, handlePrint)} // Set bgImage to true for this button
              variant="outline"
              size="sm"
            >
              <Printer className="h-4 w-4" />
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>

      <ReactToPrint content={() => contentRef.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button
              onClick={() => handlePrintWithBgImage(true, handlePrint)} // Set bgImage to false for this button
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>

      {/* Use CSS to hide the invoice only on screen, but show it when printing */}
      <div id="print-invoice-div" style={{ display: "none" }}>
        <Invoice
          ref={contentRef}
          productData={products}
          invoiceDate={invoiceDate}
          invoiceData={invoiceData}
          bgImage={bgImage} // Pass the bgImage state to control the background image
        />
      </div>
    </>
  );
};

export default PrintInvoiceButtons;
