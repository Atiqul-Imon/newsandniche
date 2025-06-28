"use client";

import { useState, useEffect, useCallback } from "react";

const LOCAL_STORAGE_KEY = "superblog_user";

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
}

export function useLocalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize user object to always have _id
  function normalizeUser(u: User | null): User | null {
    if (!u) return null;
    if (u.id && !u._id) u._id = u.id;
    if (u._id && !u.id) u.id = u._id;
    if (u.email) u.email = u.email.toLowerCase();
    return u;
  }

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setUser(normalizeUser(JSON.parse(stored)));
    }
    setIsLoading(false);
    // Listen for localStorage changes (multi-tab support)
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        setUser(e.newValue ? normalizeUser(JSON.parse(e.newValue)) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
      setUser(normalizeUser(data.user));
      return { success: true, user: normalizeUser(data.user) };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
      setUser(normalizeUser(data.user));
      return { success: true, user: normalizeUser(data.user) };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
} 