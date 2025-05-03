import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Type Book",
  description: "Practice typing by typing a book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* Navigation */}
        <nav className="bg-gray-900 px-6 py-4 flex gap-6 items-center shadow-md">
          <Link href="/my-books" className="text-white hover:underline text-sm">
            My Library
          </Link>
          <Link href="/books" className="text-white hover:underline text-sm">
            Search Books
          </Link>
        </nav>

        {/* Global Layout Container */}
        <main className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          {children}
        </main>
      </body>
    </html>
  );
}

