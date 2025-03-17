"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Props {
  ordersLoading: boolean;
  filteredOrders: Array<object>;
}

const OrderList = ({ ordersLoading, filteredOrders }: Props) => {
  const [loadingOrderPage, setLoadingOrderPage] = useState(false);

  useEffect(() => {
    setLoadingOrderPage(false);
  }, []);

  const router = useRouter();

  const openOrder = (orderId: string) => {
    // Navigate to the order details page

    setLoadingOrderPage(true);
    router.push(`/cash-ledger/orders/${orderId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order List</CardTitle>
        <CardDescription>Manage your orders and track payments</CardDescription>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No orders found. Try a different search term or create a new order.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Notes</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any, index: number) => (
                  <TableRow
                    key={order.id}
                    className={
                      loadingOrderPage ? "cursor-progress" : "cursor-pointer"
                    }
                    onClick={() => openOrder(order.id)}
                  >
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.pendingAmount)}
                    </TableCell>

                    <TableCell>
                      {order.dueDate
                        ? formatDate(order.dueDate)
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          order.status === "active" ? "blue" : "secondary"
                        }
                      >
                        {order.status === "active" ? "Active" : "Closed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.notes}</TableCell>
                    {/* <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/cash-ledger/orders/${order.id}`}>
                        <ArrowUpRight className="h-6 w-6" />
                        <span className="sr-only">View order</span>
                      </Link>
                    </Button>
                  </TableCell> */}
                    {/* </Link> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;
