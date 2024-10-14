"use client";

import { useState, useEffect, useCallback} from "react";
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
  where,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatCurrency } from "@/utils/currency";
import Navbar from "@/layout/Navbar";
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

  // Fetch initial data
  useEffect(() => {
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

      setTotalEntries(querySnapshot.size); // update this logic to fetch the full count of documents
    };


      const fetchTotalCount = async () => {
        const totalSnapshot = await getDocs(collection(db, "invoice"));
        setTotalEntries(totalSnapshot.size); // This gives you the total count
      };


    fetchInvoices();
    fetchTotalCount();
  }, []);

  const handleNextPage = async () => {
    if (currentPage < pageSnapshots.length) {
      // If the next page is already cached, just load it from the stored snapshots
      setInvoices(pageSnapshots[currentPage]);
      setCurrentPage(currentPage + 1);
    } else {
      // Fetch new page data from Firestore
      const invoiceQuery = query(
        collection(db, "invoice"),
        limit(itemsPerPage),
        orderBy("invoiceDate", "desc"),
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

      // Store this page's data
      setPageSnapshots([...pageSnapshots, newInvoices]);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) return; // Already on the first page

    // Load the previous page's data from stored snapshots
    setInvoices(pageSnapshots[currentPage - 2]);
    setCurrentPage(currentPage - 1);
  };

  // Filter invoices based on search term and selected date
  // Normalize both invoice date and selected date to 'YYYY-MM-DD'
  // Filter invoices based on search term and selected date
  const filteredInvoices = invoices
    .filter(
      (invoice) =>
        String(invoice.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(invoice.invoiceNo)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .filter((invoice) => {
      // Normalize and compare dates if selectedDate is provided
      if (!selectedDate) return true; // If no date is selected, return all results

      // Ensure invoice has an invoiceDate and normalize to 'YYYY-MM-DD'
      if (invoice.invoiceDate) {
        const invoiceDateFormatted = format(
          invoice.invoiceDate.toDate(),
          "yyyy-MM-dd"
        );
        const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

        return invoiceDateFormatted === selectedDateFormatted;
      }
      return false; // No match if the invoice doesn't have a date
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
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNo}</TableCell>
                        <TableCell>{invoice.name}</TableCell>
                        <TableCell>
                          {format(invoice.invoiceDate.toDate(), "dd-MM-yyyy")}
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
                              invoiceDate={invoice.invoiceDate.toDate()}
                              products={invoice.productTable}
                            />

                            <EditInvoiceButton currentInvoice={invoice} />

                            <PrintInvoiceButton
                              invoiceData={invoice}
                              invoiceDate={invoice.invoiceDate.toDate()}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// export function InvoicesPageComponent() {
//   const [invoices, setInvoices] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDate, setSelectedDate] = useState<any>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastVisible, setLastVisible] = useState<any>(null);
//   const [totalEntries, setTotalEntries] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const itemsPerPage = 10;

//   const fetchInvoices = useCallback(async (
//     searchTerm: string,
//     date: Date | null,
//     pageSize: number,
//     startAfterDoc: any = null
//   ) => {
//     setLoading(true);
//     let invoiceQuery: any = collection(db, "invoice");

//     // Build the query based on search term and date
//     const constraints: any[] = [];

//     if (searchTerm) {
//       // Convert search term to lowercase for case-insensitive search
//       const lowercaseSearchTerm = searchTerm.toLowerCase();
//       console.log("Searching for:", lowercaseSearchTerm); // Debug log
//       constraints.push(where("keywords", "array-contains", lowercaseSearchTerm));
//     }

//     if (date) {
//       const startOfDay = new Date(date.setHours(0, 0, 0, 0));
//       const endOfDay = new Date(date.setHours(23, 59, 59, 999));
//       constraints.push(
//         where("invoiceDate", ">=", Timestamp.fromDate(startOfDay)),
//         where("invoiceDate", "<=", Timestamp.fromDate(endOfDay))
//       );
//     }

//     invoiceQuery = query(
//       invoiceQuery,
//       ...constraints,
//       orderBy("invoiceDate", "desc"),
//       limit(pageSize)
//     );

//     if (startAfterDoc) {
//       invoiceQuery = query(invoiceQuery, startAfter(startAfterDoc));
//     }

//     console.log("Executing query..."); // Debug log
//     const querySnapshot = await getDocs(invoiceQuery);
//     console.log("Query executed. Results:", querySnapshot.size); // Debug log

//     const fetchedInvoices = querySnapshot.docs.map((doc : any) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     setInvoices(fetchedInvoices);
//     setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
//     setLoading(false);

//     // Fetch total count (this might be expensive for large collections)
//     const totalSnapshot = await getDocs(query(collection(db, "invoice"), ...constraints));
//     setTotalEntries(totalSnapshot.size);
//   }, []);

//   useEffect(() => {
//     fetchInvoices(searchTerm, selectedDate, itemsPerPage);
//   }, [fetchInvoices, searchTerm, selectedDate]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newSearchTerm = e.target.value;
//     console.log("Search term changed:", newSearchTerm); // Debug log
//     setSearchTerm(newSearchTerm);
//     setCurrentPage(1);
//   };

//   const handleDateSelect : any = (date: Date | null) => {
//     setSelectedDate(date);
//     setCurrentPage(1);
//   };

//   const handleNextPage = () => {
//     if (lastVisible) {
//       setCurrentPage(currentPage + 1);
//       fetchInvoices(searchTerm, selectedDate, itemsPerPage, lastVisible);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       // You might need to implement a way to get the previous page's last document
//       // This could involve storing the last visible document of each page
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
//         <Card>
//           <CardContent>
//             <div className="px-4 py-6 sm:px-0">
//               <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>

//               <div className="mt-4 flex justify-between items-center">
//                 <div className="flex items-center space-x-2">
//                   <Input
//                     type="text"
//                     placeholder="Search invoices..."
//                     value={searchTerm}
//                     onChange={handleSearch}
//                     className="max-w-sm"
//                   />
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="w-[240px] justify-start text-left font-normal"
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {selectedDate ? (
//                           format(selectedDate, "PPP")
//                         ) : (
//                           <span>Pick a date</span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={handleDateSelect}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {selectedDate && (
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleDateSelect(null)}
//                     >
//                       Clear Date
//                     </Button>
//                   )}
//                 </div>

//                 {/* Columns Dropdown */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" className="ml-auto">
//                       Columns <ChevronDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Invoice No
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Customer Name
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Date
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Total Amount
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Advance
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem checked={true}>
//                       Outstanding
//                     </DropdownMenuCheckboxItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               {/* Table Body */}
//               <div className="mt-4">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Invoice No</TableHead>
//                       <TableHead>Customer Name</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Total Amount</TableHead>
//                       <TableHead>Advance</TableHead>
//                       <TableHead>Outstanding</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       invoices.map((invoice) => (
//                         <TableRow key={invoice.id}>
//                           <TableCell>{invoice.invoiceNo}</TableCell>
//                           <TableCell>{invoice.name}</TableCell>
//                           <TableCell>
//                             {format(invoice.invoiceDate.toDate(), "dd-MM-yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             {formatCurrency(invoice.totalAmt)}
//                           </TableCell>
//                           <TableCell>{formatCurrency(invoice.payment)}</TableCell>
//                           <TableCell>
//                             {formatCurrency(invoice.totalAmt - invoice.payment)}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <ViewInvoiceButton
//                                 invoiceData={invoice}
//                                 invoiceDate={invoice.invoiceDate.toDate()}
//                                 products={invoice.productTable}
//                               />
//                               <EditInvoiceButton currentInvoice={invoice} />
//                               <PrintInvoiceButton
//                                 invoiceData={invoice}
//                                 invoiceDate={invoice.invoiceDate.toDate()}
//                                 products={invoice.productTable}
//                               />
//                               <DeleteInvoiceButton
//                                 invoices={invoices}
//                                 invoice={invoice}
//                                 setInvoices={setInvoices}
//                               />
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Pagination and Total Rows */}
//               <div className="mt-4 flex items-center justify-between">
//                 <div>
//                   Showing {Math.min(currentPage * itemsPerPage, totalEntries)}{" "}
//                   out of {totalEntries} results
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button
//                     variant="outline"
//                     onClick={handlePreviousPage}
//                     disabled={currentPage === 1 || loading}
//                   >
//                     Previous
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={handleNextPage}
//                     disabled={invoices.length < itemsPerPage || loading}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }