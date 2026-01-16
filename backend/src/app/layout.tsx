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
      <head>
        <title>Lotto Verse</title>
        <meta name="title" content="Lotto Verse" />
        <meta
          name="description"
          content="Join thousands of winners in the most exciting lucky draw platform. Download our app and start your winning journey today."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lotto-verse.vercel.app/" />
        <meta property="og:title" content="Lotto Verse" />
        <meta
          property="og:description"
          content="Join thousands of winners in the most exciting lucky draw platform. Download our app and start your winning journey today."
        />
        <meta
          property="og:image"
          content="https://lotto-verse.vercel.app/assets/images/og.webp"
        />
      </head>
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
