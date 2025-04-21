import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="no-underline flex items-center gap-2">
      <div className="rounded-full overflow-hidden">
        <Image src="/gpxto-icon.png" alt="GPXto Logo" width={36} height={36} priority />
      </div>
      <span className="text-lg sm:text-xl font-semibold">
        GPX<span className="text-primary">to</span>
      </span>
    </Link>
  )
}
