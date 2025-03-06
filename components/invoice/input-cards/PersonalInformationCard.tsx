import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
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
    <Card>
      <CardHeader>
        <CardTitle>1. Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gst">GST Number</Label>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pan">PAN</Label>
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
          />
        </div>
        <div className="space-y-2 col-span-3">
          <Label htmlFor="address">Address</Label>
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationCard;
