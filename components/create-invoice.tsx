"use client";
import { useState } from "react";
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
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  const [cgst, setCgst] = useState(invoiceDataState.cgst)
  const [sgst, setSgst] = useState(invoiceDataState.sgst)
  const [discount, setDiscount] = useState(invoiceDataState.discount)
  const [netAmount, setNetAmount] = useState(invoiceDataState.netAmt)
  const [finalAmount, setFinalAmount] = useState(invoiceDataState.totalAmt)
  const [totalToShow, setTotalToShow] = useState(0)

  const updateInvoice = async () => {
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
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      setMessage(error.message);
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
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong, Check yout Internet Connection!");
    } finally {
      setInvoiceData(invoiceDataState);
      setProducts([]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form className="space-y-8">
          {isUpdate && invoiceDataState === null ? <div>Something went wrong!</div> : (
            <Card>
              <CardHeader>
                <CardTitle>{isUpdate ? `Update Invoice (${invoiceData.invoiceNo})` : "Create New Invoice"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNo">Invoice No.</Label>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <AddDatePicker
                      selectedDate={invoiceDate}
                      setSelectedDate={setInvoiceDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceType">Invoice Type</Label>
                    <Select
                      value={invoiceData.invoiceType}
                      onValueChange={(value) =>
                        setInvoiceData({ ...invoiceData, invoiceType: value })
                      }
                      // defaultValue="ESTIMATE"
                    >
                      <SelectTrigger id="invoiceType">
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


              <CardFooter className="flex justify-between">
                {!isUpdate ? (
                  <Button
                    type="button"
                    onClick={createInvoice}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Invoice"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={updateInvoice}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Invoice"}
                  </Button>
                )}

                <p>{message}</p>
                <InvoiceDialog
                  invoiceData={invoiceData}
                  invoiceDate={invoiceDate}
                  products={products}
                  description={"Review your invoice before finalizing."}
                />
              </CardFooter>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
