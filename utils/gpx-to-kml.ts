import { DOMParser } from "xmldom"

interface ConversionOptions {
  lineColor?: string
  lineWidth?: number
  includeElevation?: boolean
  folderName?: string
}

export function convertGpxToKml(gpxContent: string, options: ConversionOptions = {}): string {
  // Default options
  const {
    lineColor = "#FF0000", // Red
    lineWidth = 4,
    includeElevation = true,
    folderName = "GPX Tracks",
  } = options

  try {
    // Parse GPX content
    const parser = new DOMParser()
    const gpxDoc = parser.parseFromString(gpxContent, "text/xml")

    // Check if it's a valid GPX file
    const gpxElement = gpxDoc.getElementsByTagName("gpx")[0]
    if (!gpxElement) {
      throw new Error("Invalid GPX file")
    }

    // Extract file name from metadata if available
    let fileName = "GPX Conversion"
    const metadataName = gpxDoc.getElementsByTagName("metadata")[0]?.getElementsByTagName("name")[0]?.textContent
    if (metadataName) {
      fileName = metadataName
    }

    // Begin creating the KML document
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${fileName}</name>
    <description>Converted from GPX to KML using GPXto.com</description>`

    // Add styles
    kml += `
    <Style id="trackStyle">
      <LineStyle>
        <color>${convertHexToKmlColor(lineColor)}</color>
        <width>${lineWidth}</width>
      </LineStyle>
    </Style>
    <Style id="waypointStyle">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>`

    // Process tracks
    const tracks = gpxDoc.getElementsByTagName("trk")
    if (tracks.length > 0) {
      kml += `
    <Folder>
      <name>Tracks</name>`

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const trackName = track.getElementsByTagName("name")[0]?.textContent || `Track ${i + 1}`
        const trackDesc = track.getElementsByTagName("desc")[0]?.textContent || ""
        const trackSegments = track.getElementsByTagName("trkseg")

        kml += `
      <Placemark>
        <name>${escapeXml(trackName)}</name>
        <description>${escapeXml(trackDesc)}</description>
        <styleUrl>#trackStyle</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <altitudeMode>${includeElevation ? "absolute" : "clampToGround"}</altitudeMode>
          <coordinates>`

        for (let j = 0; j < trackSegments.length; j++) {
          const points = trackSegments[j].getElementsByTagName("trkpt")

          for (let k = 0; k < points.length; k++) {
            const lon = points[k].getAttribute("lon")
            const lat = points[k].getAttribute("lat")
            const ele = includeElevation ? points[k].getElementsByTagName("ele")[0]?.textContent || "0" : "0"

            kml += `\n            ${lon},${lat},${ele}`
          }
        }

        kml += `
          </coordinates>
        </LineString>
      </Placemark>`
      }

      kml += `
    </Folder>`
    }

    // Process waypoints
    const waypoints = gpxDoc.getElementsByTagName("wpt")
    if (waypoints.length > 0) {
      kml += `
    <Folder>
      <name>Waypoints</name>`

      for (let i = 0; i < waypoints.length; i++) {
        const waypoint = waypoints[i]
        const lat = waypoint.getAttribute("lat")
        const lon = waypoint.getAttribute("lon")
        const ele = includeElevation ? waypoint.getElementsByTagName("ele")[0]?.textContent || "0" : "0"
        const waypointName = waypoint.getElementsByTagName("name")[0]?.textContent || `Waypoint ${i + 1}`
        const waypointDesc = waypoint.getElementsByTagName("desc")[0]?.textContent || ""

        kml += `
      <Placemark>
        <name>${escapeXml(waypointName)}</name>
        <description>${escapeXml(waypointDesc)}</description>
        <styleUrl>#waypointStyle</styleUrl>
        <Point>
          <altitudeMode>${includeElevation ? "absolute" : "clampToGround"}</altitudeMode>
          <coordinates>${lon},${lat},${ele}</coordinates>
        </Point>
      </Placemark>`
      }

      kml += `
    </Folder>`
    }

    // Process routes
    const routes = gpxDoc.getElementsByTagName("rte")
    if (routes.length > 0) {
      kml += `
    <Folder>
      <name>Routes</name>`

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        const routeName = route.getElementsByTagName("name")[0]?.textContent || `Route ${i + 1}`
        const routeDesc = route.getElementsByTagName("desc")[0]?.textContent || ""
        const routePoints = route.getElementsByTagName("rtept")

        kml += `
      <Placemark>
        <name>${escapeXml(routeName)}</name>
        <description>${escapeXml(routeDesc)}</description>
        <styleUrl>#trackStyle</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <altitudeMode>${includeElevation ? "absolute" : "clampToGround"}</altitudeMode>
          <coordinates>`

        for (let j = 0; j < routePoints.length; j++) {
          const lon = routePoints[j].getAttribute("lon")
          const lat = routePoints[j].getAttribute("lat")
          const ele = includeElevation ? routePoints[j].getElementsByTagName("ele")[0]?.textContent || "0" : "0"

          kml += `\n            ${lon},${lat},${ele}`
        }

        kml += `
          </coordinates>
        </LineString>
      </Placemark>`
      }

      kml += `
    </Folder>`
    }

    // Close the KML document
    kml += `
  </Document>
</kml>`

    return kml
  } catch (error) {
    console.error("Error converting GPX to KML:", error)
    throw error
  }
}

// Helper function to convert hex color to KML color format (AABBGGRR)
function convertHexToKmlColor(hexColor: string): string {
  // Remove # if present
  hexColor = hexColor.replace("#", "")

  // Ensure 6 characters
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split("")
      .map((c) => c + c)
      .join("")
  }

  if (hexColor.length !== 6) {
    return "ff0000ff" // Default to red if invalid
  }

  // Extract RGB components
  const r = hexColor.substring(0, 2)
  const g = hexColor.substring(2, 4)
  const b = hexColor.substring(4, 6)

  // Return in KML format: aabbggrr (alpha, blue, green, red)
  return `ff${b}${g}${r}`
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
