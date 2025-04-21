import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to KMZ - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to KMZ format. Create compressed KML files with images for Google Earth. Easy to use and no registration required.",
  keywords: "gpx to kmz, convert gpx, kmz converter, google earth, compressed kml",
}

export default function GpxToKmzPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="KMZ"
        title="Convert GPX to KMZ"
        description="Convert your GPX files to KMZ format, a compressed version of KML that can include additional resources like images and custom icons. Ideal for sharing complex routes with embedded media."
        features={[
          "Convert GPX data to compressed KMZ format",
          "Include images and custom icons in your conversion",
          "Adjust compression levels to balance file size and quality",
          "Customize line styles, colors, and widths",
          "Preserve all waypoint and track information",
          "Create smaller files that are easier to share",
        ]}
        additionalInfo="KMZ files are essentially zipped KML files that can include additional resources. This format is particularly useful when you need to share routes that include custom styling, images, or other media. The compression makes the files smaller and easier to share via email or messaging apps."
        isComingSoon={true}
      />
    </div>
  )
}
