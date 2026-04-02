import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "./components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyWallet",
  description: "Track your income, expenses, and budgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              MyWallet
            </Link>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Transactions
              </Link>
              <Link
                href="/budget"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Budget
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Dashboard
              </Link>
              
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            © 2026 Personal Finance Tracker. Manage your finances smartly.
          </div>
        </footer>

        <ToastContainer />
      </body>
    </html>
  );
}
