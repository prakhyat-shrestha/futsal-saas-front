"use client";

import { Pencil, Ban } from "lucide-react";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "Player" | "Venue Owner";
  joinedLabel: string;
  status: "Active" | "Pending" | "Banned";
  avatarUrl?: string;
  avatarColor: string;
  initials: string;
}

const STATUS_STYLES: Record<PlatformUser["status"], string> = {
  Active: "text-green-600",
  Pending: "text-gray-400",
  Banned: "text-red-500",
};

const STATUS_DOT: Record<PlatformUser["status"], string> = {
  Active: "bg-green-500",
  Pending: "bg-gray-400",
  Banned: "bg-red-500",
};

export function UserRow({
  user,
  onEdit,
  onBan,
  onLiftBan,
}: {
  user: PlatformUser;
  onEdit: (id: string) => void;
  onBan: (id: string) => void;
  onLiftBan: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-5 px-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-bold text-sm text-gray-700 shrink-0 overflow-hidden"
            style={{ backgroundColor: user.avatarUrl ? undefined : user.avatarColor }}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.initials
            )}
          </div>
          <p className="font-dm text-sm font-semibold text-gray-900">{user.name}</p>
        </div>
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-600">{user.email}</p>
      </td>

      <td className="py-5 pr-4">
        {user.role === "Venue Owner" ? (
          <span className="inline-block font-dm text-xs font-medium text-gray-900 bg-green-300 px-2.5 py-1 rounded-md leading-tight">
            Venue Owner
          </span>
        ) : (
          <span className="inline-block font-dm text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
            Player
          </span>
        )}
      </td>

      <td className="py-5 pr-4">
        <p className="font-dm text-sm text-gray-700">{user.joinedLabel}</p>
      </td>

      <td className="py-5 pr-4">
        <span className={`flex items-center gap-1.5 font-dm text-sm font-medium ${STATUS_STYLES[user.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`} />
          {user.status}
        </span>
      </td>

      <td className="py-5 px-6"> 
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onEdit(user.id)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Edit user"
          >
            <Pencil size={14} />
          </button>

          {user.status === "Banned" ? (
            <button
              onClick={() => onLiftBan(user.id)}
              className="font-dm text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full px-4 py-2.5 transition-colors"
            >
              Lift Ban
            </button>
          ) : (
            <button
              onClick={() => onBan(user.id)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
              aria-label="Ban user"
            >
              <Ban size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}