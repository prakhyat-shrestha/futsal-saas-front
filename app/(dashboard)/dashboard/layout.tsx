import { Sidebar } from "@/components/Sidebar";
import { OwnerHeader } from '@/components/dashboard/Header';
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["VENUE_OWNER"]}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

                <div className="flex-1 flex flex-col">
                  <OwnerHeader />
                  <main className="flex-1 overflow-x-hidden">{children}</main>
                </div>

        
      </div>
    </RoleGuard>
  );
}
