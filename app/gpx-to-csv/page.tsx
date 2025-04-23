import type { Metadata } from "next"
import { GpxToCsvTool } from "@/components/gpx-to-csv-tool"
import { DonationReminder } from "@/components/donation-reminder"

export const metadata: Metadata = {
  title: "Convert GPX to CSV - Free online converter - GPXto",
  description:
    "Convert your GPX files to CSV format for use with spreadsheets and databases. Free online tool with no registration required.",
  keywords: "gpx to csv, convert gpx, csv converter, spreadsheet, data analysis, gps data, comma separated values",
}

export default function GpxToCsvPage() {
  return (
    <div>
      <GpxToCsvTool />
      <DonationReminder />
    </div>
  )
}
