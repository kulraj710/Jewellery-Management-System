"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrder, useTransactionsByOrderId, firestore } from "@/lib/firebase"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { showToast } from "@/lib/toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash } from "lucide-react"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { data: order, loading: orderLoading } = useOrder(orderId)
  const { data: transactions, loading: transactionsLoading } = useTransactionsByOrderId(orderId)
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    type: "incoming",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!order) return

    try {
      await firestore.addTransaction({
        orderId: order.id,
        customerId: order.customerId,
        amount: Number.parseFloat(formData.amount),
        type: formData.type as "incoming" | "outgoing",
        notes: formData.notes,
      })

      showToast.success("Transaction added", "The transaction has been added successfully.")

      setFormData({
        amount: "",
        type: "incoming",
        notes: "",
      })
      setIsAddingTransaction(false)
    } catch (error) {
      showToast.error("Error", "Failed to add transaction. Please try again.")
    }
  }

  const handleCloseOrder = async () => {
    if (!order) return

    try {
      await firestore.updateOrder(order.id, {
        status: "closed",
      })

      showToast.success("Order closed", "The order has been marked as closed.")
    } catch (error) {
      showToast.error("Error", "Failed to close order. Please try again.")
    }
  }

  const handleDeleteOrder = async () => {
    if (!order) return

    try {
      await firestore.deleteOrder(order.id)

      showToast.success("Order deleted", "The order has been deleted successfully.")

      router.push("/cash-ledger/orders")
    } catch (error) {
      showToast.error("Error", "Failed to delete order. Please try again.")
    }
  }

  if (orderLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-muted-foreground">The order you are looking for does not exist.</p>
        <Button onClick={() => router.push("/cash-ledger/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order {order.id}</h1>
          <Badge variant={order.status === "active" ? "default" : "secondary"}>
            {order.status === "active" ? "Active" : "Closed"}
          </Badge>
        </div>
        <div className="flex gap-2">
          {order.status === "active" && <Button onClick={() => handleCloseOrder()}>Mark as Closed</Button>}
          {order.status === "closed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the order and all associated
                    transactions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOrder}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Created on {formatDate(order.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received Amount</p>
                <p className="font-medium">{formatCurrency(order.receivedAmount)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-xl font-bold">{formatCurrency(order.pendingAmount)}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p>{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Track incoming and outgoing payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Incoming</p>
                <p className="font-medium">
                  {formatCurrency(
                    transactions.filter((t) => t.type === "incoming").reduce((sum, t) => sum + t.amount, 0),
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Outgoing</p>
                <p className="font-medium">
                  {formatCurrency(
                    transactions.filter((t) => t.type === "outgoing").reduce((sum, t) => sum + t.amount, 0),
                  )}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Amount</p>
              <p className="text-xl font-bold">{formatCurrency(order.receivedAmount)}</p>
            </div>
          </CardContent>
          <CardFooter>
            {order.status === "active" && (
              <Button onClick={() => setIsAddingTransaction(!isAddingTransaction)}>
                {isAddingTransaction ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {isAddingTransaction && (
        <Card className="border-4 border-black">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a payment for this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">Incoming (Payment)</SelectItem>
                      <SelectItem value="outgoing">Outgoing (Refund)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Optional notes about the transaction"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Transaction</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All payments and refunds for this order</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No transactions found for this order.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "incoming" ? "default" : "destructive"}>
                          {transaction.type === "incoming" ? "Payment" : "Refund"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{transaction.notes ?? "-"}</TableCell>
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