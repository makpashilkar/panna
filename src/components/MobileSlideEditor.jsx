export default function MobileSlideEditor({
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
}) {
  const slide = slides[activeSlide];
  const canGoPrev = activeSlide > 0;
  const canGoNext = activeSlide < slides.length - 1;

  return (
    <div className="panna-mobile-slide-editor">
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
          Slide {activeSlide + 1} of {slides.length}
          {atMaxSlides ? " (max)" : ""}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => handleInsertBullet(slide)}
            style={{
              background: "none",
              border: `1px solid ${ui.inputBorder}`,
              borderRadius: 4,
              color: ui.textFaint,
              cursor: "pointer",
              fontSize: 10,
              padding: "4px 8px",
            }}
          >
            • Bullet
          </button>
          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => removeSlide(activeSlide)}
              style={{
                background: "none",
                border: `1px solid ${ui.inputBorder}`,
                borderRadius: 4,
                color: ui.textFaint,
                cursor: "pointer",
                fontSize: 10,
                padding: "4px 8px",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => goToSlide(activeSlide - 1)}
          aria-label="Previous slide"
          style={{
            background: "none",
            border: `1px solid ${ui.inputBorder}`,
            borderRadius: 6,
            color: canGoPrev ? ui.text : ui.textDim,
            cursor: canGoPrev ? "pointer" : "default",
            fontSize: 14,
            padding: "6px 12px",
            opacity: canGoPrev ? 1 : 0.4,
          }}
        >
          ←
        </button>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {slides.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              style={{
                width: activeSlide === index ? 10 : 8,
                height: activeSlide === index ? 10 : 8,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: activeSlide === index ? resolvedTheme.accent : ui.inputBorder,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => goToSlide(activeSlide + 1)}
          aria-label="Next slide"
          style={{
            background: "none",
            border: `1px solid ${ui.inputBorder}`,
            borderRadius: 6,
            color: canGoNext ? ui.text : ui.textDim,
            cursor: canGoNext ? "pointer" : "default",
            fontSize: 14,
            padding: "6px 12px",
            opacity: canGoNext ? 1 : 0.4,
          }}
        >
          →
        </button>
      </div>

      <textarea
        ref={(el) => {
          if (el && slide) textareaRefs.current[slide.id] = el;
        }}
        className="panna-mobile-slide-textarea"
        value={slide?.text ?? ""}
        placeholder={
          activeSlide === 0
            ? "New arrivals this week — type one line per bullet..."
            : "Add content for this slide..."
        }
        onChange={(e) => updateSlide(slide.id, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, slide, activeSlide)}
        style={{
          width: "100%",
          flex: 1,
          minHeight: "45vh",
          background: ui.inputBg,
          border: `1px solid ${ui.inputBorder}`,
          borderRadius: 10,
          padding: "12px 14px",
          color: ui.inputText,
          fontSize: 16,
          lineHeight: 1.6,
          fontFamily: "system-ui, sans-serif",
          caretColor: resolvedTheme.accent,
        }}
      />

      {!atMaxSlides && (
        <button
          type="button"
          onClick={() => addSlide(activeSlide)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 12,
            background: "transparent",
            border: `1px dashed ${ui.inputBorder}`,
            borderRadius: 8,
            padding: "10px 12px",
            color: ui.textFaint,
            fontSize: 13,
            cursor: "pointer",
            width: "100%",
          }}
        >
          + Add slide after this one
        </button>
      )}
    </div>
  );
}
