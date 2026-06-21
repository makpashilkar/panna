export const DRAFT_KEY = "panna-draft-v1";
const DRAFT_VERSION = 1;

export function serializeDraft(state) {
  return {
    version: DRAFT_VERSION,
    savedAt: new Date().toISOString(),
    slides: state.slides.map(({ id, text, index }) => ({ id, text, index })),
    activeSlide: state.activeSlide,
    themeId: state.themeId,
    customOverrides: state.customOverrides,
    ratio: state.ratio,
    fontId: state.fontId,
    logo: state.logo,
    exportFormat: state.exportFormat,
    activePresetId: state.activePresetId ?? null,
  };
}

function isValidDraft(data) {
  if (!data || data.version !== DRAFT_VERSION) return false;
  if (!Array.isArray(data.slides) || data.slides.length === 0) return false;
  return data.slides.every(
    (s) => typeof s.id === "string" && typeof s.text === "string" && typeof s.index === "number"
  );
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!isValidDraft(data)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveDraft(state) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(serializeDraft(state)));
    return true;
  } catch {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(serializeDraft({ ...state, logo: null })));
      return true;
    } catch {
      return false;
    }
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
