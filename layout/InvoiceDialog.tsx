import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Invoice from "../components/invoice/Invoice";

const InvoiceDialog = ({
  invoiceData,
  invoiceDate,
  products,
  triggerButton = <Button variant="outline">Preview Invoice</Button>,
  title = "Invoice Preview",
  description = "",
}: any) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[870px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Ensure the Invoice component content does not cause overflow */}
          <Invoice
            invoiceData={invoiceData}
            invoiceDate={invoiceDate}
            productData={products}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
