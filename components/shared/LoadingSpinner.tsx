import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  label,
  size = "md",
  fullScreen = false,
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}) {
  const sizeMap = { sm: 16, md: 24, lg: 32 };

  const content = (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
      <Loader2 size={sizeMap[size]} className="animate-spin text-green-500" />
      {label && <span className="font-dm text-sm">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">{content}</div>;
  }

  return <div className="flex items-center justify-center py-16">{content}</div>;
}