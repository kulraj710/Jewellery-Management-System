"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CustomerTable = ({ customers, onView, onEdit } : any) => {
  return (
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
        {customers.map((customer : any) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.profileNumber}</TableCell>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell className="max-w-xs truncate">{customer.address}</TableCell>
            <TableCell>{formatDate(customer.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/customers/${customer.id}`}>View</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/customers/${customer.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerTable;
