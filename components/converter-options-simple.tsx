"use client"

import { useEffect } from "react"

interface ConverterOptionsProps {
  type: string
  options: Record<string, any>
  onChange: (key: string, value: any) => void
}

export function ConverterOptions({ type, options, onChange }: ConverterOptionsProps) {
  // Set default values for each converter type
  const getDefaultOptions = () => {
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

  // Initialize options with defaults if not already set
  useEffect(() => {
    if (!type) return

    const defaults = getDefaultOptions()
    const updates: Record<string, any> = {}
    let hasUpdates = false

    Object.entries(defaults).forEach(([key, value]) => {
      if (options[key] === undefined) {
        updates[key] = value
        hasUpdates = true
      }
    })

    // Only update if there are missing options
    if (hasUpdates) {
      // Update all missing options at once
      Object.entries(updates).forEach(([key, value]) => {
        onChange(key, value)
      })
    }
  }, [type, options, onChange])

  // Helper function to safely get option value with default
  const getOptionValue = (key: string, defaultValue: any) => {
    return options[key] !== undefined ? options[key] : defaultValue
  }

  // Check if we have a valid type and options
  if (!type || Object.keys(options).length === 0) {
    return <p>Please select a conversion type to see options.</p>
  }

  // Render options based on converter type
  const renderOptions = () => {
    switch (type) {
      case "kml":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">Appearance</h4>
              <div className="space-y-2">
                <label className="block">Line Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={getOptionValue("lineColor", "#3388ff")}
                    onChange={(e) => onChange("lineColor", e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <input
                    type="text"
                    value={getOptionValue("lineColor", "#3388ff")}
                    onChange={(e) => onChange("lineColor", e.target.value)}
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
                  value={getOptionValue("lineWidth", 4)}
                  onChange={(e) => onChange("lineWidth", Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Thin</span>
                  <span>Medium</span>
                  <span>Thick</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Structure</h4>
              <div className="space-y-2">
                <label className="block">Folder Structure</label>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="folder-flat"
                      name="folderStructure"
                      value="flat"
                      checked={getOptionValue("folderStructure", "flat") === "flat"}
                      onChange={() => onChange("folderStructure", "flat")}
                      className="mr-2"
                    />
                    <label htmlFor="folder-flat">Flat (all elements in one folder)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="folder-hierarchical"
                      name="folderStructure"
                      value="hierarchical"
                      checked={getOptionValue("folderStructure", "flat") === "hierarchical"}
                      onChange={() => onChange("folderStructure", "hierarchical")}
                      className="mr-2"
                    />
                    <label htmlFor="folder-hierarchical">Hierarchical (organized by type)</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Content</h4>
              <div className="space-y-2">
                <label className="block">Include Elements</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-waypoints"
                      checked={getOptionValue("includeWaypoints", true)}
                      onChange={(e) => onChange("includeWaypoints", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-waypoints">Waypoints</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-tracks"
                      checked={getOptionValue("includeTracks", true)}
                      onChange={(e) => onChange("includeTracks", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-tracks">Tracks</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-routes"
                      checked={getOptionValue("includeRoutes", true)}
                      onChange={(e) => onChange("includeRoutes", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-routes">Routes</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "pdf":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">Page Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pdf-page-size" className="block">
                    Page Size
                  </label>
                  <select
                    id="pdf-page-size"
                    value={getOptionValue("pageSize", "a4")}
                    onChange={(e) => onChange("pageSize", e.target.value)}
                    className="w-full p-2 border"
                  >
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="pdf-orientation" className="block">
                    Orientation
                  </label>
                  <select
                    id="pdf-orientation"
                    value={getOptionValue("orientation", "portrait")}
                    onChange={(e) => onChange("orientation", e.target.value)}
                    className="w-full p-2 border"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Map Style</h4>
              <div className="space-y-2">
                <label htmlFor="pdf-map-style" className="block">
                  Map Style
                </label>
                <select
                  id="pdf-map-style"
                  value={getOptionValue("mapStyle", "streets")}
                  onChange={(e) => onChange("mapStyle", e.target.value)}
                  className="w-full p-2 border"
                >
                  <option value="streets">Streets</option>
                  <option value="outdoors">Outdoors</option>
                  <option value="satellite">Satellite</option>
                  <option value="topo">Topographic</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Content</h4>
              <div className="space-y-2">
                <label className="block">Include in PDF</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-elevation-profile"
                      checked={getOptionValue("includeElevationProfile", true)}
                      onChange={(e) => onChange("includeElevationProfile", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-elevation-profile">Elevation Profile</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-statistics"
                      checked={getOptionValue("includeStatistics", true)}
                      onChange={(e) => onChange("includeStatistics", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-statistics">Statistics</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "kmz":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">Compression</h4>
              <div className="space-y-2">
                <label htmlFor="kmz-compression">Compression Level</label>
                <div className="pt-2">
                  <input
                    type="range"
                    id="kmz-compression"
                    min={1}
                    max={9}
                    step={1}
                    value={getOptionValue("compressionLevel", 9)}
                    onChange={(e) => onChange("compressionLevel", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Low (Faster)</span>
                    <span>Medium</span>
                    <span>High (Smaller)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Appearance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="kmz-line-color">Line Color</label>
                  <div className="flex gap-2">
                    <input
                      id="kmz-line-color"
                      type="color"
                      value={getOptionValue("lineColor", "#3388ff")}
                      onChange={(e) => onChange("lineColor", e.target.value)}
                      className="w-12 h-8 p-1"
                    />
                    <input
                      value={getOptionValue("lineColor", "#3388ff")}
                      onChange={(e) => onChange("lineColor", e.target.value)}
                      className="flex-1 p-2 border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="kmz-line-width">Line Width</label>
                  <div className="pt-2">
                    <input
                      type="range"
                      id="kmz-line-width"
                      min={1}
                      max={10}
                      step={1}
                      value={getOptionValue("lineWidth", 4)}
                      onChange={(e) => onChange("lineWidth", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Content</h4>
              <div className="space-y-2">
                <label>Include in KMZ</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="kmz-include-images"
                      checked={getOptionValue("includeImages", true)}
                      onChange={(e) => onChange("includeImages", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="kmz-include-images">Images</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="kmz-include-styles"
                      checked={getOptionValue("includeStyles", true)}
                      onChange={(e) => onChange("includeStyles", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="kmz-include-styles">Custom Styles</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      // Add other format options here...
      case "fit":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">Activity Settings</h4>
              <div className="space-y-2">
                <label htmlFor="fit-activity-type" className="block">
                  Activity Type
                </label>
                <select
                  id="fit-activity-type"
                  value={getOptionValue("activityType", "cycling")}
                  onChange={(e) => onChange("activityType", e.target.value)}
                  className="w-full p-2 border"
                >
                  <option value="cycling">Cycling</option>
                  <option value="running">Running</option>
                  <option value="hiking">Hiking</option>
                  <option value="walking">Walking</option>
                  <option value="swimming">Swimming</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Device Settings</h4>
              <div className="space-y-2">
                <label htmlFor="fit-device-type" className="block">
                  Target Device
                </label>
                <select
                  id="fit-device-type"
                  value={getOptionValue("deviceType", "edge")}
                  onChange={(e) => onChange("deviceType", e.target.value)}
                  className="w-full p-2 border"
                >
                  <option value="edge">Garmin Edge (Cycling)</option>
                  <option value="forerunner">Garmin Forerunner (Running)</option>
                  <option value="fenix">Garmin Fenix (Multisport)</option>
                  <option value="other">Other Garmin Device</option>
                  <option value="wahoo">Wahoo</option>
                  <option value="generic">Generic FIT Device</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Data Options</h4>
              <div className="space-y-2">
                <label className="block">Include Data</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fit-include-elevation"
                      checked={getOptionValue("includeElevation", true)}
                      onChange={(e) => onChange("includeElevation", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="fit-include-elevation">Elevation Data</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fit-include-timestamps"
                      checked={getOptionValue("includeTimestamps", true)}
                      onChange={(e) => onChange("includeTimestamps", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="fit-include-timestamps">Timestamps</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Sport Type</h4>
              <div className="space-y-2">
                <label htmlFor="fit-sport-type" className="block">
                  Sport Type
                </label>
                <select
                  id="fit-sport-type"
                  value={getOptionValue("sportType", "cycling")}
                  onChange={(e) => onChange("sportType", e.target.value)}
                  className="w-full p-2 border"
                >
                  <option value="cycling">Cycling</option>
                  <option value="mountain_biking">Mountain Biking</option>
                  <option value="running">Running</option>
                  <option value="trail_running">Trail Running</option>
                  <option value="hiking">Hiking</option>
                  <option value="walking">Walking</option>
                  <option value="swimming">Swimming</option>
                  <option value="generic">Generic</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Data Fields</h4>
              <div className="space-y-2">
                <label className="block">Data Field Complexity</label>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="data-fields-basic"
                      name="dataFields"
                      value="basic"
                      checked={getOptionValue("dataFields", "basic") === "basic"}
                      onChange={() => onChange("dataFields", "basic")}
                      className="mr-2"
                    />
                    <label htmlFor="data-fields-basic">Basic (coordinates, elevation, time)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="data-fields-extended"
                      name="dataFields"
                      value="extended"
                      checked={getOptionValue("dataFields", "basic") === "extended"}
                      onChange={() => onChange("dataFields", "extended")}
                      className="mr-2"
                    />
                    <label htmlFor="data-fields-extended">Extended (includes calculated fields)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="data-fields-complete"
                      name="dataFields"
                      value="complete"
                      checked={getOptionValue("dataFields", "basic") === "complete"}
                      onChange={() => onChange("dataFields", "complete")}
                      className="mr-2"
                    />
                    <label htmlFor="data-fields-complete">Complete (all possible fields)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <p>Please select a conversion type to see options.</p>
    }
  }

  return <div className="space-y-4 border p-4">{renderOptions()}</div>
}
