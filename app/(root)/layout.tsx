import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { AnnouncementBanner } from "./page";

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
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBanner />

          <NavBar />
        </div>

        <main className="flex-1 pt-[calc(2.5rem+3.5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
