"use client";

import { Pitch } from "@/types";
import { CheckCircle2, Clock, Wrench, Star } from "lucide-react";

const START_HOUR = 8;
const END_HOUR = 22;
const HOUR_HEIGHT = 80;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;

const HOURS = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

const SURFACE_LABEL: Record<string, string> = {
  GRASS: "Natural Grass",
  ARTIFICIAL: "Artificial Turf",
  FUTSAL: "Futsal Court",
  INDOOR: "Indoor Court",
};

export type BookingStatus = "confirmed" | "pending_payment" | "maintenance" | "vip";

export interface ScheduleBooking {
  id: string;
  pitchId: string;
  playerName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":").map(Number);
  return { hours: h, minutes: m ?? 0 };
}

function getTopOffset(time: string): number {
  const { hours, minutes } = parseTime(time);
  return (hours - START_HOUR) * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;
}

function getBlockHeight(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const durationMins =
    end.hours * 60 + end.minutes - (start.hours * 60 + start.minutes);
  return Math.max((durationMins / 60) * HOUR_HEIGHT, 40);
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: "bg-green-400 text-black border-transparent",
  maintenance: "bg-green-400 text-black border-transparent",
  vip: "bg-gray-900 text-white border-transparent",
  pending_payment:
    "bg-white text-gray-900 border-2 border-dashed border-green-400",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "CONFIRMED",
  maintenance: "INTERNAL",
  vip: "VIP BOOKING",
  pending_payment: "PENDING PAYMENT",
};

const STATUS_ICON: Record<BookingStatus, React.ElementType> = {
  confirmed: CheckCircle2,
  maintenance: Wrench,
  vip: Star,
  pending_payment: Clock,
};

function BookingBlock({ booking }: { booking: ScheduleBooking }) {
  const top = getTopOffset(booking.startTime);
  const height = getBlockHeight(booking.startTime, booking.endTime);
  const Icon = STATUS_ICON[booking.status];

  return (
    <div
      className={`absolute left-1.5 right-1.5 rounded-2xl border px-3 py-2.5 cursor-pointer transition-opacity hover:opacity-90 ${STATUS_STYLES[booking.status]}`}
      style={{ top: top + 2, height: height - 4 }}
    >
      <p className="font-syne font-semibold text-sm leading-tight truncate">
        {booking.playerName}
      </p>
      <p
        className={`font-dm text-xs mt-0.5 ${
          booking.status === "vip" ? "text-gray-400" : "opacity-70"
        }`}
      >
        {booking.startTime} - {booking.endTime}
      </p>
      {height >= 60 && (
        <p
          className={`flex items-center gap-1 font-dm text-[10px] font-bold uppercase tracking-wide mt-1.5 ${
            booking.status === "vip" ? "text-green-400" : "opacity-80"
          }`}
        >
          <Icon size={10} />
          {STATUS_LABEL[booking.status]}
        </p>
      )}
    </div>
  );
}

export function ScheduleGrid({
  pitches,
  bookings,
}: {
  pitches: Pitch[];
  bookings: ScheduleBooking[];
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Pitch column headers — sticky */}
      <div className="flex border-b border-gray-100 bg-white">
        <div className="w-16 shrink-0" />
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className="flex-1 text-center py-4 border-l border-gray-100 first:border-l-0"
          >
            <p className="font-syne font-bold text-base text-gray-900">
              {pitch.name}
            </p>
            <p className="font-dm text-xs text-gray-400 mt-0.5">
              {pitch.capacity}a-side •{" "}
              {SURFACE_LABEL[pitch.surface] ?? pitch.surface}
            </p>
          </div>
        ))}
      </div>

      {/* Scrollable time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
        <div className="flex" style={{ height: TOTAL_HEIGHT }}>
          {/* Time labels */}
          <div className="w-16 shrink-0 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full flex items-start justify-end pr-3"
                style={{
                  top: (hour - START_HOUR) * HOUR_HEIGHT - 9,
                  height: HOUR_HEIGHT,
                }}
              >
                <span className="font-dm text-xs text-gray-400">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Pitch columns */}
          {pitches.map((pitch) => {
            const pitchBookings = bookings.filter(
              (b) => b.pitchId === pitch.id
            );
            return (
              <div
                key={pitch.id}
                className="flex-1 relative border-l border-gray-100"
                style={{ height: TOTAL_HEIGHT }}
              >
                {/* Hour lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-gray-100"
                    style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
                  />
                ))}

                {/* Booking blocks */}
                {pitchBookings.map((booking) => (
                  <BookingBlock key={booking.id} booking={booking} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}