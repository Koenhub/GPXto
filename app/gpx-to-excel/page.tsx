import type { Metadata } from "next"
import { ConversionPage } from "@/components/conversion-page"
import { LaunchingSoonSticker } from "@/components/launching-soon-sticker"

export const metadata: Metadata = {
  title: "Convert GPX to Excel - Free converter online - GPXto",
  description:
    "Free online tool to convert GPX files to Excel spreadsheets. Analyze your GPS data, calculate statistics, and create charts. Easy to use and completely free.",
  keywords: "gpx to excel, convert gpx, excel spreadsheet, gps data analysis",
}

export default function GpxToExcelPage() {
  return (
    <div className="relative">
      <LaunchingSoonSticker />
      <ConversionPage
        from="GPX"
        to="Excel"
        title="Convert GPX to Excel"
        description="Convert your GPX files to Excel (XLSX) format for advanced data analysis and manipulation. Extract coordinates, elevation data, timestamps, and more into a structured spreadsheet format."
        features={[
          "Extract all GPS data points into organized spreadsheet columns",
          "Include latitude, longitude, elevation, and time data",
          "Option to calculate additional metrics like speed and distance",
          "Choose between different time formats",
          "Split tracks into separate worksheets for better organization",
          "Customize column headers and data formatting",
        ]}
        additionalInfo="Excel spreadsheets allow you to perform advanced data analysis on your GPS tracks. You can create custom calculations, generate charts and graphs, filter data points, and combine information from multiple sources. This is particularly useful for athletes analyzing performance data or researchers working with geospatial information."
        isComingSoon={true}
      />
    </div>
  )
}
