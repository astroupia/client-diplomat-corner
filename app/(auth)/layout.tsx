"use client";

import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout min-h-screen">
      <div className="w-full px-0 sm:px-4 md:px-6 lg:px-8">{children}</div>
    </div>
  );
}
