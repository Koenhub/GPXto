"use client"

import type React from "react"

import { useState } from "react"
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
    mapType: "roadmap",
  })
  const [hasDonated, setHasDonated] = useState(false)
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null)
  const [shortLink, setShortLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

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
      } catch (err) {
        setError("Failed to read the GPX file. Please try another file.")
        setFile(null)
        setGpxContent(null)
      }
    }
    reader.onerror = () => {
      setError("Failed to read the GPX file. Please try another file.")
      setFile(null)
      setGpxContent(null)
    }
    reader.readAsText(selectedFile)
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

      // Extract all coordinates from the GPX file
      let coordinates = []

      if (gpxContent) {
        try {
          const parser = new DOMParser()
          const gpx = parser.parseFromString(gpxContent, "text/xml")

          // Get all track points
          const trackpoints = gpx.querySelectorAll("trkpt")

          if (trackpoints.length > 0 && conversionOptions.includeTracks) {
            // Extract coordinates from track points
            coordinates = Array.from(trackpoints).map((point) => {
              const lat = point.getAttribute("lat")
              const lon = point.getAttribute("lon")
              return { lat, lon }
            })
          } else {
            // If no trackpoints or tracks not included, try route points
            const routepoints = gpx.querySelectorAll("rtept")

            if (routepoints.length > 0 && conversionOptions.includeRoutes) {
              coordinates = Array.from(routepoints).map((point) => {
                const lat = point.getAttribute("lat")
                const lon = point.getAttribute("lon")
                return { lat, lon }
              })
            } else if (conversionOptions.includeWaypoints) {
              // If no route points either, try waypoints
              const waypoints = gpx.querySelectorAll("wpt")

              coordinates = Array.from(waypoints).map((point) => {
                const lat = point.getAttribute("lat")
                const lon = point.getAttribute("lon")
                return { lat, lon }
              })
            }
          }
        } catch (e) {
          console.error("Error parsing GPX:", e)
          setError("Failed to parse GPX file. Please check the file format.")
          setIsConverting(false)
          setCurrentStep(2)
          return
        }
      }

      if (coordinates.length === 0) {
        setError("No valid coordinates found in the GPX file.")
        setIsConverting(false)
        setCurrentStep(2)
        return
      }

      // For Google Maps, we need to limit the number of points (URL length limitations)
      // Let's sample points if there are too many
      const MAX_POINTS = 100
      let sampledCoordinates = coordinates

      if (coordinates.length > MAX_POINTS) {
        const step = Math.floor(coordinates.length / MAX_POINTS)
        sampledCoordinates = coordinates.filter((_, index) => index % step === 0)

        // Always include the first and last point
        if (sampledCoordinates[sampledCoordinates.length - 1] !== coordinates[coordinates.length - 1]) {
          sampledCoordinates.push(coordinates[coordinates.length - 1])
        }
      }

      // Create a Google Maps URL that displays the entire route
      // We'll use the "data=!3m1!4b1!..." format which allows displaying custom paths

      // First, create the path parameter
      const path = sampledCoordinates.map((coord) => `${coord.lat},${coord.lon}`).join("|")

      // Set color based on user selection (remove # and convert to web format)
      // const color = conversionOptions.lineColor.replace("#", "0x") || "0xFF0000"

      // Set weight based on user selection
      // let weight = 5 // default medium
      // if (conversionOptions.lineWidth === "thin") weight = 3
      // if (conversionOptions.lineWidth === "thick") weight = 8

      // Create the full Google Maps URL
      // We're using the "https://www.google.com/maps/dir/" format with a custom path
      const mapType = conversionOptions.mapType || "roadmap"

      // Create a URL that shows a custom path on Google Maps
      // Format: https://www.google.com/maps/dir/?api=1&origin=lat,lng&destination=lat,lng&waypoints=lat,lng|lat,lng...

      // For better visualization, we'll use the first point as origin and last point as destination
      const origin = `${sampledCoordinates[0].lat},${sampledCoordinates[0].lon}`
      const destination = `${sampledCoordinates[sampledCoordinates.length - 1].lat},${sampledCoordinates[sampledCoordinates.length - 1].lon}`

      // Waypoints are the points in between (skip first and last)
      const waypoints = sampledCoordinates
        .slice(1, -1)
        .map((coord) => `${coord.lat},${coord.lon}`)
        .join("|")

      // Build the URL
      const fullLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=walking&map_type=${mapType}`

      setGoogleMapsLink(fullLink)

      // Create a mock short link (in reality, this would use a URL shortener service)
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
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)

      // Track link copy event
      trackEvent("link_copied", {
        tool: "gpx_to_google_maps",
        link_type: link === googleMapsLink ? "full" : "short",
      })
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
      mapType: "roadmap",
    })
    setGoogleMapsLink(null)
    setShortLink(null)
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
            <div
              className={`inline-block px-1 sm:px-2 py-1 text-xs sm:text-sm ${
                currentStep === step.id ? "border-b-2 border-black font-medium" : "text-gray-500"
              }`}
            >
              {step.name}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Step 1: Upload GPX file */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="gpx-file" className="block mb-2">
              Upload GPX File:
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
              Next: Configure Options
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure conversion options */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Configure Google Maps Options</h3>
            {file && (
              <div className="text-sm text-gray-600">
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Map Options</h4>

            <div>
              <label htmlFor="map-type" className="block mb-2">
                Map Type:
              </label>
              <select
                id="map-type"
                value={conversionOptions.mapType}
                onChange={(e) => handleOptionChange("mapType", e.target.value)}
                className="w-full p-2 border"
              >
                <option value="roadmap">Roadmap</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Content Options</h4>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.includeTracks}
                  onChange={(e) => handleOptionChange("includeTracks", e.target.checked)}
                  className="mr-2"
                />
                <span>Include Tracks</span>
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
                <span>Include Routes</span>
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
                <span>Include Waypoints</span>
              </label>
            </div>
          </div>

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
            <h3 className="font-medium mb-4">Your Google Maps Link is Ready!</h3>

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
                <div className="space-y-2">
                  <a
                    href="https://ko-fi.com/gpxto/2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("2")}
                  >
                    <button className="w-full px-4 py-2 bg-black text-white">Donate €2</button>
                  </a>
                  <a
                    href="https://ko-fi.com/gpxto/5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("5")}
                  >
                    <button className="w-full px-4 py-2 border">Donate €5</button>
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
          <h2>Map Preview</h2>
          <div className="h-[250px] sm:h-[350px] border">
            <MapPreview gpxContent={gpxContent} />
          </div>
        </div>
      )}
    </div>
  )
}
