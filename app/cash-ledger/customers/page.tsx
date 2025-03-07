"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useCustomers, firestore } from "@/lib/firebase"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { showToast } from "@/lib/toast"
import { Search, Plus, Eye, Edit } from "lucide-react"

export default function CustomersPage() {
  const { data: customers, loading } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.profileNumber.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await firestore.addCustomer(formData)
      showToast.success("Customer added", "The customer has been added successfully.")
      setFormData({
        name: "",
        phone: "",
        address: "",
        notes: "",
      })
      setIsAddingCustomer(false)
    } catch (error) {
      showToast.error("Error", "Failed to add customer. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddingCustomer(!isAddingCustomer)}>
            {isAddingCustomer ? (
              "Cancel"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </>
            )}
          </Button>
        </div>
      </div>

      {isAddingCustomer && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>
                Enter the customer details below. A profile number will be automatically generated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No customers found. Try a different search term or add a new customer.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.profileNumber}</TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{customer.address}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View customer</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/customers/${customer.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit customer</span>
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
      </Card>
    </div>
  )
}

