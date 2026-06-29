"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

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
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}