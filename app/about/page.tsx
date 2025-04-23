import Link from "next/link"

export const metadata = {
  title: "About GPXto - Free converter online - GPXto",
  description:
    "Learn about GPXto's free online tools for converting GPX files. We offer multiple conversion formats and tools, all free to use with no registration.",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl mb-8">About GPXto</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p>
          GPXto is a free online tool that allows you to convert GPX files to various formats including KML, PDF, Excel,
          KMZ, JPG, CSV, and GeoJSON. We also provide additional tools to help you work with GPS data, such as merging
          multiple GPX files and converting Google Maps routes to GPX format.
        </p>

        <h2 className="text-xl mt-8 mb-4">What is GPX?</h2>
        <p>
          GPX (GPS Exchange Format) is an XML schema designed as a common GPS data format for software applications. It
          can be used to describe waypoints, tracks, and routes. The format is open and can be used without the need to
          pay license fees.
        </p>

        <h2 className="text-xl mt-8 mb-4">Our conversion tools</h2>
        <p>We offer a variety of conversion tools to help you work with your GPX data:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>
              <Link href="/gpx-to-kml">GPX to KML</Link>
            </strong>{" "}
            - Convert to Google Earth's format
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-pdf">GPX to PDF</Link>
            </strong>{" "}
            - Create printable documents with your GPS data
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-excel">GPX to Excel</Link>
            </strong>{" "}
            - Analyze your GPS data in spreadsheets
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-kmz">GPX to KMZ</Link>
            </strong>{" "}
            - Create compressed KML files
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-jpg">GPX to JPG</Link>
            </strong>{" "}
            - Generate image visualizations of your routes
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-csv">GPX to CSV</Link>
            </strong>{" "}
            - Create comma-separated values files for data analysis
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-geojson">GPX to GeoJSON</Link>
            </strong>{" "}
            - Convert to the open standard format for representing geographical features
          </li>
          <li>
            <strong>
              <Link href="/gpx-to-fit">GPX to FIT</Link>
            </strong>{" "}
            - Convert to Garmin's fitness device format
          </li>
        </ul>

        <h2 className="text-xl mt-8 mb-4">Additional tools</h2>
        <p>Beyond simple format conversion, we offer specialized tools to enhance your GPS data workflow:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>
              <Link href="/merge-gpx">Merge GPX Files</Link>
            </strong>{" "}
            - Combine multiple GPX files into a single file, perfect for joining tracks from different days or devices
            into one comprehensive route
          </li>
          <li>
            <strong>
              <Link href="/maps-to-gpx">Maps to GPX</Link>
            </strong>{" "}
            - Convert Google Maps routes to GPX format, allowing you to use routes planned in Google Maps with your GPS
            device, fitness tracker, or route planning software
          </li>
        </ul>

        <h2 className="text-xl mt-8 mb-4">How our tools work</h2>
        <p>
          All of our conversion and processing tools operate entirely within your browser. This means your GPX files and
          route data never leave your computer - we don't store your data on our servers. This approach ensures maximum
          privacy and security for your location data.
        </p>
        <p>
          Our tools use modern web technologies to parse, process, and convert your GPS data directly in your browser.
          The converted files are generated on your device and can be downloaded immediately.
        </p>

        <h2 className="text-xl mt-8 mb-4">Privacy</h2>
        <p>
          We take your privacy seriously. All file conversions happen in your browser, and we do not store your GPX
          files or any data contained within them on our servers. Your location data remains private and secure.
        </p>

        <h2 className="text-xl mt-8 mb-4">Our mission</h2>
        <p>
          Our mission is to provide free, accessible tools for working with GPS data. Whether you're a hiker tracking
          your adventures, a cyclist analyzing your routes, or a developer working with geospatial data, we aim to make
          the process of converting and manipulating GPS data as simple and straightforward as possible.
        </p>
        <p>
          We believe that access to tools for working with open formats like GPX should be free and available to
          everyone, regardless of technical expertise or budget.
        </p>
        <p>
          While our tools are free to use, we rely on donations to cover server costs and continue developing new
          features. If you find our tools helpful, please consider{" "}
          <a href="https://ko-fi.com/gpxto" target="_blank" rel="noopener noreferrer">
            supporting us on Ko-fi
          </a>
          . Your contributions help us maintain and improve these services for everyone.
        </p>
      </div>
    </div>
  )
}
