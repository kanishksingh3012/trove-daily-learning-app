import AddTopicSheetProvider from "@/components/AddTopicSheetProvider";
import TabsBottomBar from "@/components/ui/TabsBottomBar";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AddTopicSheetProvider>
      <div className="status-bar" />
      <div className="screen-scroll">
        <div className="tweak-scale-wrapper">{children}</div>
      </div>
      <TabsBottomBar />
    </AddTopicSheetProvider>
  );
}
