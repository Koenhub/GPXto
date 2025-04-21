import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to GeoJSON - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to GeoJSON format. Perfect for web maps and JavaScript applications. Simple to use and completely free.",
  keywords: "gpx to geojson, convert gpx, web mapping, javascript maps, leaflet",
}

export default function GpxToGeoJsonPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="GeoJSON"
        title="Convert GPX to GeoJSON"
        description="Transform your GPX files into GeoJSON format, the standard for representing geographical features in web mapping applications. Ideal for developers building interactive maps or working with JavaScript mapping libraries."
        features={[
          "Convert GPX data to the GeoJSON standard format",
          "Option to simplify geometry for smaller file sizes",
          "Preserve elevation and time data in properties",
          "Include all GPX metadata in the GeoJSON properties",
          "Create files compatible with Leaflet, Mapbox, and other mapping libraries",
          "Optimize for web usage with adjustable simplification tolerance",
        ]}
        additionalInfo="GeoJSON is the standard format for representing geographical features in modern web mapping applications. It's natively supported by JavaScript libraries like Leaflet and Mapbox GL, making it the perfect choice for developers building interactive maps. The JSON-based structure also makes it easy to work with in any programming language."
        isComingSoon={true}
      />
    </div>
  )
}
