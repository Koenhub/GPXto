"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPreview } from "./map-preview"
import { trackEvent, ANALYTICS_EVENTS } from "@/utils/analytics"

export function GpxToGoogleMapsTool() {
  const [file, setFile] = useState<File | null>(null)
  const [gpxContent, setGpxContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [conversionOptions, setConversionOptions] = useState<Record<string, any>>({
    includeTracks: true,
    includeRoutes: true,
    includeWaypoints: true,
    travelMode: "walking",
  })
  const [hasDonated, setHasDonated] = useState(false)
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null)
  const [shortLink, setShortLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [originalPoints, setOriginalPoints] = useState<Array<{ lat: string | null; lon: string | null }>>([])
  const [sampledPoints, setSampledPoints] = useState<Array<{ lat: string | null; lon: string | null }>>([])
  const [pointReductionFactor, setPointReductionFactor] = useState<number>(1)
  const [fitsInSingleLink, setFitsInSingleLink] = useState<boolean>(true)

  // Reset link copied status after some time
  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => setLinkCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [linkCopied])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    if (!selectedFile) {
      return
    }
    if (!selectedFile.name.toLowerCase().endsWith(".gpx")) {
      setError("Please upload a GPX file")
      return
    }
    setFile(selectedFile)
    // Read the file content for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setGpxContent(content)
        // Extract points from GPX
        const parser = new DOMParser()
        const gpx = parser.parseFromString(content, "text/xml")

        // Extract track points
        const trackPoints = Array.from(gpx.querySelectorAll("trkpt"))
        if (trackPoints.length > 0) {
          const points = trackPoints.map((trkpt) => {
            const lat = trkpt.getAttribute("lat")
            const lon = trkpt.getAttribute("lon")
            return { lat, lon }
          })
          setOriginalPoints(points)
          // Initially set sampled points to all points
          setSampledPoints(points)
          // Check if it fits in a single link
          checkIfFitsInSingleLink(points)
        } else {
          // Try waypoints if no track points
          const waypoints = Array.from(gpx.querySelectorAll("wpt"))
          if (waypoints.length > 0) {
            const points = waypoints.map((wpt) => {
              const lat = wpt.getAttribute("lat")
              const lon = wpt.getAttribute("lon")
              return { lat, lon }
            })
            setOriginalPoints(points)
            setSampledPoints(points)
            checkIfFitsInSingleLink(points)
          } else {
            // Try route points if no track points or waypoints
            const routePoints = Array.from(gpx.querySelectorAll("rtept"))
            if (routePoints.length > 0) {
              const points = routePoints.map((rtept) => {
                const lat = rtept.getAttribute("lat")
                const lon = rtept.getAttribute("lon")
                return { lat, lon }
              })
              setOriginalPoints(points)
              setSampledPoints(points)
              checkIfFitsInSingleLink(points)
            } else {
              setError("No track points, route points, or waypoints found in the GPX file.")
            }
          }
        }
      } catch (err) {
        setError("Failed to read the GPX file. Please try another file.")
        setFile(null)
        setGpxContent(null)
        setOriginalPoints([])
        setSampledPoints([])
      }
    }
    reader.onerror = () => {
      setError("Failed to read the GPX file. Please try another file.")
      setFile(null)
      setGpxContent(null)
      setOriginalPoints([])
      setSampledPoints([])
    }
    reader.readAsText(selectedFile)
  }

  const checkIfFitsInSingleLink = (points: Array<{ lat: string | null; lon: string | null }>) => {
    // Google Maps URL has a limit of approximately 2000 characters
    // Each coordinate pair takes roughly 20 characters
    // We need to account for the base URL and other parameters
    const MAX_POINTS_FOR_LINK = 100
    setFitsInSingleLink(points.length <= MAX_POINTS_FOR_LINK)
  }

  // Vervang de bestaande samplePoints functie met deze verbeterde versie die het Douglas-Peucker algoritme gebruikt

  const samplePoints = (factor: number) => {
    if (originalPoints.length === 0) return
    if (factor === 1) {
      // No reduction, use all points
      setSampledPoints(originalPoints)
      checkIfFitsInSingleLink(originalPoints)
      return
    }

    // Calculate target number of points based on reduction factor
    const targetCount = Math.max(2, Math.floor(originalPoints.length / factor))

    // Use Douglas-Peucker algorithm to simplify the route
    // This algorithm keeps the most significant points that define the shape of the route
    const simplified = douglasPeuckerSimplify(originalPoints, targetCount)

    setSampledPoints(simplified)
    checkIfFitsInSingleLink(simplified)

    // Update GPX content with sampled points
    updateGpxContent(simplified)
  }

  // Add these helper functions for the Douglas-Peucker algorithm
  const douglasPeuckerSimplify = (points: Array<{ lat: string | null; lon: string | null }>, targetCount: number) => {
    // If we have very few points, just return them all
    if (points.length <= targetCount) return points

    // Convert string coordinates to numbers for calculations
    const numericPoints = points
      .map((p) => ({
        lat: p.lat ? Number.parseFloat(p.lat) : 0,
        lon: p.lon ? Number.parseFloat(p.lon) : 0,
        original: p, // Keep reference to original point
      }))
      .filter((p) => !isNaN(p.lat) && !isNaN(p.lon))

    // Calculate the importance of each point
    const importances = calculatePointImportances(numericPoints)

    // Sort points by importance (descending)
    const indexedImportances = importances.map((imp, idx) => ({ imp, idx }))
    indexedImportances.sort((a, b) => b.imp - a.imp)

    // Always include first and last points
    const keepIndices = new Set([0, points.length - 1])

    // Add the most important points until we reach the target count
    for (let i = 0; i < indexedImportances.length && keepIndices.size < targetCount; i++) {
      keepIndices.add(indexedImportances[i].idx)
    }

    // Create the simplified array, maintaining the original order
    const simplified = []
    for (let i = 0; i < points.length; i++) {
      if (keepIndices.has(i)) {
        simplified.push(points[i])
      }
    }

    return simplified
  }

  const calculatePointImportances = (
    points: Array<{ lat: number; lon: number; original: { lat: string | null; lon: string | null } }>,
  ) => {
    if (points.length <= 2) return points.map(() => 0)

    const importances = new Array(points.length).fill(0)

    // First and last points are always included
    importances[0] = Number.POSITIVE_INFINITY
    importances[points.length - 1] = Number.POSITIVE_INFINITY

    // Calculate perpendicular distance from each point to the line formed by its neighbors
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]

      // Calculate distance from current point to line formed by prev and next
      importances[i] = perpendicularDistance(curr, prev, next)
    }

    return importances
  }

  const perpendicularDistance = (
    point: { lat: number; lon: number },
    lineStart: { lat: number; lon: number },
    lineEnd: { lat: number; lon: number },
  ) => {
    // Convert to radians for geographical calculations
    const p = [(point.lon * Math.PI) / 180, (point.lat * Math.PI) / 180]
    const a = [(lineStart.lon * Math.PI) / 180, (lineStart.lat * Math.PI) / 180]
    const b = [(lineEnd.lon * Math.PI) / 180, (lineEnd.lat * Math.PI) / 180]

    // If start and end points are the same, return distance to that point
    if (a[0] === b[0] && a[1] === b[1]) {
      return haversineDistance(point.lat, point.lon, lineStart.lat, lineStart.lon)
    }

    // Calculate perpendicular distance using vector math
    // This is an approximation for geographical coordinates
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]

    // Normalize the line vector
    const mag = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / mag
    const ny = dy / mag

    // Calculate the projection of point onto the line
    const vx = p[0] - a[0]
    const vy = p[1] - a[1]
    const proj = vx * nx + vy * ny

    // Calculate the closest point on the line
    let closestX, closestY

    if (proj <= 0) {
      // Closest point is the start point
      closestX = a[0]
      closestY = a[1]
    } else if (proj >= mag) {
      // Closest point is the end point
      closestX = b[0]
      closestY = a[1] + mag * ny
    } else {
      // Closest point is on the line
      closestX = a[0] + proj * nx
      closestY = a[1] + proj * ny
    }

    // Convert back to degrees
    const closestLon = (closestX * 180) / Math.PI
    const closestLat = (closestY * 180) / Math.PI

    // Return the haversine distance
    return haversineDistance(point.lat, point.lon, closestLat, closestLon)
  }

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const updateGpxContent = (points: Array<{ lat: string | null; lon: string | null }>) => {
    if (!gpxContent) return
    try {
      const parser = new DOMParser()
      const gpx = parser.parseFromString(gpxContent, "text/xml")

      // Find the first track segment
      let trackSegment = gpx.querySelector("trkseg")

      // If no track segment exists, try to find a route
      if (!trackSegment) {
        const route = gpx.querySelector("rte")
        if (route) {
          // We're dealing with a route, so we need to update route points
          // Remove all existing route points
          const routePoints = route.querySelectorAll("rtept")
          routePoints.forEach((point) => route.removeChild(point))

          // Add sampled points as route points
          points.forEach((point) => {
            if (point.lat && point.lon) {
              const rtept = gpx.createElement("rtept")
              rtept.setAttribute("lat", point.lat)
              rtept.setAttribute("lon", point.lon)
              route.appendChild(rtept)
            }
          })

          // Convert back to string
          const serializer = new XMLSerializer()
          const updatedGpxContent = serializer.serializeToString(gpx)
          setGpxContent(updatedGpxContent)
          return
        }

        // If no track segment or route exists, we might be dealing with waypoints
        // In that case, we'll create a new track with the sampled points
        const gpxRoot = gpx.querySelector("gpx")
        if (gpxRoot) {
          const newTrack = gpx.createElement("trk")
          const newName = gpx.createElement("name")
          newName.textContent = "Generated Track"
          newTrack.appendChild(newName)

          trackSegment = gpx.createElement("trkseg")
          newTrack.appendChild(trackSegment)
          gpxRoot.appendChild(newTrack)
        } else {
          console.error("No GPX root element found")
          return
        }
      }

      // Remove all existing track points
      while (trackSegment.firstChild) {
        trackSegment.removeChild(trackSegment.firstChild)
      }

      // Add sampled points
      points.forEach((point) => {
        if (point.lat && point.lon) {
          const trkpt = gpx.createElement("trkpt")
          trkpt.setAttribute("lat", point.lat)
          trkpt.setAttribute("lon", point.lon)
          trackSegment.appendChild(trkpt)
        }
      })

      // Convert back to string
      const serializer = new XMLSerializer()
      const updatedGpxContent = serializer.serializeToString(gpx)
      setGpxContent(updatedGpxContent)
    } catch (err) {
      console.error("Error updating GPX content:", err)
    }
  }

  const handlePointReductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setPointReductionFactor(value)
    samplePoints(value)
  }

  const handleOptionChange = (key: string, value: any) => {
    setConversionOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!file && !gpxContent) {
        setError("Please upload a GPX file")
        return
      }
      setError(null)
      setCurrentStep(2)
      // Track when user reaches step 2 (Configure)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 2,
        tool: "gpx_to_google_maps",
        file_size: file?.size || 0,
      })
    } else if (currentStep === 2) {
      handleConvert()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  // Vervang de bestaande handleConvert functie met deze verbeterde versie
  const handleConvert = async () => {
    setIsConverting(true)
    setError(null)
    setGoogleMapsLink(null)
    setShortLink(null)
    setCurrentStep(3)
    // Track when conversion starts
    trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
      step: 3,
      tool: "gpx_to_google_maps",
      file_size: file?.size || 0,
      conversion_options: JSON.stringify(conversionOptions),
    })

    try {
      // Simulate conversion process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter coordinates based on user options
      if (!gpxContent) {
        setError("No GPX content found.")
        setIsConverting(false)
        setCurrentStep(2)
        return
      }

      const parser = new DOMParser()
      const gpx = parser.parseFromString(gpxContent, "text/xml")
      let pointsToInclude = []

      // Add track points if option is selected
      if (conversionOptions.includeTracks) {
        const trackPoints = Array.from(gpx.querySelectorAll("trkpt"))
        const trackCoordinates = trackPoints.map((trkpt) => {
          const lat = trkpt.getAttribute("lat")
          const lon = trkpt.getAttribute("lon")
          return { lat, lon }
        })
        pointsToInclude = [...pointsToInclude, ...trackCoordinates]
      }

      // Add route points if option is selected
      if (conversionOptions.includeRoutes) {
        const routePoints = Array.from(gpx.querySelectorAll("rtept"))
        const routeCoordinates = routePoints.map((rtept) => {
          const lat = rtept.getAttribute("lat")
          const lon = rtept.getAttribute("lon")
          return { lat, lon }
        })
        pointsToInclude = [...pointsToInclude, ...routeCoordinates]
      }

      // Add waypoints if option is selected
      if (conversionOptions.includeWaypoints) {
        const waypoints = Array.from(gpx.querySelectorAll("wpt"))
        const waypointCoordinates = waypoints.map((wpt) => {
          const lat = wpt.getAttribute("lat")
          const lon = wpt.getAttribute("lon")
          return { lat, lon }
        })
        pointsToInclude = [...pointsToInclude, ...waypointCoordinates]
      }

      // Apply route simplification based on pointReductionFactor
      let finalCoordinates = pointsToInclude
      if (pointReductionFactor > 1 && pointsToInclude.length > 0) {
        // Use Douglas-Peucker algorithm to simplify
        finalCoordinates = douglasPeuckerSimplify(
          pointsToInclude,
          Math.ceil(pointsToInclude.length / pointReductionFactor),
        )
      }

      if (finalCoordinates.length === 0 || !finalCoordinates[0].lat || !finalCoordinates[0].lon) {
        setError("No valid coordinates found in the GPX file based on your settings.")
        setIsConverting(false)
        setCurrentStep(2)
        return
      }

      // For Google Maps, we need to limit the number of points (URL length limitations)
      const MAX_POINTS = 100
      let sampledCoordinates = finalCoordinates
      if (finalCoordinates.length > MAX_POINTS) {
        const step = Math.ceil(finalCoordinates.length / MAX_POINTS)
        sampledCoordinates = []
        // Always include the first point
        sampledCoordinates.push(finalCoordinates[0])
        // Sample intermediate points
        for (let i = step; i < finalCoordinates.length - 1; i += step) {
          sampledCoordinates.push(finalCoordinates[i])
        }
        // Always include the last point if finalCoordinates.length have more than one point
        if (finalCoordinates.length > 1) {
          sampledCoordinates.push(finalCoordinates[finalCoordinates.length - 1])
        }
      }

      // Create a Google Maps URL that displays the entire route using the user's selected travel mode
      const travelMode = conversionOptions.travelMode || "walking"

      // For better visualization, we'll use the first point as origin and last point as destination
      const origin = `${sampledCoordinates[0].lat},${sampledCoordinates[0].lon}`

      // If we only have one point, use it as both origin and destination
      const destination =
        sampledCoordinates.length > 1
          ? `${sampledCoordinates[sampledCoordinates.length - 1].lat},${sampledCoordinates[sampledCoordinates.length - 1].lon}`
          : origin

      // Waypoints are the points in between (skip first and last)
      const waypointCoordinates = sampledCoordinates.slice(1, -1)
      const waypoints =
        waypointCoordinates.length > 0
          ? waypointCoordinates
              .map((coord) => (coord.lat && coord.lon ? `${coord.lat},${coord.lon}` : null))
              .filter(Boolean)
              .join("|")
          : ""

      // Build the URL
      const fullLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=${travelMode}`

      setGoogleMapsLink(fullLink)

      // Create a short link (in reality, this would use a URL shortener service)
      const mockShortLink = `https://goo.gl/maps/${Math.random().toString(36).substring(2, 8)}`
      setShortLink(mockShortLink)
      setIsConverting(false)
      setCurrentStep(4) // Move to Share step after conversion is complete

      // Track when user reaches step 4 (Share)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 4,
        tool: "gpx_to_google_maps",
        file_size: file?.size || 0,
        success: true,
      })

      // Track when conversion completes successfully
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_to_google_maps",
        success: true,
        file_size: file?.size || 0,
      })
    } catch (err) {
      setIsConverting(false)
      setError("Conversion failed. Please check your file and try again.")
      setCurrentStep(2)
      // Track when conversion fails
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_to_google_maps",
        success: false,
        error: "Conversion failed",
        file_size: file?.size || 0,
      })
    }
  }

  const handleCopyLink = (link: string) => {
    if (!link) return

    navigator.clipboard
      .writeText(link)
      .then(() => {
        setLinkCopied(true)
        // Track link copy event
        trackEvent("link_copied", {
          tool: "gpx_to_google_maps",
          link_type: link === googleMapsLink ? "full" : "short",
        })
      })
      .catch((err) => {
        console.error("Failed to copy link:", err)
        setError("Failed to copy link. Please try again or copy it manually.")
      })
  }

  const handleDonate = (amount: string) => {
    // Track the donation
    trackEvent("donation_clicked", {
      tool: "gpx_to_google_maps",
      donation_amount: amount,
      file_size: file?.size || 0,
    })
    setHasDonated(true)
  }

  const handleReset = () => {
    setFile(null)
    setGpxContent(null)
    setError(null)
    setHasDonated(false)
    setCurrentStep(1)
    setConversionOptions({
      includeTracks: true,
      includeRoutes: true,
      includeWaypoints: true,
      travelMode: "walking",
    })
    setGoogleMapsLink(null)
    setShortLink(null)
    setOriginalPoints([])
    setSampledPoints([])
    setPointReductionFactor(1)
    setFitsInSingleLink(true)
  }

  const handleDownload = () => {
    // Track the download event
    trackEvent("download_without_donation", {
      tool: "gpx_to_google_maps",
      file_size: file?.size || 0,
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Step indicator */}
      <div className="flex justify-start border-b pb-2 sm:pb-4">
        {[
          { id: 1, name: "Upload" },
          { id: 2, name: "Configure" },
          { id: 3, name: "Convert" },
          { id: 4, name: "Share" },
        ].map((step) => (
          <div key={step.id} className="mr-3 sm:mr-6 text-center">
            <button
              onClick={() => {
                // Allow navigation based on current step
                if (currentStep === 2) {
                  // From Configure, allow going to Upload or Convert
                  if (step.id === 1 || step.id === 3) {
                    if (step.id === 1) {
                      handlePreviousStep()
                    } else if (step.id === 3) {
                      handleConvert()
                    }
                  }
                } else if (currentStep === 4) {
                  // From Share, allow going to Configure
                  if (step.id === 2) {
                    setCurrentStep(2)
                  }
                } else if (currentStep === 1) {
                  // From Upload, allow going to Configure if we have a file
                  if (step.id === 2 && (file || gpxContent)) {
                    handleNextStep()
                  }
                }
              }}
              disabled={
                // Disable if it's the current step
                step.id === currentStep ||
                // Disable based on current step and available navigation options
                (currentStep === 1 && step.id !== 2) ||
                (currentStep === 2 && step.id !== 1 && step.id !== 3) ||
                currentStep === 3 || // Convert is processing, disable all
                (currentStep === 4 && step.id !== 2) ||
                // Disable if trying to go to Configure without a file
                (step.id === 2 && currentStep === 1 && !file && !gpxContent)
              }
              className={`inline-block px-1 sm:px-2 py-1 text-xs sm:text-sm ${
                currentStep === step.id
                  ? "border-b-2 border-black font-medium"
                  : (
                        // Make specific steps clickable based on current step
                        (currentStep === 2 && (step.id === 1 || step.id === 3)) ||
                          (currentStep === 4 && step.id === 2) ||
                          (currentStep === 1 && step.id === 2 && (file || gpxContent))
                      )
                    ? "text-black hover:border-b-2 hover:border-gray-300 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {step.name}
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Step 1: Upload GPX file */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="gpx-file" className="block mb-2">
              Upload GPX file:
            </label>
            <input type="file" id="gpx-file" accept=".gpx" onChange={handleFileChange} className="w-full" />
            {file && (
              <p className="mt-2">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <div>
            <button
              onClick={handleNextStep}
              disabled={!file && !gpxContent}
              className="px-4 py-2 bg-black text-white disabled:bg-gray-400"
            >
              Next: Configure options
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure conversion options */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Configure Google Maps options</h3>
            {file && (
              <div className="text-sm text-gray-600">
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          {/* Travel Mode Options */}
          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Travel Mode</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="travel-mode-driving"
                  name="travel-mode"
                  value="driving"
                  checked={conversionOptions.travelMode === "driving"}
                  onChange={() => handleOptionChange("travelMode", "driving")}
                  className="mr-2"
                />
                <label htmlFor="travel-mode-driving" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11 2 11.3V16c0 .6.4 1 1 1h1" />
                    <path d="M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  </svg>
                  Car
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="travel-mode-bicycling"
                  name="travel-mode"
                  value="bicycling"
                  checked={conversionOptions.travelMode === "bicycling"}
                  onChange={() => handleOptionChange("travelMode", "bicycling")}
                  className="mr-2"
                />
                <label htmlFor="travel-mode-bicycling" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="6" cy="15" r="4" />
                    <circle cx="18" cy="15" r="4" />
                    <path d="M6 15 9 8l3 5" />
                    <path d="m12 13 3-4 3 4" />
                  </svg>
                  Bicycle
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="travel-mode-walking"
                  name="travel-mode"
                  value="walking"
                  checked={conversionOptions.travelMode === "walking"}
                  onChange={() => handleOptionChange("travelMode", "walking")}
                  className="mr-2"
                />
                <label htmlFor="travel-mode-walking" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m13 4 3 8 4-3" />
                    <path d="m13 4-4 6 2 9 6-5-3-4" />
                    <path d="M7 7 6.1 5.5" />
                    <path d="M5.5 14 7 7" />
                  </svg>
                  Walking
                </label>
              </div>
            </div>
          </div>

          {/* Content Options */}
          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Content options</h4>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.includeTracks}
                  onChange={(e) => handleOptionChange("includeTracks", e.target.checked)}
                  className="mr-2"
                />
                <span>Include tracks</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.includeRoutes}
                  onChange={(e) => handleOptionChange("includeRoutes", e.target.checked)}
                  className="mr-2"
                />
                <span>Include routes</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.includeWaypoints}
                  onChange={(e) => handleOptionChange("includeWaypoints", e.target.checked)}
                  className="mr-2"
                />
                <span>Include waypoints</span>
              </label>
            </div>
          </div>

          {/* Route Simplification */}
          <div className="p-4 border space-y-4 mt-4">
            <h4 className="font-medium">Route simplification</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Original: {originalPoints.length} points</span>
                <span>Current: {sampledPoints.length} points</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(2, Math.min(Math.ceil(originalPoints.length / 2), 50))}
                step="1"
                value={pointReductionFactor}
                onChange={handlePointReductionChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>All points</span>
                <span>Fewer points</span>
              </div>
              <div className="mt-3">
                {fitsInSingleLink ? (
                  <div className="flex items-center p-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Route fits in a single Google Maps link
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Route may be simplified for Google Maps (limited to 100 points)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex space-x-4">
            <button onClick={handlePreviousStep} className="px-4 py-2 border">
              Back
            </button>
            <button onClick={handleNextStep} className="px-4 py-2 bg-black text-white">
              Generate Google Maps Link
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Converting */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-4 border space-y-4">
            <p>Converting your GPX to Google Maps format...</p>
            <div className="w-full h-2 bg-gray-200">
              <div className="h-full bg-black animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600">Extracting route data and applying your settings...</p>
          </div>
        </div>
      )}

      {/* Step 4: Share */}
      {currentStep === 4 && googleMapsLink && (
        <div className="space-y-4">
          <div className="p-4 border">
            <h3 className="font-medium mb-4">Your Google Maps link is ready!</h3>
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-md">
              <p className="font-medium text-yellow-700 dark:text-yellow-300">Important: Check your route carefully</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                This tool cannot always determine if your GPX file was intended for car, bicycle, or pedestrian
                navigation. Google Maps may make unexpected routing choices based on the selected travel mode. Please
                carefully select the appropriate travel mode and verify the generated route before using it for
                navigation.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Link:</label>
                <div className="flex">
                  <input
                    type="text"
                    value={googleMapsLink}
                    readOnly
                    className="flex-1 p-2 border text-sm overflow-hidden text-ellipsis"
                  />
                  <button
                    onClick={() => handleCopyLink(googleMapsLink)}
                    className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300"
                  >
                    {linkCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              {shortLink && (
                <div>
                  <label className="block text-sm font-medium mb-2">Short Link:</label>
                  <div className="flex">
                    <input type="text" value={shortLink} readOnly className="flex-1 p-2 border" />
                    <button
                      onClick={() => handleCopyLink(shortLink)}
                      className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300"
                    >
                      {linkCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-black text-white"
                  onClick={() => {
                    trackEvent("link_opened", {
                      tool: "gpx_to_google_maps",
                    })
                  }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
            {!hasDonated && (
              <div className="space-y-3 mt-6 pt-4 border-t">
                <p className="text-sm">Support GPXto to keep our tools free:</p>
                <div>
                  <a
                    href="https://ko-fi.com/gpxto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("support")}
                  >
                    <button className="w-full px-4 py-2 bg-black text-white">Support us here</button>
                  </a>
                </div>
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:underline">
                Back to configuration
              </button>
              {" • "}
              <button onClick={handleReset} className="text-gray-600 hover:underline">
                Convert another file
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Preview */}
      {gpxContent && (
        <div className="mt-8">
          <h2>Map preview</h2>
          <div className="h-[250px] sm:h-[350px] border">
            <MapPreview gpxContent={gpxContent} />
          </div>
        </div>
      )}
    </div>
  )
}
