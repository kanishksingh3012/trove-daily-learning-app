"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import AddTopicSheet from "@/components/AddTopicSheet";

interface AddTopicSheetContextValue {
  open: boolean;
  openAddSheet: () => void;
  closeAddSheet: () => void;
}

const AddTopicSheetContext = createContext<AddTopicSheetContextValue | null>(null);

export function useAddTopicSheet() {
  const ctx = useContext(AddTopicSheetContext);
  if (!ctx) throw new Error("useAddTopicSheet must be used within AddTopicSheetProvider");
  return ctx;
}

export default function AddTopicSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AddTopicSheetContext.Provider
      value={{ open, openAddSheet: () => setOpen(true), closeAddSheet: () => setOpen(false) }}
    >
      {children}
      <AddTopicSheet open={open} onClose={() => setOpen(false)} />
    </AddTopicSheetContext.Provider>
  );
}
