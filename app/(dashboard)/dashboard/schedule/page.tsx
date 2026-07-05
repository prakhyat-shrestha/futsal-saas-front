"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ScheduleRedirectPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { venues, fetchVenues, isLoading, getVenuesByTenant } = useVenueStore();

  useEffect(() => {
    if (venues.length === 0) fetchVenues();
  }, []);

  const ownerVenues = user ? getVenuesByTenant(user.id) : [];

  // single venue — redirect immediately, no picker needed
  useEffect(() => {
    if (!isLoading && ownerVenues.length === 1) {
      router.replace(`/dashboard/venues/${ownerVenues[0].id}/schedule`);
    }
  }, [isLoading, ownerVenues.length]);

  if (isLoading || ownerVenues.length === 1) {
    return <LoadingSpinner fullScreen label="Opening schedule..." />;
  }

  // no venues yet
  if (ownerVenues.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Calendar size={24} className="text-gray-400" />
        </div>
        <h2 className="font-syne font-bold text-xl text-gray-900 mb-2">
          No venues yet
        </h2>
        <p className="font-dm text-sm text-gray-500 mb-6 max-w-sm">
          Create your first venue to start managing schedules and bookings.
        </p>
        <Link
          href="/dashboard/venues/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          Create a Venue
        </Link>
      </div>
    );
  }

  // multiple venues — show picker
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">
          Schedule
        </h1>
        <p className="font-dm text-sm text-gray-500">
          Select a venue to view its schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {ownerVenues.map((venue) => (
          <Link
            key={venue.id}
            href={`/dashboard/venues/${venue.id}/schedule`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-500/40 hover:bg-green-500/5 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                {venue.imageUrl ? (
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={18} className="text-gray-400" />
                )}
              </div>
              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-green-500 transition-colors"
              />
            </div>
            <p className="font-syne font-semibold text-base text-gray-900 mb-0.5">
              {venue.name}
            </p>
            <p className="font-dm text-xs text-gray-400">
              {venue.address}, {venue.city}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  venue.isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="font-dm text-xs text-gray-500">
                {venue.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}