"use client";
import { useAuth } from "../hooks/auth/useAuth";

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <div className="flex h-screen items-center justify-center">
      {isSignedIn ? "Signin" : "Signout"}
    </div>
  );
}
