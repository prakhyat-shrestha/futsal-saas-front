"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useVenueStore } from "@/store/venueStore";
import { VenueForm, VenueFormPayload } from "@/components/dashboard/venueForm";

export default function NewVenuePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addVenue } = useVenueStore();

  async function handleSubmit(payload: VenueFormPayload) {
    if (!user) return;
    await addVenue({
      ownerId: user.id,
      ...payload,
      imageUrl: undefined,
      isActive: true,
    });
    router.push("/dashboard/venues");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-gray-900 mb-1">Create New Venue</h1>
        <p className="font-dm text-gray-500 text-sm">
          Add your facility's details so players can find and book it.
        </p>
      </div>

      <VenueForm onSubmit={handleSubmit} submitLabel="Publish Venue" submittingLabel="Publishing..." />
    </div>
  );
}