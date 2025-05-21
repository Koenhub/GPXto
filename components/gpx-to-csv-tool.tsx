"use client"

import type React from "react"

import { useState, useEffect } from "react"
import FileSaver from "file-saver"
import { MapPreview } from "@/components/map-preview"
import { convertGpxToCsv } from "@/utils/gpx-to-csv"
import { trackEvent, ANALYTICS_EVENTS } from "@/utils/analytics"

export function GpxToCsvTool() {
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
    delimiter: "comma",
    includeHeaders: true,
    timeFormat: "iso",
    includeElevation: true,
    includeSpeed: false,
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
      setFileName(storedFileName.replace(/\.gpx$/i, "") + "-csv.csv")

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
    setFileName(selectedFile.name.replace(/\.gpx$/i, "") + "-csv.csv")
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

      // Track when user reaches step 2 (Configure)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 2,
        tool: "gpx_to_csv",
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
    setConvertedFile(null)
    setCurrentStep(3)

    // Track when conversion starts
    trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
      step: 3,
      tool: "gpx_to_csv",
      file_size: file?.size || 0,
      conversion_options: JSON.stringify(options),
    })

    try {
      if (!gpxContent) {
        throw new Error("No GPX content to convert")
      }

      // Convert GPX to CSV
      const csvContent = convertGpxToCsv(gpxContent, options)
      setConvertedFile(csvContent)
      setIsConverting(false)
      setCurrentStep(4) // Move to Download step after conversion is complete

      // Track when user reaches step 4 (Download)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 4,
        tool: "gpx_to_csv",
        file_size: file?.size || 0,
        success: true,
      })

      // Track when conversion completes successfully
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_to_csv",
        success: true,
        file_size: file?.size || 0,
      })
    } catch (err) {
      setIsConverting(false)
      setError("Conversion failed. Please check your file and try again.")
      setCurrentStep(2)
      console.error("Error during conversion:", err)

      // Track when conversion fails
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        tool: "gpx_to_csv",
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        file_size: file?.size || 0,
      })
    }
  }

  const handleDownload = () => {
    // Track the download
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "gpx_to_csv",
      donation: false,
      file_size: file?.size || 0,
    })

    if (convertedFile) {
      const blob = new Blob([convertedFile], { type: "text/csv;charset=utf-8" })
      FileSaver.saveAs(blob, fileName)
    }
  }

  const handleDonate = (amount: string) => {
    // Track the donation
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      tool: "gpx_to_csv",
      donation: true,
      donation_amount: amount,
      file_size: file?.size || 0,
    })

    setHasDonated(true)

    // Perform the download after donation
    if (convertedFile) {
      const blob = new Blob([convertedFile], { type: "text/csv;charset=utf-8" })
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

    // Reset options to defaults
    setOptions({
      delimiter: "comma",
      includeHeaders: true,
      timeFormat: "iso",
      includeElevation: true,
      includeSpeed: false,
    })

    // Clear stored file data
    sessionStorage.removeItem("gpxContent")
    sessionStorage.removeItem("gpxFileName")
    sessionStorage.removeItem("gpxFileSize")
  }

  const handleOptionChange = (name: string, value: any) => {
    setOptions((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-4">Convert GPX to CSV</h1>
        <p className="text-muted-foreground mb-8">
          Transform your GPX files into CSV (Comma-Separated Values) format for use with spreadsheet software,
          databases, and data analysis tools. Our converter preserves coordinates, elevation, and time data.
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
                      // From Download, allow going to Configure
                      if (step.id === 2) {
                        setCurrentStep(2)
                      }
                    } else if (currentStep === 1) {
                      // From Upload, allow going to Configure if we have a file
                      if (step.id === 2 && file) {
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
                    (step.id === 2 && currentStep === 1 && !file)
                  }
                  className={`inline-block px-1 sm:px-2 py-1 text-xs sm:text-sm ${
                    currentStep === step.id
                      ? "border-b-2 border-black dark:border-white font-medium dark:text-white"
                      : (
                            // Make specific steps clickable based on current step
                            (currentStep === 2 && (step.id === 1 || step.id === 3)) ||
                              (currentStep === 4 && step.id === 2) ||
                              (currentStep === 1 && step.id === 2 && file)
                          )
                        ? "text-black dark:text-white hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
                        : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {step.name}
                </button>
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
                <h3 className="text-lg">Configure CSV Options</h3>
                {file && (
                  <div className="text-sm text-gray-600">
                    File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </div>
                )}
              </div>

              <div className="p-4 border space-y-4">
                <h4 className="font-medium">Format Options</h4>
                <div className="space-y-2">
                  <label htmlFor="delimiter" className="block">
                    Delimiter:
                  </label>
                  <select
                    id="delimiter"
                    value={options.delimiter}
                    onChange={(e) => handleOptionChange("delimiter", e.target.value)}
                    className="w-full p-2 border"
                  >
                    <option value="comma">Comma (,)</option>
                    <option value="semicolon">Semicolon (;)</option>
                    <option value="tab">Tab</option>
                    <option value="pipe">Pipe (|)</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-headers"
                    checked={options.includeHeaders}
                    onChange={(e) => handleOptionChange("includeHeaders", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="include-headers">Include Column Headers</label>
                </div>
              </div>

              <div className="p-4 border space-y-4">
                <h4 className="font-medium">Data Options</h4>
                <div className="space-y-2">
                  <label htmlFor="time-format" className="block">
                    Time Format:
                  </label>
                  <select
                    id="time-format"
                    value={options.timeFormat}
                    onChange={(e) => handleOptionChange("timeFormat", e.target.value)}
                    className="w-full p-2 border"
                  >
                    <option value="iso">ISO 8601 (2023-04-25T14:30:00Z)</option>
                    <option value="local">Local Format (4/25/2023 2:30 PM)</option>
                    <option value="unix">Unix Timestamp (1682434200)</option>
                    <option value="none">Don't Include Time</option>
                  </select>
                </div>
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-speed"
                    checked={options.includeSpeed}
                    onChange={(e) => handleOptionChange("includeSpeed", e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="include-speed">Calculate and Include Speed Data</label>
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
                    <li>
                      Delimiter:{" "}
                      {options.delimiter === "comma"
                        ? "Comma (,)"
                        : options.delimiter === "semicolon"
                          ? "Semicolon (;)"
                          : options.delimiter === "tab"
                            ? "Tab"
                            : "Pipe (|)"}
                    </li>
                    <li>Include Headers: {options.includeHeaders ? "Yes" : "No"}</li>
                    <li>
                      Time Format:{" "}
                      {options.timeFormat === "iso"
                        ? "ISO 8601"
                        : options.timeFormat === "local"
                          ? "Local Format"
                          : options.timeFormat === "unix"
                            ? "Unix Timestamp"
                            : "None"}
                    </li>
                    <li>Include Elevation: {options.includeElevation ? "Yes" : "No"}</li>
                    <li>Include Speed: {options.includeSpeed ? "Yes" : "No"}</li>
                  </ul>
                </div>

                {!hasDonated ? (
                  <div className="space-y-3">
                    <p className="text-sm">Support GPXto to download your file:</p>
                    <div className="space-y-2">
                      <a
                        href="https://ko-fi.com/gpxto?utm_source=website&utm_medium=tool&utm_campaign=to_csv"
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
          <li>Convert GPX tracks, routes, and waypoints to CSV format</li>
          <li>Choose between different delimiter options (comma, semicolon, tab, pipe)</li>
          <li>Option to include or exclude column headers</li>
          <li>Multiple time format options (ISO, local, Unix timestamp)</li>
          <li>Include elevation data from your GPX file</li>
          <li>Calculate and include speed data based on timestamps</li>
          <li>Preview your route on an interactive map before downloading</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
        </ul>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">About GPX and CSV Files</h2>
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
            <h3 className="text-lg mb-2">What is a CSV file?</h3>
            <p className="text-muted-foreground">
              CSV (Comma-Separated Values) is a simple text format used to store tabular data. Each line in a CSV file
              represents a row of data, and values within each row are separated by a delimiter (typically a comma). CSV
              files can be opened in spreadsheet software like Microsoft Excel or Google Sheets, as well as imported
              into databases and data analysis tools.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Using CSV Files</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>Once you've converted your GPX file to CSV format, you can use it in various ways:</p>
          <ul>
            <li>
              <strong>Data Analysis:</strong> Import into spreadsheet software like Excel or Google Sheets to analyze
              your route data, create charts, or calculate statistics.
            </li>
            <li>
              <strong>Database Import:</strong> Load your GPS data into databases for storage or further processing.
            </li>
            <li>
              <strong>Custom Applications:</strong> Use the CSV data in your own applications or scripts for specialized
              processing.
            </li>
            <li>
              <strong>Data Visualization:</strong> Import into data visualization tools to create custom maps and
              visualizations of your routes.
            </li>
          </ul>
          <p>
            The CSV format's simplicity and universal compatibility make it an excellent choice for working with GPS
            data across different platforms and tools.
          </p>
        </div>
      </section>
    </div>
  )
}
