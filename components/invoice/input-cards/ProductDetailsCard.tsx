"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const newProductInitialObject: any = {
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
  id: undefined,
};

const ProductDetailsCard = ({
  products,
  setProducts,
  setInvoiceData,
  invoiceData,
  setDiscount,
  setTotalToShow,
  isUpdate
}: any) => {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState(newProductInitialObject);

  useEffect(() => {
    calculateAutoFillValue();
  }, [newProduct.amt, newProduct.lbr, newProduct.huid, newProduct.ochrg]);
  useEffect(() => {
    calculateAutoFillValue1();
  }, [newProduct.net, newProduct.rate]);

  useEffect(() => {
    if (isUpdate && products.length > 0){
      let tval = calculateTotalTval(products);
      setTotalToShow(tval);
    }
  }, [isUpdate, products])

  const calculateAutoFillValue = () => {
    const amt = parseFloat((newProduct.amt ?? 0).toString());
    const lbr = parseFloat((newProduct.lbr ?? 0).toString());
    const huid = parseFloat((newProduct.huid ?? 0).toString());
    const ochrg = parseFloat((newProduct.ochrg ?? 0).toString());

    if (!isNaN(amt) && !isNaN(lbr) && !isNaN(huid) && !isNaN(ochrg)) {
      const b = Math.round(amt + lbr + huid + ochrg);
      // setNetAmount(b);
      setNewProduct((prev: any) => ({ ...prev, tval: b }));
    }
  };
  const calculateAutoFillValue1 = () => {
    const num1 = parseFloat((newProduct.rate ?? 0).toString());
    const netw = parseFloat((newProduct.net ?? 0).toString());

    if (!isNaN(netw) && !isNaN(num1)) {
      const val = Math.round(num1 * netw);
      // setNetAmount(val);
      setNewProduct((prev: any) => ({ ...prev, amt: val }));
    } else {
      // setNetAmount(0);
    }
  };

  function calculateTotalTval(arr: any) {
    let total = 0;
    for (const val of arr) {
      total += parseFloat((val.tval ?? 0).toString());
    }
    return total;
  }

  const addProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map((p: any) =>
        p.id === editingProduct.id ? newProduct : p
      );
      setProducts(updatedProducts);
      let tval = calculateTotalTval(updatedProducts);
      setTotalToShow(tval);
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      let tval = calculateTotalTval([
        ...products,
        { ...newProduct, id: Date.now() },
      ]);
      // setNetAmount(tval);
      setTotalToShow(tval);
      // setCurrentAmt(currentAmt + newProduct.amt);
      setInvoiceData({ ...invoiceData });
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
      id: undefined,
    });
  };

  const editProduct = (product: any) => {
    setEditingProduct(product);
    // Ensure all properties exist with default values
    setNewProduct({
      sno: product.sno ?? 1,
      pd: product.pd ?? "",
      hsn: product.hsn ?? "",
      pcs: product.pcs ?? 0,
      gr: product.gr ?? 0,
      net: product.net ?? 0,
      rate: product.rate ?? 0,
      amt: product.amt ?? 0,
      lbr: product.lbr ?? 0,
      huid: product.huid ?? 0,
      ochrg: product.ochrg ?? 0,
      tval: product.tval ?? 0,
      id: product.id,
    });
  };

  const deleteProduct = (id: any) => {
    const updatedProducts = products.filter((p: any) => p.id !== id);
    setProducts(updatedProducts);
    let tval = calculateTotalTval(updatedProducts);
    setTotalToShow(tval);
    if (updatedProducts.length === 0) {
    setDiscount("");
    }
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
      id: undefined,
    });
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Product Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2 mb-3 p-3 bg-slate-50 rounded-lg border">
          <div className="space-y-1">
            <Label htmlFor="product_name" className="text-xs font-medium">Product Name</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="hsn_code" className="text-xs font-medium">HSN Code</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="psc" className="text-xs font-medium">Pcs</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gr_wt" className="text-xs font-medium">Gr Wt</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="net_wt" className="text-xs font-medium">Net Wt</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="rate" className="text-xs font-medium">Rate</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="amt" className="text-xs font-medium">Amount</Label>
            <Input
              id="amt"
              type="number"
              readOnly
              placeholder="Amount"
              value={newProduct.amt}
              className="h-8 text-sm bg-gray-100"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="lbr_amt" className="text-xs font-medium">Lbr Amt</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="huid_amt" className="text-xs font-medium">Huid Amt</Label>
            <Input
              id="huid_amt"
              type="number"
              placeholder="Huid Amt"
              value={newProduct.huid}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  huid: Number(e.target.value),
                })
              }
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="o_charge" className="text-xs font-medium">O. Charge</Label>
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
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="total_amt" className="text-xs font-medium">Total Amount</Label>
            <Input
              id="total_amt"
              type="number"
              readOnly
              placeholder="Total Amount"
              value={newProduct.tval}
              className="h-8 text-sm bg-gray-100 font-medium"
            />
          </div>

          <div className="flex gap-1 items-end">
            <Button
              type="button"
              onClick={addProduct}
              className="h-8 text-xs px-3 flex-1"
            >
              {editingProduct ? "Update" : "Add"}
            </Button>
            {editingProduct && (
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs px-2"
                onClick={cancelProductEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="h-9 text-xs font-semibold">Product Name</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">HSN</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-right">Pcs</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-right">Net Wt</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-right">Rate</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-right">Total Amount</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any, index: number) => (
                  <TableRow key={`${product.id || index}`} className="hover:bg-slate-50">
                    <TableCell className="py-2 text-sm">{product.pd}</TableCell>
                    <TableCell className="py-2 text-sm">{product.hsn}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{product.pcs}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{product.net}</TableCell>
                    <TableCell className="py-2 text-sm text-right">{product.rate}</TableCell>
                    <TableCell className="py-2 text-sm text-right font-medium">{product.tval}</TableCell>
                    <TableCell className="py-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => editProduct(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDetailsCard;
