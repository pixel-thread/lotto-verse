"use client";
import { Smartphone, Trophy } from "lucide-react";
import Link from "next/link";

export default function HeroLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold uppercase">
                <Trophy className="w-4 h-4" />
                <span>Win Big Today!</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Your Lucky Numbers Await
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands of winners in the most exciting lucky draw
                platform. Download our app and start your winning journey today.
              </p>
            </div>

            {/* App Download Buttons */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Download Our App
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/api/release/download"
                  className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                >
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xl opacity-80">Download on</div>
                    <div className="text-lg">Lotto Verse</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600">10K+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">₹50L+</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Prizes Won
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-600">99%</div>
                <div className="text-xs text-gray-600 font-semibold">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
