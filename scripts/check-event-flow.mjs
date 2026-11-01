import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const folder = await mkdtemp(join(tmpdir(), "gvs-flow-"));
const databasePath = join(folder, "events.sqlite");
const socket = createServer();
socket.listen(0, "127.0.0.1");
await once(socket, "listening");
const port = socket.address().port;
await new Promise((resolve) => socket.close(resolve));
const base = "http://127.0.0.1:" + port;
let child;
let output = "";
async function start() {
  output = "";
  child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, GVS_DATABASE_PATH: databasePath },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null)
      throw new Error("Test server exited: " + output);
    try {
      const response = await fetch(base + "/studio/events");
      if (response.ok) return;
    } catch {}
    await delay(150);
  }
  throw new Error("Test server did not become ready: " + output);
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const ended = once(child, "exit");
  child.kill();
  await ended;
}
async function html(path) {
  const response = await fetch(base + path, {
    headers: { "Cache-Control": "no-cache" },
  });
  return { response, body: await response.text() };
}
async function mutate(path, method, data, extra = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", Origin: base, ...extra },
    body: JSON.stringify(data),
  });
  return { response, data: await response.json() };
}
try {
  await start();
  const empty = await html("/");
  assert(empty.response.ok);
  assert(empty.body.includes("No public events right now."));
  assert(!empty.body.includes("Sample event"));
  const studio = await html("/studio/events");
  assert(
    studio.response.ok && studio.body.includes("Your first event starts here."),
  );
  const newPage = await html("/studio/events/new");
  assert(
    newPage.response.ok &&
      newPage.body.includes("YouTube Share link") &&
      newPage.body.includes("Show to public"),
  );
  const invalid = await mutate("/api/events", "POST", {
    title: "",
    youtubeUrl: "https://youtube.com.evil.test/watch?v=M7lc1UVf-VE",
    startsAt: "invalid",
    isVisible: true,
  });
  assert.equal(invalid.response.status, 400);
  const malformed = await fetch(base + "/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: "{",
  });
  assert.equal(malformed.status, 400);
  const payload = {
    title: "Integration celebration " + Date.now(),
    description: "Saved celebration details",
    youtubeUrl: "https://youtu.be/M7lc1UVf-VE?si=example",
    startsAt: "2026-12-12T10:30:00+05:30",
    isVisible: true,
  };
  const key = "flow-" + crypto.randomUUID();
  const created = await mutate("/api/events", "POST", payload, {
    "Idempotency-Key": key,
  });
  assert.equal(created.response.status, 201, JSON.stringify(created.data));
  const event = created.data.event;
  assert.equal(event.youtubeId, "M7lc1UVf-VE");
  assert.equal(event.startsAt, "2026-12-12T05:00:00.000Z");
  assert.equal(created.data.publicUrl, "/events/" + event.slug);
  const repeated = await mutate("/api/events", "POST", payload, {
    "Idempotency-Key": key,
  });
  assert.equal(repeated.response.status, 201);
  assert.equal(
    repeated.data.event.id,
    event.id,
    "Retry must not create a duplicate",
  );
  const publicPage = await html(created.data.publicUrl);
  assert(
    publicPage.response.ok &&
      publicPage.body.includes(payload.title) &&
      publicPage.body.includes(event.youtubeId),
  );
  const homepage = await html("/");
  assert(homepage.body.includes(payload.title));
  const editPage = await html("/studio/events/" + event.id + "/edit");
  assert(editPage.response.ok && editPage.body.includes("Edit your event."));
  const hidden = await mutate("/api/events/" + event.id, "PATCH", {
    isVisible: false,
  });
  assert.equal(hidden.response.status, 200);
  assert.equal(hidden.data.event.isVisible, false);
  const hiddenHome = await html("/");
  assert(hiddenHome.body.includes("No public events right now."));
  assert(
    !hiddenHome.body.includes(payload.title),
    "Hidden title leaked through homepage HTML",
  );
  const hiddenPage = await html(created.data.publicUrl);
  assert(hiddenPage.body.includes("This event is not currently available."));
  assert(
    !hiddenPage.body.includes(payload.title),
    "Hidden title leaked through public HTML or metadata",
  );
  assert(
    !hiddenPage.body.includes(event.youtubeId),
    "Hidden video ID leaked through public HTML",
  );
  assert(
    !hiddenPage.body.includes("youtube.com/watch?v="),
    "Hidden public page exposes a YouTube action",
  );
  const management = await html("/studio/events");
  assert(
    management.body.includes(payload.title),
    "Hidden event must remain in management",
  );
  const show = await mutate("/api/events/" + event.id, "PATCH", {
    isVisible: true,
  });
  assert.equal(show.response.status, 200);
  assert.equal(show.data.event.slug, event.slug);
  const updated = await mutate("/api/events/" + event.id, "PATCH", {
    ...payload,
    title: "Renamed celebration",
  });
  assert.equal(updated.response.status, 200);
  assert.equal(
    updated.data.event.slug,
    event.slug,
    "Edit changed the public URL",
  );
  const unknown = await mutate("/api/events/missing", "PATCH", {
    isVisible: false,
  });
  assert.equal(unknown.response.status, 404);
  const missing = await html("/events/missing");
  assert.equal(missing.response.status, 404);
  await stop();
  await start();
  const reopened = await html(created.data.publicUrl);
  assert(
    reopened.response.ok && reopened.body.includes("Renamed celebration"),
    "Saved event did not survive server restart",
  );
  const rows = await html("/studio/events");
  assert(!rows.body.includes(payload.title));
  assert(rows.body.includes("Renamed celebration"));
  console.log(
    "PASS: create, edit, public viewing, malformed-link rejection, retry deduplication, hide/show, hidden-data checks, stable URL and server-restart persistence.",
  );
} catch (error) {
  console.error(output.slice(-4000));
  throw error;
} finally {
  await stop();
  await rm(folder, { recursive: true, force: true });
}
