import { PlayerHeader } from "@/components/play/Header";
import { PlayerFooter } from "@/components/play/Footer";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Header } from "@/components/common/Header";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["PLAYER"]}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="xl:mx-28 transition-all">
           <Header/>
        </div>
       
         
        <main className="flex-1">{children}</main>
        <PlayerFooter />
      </div>
    </RoleGuard>
  );
}
