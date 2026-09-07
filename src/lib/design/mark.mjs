/**
 * The mark, as numbers.
 *
 * Two things draw it — the icon generator, which writes PNGs and SVGs from
 * Node, and the Logo component, which renders JSX — so the geometry lives
 * here rather than in either of them. A test asserts the two agree.
 *
 * The drawing is a clock reading 8:00 with the ring between the two hands
 * filled in: the hour hand marks the clock-in, the minute hand the clock-out,
 * and the arc between them is the elapsed time. That is the app's whole
 * subject, which is why the arc is tied to the hands rather than placed
 * freely.
 *
 * A plain .mjs, not .ts, so the generator can import it without a TypeScript
 * runtime and CI can keep running it on plain Node.
 */

export const MARK = {
  /** The whole drawing, outer halo included. */
  size: 166,
  center: 83,

  /** The ring the track and the arc share. */
  ringRadius: 64,
  ringWidth: 20,

  /**
   * Two keylines, both in the tile colour.
   *
   * The outer one disappears inside the app icon and becomes a contour
   * everywhere else — which is what lets a single asset sit on the teal
   * header, on white, and on the dark tile without a second version. The
   * inner one separates the face from the track, which the light grey does
   * not do on its own: #C3C3C3 against white is only 1.76:1.
   */
  haloOuter: 9,
  haloInner: 2,

  /** The two punch marks. Minute hand at 12, hour hand at 8: it reads 8:00. */
  handWidth: 8,
  minuteHand: 46,
  hourHand: 34,
  hourAngle: 240,
  pin: 7,

  /** The elapsed span, from the hour hand round to the minute hand. */
  arcFrom: 240,
  arcTo: 360,
};

export const MARK_COLORS = {
  arc: "#0F766E",
  track: "#C3C3C3",
  face: "#FFFFFF",
  hands: "#131817",
  halo: "#171D1C",
};

/** The clock's outer edge, before the halo. */
export const clockRadius = MARK.ringRadius + MARK.ringWidth / 2;
/** The face's edge, where the inner keyline sits. */
export const faceRadius = MARK.ringRadius - MARK.ringWidth / 2;

const round = (n) => Number(n.toFixed(2));

/** A point on the ring, measuring clockwise from twelve o'clock. */
function onRing(degrees) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [
    round(MARK.center + MARK.ringRadius * Math.cos(radians)),
    round(MARK.center + MARK.ringRadius * Math.sin(radians)),
  ];
}

/** The `d` of the elapsed arc. */
export function arcPath() {
  const [x0, y0] = onRing(MARK.arcFrom);
  const [x1, y1] = onRing(MARK.arcTo);
  const span = (MARK.arcTo - MARK.arcFrom + 360) % 360;
  const large = span > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${MARK.ringRadius} ${MARK.ringRadius} 0 ${large} 1 ${x1} ${y1}`;
}

/** Radius of a stroked ring that sits just outside the clock. */
export const haloOuterRadius = clockRadius + MARK.haloOuter / 2;
/** Radius of a stroked ring that sits just inside the face. */
export const haloInnerRadius = faceRadius - MARK.haloInner / 2;
