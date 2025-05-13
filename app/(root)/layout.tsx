import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diplomat Corner",
  description: "Diplomat Corner - Your trusted marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <Suspense fallback={<Loading />}>
          <main className="flex-1 pt-20">{children}</main>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
