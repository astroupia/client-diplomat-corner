import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "react-phone-number-input/style.css";
import { Suspense } from "react";
import LoadingComponent from "@/components/ui/loading-component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diplomat Corner",
  description: "Diplomat Corner - Your trusted marketplace For Diplomats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<LoadingComponent />}>
          <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: "#5B8F2D",
              },
            }}
          >
            {children}
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
