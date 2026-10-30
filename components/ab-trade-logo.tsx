'use client'

interface ABTradeLogoProps {
  className?: string
  variant?: 'default' | 'white'
  showTagline?: boolean
}

export function ABTradeLogo({ className = 'h-10 w-auto', variant = 'default', showTagline = true }: ABTradeLogoProps) {
  const textColor    = variant === 'white' ? '#ffffff' : '#3B7BC4'
  const taglineColor = variant === 'white' ? 'rgba(255,255,255,0.80)' : '#5a9fd4'
  const fanColors    = variant === 'white'
    ? ['rgba(255,255,255,0.40)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.70)', 'rgba(255,255,255,0.85)', '#ffffff', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.70)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.40)']
    : ['#a8d84e', '#93cc2f', '#83c420', '#7FCC29', '#6db820', '#83c420', '#93cc2f', '#a8d84e', '#bed87a']
  const badgeBg      = variant === 'white' ? 'rgba(255,255,255,0.25)' : '#7FCC29'
  const badgeText    = '#ffffff'

  /*
   * Fan icon matching the business card:
   * 9 thin finger-shaped rays spreading from a shared base point,
   * arranged in a semicircle, light-to-dark-to-light gradient across the fan.
   * Origin point: cx=34, cy=64  (bottom-centre of the fan)
   */
  const cx = 34
  const cy = 64
  const rays = [
    // [startAngle, width-half in degrees] — rays fan from -90° (straight up) outward
    { a: -90, hw: 7 },
    { a: -70, hw: 7 },
    { a: -50, hw: 7 },
    { a: -30, hw: 7 },
    { a: -10, hw: 7 },
    { a:  10, hw: 7 },
    { a:  30, hw: 7 },
    { a:  50, hw: 7 },
    { a:  70, hw: 7 },
  ]

  const toRad = (d: number) => (d * Math.PI) / 180

  function rayPath(angleDeg: number, halfWidthDeg: number, length: number, gap: number) {
    const a1 = toRad(angleDeg - halfWidthDeg + gap)
    const a2 = toRad(angleDeg + halfWidthDeg - gap)
    const x1 = cx + length * Math.cos(a1)
    const y1 = cy + length * Math.sin(a1)
    const x2 = cx + length * Math.cos(a2)
    const y2 = cy + length * Math.sin(a2)
    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
  }

  return (
    <svg
      viewBox="0 0 310 76"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AB TRADE"
      fill="none"
    >
      {/* Fan rays */}
      {rays.map((ray, i) => (
        <path
          key={i}
          d={rayPath(ray.a, ray.hw, 56, 1.8)}
          fill={fanColors[i]}
        />
      ))}

      {/* ABT green badge */}
      <rect x="16" y="57" width="36" height="14" rx="2.5" fill={badgeBg} />
      <text
        x="34" y="68"
        textAnchor="middle"
        fill={badgeText}
        fontSize="8.5"
        fontWeight="800"
        fontFamily="Arial Black, Arial, sans-serif"
        letterSpacing="0.5"
      >
        ABT
      </text>

      {/* "AB TRADE" bold blue text */}
      <text
        x="64" y="48"
        fontSize="36"
        fontWeight="900"
        fontFamily="'Arial Black', Impact, Arial, sans-serif"
        fill={textColor}
        letterSpacing="2"
      >
        AB TRADE
      </text>

      {/* Tagline */}
      {showTagline && (
        <text
          x="65" y="63"
          fontSize="7.8"
          fontFamily="Arial, sans-serif"
          fill={taglineColor}
        >
          All Kinds of Garments &amp; Washing Accessories Seller &amp; Suppliers
        </text>
      )}
    </svg>
  )
}
