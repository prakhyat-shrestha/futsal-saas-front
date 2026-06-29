import { AlertCircle } from "lucide-react";

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-dm text-sm text-red-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-dm text-sm font-medium text-red-700 underline mt-1"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}