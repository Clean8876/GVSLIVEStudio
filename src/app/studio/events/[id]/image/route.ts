import { eventImageResponse } from "@/features/events/lib/event-image-response";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return eventImageResponse((await params).id, false);
}
