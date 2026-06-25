import { StatusBadge } from "./FeaturedBookingCard";
import { Booking } from "./types";

export function CompactBookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h4 className="font-syne font-semibold text-sm text-gray-900">{booking.venueName}</h4>
          <p className="font-dm text-xs text-gray-400 mt-0.5">
            {booking.courtName} ({booking.pitchType})
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="flex items-center justify-between mt-4 mb-4">
        <div>
          <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Date</p>
          <p className="font-dm text-sm text-gray-700">{booking.dateLabel}</p>
        </div>
        <div>
          <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Duration</p>
          <p className="font-dm text-sm text-gray-700">{booking.timeRange}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 text-center font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors">
          Details
        </button>
        <button
          onClick={() => onCancel(booking.id)}
          className="flex-1 text-center font-dm text-sm font-medium text-red-500 border border-red-200 rounded-xl py-2 hover:bg-red-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}