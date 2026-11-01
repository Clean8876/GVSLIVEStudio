import { validateEventPatch } from "@/features/events/lib/validation";
import { authenticatedRepository } from "@/lib/firebase/server";
export const runtime = "nodejs";
function reply(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
async function readInput(
  request: Request,
): Promise<{ input: unknown } | { response: Response }> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") ?? new URL(request.url).host;
  const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  if (origin && origin !== `${protocol}://${host}`)
    return {
      response: reply(
        { message: "This request must come from this website." },
        403,
      ),
    };
  try {
    const reader = request.body?.getReader();
    if (!reader)
      return {
        response: reply({ message: "Send valid JSON event details." }, 400),
      };
    const decoder = new TextDecoder();
    let bytes = 0;
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16384) {
        await reader.cancel();
        return {
          response: reply(
            { message: "Event details must be at most 16 KB." },
            413,
          ),
        };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { input: JSON.parse(text) };
  } catch {
    return {
      response: reply({ message: "Send valid JSON event details." }, 400),
    };
  }
}
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const body = await readInput(request);
  if ("response" in body) return body.response;
  const result = validateEventPatch(body.input);
  if (!result.success)
    return reply(
      { message: "Check the event details.", errors: result.errors },
      400,
    );
  try {
    const repository = await authenticatedRepository(request);
    if (!repository) return reply({ message: "Please sign in first." }, 401);
    const { id } = await context.params;
    const event = await repository.update(id, result.data);
    if (!event) return reply({ message: "This event was not found." }, 404);
    return reply({ event }, 200);
  } catch {
    return reply(
      { message: "Unable to save the event. Please try again." },
      500,
    );
  }
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const repository = await authenticatedRepository(request);
    if (!repository) return reply({ message: "Please sign in first." }, 401);
    const event = await repository.getById((await context.params).id);
    return event ? reply({ event }, 200) : reply({ message: "This event was not found." }, 404);
  } catch { return reply({ message: "Unable to load the event." }, 500); }
}
