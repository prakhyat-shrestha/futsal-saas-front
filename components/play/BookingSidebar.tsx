"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useBookingDraftStore } from "@/store/bookingDraftStore";

const ALL_SLOTS = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const SERVICE_FEE = 2.5;

export function BookingSidebar({
  venueId,
  venueName,
  courtId,
  courtName,
  pitchType,
  imageUrl,
  pricePerHour,
  unavailableSlots = [],
}: {
  venueId: string;
  venueName: string;
  courtId: string;
  courtName: string;
  pitchType: string;
  imageUrl: string;
  pricePerHour: number;
  unavailableSlots?: string[];
}) {
  const router = useRouter();
  const setDraft = useBookingDraftStore((s) => s.setDraft);

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    ALL_SLOTS.find((s) => !unavailableSlots.includes(s)) ?? null
  );

  const slotsLeft = ALL_SLOTS.length - unavailableSlots.length;
  const total = pricePerHour + SERVICE_FEE;

  const dateLabel = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  }, [date]);

  function handleBook() {
    if (!selectedSlot) return;
    const end = addOneHour(selectedSlot);

    setDraft({
      venueId,
      venueName,
      courtId,
      courtName,
      pitchType,
      imageUrl,
      date,
      dateLabel: formatLongDate(date),
      timeRange: `${selectedSlot} - ${end}`,
      pricePerHour,
      totalDue: total,
    });

    router.push("/play/checkout");
  }

  return (
    <div className="sticky top-24">
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-syne font-bold text-white text-lg">Book Pitch</h3>
            <span className="bg-green-500/20 text-green-400 text-[10px] font-dm font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
              Instant
            </span>
          </div>
          <p className="font-dm text-xs text-gray-400">Select your time and get on the pitch today.</p>
        </div>

        {/* White panel */}
        <div className="bg-white rounded-t-2xl p-6">
          <label className="block font-dm text-xs font-medium text-gray-600 mb-2">Choose Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 focus:outline-none focus:border-green-500/50 transition-colors mb-5"
          />

          <div className="flex items-center justify-between mb-3">
            <label className="font-dm text-xs font-medium text-gray-600">Available Slots</label>
            <span className="font-dm text-xs font-medium text-green-600">{slotsLeft} Left</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {ALL_SLOTS.map((slot) => {
              const disabled = unavailableSlots.includes(slot);
              const active = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  disabled={disabled}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-xl text-sm font-dm font-medium border transition-colors ${
                    disabled
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : active
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
            <PriceRow label="Pitch Hire (1hr)" value={pricePerHour} />
            <PriceRow label="Service Fee" value={SERVICE_FEE} />
          </div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-syne font-bold text-sm text-gray-900">Total</span>
            <span className="font-syne font-bold text-base text-gray-900">£{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedSlot}
            className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-bold py-3.5 rounded-xl text-sm transition-colors mb-2.5"
          >
            Book Instant Pitch
            <Zap size={15} />
          </button>
          <p className="font-dm text-xs text-gray-400 text-center">No credit card required to hold</p>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-dm text-sm text-gray-500">{label}</span>
      <span className="font-dm text-sm text-gray-900">£{value.toFixed(2)}</span>
    </div>
  );
}

function addOneHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}