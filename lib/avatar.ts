export const MAX_AVATAR_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_AVATAR_DATA_URL_CHARS = 500_000;
export const AVATAR_MAX_DIMENSION = 256;
export const AVATAR_JPEG_QUALITY = 0.82;

export const AVATAR_TOO_LARGE_MESSAGE =
  "Profil fotoğrafı çok büyük. Lütfen daha küçük bir görsel seç.";

export function isAvatarDataUrlTooLarge(dataUrl: string): boolean {
  return dataUrl.length > MAX_AVATAR_DATA_URL_CHARS;
}

export async function processAvatarFile(
  file: File,
): Promise<{ dataUrl: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "Lütfen bir görsel dosyası seç." };
  }

  if (file.size > MAX_AVATAR_FILE_BYTES) {
    return { error: AVATAR_TOO_LARGE_MESSAGE };
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const dataUrl = resizeImageToDataUrl(image);

    if (isAvatarDataUrlTooLarge(dataUrl)) {
      return { error: AVATAR_TOO_LARGE_MESSAGE };
    }

    return { dataUrl };
  } catch {
    return { error: "Görsel işlenemedi. Lütfen başka bir dosya dene." };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed"));
    image.src = src;
  });
}

function resizeImageToDataUrl(image: HTMLImageElement): string {
  const scale = Math.min(
    1,
    AVATAR_MAX_DIMENSION / Math.max(image.width, image.height),
  );

  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context unavailable");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY);
}
