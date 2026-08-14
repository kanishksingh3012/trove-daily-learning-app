"use client";

import BottomNav from "@/components/ui/BottomNav";
import Fab from "@/components/ui/Fab";
import { useAddTopicSheet } from "@/components/AddTopicSheetProvider";

export default function TabsBottomBar() {
  const { openAddSheet } = useAddTopicSheet();

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 28,
        width: "100%",
        maxWidth: 480,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 50,
      }}
    >
      <BottomNav />
      <Fab onClick={openAddSheet} />
    </div>
  );
}
