"use client"
import React, { useEffect, useRef, useState } from 'react'
import { UserPen, LogOut, ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { UserRole } from '@/types';


export default function UserProfile() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, hasHydrated } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleLogout = () => {
        logout();
        router.push("/");
    }
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
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            {/* //<button onClick={() => { setShowProfile(!showProfile) }} className="flex items-center gap-3 pl-2 bg-gray-50 hover:bg-gray-100 rounded-full h-10 px-2"> */}
            <div className=" sm:ml-6 sm:flex sm:items-center">
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
                            {menuOpen ? (<ChevronDown size={14} className="text-gray-400" />) : (<ChevronUp size={14} className="text-gray-400" />)}

                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1.5 z-50">
                                {pathname === "/" && (
                                    <Link
                                        href={ROLE_HOME[user.role]}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 font-dm text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LayoutGrid size={15} className="text-gray-400" />
                                        Go to {ROLE_LABEL[user.role] === "Player" ? "App" : "Dashboard"}
                                    </Link>
                                )}
                                {pathname.length > 1 && (

                                    <div className="flex items-center gap-2.5 px-4 py-2.5 font-dm text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <UserPen size={15} className="text-gray-400" />
                                        Profile
                                    </div>
                                )}

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
        </div>
    )
}
