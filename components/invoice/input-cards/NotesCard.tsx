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
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add any additional notes or terms that will appear on your invoice..."
          value={invoiceData.note}
          onChange={(e) =>
            setInvoiceData({ ...invoiceData, note: e.target.value })
          }
          className="resize-none h-20 text-sm"
        />
      </CardContent>
    </Card>
  );
};

export default NotesCard;
