"use client";

import { useEffect, useState } from "react";
import { Grid3x3, Map } from "lucide-react";
import { PitchFilters } from "@/components/play/PitchFilters";
import { PitchCard, Pitch as PitchCardPitch } from "@/components/play/PitchCard";
import { apiRequest } from "@/lib/api";
import { SurfaceType } from "@/types";

// Matches your actual /venues response — pitches are a trimmed subset, not the full Pitch type
interface ExploreVenuePitch {
  id: string;
  name: string;
  surface: SurfaceType;
  pricePerHour: string;
  capacity: number;
}

interface ExploreVenue {
  id: string;
  name: string;
  city: string;
  address: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  isActive: boolean;
  pitches: ExploreVenuePitch[];
}

function pitchTypeFromCapacity(capacity: number): string {
  // TODO: no explicit pitchType on Pitch — derived from capacity for now
  if (capacity <= 5) return "5v5";
  if (capacity <= 7) return "7v7";
  return `${capacity}v${capacity}`;
}

function isIndoor(surface: SurfaceType): boolean {
  // TODO: guessed from surface — replace with a real `indoor` flag if you add one
  return surface === "INDOOR" || surface === "FUTSAL";
}

function flattenVenueToCards(venue: ExploreVenue): PitchCardPitch[] {
  return (venue.pitches ?? []).map((p) => ({
    id: p.id,
    venueId: venue.id,
    name: p.name,
    location: venue.city,
    distanceMi: 0, // TODO: needs geolocation + haversine vs venue.latitude/longitude
    rating: 0, // TODO: no ratings aggregate yet (venue has _count.reviews but no avg score)
    priceFrom: Number(p.pricePerHour),
    pitchType: pitchTypeFromCapacity(p.capacity),
    indoor: isIndoor(p.surface),
    imageUrl: venue.imageUrls?.[0] ?? "", // nested pitch has no imageUrls in this response
    availableSlots: [], // TODO: needs a real availability-by-date query
  }));
}

export default function ExplorePitchesPage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [pitches, setPitches] = useState<PitchCardPitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const venues = await apiRequest<ExploreVenue[]>("/venues", { method: "GET" });
        if (!cancelled) {
          setPitches(venues.filter((v) => v.isActive).flatMap(flattenVenueToCards));
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to load pitches.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <PitchFilters />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-syne font-bold text-2xl text-gray-900 mb-1">Pitches near you</h1>
              <p className="font-dm text-sm text-gray-400">
                {isLoading ? "Loading…" : `${pitches.length} venues found for your search`}
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

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-dm mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : view === "grid" ? (
            <>
              {pitches.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-sm text-gray-400 font-dm">
                  No pitches found.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {pitches.map((pitch) => (
                    <PitchCard key={pitch.id} pitch={pitch} />
                  ))}
                </div>
              )}

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