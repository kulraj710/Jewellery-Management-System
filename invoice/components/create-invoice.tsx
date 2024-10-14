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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pencil, Trash2 } from "lucide-react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AddDatePicker } from "./invoice/AddDatePicker";
import Navbar from "@/layout/Navbar";
import InvoiceDialog from "@/layout/InvoiceDialog";
import { usePathname, useRouter } from "next/navigation";

const newProductInitialObject = {
  // id: 1,
  // productName: "",
  // hsnCode: "",
  // pcs: 0,
  // grWt: 0,
  // netWt: 0,
  // rate: 0,
  // amount: 0,
  // lbrAmt: 0,
  // huidAmt: 0,
  // oCharge: 0,
  // totalAmount: 0,
  sno: 1,
  pd: "",
  hsn: "",
  pcs: 0,
  gr: 0,
  net: 0,
  rate: 0,
  amt: 0,
  lbr: 0,
  huid: 0,
  ochrg: 0,
  tval: 0,
};

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
  const pathname: any = usePathname();

  console.log(invoiceDataState);
  useEffect(() => {
    if (isUpdate && invoiceDataState == null) {
      router.push("/"); // Redirect to home if currentInvoice is null
    }
  }, []);

  const [products, setProducts] = useState<any>(productDataState);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState(newProductInitialObject);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>(null);

  // State for form inputs
  const [invoiceData, setInvoiceData] = useState(invoiceDataState);
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  const addProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map((p: any) => (p.id === editingProduct.id ? newProduct : p))
      );
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setNewProduct({
      sno: Date.now() + 1,
      pd: "",
      hsn: "",
      pcs: 0,
      gr: 0,
      net: 0,
      rate: 0,
      amt: 0,
      lbr: 0,
      huid: 0,
      ochrg: 0,
      tval: 0,
    });
  };

  const editProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  const deleteProduct = (id: any) => {
    setProducts(products.filter((p: any) => p.id !== id));
  };

  const cancelProductEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      sno: Date.now() + 1,
      pd: "",
      hsn: "",
      pcs: 0,
      gr: 0,
      net: 0,
      rate: 0,
      amt: 0,
      lbr: 0,
      huid: 0,
      ochrg: 0,
      tval: 0,
    });
  };

  const updateInvoice = async () => {
    try {
      setMessage(null);
      // Reference to the invoice document by its ID
      const invoiceRef = doc(db, "invoice", invoiceData.id);

      const updatedData = {
        invoiceType: invoiceData.invoiceType,
        address: invoiceData.address || "",
        cgst: invoiceData.cgst,
        sgst: invoiceData.sgst,
        discount: invoiceData.discount || 0,
        gstin: invoiceData.gstin || "",
        invoiceDate: invoiceDate,
        invoiceNo: invoiceData.invoiceNo || 0,
        name: invoiceData.name || "NO NAME GIVEN",
        phone: invoiceData.phone || "-",
        netAmt: invoiceData.netAmt,
        pan: invoiceData.pan || "-",
        payment: invoiceData.payment,
        totalAmt: invoiceData.totalAmt,
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
        cgst: invoiceData.cgst,
        sgst: invoiceData.sgst,
        discount: invoiceData.discount || 0,
        gstin: invoiceData.gstin || "",
        invoiceDate: invoiceDate,
        invoiceNo: invoiceData.invoiceNo || 0,
        name: invoiceData.name || "NO NAME GIVEN",
        phone: invoiceData.phone || "-",
        netAmt: invoiceData.netAmt,
        pan: invoiceData.pan || "-",
        payment: invoiceData.payment,
        totalAmt: invoiceData.totalAmt,
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
          {isUpdate && invoiceDataState === null ? null : (
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

                <Card>
                  <CardHeader>
                    <CardTitle>2. Product Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="product_name">Product Name</Label>
                        <Input
                          placeholder="Product Name"
                          id="product_name"
                          value={newProduct.pd}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              pd: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hsn_code">HSN Code</Label>
                        <Input
                          id="hsn_code"
                          placeholder="HSN Code"
                          value={newProduct.hsn}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              hsn: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="psc">Psc</Label>
                        <Input
                          type="number"
                          id="psc"
                          placeholder="Pcs"
                          value={newProduct.pcs}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              pcs: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gr_wt">Gr Wt</Label>
                        <Input
                          type="number"
                          id="gr_wt"
                          placeholder="Gr Wt"
                          value={newProduct.gr}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              gr: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="net_wt">Net Wt</Label>
                        <Input
                          type="number"
                          placeholder="Net Wt"
                          value={newProduct.net}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              net: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate</Label>
                        <Input
                          id="rate"
                          type="number"
                          placeholder="Rate"
                          value={newProduct.rate}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              rate: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amt">Amount</Label>
                        <Input
                          id="amt"
                          type="number"
                          placeholder="Amount"
                          value={newProduct.amt}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              amt: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lbr_amt">Lbr Amt</Label>
                        <Input
                          id="lbr_amt"
                          type="number"
                          placeholder="Lbr Amt"
                          value={newProduct.lbr}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              lbr: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product_name">Huid Amt</Label>
                        <Input
                          type="number"
                          placeholder="Huid Amt"
                          value={newProduct.huid}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              huid: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="o_charge">O. Charge</Label>
                        <Input
                          id="o_charge"
                          type="number"
                          placeholder="O. Charge"
                          value={newProduct.ochrg}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              ochrg: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="total_amt">Total Amount</Label>
                        <Input
                          id="total_amt"
                          type="number"
                          placeholder="Total Amount"
                          value={newProduct.tval}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              tval: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={addProduct}
                        style={{ marginTop: "2rem" }}
                      >
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>

                      {editingProduct ? (
                        <Button
                          type="button"
                          className="bg-red-500"
                          onClick={cancelProductEdit}
                        >
                          Discard Edit
                        </Button>
                      ) : null}
                    </div>
                    {products.length > 0 && (
                      <Table className="border-2 mt-5">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Net Wt</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product: any) => (
                            <TableRow key={product.id} className="bg-gray-100">
                              <TableCell>{product.pd}</TableCell>
                              <TableCell>{product.net}</TableCell>
                              <TableCell>{product.tval}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => editProduct(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3. Billing</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="Enter discount"
                        value={invoiceData.discount}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            discount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="netAmount">Net Amount</Label>
                      <Input
                        id="netAmount"
                        type="number"
                        placeholder="Net amount"
                        value={invoiceData.netAmt}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            netAmt: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgst">CGST</Label>
                      <Input
                        id="cgst"
                        type="number"
                        placeholder="CGST"
                        value={invoiceData.cgst}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            cgst: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sgst">SGST</Label>
                      <Input
                        id="sgst"
                        type="number"
                        placeholder="SGST"
                        value={invoiceData.sgst}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            sgst: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        placeholder="Total amount"
                        value={invoiceData.totalAmt}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            totalAmt: Number(e.target.value),
                          })
                        }
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
                        disabled
                        placeholder="Outstanding amount"
                        value={(
                          invoiceData.totalAmt - invoiceData.payment
                        ).toFixed(2)}
                      />
                    </div>
                  </CardContent>
                </Card>

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
