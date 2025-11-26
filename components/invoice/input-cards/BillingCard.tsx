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

  const calculateValuesWithPercent = (val: any = "") => {
    setCgst(0);
    setSgst(0);
    setNetAmount(0);
    setFinalAmount(0);
  
    // Ensure `val` is a string
    const valStr = String(val).trim(); 
  
    // Parse the discount input as a float
    const discountValue = parseFloat(valStr) || 0;
    let netAmountValue;
  
    if (!valStr.endsWith("%")) {
      // Calculate the net amount
      netAmountValue = totalToShow - discountValue;
    } else {
      netAmountValue = totalToShow - (totalToShow * (discountValue / 100));
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
  };
  

useEffect(() => {
  calculateValuesWithPercent(discount);
}, [invoiceData, totalToShow]);


const handleDiscountChange = (event : any) => {
  const newValue = event.target.value;
      setDiscount(newValue);
      calculateValuesWithPercent(newValue);
};

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
          Billing & Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {/* Calculation Fields */}
          <div className="space-y-1">
            <Label htmlFor="discount" className="text-xs font-medium">Discount</Label>
            <Input
              id="discount"
              placeholder="e.g., 100 or 10%"
              value={discount}
              onChange={handleDiscountChange}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="netAmount" className="text-xs font-medium">Net Amount</Label>
            <Input
              id="netAmount"
              type="number"
              placeholder="Net amount"
              value={netAmount}
              readOnly
              className="h-9 bg-gray-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cgst" className="text-xs font-medium">CGST (1.5%)</Label>
            <Input
              id="cgst"
              type="number"
              placeholder="CGST"
              value={cgst}
              readOnly
              className="h-9 bg-gray-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sgst" className="text-xs font-medium">SGST (1.5%)</Label>
            <Input
              id="sgst"
              type="number"
              placeholder="SGST"
              value={sgst}
              readOnly
              className="h-9 bg-gray-50"
            />
          </div>
        </div>

        {/* Payment Summary Section */}
        <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-1">
            <Label htmlFor="totalAmount" className="text-xs font-semibold text-blue-900">Total Amount</Label>
            <Input
              id="totalAmount"
              type="number"
              placeholder="Total amount"
              value={finalAmount}
              readOnly
              className="h-9 bg-white font-semibold text-blue-900 border-blue-300"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="payment" className="text-xs font-medium text-blue-900">Payment Received</Label>
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
              className="h-9 bg-white border-blue-300"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="outstanding" className="text-xs font-semibold text-blue-900">Outstanding</Label>
            <Input
              id="outstanding"
              type="number"
              readOnly
              placeholder="Outstanding amount"
              value={(finalAmount - invoiceData.payment).toFixed(2)}
              className="h-9 bg-white font-semibold text-red-600 border-blue-300"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingCard;

