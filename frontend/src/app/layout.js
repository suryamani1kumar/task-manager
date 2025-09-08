"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname !== "/" && (
          <div className="bg-blue-500 text-white">
            <div className="container p-3 flex justify-between">
              <div className="text-2xl font-medium">
                <Link
                  href="/dashboard"
                  className="text-white text-decoration-none"
                >
                  Dashboard
                </Link>
              </div>
              
            </div>
          </div>
        )}

        {children}
        {pathname !== "/" && (
          <div className="bg-body-secondary">
            <div className="container p-3 text-center">
              &#169; {new Date().getFullYear()} Dashboard. All Right Reserved
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
