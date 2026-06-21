import SlideCard from "./SlideCard.jsx";

export default function PreviewPanel({
  ui,
  slides,
  activeSlide,
  resolvedTheme,
  ratio,
  ratioObj,
  logo,
  fontFamily,
  previewRef,
  slidePreviewRefs,
  goToSlide,
}) {
  return (
    <div
      className="panna-preview-panel"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: ui.previewShellBg,
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: "18px 24px 14px",
          borderBottom: `1px solid ${ui.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: ui.textFaint, fontWeight: 500 }}>
          Preview · {slides.length} slide{slides.length !== 1 ? "s" : ""}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
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
        className="panna-preview-scroll"
        style={{
          flex: 1,
          overflow: "auto",
          padding: 32,
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          minHeight: 0,
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
              fontFamily={fontFamily}
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
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: ui.previewHint }}>
          {ratioObj.w}×{ratioObj.h}px · {ratioObj.subtitle} · High-res PNG export
        </span>
        <span className="panna-preview-footer-hint" style={{ fontSize: 11, color: ui.previewHint }}>
          Scroll to see all slides →
        </span>
      </div>
    </div>
  );
}
