import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { POST } from "../../../app/api/events/route";
import { PATCH } from "../../../app/api/events/[id]/route";
import { getEventRepository } from "../services/event-repository";
const form = {
  title: "API event",
  description: "Details",
  youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
  startsAt: "2026-11-01T18:00:00+05:30",
  isVisible: true,
};
test("mutation routes validate input and preserve hidden events without exposing them publicly", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gvs-api-"));
  process.env.GVS_DATABASE_PATH = join(directory, "events.sqlite");
  const request = (body: unknown, headers: Record<string, string> = {}) =>
    new Request("http://localhost/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  try {
    const created = await POST(
      request(form, { "Idempotency-Key": "create-test-1" }),
    );
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("Cache-Control"), "no-store");
    const { event, publicUrl } = await created.json();
    assert.equal(publicUrl, `/events/${event.slug}`);
    assert.equal("requestKey" in event, false);
    const repeated = await POST(
      request(form, { "Idempotency-Key": "create-test-1" }),
    );
    assert.equal((await repeated.json()).event.id, event.id);
    const patch = await PATCH(request({ isVisible: false }), {
      params: Promise.resolve({ id: event.id }),
    });
    assert.equal(patch.status, 200);
    assert.equal((await patch.json()).event.isVisible, false);
    assert.equal(getEventRepository().getPublicBySlug(event.slug), null);
    assert.equal(
      (
        await PATCH(request({ isVisible: true }), {
          params: Promise.resolve({ id: "absent" }),
        })
      ).status,
      404,
    );
    assert.equal(
      (await POST(request({ ...form, status: "live" }))).status,
      400,
    );
    assert.equal(
      (
        await PATCH(request({ title: "Partial" }), {
          params: Promise.resolve({ id: event.id }),
        })
      ).status,
      400,
    );
    assert.equal(
      (await POST(request(form, { Origin: "https://evil.example" }))).status,
      403,
    );
    assert.equal(
      (await POST(request(form, { "Idempotency-Key": "bad key" }))).status,
      400,
    );
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/events", {
            method: "POST",
            body: "{",
          }),
        )
      ).status,
      400,
    );
    assert.equal(
      (await POST(request({ ...form, description: "\u0905".repeat(6000) })))
        .status,
      413,
    );
  } finally {
    getEventRepository().close();
    Reflect.deleteProperty(globalThis, "gvsEventRepository");
    delete process.env.GVS_DATABASE_PATH;
    rmSync(directory, { recursive: true, force: true });
  }
});
