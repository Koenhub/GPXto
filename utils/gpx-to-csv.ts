import { DOMParser } from "xmldom"

interface ConversionOptions {
  delimiter?: string
  includeHeaders?: boolean
  timeFormat?: string
  includeElevation?: boolean
  includeSpeed?: boolean
}

export function convertGpxToCsv(gpxContent: string, options: ConversionOptions = {}): string {
  // Default options
  const {
    delimiter = ",",
    includeHeaders = true,
    timeFormat = "iso",
    includeElevation = true,
    includeSpeed = false,
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

    // Get actual delimiter character
    const delimiterChar = getDelimiterChar(delimiter)

    // Prepare CSV rows
    const rows: string[] = []

    // Add headers if requested
    if (includeHeaders) {
      const headers = ["lat", "lon"]
      if (includeElevation) headers.push("ele")
      if (timeFormat !== "none") headers.push("time")
      if (includeSpeed) headers.push("speed")
      rows.push(headers.join(delimiterChar))
    }

    // Process tracks
    const tracks = gpxDoc.getElementsByTagName("trk")
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      const trackSegments = track.getElementsByTagName("trkseg")

      for (let j = 0; j < trackSegments.length; j++) {
        const points = trackSegments[j].getElementsByTagName("trkpt")

        // Process each point
        for (let k = 0; k < points.length; k++) {
          const point = points[k]
          const lat = point.getAttribute("lat")
          const lon = point.getAttribute("lon")

          const rowData = [lat, lon]

          // Add elevation if requested
          if (includeElevation) {
            const ele = point.getElementsByTagName("ele")[0]?.textContent || ""
            rowData.push(ele)
          }

          // Add time if requested
          if (timeFormat !== "none") {
            const timeElement = point.getElementsByTagName("time")[0]
            let timeValue = ""

            if (timeElement && timeElement.textContent) {
              timeValue = formatTime(timeElement.textContent, timeFormat)
            }

            rowData.push(timeValue)
          }

          // Calculate and add speed if requested
          if (includeSpeed && k > 0) {
            const prevPoint = points[k - 1]
            const speed = calculateSpeed(prevPoint, point)
            rowData.push(speed !== null ? speed.toString() : "")
          } else if (includeSpeed) {
            rowData.push("") // First point has no speed
          }

          rows.push(rowData.join(delimiterChar))
        }
      }
    }

    // Process routes if no tracks were found
    if (rows.length === (includeHeaders ? 1 : 0)) {
      const routes = gpxDoc.getElementsByTagName("rte")
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        const routePoints = route.getElementsByTagName("rtept")

        // Process each point
        for (let k = 0; k < routePoints.length; k++) {
          const point = routePoints[k]
          const lat = point.getAttribute("lat")
          const lon = point.getAttribute("lon")

          const rowData = [lat, lon]

          // Add elevation if requested
          if (includeElevation) {
            const ele = point.getElementsByTagName("ele")[0]?.textContent || ""
            rowData.push(ele)
          }

          // Add time if requested
          if (timeFormat !== "none") {
            const timeElement = point.getElementsByTagName("time")[0]
            let timeValue = ""

            if (timeElement && timeElement.textContent) {
              timeValue = formatTime(timeElement.textContent, timeFormat)
            }

            rowData.push(timeValue)
          }

          // Calculate and add speed if requested
          if (includeSpeed && k > 0) {
            const prevPoint = routePoints[k - 1]
            const speed = calculateSpeed(prevPoint, point)
            rowData.push(speed !== null ? speed.toString() : "")
          } else if (includeSpeed) {
            rowData.push("") // First point has no speed
          }

          rows.push(rowData.join(delimiterChar))
        }
      }
    }

    // Process waypoints if no tracks or routes were found
    if (rows.length === (includeHeaders ? 1 : 0)) {
      const waypoints = gpxDoc.getElementsByTagName("wpt")
      for (let i = 0; i < waypoints.length; i++) {
        const point = waypoints[i]
        const lat = point.getAttribute("lat")
        const lon = point.getAttribute("lon")

        const rowData = [lat, lon]

        // Add elevation if requested
        if (includeElevation) {
          const ele = point.getElementsByTagName("ele")[0]?.textContent || ""
          rowData.push(ele)
        }

        // Add time if requested
        if (timeFormat !== "none") {
          const timeElement = point.getElementsByTagName("time")[0]
          let timeValue = ""

          if (timeElement && timeElement.textContent) {
            timeValue = formatTime(timeElement.textContent, timeFormat)
          }

          rowData.push(timeValue)
        }

        // Waypoints don't have speed
        if (includeSpeed) {
          rowData.push("")
        }

        rows.push(rowData.join(delimiterChar))
      }
    }

    return rows.join("\n")
  } catch (error) {
    console.error("Error converting GPX to CSV:", error)
    throw error
  }
}

// Helper function to get the actual delimiter character
function getDelimiterChar(delimiter: string): string {
  switch (delimiter) {
    case "comma":
      return ","
    case "semicolon":
      return ";"
    case "tab":
      return "\t"
    case "pipe":
      return "|"
    default:
      return ","
  }
}

// Helper function to format time based on the selected format
function formatTime(isoTime: string, format: string): string {
  try {
    const date = new Date(isoTime)

    switch (format) {
      case "iso":
        return date.toISOString()
      case "local":
        return date.toLocaleString()
      case "unix":
        return Math.floor(date.getTime() / 1000).toString()
      default:
        return isoTime
    }
  } catch (error) {
    return isoTime // Return original if parsing fails
  }
}

// Helper function to calculate speed between two points
function calculateSpeed(prevPoint: Element, currentPoint: Element): number | null {
  try {
    const prevTimeElement = prevPoint.getElementsByTagName("time")[0]
    const currentTimeElement = currentPoint.getElementsByTagName("time")[0]

    if (!prevTimeElement?.textContent || !currentTimeElement?.textContent) {
      return null
    }

    const prevTime = new Date(prevTimeElement.textContent).getTime()
    const currentTime = new Date(currentTimeElement.textContent).getTime()

    const timeDiff = (currentTime - prevTime) / 1000 // Time difference in seconds

    if (timeDiff <= 0) {
      return null
    }

    const prevLat = Number.parseFloat(prevPoint.getAttribute("lat") || "0")
    const prevLon = Number.parseFloat(prevPoint.getAttribute("lon") || "0")
    const currentLat = Number.parseFloat(currentPoint.getAttribute("lat") || "0")
    const currentLon = Number.parseFloat(currentPoint.getAttribute("lon") || "0")

    // Calculate distance using Haversine formula
    const distance = calculateDistance(prevLat, prevLon, currentLat, currentLon)

    // Calculate speed in m/s
    const speed = distance / timeDiff

    // Convert to km/h
    return Math.round(speed * 3.6 * 100) / 100
  } catch (error) {
    return null
  }
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}
