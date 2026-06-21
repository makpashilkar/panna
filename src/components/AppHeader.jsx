export default function AppHeader({
  ui,
  draftSaved,
  uiMode,
  onUiModeToggle,
  onAboutOpen,
  onExport,
  exporting,
  exportMsg,
  className = "panna-editor-header",
}) {
  return (
    <div
      className={className}
      style={{
        padding: "18px 20px 14px",
        borderBottom: `1px solid ${ui.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexShrink: 0,
        background: ui.panelBg,
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
        {draftSaved && (
          <span style={{ fontSize: 10, color: ui.textMuted, marginTop: 2 }}>Draft saved</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onAboutOpen}
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
          type="button"
          onClick={onUiModeToggle}
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
          type="button"
          onClick={onExport}
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
  );
}
