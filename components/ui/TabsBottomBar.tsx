"use client";

import BottomNav from "@/components/ui/BottomNav";
import Fab from "@/components/ui/Fab";
import { useAddTopicSheet } from "@/components/AddTopicSheetProvider";

// A normal (non-fixed) flex child of .app-shell, not a position:fixed
// overlay — .screen-scroll's flex:1 1 auto then structurally shrinks to
// leave exactly this bar's height, so scrollable content can never render
// behind it regardless of content length or scroll position. (A fixed
// overlay only "usually" cleared content, via a hand-kept-in-sync padding
// value on the scroll container — it silently broke whenever content was
// short enough not to need scrolling.)
export default function TabsBottomBar() {
  const { open, openAddSheet, closeAddSheet } = useAddTopicSheet();

  return (
    <div
      style={{
        flexShrink: 0,
        padding: "0 24px calc(26px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <BottomNav />
      <Fab open={open} onClick={() => (open ? closeAddSheet() : openAddSheet())} />
    </div>
  );
}
