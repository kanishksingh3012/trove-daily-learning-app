import NoteViewScreen from "@/components/screens/NoteViewScreen";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteViewScreen noteId={id} />;
}
