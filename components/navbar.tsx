import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "./logo"

export function Navbar() {
  return (
    <header className="py-6">
      <nav className="flex items-center justify-between">
        {/* Logo on the left */}
        <Logo />

        {/* Menu on the right */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="no-underline">
            Home
          </Link>
          <Link href="/about" className="no-underline">
            About
          </Link>
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
