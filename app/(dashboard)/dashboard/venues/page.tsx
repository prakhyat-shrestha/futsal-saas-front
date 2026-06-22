"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useVenueStore } from "@/store/venueStore";

export default function MyVenuesPage() {
  const { venues } = useVenueStore();
  const [search, setSearch] = useState("");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">My Pitches</h1>
          <p className="font-dm text-gray-500 text-sm">
            Manage your venues, check performance, and update availability.
          </p>
        </div>
        <Link
          href="/dashboard/venues/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New Venue
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venues by name or location..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
          />
        </div>
        <FilterDropdown label="All Statuses" />
        <FilterDropdown label="Pitch Type" />
        <button className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-dm text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={15} />
          More Filters
        </button>
      </div>

      {/* Venue grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {venues
          .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
          .map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}

        {/* Add another venue */}
        <Link
          href="/dashboard/venues/new"
          className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:border-green-500/40 hover:bg-green-500/5 transition-colors min-h-[260px]"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Plus size={20} className="text-gray-500" />
          </div>
          <p className="font-syne font-semibold text-sm text-gray-900 mb-1.5">Add another venue</p>
          <p className="font-dm text-xs text-gray-400 max-w-[200px]">
            Grow your sports empire. List a new pitch to start taking bookings instantly.
          </p>
        </Link>
      </div>
    </div>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-dm text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      {label}
      <ChevronDown size={14} className="text-gray-400" />
    </button>
  );
}

function VenueCard({ venue }: { venue: any }) {
  const isActive = venue.status !== "maintenance";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Image */}
      <div className="relative h-40">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className={`w-full h-full object-cover ${!isActive ? "grayscale" : ""}`}
        />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-xs font-dm font-medium px-2.5 py-1 rounded-full ${
            isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
          {isActive ? "Active" : "Maintenance"}
        </span>
        <span className="absolute top-3 right-3 bg-white text-gray-900 text-xs font-dm font-semibold px-2.5 py-1 rounded-full">
          ${venue.pricePerHour}/hr
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-syne font-semibold text-base text-gray-900 truncate pr-2">
            {venue.name}
          </h3>
          <span className="font-dm text-xs text-gray-400 shrink-0">{venue.pitchType}</span>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <div>
            <p className="font-dm text-[11px] uppercase tracking-wide text-gray-400 mb-0.5">
              Bookings Today
            </p>
            <p className="font-syne font-bold text-sm text-gray-900">{venue.bookingsToday ?? 0}</p>
          </div>
          <div>
            <p className="font-dm text-[11px] uppercase tracking-wide text-gray-400 mb-0.5">
              Weekly Revenue
            </p>
            <p className="font-syne font-bold text-sm text-green-600">
              ${venue.weeklyRevenue ?? 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/venues/${venue.id}/edit`}
            className="flex-1 text-center font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors"
          >
            Edit Details
          </Link>
          <Link
            href={`/dashboard/venues/${venue.id}/schedule`}
            className={`flex-1 text-center font-dm text-sm font-medium rounded-xl py-2 transition-colors ${
              isActive
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            View Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}