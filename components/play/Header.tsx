"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import UserProfile from "../common/userProfile";

const NAV_ITEMS = [
  { href: "/play", label: "Find a Pitch" },
  { href: "/play/bookings", label: "My Bookings" },
];

export function PlayerHeader() {
  const router = useRouter()
  const { logout } = useAuthStore();
  const pathname = usePathname();


  // const handleLogout = () => {
  //   logout();

  // };
  const [showProfile, setShowProfile] = useState<boolean>()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/play" className="font-syne font-extrabold text-lg text-gray-900 tracking-tight">
          PITCHFAST
        </Link>

        <nav className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-dm text-sm transition-colors ${active ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-700 font-syne font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
          <button onClick={() => { setShowProfile(!showProfile) }} >AR</button>
        </div>
        <div className="absolute right-6 xl:right-32 mt-64">
          {showProfile && (
            <UserProfile />
          )}
        </div>

        {/* <div className="flex items-center gap-4">
          <Link href="/" onClick={handleLogout} className="font-dm text-sm text-gray-600 border border-gray-200 rounded-2xl px-4 py-2 hover:text-gray-900 hover:bg-gray-200 transition-colors">
            Logout
          </Link>
          
        </div> */}
      </div>
    </header>
  );
}