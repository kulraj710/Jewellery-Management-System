import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import {Pencil} from "lucide-react";
import { InvoiceEditContext } from "@/context/invoiceEditContext";
import { useRouter } from "next/navigation";


const EditInvoiceButton = ({currentInvoice} : any) => {
    
    const router = useRouter();
    const { current, setCurrentInvoice } : any = useContext(InvoiceEditContext)

    console.log(current)
    const handleEdit = () => {
        setCurrentInvoice(currentInvoice)
        router.push("/invoice-edit")
    }
  return (
    <Button onClick={handleEdit} variant="outline" size="sm">
      <Pencil className="h-4 w-4" />
    </Button>
  );
};

export default EditInvoiceButton;
