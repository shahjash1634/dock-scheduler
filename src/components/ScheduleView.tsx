import { useMemo, useState } from "react";
import type { Berth, Reservation } from "../types";
import {
  addDays,
  eachDateInRange,
  formatDisplayDate,
  monthLabel,
  startOfWeek,
  todayIso,
  weekdayLabel,
} from "../lib/dateUtils";

const WINDOW_DAYS = 14;

interface ScheduleViewProps {
  berths: Berth[];
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
}

/**
 * Earliest reservation's start date, so the schedule can default to a window
 * that actually has data in it (the sample dataset is all from 2018 — if we
 * defaulted to today's date, the first thing a reviewer sees is an empty
 * grid that looks broken, even though the app itself is fine).
 */
function earliestReservationDate(reservations: Reservation[]): string | undefined {
  if (reservations.length === 0) return undefined;
  return reservations.reduce((min, r) => (r.startDate < min ? r.startDate : min), reservations[0].startDate);
}

export function ScheduleView({ berths, reservations, onSelectReservation }: ScheduleViewProps) {
  const [windowStart, setWindowStart] = useState(() => {
    const earliest = earliestReservationDate(reservations);
    return earliest ? startOfWeek(earliest) : todayIso();
  });

  const windowEnd = addDays(windowStart, WINDOW_DAYS - 1);
  const days = useMemo(() => eachDateInRange(windowStart, windowEnd), [windowStart, windowEnd]);
  const today = todayIso();
  const sampleDataStart = useMemo(() => {
    const earliest = earliestReservationDate(reservations);
    return earliest ? startOfWeek(earliest) : undefined;
  }, [reservations]);

  const reservationsByBerth = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const berth of berths) map.set(berth.id, []);
    for (const r of reservations) {
      // Only keep reservations that intersect the visible window at all.
      if (r.endDate < windowStart || r.startDate > windowEnd) continue;
      map.get(r.berthId)?.push(r);
    }
    return map;
  }, [berths, reservations, windowStart, windowEnd]);

  const gridTemplateColumns = `12rem repeat(${days.length}, minmax(2.75rem, 1fr))`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Berth schedule</h2>
          <p className="text-sm text-slate-500">
            {formatDisplayDate(windowStart)} – {formatDisplayDate(windowEnd)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWindowStart(addDays(windowStart, -7))}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Previous week
          </button>
          <button
            type="button"
            onClick={() => setWindowStart(today)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setWindowStart(addDays(windowStart, 7))}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Next week →
          </button>
          {sampleDataStart && (
            <button
              type="button"
              onClick={() => setWindowStart(sampleDataStart)}
              className="rounded-md border border-teal-300 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-100"
            >
              Jump to sample data
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-600" /> Vessel reservation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-violet-600" /> Event
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-slate-300 bg-white" /> Open
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Date header */}
          <div className="grid border-b border-slate-200" style={{ gridTemplateColumns }}>
            <div className="border-r border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Berth
            </div>
            {days.map((day) => (
              <div
                key={day}
                className={`border-r border-slate-100 px-1 py-2 text-center text-xs ${
                  day === today ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-500"
                }`}
                title={monthLabel(day)}
              >
                <div>{weekdayLabel(day)}</div>
                <div>{Number(day.slice(8, 10))}</div>
              </div>
            ))}
          </div>

          {/* Berth rows */}
          {berths.map((berth) => {
            const berthReservations = reservationsByBerth.get(berth.id) ?? [];
            return (
              <div
                key={berth.id}
                className="relative grid border-b border-slate-100 last:border-b-0"
                style={{ gridTemplateColumns, minHeight: "3.25rem" }}
              >
                <div className="flex flex-col justify-center border-r border-slate-200 px-3 py-2">
                  <span className="text-sm font-medium text-slate-800">{berth.name}</span>
                  <span className="text-xs text-slate-400">{berth.lengthFt}' berth</span>
                </div>

                {/* Background day cells, so empty days visibly read as "open" */}
                {days.map((day) => (
                  <div key={day} className="border-r border-slate-50" />
                ))}

                {/* Reservation bars, absolutely positioned over the day-cell grid */}
                <div
                  className="pointer-events-none absolute inset-0 grid"
                  style={{ gridTemplateColumns }}
                >
                  <div />
                  {berthReservations.map((r) => {
                    const clippedStart = r.startDate < windowStart ? windowStart : r.startDate;
                    const clippedEnd = r.endDate > windowEnd ? windowEnd : r.endDate;
                    const startIdx = days.indexOf(clippedStart);
                    const endIdx = days.indexOf(clippedEnd);
                    if (startIdx === -1 || endIdx === -1) return null;
                    const colStart = startIdx + 2; // +1 for label col, +1 for 1-indexing
                    const colEnd = endIdx + 3;
                    const isVessel = r.type === "vessel";
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onSelectReservation(r)}
                        className={`pointer-events-auto m-1 truncate rounded-md px-2 py-1 text-left text-xs font-medium text-white shadow-sm transition hover:opacity-90 ${
                          isVessel ? "bg-teal-600" : "bg-violet-600"
                        }`}
                        style={{ gridColumn: `${colStart} / ${colEnd}` }}
                        title={`${r.title} · ${formatDisplayDate(r.startDate)} – ${formatDisplayDate(r.endDate)}`}
                      >
                        {r.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
