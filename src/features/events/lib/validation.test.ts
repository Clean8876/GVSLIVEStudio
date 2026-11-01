import assert from "node:assert/strict";
import test from "node:test";
import { validateEventInput, validateEventPatch } from "./validation";
const form = {
  title: "  Evening event  ",
  description: "Details",
  youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
  startsAt: "2026-11-01T18:00:00+05:30",
  isVisible: true,
};
test("normalizes valid form data and supplies create visibility default", () => {
  const result = validateEventInput({ ...form, isVisible: undefined });
  assert.deepEqual(result, {
    success: true,
    data: {
      title: "Evening event",
      description: "Details",
      youtubeId: "dQw4w9WgXcQ",
      startsAt: "2026-11-01T12:30:00.000Z",
      isVisible: true,
    },
  });
});
test("rejects invalid fields, calendar dates, offsetless dates and unknown writes", () => {
  for (const input of [
    null,
    [],
    { ...form, title: " " },
    { ...form, title: "x".repeat(121) },
    { ...form, description: "x".repeat(2001) },
    { ...form, youtubeUrl: "https://evil.org/a" },
    { ...form, startsAt: "2026-02-30T18:00:00Z" },
    { ...form, startsAt: "2026-11-01T18:00:00" },
    { ...form, isVisible: "true" },
    { ...form, status: "live" },
  ])
    assert.equal(validateEventInput(input).success, false);
});
test("patch allows visibility only or a complete form; rejects partial and unknown fields", () => {
  assert.deepEqual(validateEventPatch({ isVisible: false }), {
    success: true,
    data: { isVisible: false },
  });
  assert.equal(validateEventPatch(form).success, true);
  for (const input of [
    {},
    { title: "Changed" },
    { isVisible: false, status: "live" },
    { ...form, isVisible: undefined },
  ])
    assert.equal(validateEventPatch(input).success, false);
});
