"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Eye, Edit } from "lucide-react"
import { useRouter } from "next/navigation";

const CustomerList = ({ customers } : any) => {

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <CardDescription>Manage your customers and their information</CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No customers found. Try a different search term or add a new customer.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer : any) => (
                <TableRow key={customer.id} className="cursor-pointer" onClick={() => router.push(`/cash-ledger/customers/${customer.id}`)}>
                  <TableCell>{customer.profileNumber}</TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{customer.address}</TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  {/* <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                            <Link href={`/cash-ledger/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View customer</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/cash-ledger/customers/${customer.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit customer</span>
                            </Link>
                          </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
                
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerList;
