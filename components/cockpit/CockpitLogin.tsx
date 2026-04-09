"use client";

import { useState } from "react";

interface CockpitLoginProps {
  onLogin: () => void;
}

export default function CockpitLogin({ onLogin }: CockpitLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        setError("Wrong password");
        setPassword("");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="w-full max-w-[280px] flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold tracking-wider text-text-primary">
            CL
          </span>
          <span className="text-sm text-text-muted">Cockpit</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="h-12 w-full rounded-xl bg-background-elevated border border-border-default px-4 text-center text-lg tracking-widest text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !password}
            className="h-12 w-full rounded-xl bg-accent-blue text-white font-medium transition-opacity disabled:opacity-50"
          >
            {isLoading ? "..." : "Login"}
          </button>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
