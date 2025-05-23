import type { Metadata } from "next"
import { GpxToGoogleMapsTool } from "@/components/gpx-to-google-maps-tool"

// Update the page to include information about URL length limitations and add a guide for manual imports

// First, let's modify the metadata to reflect the updated content
export const metadata: Metadata = {
  title: "GPX to Google Maps - Open routes directly - Free converter - GPXto",
  description:
    "Upload a GPX file and instantly generate a free Google Maps URL to view your route. Share your routes with friends and family. Fast, easy, and completely free!",
  keywords: "gpx to google maps, convert gpx, share routes, google maps link, gps sharing, import gpx to google maps",
}

export default function GpxToGoogleMapsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-4">Convert GPX to Google Maps</h1>
        <p className="text-muted-foreground mb-8">
          Transform your GPX files into shareable Google Maps links. Perfect for sharing your routes with friends,
          family, or on social media without requiring them to have specialized GPS software.
        </p>

        <div className="mb-12">
          <GpxToGoogleMapsTool />
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Convert GPX tracks and routes to Google Maps links</li>
          <li>Preview your route before generating the link</li>
          <li>Choose which GPX elements to include (tracks, routes, waypoints)</li>
          <li>Customize the appearance of your route on Google Maps</li>
          <li>Generate short, shareable links</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
        </ul>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">How it works</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Our GPX to Google Maps converter extracts route information from your GPX file and creates a shareable
            Google Maps link. The process works as follows:
          </p>
          <ol>
            <li>Upload your GPX file</li>
            <li>Choose your conversion options</li>
            <li>Preview the route on the interactive map</li>
            <li>Generate a Google Maps link</li>
            <li>Share the link with anyone</li>
          </ol>
          <p>
            The resulting link will display your route on Google Maps when opened, allowing anyone to view your route
            without needing specialized GPS software.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <h3 className="text-base font-medium mb-2">Important note about Google Maps URLs</h3>
            <p className="text-sm">
              Google Maps has limitations on URL length and the number of waypoints that can be included in a route. Our
              tool works best for shorter routes with fewer waypoints. For longer GPX tracks, our tool automatically
              samples the most important points to create a route that follows the original path as closely as possible
              while staying within Google Maps' limitations.
            </p>
            <p className="text-sm mt-2">
              If you have a complex route with many waypoints, you may find that the generated Google Maps link doesn't
              include all details from your original GPX file. In such cases, we recommend using one of the alternative
              methods described below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Alternative methods: Importing GPX into Google Maps</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            For complex routes or when you need more control over how your GPX data is displayed in Google Maps, you can
            use these alternative methods:
          </p>

          <h3 className="text-lg font-medium mt-6">Method 1: Import KML into Google Maps</h3>
          <p>
            Google Maps directly supports importing KML files. First, convert your GPX to KML using our{" "}
            <a href="/gpx-to-kml" className="text-primary hover:underline">
              GPX to KML converter
            </a>
            , then:
          </p>
          <ol>
            <li>
              Go to{" "}
              <a
                href="https://www.google.com/maps/d/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google My Maps
              </a>
            </li>
            <li>Click "Create a New Map"</li>
            <li>Click "Import" in the left panel</li>
            <li>Upload your KML file</li>
            <li>Your GPX route will now be displayed on the map</li>
            <li>You can customize the appearance, add descriptions, and share the map with others</li>
          </ol>

          <h3 className="text-lg font-medium mt-6">Method 2: Using Google Sheets</h3>
          <p>
            For more control over your data, you can convert your GPX to CSV using our{" "}
            <a href="/gpx-to-csv" className="text-primary hover:underline">
              GPX to CSV converter
            </a>
            , then:
          </p>
          <ol>
            <li>Upload the CSV file to Google Sheets</li>
            <li>Make sure your spreadsheet has columns for latitude and longitude</li>
            <li>In Google Sheets, go to "Extensions" → "Apps Script"</li>
            <li>Create a new script with the following code:</li>
          </ol>

          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
            {`function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Maps')
    .addItem('Map Selected Cells', 'mapSelectedCells')
    .addToUi();
}

function mapSelectedCells() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getActiveRange();
  var numRows = range.getNumRows();
  
  var latCol = 1; // Column index for latitude (adjust as needed)
  var lngCol = 2; // Column index for longitude (adjust as needed)
  
  var locations = [];
  for (var i = 0; i < numRows; i++) {
    var lat = range.getCell(i+1, latCol).getValue();
    var lng = range.getCell(i+1, lngCol).getValue();
    if (lat && lng) {
      locations.push(lat + ',' + lng);
    }
  }
  
  if (locations.length > 0) {
    var url = 'https://www.google.com/maps/dir/?api=1&origin=' + 
              locations[0] + '&destination=' + locations[locations.length-1];
    
    if (locations.length > 2) {
      url += '&waypoints=' + locations.slice(1, -1).join('|');
    }
    
    var html = '<a href="' + url + '" target="_blank">Open in Google Maps</a>';
    var htmlOutput = HtmlService
      .createHtmlOutput(html)
      .setWidth(300)
      .setHeight(80);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Open in Google Maps');
  } else {
    SpreadsheetApp.getUi().alert('No valid coordinates found in selection.');
  }
}`}
          </pre>

          <ol start="5">
            <li>Save the script and return to your spreadsheet</li>
            <li>Refresh the page, and you'll see a new "Maps" menu</li>
            <li>Select your coordinate columns and click "Maps" → "Map Selected Cells"</li>
            <li>Click the link in the dialog to open your route in Google Maps</li>
          </ol>

          <h3 className="text-lg font-medium mt-6">Method 3: Using Google Earth Pro</h3>
          <p>For the most detailed visualization of your GPX data:</p>
          <ol>
            <li>
              Download and install{" "}
              <a
                href="https://www.google.com/earth/versions/#earth-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Earth Pro
              </a>{" "}
              (free)
            </li>
            <li>
              Convert your GPX to KML using our{" "}
              <a href="/gpx-to-kml" className="text-primary hover:underline">
                GPX to KML converter
              </a>
            </li>
            <li>Open Google Earth Pro</li>
            <li>Go to "File" → "Open" and select your KML file</li>
            <li>Your route will be displayed with full detail</li>
            <li>You can save the view as a KMZ file and share it with others</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h3 className="text-base font-medium mb-2">Pro tip</h3>
            <p className="text-sm">
              For the best results with complex routes, we recommend Method 1 (importing KML into Google My Maps). This
              method preserves the most detail from your original GPX file and gives you the most options for
              customization and sharing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Why convert GPX to Google Maps?</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>Converting GPX files to Google Maps links offers several benefits:</p>
          <ul>
            <li>
              <strong>Universal accessibility:</strong> Share your routes with anyone, even if they don't have GPS
              software
            </li>
            <li>
              <strong>Familiar interface:</strong> Most people are already familiar with Google Maps
            </li>
            <li>
              <strong>Mobile friendly:</strong> Links open seamlessly on mobile devices
            </li>
            <li>
              <strong>Social media sharing:</strong> Easy to share on social platforms
            </li>
            <li>
              <strong>No software required:</strong> Recipients don't need to install anything
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
