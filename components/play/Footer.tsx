import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact Support" },
  { href: "/careers", label: "Careers" },
];

export function PlayerFooter() {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
        <span className="font-syne font-extrabold text-white text-sm tracking-wide">PITCHFAST</span>

        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-dm text-xs text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="font-dm text-xs text-gray-500">© 2026 PITCHFAST. All rights reserved.</span>
      </div>
    </footer>
  );
}