"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AddDatePicker } from "./invoice/AddDatePicker";
import InvoiceDialog from "@/layout/InvoiceDialog";
import { useRouter } from "next/navigation";
import PersonalInformationCard from "./invoice/input-cards/PersonalInformationCard";
import ProductDetailsCard from "./invoice/input-cards/ProductDetailsCard";
import BillingCard from "./invoice/input-cards/BillingCard";
import NotesCard from "./invoice/input-cards/NotesCard";


const invoiceDataInitialObject = {
  id: "",
  invoiceNo: "",
  invoiceType: "ESTIMATE",
  name: "",
  phone: "",
  gstin: "",
  pan: "",
  address: "",
  discount: 0,
  netAmt: 0,
  cgst: 0,
  sgst: 0,
  totalAmt: 0,
  payment: 0,
  outstanding: 0,
  note: "",
  invoiceDate: new Date(),
};

export function CreateInvoiceComponent({
  invoiceDataState = invoiceDataInitialObject,
  productDataState = [],
  isUpdate = false,
}) {
  const router: any = useRouter();


  const [products, setProducts] = useState<any>(productDataState);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>(null);

  // State for form inputs
  const [invoiceData, setInvoiceData] = useState(invoiceDataState);
  const [invoiceDate, setInvoiceDate] = useState(() => {
    // Handle both Firestore Timestamp and Date objects
    if (invoiceDataState.invoiceDate) {
      const dateValue: any = invoiceDataState.invoiceDate;
      return typeof dateValue.toDate === 'function'
        ? dateValue.toDate()
        : dateValue;
    }
    return new Date();
  });

  const [cgst, setCgst] = useState(invoiceDataState.cgst)
  const [sgst, setSgst] = useState(invoiceDataState.sgst)
  const [discount, setDiscount] = useState(invoiceDataState.discount)
  const [netAmount, setNetAmount] = useState(invoiceDataState.netAmt)
  const [finalAmount, setFinalAmount] = useState(invoiceDataState.totalAmt)
  const [totalToShow, setTotalToShow] = useState(0)

  // Sync state when invoiceDataState changes (important for update mode)
  useEffect(() => {
    if (isUpdate && invoiceDataState && invoiceDataState.id) {
      setInvoiceData(invoiceDataState);
      setProducts(productDataState || []);
      setCgst(invoiceDataState.cgst || 0);
      setSgst(invoiceDataState.sgst || 0);
      setDiscount(invoiceDataState.discount || 0);
      setNetAmount(invoiceDataState.netAmt || 0);
      setFinalAmount(invoiceDataState.totalAmt || 0);

      // Handle invoice date
      if (invoiceDataState.invoiceDate) {
        const dateValue: any = invoiceDataState.invoiceDate;
        const date = typeof dateValue.toDate === 'function'
          ? dateValue.toDate()
          : dateValue;
        setInvoiceDate(date);
      }
    }
  }, [invoiceDataState, productDataState, isUpdate]);

  const updateInvoice = async () => {
    setLoading(true);
    try {
      setMessage(null);
      // Reference to the invoice document by its ID
      const invoiceRef = doc(db, "invoice", invoiceData.id);

      const updatedData = {
        invoiceType: invoiceData.invoiceType,
        address: invoiceData.address || "",
        cgst: cgst,
        sgst: sgst,
        discount: discount || 0,
        gstin: invoiceData.gstin || "",
        invoiceDate: invoiceDate,
        invoiceNo: invoiceData.invoiceNo || 0,
        name: invoiceData.name || "NO NAME GIVEN",
        phone: invoiceData.phone || "",
        netAmt: netAmount,
        pan: invoiceData.pan || "",
        payment: invoiceData.payment,
        totalAmt: finalAmount,
        productTable: products,
        note: invoiceData.note,
      };
      // Update the document with new data
      await updateDoc(invoiceRef, updatedData);

      setMessage("Invoice successfully updated!");

      // Redirect to invoices list after successful update
      setTimeout(() => {
        router.push("/invoices");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    console.log({
      invoiceData,
      products,
    });

    setLoading(true);
    try {
      setMessage(null);
      const docRef = await addDoc(collection(db, "invoice"), {
        invoiceType: invoiceData.invoiceType,
        address: invoiceData.address || "",
        cgst: cgst,
        sgst: sgst,
        discount: discount || 0,
        gstin: invoiceData.gstin || "",
        invoiceDate: invoiceDate,
        invoiceNo: invoiceData.invoiceNo || 0,
        name: invoiceData.name || "NO NAME GIVEN",
        phone: invoiceData.phone || "",
        netAmt: netAmount,
        pan: invoiceData.pan || "",
        payment: invoiceData.payment,
        totalAmt: finalAmount,
        productTable: products,
        note: invoiceData.note,
      });
      console.log("Document written with ID: ", docRef.id);
      setMessage("Invoice Created!");

      // Redirect to invoices list after successful creation
      setTimeout(() => {
        router.push("/invoices");
      }, 1500);
    } catch (error) {
      console.log(error);
      setMessage("Something Went Wrong, Check your Internet Connection!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto py-4 px-4">
        <form className="space-y-3">
          {isUpdate && invoiceDataState === null ? <div>Something went wrong!</div> : (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {isUpdate ? `Update Invoice #${invoiceData.invoiceNo}` : "Create New Invoice"}
                  </CardTitle>
                  <InvoiceDialog
                    invoiceData={invoiceData}
                    invoiceDate={invoiceDate}
                    products={products}
                    description={"Review your invoice before finalizing."}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {/* Invoice Header Info */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg border">
                  <div className="space-y-1">
                    <Label htmlFor="invoiceNo" className="text-xs font-medium">Invoice No.</Label>
                    <Input
                      id="invoiceNo"
                      type="number"
                      placeholder="Enter invoice number"
                      value={invoiceData.invoiceNo}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          invoiceNo: e.target.value,
                        })
                      }
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="invoiceDate" className="text-xs font-medium">Invoice Date</Label>
                    <AddDatePicker
                      selectedDate={invoiceDate}
                      setSelectedDate={setInvoiceDate}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="invoiceType" className="text-xs font-medium">Invoice Type</Label>
                    <Select
                      value={invoiceData.invoiceType}
                      onValueChange={(value) =>
                        setInvoiceData({ ...invoiceData, invoiceType: value })
                      }
                    >
                      <SelectTrigger id="invoiceType" className="h-9">
                        <SelectValue placeholder="Select invoice type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gold Tax Invoice">
                          Gold Tax Invoice
                        </SelectItem>
                        <SelectItem value="Silver Tax Invoice">
                          Silver Tax Invoice
                        </SelectItem>
                        <SelectItem value="Tax Invoice">Tax Invoice</SelectItem>
                        <SelectItem value="ESTIMATE">ESTIMATE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Personal Information */}
                <PersonalInformationCard invoiceData={invoiceData} setInvoiceData={setInvoiceData}/>

                {/* Product Details */}
                <ProductDetailsCard setDiscount={setDiscount} products={products} setProducts={setProducts} setInvoiceData={setInvoiceData} invoiceData={invoiceData} setFinalAmount={setFinalAmount} setNetAmount={setNetAmount} finalAmount={finalAmount} netAmount={netAmount} setTotalToShow={setTotalToShow} isUpdate={isUpdate}/>

                {/* Billing details */}
                <BillingCard cgst={cgst} sgst={sgst} discount={discount} setDiscount={setDiscount} setCgst={setCgst} setSgst={setSgst} invoiceData={invoiceData} setInvoiceData={setInvoiceData} setFinalAmount={setFinalAmount} setNetAmount={setNetAmount} finalAmount={finalAmount} netAmount={netAmount} totalToShow={totalToShow}/>

                {/* Notes detail */}
                <NotesCard invoiceData={invoiceData} setInvoiceData={setInvoiceData}/>

              </CardContent>


              <CardFooter className="flex justify-between items-center pt-4 pb-4 bg-slate-50 border-t">
                <div className="flex gap-2">
                  {!isUpdate ? (
                    <Button
                      type="button"
                      onClick={createInvoice}
                      disabled={loading}
                      className="px-6"
                    >
                      {loading ? "Creating..." : "Create Invoice"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={updateInvoice}
                      disabled={loading}
                      className="px-6"
                    >
                      {loading ? "Updating..." : "Update Invoice"}
                    </Button>
                  )}
                </div>

                {message && (
                  <p className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </CardFooter>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
