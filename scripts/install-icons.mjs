/**
 * Installs user-provided Kodmigo icon assets into public/ and app/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assetsDir =
  "C:\\Users\\Efe\\.cursor\\projects\\c-Users-Efe-Desktop-Kodmigo\\assets";

const sources = {
  main: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Ana__kon-301d990d-d69b-43a9-a085-9512b1c08e59.png",
  pwa192: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_PWA__kon-0dee0fa8-1546-439c-8ef8-231dced49a56.png",
  og: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Open_Graph-0f6eaabb-065e-4bfa-913b-3ed7ded192ae.png",
  favicon16: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Favicon_16x-76e9c11c-ea0f-4ff1-8070-83e9a31d63bf.png",
  favicon32: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Favicon_32x-4b9a7055-9ed9-4fd3-b711-2b547e0065ad.png",
  apple: "c__Users_Efe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Apple_Touch__kon-b2dc0ebd-64c0-4a7b-b263-d38775a7c697.png",
};

function src(name) {
  return path.join(assetsDir, sources[name]);
}

async function copyPng(from, to) {
  await fs.promises.mkdir(path.dirname(to), { recursive: true });
  await sharp(from).png().toFile(to);
  console.log(`  ✓ ${path.relative(root, to)}`);
}

async function resizePng(from, to, width, height) {
  await fs.promises.mkdir(path.dirname(to), { recursive: true });
  await sharp(from).resize(width, height, { fit: "fill" }).png().toFile(to);
  console.log(`  ✓ ${path.relative(root, to)} (${width}x${height})`);
}

async function main() {
  console.log("Installing Kodmigo icon set...\n");

  await copyPng(src("favicon16"), path.join(root, "public", "icon-16x16.png"));
  await copyPng(src("favicon32"), path.join(root, "public", "icon-32x32.png"));

  const favicon16 = await sharp(src("favicon16")).png().toBuffer();
  const favicon32 = await sharp(src("favicon32")).png().toBuffer();
  const faviconIco = await toIco([favicon16, favicon32]);
  await fs.promises.writeFile(path.join(root, "public", "favicon.ico"), faviconIco);
  console.log("  ✓ public/favicon.ico");

  await copyPng(src("apple"), path.join(root, "public", "apple-touch-icon.png"));
  await copyPng(src("apple"), path.join(root, "app", "apple-icon.png"));

  await copyPng(src("pwa192"), path.join(root, "public", "icon-192x192.png"));

  await resizePng(src("main"), path.join(root, "public", "icon-512x512.png"), 512, 512);
  await resizePng(src("main"), path.join(root, "app", "icon.png"), 512, 512);

  await resizePng(src("og"), path.join(root, "public", "og-image.png"), 1200, 630);
  await resizePng(src("og"), path.join(root, "app", "opengraph-image.png"), 1200, 630);

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
