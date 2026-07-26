"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { href: "/play", label: "Find a Pitch" },
  { href: "/play/bookings", label: "My Bookings" },
];

export function PlayerHeader() {
  const router = useRouter()
  const {logout} = useAuthStore();
  const pathname = usePathname();

  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

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
          <Link href="/" onClick={handleLogout} className="font-dm text-sm text-gray-600 border border-gray-200 rounded-2xl px-4 py-2 hover:text-gray-900 transition-colors">
            Logout
          </Link>
          
        </div>
      </div>
    </header>
  );
}