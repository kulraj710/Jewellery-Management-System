"use client"

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-1.jpg";
import { usePathname } from "next/navigation";
import { Header } from "@/components/cash-ledger/header";

const Navbar = () => {
  const pathname = usePathname();
  const isCashLedgerPage = pathname.startsWith("/cash-ledger");

  return (
    <>
      {isCashLedgerPage ? (
        <Header />
      ) : (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src={Logo}
                      alt="vaibhav jewellers logo"
                      width="50"
                      height="50"
                    />
                    <span className="text-2xl font-bold text-gray-800">
                      &nbsp; Vaibhav Jewellers
                    </span>
                  </Link>
                </div>

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/invoice-create"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Create Invoice
                  </Link>
                  <Link
                    href="/invoices"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    All Invoices
                  </Link>

                  <Link
                    href="/inventory-home"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Inventory
                  </Link>

                  <Link
                    href="/cash-ledger"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Cash Ledger
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
