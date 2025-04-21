"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPreview } from "./map-preview"
import { ChevronUp, ChevronDown } from "lucide-react"

// Importeer de analytics utility bovenaan het bestand
import { trackEvent, ANALYTICS_EVENTS } from "@/utils/analytics"

export function MergeGpxTool() {
  const [files, setFiles] = useState<File[]>([])
  const [gpxContents, setGpxContents] = useState<string[]>([])
  const [mergedGpx, setMergedGpx] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMerging, setIsMerging] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [mergeOptions, setMergeOptions] = useState<Record<string, any>>({
    preserveAllData: true,
    combineWaypoints: true,
  })
  const [hasDonated, setHasDonated] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)

  // Add a warning message for the coming soon feature
  const isComingSoon = true

  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFiles: File[] = []

    // Convert FileList to array and filter for GPX files
    Array.from(selectedFiles).forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".gpx")) {
        setError("Only GPX files are supported")
        return
      }
      newFiles.push(file)
    })

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles])
      setError(null)

      // Read file contents
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            setGpxContents((prev) => [...prev, content])
          } catch (err) {
            setError("Failed to read one of the GPX files")
          }
        }
        reader.onerror = () => {
          setError("Failed to read one of the GPX files")
        }
        reader.readAsText(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setGpxContents((prev) => prev.filter((_, i) => i !== index))
    setMergedGpx(null)
  }

  const handleOptionChange = (key: string, value: any) => {
    setMergeOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Wijzig de handleNextStep functie om events te versturen wanneer gebruikers naar stap 2 gaan
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (files.length < 2) {
        setError("Please upload at least two GPX files to merge")
        return
      }
      setError(null)
      setCurrentStep(2)

      // Track when user reaches step 2 (Configure)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 2,
        tool: "merge_gpx",
        files_count: files.length,
        total_size: files.reduce((total, file) => total + file.size, 0),
      })
    } else if (currentStep === 2) {
      // Check if the feature is coming soon
      if (isComingSoon) {
        setError("This feature is coming soon! Check back later.")
        return
      }

      handleMerge()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const moveFile = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === files.length - 1)) {
      return // Can't move further in this direction
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newFiles = [...files]
    const newGpxContents = [...gpxContents]

    // Swap files
    ;[newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
    // Swap contents
    ;[newGpxContents[index], newGpxContents[newIndex]] = [newGpxContents[newIndex], newGpxContents[index]]

    setFiles(newFiles)
    setGpxContents(newGpxContents)
  }

  // Add a new function to reverse the file order after the moveFile function
  const handleReverseOrder = () => {
    setFiles([...files].reverse())
    setGpxContents([...gpxContents].reverse())

    // Track the reverse order action
    trackEvent("reverse_file_order", {
      tool: "merge_gpx",
      files_count: files.length,
    })
  }

  // Voeg tracking toe aan handleMerge om conversies te meten
  const handleMerge = async () => {
    setIsMerging(true)
    setError(null)
    setMergedGpx(null)
    setCurrentStep(3)

    // Track when merge starts
    trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
      step: 3,
      tool: "merge_gpx",
      files_count: files.length,
      total_size: files.reduce((total, file) => total + file.size, 0),
      merge_options: JSON.stringify(mergeOptions),
    })

    try {
      if (gpxContents.length < 2) {
        throw new Error("At least two GPX files are required for merging")
      }

      // Create a basic merged GPX structure
      let merged = '<?xml version="1.0" encoding="UTF-8"?>\n'
      merged +=
        '<gpx version="1.1" creator="GPXto Merger" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n'
      merged += "  <metadata>\n"
      merged += "    <name>Merged GPX File</name>\n"
      merged += "    <desc>Created by merging multiple GPX files using GPXto.com</desc>\n"
      merged += `    <time>${new Date().toISOString()}</time>\n`
      merged += "  </metadata>\n"

      // Process each GPX file
      for (let i = 0; i < gpxContents.length; i++) {
        const content = gpxContents[i]
        const parser = new DOMParser()
        const gpx = parser.parseFromString(content, "text/xml")

        // Extract tracks if includeTracks option is enabled
        if (mergeOptions.includeTracks !== false) {
          const tracks = gpx.querySelectorAll("trk")
          tracks.forEach((track) => {
            merged += `  <trk>\n`

            // Get track name or create a default one
            const trackName = track.querySelector("name")?.textContent || `Track ${i + 1}`
            merged += `    <name>${trackName}</name>\n`

            // Add track description if present
            const trackDesc = track.querySelector("desc")?.textContent
            if (trackDesc && mergeOptions.preserveAllData) {
              merged += `    <desc>${trackDesc}</desc>\n`
            }

            // Add all track segments
            const segments = track.querySelectorAll("trkseg")
            segments.forEach((segment) => {
              merged += `    <trkseg>\n`

              // Add all track points
              const points = segment.querySelectorAll("trkpt")
              points.forEach((point) => {
                const lat = point.getAttribute("lat")
                const lon = point.getAttribute("lon")
                merged += `      <trkpt lat="${lat}" lon="${lon}">\n`

                // Add elevation if present
                const ele = point.querySelector("ele")?.textContent
                if (ele && mergeOptions.preserveAllData) {
                  merged += `        <ele>${ele}</ele>\n`
                }

                // Add time if present
                const time = point.querySelector("time")?.textContent
                if (time && mergeOptions.preserveAllData) {
                  merged += `        <time>${time}</time>\n`
                }

                // Add other point data if preserveAllData is enabled
                if (mergeOptions.preserveAllData) {
                  // Add heart rate if present
                  const hr = point.querySelector("extensions")?.querySelector("hr")?.textContent
                  if (hr) {
                    merged += `        <extensions>\n`
                    merged += `          <hr>${hr}</hr>\n`
                    merged += `        </extensions>\n`
                  }
                }

                merged += `      </trkpt>\n`
              })

              merged += `    </trkseg>\n`
            })

            merged += `  </trk>\n`
          })
        }

        // Extract routes if includeRoutes option is enabled
        if (mergeOptions.includeRoutes !== false) {
          const routes = gpx.querySelectorAll("rte")
          routes.forEach((route) => {
            merged += `  <rte>\n`

            // Get route name or create a default one
            const routeName = route.querySelector("name")?.textContent || `Route ${i + 1}`
            merged += `    <name>${routeName}</name>\n`

            // Add route description if present
            const routeDesc = route.querySelector("desc")?.textContent
            if (routeDesc && mergeOptions.preserveAllData) {
              merged += `    <desc>${routeDesc}</desc>\n`
            }

            // Add all route points
            const points = route.querySelectorAll("rtept")
            points.forEach((point) => {
              const lat = point.getAttribute("lat")
              const lon = point.getAttribute("lon")
              merged += `    <rtept lat="${lat}" lon="${lon}">\n`

              // Add elevation if present
              const ele = point.querySelector("ele")?.textContent
              if (ele && mergeOptions.preserveAllData) {
                merged += `      <ele>${ele}</ele>\n`
              }

              // Add time if present
              const time = point.querySelector("time")?.textContent
              if (time && mergeOptions.preserveAllData) {
                merged += `      <time>${time}</time>\n`
              }

              // Add name if present
              const name = point.querySelector("name")?.textContent
              if (name && mergeOptions.preserveAllData) {
                merged += `      <name>${name}</name>\n`
              }

              merged += `    </rtept>\n`
            })

            merged += `  </rte>\n`
          })
        }

        // Extract waypoints if combineWaypoints option is enabled
        if (mergeOptions.combineWaypoints) {
          const waypoints = gpx.querySelectorAll("wpt")
          waypoints.forEach((waypoint) => {
            const lat = waypoint.getAttribute("lat")
            const lon = waypoint.getAttribute("lon")
            merged += `  <wpt lat="${lat}" lon="${lon}">\n`

            // Add elevation if present
            const ele = waypoint.querySelector("ele")?.textContent
            if (ele && mergeOptions.preserveAllData) {
              merged += `    <ele>${ele}</ele>\n`
            }

            // Add time if present
            const time = waypoint.querySelector("time")?.textContent
            if (time && mergeOptions.preserveAllData) {
              merged += `    <time>${time}</time>\n`
            }

            // Add name if present
            const name = waypoint.querySelector("name")?.textContent || `Waypoint`
            merged += `    <name>${name}</name>\n`

            // Add description if present
            const desc = waypoint.querySelector("desc")?.textContent
            if (desc && mergeOptions.preserveAllData) {
              merged += `    <desc>${desc}</desc>\n`
            }

            merged += `  </wpt>\n`
          })
        }
      }

      // Close the GPX document
      merged += "</gpx>"

      setMergedGpx(merged)
      setFileName("merged.gpx")
      setFileSize(new Blob([merged]).size)
      setIsConverting(false)
      setCurrentStep(4) // Move to Download step after conversion is complete

      // Track when user reaches step 4 (Download)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 4,
        tool: "merge_gpx",
        files_count: files.length,
        total_size: files.reduce((total, file) => total + file.size, 0),
        output_size: new Blob([merged]).size,
        success: true,
      })

      // Track when merge completes successfully
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "merge_gpx",
        success: true,
        files_count: files.length,
        total_size: files.reduce((total, file) => total + file.size, 0),
        output_size: new Blob([merged]).size,
      })
    } catch (err) {
      console.error("Error merging GPX files:", err)
      setIsMerging(false)
      setError("Failed to merge GPX files. Please check that all files are valid GPX format.")
      setCurrentStep(2)

      // Track when merge fails
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "merge_gpx",
        success: false,
        error: err instanceof Error ? err.message : "Failed to merge GPX files",
        files_count: files.length,
      })
    }
  }

  // Wijzig de handleDownload functie om te tracken welke downloadknop wordt gebruikt
  const handleDownload = () => {
    // Track the download without donation
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "merge_gpx",
      donation: false,
      files_count: files.length,
      total_size: files.reduce((total, file) => total + file.size, 0),
    })

    // Perform the actual download
    if (mergedGpx) {
      try {
        // Create a blob with the correct MIME type
        const blob = new Blob([mergedGpx], { type: "application/gpx+xml" })

        // Create a download URL
        const url = URL.createObjectURL(blob)

        // Create and configure the download link
        const downloadLink = document.createElement("a")
        downloadLink.href = url
        downloadLink.download = "merged.gpx"

        // Append to document, click, and clean up
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Small delay before cleanup to ensure download starts
        setTimeout(() => {
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(url)
        }, 100)
      } catch (error) {
        console.error("Download error:", error)
        setError("Failed to download the merged file. Please try again.")
      }
    }
  }

  // Wijzig de handleDonate functie om te tracken welke donatieknop wordt gebruikt
  const handleDonate = (amount: string) => {
    // Track the donation download
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "merge_gpx",
      donation: true,
      donation_amount: amount,
      files_count: files.length,
      total_size: files.reduce((total, file) => total + file.size, 0),
    })

    setHasDonated(true)

    // Perform the download after donation
    if (mergedGpx) {
      try {
        // Create a blob with the correct MIME type
        const blob = new Blob([mergedGpx], { type: "application/gpx+xml" })

        // Create a download URL
        const url = URL.createObjectURL(blob)

        // Create and configure the download link
        const downloadLink = document.createElement("a")
        downloadLink.href = url
        downloadLink.download = "merged.gpx"

        // Append to document, click, and clean up
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Small delay before cleanup to ensure download starts
        setTimeout(() => {
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(url)
        }, 100)
      } catch (error) {
        console.error("Download error:", error)
        setError("Failed to download the merged file. Please try again.")
      }
    }
  }

  const handleReset = () => {
    setFiles([])
    setGpxContents([])
    setMergedGpx(null)
    setError(null)
    setHasDonated(false)
    setCurrentStep(1)
    setMergeOptions({
      preserveAllData: true,
      combineWaypoints: true,
    })
    setFileName("")
    setFileSize(0)
  }

  // For UI consistency with file-upload-simple.tsx
  const [isConverting, setIsConverting] = useState(false)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Step indicator */}
      <div className="flex justify-start border-b pb-2 sm:pb-4">
        {[
          { id: 1, name: "Upload" },
          { id: 2, name: "Configure" },
          { id: 3, name: "Merge" },
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

      {error && <p className="text-red-600">{error}</p>}

      {/* Step 1: Upload files */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="gpx-files" className="block mb-2">
              Upload GPX Files (minimum 2 files):
            </label>
            <input type="file" id="gpx-files" accept=".gpx" multiple onChange={handleFileChange} className="w-full" />
          </div>

          {files.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                    <div>
                      <span>{file.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleNextStep}
              disabled={files.length < 2}
              className="px-4 py-2 bg-black text-white disabled:bg-gray-400"
            >
              Next: Configure Options
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Configure Merge Options</h3>
            <div className="text-sm text-gray-600">
              {files.length} files selected ({files.reduce((total, file) => total + file.size, 0) / 1024} KB total)
            </div>
          </div>

          {/* Add coming soon warning */}
          {isComingSoon && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 mb-4">
              <p className="font-medium">Coming Soon!</p>
              <p className="text-sm">This feature is currently in development and will be available soon.</p>
            </div>
          )}

          <div className="p-4 border space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">File Order</h4>
              <button
                onClick={handleReverseOrder}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                disabled={files.length < 2}
              >
                Reverse Order
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Arrange files in the order you want them to be merged:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <div className="flex-1">
                    <span>{file.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? "text-gray-400" : "text-gray-700 hover:bg-gray-200"}`}
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className={`p-1 rounded ${index === files.length - 1 ? "text-gray-400" : "text-gray-700 hover:bg-gray-200"}`}
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border space-y-4">
            <h4 className="font-medium">Merge Options</h4>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mergeOptions.preserveAllData}
                  onChange={(e) => handleOptionChange("preserveAllData", e.target.checked)}
                />
                <span>Preserve all metadata</span>
              </label>
              <p className="text-sm text-gray-600 ml-6">
                Keep all original data including elevation, time, and extensions
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mergeOptions.combineWaypoints}
                  onChange={(e) => handleOptionChange("combineWaypoints", e.target.checked)}
                />
                <span>Combine waypoints</span>
              </label>
              <p className="text-sm text-gray-600 ml-6">Include waypoints from all files in the merged output</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={handlePreviousStep} className="px-4 py-2 border">
              Back
            </button>
            <button
              onClick={handleNextStep}
              className={`px-4 py-2 ${isComingSoon ? "bg-yellow-500" : "bg-black"} text-white`}
            >
              {isComingSoon ? "Coming Soon" : "Merge Files"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Merging */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-4 border space-y-4">
            <p>Merging your files...</p>
            <div className="w-full h-2 bg-gray-200">
              <div className="h-full bg-black animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600">Applying your merge options...</p>
          </div>
        </div>
      )}

      {/* Step 4: Download */}
      {currentStep === 4 && mergedGpx && (
        <div className="space-y-4">
          <div className="p-4 border">
            <h3 className="font-medium mb-4">Merge Complete!</h3>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Your files have been successfully merged with the following options:
              </p>
              <ul className="text-sm space-y-1 ml-5 list-disc">
                {Object.entries(mergeOptions).map(([key, value]) => (
                  <li key={key}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:{" "}
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : value.toString()}
                  </li>
                ))}
              </ul>
            </div>

            {!hasDonated ? (
              <div className="space-y-3">
                <p className="text-sm">Support GPXto to download your file:</p>
                <div className="space-y-2">
                  <a
                    href="https://ko-fi.com/gpxto/2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("2")}
                  >
                    <button className="w-full px-4 py-2 bg-black text-white">Donate €2 & Download</button>
                  </a>
                  <a
                    href="https://ko-fi.com/gpxto/5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => handleDonate("5")}
                  >
                    <button className="w-full px-4 py-2 border">Donate €5 & Download</button>
                  </a>
                  <button onClick={handleDownload} className="w-full px-4 py-2 border text-sm">
                    Download without donating
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={handleDownload} className="w-full mb-2 px-4 py-2 bg-black text-white">
                  Download Again
                </button>
                <p className="text-xs text-center text-gray-600 mb-2">Thank you for your support!</p>
                <button onClick={handleReset} className="w-full px-4 py-2 border">
                  Merge More Files
                </button>
              </>
            )}
            <div className="mt-4 text-center text-sm">
              <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:underline">
                Back to configuration
              </button>
              {" • "}
              <button onClick={handleReset} className="text-gray-600 hover:underline">
                Merge more files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Preview */}
      {mergedGpx && (
        <div className="mt-8">
          <h2>Map Preview</h2>
          <div className="h-[250px] sm:h-[350px] border">
            <MapPreview gpxContent={mergedGpx} />
          </div>
        </div>
      )}
    </div>
  )
}
