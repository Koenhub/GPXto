"use client"

import { useEffect } from "react"

export function LeafletCSS() {
  useEffect(() => {
    // Only add the CSS if it's not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""

      document.head.appendChild(link)
    }

    return () => {
      // Clean up when component unmounts
      const link = document.getElementById("leaflet-css")
      if (link) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return null
}
