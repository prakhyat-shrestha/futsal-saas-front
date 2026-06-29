'use client';

import { useState } from 'react';
import { Filter, Download, Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { HighlightStatCard } from '@/components/admin/HighlightStatCard';
import { VenueApprovalRow, PendingVenue } from '@/components/admin/VenueApprovalRow';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';

const MOCK_VENUES: PendingVenue[] = [
  {
    id: '1',
    name: 'Urban Turf Arena',
    tags: '5-a-side · Premium Turf',
    ownerName: 'Marco Silva',
    ownerEmail: 'marco.silva@example.com',
    location: 'London, UK',
    submittedLabel: '22 Oct 2023',
    isNew: true,
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=200&q=80',
  },
  {
    id: '2',
    name: 'Blue Pulse Futsal',
    tags: 'Futsal · Indoor Hall',
    ownerName: 'Elena Rodriguez',
    ownerEmail: 'e.rodriguez@citypulse.es',
    location: 'Madrid, ES',
    submittedLabel: '21 Oct 2023',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=200&q=80',
  },
  {
    id: '3',
    name: 'Goal Zone Central',
    tags: '7-a-side · Floodlit',
    ownerName: 'David Chen',
    ownerEmail: 'chen@goalzone.net',
    location: 'Berlin, DE',
    submittedLabel: '20 Oct 2023',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200&q=80',
  },
  {
    id: '4',
    name: 'Pitch Perfect Elite',
    tags: 'Multi-sport · Air Conditioned',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 's.jenkins@elitepitches.com',
    location: 'New York, US',
    submittedLabel: '19 Oct 2023',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=200&q=80',
  },
];

const PAGE_SIZE = 4;
const TOTAL_SUBMISSIONS = 24;

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState(MOCK_VENUES);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_SUBMISSIONS / PAGE_SIZE);

  function handleApprove(id: string) {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  }

  function handleReject(id: string) {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">Venue Approvals</h1>
          <p className="font-dm text-sm text-gray-500">Review and manage pending stadium submissions</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-full transition-colors">
            <Filter size={15} />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-dm text-sm font-medium px-4 py-2.5 rounded-full transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Clock}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          trend="+12%"
          label="Pending Reviews"
          value="24"
          sub=""
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend="+5"
          label="Approved Today"
          value="18"
          sub=""
        />
        <StatCard
          icon={XCircle}
          iconBg="bg-red-100"
          iconColor="text-red-500"
          trend="-2"
          trendType="alert"
          label="Rejected This Week"
          value="7"
          sub=""
        />
        <HighlightStatCard label="Avg. Approval Time" value="4.2 Hours" icon={Zap} />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  Venue Details
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Owner
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Location
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Submitted
                </th>
                <th className="text-right font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="px-6">
              {venues.map((venue) => (
                <VenueApprovalRow key={venue.id} venue={venue} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </tbody>
          </table>
        </div>

        {venues.length === 0 && (
          <EmptyState icon={CheckCircle2} title="All caught up" description="No pending submissions on this page." />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="font-dm text-sm text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, TOTAL_SUBMISSIONS)} of{' '}
            {TOTAL_SUBMISSIONS} submissions
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-full font-dm text-sm font-medium transition-colors ${
                  p === page ? 'bg-[#0B1F17] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
