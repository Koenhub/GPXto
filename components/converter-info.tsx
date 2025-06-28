export function ConverterInfo() {
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl mb-8 text-center">Our conversion tools</h2>

        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-xl">GPX to KML</h3>
            <p className="text-muted-foreground">
              Convert GPX to KML (Keyhole Markup Language) for use with Google Earth and other Google mapping products.
              KML files allow you to display your GPS tracks, routes, and waypoints on Google Maps and Earth.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to PDF</h3>
            <p className="text-muted-foreground">
              Convert GPX to PDF to create printable maps and route documentation. Perfect for sharing routes with
              others who don't have GPS devices or for creating physical backups of your routes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to Excel</h3>
            <p className="text-muted-foreground">
              Convert GPX to Excel (XLSX) format for data analysis and manipulation. This allows you to work with your
              GPS data in spreadsheet software for custom calculations and visualization.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to KMZ</h3>
            <p className="text-muted-foreground">
              Convert GPX to KMZ (compressed KML) for more efficient sharing and storage. KMZ files are essentially
              zipped KML files that can include additional resources like images.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to JPG</h3>
            <p className="text-muted-foreground">
              Convert GPX to JPG to create image visualizations of your routes. This is perfect for sharing on social
              media or including in presentations and documents.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to CSV</h3>
            <p className="text-muted-foreground">
              Convert GPX to CSV (Comma-Separated Values) for maximum compatibility with various software. CSV is a
              simple text format that can be opened in almost any data processing tool.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to GeoJSON</h3>
            <p className="text-muted-foreground">
              Convert GPX to GeoJSON for web mapping applications. GeoJSON is a standard format for representing
              geographical features that's widely used in web development and GIS applications.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl">GPX to FIT</h3>
            <p className="text-muted-foreground">
              Convert GPX to FIT (Flexible and Interoperable Data Transfer) format for use with Garmin devices and other
              fitness platforms. FIT files are optimized for storing fitness data including routes, workouts, and
              activities.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl mb-4">What is GPX?</h3>
          <p className="text-muted-foreground mb-4">
            GPX (GPS Exchange Format) is an XML schema designed as a common GPS data format for software applications.
            It can be used to describe waypoints, tracks, and routes. The format is open and can be used without the
            need to pay license fees.
          </p>
          <p className="text-muted-foreground">
            GPX files are widely used by GPS devices, fitness trackers, and mapping software to store and exchange route
            information. They contain geographic data like latitude, longitude, elevation, and timestamps.
          </p>
        </div>
      </div>
    </section>
  )
}
