"use client";

import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, Smartphone } from "lucide-react";
import http from "../utils/http";
import { AppVersion, Prisma } from "../lib/db/prisma/generated/prisma";
import { Button, buttonVariants } from "../components/ui/button";
import { openApp } from "../utils/openApp";
import { cn } from "../lib/utils";

export default function HeroLandingPage() {
  const { data, isFetching } = useQuery({
    queryKey: ["latest-update"],
    queryFn: () => http.get<AppVersion>("/update/latest"),
    select: (res) => res.data,
  });

  const { data: users = [], isFetching: isFetchingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => http.get<Prisma.UserGetPayload<{}>[]>("/admin/users"),
    select: (res) => res.data,
  });

  return (
    <div className="min-h-screen bg-white text-black h-screen">
      {/* Mock Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tight">
            Lotto<span className="text-gray-400">Verse</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-black transition">
              Home
            </a>
            <a href="#" className="hover:text-black transition">
              Winners
            </a>
            <a href="#" className="hover:text-black transition">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto min-h-full flex items-center px-4 py-20">
        <div className="max-w-3xl h-full">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight">
            Simple.
            <br />
            Fair.
            <br />
            Rewarding.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            A modern lucky draw platform trusted by thousands. Download the app
            and start participating in verified daily draws.
          </p>

          {/* Download CTA */}
          <div className="mt-10 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center">
            {isFetching ? (
              <div className="inline-flex items-center md:w-auto w-full  justify-center h-14 px-8 rounded-xl bg-black text-white font-semibold">
                Loading...
              </div>
            ) : data?.downloadUrl ? (
              <a
                href={data.downloadUrl}
                target="_blank"
                className={cn(
                  buttonVariants({
                    className:
                      "inline-flex items-center md:w-auto w-full justify-center h-14 px-8 font-semibold",
                  }),
                )}
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download App
              </a>
            ) : (
              <div
                className={cn(
                  buttonVariants({
                    className:
                      "inline-flex items-center md:w-auto w-full justify-center h-14 px-8 rounded-xl bg-gray-200 text-gray-600 font-semibold",
                  }),
                )}
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                App Not Available
              </div>
            )}
            <Button
              variant="outline"
              className="inline-flex md:w-auto w-full items-center gap-4 h-14 px-8 rounded-xl font-semibold transition"
              onClick={() => openApp("/")}
            >
              <Smartphone className="w-5 h-5" />
              Open The App
            </Button>
          </div>

          {/* Minimal Stats */}
          <div className="mt-16 flex  items-center justify-center md:justify-start gap-8 max-w-xl">
            <Stat
              value={isFetchingUsers ? "..." : users?.length.toString() || "0"}
              label="Active Users"
            />
            <Stat value="₹50L+" label="Rewards Paid" />
            <Stat value="99%" label="User Trust" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm text-gray-500 font-medium mt-1">{label}</div>
    </div>
  );
}
