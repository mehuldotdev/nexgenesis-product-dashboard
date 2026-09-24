import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { Navbar } from "@/components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexGenesis Admin - Product Dashboard",
  description: "Product inventory, search, and catalog management dashboard for NexGenesis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
        <AuthProvider>
          <ProductProvider>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
