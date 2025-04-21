import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to CSV - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to CSV format. Extract GPS data into simple spreadsheets for any software. Easy to use and works in your browser.",
  keywords: "gpx to csv, convert gpx, csv data, gps data, spreadsheet",
}

export default function GpxToCsvPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="CSV"
        title="Convert GPX to CSV"
        description="Convert your GPX files to CSV (Comma-Separated Values) format for maximum compatibility with spreadsheet software, databases, and data analysis tools. Extract your GPS data into a simple, universal format."
        features={[
          "Extract GPS data points into a simple text-based format",
          "Choose between different delimiter options (comma, semicolon, tab)",
          "Include latitude, longitude, elevation, and time data",
          "Select your preferred time format",
          "Add column headers for better readability",
          "Create files that can be opened in any spreadsheet software",
        ]}
        additionalInfo="CSV is one of the most universal data formats available. Files in CSV format can be opened by virtually any spreadsheet program, database, or data analysis tool. This makes it an excellent choice when you need to share your GPS data with others who might be using different software platforms."
        isComingSoon={true}
      />
    </div>
  )
}
