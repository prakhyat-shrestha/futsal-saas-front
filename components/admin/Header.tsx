"use client";

import { Search, Bell, Settings } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-20 bg-gray-50 flex items-center justify-between px-8 border-b border-gray-100">
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search analytics or bookings"
          className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-2.5 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Settings">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="font-dm text-sm font-semibold text-gray-900 leading-tight">Alex Rivera</p>
            <p className="font-dm text-xs text-gray-400 leading-tight">System Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-700 font-syne font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}