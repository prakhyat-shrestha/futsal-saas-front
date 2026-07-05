"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Pencil,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  AlignLeft,
  Calendar,
  XCircle,
} from "lucide-react";
import { notFound } from "next/navigation";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";
type PaymentStatus = "PAID" | "PENDING" | "REFUNDED";

interface MockBooking {
  id: string;
  ref: string;
  status: BookingStatus;
  lastUpdated: string;
  matchDate: string;
  timeSlot: string;
  duration: string;
  pitchName: string;
  matchType: string;
  playerNote: string;
  player: {
    name: string;
    type: string;
    bookingCount: number;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  payment: {
    status: PaymentStatus;
    courtFee: number;
    serviceFee: number;
    total: number;
    transactionId: string;
    method: string;
  };
}

// [UI] pass — replace with real API fetch in Week 3
const MOCK_BOOKINGS: Record<string, MockBooking> = {
  "test-booking-1": {
    id: "test-booking-1",
    ref: "#PF-12845",
    status: "Confirmed",
    lastUpdated: "2 hours ago",
    matchDate: "Oct 24, 2023",
    timeSlot: "19:00 - 20:00",
    duration: "60 mins",
    pitchName: "Pitch 1 (Pro-Turf)",
    matchType: "5-a-side League",
    playerNote:
      "Celebrating a birthday. Is it possible to have the pitch markers set for a small tournament style? Also, we might need to rent 2 sets of bibs (Red and Blue).",
    player: {
      name: "Alex Rivera",
      type: "Regular Player",
      bookingCount: 12,
      phone: "+44 7700 900451",
      email: "alex.r@matchday.com",
      avatarUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&q=80",
    },
    payment: {
      status: "PAID",
      courtFee: 58.5,
      serviceFee: 6.5,
      total: 65.0,
      transactionId: "#TXN-99823412",
      method: "Visa •••• 4242",
    },
  },
};

const STATUS_BADGE: Record<BookingStatus, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-500",
  Completed: "bg-gray-100 text-gray-600",
};

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [staffNotes, setStaffNotes] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const booking = MOCK_BOOKINGS[id];
  if (!booking) notFound();

  async function handleCancel() {
    setCancelling(true);
    // wire to real cancel API in Week 3
    await new Promise((r) => setTimeout(r, 1000));
    setCancelling(false);
    setCancelConfirm(false);
  }

  return (
    <div className="p-8">
      {/* Back nav */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Booking Reference
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-syne font-bold text-3xl text-gray-900">
            {booking.ref}
          </h1>
          <span
            className={`font-dm text-sm font-medium px-3 py-1 rounded-full ${STATUS_BADGE[booking.status]}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
            <Printer size={15} />
            Print Receipt
          </button>
          <button className="inline-flex items-center gap-2 bg-gray-900 text-white font-dm text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
            <Pencil size={14} />
            Modify Booking
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Booking Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-green-500" />
                <h2 className="font-syne font-bold text-base text-gray-900">
                  Booking Summary
                </h2>
              </div>
              <p className="font-dm text-xs text-gray-400">
                Last updated: {booking.lastUpdated}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <SummaryField label="Match Date" value={booking.matchDate} />
              <SummaryField
                label="Time Slot"
                value={
                  <span>
                    {booking.timeSlot}{" "}
                    <span className="text-gray-400 font-normal">
                      ({booking.duration})
                    </span>
                  </span>
                }
              />
              <SummaryField
                label="Pitch Name"
                value={
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    {booking.pitchName}
                  </span>
                }
              />
              <SummaryField label="Match Type" value={booking.matchType} />
            </div>
          </div>

          {/* Venue Notes & Requests */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <AlignLeft size={18} className="text-gray-500" />
              <h2 className="font-syne font-bold text-base text-gray-900">
                Venue Notes & Requests
              </h2>
            </div>

            {booking.playerNote && (
              <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-full" />
                <p className="font-dm text-sm text-gray-600 italic leading-relaxed pl-5">
                  "{booking.playerNote}"
                </p>
              </div>
            )}

            <div>
              <label className="block font-dm text-xs font-medium text-gray-500 mb-2">
                Internal Staff Notes
              </label>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Add internal notes only visible to staff..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors resize-y"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-syne font-semibold text-sm text-red-500 mb-1">
                  Danger Zone
                </p>
                <p className="font-dm text-xs text-gray-400">
                  Once cancelled, the slot will be immediately released to the
                  public pool.
                </p>
              </div>

              {cancelConfirm ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCancelConfirm(false)}
                    disabled={cancelling}
                    className="font-dm text-sm font-medium text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Keep
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="inline-flex items-center gap-2 font-dm text-sm font-semibold text-red-500 border-2 border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {cancelling ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle size={15} />
                    )}
                    {cancelling ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="inline-flex items-center gap-2 font-dm text-sm font-semibold text-red-500 border-2 border-red-200 rounded-full px-5 py-2.5 hover:bg-red-50 transition-colors shrink-0"
                >
                  <XCircle size={15} />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-5">
          {/* Player Info */}
          <div className="bg-[#0B1F17] rounded-2xl p-5">
            <p className="flex items-center gap-2 font-syne font-bold text-base text-green-400 mb-4">
              <span className="w-6 h-6 rounded-full bg-green-400/10 flex items-center justify-center">
                <span className="text-green-400 text-xs">👤</span>
              </span>
              Player Info
            </p>

            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-700">
                {booking.player.avatarUrl ? (
                  <img
                    src={booking.player.avatarUrl}
                    alt={booking.player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-syne font-bold text-white">
                    {booking.player.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-syne font-bold text-white text-base">
                  {booking.player.name}
                </p>
                <p className="font-dm text-xs text-gray-400">
                  {booking.player.type} • {booking.player.bookingCount} Bookings
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <p className="font-dm text-sm text-gray-300">
                  {booking.player.phone}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <p className="font-dm text-sm text-gray-300">
                  {booking.player.email}
                </p>
              </div>
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 bg-green-400 hover:bg-green-300 text-black font-syne font-bold py-3 rounded-xl text-sm transition-colors">
              <MessageSquare size={15} />
              Contact Player
            </button>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <p className="font-syne font-bold text-base text-gray-900">
                Payment
              </p>
              <span
                className={`font-dm text-xs font-bold px-2.5 py-1 rounded-full ${PAYMENT_BADGE[booking.payment.status]}`}
              >
                {booking.payment.status}
              </span>
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
              <PaymentRow
                label={`Court Fee (${booking.duration})`}
                value={`£${booking.payment.courtFee.toFixed(2)}`}
              />
              <PaymentRow
                label="Service Fee"
                value={`£${booking.payment.serviceFee.toFixed(2)}`}
              />
              <div className="flex items-center justify-between pt-1">
                <p className="font-dm text-sm font-semibold text-gray-900">
                  Total Amount
                </p>
                <p className="font-syne font-bold text-base text-gray-900">
                  £{booking.payment.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">
                  Transaction ID
                </p>
                <p className="font-dm text-xs font-medium text-gray-700">
                  {booking.payment.transactionId}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">
                  Method
                </p>
                <p className="flex items-center gap-1.5 font-dm text-xs font-medium text-gray-700">
                  <CreditCard size={12} className="text-gray-400" />
                  {booking.payment.method}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-1.5">
        {label}
      </p>
      <p className="font-syne font-bold text-lg text-gray-900">{value}</p>
    </div>
  );
}

function PaymentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-dm text-sm text-gray-500">{label}</p>
      <p className="font-dm text-sm text-gray-900">{value}</p>
    </div>
  );
}