import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
