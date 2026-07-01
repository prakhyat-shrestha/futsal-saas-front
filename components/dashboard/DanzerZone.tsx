"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

export function DangerZone({
  venueName,
  onDelete,
}: {
  venueName: string;
  onDelete: () => Promise<void>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canConfirm = confirmText.trim() === venueName.trim();

  async function handleDelete() {
    if (!canConfirm) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-8 border border-red-200 rounded-2xl overflow-hidden">
      <div className="bg-red-50 px-6 py-4 flex items-center gap-2.5">
        <AlertTriangle size={16} className="text-red-500" />
        <h3 className="font-syne font-semibold text-sm text-red-700">Danger Zone</h3>
      </div>

      <div className="bg-white px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-dm text-sm font-medium text-gray-900">Delete this venue</p>
          <p className="font-dm text-xs text-gray-400 mt-0.5">
            This will permanently remove the venue and cannot be undone.
          </p>
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-dm font-medium text-red-600 border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-50 transition-colors shrink-0"
        >
          <Trash2 size={15} />
          Delete Venue
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h4 className="font-syne font-bold text-lg text-gray-900 mb-2">Delete venue?</h4>
            <p className="font-dm text-sm text-gray-500 mb-4">
              This will permanently delete <span className="font-semibold text-gray-900">{venueName}</span> and
              all associated courts. This action cannot be undone.
            </p>

            <label className="block font-dm text-xs font-medium text-gray-600 mb-1.5">
              Type <span className="font-semibold">{venueName}</span> to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-dm text-sm text-gray-900 mb-5 focus:outline-none focus:border-red-400 transition-colors"
              placeholder={venueName}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText("");
                }}
                className="flex-1 font-dm text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!canConfirm || isDeleting}
                className="flex-1 font-dm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-2.5 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Venue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}