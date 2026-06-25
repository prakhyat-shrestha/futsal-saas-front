import { Calendar, Clock, Navigation, Pencil, X } from "lucide-react";
import { Booking } from "./types";

export function FeaturedBookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
      <div className="relative sm:w-64 h-48 sm:h-auto shrink-0">
        <img src={booking.imageUrl} alt={booking.venueName} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <p className="font-dm text-xs text-gray-400">
            {booking.courtName} ({booking.pitchType})
          </p>
          <StatusBadge status={booking.status} />
        </div>

        <h3 className="font-syne font-bold text-lg text-gray-900 mb-4">{booking.venueName}</h3>

        <div className="flex items-center gap-6 mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-400" />
            <span className="font-dm text-sm text-gray-700">{booking.dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <span className="font-dm text-sm text-gray-700">{booking.timeRange}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            <Navigation size={14} />
            Get Directions
          </button>
          <button className="inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <Pencil size={13} />
            Modify
          </button>
          <button
            onClick={() => onCancel(booking.id)}
            className="inline-flex items-center justify-center bg-white border border-gray-200 text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
            aria-label="Cancel booking"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-gray-100 text-gray-600",
  };
  const labels: Record<Booking["status"], string> = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
  };
  return (
    <span className={`text-xs font-dm font-medium px-2.5 py-1 rounded-full shrink-0 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}