'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BookingTabs, BookingTab } from '@/components/play/BookingTabs';
import { FeaturedBookingCard } from '@/components/play/FeaturedBookingCard';
import { CompactBookingCard } from '@/components/play/CompactBookingCard';
import { Booking } from '@/components/play/types';

import { EmptyState } from '@/components/shared/EmptyState';
import { CalendarX } from 'lucide-react';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    venueName: 'The Goals Hub - Downtown',
    courtName: 'Pitch 4',
    pitchType: '5v5',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80',
    dateLabel: 'Tomorrow, 14th Nov',
    timeRange: '19:00 - 20:00',
    status: 'confirmed',
  },
  {
    id: 'b2',
    venueName: 'Eastside Arena',
    courtName: 'Pitch 2',
    pitchType: '7v7',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
    dateLabel: 'Sat, 18 Nov',
    timeRange: '10:00 AM · 90 min',
    status: 'pending',
  },
];

export default function MyBookingsPage() {
  const [tab, setTab] = useState<BookingTab>('Upcoming');
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  function handleCancel(id: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)));
  }

  const visibleBookings = bookings.filter((b) => {
    if (tab === 'Upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (tab === 'Past Bookings') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const [featured, ...rest] = visibleBookings;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="font-syne font-bold text-2xl text-gray-900 mb-1">My Bookings</h1>
          <p className="font-dm text-sm text-gray-400">Manage your upcoming games and view past match history.</p>
        </div>

        <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-2xl px-6 py-3">
          <Stat label="Matches Played" value="24" />
          <div className="w-px h-8 bg-gray-100" />
          <Stat label="Favorite Venue" value="The Goals Hub" />
        </div>
      </div>

      <div className="mb-8">
        <BookingTabs active={tab} onChange={setTab} />
      </div>

      {visibleBookings.length === 0 ? (
        <EmptyState icon={CalendarX} title={`No ${tab.toLowerCase()} bookings yet.`} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured booking */}
          <div className="lg:col-span-2">
            {featured && <FeaturedBookingCard booking={featured} onCancel={handleCancel} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {rest.map((booking) => (
              <CompactBookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}

            <PromoCard />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-dm text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="font-syne font-bold text-sm text-gray-900">{value}</p>
    </div>
  );
}

function PromoCard() {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
      <div className="relative z-10">
        <p className="font-syne font-semibold text-sm text-white mb-1.5">Need a last minute pitch?</p>
        <p className="font-dm text-xs text-gray-300 mb-4">Find available slots in your area right now.</p>
        <Link
          href="/play"
          className="inline-flex items-center gap-1.5 text-sm font-dm font-semibold text-green-400 hover:text-green-300 transition-colors"
        >
          Search Now
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
