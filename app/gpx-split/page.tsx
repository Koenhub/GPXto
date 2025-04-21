import type { Metadata } from "next"
import { GpxSplitterTool } from "@/components/gpx-splitter-tool"

export const metadata: Metadata = {
  title: "GPX splitter - Split GPX files into smaller parts - GPXto",
  description:
    "Free online tool to split GPX files into multiple smaller files. Divide by tracks, distance, time, or number of points. Easy to use and completely free.",
  keywords: "gpx split, divide gpx, split tracks, gpx splitter, break gpx file, segment gpx",
}

export default function GpxSplitPage() {
  return (
    <div className="max-w-3xl mx-auto relative">
      <section className="py-8">
        <h1 className="text-2xl mb-4">GPX splitter</h1>
        <p className="text-muted-foreground mb-8">
          Split a large GPX file into multiple smaller files. Divide by tracks, distance, time intervals, or number of
          points.
        </p>

        <div className="mb-12">
          <GpxSplitterTool />
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Split GPX files by specific distance intervals</li>
          <li>Break up files based on maximum number of points per file</li>
          <li>Divide tracks into a specific number of equal stages</li>
          <li>Preview each split file on an interactive map</li>
          <li>Download individual files or all files as a ZIP</li>
          <li>All processing happens in your browser - your data never leaves your computer</li>
        </ul>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">When to split GPX files</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>Splitting GPX files is useful in several scenarios:</p>
          <ul>
            <li>
              <strong>Device limitations:</strong> Some GPS devices or applications have limits on the size or number of
              points they can handle
            </li>
            <li>
              <strong>Easier analysis:</strong> Breaking a long track into logical segments makes analysis more
              manageable
            </li>
            <li>
              <strong>Multi-day activities:</strong> Split a multi-day recording into separate days
            </li>
            <li>
              <strong>Sharing specific sections:</strong> Extract and share only the relevant portions of a longer track
            </li>
            <li>
              <strong>Performance optimization:</strong> Smaller GPX files load faster in mapping applications
            </li>
          </ul>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">How it works</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Our GPX splitter tool analyzes your GPX file and divides it according to your chosen criteria. The process
            works as follows:
          </p>
          <ol>
            <li>Upload your GPX file</li>
            <li>Choose your splitting method and configure options</li>
            <li>Preview the split files on the interactive map</li>
            <li>Download individual files or all files as a ZIP</li>
          </ol>
          <p>
            Each resulting file will be a valid GPX file that maintains all the necessary metadata and can be used in
            any application that supports the GPX format.
          </p>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-xl mb-4">Splitting methods explained</h2>
        <div className="prose dark:prose-invert max-w-none">
          <h3>By distance</h3>
          <p>
            Split your track every time it covers a specified distance. For example, you can create a new file every 5
            kilometers or miles. This is useful for breaking up long routes into equal-distance segments.
          </p>

          <h3>By number of points</h3>
          <p>
            Limit the number of trackpoints in each file. This is particularly useful when working with applications or
            devices that have limitations on the number of points they can process.
          </p>

          <h3>By number of stages</h3>
          <p>
            Divide your track into a specific number of equal parts. This is perfect for creating multi-day itineraries
            or splitting a route into a predetermined number of segments. Simply specify how many files you want, and
            the tool will divide the track accordingly.
          </p>
        </div>
      </section>
    </div>
  )
}
