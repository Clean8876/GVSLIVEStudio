import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EventRepository } from "./event-repository";
const data = {
  title: "Evening event",
  description: "Details",
  youtubeId: "dQw4w9WgXcQ",
  startsAt: "2026-11-01T12:30:00.000Z",
  isVisible: true,
};
test("saved events survive reopening, hide publicly, and retain their public URL after edits", () => {
  const dir = mkdtempSync(join(tmpdir(), "gvs-test-"));
  let repo = new EventRepository(join(dir, "nested", "events.sqlite"));
  try {
    assert.deepEqual(repo.listAll(), []);
    const event = repo.create(data, "request-123");
    assert.deepEqual(
      repo.create({ ...data, title: "Retry" }, "request-123"),
      event,
    );
    assert.equal(repo.listAll().length, 1);
    assert.equal(repo.getPublicBySlug(event.slug)?.id, event.id);
    const updated = repo.update(event.id, { ...data, title: "Edited title" });
    assert.equal(updated?.slug, event.slug);
    repo.update(event.id, { isVisible: false });
    assert.equal(repo.listPublic().length, 0);
    assert.equal(repo.getPublicBySlug(event.slug), null);
    assert.equal(repo.getBySlug(event.slug)?.title, "Edited title");
    repo.close();
    repo = new EventRepository(join(dir, "nested", "events.sqlite"));
    assert.equal(repo.getById(event.id)?.isVisible, false);
    repo.update(event.id, { isVisible: true });
    assert.equal(repo.getPublicBySlug(event.slug)?.id, event.id);
    assert.equal(repo.update("missing", { isVisible: false }), null);
    assert.equal(repo.getById("missing"), null);
  } finally {
    repo.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
