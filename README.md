# GVS Live Stream

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui and SQLite.

## Run

Use Node.js 22.13 or newer (Node 22.23 verified).

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use **Your events** in the navigation or open /studio/events to add a YouTube Share link and event details. Save, copy the permanent public link, and use Show to public to hide/show the event. No sign-in is included in this version, as requested.

YouTube starts/ends the broadcast and supplies any available recording. The website does not automatically claim a stream is live based on its scheduled time.

## Structure

Routes only render feature components. Marketing pages share navigation/footer in their layout. The events feature contains creator pages, video player, validation and database access. The home feature displays saved public events; it does not seed sample events.

## Saved events

By default, records are stored in `data/gvs.sqlite` under the app folder. The database is created on first use. You may set `GVS_DATABASE_PATH` to an absolute file path in .env.local. Keep this database and its SQLite journal files when restarting or updating the app. Uploaded event images (JPG, PNG, or WebP, up to 5 MB) are stored in the same database.

This setup runs on a Node server with a persistent writable disk. For deployment, mount persistent storage and run one app instance against this file, or replace the repository with your shared database. Ephemeral serverless disks will not preserve events.

Hidden events stay in Your events. Their public page contains no event details or YouTube link, and fresh homepage loads exclude them. Hiding does not stop video already playing in another browser or change the YouTube video.

## Checks

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run test:integration
```

The integration check requires a production build. It starts an isolated temporary server/database, creates and edits an event, hides/shows it, checks public output, and reopens the server to verify persistence. It never populates your real event list.
