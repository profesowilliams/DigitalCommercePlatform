import React from "react";

const PipeStyle = (h, w, c, d) => {
  return {
    width: w || "1px",
    height: h || "20px",
    backgroundColor: c || "#D8D8D8",
    margin: `0 ${d || 19}px`,
  }
}

export default function Pipe({ height, width, color, distance }) {
  return (
    <div style={PipeStyle(height, width, color, distance)}></div>
  )
}
