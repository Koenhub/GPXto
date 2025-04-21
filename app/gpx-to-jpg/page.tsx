import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to JPG - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to JPG images. Create shareable maps of your routes for social media or presentations. No software needed.",
  keywords: "gpx to jpg, convert gpx, route image, map image, gps visualization",
}

export default function GpxToJpgPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="JPG"
        title="Convert GPX to JPG"
        description="Transform your GPX routes into JPG images that you can easily share on social media, include in documents, or use in presentations. Create visual representations of your GPS tracks with customizable map styles."
        features={[
          "Generate high-quality JPG images from your GPX routes",
          "Choose from different map styles as backgrounds",
          "Customize image dimensions to fit your needs",
          "Add start/end markers and waypoint labels",
          "Adjust image quality settings",
          "Create shareable visualizations of your routes",
        ]}
        additionalInfo="JPG images of your routes are perfect for sharing on social media, including in blog posts, or adding to presentations. They provide a quick visual representation of your journey without requiring the viewer to have specialized software or knowledge of GPS data formats."
        isComingSoon={true}
      />
    </div>
  )
}
