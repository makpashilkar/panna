export const UI_DARK = {
  shellBg: "#0A0A0A",
  panelBg: "#0D0D0D",
  previewShellBg: "#070707",
  border: "#1A1A1A",
  borderSubtle: "#111",
  text: "#F0EDE8",
  textMuted: "#555",
  textFaint: "#444",
  textDim: "#333",
  inputBg: "#111",
  inputBorder: "#222",
  inputText: "#D0CCC8",
  accent: "#FF4D5A",
  accentHover: "#FF6070",
  hoverBg: "#1A1A1A",
  railLine: "#1D1D1D",
  previewHint: "#2A2A2A",
};

export const UI_LIGHT = {
  shellBg: "#F5F5F5",
  panelBg: "#FFFFFF",
  previewShellBg: "#E8E8E8",
  border: "#E0E0E0",
  borderSubtle: "#EBEBEB",
  text: "#1A1A1A",
  textMuted: "#666",
  textFaint: "#888",
  textDim: "#AAA",
  inputBg: "#F9F9F9",
  inputBorder: "#DDD",
  inputText: "#333",
  accent: "#FF4D5A",
  accentHover: "#FF6070",
  hoverBg: "#F0F0F0",
  railLine: "#E5E5E5",
  previewHint: "#999",
};

export function getUiTokens(mode) {
  return mode === "light" ? UI_LIGHT : UI_DARK;
}

export const UI_MODE_KEY = "panna-ui-mode";
