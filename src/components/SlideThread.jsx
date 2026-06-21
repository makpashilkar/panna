export default function SlideThread({
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
  fillHeight = false,
}) {
  return (
    <div
      style={{
        flex: fillHeight ? 1 : undefined,
        overflowY: "auto",
        padding: "16px 20px",
        minHeight: fillHeight ? 0 : undefined,
      }}
    >
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
                <div style={{ width: 1, flex: 1, background: ui.railLine, minHeight: 12 }} />
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
                <span
                  style={{ fontSize: 10, color: ui.textDim, marginBottom: 4, display: "block" }}
                >
                  Slide {index + 1}
                </span>
                <div
                  className="slide-actions"
                  style={{ opacity: 0, transition: "opacity 0.15s", display: "flex", gap: 4 }}
                >
                  <button
                    type="button"
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
                      type="button"
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
          type="button"
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
  );
}
