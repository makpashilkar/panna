export default function MobileToolbar({ ui, mobileSheet, onToggleSheet }) {
  const btnStyle = (active) => ({
    flex: 1,
    background: active ? ui.hoverBg : "transparent",
    border: `1px solid ${active ? ui.accent : ui.inputBorder}`,
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    color: active ? ui.accent : ui.textFaint,
    cursor: "pointer",
  });

  return (
    <div
      className="panna-mobile-toolbar"
      style={{
        display: "flex",
        gap: 8,
        padding: "10px 16px",
        borderTop: `1px solid ${ui.border}`,
        background: ui.panelBg,
      }}
    >
      <button type="button" style={btnStyle(mobileSheet === "settings")} onClick={() => onToggleSheet("settings")}>
        Settings
      </button>
      <button type="button" style={btnStyle(mobileSheet === "slides")} onClick={() => onToggleSheet("slides")}>
        Slides
      </button>
    </div>
  );
}
