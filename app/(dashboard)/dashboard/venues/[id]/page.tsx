"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { useVenueStore } from "@/store/venueStore";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

export default function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { venues, courts, fetchVenues, isLoading } = useVenueStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (venues.length === 0) {
      fetchVenues().then(() => setHasChecked(true));
    } else {
      setHasChecked(true);
    }
  }, [venues.length, fetchVenues]);

  const venue = venues.find((v) => v.id === id);
  const venueCourts = courts.filter((c) => c.venueId === id);

  if (!hasChecked || isLoading) {
    return <LoadingSpinner fullScreen label="Loading venue..." />;
  }

  if (!venue) notFound();

  const stats = [
    {
      label: "Today's Bookings",
      value: "0",
      sub: "No bookings yet today",
      icon: Calendar,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Active Courts",
      value: String(venueCourts.filter((c) => c.isActive).length),
      sub: `${venueCourts.length} total courts`,
      icon: LayoutGrid,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Monthly Revenue",
      value: "₨0",
      sub: "No completed bookings",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Occupancy Rate",
      value: "0%",
      sub: "Based on available slots",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="p-8">
      {/* Back nav */}
      <button
        onClick={() => router.push("/dashboard/venues")}
        className="inline-flex items-center gap-1.5 font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to My Venues
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
            {venue.imageUrl ? (
              <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Building2 size={24} className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-syne font-bold text-2xl text-gray-900">{venue.name}</h1>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-dm font-medium px-2.5 py-1 rounded-full ${
                  venue.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${venue.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                {venue.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="flex items-center gap-1.5 font-dm text-sm text-gray-500">
              <MapPin size={13} />
              {venue.address}, {venue.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/dashboard/venues/${id}/schedule`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Calendar size={15} />
            View Schedule
          </Link>
          <Link
            href={`/dashboard/venues/${id}/edit`}
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-dm text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Pencil size={14} />
            Edit Venue
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
                <Icon size={17} className={stat.iconColor} />
              </span>
              <p className="font-syne font-bold text-2xl text-gray-900 mb-0.5">{stat.value}</p>
              <p className="font-dm text-xs font-medium text-gray-600">{stat.label}</p>
              <p className="font-dm text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courts list */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-syne font-semibold text-base text-gray-900">Courts</h2>
              <Link
                href={`/dashboard/venues/${id}/courts/new`}
                className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-dm text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors"
              >
                <Plus size={15} />
                Add Court
              </Link>
            </div>

            {venueCourts.length === 0 ? (
              <EmptyState
                icon={LayoutGrid}
                title="No courts yet"
                description="Add your first court so players can start booking."
                action={
                  <Link
                    href={`/dashboard/venues/${id}/courts/new`}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                  >
                    <Plus size={16} />
                    Add Court
                  </Link>
                }
              />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-3.5">
                      Court
                    </th>
                    <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-3.5">
                      Surface
                    </th>
                    <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-3.5">
                      Capacity
                    </th>
                    <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-3.5">
                      Price/hr
                    </th>
                    <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-3.5">
                      Status
                    </th>
                    <th className="text-right font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-3.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {venueCourts.map((court) => (
                    <tr key={court.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 px-6">
                        <p className="font-dm text-sm font-semibold text-gray-900">{court.name}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-dm text-sm text-gray-600 capitalize">
                          {court.surface.replace(/_/g, " ")}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-dm text-sm text-gray-600">{court.capacity}v{court.capacity}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-dm text-sm font-medium text-gray-900">
                          ₨{court.pricePerHour.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-dm font-medium px-2.5 py-1 rounded-full ${
                            court.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${court.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                          {court.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/dashboard/venues/${id}/courts/${court.id}/edit`}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil size={13} />
                          </Link>
                          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                            <MoreHorizontal size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Venue Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-syne font-semibold text-sm text-gray-900 mb-4">Venue Info</h3>
            <div className="space-y-3">
              <InfoRow icon={MapPin} label="Address" value={`${venue.address}, ${venue.city}`} />
              {venue.phone && <InfoRow icon={Phone} label="Phone" value={venue.phone} />}
              {venue.email && <InfoRow icon={Mail} label="Email" value={venue.email} />}
              {venue.description && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="font-dm text-xs font-medium text-gray-400 mb-1">Description</p>
                  <p className="font-dm text-sm text-gray-600 leading-relaxed">{venue.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-syne font-semibold text-sm text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <QuickAction
                icon={Plus}
                label="Add a Court"
                href={`/dashboard/venues/${id}/courts/new`}
              />
              <QuickAction
                icon={Calendar}
                label="View Schedule"
                href={`/dashboard/venues/${id}/schedule`}
              />
              <QuickAction
                icon={Pencil}
                label="Edit Venue Details"
                href={`/dashboard/venues/${id}/edit`}
              />
            </div>
          </div>

          {/* Coordinates */}
          {venue.latitude && venue.longitude && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-syne font-semibold text-sm text-gray-900 mb-3">Location</h3>
              <div className="h-28 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <p className="font-dm text-xs text-gray-400">Map preview coming soon</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors"
              >
                <MapPin size={14} />
                Open in Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={15} className="text-gray-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="font-dm text-xs text-gray-400">{label}</p>
        <p className="font-dm text-sm text-gray-700 break-all">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-dm text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
    >
      <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
        <Icon size={14} className="text-gray-500 group-hover:text-green-600 transition-colors" />
      </span>
      {label}
    </Link>
  );
}