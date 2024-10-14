import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const DeleteInvoiceButton = ({ setInvoices, invoices, invoice }: any) => {
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteInvoice = async () => {
    if (invoiceToDelete) {
      try {
        await deleteDoc(doc(db, "invoice", invoiceToDelete.id));
        setInvoices(
          invoices.filter((invoice: any) => invoice.id !== invoiceToDelete.id)
        );
        // setTotalEntries(totalEntries - 1);
        setInvoiceToDelete(null);
      } catch (error) {
        console.error("Error deleting invoice:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-600"
          onClick={() => {
            setInvoiceToDelete(invoice);
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            invoice and remove the data from the servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteInvoice}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceButton;
