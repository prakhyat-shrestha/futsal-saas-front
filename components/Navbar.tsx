"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
//import { MobileMenu } from "./MobileMenu"

const ROLE_LABEL: Record<UserRole, string> = {
  VENUE_OWNER: "Venue Owner",
  PLAYER: "Player",
  ADMIN: "Admin",
};

const ROLE_HOME: Record<UserRole, string> = {
  VENUE_OWNER: "/dashboard",
  PLAYER: "/play",
  ADMIN: "/admin",
};

export function Navbar() {
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

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                FutsalPro
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="#features"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!hasHydrated ? (
              // avoid a flash of "Log in / Sign up" before persisted auth state loads
              <div className="w-32 h-9" />
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
                      user.name?.charAt(0).toUpperCase() ?? "U"
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-dm text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
                    <p className="font-dm text-xs text-gray-400 leading-tight">{ROLE_LABEL[user.role]}</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1.5 z-50">
                    <Link
                      href={ROLE_HOME[user.role]}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-dm text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutGrid size={15} className="text-gray-400" />
                      Go to {ROLE_LABEL[user.role] === "Player" ? "App" : "Dashboard"}
                    </Link>
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
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" className="ml-3">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          {/* <MobileMenu /> */}
        </div>
      </div>
    </nav>
  );
}