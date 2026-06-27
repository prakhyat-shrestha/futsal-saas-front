"use client";

const STATUSES = ["All", "Confirmed", "Pending", "Cancelled", "Disputed"] as const;
export type BookingStatusFilter = (typeof STATUSES)[number];

export function StatusFilterTabs({
  active,
  onChange,
}: {
  active: BookingStatusFilter;
  onChange: (status: BookingStatusFilter) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {STATUSES.map((status) => {
        const isActive = active === status;
        const isDisputed = status === "Disputed";
        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-dm font-medium transition-colors ${
              isActive
                ? "bg-[#0B1F17] text-white"
                : isDisputed
                ? "text-red-500 hover:bg-red-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}