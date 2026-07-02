// ─── Auth & Roles ────────────────────────────────────────────────────────────
export type UserRole = "ADMIN" | "VENUE_OWNER" | "PLAYER";

export type SurfaceType = "GRASS" | "ARTIFICIAL" | "FUTSAL" | "INDOOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  //tenantId?: string; // vendor's org ID
  createdAt: string;
  phone?: string;
}

// ─── Tenant (Vendor / Business) ──────────────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
}

// ─── Venue ───────────────────────────────────────────────────────────────────
export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  description?:string;
  address: string;
  city: string;
  imageUrl?: string;
  latitude: number;  // "06:00"
  longitude: number; // "23:00"
  phone?:string;
  email?:string;
  isActive:boolean;
  createdAt: string;
}

// ─── Court ───────────────────────────────────────────────────────────────────
//export type CourtSurface = "artificial_grass" | "hardwood" | "rubber" | "concrete";

// export interface Court {
//   id: string;
//   venueId: string;
//   name: string;
//   surface: CourtSurface;
//   capacity: number; // players per side e.g. 5
//   pricePerHour: number;
//   isActive: boolean;
//   imageUrl?: string;
// }

// ─── Pitch ───────────────────────────────────────────────────────────────────

export interface Pitch {
  id: string;
  venueId: string;
  name: string;
  description?: string;
  surface: SurfaceType;
  capacity: number;
  pricePerHour: string; // Prisma Decimal comes as string over JSON
  isActive: boolean;
  imageUrls: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

// keep Court as alias so nothing else breaks yet
// once you've updated all consumers, remove this
export type Court = Pitch;

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "10:00"
}

export interface Booking {
  id: string;
  courtId: string;
  venueId: string;
  tenantId: string;
  playerId: string;
  playerName: string;
  date: string; // "2025-06-15"
  timeSlot: TimeSlot;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  monthRevenue: number;
  activeCourts: number;
  totalVenues: number;
}

