"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";

import { formatCurrency, formatDate, STATUS_COLORS } from "@/lib/utils";

import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const { venues, courts } = useVenueStore();

  const today = new Date().toISOString().split("T")[0];
  const tenantBookings = bookings.filter((b) => b.tenantId === user?.tenantId);
  const todayBookings = tenantBookings.filter((b) => b.date === today);
  const totalRevenue = tenantBookings.filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const monthRevenue = tenantBookings
    .filter((b) => {
      const month = new Date().getMonth();
      return new Date(b.date).getMonth() === month && (b.status === "confirmed" || b.status === "completed");
    })
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const tenantVenues = venues.filter((v) => v.tenantId === user?.tenantId);
  const recentBookings = [...tenantBookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: "📅", sub: `${tenantBookings.length} total`, color: "green" },
    { label: "Monthly Revenue", value: formatCurrency(monthRevenue), icon: "💰", sub: `${formatCurrency(totalRevenue)} all time`, color: "blue" },
    { label: "Active Courts", value: courts.filter((c) => c.isActive).length, icon: "🏟️", sub: `${tenantVenues.length} venues`, color: "purple" },
    { label: "Confirmed Today", value: todayBookings.filter((b) => b.status === "confirmed").length, icon: "✅", sub: `${todayBookings.filter((b) => b.status === "pending").length} pending`, color: "amber" },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-syne font-bold text-3xl mb-1">
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="font-dm text-white/40 text-sm">{formatDate(today)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-6 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="font-syne font-bold text-2xl mb-1">{stat.value}</div>
            <div className="font-dm text-sm text-white/60">{stat.label}</div>
            <div className="font-dm text-xs text-white/30 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-syne font-semibold text-lg">Recent Bookings</h2>
            <Link href="/booking" className="text-green-400 hover:text-green-300 text-sm font-dm transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="font-dm text-white/30 text-sm text-center py-8">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => {
                const court = courts.find((c) => c.id === booking.courtId);
                const venue = tenantVenues.find((v) => v.id === booking.venueId);
                return (
                  <div key={booking.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 font-syne font-bold text-sm shrink-0">
                      {court?.name.slice(0, 2).toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-dm text-sm text-white font-medium truncate">
                        {booking.playerName} — {court?.name}
                      </p>
                      <p className="font-dm text-xs text-white/40 mt-0.5">
                        {venue?.name} · {formatDate(booking.date)} · {booking.timeSlot.start}–{booking.timeSlot.end}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-dm text-sm text-white/60">{formatCurrency(booking.totalPrice)}</span>
                      <span className={`text-xs font-dm px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Venues */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-syne font-semibold text-lg">Your Venues</h2>
            {user?.role === "vendor_admin" && (
              <Link href="/admin" className="text-green-400 hover:text-green-300 text-sm font-dm transition-colors">
                Manage →
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {tenantVenues.map((venue) => {
              const venueCourts = courts.filter((c) => c.venueId === venue.id);
              const venueBookings = todayBookings.filter((b) => b.venueId === venue.id);
              return (
                <div key={venue.id} className="p-4 bg-white/3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-syne font-semibold text-sm">{venue.name}</p>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <p className="font-dm text-xs text-white/40 mb-3">{venue.city}</p>
                  <div className="flex items-center gap-4 text-xs font-dm text-white/50">
                    <span>{venueCourts.length} courts</span>
                    <span>{venueBookings.length} today</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
