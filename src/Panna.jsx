import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import SlideCard from "./components/SlideCard.jsx";
import ControlsPanel from "./components/ControlsPanel.jsx";
import AboutModal from "./components/AboutModal.jsx";
import { getThemeById } from "./constants/themes.js";
import { ASPECT_RATIOS } from "./constants/aspectRatios.js";
import { getFontById, getFontImportUrl } from "./constants/fonts.js";
import { getUiTokens, UI_MODE_KEY } from "./constants/uiTokens.js";
import { resolveTheme } from "./utils/resolveTheme.js";
import { exportSlides } from "./utils/exportSlides.js";
import { insertBulletAtCursor } from "./utils/insertBullet.js";

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

export default function Panna() {
  const [slides, setSlides] = useState([{ id: generateId(), text: "", index: 0 }]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [themeId, setThemeId] = useState("midnight");
  const [customOverrides, setCustomOverrides] = useState({
    bg: null,
    cardBg: null,
    accent: null,
    text: null,
  });
  const [ratio, setRatio] = useState("1:1");
  const [fontId, setFontId] = useState("georgia");
  const [logo, setLogo] = useState(null);
  const [exportFormat, setExportFormat] = useState("zip");
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");
  const [uiMode, setUiMode] = useState(readUiMode);
  const [aboutOpen, setAboutOpen] = useState(false);

  const textareaRefs = useRef({});
  const previewRef = useRef(null);
  const slidePreviewRefs = useRef({});
  const logoInputRef = useRef(null);

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
    setCustomOverrides({ bg: null, cardBg: null, accent: null, text: null });
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

  const atMaxSlides = slides.length >= MAX_SLIDES;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        minHeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: ui.shellBg,
        color: ui.text,
        overflow: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        html, body, #root { height: 100%; }
        textarea { resize: none; outline: none; border: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .slide-thread:hover .slide-actions { opacity: 1 !important; }
      `}</style>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} ui={ui} />

      {/* LEFT PANEL */}
      <div
        style={{
          width: 380,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${ui.border}`,
          background: ui.panelBg,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${ui.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.5px",
                color: ui.text,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              panna
            </span>
            <span style={{ fontSize: 11, color: ui.textDim }}>carousel maker</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setAboutOpen(true)}
              style={{
                background: "transparent",
                border: `1px solid ${ui.inputBorder}`,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                color: ui.textFaint,
                cursor: "pointer",
              }}
            >
              About
            </button>
            <button
              onClick={() => setUiMode((m) => (m === "dark" ? "light" : "dark"))}
              title={uiMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: "transparent",
                border: `1px solid ${ui.inputBorder}`,
                borderRadius: 8,
                padding: "6px 8px",
                fontSize: 14,
                cursor: "pointer",
                lineHeight: 1,
                color: ui.textFaint,
              }}
            >
              {uiMode === "dark" ? "☀" : "☾"}
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                background: ui.accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: exporting ? "not-allowed" : "pointer",
                opacity: exporting ? 0.7 : 1,
                whiteSpace: "nowrap",
                minWidth: 120,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {exporting || exportMsg ? exportMsg || "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        <ControlsPanel
          ui={ui}
          themeId={themeId}
          onThemeSelect={handleThemeSelect}
          customOverrides={customOverrides}
          onCustomBg={(v) => setCustomOverrides((o) => ({ ...o, bg: v }))}
          onCustomCardBg={(v) => setCustomOverrides((o) => ({ ...o, cardBg: v }))}
          onCustomAccent={(v) => setCustomOverrides((o) => ({ ...o, accent: v }))}
          onCustomText={(v) => setCustomOverrides((o) => ({ ...o, text: v }))}
          onResetBg={() => setCustomOverrides((o) => ({ ...o, bg: null }))}
          onResetCardBg={() => setCustomOverrides((o) => ({ ...o, cardBg: null }))}
          onResetAccent={() => setCustomOverrides((o) => ({ ...o, accent: null }))}
          onResetText={() => setCustomOverrides((o) => ({ ...o, text: null }))}
          ratio={ratio}
          onRatioChange={setRatio}
          fontId={fontId}
          onFontChange={setFontId}
          logo={logo}
          onLogoUpload={handleLogoUpload}
          onLogoRemove={() => setLogo(null)}
          logoInputRef={logoInputRef}
          exportFormat={exportFormat}
          onExportFormatChange={setExportFormat}
          resolvedTheme={resolvedTheme}
        />

        {/* Slide thread */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: ui.textMuted,
                margin: 0,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Slides · {slides.length}
              {atMaxSlides ? " (max)" : ""}
            </p>
            <span style={{ fontSize: 10, color: ui.textDim }}>⌘↵ new slide</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="slide-thread"
                style={{ display: "flex", position: "relative" }}
                onClick={() => goToSlide(index)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 24,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: activeSlide === index ? resolvedTheme.accent : ui.inputBorder,
                      marginTop: 16,
                      flexShrink: 0,
                    }}
                  />
                  {index < slides.length - 1 && (
                    <div
                      style={{ width: 1, flex: 1, background: ui.railLine, minHeight: 12 }}
                    />
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    background: activeSlide === index ? ui.inputBg : "transparent",
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginBottom: 4,
                    border: `1px solid ${activeSlide === index ? ui.inputBorder : "transparent"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 10, color: ui.textDim, marginBottom: 4, display: "block" }}>
                      Slide {index + 1}
                    </span>
                    <div
                      className="slide-actions"
                      style={{ opacity: 0, transition: "opacity 0.15s", display: "flex", gap: 4 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsertBullet(slide);
                        }}
                        style={{
                          background: "none",
                          border: `1px solid ${ui.inputBorder}`,
                          borderRadius: 4,
                          color: ui.textFaint,
                          cursor: "pointer",
                          fontSize: 10,
                          padding: "1px 6px",
                        }}
                        title="Insert bullet"
                      >
                        • Bullet
                      </button>
                      {slides.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlide(index);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: ui.textFaint,
                            cursor: "pointer",
                            fontSize: 16,
                            lineHeight: 1,
                          }}
                          title="Remove slide"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    ref={(el) => {
                      if (el) textareaRefs.current[slide.id] = el;
                    }}
                    value={slide.text}
                    placeholder={
                      index === 0
                        ? "New arrivals this week — type one line per bullet..."
                        : "Add content for this slide..."
                    }
                    onChange={(e) => updateSlide(slide.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, slide, index)}
                    onFocus={() => goToSlide(index)}
                    rows={3}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: ui.inputText,
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: "system-ui, sans-serif",
                      caretColor: resolvedTheme.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {!atMaxSlides && (
            <button
              onClick={() => addSlide(slides.length - 1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
                marginLeft: 24,
                background: "transparent",
                border: `1px dashed ${ui.inputBorder}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: ui.textFaint,
                fontSize: 12,
                cursor: "pointer",
                width: "calc(100% - 24px)",
              }}
            >
              + Add slide
            </button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL — preview stays dark-neutral */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: ui.previewShellBg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px 14px",
            borderBottom: `1px solid ${ui.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: ui.textFaint, fontWeight: 500 }}>
            Preview · {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                style={{
                  width: i === activeSlide ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeSlide ? resolvedTheme.accent : ui.hoverBg,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        <div
          ref={previewRef}
          style={{
            flex: 1,
            overflow: "auto",
            padding: 32,
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="export-card"
              ref={(el) => {
                slidePreviewRefs.current[index] = el;
              }}
              onClick={() => goToSlide(index)}
              style={{
                cursor: "pointer",
                outline:
                  activeSlide === index
                    ? `2px solid ${resolvedTheme.accent}`
                    : "2px solid transparent",
                borderRadius: 18,
                flexShrink: 0,
              }}
            >
              <SlideCard
                slide={slide}
                theme={resolvedTheme}
                ratioId={ratio}
                logo={logo}
                fontFamily={font.family}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 24px",
            borderTop: `1px solid ${ui.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: ui.previewHint }}>
            {ratioObj.w}×{ratioObj.h}px · {ratioObj.subtitle} · High-res PNG export
          </span>
          <span style={{ fontSize: 11, color: ui.previewHint }}>Scroll to see all slides →</span>
        </div>
      </div>
    </div>
  );
}
