import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';
import { Venue, Court, CourtSurface } from '@/types';

import { useAuthStore } from '@/store/authStore';

interface VenueState {
  venues: Venue[];
  courts: Court[];
  isLoading: boolean;
  error: string | null;

  selectedVenueId: string | null;

  setSelectedVenue: (id: string) => void;
  fetchVenues: () => Promise<void>;
  addVenue: (venue: Omit<Venue, 'id' | 'createdAt'>) => void;
  updateVenue: (id: string, data: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;

  addCourt: (court: Omit<Court, 'id'>) => void;
  updateCourt: (id: string, data: Partial<Court>) => void;
  deleteCourt: (id: string) => void;

  getVenuesByTenant: (tenantId: string) => Venue[];
  getCourtsByVenue: (venueId: string) => Court[];

  reset: () => void;
}

const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    ownerId: 't1',
    name: 'Arena North',
    address: '123 Sports Blvd',
    city: 'Kathmandu',
    openTime: '06:00',
    closeTime: '23:00',
    imageUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    ownerId: 't1',
    name: 'Downtown Court',
    address: '45 Central Ave',
    city: 'Patan',
    openTime: '07:00',
    closeTime: '22:00',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_COURTS: Court[] = [
  {
    id: 'c1',
    venueId: 'v1',
    name: 'Court A',
    surface: 'artificial_grass',
    capacity: 5,
    pricePerHour: 1200,
    isActive: true,
  },
  { id: 'c2', venueId: 'v1', name: 'Court B', surface: 'hardwood', capacity: 5, pricePerHour: 1500, isActive: true },
  { id: 'c3', venueId: 'v2', name: 'Main Court', surface: 'rubber', capacity: 6, pricePerHour: 1000, isActive: true },
];

export const useVenueStore = create<VenueState>()(
  persist(
    (set, get) => ({
      venues: [],
      courts: MOCK_COURTS,
      selectedVenueId: 'v1',

      isLoading: false,
      error: null,
      setSelectedVenue: (id) => set({ selectedVenueId: id }),

      fetchVenues: async () => {
        set({ isLoading: true, error: null });
        try {
          const venues = await apiRequest<Venue[]>('/venues/mine', { method: 'GET' });
          set({
            venues,
            selectedVenueId: venues[0]?.id ?? null,
            isLoading: false,
          });
        } catch (err: any) {
          set({ isLoading: false, error: err.message ?? 'Something went wrong.' });
        }
      },

      addVenue: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const venue = await apiRequest<Venue>("/venues", {
            method: "POST",
            body: JSON.stringify(data),
          });
          set((s) => ({ venues: [...s.venues, venue], isLoading: false }));
          return venue;
        } catch (err: any) {
          set({ isLoading: false, error: err.message ?? "Something went wrong." });
          throw err;
        }
      },

      updateVenue: (id, data) => set((s) => ({ venues: s.venues.map((v) => (v.id === id ? { ...v, ...data } : v)) })),

      deleteVenue: (id) => set((s) => ({ venues: s.venues.filter((v) => v.id !== id) })),

      addCourt: (data) => {
        const court: Court = { ...data, id: `c_${Date.now()}` };
        set((s) => ({ courts: [...s.courts, court] }));
      },

      updateCourt: (id, data) => set((s) => ({ courts: s.courts.map((c) => (c.id === id ? { ...c, ...data } : c)) })),

      deleteCourt: (id) => set((s) => ({ courts: s.courts.filter((c) => c.id !== id) })),

      getVenuesByTenant: (tenantId) => get().venues.filter((v) => v.ownerId === tenantId),
      getCourtsByVenue: (venueId) => get().courts.filter((c) => c.venueId === venueId),
      reset: () =>
        set({
          venues: [],
          selectedVenueId: null,
          isLoading: false,
          error: null,
        }),
    }),

    { name: 'futsal-venues', partialize: (state) => ({ courts: state.courts }) }
  )
);
