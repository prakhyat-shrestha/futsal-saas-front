"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";
import { useBookingStore } from "@/store/bookingStore";
import { formatCurrency, formatDate, STATUS_COLORS, SURFACE_LABELS } from "@/lib/utils";
import { BookingStatus, CourtSurface } from "@/types";

type Tab = "venues" | "courts" | "bookings";

export default function AdminPage() {
  const { user } = useAuthStore();
  const { venues, courts, addVenue, addCourt, deleteCourt, updateCourt, getCourtsByVenue } = useVenueStore();
  const { bookings, updateBookingStatus, cancelBooking } = useBookingStore();

  const [tab, setTab] = useState<Tab>("venues");
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [showAddCourt, setShowAddCourt] = useState(false);

  // Add venue form
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueOpen, setVenueOpen] = useState("06:00");
  const [venueClose, setVenueClose] = useState("23:00");

  // Add court form
  const [courtName, setCourtName] = useState("");
  const [courtVenueId, setCourtVenueId] = useState("");
  const [courtSurface, setCourtSurface] = useState<CourtSurface>("artificial_grass");
  const [courtCapacity, setCourtCapacity] = useState(5);
  const [courtPrice, setCourtPrice] = useState(1200);

  const tenantVenues = venues.filter((v) => v.tenantId === user?.tenantId);
  const tenantCourts = courts.filter((c) => tenantVenues.some((v) => v.id === c.venueId));
  const tenantBookings = bookings.filter((b) => b.tenantId === user?.tenantId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (user?.role !== "vendor_admin") {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <p className="font-syne font-bold text-xl mb-2">Access Restricted</p>
          <p className="font-dm text-white/40 text-sm">Only venue admins can access the admin panel.</p>
        </div>
      </div>
    );
  }

  function handleAddVenue(e: React.FormEvent) {
    e.preventDefault();
    addVenue({ tenantId: user!.tenantId!, name: venueName, address: venueAddress, city: venueCity, openTime: venueOpen, closeTime: venueClose });
    setVenueName(""); setVenueAddress(""); setVenueCity("");
    setShowAddVenue(false);
  }

  function handleAddCourt(e: React.FormEvent) {
    e.preventDefault();
    addCourt({ venueId: courtVenueId, name: courtName, surface: courtSurface, capacity: courtCapacity, pricePerHour: courtPrice, isActive: true });
    setCourtName(""); setCourtVenueId("");
    setShowAddCourt(false);
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "venues", label: "Venues", count: tenantVenues.length },
    { key: "courts", label: "Courts", count: tenantCourts.length },
    { key: "bookings", label: "All Bookings", count: tenantBookings.length },
  ];

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl mb-1">Admin Panel</h1>
        <p className="font-dm text-white/40 text-sm">Manage your venues, courts and bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-dm transition-all ${
              tab === t.key ? "bg-green-500/15 text-green-400 border border-green-500/20" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${tab === t.key ? "bg-green-500/30" : "bg-white/10"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── VENUES ── */}
      {tab === "venues" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-semibold text-lg">Your Venues</h2>
            <button
              onClick={() => setShowAddVenue(!showAddVenue)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold text-sm px-4 py-2 rounded-xl transition-all"
            >
              + Add Venue
            </button>
          </div>

          {showAddVenue && (
            <form onSubmit={handleAddVenue} className="glass rounded-2xl p-6 mb-6 animate-fade-up">
              <h3 className="font-syne font-semibold mb-4">New Venue</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Venue Name", value: venueName, set: setVenueName, placeholder: "Arena North" },
                  { label: "Address", value: venueAddress, set: setVenueAddress, placeholder: "123 Sports Blvd" },
                  { label: "City", value: venueCity, set: setVenueCity, placeholder: "Kathmandu" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block font-dm text-xs text-white/50 mb-1.5">{f.label}</label>
                    <input
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-dm text-xs text-white/50 mb-1.5">Open Time</label>
                    <input type="time" value={venueOpen} onChange={(e) => setVenueOpen(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block font-dm text-xs text-white/50 mb-1.5">Close Time</label>
                    <input type="time" value={venueClose} onChange={(e) => setVenueClose(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-syne font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">Save Venue</button>
                <button type="button" onClick={() => setShowAddVenue(false)} className="bg-white/5 hover:bg-white/10 text-white/60 font-dm text-sm px-5 py-2.5 rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenantVenues.map((venue) => {
              const venueCourts = getCourtsByVenue(venue.id);
              const venueBookings = tenantBookings.filter((b) => b.venueId === venue.id);
              return (
                <div key={venue.id} className="glass rounded-2xl p-6 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 text-xl">🏟️</div>
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-1" />
                  </div>
                  <h3 className="font-syne font-semibold mb-1">{venue.name}</h3>
                  <p className="font-dm text-xs text-white/40 mb-4">{venue.address}, {venue.city}</p>
                  <div className="flex items-center gap-4 text-xs font-dm text-white/50 pt-4 border-t border-white/5">
                    <span>{venueCourts.length} courts</span>
                    <span>{venueBookings.length} bookings</span>
                    <span>{venue.openTime}–{venue.closeTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── COURTS ── */}
      {tab === "courts" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-semibold text-lg">Courts</h2>
            <button
              onClick={() => setShowAddCourt(!showAddCourt)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold text-sm px-4 py-2 rounded-xl transition-all"
            >
              + Add Court
            </button>
          </div>

          {showAddCourt && (
            <form onSubmit={handleAddCourt} className="glass rounded-2xl p-6 mb-6 animate-fade-up">
              <h3 className="font-syne font-semibold mb-4">New Court</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-dm text-xs text-white/50 mb-1.5">Court Name</label>
                  <input value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="Court A" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block font-dm text-xs text-white/50 mb-1.5">Venue</label>
                  <select value={courtVenueId} onChange={(e) => setCourtVenueId(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors">
                    <option value="">Select venue</option>
                    {tenantVenues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-dm text-xs text-white/50 mb-1.5">Surface</label>
                  <select value={courtSurface} onChange={(e) => setCourtSurface(e.target.value as CourtSurface)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors">
                    {Object.entries(SURFACE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-dm text-xs text-white/50 mb-1.5">Price / Hour (NPR)</label>
                  <input type="number" value={courtPrice} onChange={(e) => setCourtPrice(+e.target.value)} min={100}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block font-dm text-xs text-white/50 mb-1.5">Players per side</label>
                  <input type="number" value={courtCapacity} onChange={(e) => setCourtCapacity(+e.target.value)} min={3} max={11}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-dm text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-syne font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">Save Court</button>
                <button type="button" onClick={() => setShowAddCourt(false)} className="bg-white/5 hover:bg-white/10 text-white/60 font-dm text-sm px-5 py-2.5 rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenantCourts.map((court) => {
              const venue = venues.find((v) => v.id === court.venueId);
              return (
                <div key={court.id} className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-syne font-black text-sm text-white/70">
                      {court.name.slice(0, 2).toUpperCase()}
                    </div>
                    <button
                      onClick={() => updateCourt(court.id, { isActive: !court.isActive })}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${court.isActive ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30" : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30"}`}
                    >
                      {court.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <h3 className="font-syne font-semibold mb-0.5">{court.name}</h3>
                  <p className="font-dm text-xs text-white/40 mb-1">{venue?.name}</p>
                  <p className="font-dm text-xs text-white/30 mb-4">{SURFACE_LABELS[court.surface]} · {court.capacity}v{court.capacity}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-syne font-bold text-green-400 text-sm">{formatCurrency(court.pricePerHour)}/hr</span>
                    <button onClick={() => deleteCourt(court.id)} className="text-xs text-red-400/60 hover:text-red-400 font-dm transition-colors">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === "bookings" && (
        <div className="animate-fade-in">
          <h2 className="font-syne font-semibold text-lg mb-5">All Bookings</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Player", "Court / Venue", "Date & Time", "Price", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left font-dm text-xs text-white/40 px-5 py-4 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenantBookings.map((booking) => {
                    const court = courts.find((c) => c.id === booking.courtId);
                    const venue = venues.find((v) => v.id === booking.venueId);
                    return (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-dm text-sm text-white">{booking.playerName}</p>
                          <p className="font-dm text-xs text-white/30 mt-0.5">{booking.playerId}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-dm text-sm">{court?.name}</p>
                          <p className="font-dm text-xs text-white/40">{venue?.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-dm text-sm">{formatDate(booking.date)}</p>
                          <p className="font-dm text-xs text-white/40">{booking.timeSlot.start} – {booking.timeSlot.end}</p>
                        </td>
                        <td className="px-5 py-4 font-syne font-semibold text-sm">{formatCurrency(booking.totalPrice)}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-dm px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <button onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg font-dm transition-colors">
                                Confirm
                              </button>
                              <button onClick={() => cancelBooking(booking.id)}
                                className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-dm transition-colors">
                                Cancel
                              </button>
                            </div>
                          )}
                          {booking.status === "confirmed" && (
                            <button onClick={() => updateBookingStatus(booking.id, "completed")}
                              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg font-dm transition-colors">
                              Mark Done
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {tenantBookings.length === 0 && (
                <p className="font-dm text-white/30 text-sm text-center py-12">No bookings yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
