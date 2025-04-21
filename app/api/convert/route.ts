import { type NextRequest, NextResponse } from "next/server"
import { convertGpxToKml } from "@/utils/gpx-to-kml"

// Store converted files temporarily
const convertedFiles: Record<string, { content: string; type: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()
    const fileName = file.name
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName

    let convertedContent = ""
    let outputFileName = ""

    // Process based on conversion type
    switch (type) {
      case "gpx-to-kml":
        // Get options from form data
        const lineColor = (formData.get("lineColor") as string) || "#FF0000"
        const lineWidth = Number.parseInt((formData.get("lineWidth") as string) || "4", 10)
        const includeElevation = (formData.get("includeElevation") as string) === "true"

        // Convert GPX to KML
        convertedContent = convertGpxToKml(fileContent, {
          lineColor,
          lineWidth,
          includeElevation,
        })
        outputFileName = `${fileNameWithoutExt}.kml`
        break

      // Other conversion types...
      default:
        return NextResponse.json({ error: "Unsupported conversion type" }, { status: 400 })
    }

    // Generate a unique ID for this conversion
    const conversionId = Date.now().toString(36) + Math.random().toString(36).substring(2)

    // Store the converted content
    convertedFiles[conversionId] = {
      content: convertedContent,
      type: type,
    }

    // Return the download URL
    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download/${conversionId}?filename=${encodeURIComponent(outputFileName)}`,
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 })
  }
}

// Export the convertedFiles object for use in the download API
export { convertedFiles }
