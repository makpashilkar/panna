import { PREVIEW_BASE, getPreviewHeight } from "../constants/aspectRatios.js";

function computeFontSize(lineCount, maxLineLength) {
  if (lineCount <= 3 && maxLineLength <= 40) return 15;
  if (lineCount <= 5 && maxLineLength <= 55) return 13;
  if (lineCount <= 8 && maxLineLength <= 70) return 11;
  return 10;
}

export default function SlideCard({ slide, theme, ratioId, logo, fontFamily }) {
  const previewH = getPreviewHeight(ratioId);
  const lines = slide.text.split("\n").filter((l) => l.trim());
  const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const fontSize = computeFontSize(lines.length, maxLineLength);

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
          background: theme.accent,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {logo && (
        <img
          src={logo}
          alt="logo"
          style={{
            height: 28,
            objectFit: "contain",
            alignSelf: "flex-start",
            marginBottom: 8,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {lines.length === 0 ? (
          <p
            style={{
              color: `${theme.text}40`,
              fontSize: 15,
              fontFamily,
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
                fontSize,
                lineHeight: 1.55,
                fontFamily,
              }}
            >
              {line}
            </p>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 24,
            height: 2,
            background: theme.accent,
            borderRadius: 1,
          }}
        />
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
