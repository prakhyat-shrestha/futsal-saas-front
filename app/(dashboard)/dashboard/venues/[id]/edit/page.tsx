'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useVenueStore } from '@/store/venueStore';
import { VenueForm, VenueFormPayload, VenueFormValues } from '@/components/dashboard/venueForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Venue } from '@/types';
import { DangerZone } from '@/components/dashboard/DanzerZone';

export default function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const { venues, fetchVenues, updateVenue, deleteVenue, isLoading } = useVenueStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (venues.length === 0) {
      fetchVenues().then(() => setHasChecked(true));
    } else {
      setHasChecked(true);
    }
  }, [venues.length, fetchVenues]);

  const venue = venues.find((v) => v.id === id);

  if (!hasChecked || isLoading) {
    return <LoadingSpinner fullScreen label="Loading venue..." />;
  }

  if (!venue) {
    notFound();
  }

  const initialValues: VenueFormValues = {
    name: venue.name,
    description: venue.description ?? '',
    address: venue.address,
    city: venue.city,
    latitude: String(venue.latitude),
    longitude: String(venue.longitude),
    phone: venue.phone ?? '',
    email: venue.email ?? '',
  };

  async function handleSubmit(venue: Venue, payload: VenueFormPayload) {
    await updateVenue(venue.id, payload);
    router.push('/dashboard/venues');
  }

  // inside the component, alongside handleSubmit:
  async function handleDelete(venue: Venue) {
    await deleteVenue(venue.id);
    router.push('/dashboard/venues');
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">Edit Venue</h1>
        <p className="font-dm text-gray-500 text-sm">Update your facility's details.</p>
      </div>

      <VenueForm
        initialValues={initialValues}
        onSubmit={(payload) => handleSubmit(venue, payload)}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
      />

      <DangerZone venueName={venue.name} onDelete={() => handleDelete(venue)} />
    </div>
  );
}
