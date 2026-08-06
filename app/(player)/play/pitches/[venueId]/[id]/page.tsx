"use client";

import { use, useEffect, useState } from "react";
import { Star, MapPin, Droplets, Users, SquareParking, Sun, Navigation, MessageCircle, ShieldCheck } from "lucide-react";
import { PhotoGallery } from "@/components/play/PhotoGallery";
import { BookingSidebar } from "@/components/play/BookingSidebar";
import { apiRequest } from "@/lib/api";
import { SurfaceType } from "@/types";
import { formatCurrency } from "@/lib/utils";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  Showers: Droplets,
  "Changing Rooms": Users,
  "Free Parking": SquareParking,
  Floodlights: Sun,
};

// ASSUMED shape of GET /venues/:venueId/:id — mirrors the /venues list pattern.
// Confirm against the real response and adjust field names if different.
interface PitchDetailResponse {
  id: string;
  name: string;
  description?: string;
  surface: SurfaceType;
  capacity: number;
  pricePerHour: string;
  isActive: boolean;
  imageUrls: string[];
  amenities: string[];
  venue: {
    id: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    imageUrls: string[];
    owner: { name: string; email: string };
  };
}

export default function PitchDetailPage({
  params,
}: {
   params: Promise<{ venueId: string; id: string }>;
}) {
  const { venueId, id } = use(params);
  const [pitch, setPitch] = useState<PitchDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiRequest<PitchDetailResponse>(
          `/venues/${venueId}/${id}`,
          { method: "GET" }
        );
        console.log("Fetched pitch data:", data); // Debugging line to check the fetched data
        if (!cancelled) setPitch(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to load pitch.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [venueId, id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-dm">
          {error ?? "Pitch not found."}
        </div>
      </div>
    );
  }

  const venue = pitch.venue;
  const galleryImages = pitch.imageUrls.length > 0 ? pitch.imageUrls : venue.imageUrls;
  const fullAddress = `${venue.address}, ${venue.city}`;


  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <PhotoGallery images={galleryImages} badge={pitch.surface} />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1.5">{pitch.name}</h1>
              <p className="flex items-center gap-1.5 font-dm text-sm text-gray-400">
                <MapPin size={14} />
                {venue.city}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 shrink-0">
              <div className="text-center">
                <p className="flex items-center gap-1 font-syne font-bold text-sm text-gray-900">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {/* TODO: no ratings/reviews aggregate on the backend yet */}
                  —
                </p>
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Rating</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="font-syne font-bold text-sm text-gray-900">
                  {formatCurrency(Number(pitch.pricePerHour))}
                </p>
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Base Price</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-syne font-semibold text-lg text-gray-900 mb-3">About this pitch</h2>
            <p className="font-dm text-sm text-gray-600 leading-relaxed mb-6">
              {pitch.description || venue.description || "No description provided yet."}
            </p>

            {pitch.amenities.length > 0 && (
              <>
                <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Amenities
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pitch.amenities.map((label) => {
                    const Icon = AMENITY_ICONS[label] ?? Droplets;
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3"
                      >
                        <Icon size={16} className="text-gray-500 shrink-0" />
                        <span className="font-dm text-sm text-gray-700">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-syne font-semibold text-lg text-gray-900 mb-4">Location</h2>
            <div className="flex items-start gap-2.5 mb-4">
              <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-dm text-sm font-medium text-gray-900">{venue.name}</p>
                <p className="font-dm text-sm text-gray-500">{fullAddress}</p>
              </div>
            </div>

            <div className="relative h-64 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
              <p className="font-dm text-xs text-gray-400">Map view coming soon</p>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 bg-white text-gray-900 text-xs font-dm font-medium px-3.5 py-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Navigation size={12} />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Right: booking sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <BookingSidebar
            venueId={venue.id}
            venueName={venue.name}
            courtId={pitch.id}
            courtName={pitch.name}
            pitchType={String(pitch.capacity)} // TODO: no explicit pitchType field — using capacity for now
            imageUrl={galleryImages[0] ?? ""}
            pricePerHour={Number(pitch.pricePerHour)}
            unavailableSlots={[]} // TODO: needs a real availability-by-date endpoint
          />

          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-dm text-sm font-medium text-gray-900">
                Managed by {venue.owner?.name ?? "the venue owner"}
              </p>
              <p className="font-dm text-xs text-gray-400">Verified Facility</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors shrink-0" aria-label="Message">
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}