/** Original stylized Handsome Dan bulldog mascot — a happy sitting bulldog in a
 * Yale-blue bandana. Coat color is a prop so each course card can get its own dog. */

interface HandsomeDanProps {
  /** Main coat color. */
  furColor?: string
  /** Bandana color (defaults to Yale blue). */
  bandanaColor?: string
  /** Rendered width/height in px. */
  size?: number
  className?: string
}

/** Mixes a hex color toward white (positive amt) or black (negative amt), amt in [-1, 1]. */
function shade(hex: string, amt: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const channels = [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff]
  const mixed = channels.map((c) => {
    const target = amt >= 0 ? 255 : 0
    const v = Math.round(c + (target - c) * Math.abs(amt))
    return Math.min(255, Math.max(0, v))
  })
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export default function HandsomeDan({
  furColor = '#b5742e',
  bandanaColor = '#00356b',
  size = 64,
  className,
}: HandsomeDanProps) {
  const light = shade(furColor, 0.4)
  const dark = shade(furColor, -0.25)
  const bandanaDark = shade(bandanaColor, -0.2)
  const ink = '#2b2320'

  return (
    <svg
      viewBox="0 0 100 108"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* body / shoulders */}
      <ellipse cx="50" cy="106" rx="38" ry="22" fill={furColor} />

      {/* ears (behind head) — short, flopped-down bulldog ears, not round bear ears */}
      <path d="M16 30 q-3 14 8 24 q6 2 8 -4 q-4 -10 -3 -22 q-6 -4 -13 2 Z" fill={dark} />
      <path d="M84 30 q3 14 -8 24 q-6 2 -8 -4 q4 -10 3 -22 q6 -4 13 2 Z" fill={dark} />

      {/* head — wide and flat, bulldog-proportioned */}
      <ellipse cx="50" cy="44" rx="33" ry="24" fill={furColor} />

      {/* muzzle + jowls, hanging low past the jaw line */}
      <ellipse cx="50" cy="57" rx="21" ry="13" fill={light} />
      <path d="M28 56 q-4 16 6 22 q7 3 9 -6 q-2 -12 -6 -18 Z" fill={light} />
      <path d="M72 56 q4 16 -6 22 q-7 3 -9 -6 q2 -12 6 -18 Z" fill={light} />

      {/* forehead wrinkles */}
      <path d="M35 26 q15 -5 30 0" stroke={dark} strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M33 33 q17 -4 34 0" stroke={dark} strokeWidth="1.4" fill="none" opacity="0.3" strokeLinecap="round" />

      {/* happy closed eyes */}
      <path d="M35 37 q4.5 -6 9 0" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M56 37 q4.5 -6 9 0" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* nose — broad and flat */}
      <ellipse cx="50" cy="51" rx="8.5" ry="6" fill={ink} />
      <ellipse cx="46.8" cy="51" rx="1.3" ry="1.9" fill="#000" opacity="0.55" />
      <ellipse cx="53.2" cy="51" rx="1.3" ry="1.9" fill="#000" opacity="0.55" />

      {/* mouth + smile */}
      <path d="M50 57 v4" stroke={ink} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M50 61 q-9 7 -16 3" stroke={ink} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M50 61 q9 7 15 3" stroke={ink} strokeWidth="1.7" fill="none" strokeLinecap="round" />

      {/* tongue */}
      <path
        d="M52 61 q4 9 -0.5 15.5 q-5.5 2.6 -7 -3.8 q-0.5 -7 7.5 -11.7 Z"
        fill="#e8899f"
        stroke="#c96a83"
        strokeWidth="0.6"
      />

      {/* bandana */}
      <path d={`M27 76 L73 76 L50 100 Z`} fill={bandanaColor} stroke={bandanaDark} strokeWidth="1" />
      <path d="M27 76 q23 9 46 0" fill="none" stroke={bandanaDark} strokeWidth="1" opacity="0.55" />
      <text
        x="50"
        y="93"
        textAnchor="middle"
        fontFamily="Georgia, 'Libre Baskerville', serif"
        fontWeight={700}
        fontSize="13"
        fill="#ffffff"
      >
        Y
      </text>
    </svg>
  )
}
