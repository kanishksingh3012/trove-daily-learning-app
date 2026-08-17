import { notFound } from "next/navigation";
import DomainNotesScreen from "@/components/screens/DomainNotesScreen";
import { getDomain } from "@/lib/mock-data";

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainId } = await params;
  if (!getDomain(domainId)) notFound();
  return <DomainNotesScreen domainId={domainId} />;
}
