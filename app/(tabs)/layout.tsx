import AddTopicSheetProvider from "@/components/AddTopicSheetProvider";
import TabsBottomBar from "@/components/ui/TabsBottomBar";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AddTopicSheetProvider>
      <div className="status-bar" />
      <div className="screen-scroll" style={{ paddingBottom: "calc(118px + env(safe-area-inset-bottom, 0px))" }}>
        {children}
      </div>
      <TabsBottomBar />
    </AddTopicSheetProvider>
  );
}
