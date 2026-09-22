# Dock Scheduler

**Live demo:** [dock-scheduler-jash.vercel.app](https://dock-scheduler-ten.vercel.app) 

<img width="1470" height="821" alt="image" src="https://github.com/user-attachments/assets/996814db-03bd-4299-b43c-15f75725216e" />


A small scheduling tool for managing berth reservations at the Harborview
Marine Research Center's waterfront, built as a take-home project from the
attached `Dock_Schedule_-_Synthetic_Sample.xlsx` workbook.

## Problem

The facility currently tracks berth reservations in an Excel workbook — one
grid per year, with berths as rows and days as columns. It works, but it has
two recurring failure modes:

1. **Double-bookings are only caught by eye.** Nothing stops two vessels
   from being penciled into the same berth on overlapping days; someone has
   to notice.
2. **Vessel-to-berth fit is only caught by eye.** Nothing stops a vessel
   longer than a berth from being assigned to it.

Both are exactly the kind of thing software should check automatically.

## Solution

A single-page app that models berths and reservations directly, and runs the
two checks above (plus basic date-range validation) on every create and
edit, with a specific, human-readable error message when something doesn't
fit — instead of a coordinator eyeballing a grid.

## Features

- **Schedule** — a timeline view of all six berths across a scrollable
  two-week window, vessel reservations and events visually distinguished,
  with previous/next-week and "Today" navigation. Click any reservation for
  details. It opens on the week of the earliest seeded reservation (rather
  than today's real-world date) so it shows real bookings immediately
  instead of an empty grid — a "Jump to sample data" button returns to that
  view from anywhere, and "Today" still jumps to the actual current date.
- **New reservation** — create a vessel or event reservation: pick a berth,
  type, dates, and (for vessels) a length, with optional notes.
- **Find a berth** — enter a vessel length and a date range; see every
  berth marked available, too short, or booked, with the specific
  conflicting reservation named when it's booked. "Book this berth" jumps
  straight to a prefilled reservation form.
- **Manage reservations** — a searchable, filterable (vessel / event / all)
  list of every reservation; click through to view, edit, or delete any of
  them.
- **Validation everywhere it matters** — the same rules run in the create
  form, the edit form, and the availability finder, so they can't drift out
  of sync with each other.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Vitest for unit tests
- No backend / no database by default — see [Architecture](#architecture)
  for why, and `db/schema.sql` for the Postgres schema this would map onto
- Deploys as a static site (Vercel, Netlify, GitHub Pages, or any static
  host)

## Architecture

```
src/
  types.ts                        Domain types (Berth, Reservation, ...)
  lib/
    dateUtils.ts                  Pure date helpers (ISO string based)
    validation.ts                 ALL scheduling rules — framework-free
  data/
    berths.ts                     The 6-berth catalog, from the workbook
    seedReservations.ts           87 real reservations, from the workbook
    storage.ts                    Data access layer (localStorage today)
  context/
    ReservationsContext.tsx       Glues storage + validation to React state
  components/                     Presentational + form components (UI only)
  App.tsx                         Tabs / routing between the four views
tests/ (src/tests/)                Vitest suite for lib/validation.ts
scripts/extract-workbook.py       One-off script that mined the source .xlsx
db/schema.sql, db/seed.sql        Reference Postgres schema (not wired in)
data/extracted-from-workbook.json Full extraction, all 23 years, for audit
```

The important design choice here is that **`src/lib/validation.ts` has no
dependency on React, storage, or anything else** — it's pure functions over
plain data (`Berth[]`, `Reservation[]`, an input, an optional "exclude this
id" for edits). That's what makes it possible to unit test the actual
scheduling rules directly (see [Testing](#testing)), and it's also what
`AvailabilityFinder`, `ReservationForm` (via context), and the Postgres
exclusion constraint in `db/schema.sql` all ultimately agree with — one
source of truth for what a "conflict" is.

`ReservationsContext` is the only piece that knows both "how validation
works" and "how persistence works." Components never call `validateReservation`
or `storage.ts` directly — they call `useReservations()` and get back
`{ valid, errors }` from every create/update call.

### Why no real database?

The brief allowed Supabase/Postgres "if useful," not required. For a
project meant to be reviewed as a live URL, a real backend adds real
failure modes for a reviewer with no context: a cold-started free-tier
Supabase project, a missing env var, a CORS misconfiguration, a stale
anon key. None of that would be testing anything this take-home is
actually about (dock scheduling logic), so I chose to keep the whole app
client-side, persisted to the browser's `localStorage`, seeded from the
real workbook data on first load. It's genuinely multi-user-unsafe (each
browser has its own copy) and that's a real limitation, listed honestly
under [Future improvements](#future-improvements) — but it means `git
clone && npm install && npm run dev` (or a bare static Vercel deploy) just
works, every time, with zero configuration.

The data access layer (`src/data/storage.ts`) is the one file that would
change if this grew a real backend — its function signatures
(`loadReservations`, `saveReservations`) are the same shape a `fetch()`-based
client would have. `db/schema.sql` is the schema that migration would
target, including the same overlap rule as an actual Postgres exclusion
constraint (`exclude using gist (...)`), so the two layers of validation
(app + database) agree by construction rather than by convention.

## Data model

```ts
interface Berth {
  id: string;          // e.g. "north-pier-west"
  name: string;         // e.g. "North Pier West"
  lengthFt: number;     // e.g. 410
  description?: string;
}

interface Reservation {
  id: string;
  berthId: string;
  type: "vessel" | "event";
  title: string;          // vessel name, or event name
  startDate: string;       // "YYYY-MM-DD", inclusive
  endDate: string;         // "YYYY-MM-DD", inclusive
  vesselLengthFt?: number; // required iff type === "vessel"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

Dates are plain `"YYYY-MM-DD"` strings everywhere in the reservation model,
never `Date` objects — see the assumption below.

## Reservation conflict logic

Two reservations on the **same berth** conflict if and only if their
inclusive date ranges share at least one calendar day:

```ts
aStart <= bEnd && bStart <= aEnd
```

This is checked in `findConflicts()` (`src/lib/validation.ts`) for every
create/update, and mirrored in `db/schema.sql` as a real Postgres exclusion
constraint. Reservations on different berths never conflict with each
other, regardless of dates.

## Vessel/berth validation

For vessel reservations, `vesselLengthFt` must be a positive number no
greater than the target berth's `lengthFt`. Events don't carry a length and
skip this check entirely. See `vesselFitsBerth()`.

## Important assumptions

- **Date ranges are inclusive whole days, with no time-of-day.** The
  source spreadsheet only ever recorded which day-cells a booking covered,
  never arrival/departure times, so this app doesn't invent time-of-day
  granularity either. A berth holds at most one reservation per calendar
  day. **Practical effect on back-to-back bookings:** if reservation A ends
  `2018-05-27`, reservation B may start `2018-05-28` at the earliest —
  starting `2018-05-27` itself conflicts, because that day is already A's.
  This is applied consistently in the form, the availability finder, and
  the database constraint, and is unit tested explicitly (see `"treats
  back-to-back reservations consistently"` in the test suite).
- **ISO date strings, not `Date` objects, drive every comparison** in the
  reservation model. `"YYYY-MM-DD"` strings of fixed width sort and compare
  correctly with plain `<`/`<=`, so this sidesteps timezone bugs entirely
  rather than working around them.
- **"North Finger Piers" and "Small craft slips (institution boats)"**, two
  rows that appear in the later years of the workbook, are **not** modeled
  as berths. In the source grid each aggregates several small,
  individually un-numbered slips into one row (with extra unlabeled rows
  used underneath for overflow bookings), so a single berth record with a
  single length wouldn't accurately represent them — modeling them
  properly would mean inventing a slip-numbering scheme the data doesn't
  contain. The six berths with an explicit `"Name - NNN'"` length in every
  year (1997–2019) are the ones this app models: North Pier West (410'),
  North Pier Face (75'), North Pier East (240'), Inner Channel (55'),
  South Float West (90'), South Float East (90').
- **A reservation belongs to exactly one berth.** The source data never
  shows a single booking spanning two berths (e.g. a vessel rafted
  alongside another), so that isn't modeled.

## How the Excel data was used

`scripts/extract-workbook.py` parses every year sheet (1997–2019) of the
workbook directly — reading each month's merged-cell ranges on each berth
row to recover the real start/end day of every booking, rather than
treating each cell independently. That produced **616 real reservation
records** across 23 years, saved in full at
`data/extracted-from-workbook.json` for reference/audit.

The running app seeds from a curated 87-record subset
(`src/data/seedReservations.ts`), as the brief asked for a representative
demo rather than a mechanical reproduction of two decades of data:

- **77 real vessel/event bookings from the 2018 sheet**, verbatim — same
  berths, same names, same dates as the workbook (one clearly non-reservation
  annotation, `"Departure 0800"`, was dropped as scheduling noise rather than
  a real booking).
- **9 supplemental non-vessel events**, using event names that genuinely
  appear elsewhere in the workbook (`"Community sail day"`, `"Donor
  reception"`, `"Dock maintenance - restricted access"`, etc.), placed on
  berth/date slots verified free in the 2018 data, since 2018 itself only
  had two non-vessel entries — this is what demonstrates the "non-vessel
  event" feature without it being a one-line demo.
- **Vessel lengths were synthesized**, not extracted, because the source
  grid never recorded vessel length directly (only vessel *name*). Two
  other tabs in the workbook, `Science` and `Yachts`, do list some vessel
  lengths, but their vessel names don't overlap with the ones actually
  booked in the schedule grid (this is synthetic sample data, so the tabs
  aren't cross-referenced). Lengths were instead assigned deterministically
  per vessel name, from a realistic range for its prefix (`R/V`, `M/V`,
  `F/V`, `S/V`, `M/Y`, `OSV`, `Tug`, `Barge`), and clamped so every vessel
  still fits every berth it was historically booked into.
- The resulting 87-record seed set has **zero overlaps and zero
  vessel/berth mismatches by construction** — verified programmatically
  before being committed. Conflicts and undersized vessels are meant to be
  demonstrated live, by using the app, not baked into the starting data.

## Local setup

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. No environment variables, database, or
account signup needed — first load seeds `localStorage` with the 87-record
demo dataset described above. Use the "Reset sample data" button in the
header at any point to wipe local edits and restore that starting dataset.

## Environment variables

None are required to build, run, or deploy this app. `.env.example`
documents the two variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
that a real backend migration would introduce, for reference — they are not
read anywhere in the current codebase.

## Deployment

Static build, deployable anywhere that serves static files:

```bash
npm run build     # outputs to dist/
npm run preview   # sanity-check the production build locally
```

**Vercel:** import the repo at [vercel.com/new](https://vercel.com/new) — it
auto-detects Vite (`npm run build`, output directory `dist`) and needs no
environment variables. `vercel --prod` from the repo root works the same
way if you'd rather use the CLI.

## Testing

`src/tests/validation.test.ts` runs the required scenarios directly against
`validateReservation()` and `findAvailableBerths()`:

- valid vessel reservation / valid event reservation
- overlapping reservation on the same berth → rejected
- overlapping dates on a different berth → allowed
- vessel longer than its berth → rejected
- vessel that exactly fits (`length === berth length`) → allowed
- back-to-back bookings: same-day handoff conflicts, next-day does not
- editing a reservation doesn't conflict with its own prior version
- a backwards date range (start after end) is rejected
- a vessel reservation missing a length is rejected
- the availability finder correctly classifies booked / too-short / available

Run with:

```bash
npm test
```

**A note on how this was verified while building it:** the environment
used to write this project had no npm registry access, so `npm install`
and `vite build` could not literally be executed here. Everything under
`src/lib` and `src/data` was instead verified by importing and *running*
those exact modules directly via `tsx` — **167 runtime assertions** in
total (every scenario above, plus a full pass over all 87 seed
reservations checking each one has zero self-conflicts and every vessel
fits its berth), all passing against the real code, not a reimplementation
of it. Separately, every `.ts`/`.tsx` file — and the full `main.tsx`
dependency graph, imports and all — was compiled with `esbuild` (matching
this project's own `tsconfig.json` JSX/module settings) to confirm there
are no syntax or import-resolution errors anywhere in the app before this
was handed off. `npm install && npm run build` should work as a normal
first step in a networked environment; it just wasn't possible to run
literally, tool-for-tool, in the one used to build this.

## What's implemented vs. not

**Implemented:** everything in [Features](#features); full create/edit/delete;
overlap and length validation on both create and edit; the availability
finder; search/filter in "Manage reservations"; a data-access layer that
isolates persistence from the rest of the app; a Postgres schema
(`db/schema.sql`) mirroring the same rules for a future real backend.

**Not implemented** (see below for reasoning on each):

- **Multi-user / real persistence.** Each browser has its own
  `localStorage` copy; there's no server, so nothing is shared between
  devices or people. Explicitly out of scope for the reasons in
  [Architecture](#architecture).
- **"North Finger Piers" / "Small craft slips" as bookable berths** — see
  [Important assumptions](#important-assumptions).
- **Month/quarter zoomed-out views** of the schedule — only the two-week
  timeline window is implemented; scoped out to stay inside the time box.
- **Drag-to-resize or drag-to-move** reservations on the timeline — create/
  edit is form-based only.
- **Authentication or per-role permissions** — explicitly excluded by the
  brief.

## Future improvements

- Wire up `db/schema.sql` behind a real API, swapping `src/data/storage.ts`
  for a `fetch()`-based client — no other file would need to change.
- Model "North Finger Piers" / "Small craft slips" as a small number of
  individually numbered slips once there's a real numbering scheme to model.
- A month-at-a-glance view alongside the current two-week timeline.
- Recurring reservations (e.g. a standing weekly tour boat).
- CSV/ICS export of a berth's or vessel's schedule.
- Optimistic conflict resolution suggestions ("try Nov 3–5 on North Pier
  East instead") when a requested berth/date combination is unavailable.
