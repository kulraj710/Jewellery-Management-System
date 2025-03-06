"use client";

import React, {useState, useEffect} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const BillingCard = ({invoiceData, setInvoiceData, cgst, sgst, setSgst, setCgst, discount, setDiscount, netAmount, setNetAmount, finalAmount, setFinalAmount, totalToShow} : any) => {

  const calculateValuesWithPercent = (val : any) => {
    setCgst(0)
    setSgst(0)
    setNetAmount(0)
    setFinalAmount(0)
      
  // Parse the discount input as a float
  const discountValue = parseFloat(val) || 0;
  let netAmountValue;
  if (!val.endsWith('%')){
      // Calculate the net amount
      netAmountValue = totalToShow - discountValue
  }
  else{
      netAmountValue = totalToShow - (totalToShow * (discountValue/100));
  }

  // Calculate CGST and SGST (1.5% of net amount)
  const cgstValue = (netAmountValue * 1.5) / 100;
  const sgstValue = (netAmountValue * 1.5) / 100;

  // Calculate the total amount
  const totalAmountValue = netAmountValue + cgstValue + sgstValue;

  // Update state with the calculated values
  setNetAmount(netAmountValue.toFixed(2));
  setCgst(cgstValue.toFixed(2));
  setSgst(sgstValue.toFixed(2));
  setFinalAmount(totalAmountValue.toFixed(2));
}

useEffect(() => {
  calculateValuesWithPercent(discount);
}, [invoiceData, totalToShow]);


const handleDiscountChange = (event : any) => {
  const newValue = event.target.value;
      setDiscount(newValue);
      calculateValuesWithPercent(newValue);
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Billing</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount">Discount</Label>
          <Input
            id="discount"
            placeholder="Enter discount"
            value={discount}
            onChange={handleDiscountChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="netAmount">Net Amount</Label>
          <Input
            id="netAmount"
            type="number"
            placeholder="Net amount"
            value={netAmount}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cgst">CGST</Label>
          <Input
            id="cgst"
            type="number"
            placeholder="CGST"
            value={cgst}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sgst">SGST</Label>
          <Input
            id="sgst"
            type="number"
            placeholder="SGST"
            value={sgst}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input
            id="totalAmount"
            type="number"
            placeholder="Total amount"
            value={finalAmount}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment">Payment</Label>
          <Input
            id="payment"
            type="number"
            placeholder="Enter payment"
            value={invoiceData.payment}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                payment: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="outstanding">Outstanding</Label>
          <Input
            id="outstanding"
            type="number"
            readOnly
            placeholder="Outstanding amount"
            value={(finalAmount - invoiceData.payment).toFixed(2)}

          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingCard;

