import { Sidebar } from "@/components/Sidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Header } from "@/components/common/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["VENUE_OWNER"]}>
    <>
   
    <div className="flex min-h-screen bg-gray-50">
        
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">  <Header/>{children}</main>
      </div>
    </>
      
    </RoleGuard>
  );
}
