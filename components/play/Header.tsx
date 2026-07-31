"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { href: "/play", label: "Find a Pitch" },
  { href: "/play/bookings", label: "My Bookings" },
];

export function PlayerHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasHydrated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/login");
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/play" className="font-syne font-extrabold text-lg text-gray-900 tracking-tight">
          PITCHFAST
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-dm text-sm transition-colors ${
                  active ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {!hasHydrated ? (
            <div className="w-24 h-9" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-700 font-syne font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <p className="font-dm text-sm font-medium text-gray-900 hidden md:block">{user.name}</p>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1.5 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 font-dm text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="font-dm text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full bg-green-500 hover:bg-green-400 text-black font-syne font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}