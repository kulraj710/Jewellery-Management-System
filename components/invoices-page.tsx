"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatCurrency } from "@/utils/currency";
import ViewInvoiceButton from "./invoice-list/ViewInvoiceButton";
import PrintInvoiceButton from "./invoice-list/PrintInvoiceButtons";
import DeleteInvoiceButton from "./invoice-list/DeleteInvoiceButton";
import EditInvoiceButton from "./invoice-list/EditInvoiceButton";

export function InvoicesPageComponent() {
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [pageSnapshots, setPageSnapshots] = useState<any[]>([]); // Store invoices for each page
  const [totalEntries, setTotalEntries] = useState(0);

  // Use one effect that refetches invoices based on whether a search term is provided.
  useEffect(() => {
    // If there's a search term, ignore pagination and fetch ALL invoices:
    // if (searchTerm !== "" && searchTerm.length > 2) {
    //   const fetchAllInvoices = async () => {
    //     const invoiceQuery = query(
    //       collection(db, "invoice"),
    //       orderBy("invoiceDate", "desc")
    //       // Note: no limit for full-search
    //     );
    //     const querySnapshot = await getDocs(invoiceQuery);
    //     const fetchedInvoices = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setInvoices(fetchedInvoices);
    //     setTotalEntries(querySnapshot.size);
    //     // Reset pagination state since we're in search mode.
    //     setCurrentPage(1);
    //     setPageSnapshots([]);
    //     setLastVisible(null);
    //   };
    //   fetchAllInvoices();
    // }
    
    // else {
      // If no search term, use paginated fetch
      const fetchInvoices = async () => {
        const invoiceQuery = query(
          collection(db, "invoice"),
          orderBy("invoiceDate", "desc"),
          limit(itemsPerPage)
        );
        const querySnapshot = await getDocs(invoiceQuery);
        const fetchedInvoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvoices(fetchedInvoices);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        // Store the first page's data
        setPageSnapshots([fetchedInvoices]);

        // Also update the total count 
        const countQuery = query(collection(db, "invoice"));
        const snapshot = await getCountFromServer(countQuery);
        setTotalEntries(snapshot.data().count);
      // };
    }
    fetchInvoices();
  }, []);

  const handleNextPage = async () => {
    // Only allow pagination if no search term is active.
    if (searchTerm !== "") return;

    if (currentPage < pageSnapshots.length) {
      // If the next page is already cached, just load it
      setInvoices(pageSnapshots[currentPage]);
      setCurrentPage(currentPage + 1);
    } else {
      // Fetch new page data from Firestore
      const invoiceQuery = query(
        collection(db, "invoice"),
        orderBy("invoiceDate", "desc"),
        limit(itemsPerPage),
        startAfter(lastVisible)
      );
      const querySnapshot = await getDocs(invoiceQuery);
      const newInvoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(newInvoices);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setCurrentPage(currentPage + 1);
      // Cache this page's data
      setPageSnapshots([...pageSnapshots, newInvoices]);
    }
  };

  const handlePreviousPage = () => {
    // Only allow pagination if no search term is active.
    if (searchTerm !== "" || currentPage === 1) return;
    // Load the previous page's data from stored snapshots
    setInvoices(pageSnapshots[currentPage - 2]);
    setCurrentPage(currentPage - 1);
  };

  // Client-side filtering based on search term and selected date.
  // (This runs on whichever invoices were loaded—either the full set for search or a paginated set.)
  const filteredInvoices = invoices
    .filter(
      (invoice) =>
        String(invoice.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(invoice.invoiceNo)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .filter((invoice) => {
      if (!selectedDate) return true;
      if (invoice.invoiceDate) {
        const invoiceDateFormatted = format(
          invoice.invoiceDate.toDate(),
          "yyyy-MM-dd"
        );
        const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
        return invoiceDateFormatted === selectedDateFormatted;
      }
      return false;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Table */}
      <div className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search invoices..."
                    disabled
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedDate(null)}
                    >
                      Clear Date
                    </Button>
                  )}
                </div>

                {/* Columns Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked={true}>
                      Invoice No
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={true}>
                      Customer Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={true}>
                      Date
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={true}>
                      Total Amount
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={true}>
                      Advance
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={true}>
                      Outstanding
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Table Body */}
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Advance</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={`${invoice.invoiceNo}-${invoice.name}`}>
                        <TableCell>{invoice.invoiceNo}</TableCell>
                        <TableCell>{invoice.name}</TableCell>
                        <TableCell>
                          {invoice.invoiceDate &&
                            format(invoice.invoiceDate.toDate(), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.totalAmt)}
                        </TableCell>
                        <TableCell>{formatCurrency(invoice.payment)}</TableCell>
                        <TableCell>
                          {formatCurrency(invoice.totalAmt - invoice.payment)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ViewInvoiceButton
                              invoiceData={invoice}
                              invoiceDate={invoice.invoiceDate?.toDate()}
                              products={invoice.productTable}
                            />
                            <EditInvoiceButton currentInvoice={invoice} />
                            <PrintInvoiceButton
                              invoiceData={invoice}
                              invoiceDate={invoice.invoiceDate?.toDate()}
                              products={invoice.productTable}
                            />
                            <DeleteInvoiceButton
                              invoices={invoices}
                              invoice={invoice}
                              setInvoices={setInvoices}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination and Total Rows */}
              {/* Hide pagination controls during search mode */}
              {!searchTerm && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    Showing {Math.min(currentPage * itemsPerPage, totalEntries)}{" "}
                    out of {totalEntries} results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={filteredInvoices.length < itemsPerPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InvoicesPageComponent;
