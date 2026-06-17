export function resolveTheme(baseTheme, overrides = {}) {
  return {
    ...baseTheme,
    bg: overrides.bg ?? baseTheme.bg,
    cardBg: overrides.cardBg ?? baseTheme.cardBg,
    accent: overrides.accent ?? baseTheme.accent,
    text: overrides.text ?? baseTheme.text,
  };
}

export function hasCustomOverrides(overrides) {
  return Boolean(overrides.bg || overrides.cardBg || overrides.accent || overrides.text);
}
