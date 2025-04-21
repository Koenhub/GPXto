import { type NextRequest, NextResponse } from "next/server"
import { convertedFiles } from "../../convert/route"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const conversionId = params.filename
    const searchParams = request.nextUrl.searchParams
    const filename = searchParams.get("filename") || "converted-file.kml"

    // Get the converted file content
    const fileData = convertedFiles[conversionId]

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Determine content type based on file extension
    let contentType = "application/octet-stream"
    if (filename.endsWith(".kml")) {
      contentType = "application/vnd.google-earth.kml+xml"
    } else if (filename.endsWith(".gpx")) {
      contentType = "application/gpx+xml"
    }

    // Create response with the file content
    const response = new NextResponse(fileData.content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })

    // Remove the file from storage after download
    delete convertedFiles[conversionId]

    return response
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
