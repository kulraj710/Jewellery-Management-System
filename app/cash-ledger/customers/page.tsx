"use client"

import type React from "react"

import { useState } from "react"
import { useCustomers } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import CustomerForm from "@/components/customers/CustomerForm"
import CustomerList from "@/components/customers/CustomerList"

interface Customer {
  id: string;
  profileNumber: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export default function CustomersPage(): JSX.Element {
  const { data: customers } = useCustomers() as { data: Customer[]; loading: boolean }
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isAddingCustomer, setIsAddingCustomer] = useState<boolean>(false)
  
  // Filter customers based on search query
  const filteredCustomers = (customers || []).filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.profileNumber.includes(searchQuery),
  )

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
        <CustomerForm setIsAddingCustomer={setIsAddingCustomer}/>
      )}

     <CustomerList customers={filteredCustomers}/>
    </div>
  )
}
