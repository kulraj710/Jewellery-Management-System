import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import InvoiceDialog from "@/layout/InvoiceDialog";


const ViewInvoiceButton = ({invoiceData, invoiceDate, products} : any) => {
  const triggerButton = (
    <Button variant="outline" size="sm">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return <InvoiceDialog 
  triggerButton={triggerButton}
  title={"Invoice"}
  description={"Review Invoice"}
  invoiceData={invoiceData}
  invoiceDate={invoiceDate}
  products={products}
  />
};

export default ViewInvoiceButton;
