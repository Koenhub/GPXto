"use client"

import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

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

  // Render options based on converter type
  const renderOptions = () => {
    switch (type) {
      case "kml":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Appearance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kml-line-color">Line Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="kml-line-color"
                        type="color"
                        value={options.lineColor || "#3388ff"}
                        onChange={(e) => onChange("lineColor", e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={options.lineColor || "#3388ff"}
                        onChange={(e) => onChange("lineColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kml-line-width">Line Width</Label>
                    <div className="pt-2">
                      <Slider
                        id="kml-line-width"
                        min={1}
                        max={10}
                        step={1}
                        value={[options.lineWidth || 4]}
                        onValueChange={(value) => onChange("lineWidth", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Thin</span>
                        <span>Medium</span>
                        <span>Thick</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Structure</h4>
                <div className="space-y-2">
                  <Label>Folder Structure</Label>
                  <RadioGroup
                    value={options.folderStructure || "flat"}
                    onValueChange={(value) => onChange("folderStructure", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flat" id="folder-flat" />
                      <Label htmlFor="folder-flat">Flat (all elements in one folder)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hierarchical" id="folder-hierarchical" />
                      <Label htmlFor="folder-hierarchical">Hierarchical (organized by type)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Content</h4>
                <div className="space-y-2">
                  <Label>Include Elements</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-waypoints"
                        checked={options.includeWaypoints}
                        onCheckedChange={(checked) => onChange("includeWaypoints", checked)}
                      />
                      <Label htmlFor="include-waypoints">Waypoints</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-tracks"
                        checked={options.includeTracks}
                        onCheckedChange={(checked) => onChange("includeTracks", checked)}
                      />
                      <Label htmlFor="include-tracks">Tracks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-routes"
                        checked={options.includeRoutes}
                        onCheckedChange={(checked) => onChange("includeRoutes", checked)}
                      />
                      <Label htmlFor="include-routes">Routes</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "pdf":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Page Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-page-size">Page Size</Label>
                    <Select value={options.pageSize || "a4"} onValueChange={(value) => onChange("pageSize", value)}>
                      <SelectTrigger id="pdf-page-size">
                        <SelectValue placeholder="Select page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdf-orientation">Orientation</Label>
                    <Select
                      value={options.orientation || "portrait"}
                      onValueChange={(value) => onChange("orientation", value)}
                    >
                      <SelectTrigger id="pdf-orientation">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Map Style</h4>
                <div className="space-y-2">
                  <Label htmlFor="pdf-map-style">Map Style</Label>
                  <Select value={options.mapStyle || "streets"} onValueChange={(value) => onChange("mapStyle", value)}>
                    <SelectTrigger id="pdf-map-style">
                      <SelectValue placeholder="Select map style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="streets">Streets</SelectItem>
                      <SelectItem value="outdoors">Outdoors</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="topo">Topographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Content</h4>
                <div className="space-y-2">
                  <Label>Include in PDF</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-elevation-profile"
                        checked={options.includeElevationProfile}
                        onCheckedChange={(checked) => onChange("includeElevationProfile", checked)}
                      />
                      <Label htmlFor="include-elevation-profile">Elevation Profile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-statistics"
                        checked={options.includeStatistics}
                        onCheckedChange={(checked) => onChange("includeStatistics", checked)}
                      />
                      <Label htmlFor="include-statistics">Statistics</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "excel":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Data Options</h4>
                <div className="space-y-2">
                  <Label>Include Data</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excel-include-headers"
                        checked={options.includeHeaders}
                        onCheckedChange={(checked) => onChange("includeHeaders", checked)}
                      />
                      <Label htmlFor="excel-include-headers">Column Headers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excel-include-elevation"
                        checked={options.includeElevation}
                        onCheckedChange={(checked) => onChange("includeElevation", checked)}
                      />
                      <Label htmlFor="excel-include-elevation">Elevation Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excel-include-speed"
                        checked={options.includeSpeed}
                        onCheckedChange={(checked) => onChange("includeSpeed", checked)}
                      />
                      <Label htmlFor="excel-include-speed">Speed Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excel-split-sheets"
                        checked={options.splitSheets}
                        onCheckedChange={(checked) => onChange("splitSheets", checked)}
                      />
                      <Label htmlFor="excel-split-sheets">Split into Sheets</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Time Format</h4>
                <div className="space-y-2">
                  <Label htmlFor="excel-time-format">Time Format</Label>
                  <Select value={options.timeFormat || "iso"} onValueChange={(value) => onChange("timeFormat", value)}>
                    <SelectTrigger id="excel-time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO 8601 (2023-04-25T14:30:00Z)</SelectItem>
                      <SelectItem value="local">Local Format (4/25/2023 2:30 PM)</SelectItem>
                      <SelectItem value="unix">Unix Timestamp (1682434200)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "kmz":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Compression</h4>
                <div className="space-y-2">
                  <Label htmlFor="kmz-compression">Compression Level</Label>
                  <div className="pt-2">
                    <Slider
                      id="kmz-compression"
                      min={1}
                      max={9}
                      step={1}
                      value={[options.compressionLevel || 9]}
                      onValueChange={(value) => onChange("compressionLevel", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low (Faster)</span>
                      <span>Medium</span>
                      <span>High (Smaller)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Appearance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kmz-line-color">Line Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="kmz-line-color"
                        type="color"
                        value={options.lineColor || "#3388ff"}
                        onChange={(e) => onChange("lineColor", e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={options.lineColor || "#3388ff"}
                        onChange={(e) => onChange("lineColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kmz-line-width">Line Width</Label>
                    <div className="pt-2">
                      <Slider
                        id="kmz-line-width"
                        min={1}
                        max={10}
                        step={1}
                        value={[options.lineWidth || 4]}
                        onValueChange={(value) => onChange("lineWidth", value[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Content</h4>
                <div className="space-y-2">
                  <Label>Include in KMZ</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kmz-include-images"
                        checked={options.includeImages}
                        onCheckedChange={(checked) => onChange("includeImages", checked)}
                      />
                      <Label htmlFor="kmz-include-images">Images</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kmz-include-styles"
                        checked={options.includeStyles}
                        onCheckedChange={(checked) => onChange("includeStyles", checked)}
                      />
                      <Label htmlFor="kmz-include-styles">Custom Styles</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "jpg":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Image Size</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jpg-width">Width (px)</Label>
                    <Input
                      id="jpg-width"
                      type="number"
                      min={100}
                      max={4000}
                      value={options.width || 1200}
                      onChange={(e) => onChange("width", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jpg-height">Height (px)</Label>
                    <Input
                      id="jpg-height"
                      type="number"
                      min={100}
                      max={4000}
                      value={options.height || 800}
                      onChange={(e) => onChange("height", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Image Quality</h4>
                <div className="space-y-2">
                  <Label htmlFor="jpg-quality">Image Quality</Label>
                  <div className="pt-2">
                    <Slider
                      id="jpg-quality"
                      min={10}
                      max={100}
                      step={5}
                      value={[options.quality || 90]}
                      onValueChange={(value) => onChange("quality", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Map Style</h4>
                <div className="space-y-2">
                  <Label htmlFor="jpg-map-style">Map Style</Label>
                  <Select value={options.mapStyle || "streets"} onValueChange={(value) => onChange("mapStyle", value)}>
                    <SelectTrigger id="jpg-map-style">
                      <SelectValue placeholder="Select map style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="streets">Streets</SelectItem>
                      <SelectItem value="outdoors">Outdoors</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="topo">Topographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Display Options</h4>
                <div className="space-y-2">
                  <Label>Display Options</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="jpg-show-markers"
                        checked={options.showMarkers}
                        onCheckedChange={(checked) => onChange("showMarkers", checked)}
                      />
                      <Label htmlFor="jpg-show-markers">Show Markers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="jpg-show-labels"
                        checked={options.showLabels}
                        onCheckedChange={(checked) => onChange("showLabels", checked)}
                      />
                      <Label htmlFor="jpg-show-labels">Show Labels</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "csv":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Format Options</h4>
                <div className="space-y-2">
                  <Label htmlFor="csv-delimiter">Delimiter</Label>
                  <Select value={options.delimiter || "comma"} onValueChange={(value) => onChange("delimiter", value)}>
                    <SelectTrigger id="csv-delimiter">
                      <SelectValue placeholder="Select delimiter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">Comma (,)</SelectItem>
                      <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                      <SelectItem value="tab">Tab</SelectItem>
                      <SelectItem value="pipe">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Time Format</h4>
                <div className="space-y-2">
                  <Label htmlFor="csv-time-format">Time Format</Label>
                  <Select value={options.timeFormat || "iso"} onValueChange={(value) => onChange("timeFormat", value)}>
                    <SelectTrigger id="csv-time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO 8601 (2023-04-25T14:30:00Z)</SelectItem>
                      <SelectItem value="local">Local Format (4/25/2023 2:30 PM)</SelectItem>
                      <SelectItem value="unix">Unix Timestamp (1682434200)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Data Options</h4>
                <div className="space-y-2">
                  <Label>Include Data</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="csv-include-headers"
                        checked={options.includeHeaders}
                        onCheckedChange={(checked) => onChange("includeHeaders", checked)}
                      />
                      <Label htmlFor="csv-include-headers">Column Headers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="csv-include-elevation"
                        checked={options.includeElevation}
                        onCheckedChange={(checked) => onChange("includeElevation", checked)}
                      />
                      <Label htmlFor="csv-include-elevation">Elevation Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="csv-include-speed"
                        checked={options.includeSpeed}
                        onCheckedChange={(checked) => onChange("includeSpeed", checked)}
                      />
                      <Label htmlFor="csv-include-speed">Speed Data</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "geojson":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Simplification</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="geojson-simplify">Simplify Geometry</Label>
                    <Switch
                      id="geojson-simplify"
                      checked={options.simplify}
                      onCheckedChange={(checked) => onChange("simplify", checked)}
                    />
                  </div>
                  {options.simplify && (
                    <div className="pt-2">
                      <Label htmlFor="geojson-simplify-tolerance" className="text-xs text-muted-foreground">
                        Simplification Tolerance
                      </Label>
                      <Slider
                        id="geojson-simplify-tolerance"
                        min={0.000001}
                        max={0.0001}
                        step={0.000001}
                        value={[options.simplifyTolerance || 0.00001]}
                        onValueChange={(value) => onChange("simplifyTolerance", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>High Detail</span>
                        <span>Medium</span>
                        <span>Low Detail</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Properties</h4>
                <div className="space-y-2">
                  <Label>Include Properties</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="geojson-include-properties"
                        checked={options.includeProperties}
                        onCheckedChange={(checked) => onChange("includeProperties", checked)}
                      />
                      <Label htmlFor="geojson-include-properties">Include All GPX Properties</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="geojson-include-elevation"
                        checked={options.includeElevation}
                        onCheckedChange={(checked) => onChange("includeElevation", checked)}
                      />
                      <Label htmlFor="geojson-include-elevation">Include Elevation Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="geojson-include-time"
                        checked={options.includeTime}
                        onCheckedChange={(checked) => onChange("includeTime", checked)}
                      />
                      <Label htmlFor="geojson-include-time">Include Time Data</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "fit":
        return (
          <div className="space-y-2 sm:space-y-4">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Activity Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="fit-activity-type">Activity Type</Label>
                  <Select
                    value={options.activityType || "cycling"}
                    onValueChange={(value) => onChange("activityType", value)}
                  >
                    <SelectTrigger id="fit-activity-type">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Device Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="fit-device-type">Target Device</Label>
                  <Select value={options.deviceType || "edge"} onValueChange={(value) => onChange("deviceType", value)}>
                    <SelectTrigger id="fit-device-type">
                      <SelectValue placeholder="Select target device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edge">Garmin Edge (Cycling)</SelectItem>
                      <SelectItem value="forerunner">Garmin Forerunner (Running)</SelectItem>
                      <SelectItem value="fenix">Garmin Fenix (Multisport)</SelectItem>
                      <SelectItem value="other">Other Garmin Device</SelectItem>
                      <SelectItem value="wahoo">Wahoo</SelectItem>
                      <SelectItem value="generic">Generic FIT Device</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Data Options</h4>
                <div className="space-y-2">
                  <Label>Include Data</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fit-include-elevation"
                        checked={options.includeElevation}
                        onCheckedChange={(checked) => onChange("includeElevation", checked)}
                      />
                      <Label htmlFor="fit-include-elevation">Elevation Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fit-include-timestamps"
                        checked={options.includeTimestamps}
                        onCheckedChange={(checked) => onChange("includeTimestamps", checked)}
                      />
                      <Label htmlFor="fit-include-timestamps">Timestamps</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Sport Type</h4>
                <div className="space-y-2">
                  <Label htmlFor="fit-sport-type">Sport Type</Label>
                  <Select
                    value={options.sportType || "cycling"}
                    onValueChange={(value) => onChange("sportType", value)}
                  >
                    <SelectTrigger id="fit-sport-type">
                      <SelectValue placeholder="Select sport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="mountain_biking">Mountain Biking</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="trail_running">Trail Running</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="generic">Generic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Data Fields</h4>
                <div className="space-y-2">
                  <Label htmlFor="fit-data-fields">Data Field Complexity</Label>
                  <RadioGroup
                    value={options.dataFields || "basic"}
                    onValueChange={(value) => onChange("dataFields", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="basic" id="data-fields-basic" />
                      <Label htmlFor="data-fields-basic">Basic (coordinates, elevation, time)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extended" id="data-fields-extended" />
                      <Label htmlFor="data-fields-extended">
                        Extended (includes calculated fields like speed, distance)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complete" id="data-fields-complete" />
                      <Label htmlFor="data-fields-complete">Complete (all possible fields)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <p>Please select a conversion type to see options.</p>
    }
  }

  return <div className="space-y-2 sm:space-y-4">{renderOptions()}</div>
}
