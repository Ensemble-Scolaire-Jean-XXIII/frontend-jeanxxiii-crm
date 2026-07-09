"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { parseJwt } from "../lib/auth";
import Image from "next/image";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative px-6 py-3 transition-all duration-300 flex items-center gap-3 font-medium border-l-4 border-transparent ${
        isActive
          ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full bg-accent transition-all duration-300 ${
          isActive
            ? "w-1 opacity-100"
            : "w-0 opacity-0 group-hover:w-[2px] group-hover:opacity-100"
        }`}
      ></span>

      {children}
    </Link>
  );
}

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
      setIsAdmin(decoded.role === "admin");
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
    <div className="flex flex-col h-screen overflow-hidden bg-transparent relative">
      <div className="slideshow-container">
        <div className="slide bg-1"></div>
        <div className="slide bg-2"></div>
        <div className="slide bg-3"></div>
        <div className="slide bg-4"></div>
        <div className="slide bg-5"></div>
      </div>

      <header className="h-16 bg-primary text-white flex items-center justify-between px-6 border-b border-white/10 shadow-md shrink-0 z-20">
        <div className="font-bold text-lg tracking-wide flex items-center gap-3">
          <Image
            src="/j23.webp"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          JEAN XXIII CRM
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-danger hover:bg-danger-hover text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <span>⏻</span> Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-transparent z-10">
        <aside className="w-64 bg-secondary/95 backdrop-blur-md text-white flex flex-col shrink-0 overflow-y-auto border-r border-white/10">
          <nav className="p-4 flex flex-col gap-1.5">
            <NavLink href="/">Tableau de bord</NavLink>
            {isAdmin && <NavLink href="/users">Utilisateurs</NavLink>}
            <NavLink href="/prospects">Prospects</NavLink>
            <NavLink href="/tasks">Tâches</NavLink>
            <NavLink href="/statuses">Statuts</NavLink>
            <NavLink href="/templates">Templates</NavLink>
            <NavLink href="/profile">Mon Profile</NavLink>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
