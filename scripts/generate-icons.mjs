/**
 * Kodmigo icon generator
 * Uses the same 🦊 emoji as the landing page (HeroSection, MigoTipCard, etc.)
 * on kodmigo-navy (#0f172a) background.
 */
import { createCanvas } from "@napi-rs/canvas";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const NAVY = "#0f172a";
const FOX_EMOJI = "\u{1F98A}";

/** @param {number} size */
function renderFoxIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, size, size);

  const fontSize = Math.round(size * 0.72);
  ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(FOX_EMOJI, size / 2, size / 2 + size * 0.04);

  return canvas.toBuffer("image/png");
}

/** @param {number} width @param {number} height */
function renderOgImage(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#1e293b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const foxSize = Math.round(Math.min(width, height) * 0.55);
  ctx.font = `${foxSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(FOX_EMOJI, width / 2, height / 2 + foxSize * 0.03);

  return canvas.toBuffer("image/png");
}

async function writePng(buffer, filePath) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, buffer);
  console.log(`  ✓ ${path.relative(root, filePath)}`);
}

async function main() {
  console.log("Generating Kodmigo icons from landing-page 🦊 emoji...\n");

  const sizes = [
    { size: 16, publicName: "icon-16x16.png" },
    { size: 32, publicName: "icon-32x32.png" },
    { size: 180, publicName: "apple-touch-icon.png", appName: "apple-icon.png" },
    { size: 192, publicName: "icon-192x192.png" },
    { size: 512, publicName: "icon-512x512.png", appName: "icon.png" },
  ];

  for (const { size, publicName, appName } of sizes) {
    const buffer = renderFoxIcon(size);
    await writePng(buffer, path.join(root, "public", publicName));
    if (appName) {
      await writePng(buffer, path.join(root, "app", appName));
    }
  }

  const ogBuffer = renderOgImage(1200, 630);
  await writePng(ogBuffer, path.join(root, "public", "og-image.png"));

  const favicon16 = renderFoxIcon(16);
  const favicon32 = renderFoxIcon(32);
  const faviconIco = await toIco([favicon16, favicon32]);
  await fs.promises.writeFile(path.join(root, "public", "favicon.ico"), faviconIco);
  console.log("  ✓ public/favicon.ico");

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
