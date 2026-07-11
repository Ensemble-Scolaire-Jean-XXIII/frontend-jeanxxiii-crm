"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { prospectService } from "./services/prospectService";
import { userService } from "./services/userService";
import { automationService } from "./services/automationService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    prospects: 0,
    users: 0,
    automations: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [pData, uData, aData] = await Promise.all([
        prospectService.getAll(),
        userService.getAll().catch(() => null),
        automationService.getAll().catch(() => []),
      ]);

      const isUserAdmin = Array.isArray(uData);

      setStats({
        prospects: Array.isArray(pData) ? pData.length : 0,
        users: isUserAdmin ? (uData as any[]).length : 0,
        automations: Array.isArray(aData) ? aData.length : 0,
      });
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
          Tableau de bord
        </h1>
        <p className="text-white/80 mt-1">
          Bienvenue sur votre espace de gestion Jean XXIII
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
            Prospects totaux
          </h2>
          <span className="text-4xl font-bold text-white">
            {isLoading ? "-" : stats.prospects}
          </span>
        </div>

        {isAdmin && (
          <>
            <div className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                Utilisateurs
              </h2>
              <span className="text-4xl font-bold text-white">
                {isLoading ? "-" : stats.users}
              </span>
            </div>
            <div className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                Règles auto
              </h2>
              <span className="text-4xl font-bold text-white">
                {isLoading ? "-" : stats.automations}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden flex flex-col">
          <div className="bg-black/10 px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Actions rapides</h2>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <Link
              href="/prospects"
              className="group flex items-center justify-between p-3 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white"
            >
              <span className="font-medium text-sm">Nouveau prospect</span>
              <span className="text-lg">+</span>
            </Link>
            <Link
              href="/templates"
              className="group flex items-center justify-between p-3 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white"
            >
              <span className="font-medium text-sm">Nouveau template</span>
              <span className="text-lg">+</span>
            </Link>
            {isAdmin && (
              <Link
                href="/automations"
                className="group flex items-center justify-between p-3 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white"
              >
                <span className="font-medium text-sm">
                  Gérer automatisations
                </span>
                <span className="text-lg">+</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
