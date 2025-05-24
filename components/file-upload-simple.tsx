"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPreview } from "./map-preview"
import { ConverterOptions } from "./converter-options-simple"

// Importeer de analytics utility bovenaan het bestand
import { trackEvent, ANALYTICS_EVENTS } from "@/utils/analytics"

// Update the CONVERSION_TYPES array to include the Google Maps option
const CONVERSION_TYPES = [
  { value: "kml", label: "GPX to KML" },
  { value: "pdf", label: "GPX to PDF" },
  { value: "excel", label: "GPX to Excel" },
  { value: "kmz", label: "GPX to KMZ" },
  { value: "jpg", label: "GPX to JPG" },
  { value: "csv", label: "GPX to CSV" },
  { value: "geojson", label: "GPX to GeoJSON" },
  { value: "fit", label: "GPX to FIT" },
  { value: "google-maps", label: "GPX to Google Maps" },
]

// Add FIT to the getDefaultOptions function
const getDefaultOptions = (type: string) => {
  switch (type) {
    case "kml":
      return {
        includeWaypoints: true,
        includeTracks: true,
        includeRoutes: true,
        folderStructure: "flat",
        lineColor: "#3388ff",
        lineWidth: 4,
      }
    case "pdf":
      return {
        pageSize: "a4",
        orientation: "portrait",
        includeElevationProfile: true,
        includeStatistics: true,
        mapStyle: "streets",
      }
    case "excel":
      return {
        includeHeaders: true,
        timeFormat: "iso",
        splitSheets: false,
        includeElevation: true,
        includeSpeed: false,
      }
    case "kmz":
      return {
        compressionLevel: 9,
        includeImages: true,
        includeStyles: true,
        lineColor: "#3388ff",
        lineWidth: 4,
      }
    case "jpg":
      return {
        width: 1200,
        height: 800,
        quality: 90,
        mapStyle: "streets",
        showMarkers: true,
        showLabels: true,
      }
    case "csv":
      return {
        delimiter: "comma",
        includeHeaders: true,
        timeFormat: "iso",
        includeElevation: true,
        includeSpeed: false,
      }
    case "geojson":
      return {
        simplify: true,
        simplifyTolerance: 0.00001,
        includeProperties: true,
        includeElevation: true,
        includeTime: true,
      }
    case "fit":
      return {
        activityType: "cycling",
        includeElevation: true,
        includeTimestamps: true,
        dataFields: "basic",
        deviceType: "edge",
        sportType: "cycling",
      }
    default:
      return {}
  }
}

// Update the component props to include initialConversionType and isComingSoon
interface FileUploadSimpleProps {
  initialConversionType?: string
  isComingSoon?: boolean
}

