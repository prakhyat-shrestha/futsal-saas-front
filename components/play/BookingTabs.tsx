"use client";

const TABS = ["Upcoming", "Past Bookings", "Cancelled"] as const;
export type BookingTab = (typeof TABS)[number];

export function BookingTabs({
  active,
  onChange,
}: {
  active: BookingTab;
  onChange: (tab: BookingTab) => void;
}) {
  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1">
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-dm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}