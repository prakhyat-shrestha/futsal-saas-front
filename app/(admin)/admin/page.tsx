import { DollarSign, CalendarCheck, ShieldAlert, UserPlus, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">Platform Overview</h1>
          <p className="font-dm text-sm text-gray-500 max-w-xl">
            Real-time performance metrics and stadium operations across the PITCHFAST network.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-black font-syne font-bold px-5 py-3 rounded-full text-sm transition-colors shrink-0">
          <BarChart3 size={16} />
          GENERATE REPORT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={DollarSign}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend="12.4%"
          label="Total Revenue"
          value="$142,850"
          sub="vs $127,100 last month"
        />
        <StatCard
          icon={CalendarCheck}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend="8.1%"
          label="Active Bookings"
          value="842"
          sub="Ongoing games today"
        />
        <StatCard
          icon={ShieldAlert}
          iconBg="bg-red-100"
          iconColor="text-red-500"
          trend="14"
          trendType="alert"
          label="Pending Approvals"
          value="27"
          sub="New venues awaiting review"
        />
        <StatCard
          icon={UserPlus}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          trend="22%"
          label="New Users"
          value="1,204"
          sub="Joined in the last 7 days"
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart />
    </div>
  );
}