"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { prospectService } from "./services/prospectService";
import { taskService } from "./services/taskService";
import { userService } from "./services/userService";
import { Prospect, Task } from "./types/index";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    prospects: 0,
    tasksTotal: 0,
    tasksPending: 0,
    users: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [pData, tData, uData] = await Promise.all([
        prospectService.getAll(),
        taskService.getAll(),
        userService.getAll().catch(() => null),
      ]);

      const prospects = pData as Prospect[];
      const tasks = tData as Task[];

      const isUserAdmin = Array.isArray(uData);
      const pendingTasks = tasks.filter((t) => !t.is_completed);
      const sortedTasks = pendingTasks
        .sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
        )
        .slice(0, 5);

      setStats({
        prospects: prospects.length,
        tasksTotal: tasks.length,
        tasksPending: pendingTasks.length,
        users: isUserAdmin ? (uData as any[]).length : 0,
      });
      setIsAdmin(isUserAdmin);
      setUpcomingTasks(sortedTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Prospects totaux",
            val: stats.prospects,
            color: "text-white",
          },
          {
            title: "Tâches en cours",
            val: stats.tasksPending,
            color: "text-accent",
          },
          {
            title: "Tâches totales",
            val: stats.tasksTotal,
            color: "text-white",
          },
          isAdmin && {
            title: "Utilisateurs",
            val: stats.users,
            color: "text-white",
          },
        ]
          .filter(Boolean)
          .map((stat: any, i) => (
            <div
              key={i}
              className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg"
            >
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                {stat.title}
              </h2>
              <span className={`text-4xl font-bold ${stat.color}`}>
                {isLoading ? "-" : stat.val}
              </span>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden flex flex-col">
          <div className="bg-black/10 px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Actions rapides</h2>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {[
              { href: "/prospects", label: "Nouveau prospect" },
              { href: "/tasks", label: "Nouvelle tâche" },
              { href: "/templates", label: "Nouveau template" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between p-3 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white"
              >
                <span className="font-medium text-sm">{link.label}</span>
                <span className="text-lg">+</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/20 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden">
          <div className="bg-black/10 px-6 py-4 flex justify-between items-center border-b border-white/10">
            <h2 className="font-semibold text-white">Prochaines échéances</h2>
            <Link
              href="/tasks"
              className="text-xs font-medium text-accent hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 text-white">Chargement...</div>
            ) : (
              <table className="w-full text-left text-white">
                <tbody>
                  {upcomingTasks.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium">
                        {t.task_type_id}
                      </td>
                      <td className="p-4 text-sm opacity-80">
                        {new Date(t.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-1 bg-black/20 rounded-full text-xs">
                          En cours
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
