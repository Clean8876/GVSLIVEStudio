import { getEventRepository } from "../services/event-repository";
export async function eventImageResponse(id: string, publicOnly: boolean): Promise<Response> {
  const event = await getEventRepository().getById(id);
  if (!event || (publicOnly && !event.isVisible)) return new Response(null, { status: 404 });
  return Response.redirect(`https://i.ytimg.com/vi/${event.youtubeId}/hqdefault.jpg`);
}
