"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { Copy, Check, Eye } from "lucide-react"
import Link from "next/link"

export default function ContactPageClient() {
  const [isEmailRevealed, setIsEmailRevealed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // The email is split to make it harder for bots to scrape
  const emailParts = ["gpxto", "duck", "com"]

  const handleRevealEmail = () => {
    setIsEmailRevealed(true)
  }

  const handleCopyEmail = () => {
    const email = `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`
    navigator.clipboard.writeText(email).then(() => {
      setIsCopied(true)
      toast({
        title: "Email copied to clipboard",
        description: "You can now paste it into your email client",
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-8">Contact Us</h1>

        <div className="space-y-8">
          <p className="mb-6">
            Have questions about our GPX conversion tools? Need help with a specific conversion? We're here to help!
          </p>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Email Us</h3>

              <div className="bg-muted p-2 rounded font-mono text-sm sm:text-base flex items-center w-full max-w-md">
                {isEmailRevealed ? (
                  <>
                    <span>{`${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`}</span>
                    <div className="flex-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1 hover:bg-primary/10 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="blur-sm select-none">••••••@••••.•••</span>
                    <div className="flex-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRevealEmail}
                      className="flex items-center gap-1 hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Show</span>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">How do I convert a GPX file?</h3>
                <p className="text-muted-foreground">
                  Simply upload your GPX file on our{" "}
                  <Link href="/" className="underline hover:text-primary">
                    homepage
                  </Link>{" "}
                  or specific converter page, select your desired output format, configure any options, and click
                  convert. You'll then be able to download the converted file.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes! All processing happens in your browser - your GPX files and route data never leave your computer.
                  We don't store your files or any data contained within them on our servers.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Are there any file size limitations?</h3>
                <p className="text-muted-foreground">
                  Since all processing happens in your browser, the limitations depend on your device's capabilities.
                  Most modern browsers can handle GPX files up to several megabytes in size without issues.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Why should I donate?</h3>
                <p className="text-muted-foreground">
                  While our tools are free to use, donations help us cover server costs, develop new features, and
                  maintain the service. Your support is greatly appreciated but entirely optional.
                </p>
              </div>

              <div>
                <h3 className="font-medium">What GPX elements are supported in the conversion?</h3>
                <p className="text-muted-foreground">
                  Our converters support all standard GPX elements including tracks, routes, waypoints, and their
                  associated metadata such as elevation, timestamps, and descriptions. The specific elements preserved
                  depend on the target format's capabilities.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Can I convert multiple files at once?</h3>
                <p className="text-muted-foreground">
                  For standard format conversions, you can only convert one file at a time. However, our{" "}
                  <Link href="/gpx-merge" className="underline hover:text-primary">
                    Merge GPX tool
                  </Link>{" "}
                  specifically allows you to upload and combine multiple GPX files into a single output file.
                </p>
              </div>

              <div>
                <h3 className="font-medium">How accurate is the Google Maps to GPX conversion?</h3>
                <p className="text-muted-foreground">
                  Our{" "}
                  <Link href="/maps-to-gpx" className="underline hover:text-primary">
                    Maps to GPX converter
                  </Link>{" "}
                  extracts route data from Google Maps URLs with high accuracy. However, the resolution of the route
                  depends on the data provided by Google Maps. For driving routes, the conversion typically includes all
                  major waypoints and turn instructions.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Will the conversion preserve elevation data?</h3>
                <p className="text-muted-foreground">
                  Yes, when the source GPX file contains elevation data and the target format supports it, our
                  converters will preserve elevation information. This is particularly important for formats like{" "}
                  <Link href="/gpx-to-kml" className="underline hover:text-primary">
                    KML
                  </Link>
                  ,{" "}
                  <Link href="/gpx-to-fit" className="underline hover:text-primary">
                    FIT
                  </Link>
                  , and{" "}
                  <Link href="/gpx-to-geojson" className="underline hover:text-primary">
                    GeoJSON
                  </Link>
                  . You can control this with the "Include Elevation" option available in most conversion tools.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Which browsers are supported?</h3>
                <p className="text-muted-foreground">
                  Our tools work in all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using
                  the latest version of your browser for the best experience and performance.
                </p>
              </div>

              <div>
                <h3 className="font-medium">How do I report a bug or suggest a feature?</h3>
                <p className="text-muted-foreground">
                  We welcome your feedback! Please use the email address provided above to report any bugs you encounter
                  or to suggest new features or improvements. Be sure to include as much detail as possible about the
                  issue or your feature request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  )
}
