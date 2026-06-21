export default function MobileBottomSheet({ ui, title, onClose, children, tall = false, bodyClassName = "" }) {
  const sheetClass = tall ? "panna-bottom-sheet panna-bottom-sheet-tall" : "panna-bottom-sheet";
  const bodyClass = bodyClassName ? `panna-sheet-body ${bodyClassName}` : "panna-sheet-body";

  return (
    <>
      <div className="panna-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className={sheetClass}
        style={{ background: ui.panelBg, borderTop: `1px solid ${ui.border}` }}
        role="dialog"
        aria-label={title}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: ui.inputBorder,
              margin: "0 auto",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 8,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: ui.text, marginTop: 8 }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: ui.textFaint,
              fontSize: 22,
              lineHeight: 1,
              cursor: "pointer",
              padding: 4,
              marginTop: 4,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={bodyClass}>{children}</div>
      </div>
    </>
  );
}
