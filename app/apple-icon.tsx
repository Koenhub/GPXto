import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "24px",
        color: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#e6f2ff",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "#4CAF50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "4px",
          background: "#2196F3",
          transform: "rotate(45deg)",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "4px",
          background: "#2196F3",
          transform: "rotate(-45deg)",
          zIndex: 3,
        }}
      />
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
