# GVS Live Stream: add events and watch publicly

Updated: 1 November 2026
Status: specification updated from the agreed show/hide behavior

## Problem Statement

Girish needs to add a normal YouTube Share link and event details without editing code. Visitors need to open the GVS website and watch the video there.

## Solution

Provide three pages: Your events, Add/Edit event, and a public Watch event page. YouTube controls the broadcast. Girish controls whether each event appears publicly on the GVS website.

There is no sign-in, account system, or access-control work in this version. The management pages have no sign-in protection. Public viewing pages are read-only.

## User Stories

1. As Girish, I want to add a title, YouTube Share link, date, time, and optional description.
2. As Girish, I want to preview the video before saving it.
3. As Girish, I want to select a saved event and change its details.
4. As Girish, I want a "Show to public" switch for each event.
5. As Girish, I want to hide a finished event and show it again later without deleting it.
6. As a visitor, I want to find visible events and watch inside the website.
7. As a visitor, I want a clear message when a video has not started, has ended, or cannot play.

## Implementation Decisions

### Add and edit

- Your events lists all saved events, including hidden ones. Each row offers Edit, Copy public link, and the current visibility.
- Selecting an event opens its details and a "Show to public" on/off switch.
- Required fields: title (1–120 trimmed characters), YouTube Share link (maximum 2,048 characters), event date, and start time.
- Optional description: maximum 2,000 characters, displayed as plain text.
- Display dates and times in IST. Store the scheduled instant consistently in UTC.
- Preview checks the link and shows YouTube's player without saving changes.
- "Show to public" defaults to on for a new event. Save persists the details and selected visibility together.
- Turning the visibility switch on or off for an existing event saves that change immediately. Show saving feedback; if saving fails, restore the previous setting and offer retry.
- Keep form input when saving fails. Prevent repeated submissions while a save is running.
- Each saved event gets one permanent public URL. Editing or hiding it does not change that URL.
- Use the existing default event cover. Image uploading is excluded.

### Show to public

- On: include the event in the public homepage list and allow its GVS watch page to display the video.
- Off: remove the event from all public lists and prevent its GVS watch page from displaying the video, including through an old shared link.
- Hidden events remain in Your events and can be turned on again.
- A hidden event's public page shows only "This event is not currently available." It must not include the video, its details, or a YouTube link.
- Turning it on again restores the same public URL.
- Hiding an event does not delete it, stop a live broadcast, or change the video on YouTube.
- Already-playing video does not have to stop immediately when Girish hides it. Refreshing or reopening the public page must apply the saved visibility.

### YouTube link and playback

- Accept normal HTTPS video Share links from youtube.com/watch?v=VIDEO_ID, youtube.com/live/VIDEO_ID, and youtu.be/VIDEO_ID, including supported www and mobile host variants.
- Check the exact website name, extract the 11-character video ID, and ignore tracking parameters.
- Reject unrelated websites, channel-only links, malformed links, and pasted HTML. Ask Girish to paste the video's Share link.
- Validate on the server as well as in the form.
- Build the player address from the saved video ID. Do not display submitted HTML.
- YouTube handles starting, ending, waiting screens, playback, and any available recording.
- Do not add Start live, End live, or manual broadcast-status controls to the GVS website.
- Keep the player available while the event is visible. Do not prevent viewing just because the scheduled start has passed.
- A correctly shaped link does not guarantee that YouTube allows playback. Handle unavailable and embedding-disabled videos using the player's supported error events.
- Provide a clear message, Retry, and a secondary Watch on YouTube option when a visible event cannot play.
- Support fullscreen and inline playback on phones.
- A basic embedded player does not require connecting a Google account or a YouTube Data API key.

### Saved data and requests

- Save events in a shared, durable database so other devices see the same data.
- Event record: server-generated ID, permanent unique slug, title, description, YouTube video ID, scheduled start, isVisible, created timestamp, and updated timestamp.
- No creator account, session, or password fields are required.
- Creator pages: /studio/events, /studio/events/new, and /studio/events/{id}/edit.
- Public watch page: /events/{slug}.
- POST /api/events creates an event and returns 201 with its ID, public URL, and visibility.
- PATCH /api/events/{id} saves edited fields or a visibility change and returns 200 with the saved result.
- Validate allowed fields and return useful field errors. Missing records return 404. Do not return database secrets in error messages.
- Public data reads must apply isVisible before returning event details or a player.
- Saving must survive a restart. Fresh page loads must show saved changes without rebuilding the application.
- Keep route files small. Put event forms, player behavior, validation, and data access in the events feature. Reuse shared shadcn/ui components.
- Remove sample events from the real public data source.

### Homepage behavior

- Only show events whose visibility is on.
- Show future events as Upcoming, ordered by their scheduled date.
- If visible events have already reached their scheduled start, feature the latest one with a neutral "Watch event" action. The YouTube player shows whether it is waiting, live, ended, or available as a recording.
- Do not claim a video is live or a replay is available based only on the clock, a saved link, or playback starting.
- If there is no started visible event, feature the next upcoming visible event.
- If all events are hidden or no events exist, show "No public events right now" and Contact Girish.
- Automatic identification of whether YouTube is currently live is not part of this version.

## Testing Decisions

Use one main journey: save an event, open its public URL in another browser, hide it, then show it again.

Acceptance checks:

1. Supported YouTube Share links save the correct video ID; invalid links and missing required fields save nothing.
2. A visible event appears on the homepage and its public page shows the correct player.
3. No sign-in is requested for management or public viewing in this version.
4. Girish can select an existing event and save changed details without changing its public URL.
5. Turning "Show to public" off removes the event from public lists. Refreshing its old public URL shows the unavailable message without video details or a YouTube link.
6. Turning it back on restores the same public page and player.
7. Hiding or showing an event does not send a command to start, stop, remove, or change the YouTube video.
8. Hidden events remain available on Your events after a page refresh and server restart.
9. A failed save preserves form input. A failed visibility change restores the last saved switch setting.
10. Empty, all-hidden, upcoming, started, ended, and playback-error cases remain usable on phones and computers.
11. Existing event selection checks are updated to cover visibility and neutral viewing labels, without treating scheduled time as proof of being live.

Use the existing small test style for link checking and homepage selection. Keep automated tests independent of YouTube availability; verify real playback separately with a video that permits embedding.

## Out of Scope

- Authentication, accounts, passwords, and permissions.
- Starting, ending, or scheduling broadcasts from the GVS website.
- Connecting Google accounts or automatically checking YouTube broadcast status.
- Chat, payments, tickets, notifications, viewer counts, and analytics.
- Video hosting, image uploads, drafts, deletion, and unrelated redesigns.
- Automatically stopping a video already playing when visibility is switched off.

## Further Notes

The existing homepage already has event cards, a YouTube player, and an empty-event message. Reuse these while replacing sample data and removing assumptions that the website controls broadcast status.

No issue tracker is configured; this specification is saved locally.

References:
- https://developers.google.com/youtube/player_parameters
- https://developers.google.com/youtube/iframe_api_reference

