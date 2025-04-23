"use client"

import { FileUploadSimple } from "@/components/file-upload-simple"
import { DonationReminder } from "@/components/donation-reminder"

interface ConversionPageProps {
  from: string
  to: string
  title: string
  description: string
  features: string[]
  additionalInfo?: string
  isComingSoon?: boolean
}

export function ConversionPage({
  from,
  to,
  title,
  description,
  features,
  additionalInfo,
  isComingSoon = false,
}: ConversionPageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>

        <div className="mb-12">
          <FileUploadSimple initialConversionType={to.toLowerCase()} isComingSoon={isComingSoon} />
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      {additionalInfo && (
        <section className="py-8 border-t">
          <h2 className="text-xl mb-4">Additional information</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{additionalInfo}</p>
          </div>
        </section>
      )}

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">
          About {from} and {to} Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg mb-2">What is a {from} file?</h3>
            <p className="text-muted-foreground">
              {from === "GPX"
                ? "GPX (GPS Exchange Format) is an XML schema designed as a common GPS data format for software applications. It can be used to describe waypoints, tracks, and routes. The format is open and can be used without the need to pay license fees."
                : `${from} is a file format used for...`}
            </p>
          </div>
          <div>
            <h3 className="text-lg mb-2">What is a {to} file?</h3>
            <p className="text-muted-foreground">
              {to === "KML" &&
                "KML (Keyhole Markup Language) is an XML-based format used to display geographic data in Earth browsers such as Google Earth and Google Maps. KML uses a tag-based structure with nested elements and attributes."}
              {to === "PDF" &&
                "PDF (Portable Document Format) is a file format developed by Adobe to present documents in a manner independent of application software, hardware, and operating systems. PDFs can contain text, images, links, and interactive elements."}
              {to === "Excel" &&
                "Excel (XLSX) is a spreadsheet format developed by Microsoft. It allows you to organize, format, and calculate data with formulas using a spreadsheet system broken up by rows and columns."}
              {to === "KMZ" &&
                "KMZ is a compressed version of a KML file. It consists of a main KML file and optional overlay images, icons, and other resources referenced in the KML, bundled into a ZIP archive."}
              {to === "JPG" &&
                "JPG (or JPEG) is a commonly used method of lossy compression for digital images. The degree of compression can be adjusted, allowing a selectable tradeoff between storage size and image quality."}
              {to === "CSV" &&
                "CSV (Comma-Separated Values) is a simple file format used to store tabular data, such as a spreadsheet or database. Files in the CSV format can be imported to and exported from programs that store data in tables."}
              {to === "GeoJSON" &&
                "GeoJSON is an open standard format designed for representing simple geographical features, along with their non-spatial attributes. It is based on JSON (JavaScript Object Notation) and is widely used in web mapping applications."}
              {to === "FIT" &&
                "FIT (Flexible and Interoperable Data Transfer) is a file format developed by ANT+ and widely used by Garmin and other fitness devices. It's designed to store and share fitness data including routes, workouts, and activities in a compact binary format."}
            </p>
          </div>
        </div>
      </section>

      <DonationReminder />
    </div>
  )
}
