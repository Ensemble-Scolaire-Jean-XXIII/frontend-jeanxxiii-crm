"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password_hash: passwordHash }),
        },
      );

      if (!res.ok) throw new Error("Identifiants invalides");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-secondary p-8 shadow-md border-t-4 border-t-accent">
        <h1 className="mb-6 text-2xl font-bold text-primary">Connexion CRM</h1>
        {error && <p className="mb-4 text-danger font-bold">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="rounded-lg border border-primary bg-transparent p-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="rounded-lg border border-primary bg-transparent p-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-accent p-3 text-white font-bold hover:opacity-90 transition-opacity"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
