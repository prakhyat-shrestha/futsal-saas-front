"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";
import { useBookingStore } from "@/store/bookingStore";
import { formatCurrency, formatDate, formatTime, generateTimeSlots, STATUS_COLORS, SURFACE_LABELS } from "@/lib/utils";
import { Court, TimeSlot } from "@/types";

export default function BookingPage() {
  const { user } = useAuthStore();
  const { venues, courts, selectedVenueId, setSelectedVenue, getCourtsByVenue } = useVenueStore();
  const { bookings, selectedDate, setSelectedDate, createBooking, getBookingsByCourt, isSlotTaken } = useBookingStore();

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const tenantVenues = venues.filter((v) => v.tenantId === user?.tenantId);
  const activeVenue = tenantVenues.find((v) => v.id === selectedVenueId) ?? tenantVenues[0];
  const venueCourts = activeVenue ? getCourtsByVenue(activeVenue.id) : [];

  const timeSlots = activeVenue ? generateTimeSlots(activeVenue.openTime, activeVenue.closeTime) : [];

  const playerBookings = bookings.filter((b) => b.playerId === user?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  async function handleBook() {
    if (!selectedCourt || !selectedSlot || !activeVenue || !user) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 600));
    createBooking({
      courtId: selectedCourt.id,
      venueId: activeVenue.id,
      tenantId: activeVenue.tenantId,
      playerId: user.id,
      playerName: user.name,
      date: selectedDate,
      timeSlot: { start: selectedSlot, end: `${String(parseInt(selectedSlot) + 1).padStart(2, "0")}:00` },
      status: "pending",
      totalPrice: selectedCourt.pricePerHour,
    });
    setConfirming(false);
    setSuccess(true);
    setSelectedSlot(null);
    setSelectedCourt(null);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl mb-1">Book a Court</h1>
        <p className="font-dm text-white/40 text-sm">Select venue, court, date and time</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/15 border border-green-500/30 rounded-xl px-5 py-4 text-green-400 font-dm text-sm animate-fade-in">
          ✅ Booking submitted! It's pending confirmation from the venue admin.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Selection panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Venue selector */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-syne font-semibold mb-4">Select Venue</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tenantVenues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => { setSelectedVenue(venue.id); setSelectedCourt(null); setSelectedSlot(null); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    activeVenue?.id === venue.id
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-white/10 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <p className="font-syne font-semibold text-sm">{venue.name}</p>
                  <p className="font-dm text-xs text-white/40 mt-1">{venue.address}, {venue.city}</p>
                  <p className="font-dm text-xs text-white/30 mt-1">{venue.openTime} – {venue.closeTime}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-syne font-semibold mb-4">Select Date</h2>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>

          {/* Court selector */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-syne font-semibold mb-4">Select Court</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {venueCourts.map((court) => (
                <button
                  key={court.id}
                  onClick={() => { setSelectedCourt(court); setSelectedSlot(null); }}
                  disabled={!court.isActive}
                  className={`p-4 rounded-xl border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedCourt?.id === court.id
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-white/10 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-syne font-semibold text-sm">{court.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${court.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {court.isActive ? "Available" : "Inactive"}
                    </span>
                  </div>
                  <p className="font-dm text-xs text-white/40">{SURFACE_LABELS[court.surface]} · {court.capacity}v{court.capacity}</p>
                  <p className="font-dm text-sm text-green-400 font-semibold mt-2">{formatCurrency(court.pricePerHour)}/hr</p>
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          {selectedCourt && (
            <div className="glass rounded-2xl p-6 animate-fade-up">
              <h2 className="font-syne font-semibold mb-4">Select Time Slot</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot) => {
                  const taken = isSlotTaken(selectedCourt.id, selectedDate, { start: slot, end: "" });
                  const selected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={taken}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-dm font-medium transition-all ${
                        taken
                          ? "bg-red-500/10 text-red-400/50 border border-red-500/10 cursor-not-allowed line-through"
                          : selected
                          ? "bg-green-500 text-black border border-green-400"
                          : "bg-white/5 text-white/70 border border-white/10 hover:border-green-500/40 hover:text-green-400"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs font-dm text-white/40">
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded" /> Selected</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/20 rounded" /> Taken</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-white/10 rounded" /> Available</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary + My bookings */}
        <div className="space-y-6">
          {/* Booking summary */}
          <div className="glass rounded-2xl p-6 sticky top-8">
            <h2 className="font-syne font-semibold mb-5">Booking Summary</h2>
            {selectedCourt && selectedSlot ? (
              <>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Venue", value: activeVenue?.name },
                    { label: "Court", value: selectedCourt.name },
                    { label: "Date", value: formatDate(selectedDate) },
                    { label: "Time", value: `${formatTime(selectedSlot)} – ${formatTime(`${String(parseInt(selectedSlot) + 1).padStart(2, "0")}:00`)}` },
                    { label: "Surface", value: SURFACE_LABELS[selectedCourt.surface] },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm font-dm">
                      <span className="text-white/40">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-syne font-bold">
                    <span>Total</span>
                    <span className="text-green-400">{formatCurrency(selectedCourt.pricePerHour)}</span>
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={confirming}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01]"
                >
                  {confirming ? "Booking..." : "Confirm Booking"}
                </button>
              </>
            ) : (
              <p className="font-dm text-white/30 text-sm text-center py-8">
                Select a court and time slot to see summary
              </p>
            )}
          </div>

          {/* My bookings */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-syne font-semibold mb-4 text-base">My Bookings</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {playerBookings.slice(0, 8).map((booking) => {
                const court = courts.find((c) => c.id === booking.courtId);
                return (
                  <div key={booking.id} className="p-3 bg-white/3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-syne font-medium text-xs">{court?.name ?? "Court"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="font-dm text-xs text-white/40">
                      {formatDate(booking.date)} · {booking.timeSlot.start}
                    </p>
                  </div>
                );
              })}
              {playerBookings.length === 0 && (
                <p className="font-dm text-white/30 text-xs text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
