import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="no-underline flex items-center gap-2">
      <Image src="/gpxto-icon.png" alt="GPXto Logo" width={28} height={28} className="rounded-md" />
      <span className="text-lg sm:text-xl font-semibold">
        GPX<span className="text-primary">to</span>
      </span>
    </Link>
  )
}
