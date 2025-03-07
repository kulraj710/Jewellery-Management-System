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

const newProductInitialObject = {
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
    if (isUpdate){
      let tval = calculateTotalTval(products);
      setTotalToShow(tval);
    }
  }, [isUpdate])

  const calculateAutoFillValue = () => {
    const amt = parseFloat(newProduct.amt.toString());
    const lbr = parseFloat(newProduct.lbr.toString());
    const huid = parseFloat(newProduct.huid.toString());
    const ochrg = parseFloat(newProduct.ochrg.toString());

    if (!isNaN(amt) && !isNaN(lbr) && !isNaN(huid) && !isNaN(ochrg)) {
      const b = Math.round(amt + lbr + huid + ochrg);
      // setNetAmount(b);
      setNewProduct((prev) => ({ ...prev, tval: b }));
    }
  };
  const calculateAutoFillValue1 = () => {
    const num1 = parseFloat(newProduct.rate.toString());
    const netw = parseFloat(newProduct.net.toString());

    if (!isNaN(netw) && !isNaN(num1)) {
      const val = Math.round(num1 * netw);
      // setNetAmount(val);
      setNewProduct((prev) => ({ ...prev, amt: val }));
    } else {
      // setNetAmount(0);
    }
  };

  function calculateTotalTval(arr: any) {
    let total = 0;
    for (const val of arr) {
      total += parseFloat(val.tval);
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
    });
  };

  const editProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
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
    });
  };

  return (
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
              readOnly
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
              readOnly
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
                <TableRow key={`${product.hsn}-${product.net}`} className="bg-gray-100">
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
  );
};

export default ProductDetailsCard;
