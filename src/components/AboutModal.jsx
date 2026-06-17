export default function AboutModal({ open, onClose, ui }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: ui.panelBg,
          border: `1px solid ${ui.border}`,
          borderRadius: 16,
          padding: "28px 32px",
          maxWidth: 420,
          width: "100%",
          color: ui.text,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: ui.textMuted,
            fontSize: 22,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <p
          style={{
            fontSize: 11,
            color: ui.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 8px",
          }}
        >
          About
        </p>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>Your Name</h2>
        <p style={{ margin: "0 0 16px", color: ui.accent, fontSize: 14, fontWeight: 500 }}>
          Front-end Developer
        </p>
        <p style={{ margin: "0 0 20px", lineHeight: 1.65, color: ui.textFaint, fontSize: 14 }}>
          I built Panna to help small business owners ship beautiful social carousels without
          wrestling with design tools. I love crafting fast, polished web experiences with clean
          UI and thoughtful details.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Portfolio", href: "#" },
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: ui.accent,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              {link.label} →
            </a>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: 11, color: ui.textDim }}>Built with React + Vite</p>
      </div>
    </div>
  );
}
