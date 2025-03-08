"use client"

import { useState } from "react"
import { firestore, useCustomers } from "@/lib/firebase"
import { formatCurrency, formatDate, downloadAsExcel } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Download, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { showToast } from "@/lib/toast"

export default function ReportsPage() {
  const { data: customers, loading: customersLoading } = useCustomers()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [reportData, setReportData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateReport = async () => {
    if (!selectedCustomerId && !dateRange.from) {
      showToast.error("Missing filters", "Please select a customer or date range.")
      return
    }

    setIsLoading(true)

    try {
      let transactions = []

      if (selectedCustomerId) {
        transactions = await firestore.getTransactionsByCustomerId(selectedCustomerId)
      } else {
        transactions = await firestore.getTransactions()
      }

      // Filter by date range if provided
      if (dateRange.from) {
        const fromDate = dateRange.from
        const toDate = dateRange.to || new Date()

        transactions = transactions.filter((t) => {
          const transactionDate = new Date(t.createdAt)
          return transactionDate >= fromDate && transactionDate <= toDate
        })
      }

      setReportData(transactions)

      showToast.success("Report generated", `Found ${transactions.length} transactions.`)
    } catch (error) {
      showToast.error("Error", "Failed to generate report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!reportData || reportData.length === 0) {
      showToast.error("No data", "Generate a report first before downloading.")
      return
    }

    const filename = `transactions-report-${format(new Date(), "yyyy-MM-dd")}`
    downloadAsExcel(reportData, filename)

    showToast.success("Download started", "Your report is being downloaded.")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports & Downloads (Not Functional Yet)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Filter transactions by customer and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All customers</SelectItem>
                  {customersLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading customers...
                    </SelectItem>
                  ) : customers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No customers found
                    </SelectItem>
                  ) : (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.profileNumber})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!dateRange.from}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    disabled={(date) => date < (dateRange.from || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => {
              setSelectedCustomerId("")
              setDateRange({ from: undefined, to: undefined })
              setReportData(null)
            }}
            variant="outline"
          >
            Reset Filters
          </Button>
          <Button onClick={generateReport} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </CardFooter>
      </Card>

      {reportData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Report</CardTitle>
              <CardDescription>{reportData.length} transactions found</CardDescription>
            </div>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            {reportData.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No transactions found matching your filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell>
                          {customers.find((c) => c.id === transaction.customerId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{transaction.type === "incoming" ? "Payment" : "Refund"}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{transaction.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <div>
                <span className="text-sm text-muted-foreground">Total Incoming: </span>
                <span className="font-medium">
                  {formatCurrency(
                    reportData.filter((t) => t.type === "incoming").reduce((sum, t) => sum + t.amount, 0),
                  )}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Outgoing: </span>
                <span className="font-medium">
                  {formatCurrency(
                    reportData.filter((t) => t.type === "outgoing").reduce((sum, t) => sum + t.amount, 0),
                  )}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Net Total: </span>
                <span className="font-bold">
                  {formatCurrency(
                    reportData.reduce((sum, t) => {
                      return sum + (t.type === "incoming" ? t.amount : -t.amount)
                    }, 0),
                  )}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download data in different formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer List</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Export all customer information</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    downloadAsExcel(customers, `customers-${format(new Date(), "yyyy-MM-dd")}`)
                    showToast.success("Download started", "Your customer list is being downloaded.")
                  }}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Customers
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Orders List</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Export all order information</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    const orders = await firestore.getOrders()
                    downloadAsExcel(orders, `orders-${format(new Date(), "yyyy-MM-dd")}`)
                    showToast.success("Download started", "Your orders list is being downloaded.")
                  }}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Orders
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Transactions</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Export all transaction history</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    const transactions = await firestore.getTransactions()
                    downloadAsExcel(transactions, `transactions-${format(new Date(), "yyyy-MM-dd")}`)
                    showToast.success("Download started", "Your transactions are being downloaded.")
                  }}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
