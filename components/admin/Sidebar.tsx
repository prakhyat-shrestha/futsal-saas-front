"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  TrendingUp,
  HelpCircle,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/venues", label: "Venues", icon: MapPin },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/finance", label: "Finance", icon: Wallet },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0B1F17] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <span className="font-syne font-extrabold text-xl text-green-400 tracking-tight">
          PITCHFAST
        </span>
        <p className="font-dm text-xs text-gray-500 mt-0.5">Management Suite</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-dm text-sm transition-colors ${
                active
                  ? "bg-green-400 text-black font-semibold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-dm text-xs text-gray-400">System Status: Active</span>
        </div>

        <Link
          href="/admin/support"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-dm text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <HelpCircle size={18} />
          Support
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-dm text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}