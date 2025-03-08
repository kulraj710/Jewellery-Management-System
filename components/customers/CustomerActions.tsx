"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CustomerActions = ({ customerId } : any) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/cash-ledger/customers/${customerId}`}>View</Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/cash-ledger/customers/${customerId}/edit`}>Edit</Link>
      </Button>
    </div>
  );
};

export default CustomerActions;
