import { Star, MapPin, Droplets, Users, SquareParking, Sun, Navigation, MessageCircle, ShieldCheck } from "lucide-react";
import { PhotoGallery } from "@/components/play/PhotoGallery";
import { BookingSidebar } from "@/components/play/BookingSidebar";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  Showers: Droplets,
  "Changing Rooms": Users,
  "Free Parking": SquareParking,
  Floodlights: Sun,
};

// Mock — replace with fetchVenueById(params.id) once wired to the API
const PITCH = {
  id: "v1",
  name: "The Arena 5s",
  area: "East London, E15",
  rating: 4.8,
  pricePerHour: 45,
  badge: "Premium Turf",
  pitchType: "5v5",
  about:
    "Experience world-class football at The Arena 5s. Our facility boasts premium 4G artificial turf, specifically designed to reduce joint impact while providing the perfect bounce for high-intensity play. With professional-grade lighting and full climate control, we offer a consistent, elite-level experience regardless of the weather outside.",
  amenities: ["Showers", "Changing Rooms", "Free Parking", "Floodlights"],
  address: "East London Football Complex",
  fullAddress: "12 Olympic Way, Stratford, London E15 2PW",
  managedBy: "Arena 5s Ltd",
  images: [
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80",
    "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&q=80",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80",
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
  ],
  unavailableSlots: ["21:00"],
};

export default function PitchDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <PhotoGallery images={PITCH.images} badge={PITCH.badge} />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1.5">{PITCH.name}</h1>
              <p className="flex items-center gap-1.5 font-dm text-sm text-gray-400">
                <MapPin size={14} />
                {PITCH.area}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 shrink-0">
              <div className="text-center">
                <p className="flex items-center gap-1 font-syne font-bold text-sm text-gray-900">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {PITCH.rating}
                </p>
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Rating</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="font-syne font-bold text-sm text-gray-900">£{PITCH.pricePerHour}/h</p>
                <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">Base Price</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-syne font-semibold text-lg text-gray-900 mb-3">About this pitch</h2>
            <p className="font-dm text-sm text-gray-600 leading-relaxed mb-6">{PITCH.about}</p>

            <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Amenities
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PITCH.amenities.map((label) => {
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
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-syne font-semibold text-lg text-gray-900 mb-4">Location</h2>
            <div className="flex items-start gap-2.5 mb-4">
              <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-dm text-sm font-medium text-gray-900">{PITCH.address}</p>
                <p className="font-dm text-sm text-gray-500">{PITCH.fullAddress}</p>
              </div>
            </div>

            <div className="relative h-64 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
              <p className="font-dm text-xs text-gray-400">Map view coming soon</p>
              
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(PITCH.fullAddress)}`}
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
            venueId={PITCH.id}
            venueName={PITCH.name}
            courtId={`${PITCH.id}-court-1`}
            courtName="Pitch 1"
            pitchType={PITCH.pitchType}
            imageUrl={PITCH.images[0]}
            pricePerHour={PITCH.pricePerHour}
            unavailableSlots={PITCH.unavailableSlots}
          />

          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-dm text-sm font-medium text-gray-900">Managed by {PITCH.managedBy}</p>
              <p className="font-dm text-xs text-gray-400">Verified Facility · 5 min response</p>
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