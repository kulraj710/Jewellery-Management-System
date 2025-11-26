import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    invoiceData: any,
    setInvoiceData: any,
}

const PersonalInformationCard = ({invoiceData, setInvoiceData }: Props) => {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={invoiceData.name}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                name: e.target.value,
              })
            }
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={invoiceData.phone}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                phone: e.target.value,
              })
            }
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="gst" className="text-xs font-medium">GST Number</Label>
          <Input
            id="gst"
            placeholder="Enter GST number"
            value={invoiceData.gstin}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                gstin: e.target.value,
              })
            }
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="pan" className="text-xs font-medium">PAN</Label>
          <Input
            id="pan"
            placeholder="Enter PAN"
            value={invoiceData.pan}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                pan: e.target.value,
              })
            }
            className="h-9"
          />
        </div>
        <div className="space-y-1 col-span-4">
          <Label htmlFor="address" className="text-xs font-medium">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter address"
            value={invoiceData.address}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                address: e.target.value,
              })
            }
            className="resize-none h-16"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationCard;
