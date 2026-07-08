"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { parseJwt } from "../lib/auth";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(!isLoginPage);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded) {
      handleLogout();
    } else {
      const userRole = decoded.role || decoded.user?.role;
      setIsAdmin(userRole === "admin");
      setIsLoading(false);
    }
  }, [isLoginPage, router, handleLogout]);

  if (isLoginPage) return <>{children}</>;
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* HEADER SURPLOMBANT */}
      <header className="h-16 bg-primary text-white flex items-center justify-between px-6 border-b border-primary-hover shadow-sm shrink-0 z-20">
        <div className="font-bold text-lg tracking-wide">JEAN XXIII CRM</div>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-sm hover:underline">
            Mon Profil
          </Link>
          <button
            onClick={handleLogout}
            className="bg-danger px-3 py-1 rounded text-sm"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* SIDEBAR + MAIN */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-secondary text-white flex flex-col shrink-0 overflow-y-auto">
          <nav className="p-4 flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-2 hover:bg-secondary-hover rounded"
            >
              Tableau de bord
            </Link>
            {isAdmin && (
              <Link
                href="/users"
                className="px-4 py-2 hover:bg-secondary-hover rounded font-bold text-accent"
              >
                Utilisateurs
              </Link>
            )}
            <Link
              href="/prospects"
              className="px-4 py-2 hover:bg-secondary-hover rounded"
            >
              Prospects
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2 hover:bg-secondary-hover rounded"
            >
              Tâches
            </Link>
            <Link
              href="/statuses"
              className="px-4 py-2 hover:bg-secondary-hover rounded"
            >
              Statuts
            </Link>
            <Link
              href="/templates"
              className="px-4 py-2 hover:bg-secondary-hover rounded"
            >
              Templates
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
