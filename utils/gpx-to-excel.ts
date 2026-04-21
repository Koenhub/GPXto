import { DOMParser } from "@xmldom/xmldom"
import * as XLSX from "xlsx"

interface ConversionOptions {
  includeHeaders?: boolean
  timeFormat?: string
  splitSheets?: boolean
  includeElevation?: boolean
  includeSpeed?: boolean
}

export function convertGpxToExcel(gpxContent: string, options: ConversionOptions = {}): XLSX.WorkBook {
  // Default options
  const {
    includeHeaders = true,
    timeFormat = "iso",
    splitSheets = false,
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

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Process tracks
    const tracks = gpxDoc.getElementsByTagName("trk")
    let trackIndex = 0

    // If no tracks are found, check for routes and waypoints
    if (tracks.length === 0) {
      const routes = gpxDoc.getElementsByTagName("rte")
      const waypoints = gpxDoc.getElementsByTagName("wpt")

      if (routes.length > 0) {
        processRoutes(routes, workbook, options)
      } else if (waypoints.length > 0) {
        processWaypoints(waypoints, workbook, options)
      } else {
        throw new Error("No tracks, routes, or waypoints found in the GPX file")
      }

      return workbook
    }

    // Process each track
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      const trackName = track.getElementsByTagName("name")[0]?.textContent || `Track ${i + 1}`
      const trackSegments = track.getElementsByTagName("trkseg")

      // If splitting by sheets, create a sheet for each track
      if (splitSheets) {
        const sheetData: any[][] = []

        // Add headers if requested
        if (includeHeaders) {
          const headers = ["Latitude", "Longitude"]
          if (includeElevation) headers.push("Elevation")
          if (timeFormat !== "none") headers.push("Time")
          if (includeSpeed) headers.push("Speed (km/h)")
          sheetData.push(headers)
        }

        // Process each segment in the track
        for (let j = 0; j < trackSegments.length; j++) {
          const points = trackSegments[j].getElementsByTagName("trkpt")
          processPoints(points, sheetData, options)
        }

        // Create a worksheet from the data
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

        // Add the worksheet to the workbook
        const safeSheetName = sanitizeSheetName(trackName)
        XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName)
      } else {
        // If not splitting, add all points to a single sheet
        if (trackIndex === 0) {
          const sheetData: any[][] = []

          // Add headers if requested
          if (includeHeaders) {
            const headers = ["Track", "Latitude", "Longitude"]
            if (includeElevation) headers.push("Elevation")
            if (timeFormat !== "none") headers.push("Time")
            if (includeSpeed) headers.push("Speed (km/h)")
            sheetData.push(headers)
          }

          // Process each segment in the track
          for (let j = 0; j < trackSegments.length; j++) {
            const points = trackSegments[j].getElementsByTagName("trkpt")
            processPointsWithTrackName(points, sheetData, trackName, options)
          }

          // Create a worksheet from the data
          const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, "GPX Data")
        } else {
          // Get the existing worksheet
          const worksheet = workbook.Sheets["GPX Data"]
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

          // Process each segment in the track
          for (let j = 0; j < trackSegments.length; j++) {
            const points = trackSegments[j].getElementsByTagName("trkpt")
            processPointsWithTrackName(points, sheetData, trackName, options)
          }

          // Update the worksheet
          const updatedWorksheet = XLSX.utils.aoa_to_sheet(sheetData)
          workbook.Sheets["GPX Data"] = updatedWorksheet
        }
      }

      trackIndex++
    }

    return workbook
  } catch (error) {
    console.error("Error converting GPX to Excel:", error)
    throw error
  }
}

// Helper function to process points for a track
function processPoints(points: NodeListOf<Element>, sheetData: any[][], options: ConversionOptions) {
  const { includeElevation = true, timeFormat = "iso", includeSpeed = false } = options

  for (let k = 0; k < points.length; k++) {
    const point = points[k]
    const lat = Number.parseFloat(point.getAttribute("lat") || "0")
    const lon = Number.parseFloat(point.getAttribute("lon") || "0")

    const rowData: any[] = [lat, lon]

    // Add elevation if requested
    if (includeElevation) {
      const ele = point.getElementsByTagName("ele")[0]?.textContent
      rowData.push(ele ? Number.parseFloat(ele) : null)
    }

    // Add time if requested
    if (timeFormat !== "none") {
      const timeElement = point.getElementsByTagName("time")[0]
      let timeValue = null

      if (timeElement && timeElement.textContent) {
        timeValue = formatTime(timeElement.textContent, timeFormat)
      }

      rowData.push(timeValue)
    }

    // Calculate and add speed if requested
    if (includeSpeed && k > 0) {
      const prevPoint = points[k - 1]
      const speed = calculateSpeed(prevPoint, point)
      rowData.push(speed !== null ? speed : null)
    } else if (includeSpeed) {
      rowData.push(null) // First point has no speed
    }

    sheetData.push(rowData)
  }
}

