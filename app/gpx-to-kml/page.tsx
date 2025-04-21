import type { Metadata } from "next"
import { GpxToKmlTool } from "@/components/gpx-to-kml-tool"

export const metadata: Metadata = {
  title: "Convert GPX to KML - Free Online Converter | GPXto",
  description:
    "Convert your GPX files to KML format for use with Google Earth and Google Maps. Free online tool with no registration required.",
  keywords: "gpx to kml, convert gpx, kml converter, google earth, google maps, tracks, waypoints, routes",
}

export default function GpxToKmlPage() {
  return (
    <div>
      <GpxToKmlTool />
    </div>
  )
}
