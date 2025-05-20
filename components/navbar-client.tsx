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
  Heart,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Logo } from "./logo"

export function NavbarClient() {
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [menuReady, setMenuReady] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const converterButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 })

  // Calculate menu position before showing
  const toggleMegaMenu = () => {
    if (!showMegaMenu) {
      // Calculate position before showing the menu
      if (converterButtonRef.current && headerRef.current) {
        const buttonRect = converterButtonRef.current.getBoundingClientRect()
        const headerRect = headerRef.current.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const menuWidth = windowWidth < 640 ? 280 : 600

        // Get the container bounds
        const containerLeft = headerRect.left
        const containerRight = headerRect.right
        const containerWidth = headerRect.width

        // Calculate left position based on button
        let leftPos = buttonRect.left

        // Check if menu would go off-screen to the right
        if (leftPos + menuWidth > containerRight) {
          // Adjust to keep menu within container
          leftPos = Math.max(containerLeft, containerRight - menuWidth)
        }

        // Check if menu would go off-screen to the left
        if (leftPos < containerLeft) {
          leftPos = containerLeft
        }

        // If menu is wider than container, center it
        if (menuWidth > containerWidth) {
          leftPos = containerLeft + (containerWidth - menuWidth) / 2
        }

        setMenuPosition({
          left: leftPos,
          top: buttonRect.bottom + 5,
        })
      }

      // First set positions, then show menu
      setShowMegaMenu(true)
      // Use requestAnimationFrame to ensure position is set before showing
      requestAnimationFrame(() => {
        setMenuReady(true)
      })
    } else {
      // Hide menu first, then reset ready state
      setMenuReady(false)
      setTimeout(() => {
        setShowMegaMenu(false)
      }, 200) // Match transition duration
    }
  }

  // Recalculate on resize
  useEffect(() => {
    function handleResize() {
      if (showMegaMenu && converterButtonRef.current && headerRef.current) {
        const buttonRect = converterButtonRef.current.getBoundingClientRect()
        const headerRect = headerRef.current.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const menuWidth = windowWidth < 640 ? 280 : 600

        // Get the container bounds
        const containerLeft = headerRect.left
        const containerRight = headerRect.right
        const containerWidth = headerRect.width

        // Calculate left position based on button
        let leftPos = buttonRect.left

        // Check if menu would go off-screen to the right
        if (leftPos + menuWidth > containerRight) {
          // Adjust to keep menu within container
          leftPos = Math.max(containerLeft, containerRight - menuWidth)
        }

        // Check if menu would go off-screen to the left
        if (leftPos < containerLeft) {
          leftPos = containerLeft
        }

        // If menu is wider than container, center it
        if (menuWidth > containerWidth) {
          leftPos = containerLeft + (containerWidth - menuWidth) / 2
        }

        setMenuPosition({
          left: leftPos,
          top: buttonRect.bottom + 5,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [showMegaMenu])

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        if (showMegaMenu) {
          setMenuReady(false)
          setTimeout(() => {
            setShowMegaMenu(false)
          }, 200) // Match transition duration
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMegaMenu])

  // Handle scroll position changes
  useEffect(() => {
    function handleScroll() {
      if (showMegaMenu && converterButtonRef.current) {
        const buttonRect = converterButtonRef.current.getBoundingClientRect()
        setMenuPosition((prev) => ({
          ...prev,
          top: buttonRect.bottom + 5,
        }))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [showMegaMenu])

  return (
    <header className="py-3 sm:py-6" ref={headerRef}>
      <nav className="flex items-center justify-between">
        {/* Logo on the left */}
        <Logo />

        {/* Menu on the right */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="relative" ref={megaMenuRef}>
            <button
              ref={converterButtonRef}
              className="flex items-center space-x-1 no-underline text-sm sm:text-base"
              onClick={toggleMegaMenu}
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
              <div
                className={`fixed w-[280px] sm:w-[600px] bg-background border rounded-md shadow-lg z-50 p-4 transition-opacity duration-200 ${
                  menuReady ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                style={{
                  left: `${menuPosition.left}px`,
                  top: `${menuPosition.top}px`,
                  maxWidth: "calc(100vw - 32px)", // Ensure it doesn't overflow viewport
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2 text-gray-400">Map Formats</h3>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/gpx-to-kml"
                          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted no-underline text-sm"
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
                          onClick={() => {
                            setMenuReady(false)
                            setTimeout(() => {
                              setShowMegaMenu(false)
                            }, 200)
                          }}
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
            className="text-sm sm:text-base hover:text-primary transition-colors no-underline flex items-center gap-1"
          >
            Donate
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
