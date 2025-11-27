"use client";
import { Smartphone, Trophy } from "lucide-react";
import http from "../utils/http";
import { logger } from "../utils/logger";
import Link from "next/link";

export default function HeroLandingPage() {
  const onClickDownload = async () => {
    try {
      const res = await http.get("/release/download");

      if (res.success) {
        window.location.href = res.data;
      }
    } catch (error) {
      logger.error("Error downloading APK", error);
    }
  };

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
                    <div className="text-xs opacity-80">Download on</div>
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

          {/* Right Side - Login Card */}
          <div className="lg:ml-auto w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              {/* Login Header */}
              <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-black text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-600">
                  Login to access your account and lucky numbers
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wide"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 font-medium">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-blue-600 font-bold hover:text-blue-700"
                  >
                    Forgot?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  Sign up free
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
