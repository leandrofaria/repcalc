/**
 * Renders the app icons from one SVG source.
 *
 * The only mark the project had was a 64x64 webp, which cannot be upscaled to
 * the 512 a PWA install needs. Drawing it as vector means the icon set is
 * reproducible and stays in step with the palette.
 *
 * Run with: npm run icons
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public", "icons");
// Next serves these two by file convention, which is what replaces
// the old favicon.ico.
const APP = join(process.cwd(), "src", "app");

const BRAND = "#0F766E";
const ON_BRAND = "#FFFFFF";

/**
 * A clock ring with the worked part of a shift drawn over it. The default
 * journey is 5h45 of a 12-hour dial, which is the arc below.
 */
function mark({ size = 512, inset = 1, rounded = true }) {
  const c = size / 2;
  const radius = size * 0.293 * inset;
  const stroke = size * 0.055 * inset;
  const dot = size * 0.052 * inset;

  const sweep = (5.75 / 12) * 360;
  const point = (deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + radius * Math.cos(rad), c + radius * Math.sin(rad)];
  };
  const [x0, y0] = point(0);
  const [x1, y1] = point(sweep);
  const largeArc = sweep > 180 ? 1 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}"${rounded ? ` rx="${size * 0.22}"` : ""} fill="${BRAND}"/>
  <circle cx="${c}" cy="${c}" r="${radius}" fill="none" stroke="${ON_BRAND}" stroke-opacity="0.3" stroke-width="${stroke}"/>
  <path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}"
        fill="none" stroke="${ON_BRAND}" stroke-width="${stroke}" stroke-linecap="round"/>
  <circle cx="${x1.toFixed(2)}" cy="${y1.toFixed(2)}" r="${dot}" fill="${ON_BRAND}"/>
</svg>`;
}

const TARGETS = [
  { file: "icon.svg", svg: mark({}) },
  { file: "icon-192.png", size: 192, svg: mark({}) },
  { file: "icon-512.png", size: 512, svg: mark({}) },
  // Maskable icons are cropped to a circle by some launchers, so the glyph
  // sits inside the 80% safe zone and the ground bleeds to the edges.
  {
    file: "icon-maskable-512.png",
    size: 512,
    svg: mark({ inset: 0.72, rounded: false }),
  },
  { file: "apple-touch-icon.png", size: 180, svg: mark({ rounded: false }) },
];

await mkdir(OUT, { recursive: true });

for (const target of TARGETS) {
  const path = join(OUT, target.file);
  if (target.file.endsWith(".svg")) {
    await writeFile(path, target.svg, "utf8");
  } else {
    await sharp(Buffer.from(target.svg)).resize(target.size).png().toFile(path);
  }
  console.log("wrote", target.file);
}

// The browser tab icon and the iOS home-screen icon, by Next's file
// convention. Same source, so they cannot drift from the palette.
await writeFile(join(APP, "icon.svg"), mark({}), "utf8");
await sharp(Buffer.from(mark({ rounded: false })))
  .resize(180)
  .png()
  .toFile(join(APP, "apple-icon.png"));
console.log("wrote src/app/icon.svg and src/app/apple-icon.png");
