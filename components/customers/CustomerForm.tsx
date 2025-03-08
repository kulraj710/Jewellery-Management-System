"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { firestore } from "@/lib/firebase";

const CustomerForm = ({
  setIsAddingCustomer,
  isFormInModal,
  onCustomerCreated,
}: any) => {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: string;
    notes: string;
  }>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let res: any;
    try {
      res = await firestore.addCustomer(formData);
      showToast.success(
        "Customer added",
        "The customer has been added successfully."
      );
      console.table(res)
      if (isFormInModal) {
        onCustomerCreated({ id: res.id, ...formData }); 
      } else {
        setIsAddingCustomer(false);
      }
    } catch (error: any) {
      alert(error.message);
      showToast.error("Error", "Failed to add customer. Please try again.");
    } finally {
      setFormData({
        name: "",
        phone: "",
        address: "",
        notes: "",
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
          <CardDescription>
            Enter the customer details below. A profile number will be
            automatically generated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Optional notes about the customer"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Customer</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CustomerForm;
