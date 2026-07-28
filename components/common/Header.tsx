import { Search, Bell, Settings } from "lucide-react";
import UserProfile from "./userProfile";
 


export function Header() {
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

        <UserProfile/>
      </div>
    </header>
  );
}