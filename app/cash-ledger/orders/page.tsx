"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useOrders, useCustomers, firestore } from "@/lib/firebase"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { showToast } from "@/lib/toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CustomersPage from "../customers/page"


export default function OrdersPage() {
  const { data: orders, loading: ordersLoading } = useOrders()
  const { data: customers, loading: customersLoading } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingOrder, setIsAddingOrder] = useState(false)
  const [formData, setFormData] = useState({
    customerId: "",
    totalAmount: "",
    notes: "",
  })

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // const handleSelectChange = (value: string) => {
  //   setFormData((prev) => ({ ...prev, customerId: value }))
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const selectedCustomer = customers.find((c) => c.id === formData.customerId)
      if (!selectedCustomer) {
        throw new Error("Customer not found")
      }

      await firestore.addOrder({
        customerId: formData.customerId,
        customerName: selectedCustomer.name,
        totalAmount: Number.parseFloat(formData.totalAmount),
        notes: formData.notes,
      })

      showToast.success("Order created", "The order has been created successfully.")

      setFormData({
        customerId: "",
        totalAmount: "",
        notes: "",
      })
      setIsAddingOrder(false)
    } catch (error) {
      showToast.error("Error", "Failed to create order. Please try again.")
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectChange = (value : any) => {
    if (value === "create-new") {
      setIsModalOpen(true);
    } else {
      setFormData((prev) => ({ ...prev, customerId: value }));
    }
  };

  const handleCustomerCreated = (newCustomer : any) => {
    setFormData((prev) => ({ ...prev, customerId: newCustomer.id }));
    setIsModalOpen(false);
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
              <CardDescription>Select a customer and enter the order details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select value={formData.customerId} onValueChange={handleSelectChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customersLoading ? (
            <SelectItem value="loading" disabled>Loading customers...</SelectItem>
          ) : customers.length === 0 ? (
            <SelectItem value="none" disabled>No customers found</SelectItem>
          ) : (
            customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name} ({customer.profileNumber})
              </SelectItem>
            ))
          )}
          <SelectItem key="create-new-customer" value="create-new">+ Create New Profile</SelectItem>
        </SelectContent>
      </Select>

      {/* Modal for Creating New Customer */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
          </DialogHeader>
          <CustomersPage/>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
              </div>
              <div className="space-y-2">
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
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>Manage your orders and track payments</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No orders found. Try a different search term or create a new order.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.pendingAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "active" ? "default" : "secondary"}>
                          {order.status === "active" ? "Active" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View order</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}