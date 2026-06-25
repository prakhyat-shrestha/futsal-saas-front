"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/play", label: "Find a Pitch" },
  { href: "/play/bookings", label: "My Bookings" },
];

export function PlayerHeader() {
  const pathname = usePathname();

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
        </div>
      </div>
    </header>
  );
}