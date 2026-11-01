import assert from "node:assert/strict";
import test from "node:test";
import { parseYouTubeId } from "./youtube";

test("accepts supported video share links and rejects unrelated or unsupported URLs", () => {
  for (const url of [
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://m.youtube.com/live/dQw4w9WgXcQ",
  ])
    assert.equal(parseYouTubeId(url), "dQw4w9WgXcQ");
  for (const url of [
    "http://youtu.be/dQw4w9WgXcQ",
    "https://youtube.com.evil.org/watch?v=dQw4w9WgXcQ",
    "https://evil@youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/@channel",
    '<iframe src="https://youtu.be/dQw4w9WgXcQ">',
    "https://youtu.be/short",
    "https://youtube.com/shorts/dQw4w9WgXcQ",
  ])
    assert.equal(parseYouTubeId(url), null);
});
