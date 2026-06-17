import { useState, useRef, useCallback, useEffect } from "react";

const THEMES = [
  {
    id: "midnight",
    name: "Midnight",
    bg: "#0D1117",
    text: "#F0EDE8",
    accent: "#FF4D5A",
    cardBg: "#161B22",
    font: "serif",
  },
  {
    id: "paper",
    name: "Paper",
    bg: "#F5F0E8",
    text: "#1A1A1A",
    accent: "#3563E9",
    cardBg: "#FFFFFF",
    font: "sans",
  },
  {
    id: "forest",
    name: "Forest",
    bg: "#1A2B1A",
    text: "#D4F0C0",
    accent: "#5FD068",
    cardBg: "#1F331F",
    font: "sans",
  },
  {
    id: "cream",
    name: "Cream",
    bg: "#2D1B0E",
    text: "#FAE8C8",
    accent: "#E8A838",
    cardBg: "#3A2415",
    font: "serif",
  },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", subtitle: "Instagram", w: 1080, h: 1080 },
  { id: "4:5", label: "4:5", subtitle: "LinkedIn", w: 1080, h: 1350 },
  { id: "9:16", label: "9:16", subtitle: "Stories", w: 1080, h: 1920 },
];

const PREVIEW_BASE = 320;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function SlideCard({ slide, theme, ratio, logo, accentColor }) {
  const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratio);
  const previewH = ratioObj
    ? Math.round((PREVIEW_BASE * ratioObj.h) / ratioObj.w)
    : PREVIEW_BASE;

  const bg = accentColor || theme.accent;
  const lines = slide.text.split("\n").filter((l) => l.trim());

  return (
    <div
      style={{
        width: PREVIEW_BASE,
        height: previewH,
        background: theme.bg,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 28,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        border: `1px solid ${theme.cardBg}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: bg,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {logo && (
        <img
          src={logo}
          alt="logo"
          style={{ height: 28, objectFit: "contain", alignSelf: "flex-start", marginBottom: 8 }}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {lines.length === 0 ? (
          <p
            style={{
              color: `${theme.text}40`,
              fontSize: 15,
              fontFamily: "inherit",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Start typing...
          </p>
        ) : (
          lines.map((line, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 8px 0",
                color: theme.text,
                fontSize: 15,
                lineHeight: 1.55,
                fontFamily: theme.font === "serif" ? "Georgia, serif" : "inherit",
              }}
            >
              {line}
            </p>
          ))
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 24, height: 2, background: bg, borderRadius: 1 }} />
        <span
          style={{
            fontSize: 11,
            color: `${theme.text}60`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {slide.index + 1}
        </span>
      </div>
    </div>
  );
}

export default function Panna() {
  const [slides, setSlides] = useState([
    { id: generateId(), text: "", index: 0 },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [themeId, setThemeId] = useState("midnight");
  const [ratio, setRatio] = useState("1:1");
  const [logo, setLogo] = useState(null);
  const [accentColor, setAccentColor] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  const textareaRefs = useRef({});
  const previewRef = useRef(null);
  const logoInputRef = useRef(null);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const updateSlide = useCallback((id, text) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  }, []);

  const addSlide = useCallback((afterIndex) => {
    const newSlide = { id: generateId(), text: "", index: 0 };
    setSlides((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newSlide);
      return next.map((s, i) => ({ ...s, index: i }));
    });
    setActiveSlide(afterIndex + 1);
    setTimeout(() => {
      const el = textareaRefs.current[newSlide.id];
      if (el) el.focus();
    }, 50);
  }, []);

  const removeSlide = useCallback((index) => {
    if (slides.length === 1) return;
    setSlides((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.map((s, i) => ({ ...s, index: i }));
    });
    setActiveSlide(Math.max(0, index - 1));
  }, [slides.length]);

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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleExport = async () => {
    if (typeof window === "undefined") return;
    setExporting(true);
    setExportMsg("Preparing export...");

    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      const cards = previewRef.current?.querySelectorAll(".export-card");
      if (!cards || cards.length === 0) throw new Error("No cards found");

      const zip = new window.JSZip();
      const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratio);
      const scale = ratioObj ? ratioObj.w / PREVIEW_BASE : 1;

      for (let i = 0; i < cards.length; i++) {
        setExportMsg(`Rendering slide ${i + 1} of ${cards.length}...`);
        const canvas = await window.html2canvas(cards[i], {
          scale,
          useCORS: true,
          backgroundColor: theme.bg,
          logging: false,
        });
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        zip.file(`panna-slide-${i + 1}.png`, blob);
      }

      setExportMsg("Zipping files...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "panna-carousel.zip";
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg("Downloaded!");
      setTimeout(() => setExportMsg(""), 2500);
    } catch (err) {
      setExportMsg("Export failed. Try again.");
      setTimeout(() => setExportMsg(""), 3000);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setSlides((prev) => prev.map((s, i) => ({ ...s, index: i })));
  }, [slides.length]);

  const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratio);
  const previewH = ratioObj
    ? Math.round((PREVIEW_BASE * ratioObj.h) / ratioObj.w)
    : PREVIEW_BASE;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        minHeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#0A0A0A",
        color: "#F0EDE8",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        textarea { resize: none; outline: none; border: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .slide-thread:hover .slide-actions { opacity: 1 !important; }
        .theme-btn:hover { border-color: #555 !important; }
        .export-btn:hover { background: #FF6070 !important; }
        .ratio-btn:hover { background: #1A1A1A !important; }
        .add-btn:hover { background: #1A1A1A !important; }
      `}</style>

      {/* LEFT PANEL */}
      <div
        style={{
          width: 380,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #1A1A1A",
          background: "#0D0D0D",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid #1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.5px",
                color: "#F0EDE8",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              panna
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#444",
                marginLeft: 8,
                fontWeight: 400,
              }}
            >
              carousel maker
            </span>
          </div>
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={exporting}
            style={{
              background: "#FF4D5A",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: exporting ? "not-allowed" : "pointer",
              opacity: exporting ? 0.7 : 1,
              transition: "background 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {exporting ? (
              exportMsg || "Exporting..."
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export ZIP
              </>
            )}
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #1A1A1A" }}>
          {/* Themes */}
          <p style={{ fontSize: 11, color: "#555", margin: "0 0 8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Theme
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                className="theme-btn"
                onClick={() => setThemeId(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: `1px solid ${themeId === t.id ? "#FF4D5A" : "#222"}`,
                  borderRadius: 6,
                  padding: "5px 10px",
                  cursor: "pointer",
                  color: themeId === t.id ? "#FF4D5A" : "#888",
                  fontSize: 12,
                  fontWeight: themeId === t.id ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: t.bg,
                    border: `2px solid ${t.accent}`,
                  }}
                />
                {t.name}
              </button>
            ))}
          </div>

          {/* Aspect Ratio */}
          <p style={{ fontSize: 11, color: "#555", margin: "0 0 8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Aspect Ratio
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {ASPECT_RATIOS.map((r) => (
              <button
                key={r.id}
                className="ratio-btn"
                onClick={() => setRatio(r.id)}
                style={{
                  background: ratio === r.id ? "#1A1A1A" : "transparent",
                  border: `1px solid ${ratio === r.id ? "#FF4D5A" : "#222"}`,
                  borderRadius: 6,
                  padding: "5px 12px",
                  cursor: "pointer",
                  color: ratio === r.id ? "#FF4D5A" : "#666",
                  fontSize: 12,
                  fontWeight: ratio === r.id ? 600 : 400,
                  transition: "all 0.15s",
                  lineHeight: 1.4,
                  textAlign: "center",
                }}
              >
                <div>{r.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{r.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Custom color + Logo */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontSize: 11, color: "#555", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Accent
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="color"
                  value={accentColor || theme.accent}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    width: 32,
                    height: 28,
                    border: "1px solid #222",
                    borderRadius: 6,
                    cursor: "pointer",
                    padding: 2,
                    background: "transparent",
                  }}
                />
                {accentColor && (
                  <button
                    onClick={() => setAccentColor("")}
                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, padding: 0 }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontSize: 11, color: "#555", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Logo
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    background: "transparent",
                    border: "1px solid #222",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "#888",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {logo ? "Change" : "Upload"}
                </button>
                {logo && (
                  <button
                    onClick={() => setLogo(null)}
                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, padding: 0 }}
                  >
                    Remove
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thread Input */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "#555", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Slides · {slides.length}
            </p>
            <span style={{ fontSize: 10, color: "#333" }}>⌘↵ new slide</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="slide-thread"
                style={{ display: "flex", gap: 0, position: "relative" }}
                onClick={() => setActiveSlide(index)}
              >
                {/* Rail */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: activeSlide === index ? (accentColor || theme.accent) : "#222",
                      marginTop: 16,
                      flexShrink: 0,
                      transition: "background 0.15s",
                      border: activeSlide === index ? "none" : "1px solid #333",
                    }}
                  />
                  {index < slides.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "#1D1D1D", minHeight: 12 }} />
                  )}
                </div>

                {/* Input area */}
                <div
                  style={{
                    flex: 1,
                    background: activeSlide === index ? "#111" : "transparent",
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginBottom: 4,
                    border: `1px solid ${activeSlide === index ? "#222" : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, color: "#333", fontVariantNumeric: "tabular-nums", marginBottom: 4, display: "block" }}>
                      Slide {index + 1}
                    </span>
                    <div className="slide-actions" style={{ opacity: 0, transition: "opacity 0.15s", display: "flex", gap: 4 }}>
                      {slides.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSlide(index); }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#444",
                            cursor: "pointer",
                            fontSize: 16,
                            lineHeight: 1,
                            padding: "0 2px",
                          }}
                          title="Remove slide"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    ref={(el) => { if (el) textareaRefs.current[slide.id] = el; }}
                    value={slide.text}
                    placeholder={index === 0 ? "Start writing your carousel..." : "Add content for this slide..."}
                    onChange={(e) => updateSlide(slide.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, slide, index)}
                    onFocus={() => setActiveSlide(index)}
                    rows={3}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "#D0CCC8",
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: "system-ui, sans-serif",
                      caretColor: accentColor || theme.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add slide button */}
          <button
            className="add-btn"
            onClick={() => addSlide(slides.length - 1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              marginLeft: 24,
              background: "transparent",
              border: "1px dashed #222",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#444",
              fontSize: 12,
              cursor: "pointer",
              width: "calc(100% - 24px)",
              transition: "all 0.15s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add slide
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - Preview */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#070707",
          overflow: "hidden",
        }}
      >
        {/* Preview header */}
        <div
          style={{
            padding: "18px 24px 14px",
            borderBottom: "1px solid #111",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>
            Preview · {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: i === activeSlide ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeSlide ? (accentColor || theme.accent) : "#1A1A1A",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrollable preview strip */}
        <div
          ref={previewRef}
          style={{
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
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
              onClick={() => setActiveSlide(index)}
              style={{
                cursor: "pointer",
                outline: activeSlide === index ? `2px solid ${accentColor || theme.accent}` : "2px solid transparent",
                borderRadius: 18,
                transition: "outline 0.15s",
                flexShrink: 0,
              }}
            >
              <SlideCard
                slide={slide}
                theme={theme}
                ratio={ratio}
                logo={logo}
                accentColor={accentColor}
              />
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div
          style={{
            padding: "10px 24px",
            borderTop: "1px solid #111",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: "#2A2A2A" }}>
            {ratioObj?.w}×{ratioObj?.h}px · High-res PNG export
          </span>
          <span style={{ fontSize: 11, color: "#2A2A2A" }}>
            Scroll to see all slides →
          </span>
        </div>
      </div>
    </div>
  );
}
