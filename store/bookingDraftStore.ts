import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookingDraft {
  venueId: string;
  venueName: string;
  courtId: string;
  courtName: string;
  pitchType: string;
  imageUrl: string;
  date: string;       // ISO date, e.g. "2026-11-18"
  dateLabel: string;   // "Saturday, 18th Nov"
  timeRange: string;   // "19:00 - 20:00"
  pricePerHour: number;
  totalDue: number;
}

interface BookingDraftState {
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
}

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    { name: "futsal-booking-draft" }
  )
);