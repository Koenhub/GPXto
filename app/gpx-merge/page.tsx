import type { Metadata } from "next"
import { MergeGpxTool } from "@/components/gpx-merge-tool"
import { DonationReminder } from "@/components/donation-reminder"

export const metadata: Metadata = {
  title: "GPX merge - Merge GPX files online - Combine GPX files - GPXto",
  description:
    "Free online GPX merge tool to combine multiple GPX files into one. Preview the merged route on the interactive map. Easy to use and completely free.",
  keywords: "gpx merge, combine gpx, join gpx tracks, gpx merger, multiple gpx files",
}

export default function GpxMergePage() {
  return (
    <div className="max-w-3xl mx-auto relative">
      <section className="py-8">
        <h1 className="text-2xl mb-4">GPX merge</h1>
        <p className="text-muted-foreground mb-8">
          Combine multiple GPX files into a single file. Perfect for joining tracks from different days or devices into
          one comprehensive route.
        </p>

        <div className="mb-12">
          <MergeGpxTool />
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Merge multiple GPX files into a single file</li>
          <li>Preserve all track data including waypoints, routes, and tracks</li>
          <li>Option to sort tracks chronologically</li>
          <li>Combine tracks from different devices or applications</li>
          <li>Preview the merged route on an interactive map</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
        </ul>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">When to merge GPX files</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>Merging GPX files is useful in several scenarios:</p>
          <ul>
            <li>
              <strong>Multi-day trips:</strong> Combine daily tracks into a single comprehensive route
            </li>
            <li>
              <strong>Device limitations:</strong> Join tracks that were split due to device memory or battery
              limitations
            </li>
            <li>
              <strong>Multiple recorders:</strong> Merge tracks recorded by different people or devices during the same
              activity
            </li>
            <li>
              <strong>Route planning:</strong> Combine pre-existing route segments to create a new complete route
            </li>
          </ul>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">How it works</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Our GPX merger tool analyzes the structure of each uploaded GPX file and intelligently combines them while
            preserving all important data. The process works as follows:
          </p>
          <ol>
            <li>Upload two or more GPX files</li>
            <li>Choose your merging options (chronological order, preserve all data, etc.)</li>
            <li>Preview the merged route on the interactive map</li>
            <li>Download the combined GPX file</li>
          </ol>
          <p>
            The resulting file will contain all tracks, routes, and waypoints from the original files, properly
            organized and structured according to the GPX standard.
          </p>
        </div>
      </section>

      <DonationReminder />
    </div>
  )
}
