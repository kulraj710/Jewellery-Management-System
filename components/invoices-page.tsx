"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [allInvoices, setAllInvoices] = useState<any[]>([]); // Store all invoices for search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [pageSnapshots, setPageSnapshots] = useState<any[]>([]); // Store invoices for each page
  const [totalEntries, setTotalEntries] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load - fetch first page and all invoices for search
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Fetch first page for display
        const paginatedQuery = query(
          collection(db, "invoice"),
          orderBy("invoiceDate", "desc"),
          limit(itemsPerPage)
        );
        const paginatedSnapshot = await getDocs(paginatedQuery);
        const fetchedInvoices = paginatedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvoices(fetchedInvoices);
        setLastVisible(paginatedSnapshot.docs[paginatedSnapshot.docs.length - 1]);
        setPageSnapshots([fetchedInvoices]);

        // Fetch all invoices for search (ordered by date descending)
        const allQuery = query(
          collection(db, "invoice"),
          orderBy("invoiceDate", "desc")
        );
        const allSnapshot = await getDocs(allQuery);
        const allFetchedInvoices = allSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllInvoices(allFetchedInvoices);
        setTotalEntries(allSnapshot.size);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Calculate displayed invoices based on search
  const displayedInvoices = useMemo(() => {
    if (searchTerm.trim() !== "") {
      // Search from all invoices
      return allInvoices.filter(
        (invoice) =>
          String(invoice.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(invoice.invoiceNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(invoice.phone).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Return paginated invoices
      return invoices;
    }
  }, [searchTerm, allInvoices, invoices]);

  // Update searching state
  useEffect(() => {
    setIsSearching(searchTerm.trim() !== "");
  }, [searchTerm]);

  const handleNextPage = async () => {
    // Only allow pagination if no search term is active
    if (isSearching) return;

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

      if (newInvoices.length > 0) {
        setInvoices(newInvoices);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setCurrentPage(currentPage + 1);
        // Cache this page's data
        setPageSnapshots([...pageSnapshots, newInvoices]);
      }
    }
  };

  const handlePreviousPage = () => {
    // Only allow pagination if no search term is active
    if (isSearching || currentPage === 1) return;
    // Load the previous page's data from stored snapshots
    setInvoices(pageSnapshots[currentPage - 2]);
    setCurrentPage(currentPage - 1);
  };

  // Handle invoice deletion
  const handleInvoiceDeleted = (deletedInvoiceId: string) => {
    // Update all invoices list
    setAllInvoices(allInvoices.filter((inv) => inv.id !== deletedInvoiceId));
    // Update current page invoices
    setInvoices(invoices.filter((inv) => inv.id !== deletedInvoiceId));
    // Update cached pages
    const updatedSnapshots = pageSnapshots.map((page) =>
      page.filter((inv: any) => inv.id !== deletedInvoiceId)
    );
    setPageSnapshots(updatedSnapshots);
    // Decrease total count
    setTotalEntries(totalEntries - 1);
  };

  // Filter by selected date only (search is already handled in displayedInvoices)
  const filteredInvoices = useMemo(() => {
    return displayedInvoices.filter((invoice) => {
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
  }, [displayedInvoices, selectedDate]);

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
                    placeholder="Search by name, invoice number, or phone..."
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
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading invoices...</p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm || selectedDate
                        ? "No invoices found matching your search criteria."
                        : "No invoices found. Create your first invoice to get started."}
                    </p>
                  </div>
                ) : (
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
                        <TableRow key={invoice.id}>
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
                                onDelete={handleInvoiceDeleted}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pagination and Total Rows */}
              <div className="mt-4 flex items-center justify-between">
                {isSearching ? (
                  <div>
                    Found {filteredInvoices.length} result{filteredInvoices.length !== 1 ? 's' : ''}
                    {searchTerm && ` for "${searchTerm}"`}
                  </div>
                ) : (
                  <div>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} results
                  </div>
                )}

                {!isSearching && (
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
                      disabled={currentPage * itemsPerPage >= totalEntries}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InvoicesPageComponent;
