"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { firestore, useCustomers } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { showToast } from "@/lib/toast"
import { ArrowLeft } from "lucide-react"

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  const { data: customers, loading } = useCustomers()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && customers.length > 0) {
      const customer = customers.find((c) => c.id === customerId)
      if (customer) {
        setFormData({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes || "",
        })
      }
    }
  }, [loading, customers, customerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await firestore.updateCustomer(customerId, formData)
      showToast.success("Customer updated", "The customer information has been updated successfully.")
      router.push(`cash-ledger/customers/${customerId}`)
    } catch (error) {
      showToast.error("Error", "Failed to update customer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>Loading...</p>
      </div>
    )
  }

  const customer = customers.find((c) => c.id === customerId)

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Customer not found</h1>
        <p className="text-muted-foreground">The customer you are trying to edit does not exist.</p>
        <Button onClick={() => router.push("/cash-ledger/customers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Customer</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Customer Information</CardTitle>
            <CardDescription>
              Update the information for customer {customer.name} (Profile #{customer.profileNumber})
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
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}