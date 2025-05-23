import type { Metadata } from "next"
import { GpxToKmlTool } from "@/components/gpx-to-kml-tool"

export const metadata: Metadata = {
  title: "Convert GPX to KML - Free online converter - GPXto",
  description:
    "Convert GPX to KML free, directly in your browser. Our free online converter preserves tracks, routes, waypoints, and elevation data. It's fast and easy to use.",
  keywords: "gpx to kml, convert gpx, kml converter, google earth, google maps, tracks, waypoints, routes",
}

export default function GpxToKmlPage() {
  return (
    <div>
      <GpxToKmlTool />
    </div>
  )
}
