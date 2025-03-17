"use client";

import type React from "react";
import { useState } from "react";
import { flushSync } from "react-dom";
// import { useRouter } from "next/compat/router";
import { useOrders, useCustomers, firestore } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  // DialogHeader,
  // DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from "@/components/customers/CustomerForm";
import { AddDatePicker } from "@/components/invoice/AddDatePicker";
import OrderList from "@/components/cash-ledger/orders/OrderList";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfDay } from "date-fns";


export default function OrdersPage() {
  const { data: orders, loading: ordersLoading } = useOrders();
  const {
    data: customers,
    loading: customersLoading,
    setData: setCustomers,
  } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    totalAmount: "",
    notes: "",
    dueDate : new Date(),
  });

  const router = useRouter();
  const [orderDate, setOrderDate] = useState<Date | null | undefined>(
    new Date()
  );
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // Client-side filtering for customers using the search query
  const customerFilteredCustomers = customers.filter((customer) => {
    const lowerQuery = customerSearchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.toLowerCase().includes(lowerQuery) ||
      customer.profileNumber.toLowerCase().includes(lowerQuery)
    );
  });

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedCustomer = customers.find(
        (c) => c.id === formData.customerId
      );
      if (!selectedCustomer) {
        throw new Error("Customer not found");
      }

      const add = await firestore.addOrder({
        customerId: formData.customerId,
        customerName: selectedCustomer.name,
        totalAmount: Number.parseFloat(formData.totalAmount),
        notes: formData.notes,
        dueDate: formData.dueDate,
      });

      showToast.success(
        "Order created",
        "The order has been created successfully."
      );

      setFormData({
        customerId: "",
        totalAmount: "",
        notes: "",
        dueDate : new Date(),
      });
      setIsAddingOrder(false);

      router.push(`/cash-ledger/orders/${add.id}`);
    } catch (error) {
      showToast.error("Error", "Failed to create order. Please try again.");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectChange = (value: any) => {
    if (value === "create-new") {
      setIsModalOpen(true);
    } else {
      setFormData((prev) => ({ ...prev, customerId: value }));
    }
  };

  const handleCustomerCreated = async (newCustomer: any) => {
    flushSync(() => {
      setCustomers((prev: any) => [...prev, newCustomer]);
    });

    // Immediately update the selected customer once the customers array is updated
    flushSync(() => {
      setFormData((prev) => ({ ...prev, customerId: newCustomer.id }));
    });

    setIsModalOpen(false);
  };

  const handleDueDateSelect = (date: Date | undefined) => {
    if (date && isBefore(startOfDay(date), startOfDay(new Date()))) {
      // Date is in the past, do not update state
      return;
    }
    setFormData((prev : any) => ({ ...prev, dueDate: date || null }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddingOrder(!isAddingOrder)}>
            {isAddingOrder ? (
              "Cancel"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </>
            )}
          </Button>
        </div>
      </div>

      {isAddingOrder && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create New Order</CardTitle>
              <CardDescription>
                Select a customer and enter the order details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Select with integrated search */}
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => {
                    if (value === "create-new") {
                      setIsModalOpen(true);
                    } else {
                      handleSelectChange(value);
                    }
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <Command>
                      <Input
                        placeholder="Search customers..."
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      />
                      <CommandList>
                        <CommandGroup>
                          {customersLoading ? (
                            <CommandItem disabled>
                              Loading customers...
                            </CommandItem>
                          ) : customerFilteredCustomers.length === 0 ? (
                            <CommandItem disabled>
                              No customers found
                            </CommandItem>
                          ) : (
                            customerFilteredCustomers.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                onSelect={() => handleSelectChange(customer.id)}
                              >
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                >
                                  ({customer.profileNumber}) {customer.name} (
                                  {customer.phone})
                                </SelectItem>
                              </CommandItem>
                            ))
                          )}
                          <SelectItem value="create-new">
                            + Create New Profile
                          </SelectItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </SelectContent>
                </Select>
              </div>
              {/* Total Amount and Date Picker */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="totalAmount">Total Amount *</Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <AddDatePicker
                    selectedDate={orderDate}
                    setSelectedDate={setOrderDate}
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date for Order</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        placeholder="Pick a Due Date"
                        value={
                          formData.dueDate ? format(formData.dueDate, "PPP") : ""
                        }
                        
                        readOnly
                        className="text-left cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={handleDueDateSelect}
                        disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional notes about the order"
                />
              </div>

              
            </CardContent>
            <CardFooter>
              <Button type="submit">Create Order</Button>
            </CardFooter>
          </form>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <CustomerForm
                isFormInModal={true}
                onCustomerCreated={handleCustomerCreated}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      )}

      <OrderList
        filteredOrders={filteredOrders}
        ordersLoading={ordersLoading}
      />
    </div>
  );
}
