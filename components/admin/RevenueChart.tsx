"use client";

const DATA = [
  { month: "Jan", percent: 38, projected: false },
  { month: "Feb", percent: 55, projected: false },
  { month: "Mar", percent: 45, projected: false },
  { month: "Apr", percent: 75, projected: false },
  { month: "May", percent: 100, projected: false, highlighted: true },
  { month: "Jun (est)", percent: 0, projected: true },
];

export function RevenueChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-syne font-bold text-xl text-gray-900">Revenue Growth</h2>
        <button className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 font-dm text-sm font-medium px-4 py-2 rounded-full">
          Monthly
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 h-64">
        {DATA.map((bar) => (
          <div key={bar.month} className="flex-1 flex flex-col items-center h-full">
            <div className="relative w-full flex-1 rounded-2xl bg-gray-100 overflow-hidden flex flex-col justify-end">
              {!bar.projected && (
                <div
                  className={`w-full rounded-2xl transition-all ${
                    bar.highlighted ? "bg-green-400" : "bg-[#0B1F17]"
                  }`}
                  style={{ height: `${bar.percent}%` }}
                />
              )}
            </div>
            <span
              className={`font-dm text-xs mt-3 ${
                bar.highlighted ? "text-gray-900 font-semibold" : "text-gray-400"
              }`}
            >
              {bar.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}