import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "O-I CRM",
  description: "מערכת ניהול לידים ולקוחות - O-I",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NavBar />
        <main className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
