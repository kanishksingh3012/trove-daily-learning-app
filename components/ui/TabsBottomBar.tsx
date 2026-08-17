"use client";

import BottomNav from "@/components/ui/BottomNav";
import Fab from "@/components/ui/Fab";
import { useAddTopicSheet } from "@/components/AddTopicSheetProvider";

export default function TabsBottomBar() {
  const { open, openAddSheet, closeAddSheet } = useAddTopicSheet();

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 26,
        width: "100%",
        maxWidth: 480,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 50,
      }}
    >
      <BottomNav />
      <Fab open={open} onClick={() => (open ? closeAddSheet() : openAddSheet())} />
    </div>
  );
}
