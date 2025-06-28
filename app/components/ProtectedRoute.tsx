"use client";

import { useLocalAuth } from "@/app/hooks/useLocalAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useLocalAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 bengali-text">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 bengali-heading">
            লগইন প্রয়োজন
          </h1>
          <p className="text-gray-600 mb-6 bengali-text">
            এই পৃষ্ঠাটি দেখতে লগইন প্রয়োজন
          </p>
          <a
            href="/auth/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 bengali-text"
          >
            লগইন করুন
          </a>
        </div>
      </div>
    );
  }

  // Since all users have full access, no need to check admin role separately
  return <>{children}</>;
} 