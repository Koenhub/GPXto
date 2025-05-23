import type { Metadata } from "next"
import { GpxToExcelTool } from "@/components/gpx-to-excel-tool"

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
    </div>
  )
}
