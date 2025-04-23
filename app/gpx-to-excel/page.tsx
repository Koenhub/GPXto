import type { Metadata } from "next"
import { GpxToExcelTool } from "@/components/gpx-to-excel-tool"
import { DonationReminder } from "@/components/donation-reminder"

export const metadata: Metadata = {
  title: "Convert GPX to Excel - Free online converter - GPXto",
  description:
    "Convert your GPX files to Excel (XLSX) format for data analysis and manipulation. Free online tool with no registration required.",
  keywords: "gpx to excel, convert gpx, excel converter, spreadsheet, data analysis, gps data, xlsx",
}

export default function GpxToExcelPage() {
  return (
    <div>
      <GpxToExcelTool />
      <DonationReminder />
    </div>
  )
}
