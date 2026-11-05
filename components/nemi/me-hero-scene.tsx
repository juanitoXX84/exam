const ROUTE_1 = {
  p0: [300, 88],
  p1: [390, 128],
  p2: [470, 96],
  p3: [560, 118],
} as const;

const ROUTE_2 = {
  p0: [560, 118],
  p1: [650, 140],
  p2: [740, 92],
  p3: [860, 108],
} as const;

const ROUTE_D =
  "M300 88 C 390 128 470 96 560 118 C 650 140 740 92 860 108";

/** Vertical offset so the route sits lower in the hero crop. */
const ROUTE_SHIFT_Y = 36;

function cubicPoint(
  t: number,
  p0: readonly [number, number],
  p1: readonly [number, number],
  p2: readonly [number, number],
  p3: readonly [number, number],
): [number, number] {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return [
    mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0],
    mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1],
  ];
}

/** Evenly spaced samples along the two-segment route (0–1). */
function pointOnRoute(t: number): [number, number] {
  if (t <= 0.5) {
    return cubicPoint(t * 2, ROUTE_1.p0, ROUTE_1.p1, ROUTE_1.p2, ROUTE_1.p3);
  }
  return cubicPoint((t - 0.5) * 2, ROUTE_2.p0, ROUTE_2.p1, ROUTE_2.p2, ROUTE_2.p3);
}

const PIN_STOPS = [0.28, 0.54, 0.8] as const;

function Pin({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: string;
}) {
  const tipY = y - 10;

  return (
    <g transform={`translate(${x} ${tipY})`}>
      <g
        className="nemi-me-pin"
        style={{ ["--me-pin-delay" as string]: delay }}
      >
        <circle className="nemi-me-pin-glow" cx="0" cy="2" r="14" />
        <path
          d="M0 10 C0 10 -11 -6 -11 -14 A11 11 0 1 1 11 -14 C11 -6 0 10 0 10 Z"
          fill="#2dd4bf"
        />
        <circle cx="0" cy="-14" r="3.2" fill="#0a0c0f" />
      </g>
    </g>
  );
}

function RouteDot({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle
        className="nemi-me-route-dot"
        cx="0"
        cy="0"
        r="2.5"
        style={{ ["--me-pin-delay" as string]: delay }}
      />
    </g>
  );
}

/** Decorative traveler scene for Mi NEMI. Pure illustration, not a real destination. */
export function MeHeroScene() {
  const pinPoints = PIN_STOPS.map((t) => pointOnRoute(t));
  const [, endY] = pointOnRoute(1);
  const [preEndX, preEndY] = pointOnRoute(0.94);

  const angle =
    (Math.atan2(endY - preEndY, 860 - preEndX) * 180) / Math.PI;

  return (
    <svg
      className="nemi-me-hero-art"
      viewBox="0 0 960 320"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <linearGradient id="meSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b121c" />
          <stop offset="100%" stopColor="#0a0c0f" />
        </linearGradient>
      </defs>

      <rect width="960" height="320" fill="url(#meSky)" />

      <g fill="#d7ece8" opacity="0.85" transform={`translate(0 ${ROUTE_SHIFT_Y})`}>
        <circle className="nemi-me-star" cx="148" cy="22" r="0.85" />
        <circle className="nemi-me-star s2" cx="278" cy="18" r="0.75" />
        <circle className="nemi-me-star s3" cx="412" cy="16" r="0.9" />
        <circle className="nemi-me-star" cx="538" cy="24" r="0.8" />
        <circle className="nemi-me-star s2" cx="668" cy="20" r="0.85" />
        <circle className="nemi-me-star s3" cx="802" cy="18" r="0.9" />
      </g>

      <path
        d="M0 168 C 120 148 210 188 320 166 C 430 144 520 186 640 160 C 760 134 860 172 960 150 V 320 H 0 Z"
        fill="#1a232e"
      />
      <path
        d="M0 206 C 140 178 250 224 380 196 C 510 168 620 226 760 198 C 860 180 920 208 960 198 V 320 H 0 Z"
        fill="#141b24"
      />
      <path
        d="M0 254 C 160 232 280 268 420 248 C 560 228 700 274 840 252 C 900 244 940 258 960 252 V 320 H 0 Z"
        fill="#0e1318"
      />

      <g transform={`translate(0 ${ROUTE_SHIFT_Y})`}>
        <path className="nemi-me-route" d={ROUTE_D} />
        <path className="nemi-me-route-glow" d={ROUTE_D} />

        {pinPoints.map(([x, y], index) => (
          <RouteDot
            key={`dot-${index}`}
            x={x}
            y={y}
            delay={`${index * 0.55}s`}
          />
        ))}

        {pinPoints.map(([x, y], index) => (
          <Pin
            key={`pin-${index}`}
            x={x}
            y={y}
            delay={`${index * 0.55}s`}
          />
        ))}

        <g transform={`translate(860 ${endY}) rotate(${angle})`}>
          <path d="M-2 -5 L10 0 L-2 5 Z" fill="#2dd4bf" />
        </g>

        <circle className="nemi-me-route-traveler" r="3.5" fill="#2dd4bf">
          <animateMotion
            dur="14s"
            repeatCount="indefinite"
            path={ROUTE_D}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>
      </g>
    </svg>
  );
}
