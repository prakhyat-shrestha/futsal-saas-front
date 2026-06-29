import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={20} className="text-gray-400" />
      </div>
      <p className="font-syne font-semibold text-sm text-gray-900 mb-1.5">{title}</p>
      {description && (
        <p className="font-dm text-sm text-gray-400 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}