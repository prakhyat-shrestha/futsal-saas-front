import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Booking, BookingStatus, TimeSlot } from "@/types";

interface BookingState {
  bookings: Booking[];
  selectedDate: string;

  setSelectedDate: (date: string) => void;
  createBooking: (data: Omit<Booking, "id" | "createdAt">) => void;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;

  getBookingsByDate: (venueId: string, date: string) => Booking[];
  getBookingsByCourt: (courtId: string, date: string) => Booking[];
  getBookingsByPlayer: (playerId: string) => Booking[];
  isSlotTaken: (courtId: string, date: string, slot: TimeSlot) => boolean;
}

const today = new Date().toISOString().split("T")[0];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1", courtId: "c1", venueId: "v1", tenantId: "t1",
    playerId: "u2", playerName: "Jordan Mith",
    date: today, timeSlot: { start: "09:00", end: "10:00" },
    status: "confirmed", totalPrice: 1200, createdAt: new Date().toISOString(),
  },
  {
    id: "b2", courtId: "c1", venueId: "v1", tenantId: "t1",
    playerId: "u2", playerName: "Jordan Mith",
    date: today, timeSlot: { start: "11:00", end: "12:00" },
    status: "pending", totalPrice: 1200, createdAt: new Date().toISOString(),
  },
  {
    id: "b3", courtId: "c2", venueId: "v1", tenantId: "t1",
    playerId: "u2", playerName: "Jordan Mith",
    date: today, timeSlot: { start: "14:00", end: "15:00" },
    status: "confirmed", totalPrice: 1500, createdAt: new Date().toISOString(),
  },
];

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: MOCK_BOOKINGS,
      selectedDate: today,

      setSelectedDate: (date) => set({ selectedDate: date }),

      createBooking: (data) => {
        const booking: Booking = { ...data, id: `b_${Date.now()}`, createdAt: new Date().toISOString() };
        set((s) => ({ bookings: [...s.bookings, booking] }));
      },

      cancelBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) => b.id === id ? { ...b, status: "cancelled" } : b),
        })),

      updateBookingStatus: (id, status) =>
        set((s) => ({
          bookings: s.bookings.map((b) => b.id === id ? { ...b, status } : b),
        })),

      getBookingsByDate: (venueId, date) =>
        get().bookings.filter((b) => b.venueId === venueId && b.date === date),

      getBookingsByCourt: (courtId, date) =>
        get().bookings.filter((b) => b.courtId === courtId && b.date === date),

      getBookingsByPlayer: (playerId) =>
        get().bookings.filter((b) => b.playerId === playerId),

      isSlotTaken: (courtId, date, slot) =>
        get().bookings.some(
          (b) =>
            b.courtId === courtId &&
            b.date === date &&
            b.status !== "cancelled" &&
            b.timeSlot.start === slot.start
        ),
    }),
    { name: "futsal-bookings" }
  )
);
