"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, FileUp, AlertCircle, Download, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { MapPreview } from "@/components/map-preview"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ConverterOptions } from "./converter-options"

const CONVERSION_TYPES = [
  { value: "kml", label: "GPX to KML" },
  { value: "pdf", label: "GPX to PDF" },
  { value: "excel", label: "GPX to Excel" },
  { value: "kmz", label: "GPX to KMZ" },
  { value: "jpg", label: "GPX to JPG" },
  { value: "csv", label: "GPX to CSV" },
  { value: "geojson", label: "GPX to GeoJSON" },
]

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [gpxContent, setGpxContent] = useState<string | null>(null)
  const [conversionType, setConversionType] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [hasDonated, setHasDonated] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [converterOptions, setConverterOptions] = useState<Record<string, any>>({})

  // Reset converter options when conversion type changes
  useEffect(() => {
    if (conversionType) {
      setConverterOptions({})
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]

      if (!droppedFile.name.toLowerCase().endsWith(".gpx")) {
        setError("Please upload a GPX file")
        return
      }

      setFile(droppedFile)
      setError(null)

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
      reader.readAsText(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!file || !conversionType) {
        setError("Please select a file and conversion type")
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
    setProgress(0)
    setError(null)
    setConvertedFile(null)
    setCurrentStep(3)

    try {
      // Simulate conversion process
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 300)

      // Simulate API call
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setIsConverting(false)

        // In a real app, this would be a response from the API
        const timestamp = Date.now()
        const filename = `converted-${timestamp}.${conversionType}`
        setConvertedFile(filename)
      }, 3000)
    } catch (err) {
      setIsConverting(false)
      setError("Conversion failed. Please try again.")
      setCurrentStep(2)
    }
  }

  const handleDownload = () => {
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

      // Show success toast
      setTimeout(() => {
        toast({
          title: "Thank you for using GPXto!",
          description: "Your file has been downloaded.",
        })
      }, 500)
    }
  }

  const handleDonate = (amount: string) => {
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

      // Show success toast
      setTimeout(() => {
        toast({
          title: "Thank you for your support!",
          description: "Your file has been downloaded.",
        })
      }, 500)
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
    setProgress(0)
  }

  const handleOptionChange = (key: string, value: any) => {
    setConverterOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      <Card className="border">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl mb-4 sm:mb-6">Convert GPX file</h2>
            <div className="flex items-center justify-between w-full mb-3">
              {[
                { id: 1, name: "Upload" },
                { id: 2, name: "Configure" },
                { id: 3, name: "Convert" },
              ].map((step, index, steps) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-[50%] w-[calc(100%+1rem)] h-px top-2 -z-10 transition-colors duration-300 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}

                  {/* Step circle */}
                  <div
                    className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-1 transition-all duration-300 ${
                      currentStep === step.id
                        ? "border border-primary text-primary text-[8px] sm:text-xs"
                        : currentStep > step.id
                          ? "bg-primary text-primary-foreground text-[8px] sm:text-xs"
                          : "bg-muted text-muted-foreground text-[8px] sm:text-xs"
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Step name */}
                  <span
                    className={`text-[8px] sm:text-[10px] transition-colors duration-300 ${
                      currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Conversion Type</label>
                <Select value={conversionType} onValueChange={setConversionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversion type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONVERSION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-primary/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <FileUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Drag & drop your GPX file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse files</p>
                    <input type="file" id="file-upload" className="hidden" accept=".gpx" onChange={handleFileChange} />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>

              <Button className="w-full" disabled={!file || !conversionType} onClick={handleNextStep}>
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-medium">Configure {conversionType.toUpperCase()} Options</h3>
                </div>

                <ConverterOptions type={conversionType} options={converterOptions} onChange={handleOptionChange} />

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNextStep}>
                    Convert <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {isConverting ? (
                <div className="space-y-4">
                  <p className="text-sm">Converting your file...</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Applying your custom settings to the conversion...</p>
                </div>
              ) : convertedFile ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Conversion Complete!</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">
                        Success
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
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
                            href="https://ko-fi.com/gpxto/2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                            onClick={() => handleDonate("2")}
                          >
                            <Button className="w-full">Donate €2 & Download</Button>
                          </a>
                          <a
                            href="https://ko-fi.com/gpxto/5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                            onClick={() => handleDonate("5")}
                          >
                            <Button variant="outline" className="w-full">
                              Donate €5 & Download
                            </Button>
                          </a>
                          <Button variant="ghost" className="w-full text-sm" onClick={handleDownload}>
                            Download without donating
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button onClick={handleDownload} className="w-full mb-2 flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Again
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mb-2">Thank you for your support!</p>
                        <Button variant="outline" className="w-full" onClick={handleReset}>
                          Start Over
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-0 overflow-hidden rounded-lg h-[350px] md:h-full">
          <MapPreview gpxContent={gpxContent} />
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}
