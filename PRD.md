# Panna — Product Requirements Document (v2)

## Introduction / Overview

**Panna** is a lightweight, browser-based split-screen web app that eliminates design friction for local business owners who need to share text-heavy content on social media. Users type content into thread-style slide boxes on the left; the app instantly renders brand-consistent carousel cards on the right and exports them as high-resolution PNGs (ZIP or individual files).

**v2 positioning:** Full customization SPA — type → preview → export with themes, colors, fonts, logo, and dual export formats. Client-only; no carousel draft persistence. App UI mode preference saved in localStorage.

---

## Functional Requirements (v2)

### In scope

| ID | Requirement |
|----|-------------|
| F1 | Split-screen UI: thread slide editor (left), live preview strip (right) |
| F2 | One text box per slide; plain text (newlines preserved) |
| F3 | Add slide via button or ⌘/Ctrl+Enter; remove empty slide via Backspace |
| F4 | Live HTML/CSS preview synced with editor state |
| F5 | 9 carousel theme presets (Midnight, Paper, Forest, Cream, Ocean, Rose, Slate, Lemon, Mono) |
| F6 | Custom color pickers: slide fill (`bg`), border (`cardBg`), accent (top bar, bottom dash, highlights) |
| F7 | Aspect ratio toggles: 1:1 (Instagram), 4:5 (LinkedIn), 9:16 (Stories) |
| F8 | Font selector: Georgia, Inter, Playfair Display, DM Sans, Merriweather |
| F9 | Logo upload (client-side image, shown on each slide) |
| F10 | Bullet insert button per slide (inserts `• ` at cursor) |
| F11 | Export format toggle: ZIP archive or individual PNG downloads |
| F12 | App shell dark/light mode toggle; preference persisted in `localStorage` (`panna-ui-mode`) |
| F13 | About modal with placeholder front-end developer marketing copy |
| F14 | Max 20 slides; auto font-size scaling for long content |
| F15 | Export via html2canvas at ratio-appropriate resolution; `document.fonts.ready` before capture |

### Out of scope (v2)

- User accounts / authentication
- Carousel draft persistence (slide content not saved)
- Markdown syntax
- Shareable links
- Backend / API
- Mobile-responsive layout (desktop split-pane only)

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Architecture | React SPA (Vite); all carousel processing client-side |
| Performance | Preview updates on keystroke without perceptible lag |
| Privacy | No carousel data sent to server; UI mode only in localStorage |
| Browser support | Latest Chrome and Safari (desktop) |
| Deployment | Static build (Vercel/Netlify/GitHub Pages) |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to first export | ≤ 3 minutes for a 5-slide carousel |
| Export completion rate | ≥ 95% of export attempts succeed |
| Customization | User can change theme, colors, font, ratio, and logo before export |

---

## Open Questions / Future Considerations

- Mobile-optimized editor layout
- Carousel draft save / restore
- Markdown mode
- Shareable links
- More theme presets / custom theme save
