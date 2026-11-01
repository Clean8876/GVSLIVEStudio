import { validateEventInput } from "@/features/events/lib/validation";
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
export async function POST(request: Request): Promise<Response> {
  const body = await readInput(request);
  if ("response" in body) return body.response;
  const key = request.headers.get("Idempotency-Key");
  if (key !== null && !/^[A-Za-z0-9_.:-]{1,128}$/.test(key))
    return reply(
      { message: "Use a valid request key of at most 128 characters." },
      400,
    );
  const result = validateEventInput(body.input);
  if (!result.success)
    return reply(
      { message: "Check the event details.", errors: result.errors },
      400,
    );
  try {
    const repository = await authenticatedRepository(request);
    if (!repository) return reply({ message: "Please sign in first." }, 401);
    const event = await repository.create(result.data, key ?? undefined);
    return reply({ event, publicUrl: `/events/${event.slug}` }, 201);
  } catch {
    return reply(
      { message: "Unable to save the event. Please try again." },
      500,
    );
  }
}

export async function GET(request: Request) {
  try {
    const repository = await authenticatedRepository(request);
    if (!repository) return reply({ message: "Please sign in first." }, 401);
    return reply({ events: await repository.listAll() }, 200);
  } catch { return reply({ message: "Unable to load events." }, 500); }
}
