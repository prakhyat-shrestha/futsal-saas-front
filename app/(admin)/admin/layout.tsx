"use client"
import { AdminSidebar } from '@/components/admin/Sidebar';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useState } from 'react';
import { Header } from '@/components/common/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const[showSidebar, setShowSidebar] = useState(false);
  return (
    //temporary removed RoleGuard
    // <RoleGuard allow={['ADMIN']}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar/>
        <div className="flex-1 flex flex-col">
          
          <Header/>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    // </RoleGuard>
  );
}
