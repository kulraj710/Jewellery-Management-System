"use client"

import { useState } from "react"
import Link from "next/link"
import { useOrders } from "@/lib/firebase"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  ChevronDown 
} from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function Dashboard() {
  const { data: orders, loading } = useOrders()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("current")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  // Generate last 6 months tabs
  const monthTabs = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: i === 0 ? "current" : format(date, "MMM-yyyy").toLowerCase(),
      label: format(date, "MMM yyyy")
    }
  })

  // Filter orders based on search query, selected month, and status
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Month filter
    let matchesMonth = true
    if (selectedMonth !== "all") {
      const orderDate = order.createdAt ? new Date(order.createdAt) : null
      if (orderDate) {
        if (selectedMonth === "current") {
          const currentDate = new Date()
          const firstDay = startOfMonth(currentDate)
          const lastDay = endOfMonth(currentDate)
          matchesMonth = isWithinInterval(orderDate, { start: firstDay, end: lastDay })
        } else {
          const [month, year] = selectedMonth.split("-")
          const monthIndex : any = {
            "jan": 0, "feb": 1, "mar": 2, "apr": 3, "may": 4, "jun": 5,
            "jul": 6, "aug": 7, "sep": 8, "oct": 9, "nov": 10, "dec": 11
          }[month]
          const firstDay = new Date(parseInt(year), monthIndex, 1)
          const lastDay = endOfMonth(firstDay)
          matchesMonth = isWithinInterval(orderDate, { start: firstDay, end: lastDay })
        }
      }
    }

    // Status filter
    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesMonth && matchesStatus
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a : any, b : any) => {
    switch (sortBy) {
      case "date-desc":
        return (b.createdAt || 0) - (a.createdAt || 0)
      case "date-asc":
        return (a.createdAt || 0) - (b.createdAt || 0)
      case "amount-desc":
        return b.totalAmount - a.totalAmount
      case "amount-asc":
        return a.totalAmount - b.totalAmount
      case "pending-desc":
        return b.pendingAmount - a.pendingAmount
      default:
        return (b.createdAt || 0) - (a.createdAt || 0)
    }
  })

  // Calculate metrics for the selected month
  const calculateMetrics = () => {
    const selectedOrders = selectedMonth === "all" ? orders : filteredOrders
    
    const totalPendingAmount = selectedOrders.reduce((sum, order) => sum + order.pendingAmount, 0)
    const activeOrdersCount = selectedOrders.filter(order => order.status === "active").length
    const uniqueCustomers = new Set(selectedOrders.map(order => order.customerId)).size
    
    // Calculate additional metrics
    const totalAmount = selectedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const receivedAmount = selectedOrders.reduce((sum, order) => sum + order.receivedAmount, 0)
    const collectionRate = totalAmount > 0 ? (receivedAmount / totalAmount) * 100 : 0
    const urgentOrders = selectedOrders.filter(order => 
      order.status === "active" && order.pendingAmount > 0 && 
      order?.dueDate && new Date(order.dueDate) < new Date()
    ).length

    return {
      totalPendingAmount,
      activeOrdersCount,
      uniqueCustomers,
      totalAmount,
      receivedAmount,
      collectionRate,
      urgentOrders
    }
  }

  const metrics = calculateMetrics()

  // Handle export to CSV
  const exportToCSV = () => {
    const headers = ["Customer", "Date", "Total", "Received", "Pending", "Status"]
    const rows = sortedOrders.map(order => [
      order.customerName,
      order.createdAt ? format(order.createdAt, "dd-MM-yyyy") : "N/A",
      order.totalAmount,
      order.receivedAmount,
      order.pendingAmount,
      order.status
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `cash-ledger-${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Cash Ledger Dashboard</h1>
        <div className="flex items-center gap-2">
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
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current" onValueChange={setSelectedMonth}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-blue-200">
            {monthTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                <SelectItem value="pending-desc">Highest Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="current" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Pending</CardDescription>
                <CardTitle className="text-3xl text-red-500">
                  {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(metrics.totalPendingAmount)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From {loading ? "..." : filteredOrders.length} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collection Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-24" /> : `${metrics.collectionRate.toFixed(1)}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(metrics.receivedAmount)} received of {formatCurrency(metrics.totalAmount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Orders</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.activeOrdersCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Requiring attention</p>
                {metrics.urgentOrders > 0 && (
                  <Badge variant="destructive">{metrics.urgentOrders} urgent</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Customers</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.uniqueCustomers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">With active orders</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-2">
                <div>
                  <CardTitle>Active Orders</CardTitle>
                  <CardDescription>Manage and track all customer orders</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : sortedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">No orders found for this period.</p>
                  <p className="text-center text-muted-foreground">Try selecting a different month or changing your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className={order.dueDate && new Date(order.dueDate) < new Date() && order.pendingAmount > 0 ? "bg-red-50" : ""}>
                          <TableCell className="font-medium">{order.customerName}</TableCell>
                          <TableCell>{order.createdAt ? format(new Date(order.createdAt), "dd-MM-yyyy") : "N/A"}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.receivedAmount)}</TableCell>
                          <TableCell className="text-right font-medium" style={{ color: order.pendingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                            {formatCurrency(order.pendingAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.status === "active" ? "blue" : "default"}>
                              {order.status === "active" ? "Active" : "Closed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.dueDate ? format(new Date(order.dueDate), "dd-MM-yyyy") : "N/A"}
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
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {sortedOrders.length} of {orders.length} orders
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Duplicate TabsContent for other months - they'll all use the same template but with different data */}
        {monthTabs.slice(1).map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {/* Use the same layout/components as the "current" tab */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Pending</CardDescription>
                  <CardTitle className="text-3xl text-red-500">
                    {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(metrics.totalPendingAmount)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From {loading ? "..." : filteredOrders.length} orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Collection Rate</CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? <Skeleton className="h-8 w-24" /> : `${metrics.collectionRate.toFixed(1)}%`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(metrics.receivedAmount)} received of {formatCurrency(metrics.totalAmount)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Orders</CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? <Skeleton className="h-8 w-16" /> : metrics.activeOrdersCount}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Requiring attention</p>
                  {metrics.urgentOrders > 0 && (
                    <Badge variant="destructive">{metrics.urgentOrders} urgent</Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Customers</CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? <Skeleton className="h-8 w-16" /> : metrics.uniqueCustomers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">With active orders</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders table - same structure as in "current" tab */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Orders for {tab.label}</CardTitle>
                    <CardDescription>Manage and track all customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Payment Reminders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Same table structure as in "current" tab */}
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : sortedOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">No orders found for this period.</p>
                    <p className="text-center text-muted-foreground">Try selecting a different month or changing your search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Received</TableHead>
                          <TableHead className="text-right">Pending</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Same row structure as in "current" tab */}
                        {sortedOrders.map((order) => (
                          <TableRow key={order.id} className={order.dueDate && new Date(order.dueDate) < new Date() && order.pendingAmount > 0 ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{order.customerName}</TableCell>
                            <TableCell>{order.createdAt ? format(new Date(order.createdAt), "dd-MM-yyyy") : "N/A"}</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.receivedAmount)}</TableCell>
                            <TableCell className="text-right font-medium" style={{ color: order.pendingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                              {formatCurrency(order.pendingAmount)}
                            </TableCell>
                            <TableCell>
                              {/* <Badge variant={order.status === "active" ? "blue" : order.status === "overdue" ? "destructive" : "default"}>
                                {order.status === "active" ? "Active" : order.status === "overdue" ? "Overdue" : "Closed"}
                              </Badge> */}

                              <Badge variant="blue">
                                Overdue
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.dueDate ? format(new Date(order.dueDate), "dd-MM-yyyy") : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-48" align="end">
                                    <div className="flex flex-col space-y-1">
                                      <Button variant="ghost" size="sm" className="justify-start">
                                        Record Payment
                                      </Button>
                                      <Button variant="ghost" size="sm" className="justify-start">
                                        Send Reminder
                                      </Button>
                                      <Button variant="ghost" size="sm" className="justify-start">
                                        Download Invoice
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/cash-ledger/orders/${order.id}`}>
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span className="sr-only">View order</span>
                                  </Link>
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
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {sortedOrders.length} of {orders.length} orders
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}

        {/* All Time tab */}
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Pending</CardDescription>
                <CardTitle className="text-3xl text-red-500">
                  {loading ? <Skeleton className="h-8 w-24" /> : formatCurrency(metrics.totalPendingAmount)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From {loading ? "..." : orders.length} total orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collection Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-24" /> : `${metrics.collectionRate.toFixed(1)}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(metrics.receivedAmount)} received of {formatCurrency(metrics.totalAmount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Orders</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.activeOrdersCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Requiring attention</p>
                {metrics.urgentOrders > 0 && (
                  <Badge variant="destructive">{metrics.urgentOrders} urgent</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Customers</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.uniqueCustomers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* All time orders table - same structure as monthly tabs */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>Complete order history</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Trends
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Same table structure as monthly tabs */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : sortedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">No orders found. Try a different search term.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className={order.dueDate && new Date(order.dueDate) < new Date() && order.pendingAmount > 0 ? "bg-red-50" : ""}>
                          <TableCell className="font-medium">{order.customerName}</TableCell>
                          <TableCell>{order.createdAt ? format(new Date(order.createdAt), "dd-MM-yyyy") : "N/A"}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.receivedAmount)}</TableCell>
                          <TableCell className="text-right font-medium" style={{ color: order.pendingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                            {formatCurrency(order.pendingAmount)}
                          </TableCell>
                          <TableCell>
                            {/* <Badge variant={order.status === "active" ? "blue" : order.status === "overdue" ? "destructive" : "default"}>
                              {order.status === "active" ? "Active" : order.status === "overdue" ? "Overdue" : "Closed"}
                            </Badge> */}
                            <Badge variant="blue">
                              Overdue
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.dueDate ? format(new Date(order.dueDate), "dd-MM-yyyy") : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48" align="end">
                                  <div className="flex flex-col space-y-1">
                                    <Button variant="ghost" size="sm" className="justify-start">
                                      Record Payment
                                    </Button>
                                    <Button variant="ghost" size="sm" className="justify-start">
                                      Send Reminder
                                    </Button>
                                    <Button variant="ghost" size="sm" className="justify-start">
                                      Download Invoice
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/cash-ledger/orders/${order.id}`}>
                                  <ArrowUpRight className="h-4 w-4" />
                                  <span className="sr-only">View order</span>
                                </Link>
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
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {sortedOrders.length} of {orders.length} orders
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}