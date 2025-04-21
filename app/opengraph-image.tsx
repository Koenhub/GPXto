import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "GPXto - Convert GPX files online"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#f8fafc",
          opacity: 0.8,
          zIndex: 1,
        }}
      />

      {/* Map route lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "80%",
            height: "60%",
            position: "relative",
          }}
        >
          {/* Curved route path */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "8px",
              background: "#4CAF50",
              top: "40%",
              borderRadius: "4px",
              transform: "rotate(-5deg) translateY(-50%)",
            }}
          />

          {/* Route markers */}
          <div
            style={{
              position: "absolute",
              width: "24px",
              height: "24px",
              background: "#4CAF50",
              borderRadius: "50%",
              border: "4px solid white",
              left: "10%",
              top: "40%",
              transform: "translateY(-50%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "24px",
              height: "24px",
              background: "#E53935",
              borderRadius: "50%",
              border: "4px solid white",
              right: "10%",
              top: "40%",
              transform: "translateY(-50%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          padding: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            background: "white",
            padding: "0 24px",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          GPX<span style={{ color: "#4CAF50" }}>to</span>
        </div>
        <div
          style={{
            fontSize: 36,
            marginTop: 24,
            color: "#333",
          }}
        >
          Convert GPX Files Online
        </div>
      </div>
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
