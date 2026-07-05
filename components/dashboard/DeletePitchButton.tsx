"use client";

import { useState } from "react";
import { Trash2, Check, X } from "lucide-react";

export function DeletePitchButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch {
      setIsDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleConfirm}
          disabled={isDeleting}
          className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
          aria-label="Confirm delete"
        >
          {isDeleting ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={13} />
          )}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          aria-label="Cancel delete"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
      aria-label="Delete pitch"
    >
      <Trash2 size={13} />
    </button>
  );
}