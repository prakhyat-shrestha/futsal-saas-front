"use client";

import { useEffect } from "react";
import {
  X,
  Layers,
  Users,
  Banknote,
  Calendar,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { Pitch, SurfaceType } from "@/types";

const SURFACE_LABEL: Record<SurfaceType, string> = {
  GRASS: "Natural Grass",
  ARTIFICIAL: "Artificial Turf",
  FUTSAL: "Futsal Court",
  INDOOR: "Indoor Court",
};

export function PitchDrawer({
  pitch,
  onClose,
  onEdit,
}: {
  pitch: Pitch;
  onClose: () => void;
  onEdit: (pitch: Pitch) => void;
}) {
  // close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-gray-200 z-50 flex flex-col shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-0.5">
              Pitch Details
            </p>
            <h2 className="font-syne font-bold text-lg text-gray-900 leading-tight">
              {pitch.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-dm text-xs font-medium px-2.5 py-1 rounded-full ${
                pitch.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {pitch.isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Image */}
          <div className="w-full h-36 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
            {pitch.imageUrls?.length > 0 ? (
              <img
                src={pitch.imageUrls[0]}
                alt={pitch.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-gray-300">
                <ImageIcon size={28} />
                <p className="font-dm text-xs">No image yet</p>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div>
            <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-3">
              Pitch Info
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <InfoTile
                icon={Layers}
                label="Surface"
                value={SURFACE_LABEL[pitch.surface] ?? pitch.surface}
              />
              <InfoTile
                icon={Users}
                label="Capacity"
                value={`${pitch.capacity}v${pitch.capacity}`}
              />
              <InfoTile
                icon={Banknote}
                label="Price / hr"
                value={`₨${Number(pitch.pricePerHour).toLocaleString()}`}
              />
              <InfoTile
                icon={Calendar}
                label="Bookings"
                value="0 today"
              />
            </div>
          </div>

          {/* Description */}
          {pitch.description && (
            <div>
              <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                Description
              </p>
              <p className="font-dm text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                {pitch.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {pitch.amenities?.length > 0 && (
            <div>
              <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {pitch.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="font-dm text-xs text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Image gallery — if multiple */}
          {pitch.imageUrls?.length > 1 && (
            <div>
              <p className="font-dm text-[10px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                Photos
              </p>
              <div className="grid grid-cols-3 gap-2">
                {pitch.imageUrls.slice(1).map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={url}
                      alt={`${pitch.name} photo ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onEdit(pitch);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} />
            Edit Pitch
          </button>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 font-dm text-sm font-semibold text-black bg-green-500 hover:bg-green-400 rounded-xl py-2.5 transition-colors"
          >
            <Calendar size={14} />
            View Schedule
          </button>
        </div>
      </div>
    </>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-gray-400" />
        <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </p>
      </div>
      <p className="font-dm text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}