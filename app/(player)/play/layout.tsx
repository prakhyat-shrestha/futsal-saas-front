import { PlayerHeader } from "@/components/play/Header";
import { PlayerFooter } from "@/components/play/Footer";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["PLAYER"]}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PlayerHeader />
        <main className="flex-1">{children}</main>
        <PlayerFooter />
      </div>
    </RoleGuard>
  );
}
