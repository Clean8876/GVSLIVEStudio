import { eventImageResponse } from "@/features/events/lib/event-image-response";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return eventImageResponse((await params).id, true);
}
