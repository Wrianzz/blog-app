import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Models } from "appwrite";
import { account } from "../lib/appwrite";

type AuthContextValue = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const adminEmails = new Set(
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (adminEmails.size === 0) return true;
    return adminEmails.has(user.email.toLowerCase());
  }, [user]);

  const refreshUser = async () => {
    try {
      const me = await account.get();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession({
      email,
      password
    });

    await refreshUser();
  };

  const logout = async () => {
    await account.deleteSession({
      sessionId: "current"
    });

    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}