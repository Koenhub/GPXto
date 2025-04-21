import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to FIT - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to FIT format for Garmin devices. Transfer routes to your fitness watch or bike computer. Simple and free to use.",
  keywords: "gpx to fit, convert gpx, fit file, garmin, fitness tracker, workout data",
}

export default function GpxToFitPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="FIT"
        title="Convert GPX to FIT"
        description="Transform your GPX files into FIT format for use with Garmin devices and other fitness platforms. Our free online converter makes it easy to prepare your routes for your fitness tracker or sports watch."
        features={[
          "Convert GPX tracks to FIT format compatible with Garmin devices",
          "Preserve all route data including waypoints, elevation, and timestamps",
          "Add activity type metadata (cycling, running, hiking, etc.)",
          "Customize data fields for your specific device",
          "Free to use with no registration required",
          "All processing happens in your browser - your data never leaves your computer",
        ]}
        additionalInfo="FIT (Flexible and Interoperable Data Transfer) is a file format developed by ANT+ and is widely used by Garmin and other fitness devices. Converting your GPX data to FIT allows you to transfer routes to your fitness device and use them for navigation or workout tracking. FIT files can store not only GPS coordinates but also fitness metrics like heart rate, cadence, and power data."
        isComingSoon={true}
      />
    </div>
  )
}
