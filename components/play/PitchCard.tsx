"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin } from "lucide-react";
import { useBookingDraftStore } from "@/store/bookingDraftStore";

export interface Pitch {
  id: string;
  name: string;
  location: string;
  distanceMi: number;
  rating: number;
  priceFrom: number;
  pitchType: string;
  indoor: boolean;
  imageUrl: string;
  availableSlots: string[];
}

export function PitchCard({ pitch }: { pitch: Pitch }) {
  const router = useRouter();
  const setDraft = useBookingDraftStore((s) => s.setDraft);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(pitch.availableSlots[0] ?? null);

    function handleBook() {
    if (!selectedSlot) return;
    const [start, end] = [selectedSlot, addOneHour(selectedSlot)];

    setDraft({
      venueId: pitch.id,
      venueName: pitch.name,
      courtId: `${pitch.id}-court`, // swap for real court id once wired to API
      courtName: "Pitch 1",
      pitchType: pitch.pitchType,
      imageUrl: pitch.imageUrl,
      date: new Date().toISOString().split("T")[0],
      dateLabel: "Saturday, 18th Nov", // swap for real selected date once a date picker exists
      timeRange: `${start} - ${end}`,
      pricePerHour: pitch.priceFrom,
      totalDue: pitch.priceFrom,
    });

    router.push("/play/checkout");
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Image */}
      <div className="relative h-44">
        <img src={pitch.imageUrl} alt={pitch.name} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs font-dm font-medium px-2.5 py-1 rounded-full">
          {pitch.pitchType}
          {pitch.indoor ? " · Indoor" : ""}
        </span>
        <span className="absolute top-3 right-3 bg-green-400 text-black text-xs font-dm font-semibold px-2.5 py-1 rounded-full">
          From ₨{pitch.priceFrom}/hr
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-syne font-semibold text-base text-gray-900 truncate pr-2">
            {pitch.name}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-dm font-medium text-gray-700 shrink-0">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {pitch.rating.toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1 font-dm text-xs text-gray-400 mb-4">
          <MapPin size={12} />
          {pitch.location} ({pitch.distanceMi} mi)
        </p>

        <p className="font-dm text-[11px] uppercase tracking-wide text-gray-400 mb-2">
          Available Today
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {pitch.availableSlots.map((slot) => {
            const active = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium border transition-colors ${
                  active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        <button  
        onClick={handleBook}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-syne font-semibold py-3 rounded-xl text-sm transition-colors">
          Book Instant Pitch
        </button>
      </div>
    </div>
  );
}


function addOneHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const next = (h + 1) % 24;
  return `${String(next).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}




