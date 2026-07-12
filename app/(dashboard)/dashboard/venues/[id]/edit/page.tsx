"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useVenueStore } from "@/store/venueStore";
import { useAuthStore } from "@/store/authStore";
import {
  VenueForm,
  VenueFormPayload,
  VenueFormValues,
} from "@/components/dashboard/venueForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DangerZone } from "@/components/dashboard/DanzerZone";
import { Venue } from "@/types";

export default function EditVenuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { venues, fetchVenues, updateVenue, deleteVenue, isLoading } =
    useVenueStore();
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

  if (!venue) notFound();

  const initialValues: VenueFormValues = {
    name: venue.name,
    description: venue.description ?? "",
    address: venue.address,
    city: venue.city,
    latitude: String(venue.latitude),
    longitude: String(venue.longitude),
    phone: venue.phone ?? "",
    email: venue.email ?? "",
    images: [], // always empty — new uploads only
  };

  async function handleSubmit(venue: Venue, payload: VenueFormPayload) {
    const { images, ...venueData } = payload;

    // send only schema-valid fields
    await updateVenue(venue.id, {
      name: venueData.name,
      description: venueData.description,
      address: venueData.address,
      city: venueData.city,
      latitude: venueData.latitude,
      longitude: venueData.longitude,
      phone: venueData.phone,
      email: venueData.email,
    });

    // upload new images if selected
    if (images.length > 0) {
      await uploadVenueImages(venue.id, images);
    }

    router.push("/dashboard/venues");
  }

  async function handleDelete(venue: Venue) {
    await deleteVenue(venue.id);
    router.push("/dashboard/venues");
  }

  console.log("vvvenue",venue);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">
          Edit Venue
        </h1>
        <p className="font-dm text-gray-500 text-sm">
          Update your facility's details.
        </p>
      </div>

      <VenueForm
        initialValues={initialValues}
       existingImageUrls={venue.imageUrls ?? []}
        onSubmit={(payload) => handleSubmit(venue, payload)}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
      />

      <DangerZone
        venueName={venue.name}
        onDelete={() => handleDelete(venue)}
      />
    </div>
  );
}

async function uploadVenueImages(venueId: string, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { useAuthStore } = await import("@/store/authStore");
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/venues/${venueId}/images`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? "Failed to upload venue images.");
  }
}