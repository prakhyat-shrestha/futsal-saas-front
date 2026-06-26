"use client";

import { Building2 } from "lucide-react";

export interface PendingVenue {
  id: string;
  name: string;
  tags: string;
  ownerName: string;
  ownerEmail: string;
  location: string;
  submittedLabel: string;
  isNew?: boolean;
  imageUrl?: string;
}

export function VenueApprovalRow({
  venue,
  onApprove,
  onReject,
}: {
  venue: PendingVenue;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
            {venue.imageUrl ? (
              <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={18} className="text-gray-300" />
              </div>
            )}
          </div>
          <div>
            <p className="font-syne font-semibold text-sm text-gray-900">{venue.name}</p>
            <p className="font-dm text-xs text-gray-400 mt-0.5">{venue.tags}</p>
          </div>
        </div>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-900">{venue.ownerName}</p>
        <p className="font-dm text-xs text-gray-400 mt-0.5">{venue.ownerEmail}</p>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-700">{venue.location}</p>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-700">{venue.submittedLabel}</p>
        {venue.isNew && (
          <span className="font-dm text-[10px] font-bold text-green-600 uppercase tracking-wide">
            New
          </span>
        )}
      </td>

      <td className="py-5">
        <div className="flex items-center gap-2 justify-end">
          <button className="font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
            Details
          </button>
          <button
            onClick={() => onApprove(venue.id)}
            className="font-dm text-sm font-semibold text-black bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(venue.id)}
            className="font-dm text-sm font-medium text-red-500 border border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition-colors"
          >
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}