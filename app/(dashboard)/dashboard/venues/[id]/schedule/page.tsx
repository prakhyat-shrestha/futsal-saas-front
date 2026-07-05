"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Printer,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useVenueStore } from "@/store/venueStore";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ScheduleGrid,
  ScheduleBooking,
} from "@/components/dashboard/ScheduleGrid";

type ViewMode = "Day" | "Week" | "Month";

// [UI] pass — mock bookings, replace with fetchBookings() in Week 3
function getMockBookings(pitchIds: string[]): ScheduleBooking[] {
  if (pitchIds.length === 0) return [];
  return [
    {
      id: "b1",
      pitchId: pitchIds[1] ?? pitchIds[0],
      playerName: "Maintenance",
      startTime: "08:00",
      endTime: "09:00",
      status: "maintenance",
    },
    {
      id: "b2",
      pitchId: pitchIds[0],
      playerName: "Marcus Rashford",
      startTime: "10:00",
      endTime: "11:00",
      status: "confirmed",
    },
    {
      id: "b3",
      pitchId: pitchIds[2] ?? pitchIds[0],
      playerName: "Corporate Event: TechSols",
      startTime: "11:00",
      endTime: "12:30",
      status: "vip",
    },
    {
      id: "b4",
      pitchId: pitchIds[0],
      playerName: "Sarah Jenkins FC",
      startTime: "14:00",
      endTime: "15:00",
      status: "pending_payment",
    },
  ];
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function VenueSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { venues, pitches, fetchVenues, fetchPitches, isLoading } =
    useVenueStore();
  const [hasChecked, setHasChecked] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("Day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      if (venues.length === 0) await fetchVenues();
      await fetchPitches(id);
      setHasChecked(true);
    };
    load();
  }, [id]);

  const venue = venues.find((v) => v.id === id);
  const venuePitches = pitches.filter((p) => p.venueId === id);
  const mockBookings = getMockBookings(venuePitches.map((p) => p.id));

  if (!hasChecked || isLoading) {
    return <LoadingSpinner fullScreen label="Loading schedule..." />;
  }

  if (!venue) notFound();

  const activePitches = venuePitches.filter((p) => p.isActive);
  const confirmedBookings = mockBookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  return (
    <div className="p-8">
      {/* Back nav */}
      <button
        onClick={() => router.push(`/dashboard/venues/${id}`)}
        className="inline-flex items-center gap-1.5 font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to {venue.name}
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">
            Pitch Schedule
          </h1>
          <button className="inline-flex items-center gap-2 font-dm text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Calendar size={15} className="text-gray-400" />
            {formatDateLabel(selectedDate)}
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          {/* Day/Week/Month toggle */}
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1">
            {(["Day", "Week", "Month"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 rounded-full font-dm text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
            <Printer size={15} />
            Print
          </button>

          <button className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-black font-syne font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
            <Plus size={16} />
            Add Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard>
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Total Bookings
          </p>
          <div className="flex items-end gap-2">
            <p className="font-syne font-bold text-3xl text-gray-900">
              {mockBookings.length}
            </p>
            <p className="font-dm text-sm text-green-600 font-medium mb-1">
              +{confirmedBookings} today
            </p>
          </div>
        </StatCard>

        <StatCard>
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Revenue
          </p>
          <div className="flex items-end gap-2">
            <p className="font-syne font-bold text-3xl text-gray-900">
              ₨0
            </p>
            <p className="font-dm text-sm text-green-600 font-medium mb-1">
              0% of target
            </p>
          </div>
        </StatCard>

        <StatCard>
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Occupancy
          </p>
          <p className="font-syne font-bold text-3xl text-gray-900 mb-2">
            {venuePitches.length > 0
              ? Math.round(
                  (mockBookings.filter((b) => b.status === "confirmed").length /
                    (venuePitches.length * 8)) *
                    100
                )
              : 0}
            %
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-green-400 h-1.5 rounded-full"
              style={{ width: "30%" }}
            />
          </div>
        </StatCard>

        <StatCard>
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Pitch Status
          </p>
          <div className="flex items-end gap-2">
            <p className="font-syne font-bold text-3xl text-gray-900">
              {activePitches.length}/{venuePitches.length}
            </p>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="font-dm text-sm text-gray-500">Active</p>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Schedule Grid */}
      {venuePitches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
          <p className="font-dm text-sm text-gray-400">
            No pitches found for this venue.{" "}
            <button
              onClick={() => router.push(`/dashboard/venues/${id}`)}
              className="text-green-600 underline"
            >
              Add a pitch
            </button>{" "}
            to see the schedule.
          </p>
        </div>
      ) : (
        <ScheduleGrid pitches={venuePitches} bookings={mockBookings} />
      )}
    </div>
  );
}

function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      {children}
    </div>
  );
}