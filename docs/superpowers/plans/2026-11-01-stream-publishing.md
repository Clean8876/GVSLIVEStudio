# Stream publishing implementation plan

> Use executing-plans with a focused implementation helper and separate review.

**Goal:** Add, edit, show/hide and watch saved YouTube events without sign-in.

**Architecture:** Keep existing Next.js marketing layout and feature folders. Save records using Node's built-in SQLite in a persistent local data folder. Server-rendered public reads always apply visibility and avoid cached event data. YouTube handles actual broadcast state.

**Tech stack:** Existing Next.js 16 / React 19 / TypeScript / Tailwind / shadcn; Node 22 SQLite.

**Workspace:** D:/DEVELOPERStuff/HobbyProject/GVS-Live-Stream/my-app. No Git repository exists; keep a source backup and work in this requested separate app rather than inventing a Git base branch.

## Task 1: saved records, validation and requests
- [ ] Create src/features/events/types/event.types.ts with StreamEvent (id, slug, title, description, youtubeId, startsAt, isVisible, createdAt, updatedAt).
- [ ] Create src/features/events/lib/youtube.ts with parseYouTubeId and src/features/events/lib/validation.ts with validateEventInput and validateEventPatch. Required title, HTTPS supported video URL, valid ISO instant and boolean visibility; reject unknown update fields.
- [ ] First write src/features/events/lib/validation.test.ts checking supported share links and deceptive/invalid hosts, blank title, missing or invalid date/time, and visibility-only updates.
- [ ] Run npx tsx --test src/features/events/lib/validation.test.ts and observe missing implementation fail, then implement and rerun.
- [ ] Create src/features/events/services/event-repository.ts using node:sqlite DatabaseSync. Parameterized statements, permanent slug, UTC timestamps, a visibility filter for public reads, optional request key for safe create retries. Database defaults to data/gvs.sqlite and accepts GVS_DATABASE_PATH.
- [ ] Write src/features/events/services/event-repository.test.ts first, covering save, reopen, stable URL after edits, hide/show and idempotent repeat submission. Use a temporary database and remove it afterward.
- [ ] Create src/app/api/events/route.ts (POST) and src/app/api/events/[id]/route.ts (PATCH). Return validation errors, 404 for unknown IDs and safe server errors. No sign-in. Runtime nodejs; same-origin browser writes; no broad cross-origin write support.
- [ ] Validate tests and review behavior against spec before integration.

## Task 2: creator and public pages
- [ ] Add official shadcn input, label, textarea, switch, table and alert components.
- [ ] Create src/features/events/components/EventForm.tsx with title, link, IST date/time, description, preview, Save and Show to public. Preserve input on failure; prevent duplicate submission and retain request key across a failed create retry.
- [ ] Create src/features/events/components/VisibilitySwitch.tsx: immediate PATCH, saving state, rollback/error feedback.
- [ ] Create src/features/events/components/EventList.tsx and public viewing components. Copy the permanent /events/{slug} link; no homepage anchor.
- [ ] Create src/features/events/components/YouTubePlayer.tsx. Load YouTube IFrame API once, handle ready/error/timeout/retry, no autoplay, minimum 200 px high, no broadcast control buttons.
- [ ] Create route-only pages under src/app/(dashboard)/studio/events (list/new/[id]/edit) and src/app/(marketing)/events/[slug]. Hidden public page must return only unavailable copy, not event details, video ID or a YouTube URL. Unknown event uses notFound.
- [ ] Keep all route handlers server-side and use dynamic public/creator reads.

## Task 3: homepage integration
- [ ] Replace legacy home event types with the saved-event contract. Replace fixtures with real visible records.
- [ ] Update getFeaturedContent: filter isVisible; newest started event first, otherwise earliest future event, otherwise empty. Labels stay neutral (Watch event / Upcoming), no clock-derived Live/Replay claim.
- [ ] Update home event cards to link to /events/{slug}. Update homepage route to read saved public records.
- [ ] Add Your events navigation and revise FAQ copy to match YouTube-controlled viewing.
- [ ] Update existing homepage tests first; verify empty, hidden-only, future, started and mixed cases.

## Task 4: check, review and handoff
- [ ] Run npm test, npm run lint, npm run typecheck and npm run build. Fix failures.
- [ ] Start local server on a free port. Exercise POST, PATCH, homepage/public pages, hiding with old URL, showing again and persistence. Use a temporary database so test fixtures do not pollute the real event list.
- [ ] Get separate spec compliance review, then code quality review; resolve material findings.
- [ ] Update README and .env.example with run commands, database persistence and the agreed no-sign-in scope.
- [ ] Keep local preview available. Clearly report browser inspection or live playback checks if blocked by browser tooling.

