import html2canvas from "html2canvas";

type TrimOptions = {
  padding?: number;
  /** 0-255: higher = more strict about treating near-white as background */
  whiteThreshold?: number;
  /** Performance: sample every N pixels while scanning */
  sampleStep?: number;
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to create image blob"));
      resolve(blob);
    }, "image/png", 1);
  });

const trimCanvasWhitespace = (
  canvas: HTMLCanvasElement,
  { padding = 12, whiteThreshold = 250, sampleStep = 2 }: TrimOptions = {}
) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const isBackground = (idx: number) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    // treat fully/mostly transparent as background too
    if (a < 10) return true;
    return r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold;
  };

  let top = height;
  let left = width;
  let right = 0;
  let bottom = 0;

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const idx = (y * width + x) * 4;
      if (!isBackground(idx)) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  // If we didn't find any non-background pixels, return original
  if (top > bottom || left > right) return canvas;

  // Apply padding and clamp
  top = Math.max(0, top - padding);
  left = Math.max(0, left - padding);
  right = Math.min(width - 1, right + padding);
  bottom = Math.min(height - 1, bottom + padding);

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;

  const out = document.createElement("canvas");
  out.width = trimmedWidth;
  out.height = trimmedHeight;

  const outCtx = out.getContext("2d");
  if (!outCtx) return canvas;

  outCtx.drawImage(canvas, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
  return out;
};

export async function renderWarrantyCardPngBlob(
  element: HTMLElement,
  options?: {
    scale?: number;
    trim?: TrimOptions;
  }
): Promise<Blob> {
  // Ensure fonts are loaded before rasterizing (avoids Bengali text shifting/garbling)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fonts = (document as any).fonts as FontFaceSet | undefined;
  if (fonts?.ready) {
    try {
      await fonts.ready;
    } catch {
      // ignore
    }
  }

  const canvas = await html2canvas(element, {
    scale: options?.scale ?? 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const trimmed = trimCanvasWhitespace(canvas, options?.trim);
  return canvasToBlob(trimmed);
}
