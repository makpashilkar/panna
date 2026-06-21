import AppHeader from "../AppHeader.jsx";
import ControlsPanel from "../ControlsPanel.jsx";
import SlideThread from "../SlideThread.jsx";
import PreviewPanel from "../PreviewPanel.jsx";

export default function DesktopLayout({
  ui,
  headerProps,
  controlsPanelProps,
  slideThreadProps,
  previewPanelProps,
}) {
  return (
    <>
      <div
        className="panna-editor-panel"
        style={{
          width: 380,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${ui.border}`,
          background: ui.panelBg,
        }}
      >
        <AppHeader {...headerProps} />
        <ControlsPanel {...controlsPanelProps} />
        <SlideThread {...slideThreadProps} />
      </div>
      <PreviewPanel {...previewPanelProps} />
    </>
  );
}
