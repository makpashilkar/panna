export const LAYOUT_STYLES = `
  * { box-sizing: border-box; margin: 0; }
  html, body, #root { height: 100%; }
  textarea { resize: none; outline: none; border: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  .slide-thread:hover .slide-actions { opacity: 1 !important; }
  @media (max-width: 768px) {
    .panna-root {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      min-height: 100dvh;
    }
    .panna-preview-panel {
      flex: 1;
      min-height: 0;
    }
    .panna-preview-scroll {
      padding: 16px !important;
    }
    .panna-preview-footer-hint {
      display: none;
    }
    .panna-mobile-toolbar {
      flex-shrink: 0;
    }
    .panna-sheet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
    }
    .panna-bottom-sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 85dvh;
      z-index: 100;
      display: flex;
      flex-direction: column;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
    }
    .panna-sheet-body {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }
    .panna-mobile-slide-hint {
      flex-shrink: 0;
      text-align: center;
      padding: 6px 16px;
      font-size: 11px;
    }
  }
`;
