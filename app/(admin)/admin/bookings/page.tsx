"use client";

import { useState } from "react";
import {
  ChevronRight,
  Download,
  Calendar,
  Gamepad2,
  Headset,
  AlertTriangle,
  ChevronDown,
  Filter,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { HighlightStatCard } from "@/components/admin/HighlightStatCard";
import { StatusFilterTabs, BookingStatusFilter } from "@/components/admin/StatusFilterTabs";
import { BookingRow, Booking } from "@/components/admin/BookingRow";
import { Pagination } from "@/components/admin/Pagination";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    bookingRef: "#PF-12845",
    venueName: "The Apex Hub",
    venueImageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=200&q=80",
    playerName: "Alex Rivera",
    dateLabel: "Oct 24, 2023",
    timeRange: "19:00 - 20:00",
    amount: 65.0,
    status: "Confirmed",
  },
  {
    id: "2",
    bookingRef: "#PF-12842",
    venueName: "Powerplay Central",
    venueImageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200&q=80",
    playerName: "Sarah Jenkins",
    dateLabel: "Oct 24, 2023",
    timeRange: "20:30 - 22:00",
    amount: 120.0,
    status: "Disputed",
  },
  {
    id: "3",
    bookingRef: "#PF-12840",
    venueName: "The Goal Box",
    venueImageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=200&q=80",
    playerName: "Marco Silva",
    dateLabel: "Oct 24, 2023",
    timeRange: "18:00 - 19:00",
    amount: 45.0,
    status: "Pending",
  },
  {
    id: "4",
    bookingRef: "#PF-12838",
    venueName: "Urban Turf Arena",
    venueImageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=200&q=80",
    playerName: "Alex Striker",
    dateLabel: "Oct 23, 2023",
    timeRange: "21:00 - 22:30",
    amount: 85.0,
    status: "Cancelled",
  },
];

const PAGE_SIZE = 4;
const TOTAL_BOOKINGS_FILTERED = 18;

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("All");
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_BOOKINGS_FILTERED / PAGE_SIZE);

  function handleContact(id: string) {
    console.log("Contact booking", id);
  }

  function handleRefund(id: string) {
    console.log("Refund booking", id);
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-dm text-sm text-gray-400 mb-4">
        <span>Management</span>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Bookings</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">Bookings Management</h1>
          <p className="font-dm text-sm text-gray-500">Monitor and resolve booking issues across all venues.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-black font-syne font-bold px-5 py-3 rounded-full text-sm transition-colors shrink-0">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={Calendar}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend="+8.2%"
          label="Total Bookings"
          value="4,281"
          sub=""
        />
        <StatCard
          icon={Gamepad2}
          iconBg="bg-lime-100"
          iconColor="text-lime-700"
          trend="LIVE"
          label="Active Matches"
          value="154"
          sub=""
        />
        <StatCard
          icon={Headset}
          iconBg="bg-red-100"
          iconColor="text-red-500"
          trend="12 High"
          trendType="alert"
          label="Support Tickets"
          value="42"
          sub=""
        />
        <HighlightStatCard label="Revenue at Risk" value="$2,450.00" icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-dm text-sm font-medium text-gray-500">Status:</span>
          <StatusFilterTabs active={statusFilter} onChange={setStatusFilter} />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-dm text-sm font-medium text-gray-500">Date:</span>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 font-dm text-sm text-gray-900 hover:border-gray-300 transition-colors">
            <Calendar size={14} className="text-gray-400" />
            This Month
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 font-dm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={14} />
            More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  Booking ID
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Venue Name
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Player Name
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Date &amp; Time
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Amount
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Status
                </th>
                <th className="text-right font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BOOKINGS.map((booking) => (
                <BookingRow key={booking.id} booking={booking} onContact={handleContact} onRefund={handleRefund} />
              ))}
            </tbody>
          </table>
        </div>

        {MOCK_BOOKINGS.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-dm text-sm text-gray-400">No bookings match this filter.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="font-dm text-sm text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, TOTAL_BOOKINGS_FILTERED)} of{" "}
            {TOTAL_BOOKINGS_FILTERED} bookings
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}