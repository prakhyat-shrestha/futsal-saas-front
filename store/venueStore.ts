import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Venue, Court, CourtSurface } from "@/types";

interface VenueState {
  venues: Venue[];
  courts: Court[];
  selectedVenueId: string | null;

  setSelectedVenue: (id: string) => void;
  addVenue: (venue: Omit<Venue, "id" | "createdAt">) => void;
  updateVenue: (id: string, data: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;

  addCourt: (court: Omit<Court, "id">) => void;
  updateCourt: (id: string, data: Partial<Court>) => void;
  deleteCourt: (id: string) => void;

  getVenuesByTenant: (tenantId: string) => Venue[];
  getCourtsByVenue: (venueId: string) => Court[];
}

const MOCK_VENUES: Venue[] = [
  {
    id: "v1",
    tenantId: "t1",
    name: "Arena North",
    address: "123 Sports Blvd",
    city: "Kathmandu",
    openTime: "06:00",
    closeTime: "23:00",
    imageUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v2",
    tenantId: "t1",
    name: "Downtown Court",
    address: "45 Central Ave",
    city: "Patan",
    openTime: "07:00",
    closeTime: "22:00",
    imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    createdAt: new Date().toISOString(),
  },
];

const MOCK_COURTS: Court[] = [
  { id: "c1", venueId: "v1", name: "Court A", surface: "artificial_grass", capacity: 5, pricePerHour: 1200, isActive: true },
  { id: "c2", venueId: "v1", name: "Court B", surface: "hardwood", capacity: 5, pricePerHour: 1500, isActive: true },
  { id: "c3", venueId: "v2", name: "Main Court", surface: "rubber", capacity: 6, pricePerHour: 1000, isActive: true },
];

export const useVenueStore = create<VenueState>()(
  persist(
    (set, get) => ({
      venues: MOCK_VENUES,
      courts: MOCK_COURTS,
      selectedVenueId: "v1",

      setSelectedVenue: (id) => set({ selectedVenueId: id }),

      addVenue: (data) => {
        const venue: Venue = { ...data, id: `v_${Date.now()}`, createdAt: new Date().toISOString() };
        set((s) => ({ venues: [...s.venues, venue] }));
      },

      updateVenue: (id, data) =>
        set((s) => ({ venues: s.venues.map((v) => (v.id === id ? { ...v, ...data } : v)) })),

      deleteVenue: (id) =>
        set((s) => ({ venues: s.venues.filter((v) => v.id !== id) })),

      addCourt: (data) => {
        const court: Court = { ...data, id: `c_${Date.now()}` };
        set((s) => ({ courts: [...s.courts, court] }));
      },

      updateCourt: (id, data) =>
        set((s) => ({ courts: s.courts.map((c) => (c.id === id ? { ...c, ...data } : c)) })),

      deleteCourt: (id) =>
        set((s) => ({ courts: s.courts.filter((c) => c.id !== id) })),

      getVenuesByTenant: (tenantId) => get().venues.filter((v) => v.tenantId === tenantId),
      getCourtsByVenue: (venueId) => get().courts.filter((c) => c.venueId === venueId),
    }),
    { name: "futsal-venues" }
  )
);