// Helper function to process points with track name
function processPointsWithTrackName(
  points: NodeListOf<Element>,
  sheetData: any[][],
  trackName: string,
  options: ConversionOptions,
) {
  const { includeElevation = true, timeFormat = "iso", includeSpeed = false } = options

  for (let k = 0; k < points.length; k++) {
    const point = points[k]
    const lat = Number.parseFloat(point.getAttribute("lat") || "0")
    const lon = Number.parseFloat(point.getAttribute("lon") || "0")

    const rowData: any[] = [trackName, lat, lon]

    // Add elevation if requested
    if (includeElevation) {
      const ele = point.getElementsByTagName("ele")[0]?.textContent
      rowData.push(ele ? Number.parseFloat(ele) : null)
    }

    // Add time if requested
    if (timeFormat !== "none") {
      const timeElement = point.getElementsByTagName("time")[0]
      let timeValue = null

      if (timeElement && timeElement.textContent) {
        timeValue = formatTime(timeElement.textContent, timeFormat)
      }

      rowData.push(timeValue)
    }

    // Calculate and add speed if requested
    if (includeSpeed && k > 0) {
      const prevPoint = points[k - 1]
      const speed = calculateSpeed(prevPoint, point)
      rowData.push(speed !== null ? speed : null)
    } else if (includeSpeed) {
      rowData.push(null) // First point has no speed
    }

    sheetData.push(rowData)
  }
}

// Helper function to process routes
function processRoutes(routes: NodeListOf<Element>, workbook: XLSX.WorkBook, options: ConversionOptions) {
  const {
    includeHeaders = true,
    includeElevation = true,
    timeFormat = "iso",
    includeSpeed = false,
    splitSheets = false,
  } = options

  if (splitSheets) {
    // Create a sheet for each route
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const routeName = route.getElementsByTagName("name")[0]?.textContent || `Route ${i + 1}`
      const points = route.getElementsByTagName("rtept")

      const sheetData: any[][] = []

      // Add headers if requested
      if (includeHeaders) {
        const headers = ["Latitude", "Longitude"]
        if (includeElevation) headers.push("Elevation")
        if (timeFormat !== "none") headers.push("Time")
        if (includeSpeed) headers.push("Speed (km/h)")
        sheetData.push(headers)
      }

      // Process points
      processPoints(points, sheetData, options)

      // Create a worksheet from the data
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

      // Add the worksheet to the workbook
      const safeSheetName = sanitizeSheetName(routeName)
      XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName)
    }
  } else {
    // Create a single sheet for all routes
    const sheetData: any[][] = []

    // Add headers if requested
    if (includeHeaders) {
      const headers = ["Route", "Latitude", "Longitude"]
      if (includeElevation) headers.push("Elevation")
      if (timeFormat !== "none") headers.push("Time")
      if (includeSpeed) headers.push("Speed (km/h)")
      sheetData.push(headers)
    }

    // Process each route
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const routeName = route.getElementsByTagName("name")[0]?.textContent || `Route ${i + 1}`
      const points = route.getElementsByTagName("rtept")

      // Process points with route name
      processPointsWithTrackName(points, sheetData, routeName, options)
    }

    // Create a worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Routes")
  }
}

// Helper function to process waypoints
function processWaypoints(waypoints: NodeListOf<Element>, workbook: XLSX.WorkBook, options: ConversionOptions) {
  const { includeHeaders = true, includeElevation = true, timeFormat = "iso" } = options

  const sheetData: any[][] = []

  // Add headers if requested
  if (includeHeaders) {
    const headers = ["Name", "Latitude", "Longitude"]
    if (includeElevation) headers.push("Elevation")
    if (timeFormat !== "none") headers.push("Time")
    sheetData.push(headers)
  }

  // Process each waypoint
  for (let i = 0; i < waypoints.length; i++) {
    const waypoint = waypoints[i]
    const waypointName = waypoint.getElementsByTagName("name")[0]?.textContent || `Waypoint ${i + 1}`
    const lat = Number.parseFloat(waypoint.getAttribute("lat") || "0")
    const lon = Number.parseFloat(waypoint.getAttribute("lon") || "0")

    const rowData: any[] = [waypointName, lat, lon]

    // Add elevation if requested
    if (includeElevation) {
      const ele = waypoint.getElementsByTagName("ele")[0]?.textContent
      rowData.push(ele ? Number.parseFloat(ele) : null)
    }

    // Add time if requested
    if (timeFormat !== "none") {
      const timeElement = waypoint.getElementsByTagName("time")[0]
      let timeValue = null

      if (timeElement && timeElement.textContent) {
        timeValue = formatTime(timeElement.textContent, timeFormat)
      }

      rowData.push(timeValue)
    }

    sheetData.push(rowData)
  }

  // Create a worksheet from the data
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Waypoints")
}

// Helper function to format time based on the selected format
function formatTime(isoTime: string, format: string): string | Date | number | null {
  try {
    const date = new Date(isoTime)

    switch (format) {
      case "iso":
        return date.toISOString()
      case "local":
        return date // Excel will format this as a date
      case "unix":
        return Math.floor(date.getTime() / 1000)
      default:
        return date
    }
  } catch (error) {
    return null // Return null if parsing fails
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

// Helper function to sanitize sheet names (Excel has a 31 character limit and restrictions on characters)
function sanitizeSheetName(name: string): string {
  // Replace invalid characters
  let safeName = name.replace(/[\\/*?[\]]/g, "_")

  // Truncate to 31 characters
  if (safeName.length > 31) {
    safeName = safeName.substring(0, 31)
  }

  return safeName
}
