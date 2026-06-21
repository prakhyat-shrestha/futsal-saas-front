"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutGrid,
  MapPin,
  CalendarDays,
  Wallet,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/venues", label: "My Venues", icon: MapPin },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/dashboard/earnings", label: "Earnings", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <span className="font-syne font-extrabold text-xl text-gray-900 tracking-tight">
          FUTSALPRO
        </span>
        <p className="font-dm text-xs text-gray-400 mt-0.5">Venue Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-dm text-sm transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-500/10 text-green-700 font-syne font-bold flex items-center justify-center text-sm shrink-0">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="font-dm text-sm text-gray-900 font-medium truncate">
            {user?.name ?? "User"}
          </p>
          <p className="font-dm text-xs text-gray-400 truncate">
            {user?.tenantId ? "City Arena" : ""}
          </p>
        </div>
      </div>
    </aside>
  );
}