export function FileUploadSimple({ initialConversionType = "", isComingSoon = false }: FileUploadSimpleProps) {
  const [file, setFile] = useState<File | null>(null)
  const [gpxContent, setGpxContent] = useState<string | null>(null)
  const [conversionType, setConversionType] = useState<string>(initialConversionType)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [converterOptions, setConverterOptions] = useState<Record<string, any>>({})
  const [hasDonated, setHasDonated] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)

  const router = useRouter()

  // Check for stored file data when component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Only try to load stored file if we're on a specific conversion page
    if (initialConversionType) {
      const storedGpxContent = sessionStorage.getItem("gpxContent")
      const storedFileName = sessionStorage.getItem("gpxFileName")
      const storedFileSize = sessionStorage.getItem("gpxFileSize")

      if (storedGpxContent && storedFileName && storedFileSize) {
        setGpxContent(storedGpxContent)
        setFileName(storedFileName)
        setFileSize(Number.parseInt(storedFileSize, 10))

        // Create a File object from the stored content
        const blob = new Blob([storedGpxContent], { type: "application/gpx+xml" })
        const fileFromStorage = new File([blob], storedFileName, {
          type: "application/gpx+xml",
          lastModified: new Date().getTime(),
        })
        setFile(fileFromStorage)

        // Set default options for this conversion type
        setConverterOptions(getDefaultOptions(initialConversionType))

        // Automatically advance to the Configure step
        setCurrentStep(2)
      }
    }
  }, [initialConversionType])

  // Update options when conversion type changes or when initialConversionType is provided
  useEffect(() => {
    if (conversionType) {
      setConverterOptions(getDefaultOptions(conversionType))
    }
  }, [conversionType])

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
    setFileName(selectedFile.name)
    setFileSize(selectedFile.size)

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
        setFileName("")
        setFileSize(0)
      }
    }
    reader.onerror = () => {
      setError("Failed to read the GPX file. Please try another file.")
      setFile(null)
      setGpxContent(null)
      setFileName("")
      setFileSize(0)
    }
    reader.readAsText(selectedFile)
  }

  const handleConversionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value
    setConversionType(newType)

    // Immediately set default options for the selected type
    if (newType) {
      setConverterOptions(getDefaultOptions(newType))
    } else {
      setConverterOptions({})
    }
  }

  // Wijzig de handleNextStep functie om events te versturen wanneer gebruikers naar stap 2 gaan
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!file || !conversionType) {
        setError("Please select a file and conversion type")
        return
      }

      // Track when user reaches step 2 (Configure)
      if (currentStep === 1) {
        trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
          step: 2,
          conversion_type: conversionType,
          file_size: fileSize || file?.size || 0,
        })
      }

      // Always store file data in sessionStorage when moving to next step
      if (gpxContent) {
        sessionStorage.setItem("gpxContent", gpxContent)
        sessionStorage.setItem("gpxFileName", fileName || file?.name || "file.gpx")
        sessionStorage.setItem("gpxFileSize", (fileSize || file?.size || 0).toString())
      }

      // If we're on the homepage (initialConversionType is empty), navigate to the specific page
      if (!initialConversionType) {
        if (conversionType === "google-maps") {
          router.push(`/gpx-to-google-maps`)
        } else {
          router.push(`/gpx-to-${conversionType}`)
        }
        return
      }

      // Otherwise, continue with the normal flow for specific conversion pages
      // Ensure options are set before moving to step 2
      if (Object.keys(converterOptions).length === 0) {
        setConverterOptions(getDefaultOptions(conversionType))
      }

      setError(null)
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // If this is a "coming soon" feature, don't proceed to conversion
      if (isComingSoon) {
        return
      }

      handleConvert()
    } else if (currentStep === 3 && convertedFile) {
      // If conversion is complete, move to download step
      setCurrentStep(4)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      // Make sure we don't lose the file when going back
      if (currentStep === 2 && !file && gpxContent) {
        // Try to restore file from sessionStorage if we lost it
        const storedFileName = sessionStorage.getItem("gpxFileName")
        const storedFileSize = sessionStorage.getItem("gpxFileSize")

        if (storedFileName && storedFileSize) {
          // Create a File object from the stored content
          const blob = new Blob([gpxContent], { type: "application/gpx+xml" })
          const fileFromStorage = new File([blob], storedFileName, {
            type: "application/gpx+xml",
            lastModified: new Date().getTime(),
          })
          setFile(fileFromStorage)
          setFileName(storedFileName)
          setFileSize(Number.parseInt(storedFileSize, 10))
        }
      }

      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  // Voeg tracking toe aan handleConvert om conversies te meten
  const handleConvert = async () => {
    // Don't allow conversion if this is a "coming soon" feature
    if (isComingSoon) {
      return
    }

    setIsConverting(true)
    setError(null)
    setConvertedFile(null)
    setCurrentStep(3)

    // Track when conversion starts
    trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
      step: 3,
      conversion_type: conversionType,
      file_size: fileSize || file?.size || 0,
    })

    try {
      // Simulate conversion process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful conversion
      const timestamp = Date.now()
      const originalName = fileName.replace(/\.gpx$/i, "") || file?.name.replace(/\.gpx$/i, "") || "file"
      const filename = `${originalName}-${conversionType}-${timestamp}.${conversionType}`
      setConvertedFile(filename)
      setIsConverting(false)

      // Automatically move to Download step after conversion is complete
      setCurrentStep(4)

      // Track when user reaches step 4 (Download)
      trackEvent(ANALYTICS_EVENTS.STEP_REACHED, {
        step: 4,
        conversion_type: conversionType,
        file_size: fileSize || file?.size || 0,
        success: true,
      })
      // Track when conversion completes successfully
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        conversion_type: conversionType,
        success: true,
        file_size: fileSize || file?.size || 0,
      })
    } catch (err) {
      setIsConverting(false)
      setError("Conversion failed. Please try again.")
      setCurrentStep(2)

      // Track when conversion fails
      trackEvent(ANALYTICS_EVENTS.CONVERSION_COMPLETED, {
        conversion_type: conversionType,
        success: false,
        error: "Conversion failed",
        file_size: fileSize || file?.size || 0,
      })
    }
  }

  // Wijzig de handleDownload functie om te tracken welke downloadknop wordt gebruikt
  const handleDownload = () => {
    // Track the download without donation
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      conversion_type: conversionType,
      donation: false,
      file_size: fileSize || file?.size || 0,
    })

    // Perform the actual download
    if (convertedFile) {
      // Create a download link for the file
      const downloadUrl = `/api/download/${convertedFile}`
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", convertedFile)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Wijzig de handleDonate functie om te tracken welke donatieknop wordt gebruikt
  const handleDonate = (amount: string) => {
    // Track the donation download
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_CLICKED, {
      conversion_type: conversionType,
      donation: true,
      donation_amount: amount,
      file_size: fileSize || file?.size || 0,
    })

    setHasDonated(true)

    // Perform the download after donation
    if (convertedFile) {
      const downloadUrl = `/api/download/${convertedFile}`
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", convertedFile)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleReset = () => {
    setFile(null)
    setGpxContent(null)
    setConversionType("")
    setConvertedFile(null)
    setError(null)
    setHasDonated(false)
    setCurrentStep(1)
    setConverterOptions({})
    setFileName("")
    setFileSize(0)

    // Clear stored file data
    sessionStorage.removeItem("gpxContent")
    sessionStorage.removeItem("gpxFileName")
    sessionStorage.removeItem("gpxFileSize")
  }

  const handleOptionChange = (key: string, value: any) => {
    setConverterOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
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
                    } else if (step.id === 3 && !isComingSoon) {
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
                // Disable if trying to go to Convert from a "coming soon" feature
                (step.id === 3 && isComingSoon && currentStep === 2) ||
                // Disable if trying to go to Configure without a file
                (step.id === 2 && currentStep === 1 && !file)
              }
              className={`inline-block px-1 sm:px-2 py-1 text-xs sm:text-sm ${
                currentStep === step.id
                  ? "border-b-2 border-black dark:border-white font-medium dark:text-white"
                  : (
                        // Make specific steps clickable based on current step
                        (currentStep === 2 && (step.id === 1 || (step.id === 3 && !isComingSoon))) ||
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

      {/* Step 1: Upload and select conversion type */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block mb-2">
              Upload GPX file:
            </label>
            <input type="file" id="file-upload" accept=".gpx" onChange={handleFileChange} className="w-full" />
            {(file || (fileName && fileSize > 0)) && (
              <p className="mt-2">
                Selected: {fileName || file?.name} ({((fileSize || file?.size || 0) / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {(file || gpxContent) && (
            <div>
              <label htmlFor="conversion-type" className="block mb-2">
                Convert to:
              </label>
              <select
                id="conversion-type"
                value={conversionType}
                onChange={handleConversionTypeChange}
                className="w-full p-2 border"
              >
                <option value="">Select format...</option>
                {CONVERSION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <button
              onClick={handleNextStep}
              disabled={!file || !conversionType}
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
            <h3 className="text-lg">Configure {conversionType.toUpperCase()} Options</h3>
            {file && (
              <div className="text-sm text-gray-600">
                File: {fileName || file.name} ({((fileSize || file.size) / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          {conversionType && Object.keys(converterOptions).length > 0 ? (
            <ConverterOptions type={conversionType} options={converterOptions} onChange={handleOptionChange} />
          ) : (
            <div className="p-4 border">
              <p>Loading options...</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button onClick={handlePreviousStep} className="px-4 py-2 border hover:bg-gray-100">
              Back to upload
            </button>
            <button
              onClick={handleNextStep}
              className={`px-4 py-2 ${isComingSoon ? "bg-yellow-500" : "bg-black"} text-white`}
              disabled={isComingSoon}
            >
              {isComingSoon ? "Coming Soon" : "Convert Now"}
            </button>
          </div>
          {isComingSoon && (
            <p className="text-sm text-yellow-600 mt-2">
              This feature is currently in development and will be available soon.
            </p>
          )}
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
            <h3 className="font-medium mb-4">Conversion complete!</h3>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Your file has been successfully converted with the following options:
              </p>
              <ul className="text-sm space-y-1 ml-5 list-disc">
                {Object.entries(converterOptions).map(([key, value]) => (
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
                  Download again
                </button>
                <p className="text-xs text-center text-gray-600 mb-2">Thank you for your support!</p>
                <button onClick={handleReset} className="w-full px-4 py-2 border">
                  Convert another file
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
          <h2>Map preview</h2>
          <div className="h-[250px] sm:h-[350px] border">
            <MapPreview gpxContent={gpxContent} />
          </div>
        </div>
      )}
    </div>
  )
}
