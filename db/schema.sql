-- Reference Postgres/Supabase schema.
--
-- NOT used by the running app — the shipped app persists to the browser's
-- localStorage (see src/data/storage.ts and the README's "Architecture" and
-- "Future improvements" sections for why). This file exists to show the data
-- model this app would map onto with a real multi-user backend, and to give
-- a concrete starting point for that migration.
--
-- The overlap/length rules enforced in src/lib/validation.ts are mirrored
-- here as real constraints (an exclusion constraint + a check constraint),
-- so a real backend would reject bad data even if a client bypassed the
-- app's own validation.

create extension if not exists btree_gist;

create table berths (
  id text primary key,
  name text not null,
  length_ft integer not null check (length_ft > 0),
  description text
);

create type reservation_type as enum ('vessel', 'event');

create table reservations (
  id uuid primary key default gen_random_uuid(),
  berth_id text not null references berths (id) on delete restrict,
  type reservation_type not null,
  title text not null check (length(trim(title)) > 0),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  vessel_length_ft integer check (vessel_length_ft is null or vessel_length_ft > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A vessel reservation must record a length; an event reservation must not.
  constraint vessel_length_matches_type check (
    (type = 'vessel' and vessel_length_ft is not null) or
    (type = 'event' and vessel_length_ft is null)
  ),

  -- No two reservations on the same berth may occupy overlapping inclusive
  -- date ranges. This is the database-level twin of findConflicts() in
  -- src/lib/validation.ts, using the same inclusive-range convention.
  constraint no_overlapping_reservations exclude using gist (
    berth_id with =,
    daterange(start_date, end_date, '[]') with &&
  )
);

create index reservations_berth_id_idx on reservations (berth_id);
create index reservations_date_range_idx on reservations using gist (daterange(start_date, end_date, '[]'));

-- Vessel-fits-berth is intentionally NOT a database constraint: it requires
-- a join against berths.length_ft, which a plain check constraint can't
-- express. In a real backend this would be enforced in a BEFORE INSERT/UPDATE
-- trigger (or in application code, as this app does in validateReservation()).
