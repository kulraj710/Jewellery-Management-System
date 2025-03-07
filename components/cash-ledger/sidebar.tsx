"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Menu,
  X,
  BookUpIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    href: "/cash-ledger",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/cash-ledger/customers",
    icon: Users,
  },
  {
    name: "Orders",
    href: "/cash-ledger/orders",
    icon: ShoppingBag,
  },
  {
    name: "Reports",
    href: "/cash-ledger/reports",
    icon: BarChart3,
  },
  {
    name: "Invoices",
    href: "/invoice-create",
    icon: BookUpIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isCashLeader = pathname.startsWith("/cash-ledger");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isCashLeader ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold">Cash Ledger</h1>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-gray-100 dark:bg-gray-700 text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
