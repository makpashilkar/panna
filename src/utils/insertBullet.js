export function insertBulletAtCursor(text, selectionStart, selectionEnd) {
  const start = selectionStart ?? text.length;
  const end = selectionEnd ?? start;
  const before = text.slice(0, start);
  const after = text.slice(end);
  const bullet = "• ";

  const lineStart = before.lastIndexOf("\n") + 1;
  const atLineStart = start === lineStart;

  if (atLineStart && before.slice(lineStart).length === 0) {
    const next = before + bullet + after;
    return { text: next, cursor: start + bullet.length };
  }

  const next = before + bullet + after;
  return { text: next, cursor: start + bullet.length };
}
