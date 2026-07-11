/**
 * Generates Kodmigo favicon set with true transparent background.
 * Removes baked-in checkerboard from the transparent favicon source.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ICON_VERSION = "2";

const transparentSource =
  "C:\\Users\\Efe\\.cursor\\projects\\c-Users-Efe-Desktop-Kodmigo\\assets\\c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Arka_plans_z_favicon-4b885811-bb42-4208-b8ef-4bec8ca32274.png";

const navySources = {
  main: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Ana__kon-301d990d-d69b-43a9-a085-9512b1c08e59.png",
  pwa192: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_PWA__kon-0dee0fa8-1546-439c-8ef8-231dced49a56.png",
  apple: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Apple_Touch__kon-b2dc0ebd-64c0-4a7b-b263-d38775a7c697.png",
};

const assetsDir =
  "C:\\Users\\Efe\\.cursor\\projects\\c-Users-Efe-Desktop-Kodmigo\\assets";

function navySrc(name) {
  return path.join(assetsDir, navySources[name]);
}

function isBackgroundPixel(r, g, b) {
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));

  if (maxDiff > 24) {
    return false;
  }

  if (r > 248 && g > 248 && b > 248) {
    return true;
  }

  if (r >= 160 && r <= 235) {
    return true;
  }

  return false;
}

async function removeCheckerboard(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (isBackgroundPixel(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function cropFoxHead(image) {
  const trimmed = await image.clone().trim().toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;

  const headHeight = Math.round(height * 0.68);
  const headWidth = Math.round(width * 0.82);
  const left = Math.round((width - headWidth) / 2);
  const top = 0;

  return sharp(trimmed.data)
    .extract({ left, top, width: headWidth, height: headHeight })
    .extend({
      top: Math.round(headHeight * 0.06),
      bottom: Math.round(headHeight * 0.06),
      left: Math.round(headWidth * 0.06),
      right: Math.round(headWidth * 0.06),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png();
}

async function renderFaviconSize(headImage, size) {
  const padding = Math.round(size * 0.08);

  return headImage
    .clone()
    .resize(size - padding * 2, size - padding * 2, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function writePng(buffer, filePath) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(
    `  ✓ ${path.relative(root, filePath)} (${meta.width}x${meta.height}, alpha=${meta.hasAlpha})`,
  );
}

async function copyNavyPng(from, to, width, height) {
  await fs.promises.mkdir(path.dirname(to), { recursive: true });
  await sharp(from).resize(width, height, { fit: "fill" }).png().toFile(to);
  console.log(`  ✓ ${path.relative(root, to)} (${width}x${height}, navy)`);
}

async function main() {
  console.log("Generating transparent Kodmigo favicons...\n");

  const transparentFox = await removeCheckerboard(transparentSource);
  const headImage = await cropFoxHead(transparentFox);

  const favicon16 = await renderFaviconSize(headImage, 16);
  const favicon32 = await renderFaviconSize(headImage, 32);

  await writePng(favicon16, path.join(root, "public", "favicon-16x16.png"));
  await writePng(favicon32, path.join(root, "public", "favicon-32x32.png"));

  const faviconIco = await toIco([favicon16, favicon32]);
  await fs.promises.writeFile(path.join(root, "public", "favicon.ico"), faviconIco);
  console.log("  ✓ public/favicon.ico (16+32, transparent)");

  console.log("\nRefreshing PWA / Apple icons (navy background)...\n");

  await copyNavyPng(navySrc("pwa192"), path.join(root, "public", "icon-192x192.png"), 192, 192);
  await copyNavyPng(navySrc("main"), path.join(root, "public", "icon-512x512.png"), 512, 512);
  await copyNavyPng(navySrc("apple"), path.join(root, "public", "apple-touch-icon.png"), 180, 180);
  await copyNavyPng(navySrc("apple"), path.join(root, "app", "apple-icon.png"), 180, 180);

  const conflicts = [
    path.join(root, "app", "icon.png"),
    path.join(root, "app", "favicon.ico"),
    path.join(root, "public", "icon-16x16.png"),
    path.join(root, "public", "icon-32x32.png"),
    path.join(root, "public", "favicon.png"),
    path.join(root, "public", "icon.png"),
  ];

  console.log("\nRemoving conflicting favicon files...\n");
  for (const filePath of conflicts) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`  ✗ removed ${path.relative(root, filePath)}`);
    }
  }

  console.log(`\nIcon version: v${ICON_VERSION}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
