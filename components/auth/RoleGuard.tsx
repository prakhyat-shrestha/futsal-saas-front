"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";

const ROLE_HOME: Record<UserRole, string> = {
  VENUE_OWNER: "/dashboard",
  PLAYER: "/play",
  ADMIN: "/admin",
};

export function RoleGuard({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return; // wait for persisted auth state to load first

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allow.includes(user.role)) {
      router.replace(ROLE_HOME[user.role] ?? "/login");
      return;
    }

    setAuthorized(true);
  }, [hasHydrated, user, allow, router]);

  if (!hasHydrated || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}