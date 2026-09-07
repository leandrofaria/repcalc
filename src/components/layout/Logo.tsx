import {
  MARK,
  MARK_COLORS,
  arcPath,
  haloInnerRadius,
  haloOuterRadius,
} from "@/lib/design/mark.mjs";

/**
 * The mark, drawn from the same numbers the icon generator uses.
 *
 * Its colours are fixed rather than themed: the drawing carries its own white
 * face and its own dark contour, so it holds on the teal header, on a white
 * page and on the dark tile without a second version. A test asserts this
 * renders the same geometry as the generated icon.
 */
const Logo = ({ size = 28 }: { size?: number }) => {
  const c = MARK.center;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${MARK.size} ${MARK.size}`}
      role="img"
      aria-hidden
      className="shrink-0"
    >
      {/* Outer keyline. The tile colour, so it vanishes inside the app icon
          and becomes a contour anywhere else. */}
      <circle
        cx={c}
        cy={c}
        r={haloOuterRadius}
        fill="none"
        stroke={MARK_COLORS.halo}
        strokeWidth={MARK.haloOuter}
      />
      <circle cx={c} cy={c} r={MARK.ringRadius} fill={MARK_COLORS.face} />
      <circle
        cx={c}
        cy={c}
        r={MARK.ringRadius}
        fill="none"
        stroke={MARK_COLORS.track}
        strokeWidth={MARK.ringWidth}
      />
      {/* The elapsed span, from the hour hand round to the minute hand. */}
      <path
        d={arcPath()}
        fill="none"
        stroke={MARK_COLORS.arc}
        strokeWidth={MARK.ringWidth}
        strokeLinecap="butt"
      />
      <circle
        cx={c}
        cy={c}
        r={haloInnerRadius}
        fill="none"
        stroke={MARK_COLORS.halo}
        strokeWidth={MARK.haloInner}
      />
      <rect
        x={c - MARK.handWidth / 2}
        y={c - MARK.minuteHand}
        width={MARK.handWidth}
        height={MARK.minuteHand}
        rx={MARK.handWidth / 2}
        fill={MARK_COLORS.hands}
      />
      <rect
        x={c - MARK.handWidth / 2}
        y={c - MARK.hourHand}
        width={MARK.handWidth}
        height={MARK.hourHand}
        rx={MARK.handWidth / 2}
        fill={MARK_COLORS.hands}
        transform={`rotate(${MARK.hourAngle} ${c} ${c})`}
      />
      <circle cx={c} cy={c} r={MARK.pin} fill={MARK_COLORS.hands} />
    </svg>
  );
};

export default Logo;
