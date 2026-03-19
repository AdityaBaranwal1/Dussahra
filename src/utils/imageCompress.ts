/**
 * Compresses an image File to a JPEG base64 string.
 * Resizes proportionally so the longest edge is maxDimension pixels.
 * Returns { base64, mimeType } where base64 does NOT include the data: prefix.
 */
export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.75
): Promise<{ base64: string; mimeType: string }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error('Failed to load image for compression.'));
      image.src = objectUrl;
    });

    let { width, height } = img;

    if (width > maxDimension || height > maxDimension) {
      if (width >= height) {
        height = Math.round((height / width) * maxDimension);
        width = maxDimension;
      } else {
        width = Math.round((width / height) * maxDimension);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to obtain 2D canvas context for image compression.');
    }

    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    const prefix = 'data:image/jpeg;base64,';
    if (!dataUrl.startsWith(prefix)) {
      throw new Error('Canvas exported an unexpected data URL format.');
    }

    const base64 = dataUrl.slice(prefix.length);

    return { base64, mimeType: 'image/jpeg' };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
