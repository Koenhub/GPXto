import type React from "react"
import "@/app/globals.css"
import { NavbarClient } from "@/components/navbar-client"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollRestoration } from "@/components/scroll-restoration"

export const metadata = {
  title: "GPXto - Convert GPX Files - Free converter online",
  description:
    "Free online tools to convert GPX files to KML, PDF, Excel, KMZ, JPG, CSV, GeoJSON, and FIT formats. No registration needed, works in your browser.",
  openGraph: {
    title: "GPXto - Convert GPX files online",
    description: "Free online tools to convert GPX files to various formats. All processing happens in your browser.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 1200,
        alt: "GPXto - Convert GPX files online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPXto - Convert GPX files online",
    description: "Free online tools to convert GPX files to various formats. All processing happens in your browser.",
    images: ["/opengraph-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
    window.dataLayer = window.dataLayer || [];
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KQVNT4H4');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* We'll load Leaflet CSS dynamically in the component instead */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQVNT4H4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollRestoration />
          <NavbarClient />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
