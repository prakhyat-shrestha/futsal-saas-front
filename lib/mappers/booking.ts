// lib/mappers/booking.ts
import { Booking as ApiBooking } from "@/types";
import { Booking as UiBooking } from "@/components/play/types";

function formatTimeRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${fmt(start)} - ${fmt(end)}`;
}

function formatDateLabel(startISO: string): string {
  const d = new Date(startISO);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

const STATUS_MAP: Record<ApiBooking["status"], UiBooking["status"]> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export function mapApiBookingToUi(b: ApiBooking): UiBooking {
  return {
    id: b.id,
    venueName: b.pitch.venue.name,
    courtName: b.pitch.name,
    pitchType: String(b.pitch.capacity), // TODO: no explicit pitchType field yet, same gap as elsewhere
    imageUrl: b.pitch.imageUrls[0] ?? "",
    dateLabel: formatDateLabel(b.startTime),
    timeRange: formatTimeRange(b.startTime, b.endTime),
    status: STATUS_MAP[b.status],
  };
}