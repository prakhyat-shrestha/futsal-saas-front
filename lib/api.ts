import { useAuthStore } from "@/store/authStore";

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(message: string, status: number, body?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Global session-expiry handling — applies to every call through this helper
  if (res.status === 401) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login?reason=session_expired";
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // some responses (e.g. 204 No Content) have no body — that's fine
  }

  if (!res.ok || (json && json.success === false)) {
    const message = json?.message ?? `Request failed with status ${res.status}.`;
    throw new ApiError(message, res.status, json);
  }

  return (json?.data ?? json) as T;
}