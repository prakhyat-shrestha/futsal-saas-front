"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Navigation,
  Phone,
  Mail,
  FileText,
  Rocket,
  CheckCircle2,
} from "lucide-react";

import { useVenueStore } from "@/store/venueStore";
import { useAuthStore } from "@/store/authStore";

import { User } from "@/types";

interface CreateVenuePayload {
  ownerId:string;
  name: string;
  description?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  imageUrl?:string;
  isActive:boolean;
}

export default function NewVenuePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const { addVenue } = useVenueStore();
  const { user } = useAuthStore();

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (name.length > 200) next.name = "Name must be under 200 characters.";
    if (address.trim().length < 5) next.address = "Address must be at least 5 characters.";
    if (city.trim().length < 2) next.city = "City must be at least 2 characters.";

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) next.latitude = "Latitude must be between -90 and 90.";
    if (isNaN(lng) || lng < -180 || lng > 180) next.longitude = "Longitude must be between -180 and 180.";

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildPayload(user:User): CreateVenuePayload {
    return {
            ownerId: user.id,
            name: name.trim(),
            description: description.trim() || undefined,
            imageUrl: undefined, // no upload support yet
            address: address.trim(),
            city: city.trim(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            isActive: true,     
    };
  }

  async function handlePublish() {
    if (!validate()) return;

    if (!user) return; // shouldn't happen if route is protected, but guard anyway


    setIsSubmitting(true);
    try {
      const payload = buildPayload(user);
      // await createVenue(payload);
      console.log("Creating venue:", payload);
      addVenue(payload);
      router.push("/dashboard/venues");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">Create New Venue</h1>
        <p className="font-dm text-gray-500 text-sm">
          Add your facility's details so players can find and book it.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <FormSection step={1} title="Basic Info">
            <Field label="Venue Name" error={errors.name}>
              <InputWithIcon
                icon={Building2}
                value={name}
                onChange={setName}
                placeholder="e.g., Central Park Arena"
                error={!!errors.name}
              />
            </Field>
            <Field label="Description" optional>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell players what makes your venue great..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                />
              </div>
            </Field>
          </FormSection>

          {/* Location */}
          <FormSection step={2} title="Location">
            <Field label="Address" error={errors.address}>
              <InputWithIcon
                icon={MapPin}
                value={address}
                onChange={setAddress}
                placeholder="Full street address"
                error={!!errors.address}
              />
            </Field>
            <Field label="City" error={errors.city}>
              <InputWithIcon
                icon={Building2}
                value={city}
                onChange={setCity}
                placeholder="e.g., Kathmandu"
                error={!!errors.city}
              />
            </Field>

            <div className="flex items-center justify-between mb-2.5">
              <p className="font-dm text-xs font-medium text-gray-600">Coordinates</p>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 text-xs font-dm font-medium text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors"
              >
                <Navigation size={13} />
                {isLocating ? "Locating..." : "Use my current location"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude" error={errors.latitude}>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="27.717245"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors ${
                    errors.latitude ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </Field>
              <Field label="Longitude" error={errors.longitude}>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="85.323959"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors ${
                    errors.longitude ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </Field>
            </div>
          </FormSection>

          {/* Contact */}
          <FormSection step={3} title="Contact" optional>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone" optional error={errors.phone}>
                <InputWithIcon icon={Phone} value={phone} onChange={setPhone} placeholder="98XXXXXXXX" />
              </Field>
              <Field label="Email" optional error={errors.email}>
                <InputWithIcon
                  icon={Mail}
                  value={email}
                  onChange={setEmail}
                  placeholder="venue@example.com"
                  error={!!errors.email}
                />
              </Field>
            </div>
          </FormSection>
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
                title="Location"
                desc={
                  city
                    ? `Listed in ${city}.`
                    : "Add a city so players can find this venue."
                }
              />
            </div>

            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-syne font-semibold py-3 rounded-xl text-sm transition-colors mb-2.5"
            >
              <Rocket size={16} />
              {isSubmitting ? "Publishing..." : "Publish Venue"}
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
  optional,
  children,
}: {
  step: number;
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-6 h-6 rounded-full bg-green-400 text-black text-xs font-dm font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <h2 className="font-syne font-semibold text-base text-gray-900">{title}</h2>
        {optional && (
          <span className="font-dm text-xs text-gray-400 ml-1">(optional)</span>
        )}
      </div>
      {children}
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
    <div className="mb-4 last:mb-0">
      <label className="block font-dm text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal"> (optional)</span>}
      </label>
      {children}
      {error && <p className="font-dm text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

function InputWithIcon({
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
}: {
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 font-dm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500/50 transition-colors ${
          error ? "border-red-300" : "border-gray-200"
        }`}
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