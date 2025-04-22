"use client"

import type React from "react"

import { useState, useEffect } from "react"
import FileSaver from "file-saver"
import { MapPreview } from "@/components/map-preview"
import { convertGpxToKml } from "@/utils/gpx-to-kml"
import {} from "@/components/ui/tabs"

export function GpxToKmlTool() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [gpxContent, setGpxContent] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [hasDonated, setHasDonated] = useState(false)
  const [options, setOptions] = useState({
    lineColor: "#FF0000",
    lineWidth: 4,
    includeElevation: true,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if there's stored GPX content in sessionStorage
    const storedGpxContent = sessionStorage.getItem("gpxContent")
    const storedFileName = sessionStorage.getItem("gpxFileName")
    const storedFileSize = sessionStorage.getItem("gpxFileSize")

    if (storedGpxContent && storedFileName && storedFileSize) {
      setGpxContent(storedGpxContent)
      setFileName(storedFileName.replace(/\.gpx$/i, "") + "-kml.kml")

      setFileSize(Number.parseInt(storedFileSize, 10))

      // Create a File object from the stored content
      const blob = new Blob([storedGpxContent], { type: "application/gpx+xml" })
      const fileFromStorage = new File([blob], storedFileName, {
        type: "application/gpx+xml",
        lastModified: new Date().getTime(),
      })
      setFile(fileFromStorage)

      // Automatically advance to the Configure step
      setCurrentStep(2)
    }
  }, [])

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
    setFileName(selectedFile.name.replace(/\.gpx$/i, "") + "-kml.kml")
    setFileSize(selectedFile.size)

    // Read the file content for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setGpxContent(content)

        // Store the GPX content, file name, and file size in sessionStorage
        sessionStorage.setItem("gpxContent", content)
        sessionStorage.setItem("gpxFileName", selectedFile.name)
        sessionStorage.setItem("gpxFileSize", selectedFile.size.toString())
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

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!file) {
        setError("Please select a file")
        return
      }
      setError(null)
      setCurrentStep(2)
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
    setConvertedFile(null)
    setCurrentStep(3)

    try {
      if (!gpxContent) {
        throw new Error("No GPX content to convert")
      }

      // Convert GPX to KML
      const kmlContent = convertGpxToKml(gpxContent, options)
      setConvertedFile(kmlContent)
      setIsConverting(false)
      setCurrentStep(4) // Move to Download step after conversion is complete
    } catch (err) {
      setIsConverting(false)
      setError("Conversion failed. Please check your file and try again.")
      setCurrentStep(2)
      console.error("Error during conversion:", err)
    }
  }

  const handleDownload = () => {
    if (convertedFile) {
      const blob = new Blob([convertedFile], { type: "application/vnd.google-earth.kml+xml" })
      FileSaver.saveAs(blob, fileName)
    }
  }

  const handleDonate = (amount: string) => {
    setHasDonated(true)

    // Perform the download after donation
    if (convertedFile) {
      const blob = new Blob([convertedFile], { type: "application/vnd.google-earth.kml+xml" })
      FileSaver.saveAs(blob, fileName)
    }
  }

  const handleReset = () => {
    setFile(null)
    setGpxContent(null)
    setConvertedFile(null)
    setError(null)
    setHasDonated(false)
    setCurrentStep(1)
    setFileName("")
    setFileSize(0)

    // Clear stored file data
    sessionStorage.removeItem("gpxContent")
    sessionStorage.removeItem("gpxFileName")
    sessionStorage.removeItem("gpxFileSize")
  }

  const handleOptionChange = (name: string, value: any) => {
    setOptions((prev) => ({ ...prev, [name]: value }))

    // Re-convert with new options if we have GPX content
    if (gpxContent && currentStep >= 2) {
      try {
        const kmlContent = convertGpxToKml(gpxContent, { ...options, [name]: value })
        setConvertedFile(kmlContent)
      } catch (error) {
        console.error("Error during conversion:", error)
        setError(`Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-4">Convert GPX to KML</h1>
        <p className="text-muted-foreground mb-8">
          Transform your GPX files into KML format for use with Google Earth and Google Maps. Our converter preserves
          tracks, routes, waypoints, and elevation data.
        </p>

        <div className="space-y-4 sm:space-y-6">
          {/* Step indicator */}
          <div className="flex justify-start border-b pb-2 sm:pb-4">
            {[
              { id: 1, name: "Upload" },
              { id: 2, name: "Configure" },
              { id: 3, name: "Convert" },
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

          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="file-upload" className="block mb-2">
                  Upload GPX File:
                </label>
                <input type="file" id="file-upload" accept=".gpx" onChange={handleFileChange} className="w-full" />
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
                  Next: Configure Options
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg">Configure KML Options</h3>
                {file && (
                  <div className="text-sm text-gray-600">
                    File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>

              <div className="p-4 border space-y-4">
                <h4 className="font-medium">Appearance</h4>
                <div className="space-y-2">
                  <label className="block">Line Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={options.lineColor}
                      onChange={(e) => handleOptionChange("lineColor", e.target.value)}
                      className="w-12 h-8 p-1"
                    />
                    <input
                      type="text"
                      value={options.lineColor}
                      onChange={(e) => handleOptionChange("lineColor", e.target.value)}
                      className="flex-1 p-2 border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block">Line Width</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={options.lineWidth}
                    onChange={(e) => handleOptionChange("lineWidth", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Thin</span>
                    <span>Medium</span>
                    <span>Thick</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border space-y-4">
                <h4 className="font-medium">Content</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-elevation"
                    checked={options.includeElevation}
                    onChange={(e) => handleOptionChange("includeElevation", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="include-elevation">Include Elevation Data</label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button onClick={handlePreviousStep} className="px-4 py-2 border">
                  Back
                </button>
                <button onClick={handleNextStep} className="px-4 py-2 bg-black text-white">
                  Convert
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Converting */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 border space-y-4">
                <p>Converting your file...</p>
                <div className="w-full h-2 bg-gray-200">
                  <div className="h-full bg-black animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-600">Applying your custom settings to the conversion...</p>
              </div>
            </div>
          )}

          {/* Step 4: Download */}
          {currentStep === 4 && convertedFile && (
            <div className="space-y-4">
              <div className="p-4 border">
                <h3 className="font-medium mb-4">Conversion Complete!</h3>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    Your file has been successfully converted with the following options:
                  </p>
                  <ul className="text-sm space-y-1 ml-5 list-disc">
                    <li>Line Color: {options.lineColor}</li>
                    <li>Line Width: {options.lineWidth}</li>
                    <li>Include Elevation: {options.includeElevation ? "Yes" : "No"}</li>
                  </ul>
                </div>

                {!hasDonated ? (
                  <div className="space-y-3">
                    <p className="text-sm">Support GPXto to download your file:</p>
                    <div className="space-y-2">
                      <a
                        href="https://ko-fi.com/gpxto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                        onClick={() => handleDonate("2")}
                      >
                        <button className="w-full px-4 py-2 bg-black text-white">Download & support</button>
                      </a>
                      <button onClick={handleDownload} className="w-full px-4 py-2 text-sm">
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
                      Convert Another File
                    </button>
                  </>
                )}
                <div className="mt-4 text-center text-sm">
                  <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:underline">
                    Back to configuration
                  </button>
                  {" • "}
                  <button onClick={handleReset} className="text-gray-600 hover:underline">
                    Convert more files
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
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Convert GPX tracks, routes, and waypoints to KML format</li>
          <li>Customize line color and width for better visibility in Google Earth</li>
          <li>Option to include or exclude elevation data</li>
          <li>Preview your route on an interactive map before downloading</li>
          <li>View the generated KML code</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
        </ul>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">About GPX and KML Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg mb-2">What is a GPX file?</h3>
            <p className="text-muted-foreground">
              GPX (GPS Exchange Format) is an XML schema designed as a common GPS data format for software applications.
              It can be used to describe waypoints, tracks, and routes. The format is open and can be used without the
              need to pay license fees.
            </p>
          </div>
          <div>
            <h3 className="text-lg mb-2">What is a KML file?</h3>
            <p className="text-muted-foreground">
              KML (Keyhole Markup Language) is an XML-based format used to display geographic data in Earth browsers
              such as Google Earth and Google Maps. KML uses a tag-based structure with nested elements and attributes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
