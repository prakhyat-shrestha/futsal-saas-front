"use client";

import { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";
import { Pitch, SurfaceType } from "@/types";
import { CreatePitchPayload } from "@/store/venueStore";

const SURFACE_OPTIONS: { value: SurfaceType; label: string }[] = [
  { value: "GRASS", label: "Natural Grass" },
  { value: "ARTIFICIAL", label: "Artificial Turf" },
  { value: "FUTSAL", label: "Futsal Court" },
  { value: "INDOOR", label: "Indoor Court" },
];

const AMENITY_OPTIONS = [
  "Showers",
  "Changing Rooms",
  "Parking",
  "Floodlights",
  "Seating",
  "Café",
  "First Aid",
  "WiFi",
];

interface FormValues {
  name: string;
  description: string;
  surface: SurfaceType;
  capacity: string;
  pricePerHour: string;
  amenities: string[];
}

const EMPTY: FormValues = {
  name: "",
  description: "",
  surface: "ARTIFICIAL",
  capacity: "",
  pricePerHour: "",
  amenities: [],
};

export function PitchModal({
  venueId,
  pitch,
  onSubmit,
  onClose,
}: {
  venueId: string;
  pitch?: Pitch; // if provided → Edit mode, else → Add mode
  onSubmit: (venueId: string, data: CreatePitchPayload, pitchId?: string) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!pitch;

  const [values, setValues] = useState<FormValues>(
    pitch
      ? {
          name: pitch.name,
          description: pitch.description ?? "",
          surface: pitch.surface,
          capacity: String(pitch.capacity),
          pricePerHour: String(pitch.pricePerHour),
          amenities: pitch.amenities,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function toggleAmenity(amenity: string) {
    setValues((v) => ({
      ...v,
      amenities: v.amenities.includes(amenity)
        ? v.amenities.filter((a) => a !== amenity)
        : [...v.amenities, amenity],
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.capacity || isNaN(Number(values.capacity)) || Number(values.capacity) < 1)
      next.capacity = "Enter a valid capacity.";
    if (!values.pricePerHour || isNaN(Number(values.pricePerHour)) || Number(values.pricePerHour) <= 0)
      next.pricePerHour = "Enter a valid price.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload: CreatePitchPayload = {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        surface: values.surface,
        capacity: Number(values.capacity),
        pricePerHour: Number(values.pricePerHour),
        amenities: values.amenities,
      };
      await onSubmit(venueId, payload, pitch?.id);
      onClose();
    } catch {
      // error shown via store's error state on the parent page
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-syne font-bold text-lg text-gray-900">
              {isEdit ? "Edit Pitch" : "Add New Pitch"}
            </h2>
            <p className="font-dm text-xs text-gray-400 mt-0.5">
              {isEdit ? "Update pitch details." : "Add a court players can book."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <Field label="Pitch Name" error={errors.name}>
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Court A"
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Description */}
          <Field label="Description" optional>
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional details about this pitch..."
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
            />
          </Field>

          {/* Surface */}
          <Field label="Surface Type">
            <div className="relative">
              <Layers size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={values.surface}
                onChange={(e) => update("surface", e.target.value as SurfaceType)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-dm text-sm text-gray-900 focus:outline-none focus:border-green-500/50 transition-colors appearance-none"
              >
                {SURFACE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          {/* Capacity + Price */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Capacity (players)" error={errors.capacity}>
              <input
                type="number"
                min={1}
                value={values.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder="10"
                className={inputClass(!!errors.capacity)}
              />
            </Field>
            <Field label="Price per Hour (₨)" error={errors.pricePerHour}>
              <input
                type="number"
                min={0}
                step="0.01"
                value={values.pricePerHour}
                onChange={(e) => update("pricePerHour", e.target.value)}
                placeholder="1200"
                className={inputClass(!!errors.pricePerHour)}
              />
            </Field>
          </div>

          {/* Amenities */}
          <Field label="Amenities" optional>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = values.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-dm font-medium border transition-colors ${
                      selected
                        ? "bg-green-500 text-black border-green-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {isSubmitting
              ? isEdit ? "Saving..." : "Adding..."
              : isEdit ? "Save Changes" : "Add Pitch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-dm text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal"> (optional)</span>}
      </label>
      {children}
      {error && <p className="font-dm text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full bg-gray-50 border rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors ${
    hasError ? "border-red-300" : "border-gray-200"
  }`;
}