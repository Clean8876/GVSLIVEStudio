import { HomePage } from "@/features/home";
import { getEventRepository } from "@/features/events/services/event-repository";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export default async function Page() {
  return <HomePage events={await getEventRepository().listPublic()} />;
}
