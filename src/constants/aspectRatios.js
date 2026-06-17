export const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", subtitle: "Instagram", w: 1080, h: 1080 },
  { id: "4:5", label: "4:5", subtitle: "LinkedIn", w: 1080, h: 1350 },
  { id: "9:16", label: "9:16", subtitle: "Stories", w: 1080, h: 1920 },
];

export const PREVIEW_BASE = 320;

export function getPreviewHeight(ratioId) {
  const ratio = ASPECT_RATIOS.find((r) => r.id === ratioId);
  return ratio ? Math.round((PREVIEW_BASE * ratio.h) / ratio.w) : PREVIEW_BASE;
}
