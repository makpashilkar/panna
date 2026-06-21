import { useEffect } from "react";
import AppHeader from "../AppHeader.jsx";
import ControlsPanel from "../ControlsPanel.jsx";
import MobileSlideEditor from "../MobileSlideEditor.jsx";
import PreviewPanel from "../PreviewPanel.jsx";
import MobileToolbar from "../MobileToolbar.jsx";
import MobileBottomSheet from "../MobileBottomSheet.jsx";

export default function MobileLayout({
  ui,
  headerProps,
  controlsPanelProps,
  slideThreadProps,
  previewPanelProps,
  mobileSheet,
  onToggleSheet,
  activeSlide,
  slideCount,
}) {
  useEffect(() => {
    if (mobileSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSheet]);

  return (
    <>
      <AppHeader {...headerProps} className="panna-mobile-header" />
      <PreviewPanel {...previewPanelProps} />
      {!mobileSheet && (
        <div
          className="panna-mobile-slide-hint"
          style={{ color: ui.textMuted, background: ui.panelBg, borderTop: `1px solid ${ui.border}` }}
        >
          Slide {activeSlide + 1} of {slideCount} · Tap Slides to edit
        </div>
      )}
      <MobileToolbar ui={ui} mobileSheet={mobileSheet} onToggleSheet={onToggleSheet} />
      {mobileSheet === "settings" && (
        <MobileBottomSheet ui={ui} title="Settings" onClose={() => onToggleSheet("settings")}>
          <ControlsPanel {...controlsPanelProps} inSheet />
        </MobileBottomSheet>
      )}
      {mobileSheet === "slides" && (
        <MobileBottomSheet
          ui={ui}
          title="Edit slides"
          tall
          bodyClassName="panna-sheet-body-fill"
          onClose={() => onToggleSheet("slides")}
        >
          <MobileSlideEditor {...slideThreadProps} />
        </MobileBottomSheet>
      )}
    </>
  );
}
