"use client"
import { AdminSidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/Header';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const[showSidebar, setShowSidebar] = useState(false);
  return (
    <RoleGuard allow={['ADMIN']}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar showSidebar = {showSidebar} setShowSidebar={setShowSidebar}/>
        <div className="flex-1 flex flex-col">
          <AdminHeader showSidebar = {showSidebar} setShowSidebar={setShowSidebar}/>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
