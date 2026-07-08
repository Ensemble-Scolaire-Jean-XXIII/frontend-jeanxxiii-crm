import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Image
          src="/j23.webp"
          alt="Logo Jean 23"
          width={50}
          height={50}
          className="rounded-xl border-2 border-accent"
        />
        <h1 className="text-3xl font-bold tracking-tight text-secondary">
          Tableau de bord
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-secondary p-6 rounded-xl border-t-4 border-t-accent shadow-sm">
          <h2 className="font-bold mb-4 text-primary">Actions rapides</h2>
          <nav className="flex flex-col gap-3">
            <Link
              href="/prospects"
              className="text-foreground hover:text-accent font-medium text-sm border-b dark:border-secondary-hover pb-2 transition-colors"
            >
              + Ajouter un prospect
            </Link>
            <Link
              href="/tasks"
              className="text-foreground hover:text-accent font-medium text-sm transition-colors"
            >
              + Créer une tâche
            </Link>
          </nav>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 dark:border-secondary-hover shadow-sm">
          <h2 className="font-bold mb-4 text-primary">Statistiques</h2>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold text-accent">0</span>
            <span className="text-sm font-medium text-secondary">
              Prospects actifs
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 dark:border-secondary-hover shadow-sm">
          <h2 className="font-bold mb-4 text-primary">Prochaines échéances</h2>
          <p className="text-sm italic text-foreground">Aucune tâche prévue</p>
        </div>
      </div>
    </div>
  );
}
