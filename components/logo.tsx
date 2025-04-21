import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="no-underline">
      <span className="text-lg sm:text-xl font-semibold">
        GPX<span className="text-primary">to</span>
      </span>
    </Link>
  )
}
