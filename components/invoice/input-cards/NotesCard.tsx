import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const NotesCard = ({invoiceData, setInvoiceData} : any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>4. Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="This will appear on your invoice"
          value={invoiceData.note}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, note: e.target.value })
          }
        />
      </CardContent>
    </Card>
  );
};

export default NotesCard;
