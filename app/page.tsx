import { FileUploadSimple } from "@/components/file-upload-simple"
import { Hero } from "@/components/hero"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="py-6">
        <FileUploadSimple />
      </section>

      <section className="py-6 mt-12 border-t">
        <h2>Our GPX conversion tools</h2>

        <div className="space-y-8 mt-6">
          <div>
            <h3 className="text-lg font-medium">GPX to KML</h3>
            <p>
              Convert GPX to KML (Keyhole Markup Language) for use with Google Earth and other Google mapping products.
              KML files allow you to display your GPS tracks, routes, and waypoints on Google Maps and Earth.
            </p>
            <Link href="/gpx-to-kml" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to KML now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to PDF</h3>
            <p>
              Convert GPX to PDF to create printable maps and route documentation. Perfect for sharing routes with
              others who don't have GPS devices or for creating physical backups of your routes.
            </p>
            <Link href="/gpx-to-pdf" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to PDF now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to Excel</h3>
            <p>
              Convert GPX to Excel (XLSX) format for data analysis and manipulation. This allows you to work with your
              GPS data in spreadsheet software for custom calculations and visualization.
            </p>
            <Link href="/gpx-to-excel" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to Excel now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to KMZ</h3>
            <p>
              Convert GPX to KMZ (compressed KML) for more efficient sharing and storage. KMZ files are essentially
              zipped KML files that can include additional resources like images.
            </p>
            <Link href="/gpx-to-kmz" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to KMZ now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to JPG</h3>
            <p>
              Convert GPX to JPG to create image visualizations of your routes. This is perfect for sharing on social
              media or including in presentations and documents.
            </p>
            <Link href="/gpx-to-jpg" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to JPG now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to CSV</h3>
            <p>
              Convert GPX to CSV (Comma-Separated Values) for maximum compatibility with various software. CSV is a
              simple text format that can be opened in almost any data processing tool.
            </p>
            <Link href="/gpx-to-csv" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to CSV now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX to GeoJSON</h3>
            <p>
              Convert GPX to GeoJSON for web mapping applications. GeoJSON is a standard format for representing
              geographical features that's widely used in web development and GIS applications.
            </p>
            <Link href="/gpx-to-geojson" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to GeoJSON now →
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-medium">GPX to FIT</h3>
            <p>
              Convert GPX to FIT (Flexible and Interoperable Data Transfer) format for use with Garmin devices and other
              fitness platforms. FIT files are optimized for storing fitness data including routes, workouts, and
              activities.
            </p>
            <Link href="/gpx-to-fit" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to FIT now →
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-medium">GPX to Google Maps</h3>
            <p>
              Convert GPX to Google Maps links for easy sharing. Perfect for sharing your routes with friends, family,
              or on social media without requiring them to have specialized GPS software.
            </p>
            <Link href="/gpx-to-google-maps" className="text-sm text-primary hover:underline mt-2 inline-block">
              Convert GPX to Google Maps now →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 mt-12 border-t">
        <h2>Additional GPX Tools</h2>

        <div className="space-y-8 mt-6">
          <div>
            <h3 className="text-lg font-medium">GPX Merge</h3>
            <p>
              Combine multiple GPX files into a single file. Perfect for joining tracks from different days or devices
              into one comprehensive route. Our merger tool preserves all track data and allows you to organize tracks
              chronologically.
            </p>
            <Link href="/gpx-merge" className="text-sm text-primary hover:underline mt-2 inline-block">
              Merge GPX files now →
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-medium">GPX Split</h3>
            <p>
              Split a large GPX file into multiple smaller files. Divide by tracks, distance, time intervals, or number
              of points. Perfect for breaking up long routes, separating multi-day activities, or working around device
              limitations.
            </p>
            <Link href="/gpx-split" className="text-sm text-primary hover:underline mt-2 inline-block">
              Split GPX files now →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 mt-12 border-t">
        <h2>What is GPX?</h2>
        <p>
          GPX (GPS Exchange Format) is an XML schema designed as a common GPS data format for software applications. It
          can be used to describe waypoints, tracks, and routes. The format is open and can be used without the need to
          pay license fees.
        </p>
        <p>
          GPX files are widely used by GPS devices, fitness trackers, and mapping software to store and exchange route
          information. They contain geographic data like latitude, longitude, elevation, and timestamps.
        </p>
      </section>

      <section className="py-6 mt-12 border-t">
        <h2>Features</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Free to use with no registration required</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
          <li>Support for all major GPX elements including tracks, routes, and waypoints</li>
          <li>Interactive map preview of your GPX data</li>
          <li>Customizable conversion options for each format</li>
          <li>Fast and efficient conversion process</li>
          <li>Works on desktop and mobile devices</li>
        </ul>
      </section>
    </div>
  )
}
