"use client";

import { useState } from "react";
import { Grid3x3, Map } from "lucide-react";
import { PitchFilters } from "@/components/play/PitchFilters";
import { PitchCard, Pitch } from "@/components/play/PitchCard";

const MOCK_PITCHES: Pitch[] = [
  {
    id: "p1",
    name: "Apex Arena Central",
    location: "Marylebone, London",
    distanceMi: 0.9,
    rating: 4.9,
    priceFrom: 4520,
    pitchType: "5v5",
    indoor: true,
    imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
    availableSlots: ["19:00", "19:30", "20:00", "21:00", "22:00"],
  },
  {
    id: "p2",
    name: "Velocity Sports Hub",
    location: "Shoreditch Park, London",
    distanceMi: 2.1,
    rating: 4.7,
    priceFrom: 4860,
    pitchType: "7v7",
    indoor: false,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    availableSlots: ["17:00", "19:30", "21:00"],
  },
  {
    id: "p3",
    name: "Heritage Field Pro",
    location: "Greenwich, London",
    distanceMi: 6.5,
    rating: 5.0,
    priceFrom: 4520,
    pitchType: "5v5",
    indoor: false,
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80",
    availableSlots: ["20:00", "22:00"],
  },
  {
    id: "p4",
    name: "Urban Pulse Futsal",
    location: "Camden Town, London",
    distanceMi: 1.2,
    rating: 4.8,
    priceFrom: 4520,
    pitchType: "5v5",
    indoor: true,
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    availableSlots: ["19:30", "20:30", "21:00"],
  },
];

export default function ExplorePitchesPage() {
  const [view, setView] = useState<"grid" | "map">("grid");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <PitchFilters />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-syne font-bold text-2xl text-gray-900 mb-1">Pitches in London</h1>
              <p className="font-dm text-sm text-gray-400">
                {MOCK_PITCHES.length} venues found for your search
              </p>
            </div>

            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shrink-0">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-dm font-medium transition-colors ${
                  view === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Grid3x3 size={13} />
                Grid
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-dm font-medium transition-colors ${
                  view === "map" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Map size={13} />
                Map
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                {MOCK_PITCHES.map((pitch) => (
                  <PitchCard key={pitch.id} pitch={pitch} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button className="px-6 py-2.5 rounded-full border border-gray-200 bg-white font-dm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Load More Venues
                </button>
              </div>
            </>
          ) : (
            <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
              <p className="font-dm text-sm text-gray-400">Map view coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}