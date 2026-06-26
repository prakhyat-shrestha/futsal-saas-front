import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}