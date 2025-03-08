"use client"

import { useState } from "react"
import Link from "next/link"
import { useOrders } from "@/lib/firebase"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ArrowUpRight } from "lucide-react"

export default function Dashboard() {
  const { data: orders, loading } = useOrders()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate total pending amount
  const totalPendingAmount = orders.reduce((sum, order) => sum + order.pendingAmount, 0)

  // Count active orders
  const activeOrdersCount = orders.filter((order) => order.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers or orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pending</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalPendingAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">From {loading ? "..." : orders.length} total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Orders</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? <Skeleton className="h-8 w-16" /> : activeOrdersCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? <Skeleton className="h-8 w-16" /> : new Set(orders.map((order) => order.customerId)).size}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">With active orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>Manage and track all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No orders found. Try a different search term.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{order.id}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.receivedAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.pendingAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "active" ? "default" : "secondary"}>
                          {order.status === "active" ? "Active" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/cash-ledger/orders/${order.id}`}>
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

