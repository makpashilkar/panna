import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import AboutModal from "./components/AboutModal.jsx";
import DesktopLayout from "./components/layout/DesktopLayout.jsx";
import MobileLayout from "./components/layout/MobileLayout.jsx";
import { LAYOUT_STYLES } from "./components/layout/layoutStyles.js";
import { getThemeById } from "./constants/themes.js";
import { ASPECT_RATIOS } from "./constants/aspectRatios.js";
import { getFontById, getFontImportUrl } from "./constants/fonts.js";
import { getUiTokens, UI_MODE_KEY } from "./constants/uiTokens.js";
import { resolveTheme } from "./utils/resolveTheme.js";
import { exportSlides } from "./utils/exportSlides.js";
import { insertBulletAtCursor } from "./utils/insertBullet.js";
import { loadDraft, saveDraft } from "./utils/draftStorage.js";
import { loadPresets, savePreset, deletePreset } from "./utils/themePresets.js";
import { useMediaQuery, MOBILE_QUERY } from "./hooks/useMediaQuery.js";

const MAX_SLIDES = 20;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function readUiMode() {
  try {
    const stored = localStorage.getItem(UI_MODE_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const DEFAULT_OVERRIDES = { bg: null, cardBg: null, accent: null, text: null };

export default function Panna() {
  const [slides, setSlides] = useState(
    () => loadDraft()?.slides ?? [{ id: generateId(), text: "", index: 0 }]
  );
  const [activeSlide, setActiveSlide] = useState(() => loadDraft()?.activeSlide ?? 0);
  const [themeId, setThemeId] = useState(() => loadDraft()?.themeId ?? "midnight");
  const [customOverrides, setCustomOverrides] = useState(
    () => loadDraft()?.customOverrides ?? DEFAULT_OVERRIDES
  );
  const [ratio, setRatio] = useState(() => loadDraft()?.ratio ?? "1:1");
  const [fontId, setFontId] = useState(() => loadDraft()?.fontId ?? "georgia");
  const [logo, setLogo] = useState(() => loadDraft()?.logo ?? null);
  const [exportFormat, setExportFormat] = useState(() => loadDraft()?.exportFormat ?? "zip");
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");
  const [uiMode, setUiMode] = useState(readUiMode);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [presets, setPresets] = useState(() => loadPresets());
  const [activePresetId, setActivePresetId] = useState(() => loadDraft()?.activePresetId ?? null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(null);

  const textareaRefs = useRef({});
  const previewRef = useRef(null);
  const slidePreviewRefs = useRef({});
  const logoInputRef = useRef(null);
  const skipDraftSave = useRef(true);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const ui = getUiTokens(uiMode);
  const baseTheme = getThemeById(themeId);
  const resolvedTheme = useMemo(
    () => resolveTheme(baseTheme, customOverrides),
    [baseTheme, customOverrides]
  );
  const font = getFontById(fontId);
  const fontImportUrl = getFontImportUrl(fontId);
  const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratio) || ASPECT_RATIOS[0];

  useEffect(() => {
    try {
      localStorage.setItem(UI_MODE_KEY, uiMode);
    } catch {
      /* ignore */
    }
  }, [uiMode]);

  useEffect(() => {
    const hrefs = [
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
      fontImportUrl,
    ].filter(Boolean);

    hrefs.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });
  }, [fontImportUrl]);

  useEffect(() => {
    setSlides((prev) => prev.map((s, i) => ({ ...s, index: i })));
  }, [slides.length]);

  useEffect(() => {
    skipDraftSave.current = false;
  }, []);

  useEffect(() => {
    if (skipDraftSave.current) return;
    const timer = setTimeout(() => {
      const ok = saveDraft({
        slides,
        activeSlide,
        themeId,
        customOverrides,
        ratio,
        fontId,
        logo,
        exportFormat,
        activePresetId,
      });
      setDraftSaved(ok);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    slides,
    activeSlide,
    themeId,
    customOverrides,
    ratio,
    fontId,
    logo,
    exportFormat,
    activePresetId,
  ]);

  const updateSlide = useCallback((id, text) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  }, []);

  const addSlide = useCallback((afterIndex) => {
    setSlides((prev) => {
      if (prev.length >= MAX_SLIDES) return prev;
      const newSlide = { id: generateId(), text: "", index: 0 };
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newSlide);
      const reindexed = next.map((s, i) => ({ ...s, index: i }));
      setActiveSlide(afterIndex + 1);
      setTimeout(() => {
        const el = textareaRefs.current[newSlide.id];
        if (el) el.focus();
      }, 50);
      return reindexed;
    });
  }, []);

  const removeSlide = useCallback(
    (index) => {
      if (slides.length === 1) return;
      setSlides((prev) => {
        const next = prev.filter((_, i) => i !== index);
        return next.map((s, i) => ({ ...s, index: i }));
      });
      setActiveSlide(Math.max(0, index - 1));
    },
    [slides.length]
  );

  const handleKeyDown = useCallback(
    (e, slide, index) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        addSlide(index);
      }
      if (e.key === "Backspace" && slide.text === "" && slides.length > 1) {
        e.preventDefault();
        removeSlide(index);
        setTimeout(() => {
          const prevSlide = slides[Math.max(0, index - 1)];
          if (prevSlide) {
            const el = textareaRefs.current[prevSlide.id];
            if (el) el.focus();
          }
        }, 50);
      }
    },
    [addSlide, removeSlide, slides]
  );

  const handleThemeSelect = (id) => {
    setThemeId(id);
    setCustomOverrides(DEFAULT_OVERRIDES);
    setActivePresetId(null);
  };

  const clearActivePreset = () => setActivePresetId(null);

  const handleSavePreset = (name) => {
    const preset = savePreset({
      id: generateId(),
      name,
      themeId,
      customOverrides,
      fontId,
      createdAt: new Date().toISOString(),
    });
    if (preset) {
      setPresets(loadPresets());
      setActivePresetId(preset.id);
    }
  };

  const handleApplyPreset = (preset) => {
    setThemeId(preset.themeId);
    setCustomOverrides(preset.customOverrides ?? DEFAULT_OVERRIDES);
    setFontId(preset.fontId);
    setActivePresetId(preset.id);
  };

  const handleDeletePreset = (id) => {
    setPresets(deletePreset(id));
    if (activePresetId === id) setActivePresetId(null);
  };

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
    requestAnimationFrame(() => {
      slidePreviewRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleInsertBullet = (slide) => {
    const el = textareaRefs.current[slide.id];
    const start = el?.selectionStart ?? slide.text.length;
    const end = el?.selectionEnd ?? start;
    const { text, cursor } = insertBulletAtCursor(slide.text, start, end);
    updateSlide(slide.id, text);
    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(cursor, cursor);
      }
    }, 0);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportMsg("Preparing export...");
    try {
      await exportSlides({
        previewRef,
        ratioId: ratio,
        backgroundColor: resolvedTheme.bg,
        format: exportFormat,
        onProgress: setExportMsg,
      });
      setTimeout(() => setExportMsg(""), 2500);
    } catch {
      setExportMsg("Export failed. Try again.");
      setTimeout(() => setExportMsg(""), 3000);
    } finally {
      setExporting(false);
    }
  };

  const toggleMobileSheet = (sheet) => {
    setMobileSheet((prev) => (prev === sheet ? null : sheet));
  };

  const atMaxSlides = slides.length >= MAX_SLIDES;

  const headerProps = {
    ui,
    draftSaved,
    uiMode,
    onUiModeToggle: () => setUiMode((m) => (m === "dark" ? "light" : "dark")),
    onAboutOpen: () => setAboutOpen(true),
    onExport: handleExport,
    exporting,
    exportMsg,
  };

  const controlsPanelProps = {
    ui,
    themeId,
    onThemeSelect: handleThemeSelect,
    customOverrides,
    onCustomBg: (v) => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, bg: v }));
    },
    onCustomCardBg: (v) => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, cardBg: v }));
    },
    onCustomAccent: (v) => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, accent: v }));
    },
    onCustomText: (v) => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, text: v }));
    },
    onResetBg: () => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, bg: null }));
    },
    onResetCardBg: () => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, cardBg: null }));
    },
    onResetAccent: () => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, accent: null }));
    },
    onResetText: () => {
      clearActivePreset();
      setCustomOverrides((o) => ({ ...o, text: null }));
    },
    ratio,
    onRatioChange: setRatio,
    fontId,
    onFontChange: setFontId,
    logo,
    onLogoUpload: handleLogoUpload,
    onLogoRemove: () => setLogo(null),
    logoInputRef,
    exportFormat,
    onExportFormatChange: setExportFormat,
    resolvedTheme,
    presets,
    activePresetId,
    onSavePreset: handleSavePreset,
    onApplyPreset: handleApplyPreset,
    onDeletePreset: handleDeletePreset,
  };

  const slideThreadProps = {
    ui,
    slides,
    activeSlide,
    resolvedTheme,
    atMaxSlides,
    textareaRefs,
    goToSlide,
    updateSlide,
    handleKeyDown,
    handleInsertBullet,
    removeSlide,
    addSlide,
  };

  const previewPanelProps = {
    ui,
    slides,
    activeSlide,
    resolvedTheme,
    ratio,
    ratioObj,
    logo,
    fontFamily: font.family,
    previewRef,
    slidePreviewRefs,
    goToSlide,
  };

  const layoutProps = {
    ui,
    headerProps,
    controlsPanelProps,
    slideThreadProps,
    previewPanelProps,
  };

  return (
    <div
      className="panna-root"
      style={{
        display: "flex",
        height: "100vh",
        minHeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: ui.shellBg,
        color: ui.text,
        overflow: "hidden",
        "--panna-border": ui.border,
      }}
    >
      <style>{LAYOUT_STYLES}</style>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} ui={ui} />
      {isMobile ? (
        <MobileLayout
          {...layoutProps}
          mobileSheet={mobileSheet}
          onToggleSheet={toggleMobileSheet}
          activeSlide={activeSlide}
          slideCount={slides.length}
        />
      ) : (
        <DesktopLayout {...layoutProps} />
      )}
    </div>
  );
}
