"use client"

/**
 * AdSlot — reusable advertising placeholder.
 *
 * HOW TO ACTIVATE A REAL AD:
 * 1. Set the AD_ENABLED env var (NEXT_PUBLIC_ADS_ENABLED=true) in Vercel.
 * 2. Replace the <div> inside the "active" branch with your <ins> AdSense tag
 *    or a <script> / <Image> from your ad network.
 * 3. All placements across the site will update automatically.
 */

const SIZES: Record<string, { width: string; height: string; label: string }> = {
  leaderboard:  { width: "w-full max-w-[728px]", height: "h-[90px]",  label: "728 × 90 — Leaderboard" },
  billboard:    { width: "w-full",                height: "h-[250px]", label: "970 × 250 — Billboard" },
  rectangle:    { width: "w-[300px]",             height: "h-[250px]", label: "300 × 250 — Rectangle" },
  mobile:       { width: "w-full max-w-[320px]",  height: "h-[50px]",  label: "320 × 50 — Mobile Banner" },
  halfpage:     { width: "w-[300px]",             height: "h-[600px]", label: "300 × 600 — Half Page" },
}

interface AdSlotProps {
  size?: keyof typeof SIZES
  className?: string
  label?: string
}

export function AdSlot({ size = "leaderboard", className = "", label }: AdSlotProps) {
  const s = SIZES[size] ?? SIZES.leaderboard
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true"

  if (adsEnabled) {
    // ── ACTIVE: swap this div for your real ad tag ──
    return (
      <div className={`flex justify-center my-4 ${className}`}>
        <div className={`${s.width} ${s.height} bg-gray-100 flex items-center justify-center`}>
          {/* INSERT AD TAG HERE */}
        </div>
      </div>
    )
  }

  // ── PLACEHOLDER (shown until ads are configured) ──
  return (
    <div className={`flex justify-center my-4 ${className}`} aria-hidden="true">
      <div
        className={`
          ${s.width} ${s.height}
          border-2 border-dashed border-gray-200
          bg-gray-50 rounded-xl
          flex flex-col items-center justify-center gap-1
          text-gray-300 select-none
        `}
      >
        <span className="text-xs font-semibold uppercase tracking-widest">
          {label ?? "Advertisement"}
        </span>
        <span className="text-[10px]">{s.label}</span>
      </div>
    </div>
  )
}
