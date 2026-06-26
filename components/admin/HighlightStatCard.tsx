// components/admin/HighlightStatCard.tsx
import { Zap } from "lucide-react";

export function HighlightStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0B1F17] rounded-2xl p-6 flex flex-col">
      <span className="w-11 h-11 rounded-xl bg-green-400/10 flex items-center justify-center mb-5">
        <Zap size={20} className="text-green-400" />
      </span>
      <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </p>
      <p className="font-syne font-bold text-3xl text-white">{value}</p>
    </div>
  );
}