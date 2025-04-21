import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to PDF - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to PDF maps. Create printable route maps with elevation profiles. No software to install, works in your browser.",
  keywords: "gpx to pdf, convert gpx, pdf map, route map, printable map",
}

export default function GpxToPdfPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="PDF"
        title="Convert GPX to PDF"
        description="Transform your GPX files into printable PDF documents with embedded maps, elevation profiles, and route statistics. Perfect for sharing routes with others or creating physical backups of your GPS data."
        features={[
          "Generate high-quality PDF documents from your GPX files",
          "Include interactive maps with your route clearly marked",
          "Add elevation profiles to visualize the terrain",
          "Include route statistics like distance, elevation gain, and duration",
          "Choose between different page sizes and orientations",
          "Select from various map styles to suit your needs",
        ]}
        additionalInfo="PDF documents are perfect for sharing routes with people who don't have specialized GPS software. They can be easily printed, emailed, or included in other documents, making them ideal for trip planning, documentation, or sharing outdoor adventures."
        isComingSoon={true}
      />
    </div>
  )
}
