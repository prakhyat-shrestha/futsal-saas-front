"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("admin@futsalpro.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
          <span className="text-black font-syne font-black">F</span>
        </div>
        <span className="font-syne font-bold text-2xl text-gray-900">FutsalPro</span>
      </div>

      <div className="glass rounded-2xl p-8">
        <h1 className="font-syne font-bold text-2xl mb-1 text-gray-900">Welcome back</h1>
        <p className="font-dm text-gray-500 text-sm mb-8">Sign in to your account</p>

        {/* Demo credentials hint */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-xs font-dm text-green-700">
          <p className="font-semibold mb-1">Demo credentials:</p>
          <p>Admin: admin@futsalpro.com / password</p>
          <p>Player: player@futsalpro.com / password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-dm text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-dm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="font-dm text-gray-500 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:text-green-700 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
