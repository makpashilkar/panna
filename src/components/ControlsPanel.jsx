import { THEMES } from "../constants/themes.js";
import { ASPECT_RATIOS } from "../constants/aspectRatios.js";
import { FONTS } from "../constants/fonts.js";
import { hasCustomOverrides } from "../utils/resolveTheme.js";
import { useState } from "react";

function SectionLabel({ children, ui }) {
  return (
    <p
      style={{
        fontSize: 11,
        color: ui.textMuted,
        margin: "0 0 8px",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </p>
  );
}

function ColorPicker({ label, value, defaultValue, onChange, onReset, ui }) {
  const displayValue = value || defaultValue;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <SectionLabel ui={ui}>{label}</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="color"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 32,
            height: 28,
            border: `1px solid ${ui.inputBorder}`,
            borderRadius: 6,
            cursor: "pointer",
            padding: 2,
            background: "transparent",
          }}
        />
        {value && (
          <button
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              color: ui.textMuted,
              cursor: "pointer",
              fontSize: 11,
              padding: 0,
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default function ControlsPanel({
  ui,
  themeId,
  onThemeSelect,
  customOverrides,
  onCustomBg,
  onCustomCardBg,
  onCustomAccent,
  onCustomText,
  onResetBg,
  onResetCardBg,
  onResetAccent,
  onResetText,
  ratio,
  onRatioChange,
  fontId,
  onFontChange,
  logo,
  onLogoUpload,
  onLogoRemove,
  logoInputRef,
  exportFormat,
  onExportFormatChange,
  resolvedTheme,
  presets,
  activePresetId,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
}) {
  const showCustom = hasCustomOverrides(customOverrides);
  const [presetName, setPresetName] = useState("");

  const handleSavePresetClick = () => {
    const name = presetName.trim();
    if (!name) return;
    onSavePreset(name);
    setPresetName("");
  };

  return (
    <div
      style={{
        padding: "14px 20px",
        borderBottom: `1px solid ${ui.border}`,
        maxHeight: 340,
        overflowY: "auto",
      }}
    >
      <SectionLabel ui={ui}>
        Theme{showCustom ? " · Custom colors active" : ""}
      </SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeSelect(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: `1px solid ${themeId === t.id && !showCustom && !activePresetId ? ui.accent : ui.inputBorder}`,
              borderRadius: 6,
              padding: "5px 10px",
              cursor: "pointer",
              color: themeId === t.id && !showCustom && !activePresetId ? ui.accent : ui.textFaint,
              fontSize: 12,
              fontWeight: themeId === t.id && !showCustom && !activePresetId ? 600 : 400,
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

      <SectionLabel ui={ui}>My Themes</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Theme name"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSavePresetClick();
          }}
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 6,
            border: `1px solid ${ui.inputBorder}`,
            background: ui.inputBg,
            color: ui.inputText,
            fontSize: 12,
          }}
        />
        <button
          type="button"
          onClick={handleSavePresetClick}
          disabled={!presetName.trim()}
          style={{
            background: ui.hoverBg,
            border: `1px solid ${ui.inputBorder}`,
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 12,
            color: presetName.trim() ? ui.accent : ui.textDim,
            cursor: presetName.trim() ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Save
        </button>
      </div>
      {presets.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: activePresetId === preset.id ? ui.hoverBg : "transparent",
                border: `1px solid ${activePresetId === preset.id ? ui.accent : ui.inputBorder}`,
                borderRadius: 6,
                padding: "4px 8px 4px 10px",
                cursor: "pointer",
                color: activePresetId === preset.id ? ui.accent : ui.textFaint,
                fontSize: 12,
                fontWeight: activePresetId === preset.id ? 600 : 400,
              }}
            >
              {preset.name}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePreset(preset.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                    onDeletePreset(preset.id);
                  }
                }}
                style={{
                  color: ui.textMuted,
                  fontSize: 14,
                  lineHeight: 1,
                  padding: "0 2px",
                }}
                title="Delete preset"
              >
                ×
              </span>
            </button>
          ))}
        </div>
      )}
      {presets.length === 0 && <div style={{ marginBottom: 14 }} />}

      <SectionLabel ui={ui}>Aspect Ratio</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {ASPECT_RATIOS.map((r) => (
          <button
            key={r.id}
            onClick={() => onRatioChange(r.id)}
            style={{
              background: ratio === r.id ? ui.hoverBg : "transparent",
              border: `1px solid ${ratio === r.id ? ui.accent : ui.inputBorder}`,
              borderRadius: 6,
              padding: "5px 12px",
              cursor: "pointer",
              color: ratio === r.id ? ui.accent : ui.textFaint,
              fontSize: 12,
              fontWeight: ratio === r.id ? 600 : 400,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            <div>{r.label}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>{r.subtitle}</div>
          </button>
        ))}
      </div>

      <SectionLabel ui={ui}>Font</SectionLabel>
      <select
        value={fontId}
        onChange={(e) => onFontChange(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 14,
          padding: "6px 10px",
          borderRadius: 6,
          border: `1px solid ${ui.inputBorder}`,
          background: ui.inputBg,
          color: ui.inputText,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <SectionLabel ui={ui}>Colors</SectionLabel>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <ColorPicker
          label="Slide fill"
          value={customOverrides.bg}
          defaultValue={resolvedTheme.bg}
          onChange={onCustomBg}
          onReset={onResetBg}
          ui={ui}
        />
        <ColorPicker
          label="Border"
          value={customOverrides.cardBg}
          defaultValue={resolvedTheme.cardBg}
          onChange={onCustomCardBg}
          onReset={onResetCardBg}
          ui={ui}
        />
        <ColorPicker
          label="Accent"
          value={customOverrides.accent}
          defaultValue={resolvedTheme.accent}
          onChange={onCustomAccent}
          onReset={onResetAccent}
          ui={ui}
        />
        <ColorPicker
          label="Text"
          value={customOverrides.text}
          defaultValue={resolvedTheme.text}
          onChange={onCustomText}
          onReset={onResetText}
          ui={ui}
        />
      </div>

      <SectionLabel ui={ui}>Logo</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <button
          onClick={() => logoInputRef.current?.click()}
          style={{
            background: "transparent",
            border: `1px solid ${ui.inputBorder}`,
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 12,
            color: ui.textFaint,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {logo ? "Change" : "Upload"}
        </button>
        {logo && (
          <button
            onClick={onLogoRemove}
            style={{
              background: "none",
              border: "none",
              color: ui.textMuted,
              cursor: "pointer",
              fontSize: 11,
              padding: 0,
            }}
          >
            Remove
          </button>
        )}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          onChange={onLogoUpload}
          style={{ display: "none" }}
        />
      </div>

      <SectionLabel ui={ui}>Export Format</SectionLabel>
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "zip", label: "ZIP" },
          { id: "pngs", label: "PNGs" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onExportFormatChange(opt.id)}
            style={{
              flex: 1,
              background: exportFormat === opt.id ? ui.hoverBg : "transparent",
              border: `1px solid ${exportFormat === opt.id ? ui.accent : ui.inputBorder}`,
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              color: exportFormat === opt.id ? ui.accent : ui.textFaint,
              fontSize: 12,
              fontWeight: exportFormat === opt.id ? 600 : 400,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
