import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// custom imports
import { InvoiceEditProvider } from "@/context/invoiceEditContext";
import Navbar from "@/layout/Navbar";
import { ThemeProvider } from "../components/theme-provider";
import { Sidebar } from "@/components/cash-ledger/sidebar";
import { Header } from "@/components/cash-ledger/header";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vaibhav Jewellers",
  description: "Invoice app for Shree Vaibhav Jewellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <InvoiceEditProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar/>
              <div className="flex flex-col flex-1 overflow-hidden w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </InvoiceEditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
