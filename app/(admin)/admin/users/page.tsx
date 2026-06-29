'use client';

import { useState } from 'react';
import { ChevronRight, UserPlus, Users, ShieldCheck, ChevronDown } from 'lucide-react';
import { UserRow, PlatformUser } from '@/components/admin/UserRow';
import { Pagination } from '@/components/admin/Pagination';

import { EmptyState } from '@/components/shared/EmptyState';

type StatusFilter = 'All' | 'Active' | 'Pending' | 'Banned';

const MOCK_USERS: PlatformUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Player',
    joinedLabel: 'Oct 12, 2023',
    status: 'Active',
    avatarColor: '#D1D5DB',
    initials: 'JD',
  },
  {
    id: '2',
    name: 'Sarah Arena',
    email: 'owner@arena-sports.com',
    role: 'Venue Owner',
    joinedLabel: 'Sep 05, 2023',
    status: 'Active',
    avatarColor: '#34D399',
    initials: 'SA',
  },
  {
    id: '3',
    name: 'Alex Striker',
    email: 'alex.striker@club.io',
    role: 'Player',
    joinedLabel: 'Nov 28, 2023',
    status: 'Pending',
    avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&q=80',
    avatarColor: '#D1D5DB',
    initials: 'AS',
  },
  {
    id: '4',
    name: 'Mike Keeper',
    email: 'mike.k@blocked.com',
    role: 'Player',
    joinedLabel: 'Aug 14, 2023',
    status: 'Banned',
    avatarColor: '#FCA5A5',
    initials: 'MK',
  },
];

const STATUS_TABS: StatusFilter[] = ['All', 'Active', 'Pending', 'Banned'];
const PAGE_SIZE = 4;
const TOTAL_USERS = 1284;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_USERS / PAGE_SIZE);

  function handleBan(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Banned' } : u)));
  }

  function handleLiftBan(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Active' } : u)));
  }

  function handleEdit(id: string) {
    console.log('Edit user', id);
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 font-dm text-sm text-gray-400 mb-4">
        <span>Management</span>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">User Directory</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-gray-900 mb-2">User Management</h1>
          <p className="font-dm text-sm text-gray-500 max-w-xl">
            Oversee player accounts and venue owners. Manage credentials, status updates, and platform permissions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#0B1F17] hover:bg-[#0B1F17]/90 text-white font-dm text-sm font-semibold px-5 py-3 rounded-full transition-colors shrink-0">
          <UserPlus size={16} />
          Create New User
        </button>
      </div>

      {/* Filters + stats */}
      <div className="grid lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Filter by Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-dm font-medium border transition-colors ${
                  statusFilter === status
                    ? 'bg-green-400 text-black border-green-400'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="font-dm text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Filter by Role</p>
          <button className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-dm text-sm text-gray-900 hover:border-gray-300 transition-colors">
            All Roles
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="bg-[#0B1F17] rounded-2xl p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
            <Users size={20} className="text-green-400" />
          </span>
          <div>
            <p className="font-dm text-xs text-gray-400 mb-1">Total Users</p>
            <p className="font-syne font-bold text-2xl text-white">{TOTAL_USERS.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-green-600" />
          </span>
          <div>
            <p className="font-dm text-xs text-gray-500 mb-1">Active Now</p>
            <p className="font-syne font-bold text-2xl text-gray-900">84</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  User Name
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Email
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Role
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Joined Date
                </th>
                <th className="text-left font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 py-4">
                  Status
                </th>
                <th className="text-right font-dm text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} onEdit={handleEdit} onBan={handleBan} onLiftBan={handleLiftBan} />
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your filters." />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="font-dm text-sm text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, TOTAL_USERS)} of{' '}
            {TOTAL_USERS.toLocaleString()} users
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
