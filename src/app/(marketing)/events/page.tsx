import { AllEventsPage } from "@/features/events/components/AllEventsPage";
import { getEventRepository } from "@/features/events/services/event-repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "All events" };

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const { page } = await searchParams;
  const events = await getEventRepository().listPublic();
  return <AllEventsPage events={events} requestedPage={typeof page === "string" ? page : undefined} />;
}
