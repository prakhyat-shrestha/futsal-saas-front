import { ArrowUp, AlertTriangle } from "lucide-react";

export function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendType = "up",
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendType?: "up" | "alert";
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </span>
        <span
          className={`flex items-center gap-1 text-sm font-dm font-semibold ${
            trendType === "alert" ? "text-red-500" : "text-green-600"
          }`}
        >
          {trendType === "alert" ? <AlertTriangle size={14} /> : <ArrowUp size={14} />}
          {trend}
        </span>
      </div>
      <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </p>
      <p className="font-syne font-bold text-3xl text-gray-900 mb-1.5">{value}</p>
      <p className="font-dm text-xs text-gray-400">{sub}</p>
    </div>
  );
}