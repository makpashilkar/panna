import JSZip from "jszip";
import { ASPECT_RATIOS, PREVIEW_BASE } from "../constants/aspectRatios.js";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHtml2Canvas() {
  if (!window.html2canvas) throw new Error("html2canvas not loaded");
  return window.html2canvas;
}

async function renderSlides(cards, ratioId, backgroundColor, onProgress) {
  const html2canvas = getHtml2Canvas();
  const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratioId) || ASPECT_RATIOS[0];
  const scale = ratioObj.w / PREVIEW_BASE;
  const blobs = [];

  for (let i = 0; i < cards.length; i++) {
    onProgress(`Rendering slide ${i + 1} of ${cards.length}...`);
    const target = cards[i].firstElementChild || cards[i];
    const canvas = await html2canvas(target, {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
    });
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error(`Failed to render slide ${i + 1}`);
    blobs.push(blob);
  }

  return blobs;
}

export async function exportSlides({
  previewRef,
  ratioId,
  backgroundColor,
  format,
  onProgress,
}) {
  const cards = previewRef.current?.querySelectorAll(".export-card");
  if (!cards || cards.length === 0) throw new Error("No cards found");

  onProgress("Preparing export...");
  const blobs = await renderSlides(cards, ratioId, backgroundColor, onProgress);

  if (format === "zip") {
    onProgress("Zipping files...");
    const zip = new JSZip();
    blobs.forEach((blob, i) => zip.file(`panna-slide-${i + 1}.png`, blob));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, "panna-carousel.zip");
    onProgress("Downloaded!");
    return;
  }

  onProgress("Downloading PNGs...");
  for (let i = 0; i < blobs.length; i++) {
    downloadBlob(blobs[i], `panna-slide-${i + 1}.png`);
    if (i < blobs.length - 1) await delay(300);
  }
  onProgress("Downloaded!");
}
