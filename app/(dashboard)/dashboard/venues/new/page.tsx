"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Hash,
  Layers,
  Droplets,
  SquareParking,
  Users,
  Sun,
  ImagePlus,
  CheckCircle2,
  Rocket,
  Info,
  ChevronDown,
} from "lucide-react";

const PITCH_SIZES = ["5v5", "7v7", "9v9", "11v11"];

const AMENITIES = [
  { key: "showers", label: "Showers", icon: Droplets },
  { key: "parking", label: "Parking", icon: SquareParking },
  { key: "changing_rooms", label: "Changing Rms", icon: Users },
  { key: "floodlights", label: "Floodlights", icon: Sun },
];

export default function NewVenuePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [numPitches, setNumPitches] = useState("1");
  const [surfaceType, setSurfaceType] = useState("");
  const [selectedSize, setSelectedSize] = useState("7v7");
  const [amenities, setAmenities] = useState<string[]>(["parking", "changing_rooms"]);
  const [baseRate, setBaseRate] = useState("");

  function toggleAmenity(key: string) {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">Create New Venue</h1>
          <p className="font-dm text-gray-500 text-sm">
            Configure your facility details and pitch specifics.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-dm text-gray-400 shrink-0 mt-1">
          <Info size={14} />
          Auto-saving draft...
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: form sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Info */}
          <FormSection step={1} title="Basic Info">
            <Field label="Venue Name">
              <InputWithIcon icon={Building2} value={name} onChange={setName} placeholder="e.g., Central Park Arena" />
            </Field>
            <Field label="Location / Address">
              <InputWithIcon icon={MapPin} value={address} onChange={setAddress} placeholder="Full street address" />
            </Field>
          </FormSection>

          {/* 2. Pitch Configuration */}
          <FormSection step={2} title="Pitch Configuration">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Field label="Number of Pitches">
                <InputWithIcon icon={Hash} value={numPitches} onChange={setNumPitches} placeholder="1" type="number" />
              </Field>
              <Field label="Surface Type">
                <div className="relative">
                  <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={surfaceType}
                    onChange={(e) => setSurfaceType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-3 font-dm text-sm text-gray-900 appearance-none focus:outline-none focus:border-green-500/50 transition-colors"
                  >
                    <option value="">Select surface</option>
                    <option value="4g_turf">4G Artificial Turf</option>
                    <option value="3g_turf">3G Artificial Turf</option>
                    <option value="grass">Natural Grass</option>
                    <option value="concrete">Concrete</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </Field>
            </div>

            <p className="font-dm text-xs font-medium text-gray-600 mb-2.5">Pitch Sizes Supported</p>
            <div className="flex flex-wrap gap-2">
              {PITCH_SIZES.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-full text-sm font-dm font-medium border transition-colors ${
                      active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* 3. Amenities */}
          <FormSection step={3} title="Amenities">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AMENITIES.map((a) => {
                const active = amenities.includes(a.key);
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => toggleAmenity(a.key)}
                    className={`flex flex-col items-center gap-2 rounded-xl border py-4 px-2 transition-colors ${
                      active
                        ? "bg-green-100 border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-dm text-xs font-medium">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* 4 & 5. Pricing + Media */}
          <div className="grid sm:grid-cols-2 gap-6">
            <FormSection step={4} title="Pricing">
              <Field label="Base Hourly Rate">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-dm text-sm">$</span>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                </div>
              </Field>
              <p className="font-dm text-xs text-gray-400 mt-2">
                You can set dynamic pricing later in the dashboard.
              </p>
            </FormSection>

            <FormSection step={5} title="Media">
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-green-500/40 hover:bg-green-500/5 transition-colors text-center">
                <ImagePlus size={22} className="text-green-600" />
                <span className="font-dm text-sm font-medium text-green-600">Click to upload photos</span>
                <span className="font-dm text-xs text-gray-400">JPG, PNG up to 10MB</span>
                <input type="file" accept="image/png, image/jpeg" multiple className="hidden" />
              </label>
            </FormSection>
          </div>
        </div>

        {/* Right: summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-syne font-semibold text-base text-gray-900 mb-4">Venue Summary</h3>

            <div className="space-y-4 mb-6">
              <SummaryItem
                title="Visibility"
                desc="Venue will be live immediately after publishing."
              />
              <SummaryItem
                title="Bookings"
                desc="Accepting standard hourly bookings."
              />
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold py-3 rounded-xl text-sm transition-colors mb-2.5">
              <Rocket size={16} />
              Publish Venue
            </button>
            <button className="w-full text-center font-dm text-sm font-medium text-gray-600 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-6 h-6 rounded-full bg-green-400 text-black text-xs font-dm font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <h2 className="font-syne font-semibold text-base text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block font-dm text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function InputWithIcon({
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors"
      />
    </div>
  );
}

function SummaryItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-2.5">
      <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-dm text-sm font-medium text-gray-900">{title}</p>
        <p className="font-dm text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}