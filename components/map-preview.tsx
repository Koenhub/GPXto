"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertCircle } from "lucide-react"
import { LeafletCSS } from "./leaflet-css"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MapPreviewProps {
  gpxContent: string | null
}

export function MapPreview({ gpxContent }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const leafletMapRef = useRef<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load Leaflet dynamically on client side
  useEffect(() => {
    if (!isClient) return

    const loadLeaflet = async () => {
      try {
        const L = await import("leaflet")
        setLeaflet(L)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
        setError("Failed to load map. Please refresh the page.")
      }
    }

    loadLeaflet()

    return () => {
      // Clean up the map when component unmounts
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isClient])

  // Initialize map
  useEffect(() => {
    // Only proceed if we're on client side, have leaflet loaded, and the map container exists
    if (!isClient || !leaflet || !mapRef.current) return

    // If we already have a map instance, clean it up first
    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
      leafletMapRef.current = null
    }

    try {
      // Create map
      const map = leaflet
        .map(mapRef.current, {
          // Set a lower z-index for the map container
          zoomControl: true,
          attributionControl: true,
          zoomSnap: 0.5,
        })
        .setView([0, 0], 2)

      // Add tile layer
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map)

      // Store the map instance in the ref
      leafletMapRef.current = map
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Failed to initialize map. Please refresh the page.")
    }

    return () => {
      // Clean up the map when dependencies change
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isClient, leaflet])

  // Controleer of de kaart correct wordt bijgewerkt wanneer gpxContent verandert
  // Voeg een useEffect toe die de kaart opnieuw initialiseert wanneer gpxContent verandert

  // Voeg een console.log toe om te debuggen
  useEffect(() => {
    if (gpxContent) {
      console.log("GPX content updated, length:", gpxContent.length)
    }
  }, [gpxContent])

  // Zorg ervoor dat de kaart correct wordt bijgewerkt wanneer de punten worden gereduceerd
  useEffect(() => {
    // Only proceed if we have the map, gpx content, and leaflet loaded
    if (!leafletMapRef.current || !gpxContent || !leaflet) return

    try {
      const map = leafletMapRef.current
      setError(null)

      // Clear previous layers except the base tile layer
      map.eachLayer((layer: any) => {
        if (!(layer instanceof leaflet.TileLayer)) {
          map.removeLayer(layer)
        }
      })

      // Parse GPX
      const parser = new DOMParser()
      const gpx = parser.parseFromString(gpxContent, "text/xml")

      // Check if it's a valid GPX file
      if (!gpx.querySelector("gpx")) {
        setError("Invalid GPX file. Please check your file and try again.")
        return
      }

      // Extract track points
      const trackPoints = Array.from(gpx.querySelectorAll("trkpt"))

      if (trackPoints.length === 0) {
        // Try waypoints if no track points
        const waypoints = Array.from(gpx.querySelectorAll("wpt"))

        if (waypoints.length === 0) {
          // Try route points if no track points or waypoints
          const routePoints = Array.from(gpx.querySelectorAll("rtept"))

          if (routePoints.length === 0) {
            setError("No track points, waypoints, or route points found in the GPX file.")
            return
          }

          const points = routePoints.map((rtept) => {
            const lat = Number.parseFloat(rtept.getAttribute("lat") || "0")
            const lon = Number.parseFloat(rtept.getAttribute("lon") || "0")
            const name = rtept.querySelector("name")?.textContent || "Route Point"
            return { lat, lon, name }
          })

          // Add markers for route points
          points.forEach((point) => {
            leaflet.marker([point.lat, point.lon]).addTo(map).bindPopup(point.name)
          })

          // Create polyline from route points
          const polylinePoints = points.map((p) => [p.lat, p.lon])
          const polyline = leaflet.polyline(polylinePoints, { color: "blue", weight: 3 })
          polyline.addTo(map)

          // Fit bounds if we have points
          if (points.length > 0) {
            map.fitBounds(polyline.getBounds())
          }

          return
        }

        const points = waypoints.map((wpt) => {
          const lat = Number.parseFloat(wpt.getAttribute("lat") || "0")
          const lon = Number.parseFloat(wpt.getAttribute("lon") || "0")
          const name = wpt.querySelector("name")?.textContent || "Waypoint"
          return { lat, lon, name }
        })

        // Add markers for waypoints
        points.forEach((point) => {
          leaflet.marker([point.lat, point.lon]).addTo(map).bindPopup(point.name)
        })

        // Fit bounds if we have points
        if (points.length > 0) {
          const bounds = points.map((p) => [p.lat, p.lon])
          map.fitBounds(bounds)
        }

        return
      }

      // Create polyline from track points
      const points = trackPoints.map((trkpt) => {
        const lat = Number.parseFloat(trkpt.getAttribute("lat") || "0")
        const lon = Number.parseFloat(trkpt.getAttribute("lon") || "0")
        return [lat, lon]
      })

      // Add polyline to map
      const polyline = leaflet.polyline(points, { color: "blue", weight: 3 })
      polyline.addTo(map)

      // Add start and end markers
      if (points.length > 0) {
        const startIcon = leaflet.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full text-white">S</div>`,
          className: "",
        })

        const endIcon = leaflet.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white">E</div>`,
          className: "",
        })

        leaflet.marker(points[0], { icon: startIcon }).addTo(map)
        leaflet.marker(points[points.length - 1], { icon: endIcon }).addTo(map)
      }

      // Fit map to track bounds
      map.fitBounds(polyline.getBounds())
    } catch (error) {
      console.error("Error parsing GPX:", error)
      setError("Failed to parse GPX file. Please check your file and try again.")
    }
  }, [gpxContent, leaflet])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[350px] md:h-full bg-muted">
        <MapPin className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <>
      <LeafletCSS />
      <div className="relative h-full">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {!gpxContent && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="text-center p-2 sm:p-4">
              <MapPin className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-muted-foreground" />
              <p className="text-xs sm:text-sm text-muted-foreground">Upload a GPX file to see the preview</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="h-full w-full z-0" />
      </div>
    </>
  )
}
