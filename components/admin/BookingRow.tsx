"use client";

import { Building2 } from "lucide-react";

export interface Booking {
  id: string;
  bookingRef: string;
  venueName: string;
  venueImageUrl?: string;
  playerName: string;
  dateLabel: string;
  timeRange: string;
  amount: number;
  status: "Confirmed" | "Disputed" | "Pending" | "Cancelled";
}

const STATUS_BADGE: Record<Booking["status"], string> = {
  Confirmed: "bg-lime-100 text-lime-800",
  Disputed: "bg-red-100 text-red-500",
  Pending: "bg-gray-100 text-gray-600",
  Cancelled: "bg-gray-100 text-gray-500",
};

export function BookingRow({
  booking,
  onContact,
  onRefund,
}: {
  booking: Booking;
  onContact: (id: string) => void;
  onRefund: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-5 px-6">
        <p className="font-dm text-sm font-semibold text-gray-900">{booking.bookingRef}</p>
      </td>

      <td className="py-5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shrink-0">
            {booking.venueImageUrl ? (
              <img src={booking.venueImageUrl} alt={booking.venueName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={14} className="text-gray-300" />
              </div>
            )}
          </div>
          <p className="font-dm text-sm text-gray-900">{booking.venueName}</p>
        </div>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-700">{booking.playerName}</p>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-700">{booking.dateLabel}</p>
        <p className="font-dm text-xs text-gray-400 mt-0.5">{booking.timeRange}</p>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm font-semibold text-gray-900">${booking.amount.toFixed(2)}</p>
      </td>

      <td className="py-5 pr-4">
        <span
          className={`inline-block font-dm text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md ${STATUS_BADGE[booking.status]}`}
        >
          {booking.status}
        </span>
      </td>

      <td className="py-5 px-6">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onContact(booking.id)}
            className="font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Contact
          </button>
          <RefundAction booking={booking} onRefund={onRefund} />
        </div>
      </td>
    </tr>
  );
}

function RefundAction({
  booking,
  onRefund,
}: {
  booking: Booking;
  onRefund: (id: string) => void;
}) {
  if (booking.status === "Disputed") {
    return (
      <button
        onClick={() => onRefund(booking.id)}
        className="font-dm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 transition-colors"
      >
        Issue Refund
      </button>
    );
  }

  if (booking.status === "Cancelled") {
    return (
      <button
        onClick={() => onRefund(booking.id)}
        className="font-dm text-sm font-medium text-red-500 border border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition-colors"
      >
        Issue Refund
      </button>
    );
  }

  return (
    <button
      disabled
      className="font-dm text-sm font-medium text-gray-300 border border-gray-100 rounded-full px-4 py-2 cursor-not-allowed"
    >
      Refund
    </button>
  );
}