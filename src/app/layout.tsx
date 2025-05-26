import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import Image from "next/image";


const code = Fira_Code({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-code',
})

export const metadata: Metadata = {
  title: "Type Book",
  description: "Practice typing by typing a book",
};


import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${code.variable} antialiased bg-black text-white`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased bg-black text-white">
        <nav className="bg-gray-900 px-2 py-2 flex gap-2 items-center shadow-md font-bold">

          <Link
            href="/"
            aria-label="Home"
            className="
              inline-flex items-center justify-center
              w-8 h-8           /* 32×32 container */
              rounded
              hover:bg-gray-700
              transition-colors duration-200
            "
          >
            <Image
              src="/favicon.png"
              alt="Home"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>

          {/* Other nav links */}
          <Link
            href="/my-books"
            className="p-1 rounded hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            My Library
          </Link>
          <Link
            href="/books"
            className="p-1 rounded hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            Search Books
          </Link>
        </nav>

        <main className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          {children}
        </main>
      </body>
    </html>
  )
}

