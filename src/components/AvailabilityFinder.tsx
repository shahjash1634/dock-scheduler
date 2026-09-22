import { useState } from "react";
import type { AvailabilityResult, Berth, Reservation } from "../types";
import { findAvailableBerths } from "../lib/validation";
import { formatDisplayRange, todayIso } from "../lib/dateUtils";

interface AvailabilityFinderProps {
  berths: Berth[];
  reservations: Reservation[];
  onBookBerth: (berthId: string, startDate: string, endDate: string) => void;
}

export function AvailabilityFinder({ berths, reservations, onBookBerth }: AvailabilityFinderProps) {
  const [vesselLengthFt, setVesselLengthFt] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());
  const [results, setResults] = useState<AvailabilityResult[] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const length = Number(vesselLengthFt);
    if (!vesselLengthFt || !(length > 0)) {
      setFormError("Enter a vessel length greater than zero.");
      setResults(null);
      return;
    }
    if (startDate > endDate) {
      setFormError("Start date must be on or before the end date.");
      setResults(null);
      return;
    }
    setFormError(null);
    setResults(
      findAvailableBerths(berths, reservations, {
        vesselLengthFt: length,
        startDate,
        endDate,
      }),
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-4 sm:items-end"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="find-length">
            Vessel length (ft)
          </label>
          <input
            id="find-length"
            type="number"
            min={1}
            value={vesselLengthFt}
            onChange={(e) => setVesselLengthFt(e.target.value)}
            placeholder="e.g. 85"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="find-start">
            Start date
          </label>
          <input
            id="find-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="find-end">
            End date
          </label>
          <input
            id="find-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="h-fit rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          Find berths
        </button>
      </form>

      {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

      {results && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {results.map((r) => (
              <li key={r.berth.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{r.berth.name}</span>
                    <span className="text-sm text-slate-400">{r.berth.lengthFt}'</span>
                  </div>
                  {r.status === "too_short" && (
                    <p className="mt-0.5 text-sm text-amber-700">
                      Too short — this berth is only {r.berth.lengthFt}', shorter than the {vesselLengthFt}
                      ' vessel.
                    </p>
                  )}
                  {r.status === "booked" && r.conflicts && (
                    <p className="mt-0.5 text-sm text-red-700">
                      Already booked by "{r.conflicts[0].title}" (
                      {formatDisplayRange(r.conflicts[0].startDate, r.conflicts[0].endDate)})
                      {r.conflicts.length > 1 ? ` and ${r.conflicts.length - 1} more` : ""}.
                    </p>
                  )}
                  {r.status === "available" && (
                    <p className="mt-0.5 text-sm text-teal-700">
                      Available for the full requested range.
                    </p>
                  )}
                </div>
                <div>
                  {r.status === "available" ? (
                    <button
                      type="button"
                      onClick={() => onBookBerth(r.berth.id, startDate, endDate)}
                      className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                      Book this berth
                    </button>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.status === "too_short"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status === "too_short" ? "Too short" : "Booked"}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
