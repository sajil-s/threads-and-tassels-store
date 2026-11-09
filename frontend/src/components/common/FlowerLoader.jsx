import React from "react";
import "./FlowerLoader.css";

/**
 * Reusable Threads & Tassels loading indicator.
 * variant: "page" | "section" | "inline" | "overlay"
 * For buttons use <FlowerLoader variant="inline" size={20} label="Saving" />.
 */
export default function FlowerLoader({
  variant = "section",
  size,
  label = "Loading",
  showBrand = false,
  showText = true,
  className = "",
}) {
  const dimension = size ?? (variant === "page" ? 104 : variant === "inline" ? 20 : 64);
  const fullScreen = variant === "page" || variant === "overlay";

  return (
    <div
      className={`tt-loader tt-loader--${variant} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg
        className="tt-loader__flower"
        width={dimension}
        height={dimension}
        viewBox="0 0 120 120"
        aria-hidden="true"
        focusable="false"
      >
        <g className="tt-loader__rotor">
          {Array.from({ length: 8 }, (_, index) => (
            <ellipse
              key={index}
              cx="60"
              cy="29"
              rx="10"
              ry="24"
              fill="#dbb576"
              // C9A46A
              opacity="0.82"
              transform={`rotate(${index * 45} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="11" fill="#E9A09A" />
          <circle cx="60" cy="60" r="4" fill="#FFF9F2" />
        </g>
      </svg>
      {showBrand && <span className="tt-loader__brand">THREADS &amp; TASSELS</span>}
      {showText && <span className="tt-loader__text">{label}{variant !== "inline" ? "..." : ""}</span>}
      {fullScreen && <span className="tt-loader__sr-only">Please wait</span>}
    </div>
  );
}
