import Link from "next/link"
import { FileUp, Map, FileText, ImageIcon, Table, Code, Activity, GitMerge, Layers, Scissors } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12">
      <section className="py-8 border-t">
        <h2 className="text-xl mb-6">All GPX converters</h2>

        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Map Formats</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/gpx-to-kml" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Map className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to KML</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Convert for Google Earth and Maps visualization
                  </p>
                </li>
                <li>
                  <Link href="/gpx-to-kmz" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Layers className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to KMZ</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Compressed KML with embedded resources</p>
                </li>
                <li>
                  <Link href="/gpx-to-geojson" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Code className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to GeoJSON</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Standard format for web mapping applications
                  </p>
                </li>
                <li>
                  <Link href="/gpx-to-google-maps" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Map className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to Google Maps</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Create shareable Google Maps links</p>
                </li>
              </ul>

              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mt-6">Utility Tools</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/gpx-merge" className="flex items-center gap-2 hover:text-primary no-underline">
                    <GitMerge className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX Merge</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Combine multiple GPX files into one</p>
                </li>
                <li>
                  <Link href="/gpx-split" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Scissors className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX Split</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Divide GPX files into smaller parts</p>
                </li>
                {/* Add more utility tools here in the future */}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Document Formats</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/gpx-to-pdf" className="flex items-center gap-2 hover:text-primary no-underline">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to PDF</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Create printable maps and route documentation
                  </p>
                </li>
                <li>
                  <Link href="/gpx-to-jpg" className="flex items-center gap-2 hover:text-primary no-underline">
                    <ImageIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to JPG</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Generate image visualizations of your routes
                  </p>
                </li>
              </ul>

              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mt-6">
                Data & Device Formats
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/gpx-to-excel" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Table className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to Excel</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Analyze GPS data in spreadsheets</p>
                </li>
                <li>
                  <Link href="/gpx-to-csv" className="flex items-center gap-2 hover:text-primary no-underline">
                    <FileUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to CSV</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Universal format for data analysis</p>
                </li>
                <li>
                  <Link href="/gpx-to-fit" className="flex items-center gap-2 hover:text-primary no-underline">
                    <Activity className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>GPX to FIT</span>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">Convert for Garmin and fitness devices</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 border-t">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
          <Link
            href="https://ko-fi.com/gpxto/4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            Donate
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          © {new Date().getFullYear()} GPXto • All processing happens in your browser - your data never leaves your
          computer
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Google Maps™ is a registered trademark of Google LLC. We are not affiliated with, endorsed by, or associated
          with Google LLC.
        </p>
      </div>
    </footer>
  )
}
