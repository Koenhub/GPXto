"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ChevronDown,
  ChevronUp,
  FileUp,
  Map,
  Layers,
  FileText,
  ImageIcon,
  Table,
  Code,
  Activity,
  GitMerge,
  Scissors,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Logo } from "./logo"

export function NavbarClient() {
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setShowMegaMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="py-3 sm:py-6">
      <nav className="flex items-center justify-between">
        {/* Logo on the left */}
        <Logo />

        {/* Menu on the right */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="relative" ref={megaMenuRef}>
            <button
              className="flex items-center space-x-1 no-underline text-sm sm:text-base"
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              aria-expanded={showMegaMenu}
              aria-haspopup="true"
            >
              <span>Converters</span>
              {showMegaMenu ? (
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>

            {showMegaMenu && (
              <div className="absolute right-0 mt-1 sm:mt-2 w-[280px] sm:w-[600px] bg-background border rounded-md shadow-lg z-50 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2 text-gray-400">Map Formats</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/gpx-to-kml"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Map className="h-4 w-4 text-primary" />
                          <span>GPX to KML</span>
                          <span className="text-xs text-muted-foreground ml-auto">Google Earth</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-kmz"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Layers className="h-4 w-4 text-primary" />
                          <span>GPX to KMZ</span>
                          <span className="text-xs text-muted-foreground ml-auto">Compressed KML</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-geojson"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Code className="h-4 w-4 text-primary" />
                          <span>GPX to GeoJSON</span>
                          <span className="text-xs text-muted-foreground ml-auto">Web mapping</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-google-maps"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Map className="h-4 w-4 text-primary" />
                          <span>GPX to Google Maps</span>
                          <span className="text-xs text-muted-foreground ml-auto">Shareable links</span>
                        </Link>
                      </li>
                    </ul>

                    <h3 className="font-medium text-sm mt-4 mb-2 text-gray-400">Tools</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/gpx-merge"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <GitMerge className="h-4 w-4 text-primary" />
                          <span>GPX Merge</span>
                          <span className="text-xs text-muted-foreground ml-auto">Combine routes</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-split"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Scissors className="h-4 w-4 text-primary" />
                          <span>GPX Split</span>
                          <span className="text-xs text-muted-foreground ml-auto">Divide routes</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2 text-gray-400">Document Formats</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/gpx-to-pdf"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          <span>GPX to PDF</span>
                          <span className="text-xs text-muted-foreground ml-auto">Printable maps</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-jpg"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <ImageIcon className="h-4 w-4 text-primary" />
                          <span>GPX to JPG</span>
                          <span className="text-xs text-muted-foreground ml-auto">Image export</span>
                        </Link>
                      </li>
                    </ul>

                    <h3 className="font-medium text-sm mt-4 mb-2 text-gray-400">Data Formats</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/gpx-to-excel"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Table className="h-4 w-4 text-primary" />
                          <span>GPX to Excel</span>
                          <span className="text-xs text-muted-foreground ml-auto">Spreadsheets</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-csv"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <FileUp className="h-4 w-4 text-primary" />
                          <span>GPX to CSV</span>
                          <span className="text-xs text-muted-foreground ml-auto">Universal format</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gpx-to-fit"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <Activity className="h-4 w-4 text-primary" />
                          <span>GPX to FIT</span>
                          <span className="text-xs text-muted-foreground ml-auto">Fitness devices</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t text-xs text-center text-muted-foreground">
                  All conversions happen in your browser - your data never leaves your computer
                </div>
              </div>
            )}
          </div>

          <a
            href="https://ko-fi.com/gpxto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base hover:text-primary transition-colors no-underline"
          >
            Donate
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
