"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { env } from "@/src/env";
import { AuthProvider } from "../components/provider/auth";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new QueryClient();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookiesProvider>
          <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ClerkLoaded>
              <QueryClientProvider client={client}>
                <AuthProvider>{children}</AuthProvider>
              </QueryClientProvider>
            </ClerkLoaded>
          </ClerkProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
