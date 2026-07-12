"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";
import { VenueForm, VenueFormPayload } from "@/components/dashboard/venueForm";
import { apiRequest } from "@/lib/api";
import { User } from "@/types";

export default function NewVenuePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addVenue } = useVenueStore();

  async function handleSubmit(user: User, payload: VenueFormPayload) {
    // Step 1: create the venue (no image yet)
    const { images, ...venueData } = payload;
    const venue = await addVenue({
      ownerId: user.id,
      ...venueData,
      imageUrl: undefined,
      isActive: true,
    });

    // Step 2: upload images if any were selected
    if (images.length > 0) {
      await uploadVenueImages(venue.id, images);
    }

    router.push("/dashboard/venues");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">
          Create New Venue
        </h1>
        <p className="font-dm text-gray-500 text-sm">
          Add your facility's details so players can find and book it.
        </p>
      </div>

      <VenueForm
        onSubmit={(payload) => handleSubmit(user!, payload)}
        submitLabel="Publish Venue"
        submittingLabel="Publishing..."
      />
    </div>
  );
}

async function uploadVenueImages(venueId: string, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  // Note: apiRequest sends Content-Type: application/json by default
  // For multipart we need a raw fetch here — don't set Content-Type manually,
  // let the browser set it with the correct boundary
  const token = (await import("@/store/authStore"))
    .useAuthStore.getState().accessToken;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/venues/${venueId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // deliberately NO Content-Type — browser sets multipart/form-data + boundary automatically
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? "Failed to upload venue images.");
  }
}