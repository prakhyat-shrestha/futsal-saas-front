"use client";

import { useState } from "react";

const PITCH_TYPES = ["5v5", "7v7", "9v9"];
const SURFACES = ["4G Synthetic", "Natural Grass", "Indoor Court"];
const AMENITIES = ["Showers", "Free Parking", "Floodlights"];

export function PitchFilters() {
  const [pitchTypes, setPitchTypes] = useState<string[]>([]);
  const [surfaces, setSurfaces] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(6750);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-syne font-semibold text-sm text-gray-900">Filters</h2>
        <button
          onClick={() => {
            setPitchTypes([]);
            setSurfaces([]);
            setAmenities([]);
            setMaxPrice(6750);
          }}
          className="font-dm text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Pitch Type */}
      <FilterGroup label="Pitch Type">
        <div className="flex flex-wrap gap-2">
          {PITCH_TYPES.map((type) => {
            const active = pitchTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggle(pitchTypes, setPitchTypes, type)}
                className={`px-4 py-1.5 rounded-full text-xs font-dm font-medium border transition-colors ${
                  active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Surface */}
      <FilterGroup label="Surface">
        <div className="space-y-2.5">
          {SURFACES.map((surface) => (
            <Checkbox
              key={surface}
              label={surface}
              checked={surfaces.includes(surface)}
              onChange={() => toggle(surfaces, setSurfaces, surface)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Amenities */}
      <FilterGroup label="Amenities">
        <div className="space-y-2.5">
          {AMENITIES.map((amenity) => (
            <Checkbox
              key={amenity}
              label={amenity}
              checked={amenities.includes(amenity)}
              onChange={() => toggle(amenities, setAmenities, amenity)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup label="Price Range (per hr)">
        <input
          type="range"
          min={0}
          max={6750}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex items-center justify-between mt-1.5 font-dm text-xs text-gray-400">
          <span>₨20</span>
          <span>₨{maxPrice.toLocaleString()}+</span>
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <p className="font-dm text-xs font-medium text-gray-500 mb-3">{label}</p>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500/30"
      />
      <span className="font-dm text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}