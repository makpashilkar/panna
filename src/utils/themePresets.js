export const PRESETS_KEY = "panna-theme-presets-v1";
const MAX_PRESETS = 10;

function persistPresets(presets) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        typeof p.themeId === "string" &&
        p.customOverrides &&
        typeof p.fontId === "string"
    );
  } catch {
    return [];
  }
}

export function savePreset(preset) {
  const presets = loadPresets();
  if (presets.length >= MAX_PRESETS) {
    presets.shift();
  }
  presets.push(preset);
  try {
    persistPresets(presets);
    return preset;
  } catch {
    return null;
  }
}

export function deletePreset(id) {
  const presets = loadPresets().filter((p) => p.id !== id);
  try {
    persistPresets(presets);
    return presets;
  } catch {
    return loadPresets();
  }
}
