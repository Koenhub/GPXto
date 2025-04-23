import type { Metadata } from "next"
import { GpxToKmlTool } from "@/components/gpx-to-kml-tool"
import { DonationReminder } from "@/components/donation-reminder"

export const metadata: Metadata = {
  title: "Convert GPX to KML - Free online converter - GPXto",
  description:
    "Convert your GPX files to KML format for use with Google Earth and Google Maps. Free online tool with no registration required.",
  keywords: "gpx to kml, convert gpx, kml converter, google earth, google maps, tracks, waypoints, routes",
}

export default function GpxToKmlPage() {
  return (
    <div>
      <GpxToKmlTool />
      <DonationReminder />
    </div>
  )
}
