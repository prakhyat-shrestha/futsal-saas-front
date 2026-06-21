"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("VENUE_OWNER");
  const [error, setError] = useState("");

   async function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     setError("");
     try {
       await signup(name, email, password, role, phone);
       router.push("/dashboard");
     } catch (err: any) {
       setError(err.message ?? "Something went wrong. Please try again.");
     }
   }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-center gap-2 mb-10">
        <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
          <span className="text-black font-syne font-black">F</span>
        </div>
        <span className="font-syne font-bold text-2xl text-gray-900">FutsalPro</span>
      </div>

      <div className="glass rounded-2xl p-8">
        <h1 className="font-syne font-bold text-2xl mb-1 text-gray-900">Create an account</h1>
        <p className="font-dm text-gray-500 text-sm mb-8">Get started with FutsalPro for free</p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { value: "VENUE_OWNER", label: "Venue Owner", icon: "🏟️", desc: "Manage venues & courts" },
            { value: "PLAYER", label: "Player", icon: "⚽", desc: "Book courts & play" },
          ] as { value: UserRole; label: string; icon: string; desc: string }[]).map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                role === r.value
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className="text-xl mb-1">{r.icon}</div>
              <div className="font-syne font-semibold text-sm text-gray-900">{r.label}</div>
              <div className="font-dm text-gray-500 text-xs mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-dm text-sm text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
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
            <label className="block font-dm text-sm text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-colors"
              placeholder="9876344222"
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
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="font-dm text-gray-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:text-green-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}