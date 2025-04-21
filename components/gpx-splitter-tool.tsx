"use client"

import type React from "react"

import { useState } from "react"
import { MapPreview } from "./map-preview"
import { Route, Ruler, AlertCircle } from "lucide-react"
import { trackEvent, ANALYTICS_EVENTS } from "@/utils/analytics"

export function GpxSplitterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [gpxContent, setGpxContent] = useState<string | null>(null)
  const [splitMethod, setSplitMethod] = useState<string>("distance")
  const [splitOptions, setSplitOptions] = useState<Record<string, any>>({
    distance: {
      distanceValue: 5,
      distanceUnit: "km",
    },
    points: {
      pointsCount: 500,
    },
    stages: {
      stagesCount: 3,
    },
  })
  const [error, setError] = useState<string | null>(null)
  const [isSplitting, setIsSplitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [splitResults, setSplitResults] = useState<Array<{ name: string; content: string }>>([])
  const [hasDonated, setHasDonated] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

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

  const handleSplitMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSplitMethod(e.target.value)
  }

  const handleOptionChange = (category: string, key: string, value: any) => {
    setSplitOptions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!file || !gpxContent) {
        setError("Please upload a GPX file")
        return
      }
      setError(null)
      setCurrentStep(2)

      // Track when user reaches step 2 (Configure)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 2,
        tool: "gpx_splitter",
        file_size: file?.size || 0,
      })
    } else if (currentStep === 2) {
      handleSplit()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  // Update the handleSplit function to remove the code for the removed splitting methods
  const handleSplit = async () => {
    setIsSplitting(true)
    setError(null)
    setSplitResults([])
    setCurrentStep(3)

    // Track when splitting starts
    trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
      step: 3,
      tool: "gpx_splitter",
      split_method: splitMethod,
      file_size: file?.size || 0,
      split_options: JSON.stringify(splitOptions[splitMethod]),
    })

    try {
      if (!gpxContent) {
        throw new Error("No GPX content to split")
      }

      // Parse the GPX file
      const parser = new DOMParser()
      const gpx = parser.parseFromString(gpxContent, "text/xml")

      // Check if it's a valid GPX file
      if (!gpx.querySelector("gpx")) {
        throw new Error("Invalid GPX file")
      }

      // Get the file name without extension
      const fileName = file?.name.replace(/\.gpx$/i, "") || "track"

      // Split the GPX file based on the selected method
      let results: Array<{ name: string; content: string }> = []

      switch (splitMethod) {
        case "distance":
          results = splitByDistance(gpx, fileName, splitOptions.distance)
          break
        case "points":
          results = splitByPoints(gpx, fileName, splitOptions.points)
          break
        case "stages":
          results = splitByStages(gpx, fileName, splitOptions.stages)
          break
        default:
          throw new Error("Invalid split method")
      }

      if (results.length === 0) {
        throw new Error("No segments found to split")
      }

      setSplitResults(results)
      setPreviewIndex(0)
      setIsSplitting(false)
      setCurrentStep(4) // Move to Download step after splitting is complete

      // Track when user reaches step 4 (Download)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 4,
        tool: "gpx_splitter",
        split_method: splitMethod,
        file_size: file?.size || 0,
        result_count: results.length,
        success: true,
      })

      // Track when splitting completes successfully
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_splitter",
        success: true,
        split_method: splitMethod,
        file_size: file?.size || 0,
        result_count: results.length,
      })
    } catch (err) {
      console.error("Error splitting GPX:", err)
      setIsSplitting(false)
      setError(`Failed to split GPX file: ${err instanceof Error ? err.message : "Unknown error"}`)
      setCurrentStep(2)

      // Track when splitting fails
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_splitter",
        success: false,
        error: err instanceof Error ? err.message : "Failed to split GPX file",
        split_method: splitMethod,
        file_size: file?.size || 0,
      })
    }
  }

  const splitBySegments = (
    gpx: Document,
    fileName: string,
    options: { splitByTrack: boolean; splitByDay: boolean },
  ) => {
    const results: Array<{ name: string; content: string }> = []

    if (options.splitByTrack) {
      // Split by tracks
      const tracks = gpx.querySelectorAll("trk")

      tracks.forEach((track, index) => {
        const trackName = track.querySelector("name")?.textContent || `Track ${index + 1}`

        // Create a new GPX document for this track
        const newGpx = createEmptyGpx()
        const trackClone = track.cloneNode(true)
        newGpx.querySelector("gpx")?.appendChild(trackClone)

        // Add to results
        results.push({
          name: `${fileName}_${sanitizeFileName(trackName)}-gpx-split.gpx`,
          content: new XMLSerializer().serializeToString(newGpx),
        })
      })
    } else if (options.splitByDay) {
      // Split by day
      const tracks = gpx.querySelectorAll("trk")
      const tracksByDay = new Map<string, Element[]>()

      tracks.forEach((track) => {
        const points = track.querySelectorAll("trkpt")

        for (const point of points) {
          const timeElement = point.querySelector("time")
          if (timeElement && timeElement.textContent) {
            const date = new Date(timeElement.textContent)
            const dayKey = date.toISOString().split("T")[0]

            if (!tracksByDay.has(dayKey)) {
              tracksByDay.set(dayKey, [])
            }

            // Check if we already added this track to this day
            const tracksForDay = tracksByDay.get(dayKey)!
            if (!tracksForDay.includes(track)) {
              tracksForDay.push(track)
            }
          }
        }
      })

      // Create a GPX file for each day
      tracksByDay.forEach((tracksForDay, dayKey) => {
        const newGpx = createEmptyGpx()

        tracksForDay.forEach((track) => {
          const trackClone = track.cloneNode(true)
          newGpx.querySelector("gpx")?.appendChild(trackClone)
        })

        results.push({
          name: `${fileName}_${dayKey}-gpx-split.gpx`,
          content: new XMLSerializer().serializeToString(newGpx),
        })
      })
    } else {
      // If neither option is selected, just return the original file
      results.push({
        name: `${fileName}-gpx-split.gpx`,
        content: new XMLSerializer().serializeToString(gpx),
      })
    }

    return results
  }

  const splitByDistance = (
    gpx: Document,
    fileName: string,
    options: { distanceValue: number; distanceUnit: string },
  ) => {
    const results: Array<{ name: string; content: string }> = []

    // Convert distance to meters
    let distanceInMeters = options.distanceValue
    if (options.distanceUnit === "km") {
      distanceInMeters *= 1000
    } else if (options.distanceUnit === "mi") {
      distanceInMeters *= 1609.34
    }

    // Get all track points
    const tracks = gpx.querySelectorAll("trk")
    let segmentIndex = 0

    tracks.forEach((track, trackIndex) => {
      const trackName = track.querySelector("name")?.textContent || `Track ${trackIndex + 1}`
      const segments = track.querySelectorAll("trkseg")

      segments.forEach((segment) => {
        const points = Array.from(segment.querySelectorAll("trkpt"))

        if (points.length < 2) {
          // Not enough points to split
          return
        }

        let currentSegmentPoints: Element[] = []
        let totalDistance = 0
        let lastLat = Number.parseFloat(points[0].getAttribute("lat") || "0")
        let lastLon = Number.parseFloat(points[0].getAttribute("lon") || "0")

        // Add the first point to the current segment
        currentSegmentPoints.push(points[0])

        for (let i = 1; i < points.length; i++) {
          const point = points[i]
          const lat = Number.parseFloat(point.getAttribute("lat") || "0")
          const lon = Number.parseFloat(point.getAttribute("lon") || "0")

          // Calculate distance from last point
          const distance = calculateDistance(lastLat, lastLon, lat, lon)
          totalDistance += distance

          // Add point to current segment
          currentSegmentPoints.push(point)

          // If we've reached the target distance, create a new segment
          if (totalDistance >= distanceInMeters) {
            // Create a new GPX document for this segment
            const newGpx = createEmptyGpx()
            const newTrack = document.createElement("trk")
            const newName = document.createElement("name")
            newName.textContent = `${trackName} - Segment ${segmentIndex + 1}`
            newTrack.appendChild(newName)

            const newSegment = document.createElement("trkseg")
            currentSegmentPoints.forEach((point) => {
              newSegment.appendChild(point.cloneNode(true))
            })

            newTrack.appendChild(newSegment)
            newGpx.querySelector("gpx")?.appendChild(newTrack)

            // Add to results
            results.push({
              name: `${fileName}_segment_${segmentIndex + 1}-gpx-split.gpx`,
              content: new XMLSerializer().serializeToString(newGpx),
            })

            // Reset for next segment
            segmentIndex++
            totalDistance = 0
            currentSegmentPoints = [point] // Start new segment with current point
          }

          lastLat = lat
          lastLon = lon
        }

        // Add any remaining points as the last segment
        if (currentSegmentPoints.length > 1) {
          const newGpx = createEmptyGpx()
          const newTrack = document.createElement("trk")
          const newName = document.createElement("name")
          newName.textContent = `${trackName} - Segment ${segmentIndex + 1}`
          newTrack.appendChild(newName)

          const newSegment = document.createElement("trkseg")
          currentSegmentPoints.forEach((point) => {
            newSegment.appendChild(point.cloneNode(true))
          })

          newTrack.appendChild(newSegment)
          newGpx.querySelector("gpx")?.appendChild(newTrack)

          // Add to results
          results.push({
            name: `${fileName}_segment_${segmentIndex + 1}-gpx-split.gpx`,
            content: new XMLSerializer().serializeToString(newGpx),
          })

          segmentIndex++
        }
      })
    })

    return results
  }

  const splitByPoints = (gpx: Document, fileName: string, options: { pointsCount: number }) => {
    const results: Array<{ name: string; content: string }> = []
    const pointsPerSegment = options.pointsCount

    // Get all track points
    const tracks = gpx.querySelectorAll("trk")
    let segmentIndex = 0

    tracks.forEach((track, trackIndex) => {
      const trackName = track.querySelector("name")?.textContent || `Track ${trackIndex + 1}`
      const segments = track.querySelectorAll("trkseg")

      segments.forEach((segment) => {
        const points = Array.from(segment.querySelectorAll("trkpt"))

        // Split into chunks of pointsPerSegment
        for (let i = 0; i < points.length; i += pointsPerSegment) {
          const chunkPoints = points.slice(i, i + pointsPerSegment)

          if (chunkPoints.length > 0) {
            // Create a new GPX document for this chunk
            const newGpx = createEmptyGpx()
            const newTrack = document.createElement("trk")
            const newName = document.createElement("name")
            newName.textContent = `${trackName} - Part ${segmentIndex + 1}`
            newTrack.appendChild(newName)

            const newSegment = document.createElement("trkseg")
            chunkPoints.forEach((point) => {
              newSegment.appendChild(point.cloneNode(true))
            })

            newTrack.appendChild(newSegment)
            newGpx.querySelector("gpx")?.appendChild(newTrack)

            // Add to results
            results.push({
              name: `${fileName}_part_${segmentIndex + 1}-gpx-split.gpx`,
              content: new XMLSerializer().serializeToString(newGpx),
            })

            segmentIndex++
          }
        }
      })
    })

    return results
  }

  // Add this function after the splitByPoints function
  const splitByStages = (gpx: Document, fileName: string, options: { stagesCount: number }) => {
    const results: Array<{ name: string; content: string }> = []
    const stagesCount = Math.max(2, options.stagesCount) // Ensure at least 2 stages

    // Get all track points
    const tracks = gpx.querySelectorAll("trk")
    let allPoints: Element[] = []
    const trackNames: string[] = []

    // Collect all points from all tracks and segments
    tracks.forEach((track, trackIndex) => {
      const trackName = track.querySelector("name")?.textContent || `Track ${trackIndex + 1}`
      trackNames.push(trackName)

      const segments = track.querySelectorAll("trkseg")
      segments.forEach((segment) => {
        const points = Array.from(segment.querySelectorAll("trkpt"))
        allPoints = allPoints.concat(points)
      })
    })

    if (allPoints.length < stagesCount) {
      throw new Error(`Not enough points (${allPoints.length}) to split into ${stagesCount} stages`)
    }

    // Calculate points per stage
    const pointsPerStage = Math.floor(allPoints.length / stagesCount)
    const remainder = allPoints.length % stagesCount

    // Split into stages
    for (let stageIndex = 0; stageIndex < stagesCount; stageIndex++) {
      // Calculate start and end indices for this stage
      const startIndex = stageIndex * pointsPerStage + Math.min(stageIndex, remainder)
      const endIndex = (stageIndex + 1) * pointsPerStage + Math.min(stageIndex + 1, remainder)
      const stagePoints = allPoints.slice(startIndex, endIndex)

      if (stagePoints.length > 0) {
        // Create a new GPX document for this stage
        const newGpx = createEmptyGpx()
        const newTrack = document.createElement("trk")
        const newName = document.createElement("name")
        newName.textContent = `Stage ${stageIndex + 1} of ${stagesCount}`
        newTrack.appendChild(newName)

        const newSegment = document.createElement("trkseg")
        stagePoints.forEach((point) => {
          newSegment.appendChild(point.cloneNode(true))
        })

        newTrack.appendChild(newSegment)
        newGpx.querySelector("gpx")?.appendChild(newTrack)

        // Add to results
        results.push({
          name: `${fileName}_stage_${stageIndex + 1}_of_${stagesCount}-gpx-split.gpx`,
          content: new XMLSerializer().serializeToString(newGpx),
        })
      }
    }

    return results
  }

  const splitByTime = (gpx: Document, fileName: string, options: { timeValue: number; timeUnit: string }) => {
    const results: Array<{ name: string; content: string }> = []

    // Convert time to milliseconds
    let timeInMs = options.timeValue
    if (options.timeUnit === "hour") {
      timeInMs *= 60 * 60 * 1000
    } else if (options.timeUnit === "day") {
      timeInMs *= 24 * 60 * 60 * 1000
    }

    // Get all track points
    const tracks = gpx.querySelectorAll("trk")
    let segmentIndex = 0

    tracks.forEach((track, trackIndex) => {
      const trackName = track.querySelector("name")?.textContent || `Track ${trackIndex + 1}`
      const segments = track.querySelectorAll("trkseg")

      segments.forEach((segment) => {
        const points = Array.from(segment.querySelectorAll("trkpt"))

        if (points.length < 2) {
          // Not enough points to split
          return
        }

        let currentSegmentPoints: Element[] = []
        let segmentStartTime: Date | null = null

        for (let i = 0; i < points.length; i++) {
          const point = points[i]
          const timeElement = point.querySelector("time")

          if (!timeElement || !timeElement.textContent) {
            // Skip points without time data
            continue
          }

          const pointTime = new Date(timeElement.textContent)

          if (!segmentStartTime) {
            // First point with time data
            segmentStartTime = pointTime
            currentSegmentPoints.push(point)
            continue
          }

          // Check if we've exceeded the time interval
          const timeDiff = pointTime.getTime() - segmentStartTime.getTime()

          if (timeDiff > timeInMs) {
            // Create a new GPX document for this time segment
            const newGpx = createEmptyGpx()
            const newTrack = document.createElement("trk")
            const newName = document.createElement("name")
            newName.textContent = `${trackName} - Time ${segmentIndex + 1}`
            newTrack.appendChild(newName)

            const newSegment = document.createElement("trkseg")
            currentSegmentPoints.forEach((point) => {
              newSegment.appendChild(point.cloneNode(true))
            })

            newTrack.appendChild(newSegment)
            newGpx.querySelector("gpx")?.appendChild(newTrack)

            // Add to results
            results.push({
              name: `${fileName}_time_${segmentIndex + 1}-gpx-split.gpx`,
              content: new XMLSerializer().serializeToString(newGpx),
            })

            // Reset for next segment
            segmentIndex++
            segmentStartTime = pointTime
            currentSegmentPoints = [point] // Start new segment with current point
          } else {
            // Add to current segment
            currentSegmentPoints.push(point)
          }
        }

        // Add any remaining points as the last segment
        if (currentSegmentPoints.length > 1) {
          const newGpx = createEmptyGpx()
          const newTrack = document.createElement("trk")
          const newName = document.createElement("name")
          newName.textContent = `${trackName} - Time ${segmentIndex + 1}`
          newTrack.appendChild(newName)

          const newSegment = document.createElement("trkseg")
          currentSegmentPoints.forEach((point) => {
            newSegment.appendChild(point.cloneNode(true))
          })

          newTrack.appendChild(newSegment)
          newGpx.querySelector("gpx")?.appendChild(newTrack)

          // Add to results
          results.push({
            name: `${fileName}_time_${segmentIndex + 1}-gpx-split.gpx`,
            content: new XMLSerializer().serializeToString(newGpx),
          })

          segmentIndex++
        }
      })
    })

    return results
  }

  const createEmptyGpx = () => {
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GPXto Splitter" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Split GPX File</name>
    <desc>Created by splitting a GPX file using GPXto.com</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
</gpx>`

    return new DOMParser().parseFromString(xmlString, "text/xml")
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula to calculate distance between two points
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
  }

  const handleDownload = (index: number) => {
    if (index >= 0 && index < splitResults.length) {
      const result = splitResults[index]

      // Track the download
      trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
        tool: "gpx_splitter",
        donation: false,
        file_index: index,
        file_size: new Blob([result.content]).size,
      })

      // Create a blob with the correct MIME type
      const blob = new Blob([result.content], { type: "application/gpx+xml" })

      // Create a download URL
      const url = URL.createObjectURL(blob)

      // Create and configure the download link
      const downloadLink = document.createElement("a")
      downloadLink.href = url
      downloadLink.download = result.name

      // Append to document, click, and clean up
      document.body.appendChild(downloadLink)
      downloadLink.click()

      // Small delay before cleanup to ensure download starts
      setTimeout(() => {
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(url)
      }, 100)
    }
  }

  const handleDownloadAll = () => {
    // Track the download all action
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "gpx_splitter",
      donation: false,
      download_all: true,
      files_count: splitResults.length,
    })

    // Create a zip file with all results
    import("jszip").then(({ default: JSZip }) => {
      const zip = new JSZip()

      // Add each file to the zip
      splitResults.forEach((result) => {
        zip.file(result.name, result.content)
      })

      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a download URL
        const url = URL.createObjectURL(content)

        // Create and configure the download link
        const downloadLink = document.createElement("a")
        downloadLink.href = url
        downloadLink.download = `${file?.name.replace(/\.gpx$/i, "") || "track"}_split-gpx-split.zip`

        // Append to document, click, and clean up
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Small delay before cleanup to ensure download starts
        setTimeout(() => {
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(url)
        }, 100)
      })
    })
  }

  const handleDonate = (amount: string) => {
    // Track the donation
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "gpx_splitter",
      donation: true,
      donation_amount: amount,
      files_count: splitResults.length,
    })

    setHasDonated(true)

    // Download all files as a zip
    handleDownloadAll()
  }

  const handleReset = () => {
    setFile(null)
    setGpxContent(null)
    setSplitMethod("distance")
    setSplitOptions({
      distance: {
        distanceValue: 5,
        distanceUnit: "km",
      },
      points: {
        pointsCount: 500,
      },
      stages: {
        stagesCount: 3,
      },
    })
    setError(null)
    setIsSplitting(false)
    setCurrentStep(1)
    setSplitResults([])
    setHasDonated(false)
    setPreviewIndex(0)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Step indicator */}
      <div className="flex justify-start border-b pb-2 sm:pb-4">
        {[
          { id: 1, name: "Upload" },
          { id: 2, name: "Configure" },
          { id: 3, name: "Split" },
          { id: 4, name: "Download" },
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

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Upload */}
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
              disabled={!file}
              className="px-4 py-2 bg-black text-white disabled:bg-gray-400"
            >
              Next: Configure Split Options
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Configure Split Options</h3>
            {file && (
              <div className="text-sm text-gray-600">
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Split Method</h4>
            <div className="space-y-2">
              <label htmlFor="split-method" className="block">
                Choose how to split your GPX file:
              </label>
              <select
                id="split-method"
                value={splitMethod}
                onChange={handleSplitMethodChange}
                className="w-full p-2 border"
              >
                <option value="distance">By Distance</option>
                <option value="points">By Number of Points</option>
                <option value="stages">By Number of Stages</option>
              </select>
            </div>
          </div>

          {/* Method-specific options */}
          {splitMethod === "distance" && (
            <div className="p-4 border space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gray-500" />
                <h4 className="font-medium">Distance Options</h4>
              </div>

              <div className="space-y-2">
                <label htmlFor="distance-value" className="block">
                  Split every:
                </label>
                <div className="flex gap-2">
                  <input
                    id="distance-value"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={splitOptions.distance.distanceValue}
                    onChange={(e) => handleOptionChange("distance", "distanceValue", Number.parseFloat(e.target.value))}
                    className="w-24 p-2 border"
                  />
                  <select
                    value={splitOptions.distance.distanceUnit}
                    onChange={(e) => handleOptionChange("distance", "distanceUnit", e.target.value)}
                    className="p-2 border"
                  >
                    <option value="km">Kilometers</option>
                    <option value="mi">Miles</option>
                    <option value="m">Meters</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600">Create a new file every time the track covers this distance</p>
              </div>
            </div>
          )}

          {splitMethod === "points" && (
            <div className="p-4 border space-y-4">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-gray-500" />
                <h4 className="font-medium">Points Options</h4>
              </div>

              <div className="space-y-2">
                <label htmlFor="points-count" className="block">
                  Maximum points per file:
                </label>
                <input
                  id="points-count"
                  type="number"
                  min="10"
                  step="10"
                  value={splitOptions.points.pointsCount}
                  onChange={(e) => handleOptionChange("points", "pointsCount", Number.parseInt(e.target.value, 10))}
                  className="w-full p-2 border"
                />
                <p className="text-sm text-gray-600">Split the track into files with at most this many points each</p>
              </div>
            </div>
          )}

          {splitMethod === "stages" && (
            <div className="p-4 border space-y-4">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-gray-500" />
                <h4 className="font-medium">Stages Options</h4>
              </div>

              <div className="space-y-2">
                <label htmlFor="stages-count" className="block">
                  Number of stages/files:
                </label>
                <input
                  id="stages-count"
                  type="number"
                  min="2"
                  max="50"
                  value={splitOptions.stages.stagesCount}
                  onChange={(e) => handleOptionChange("stages", "stagesCount", Number.parseInt(e.target.value, 10))}
                  className="w-full p-2 border"
                />
                <p className="text-sm text-gray-600">Split the track into this many equal parts</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button onClick={handlePreviousStep} className="px-4 py-2 border">
              Back
            </button>
            <button onClick={handleNextStep} className="px-4 py-2 bg-black text-white">
              Split GPX
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Splitting */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-4 border space-y-4">
            <p>Splitting your GPX file...</p>
            <div className="w-full h-2 bg-gray-200">
              <div className="h-full bg-black animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600">Applying your split options...</p>
          </div>
        </div>
      )}

      {/* Step 4: Download */}
      {currentStep === 4 && splitResults.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 border">
            <h3 className="font-medium mb-4">Split Complete!</h3>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Your GPX file has been split into {splitResults.length} files using the {splitMethod} method.
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      File Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {splitResults.map((result, index) => (
                    <tr key={index} className={index === previewIndex ? "bg-gray-100" : ""}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setPreviewIndex(index)}
                          className="text-left hover:underline focus:outline-none"
                        >
                          {result.name}
                        </button>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        {(new Blob([result.content]).size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        <button onClick={() => handleDownload(index)} className="text-primary hover:underline">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!hasDonated ? (
              <div className="space-y-3">
                <p className="text-sm">Support GPXto to download all files as a ZIP:</p>
                <div className="space-y-2">
                  <a
                    href="https://ko-fi.com/gpxto/2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("2")}
                  >
                    <button className="w-full px-4 py-2 bg-black text-white">Donate €2 & Download All</button>
                  </a>
                  <button onClick={handleDownloadAll} className="w-full px-4 py-2 text-sm">
                    Download All without donating
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={handleDownloadAll} className="w-full mb-2 px-4 py-2 bg-black text-white">
                  Download All Again
                </button>
                <p className="text-xs text-center text-gray-600 mb-2">Thank you for your support!</p>
                <button onClick={handleReset} className="w-full px-4 py-2 border">
                  Split Another File
                </button>
              </>
            )}
            <div className="mt-4 text-center text-sm">
              <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:underline">
                Back to configuration
              </button>
              {" • "}
              <button onClick={handleReset} className="text-gray-600 hover:underline">
                Split more files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Preview */}
      {(gpxContent || (splitResults.length > 0 && previewIndex >= 0)) && (
        <div className="mt-8">
          <h2>Map Preview</h2>
          <div className="h-[250px] sm:h-[350px] border">
            <MapPreview gpxContent={splitResults.length > 0 ? splitResults[previewIndex].content : gpxContent} />
          </div>
          {splitResults.length > 0 && (
            <p className="text-sm text-center mt-2 text-gray-600">
              Showing preview for: {splitResults[previewIndex].name}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
