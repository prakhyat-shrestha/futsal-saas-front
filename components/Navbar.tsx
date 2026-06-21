import Link from "next/link"
import { Button } from "@/components/ui/button"
//import { MobileMenu } from "./MobileMenu"

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
             <div className="flex-shrink-0 flex items-center">
               <Link href="/" className="text-2xl font-bold text-gray-800">
                 FutsalPro
               </Link>
             </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="#features"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-500 hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" className="ml-3 text-gray-500 hover:text-black">
                Sign up
              </Button>
            </Link>
          </div>
          {/* <MobileMenu /> */}
        </div>
      </div>
    </nav>
  )
}
