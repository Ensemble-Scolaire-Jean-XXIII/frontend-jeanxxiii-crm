import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <Image
        className="rounded-4xl"
        src="/j23.webp"
        alt="Logo Jean 23"
        width={100}
        height={20}
        priority
      />
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Bienvenue sur votre Tableau de bord
      </h1>
    </main>
  );
}
