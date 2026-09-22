import { useState } from "react";
import type { Berth, Reservation, ReservationInput, ReservationType } from "../types";
import { ErrorList } from "./Badges";
import { todayIso } from "../lib/dateUtils";

interface ReservationFormProps {
  berths: Berth[];
  /** When editing, the existing reservation to prefill from. */
  initial?: Reservation;
  /** Optional pre-selection, e.g. when arriving from the availability finder. */
  defaultBerthId?: string;
  onSubmit: (input: ReservationInput) => { valid: boolean; errors: string[] };
  onCancel?: () => void;
  submitLabel?: string;
}

export function ReservationForm({
  berths,
  initial,
  defaultBerthId,
  onSubmit,
  onCancel,
  submitLabel = "Create reservation",
}: ReservationFormProps) {
  const [type, setType] = useState<ReservationType>(initial?.type ?? "vessel");
  const [berthId, setBerthId] = useState(initial?.berthId ?? defaultBerthId ?? berths[0]?.id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayIso());
  const [endDate, setEndDate] = useState(initial?.endDate ?? todayIso());
  const [vesselLengthFt, setVesselLengthFt] = useState(
    initial?.vesselLengthFt !== undefined ? String(initial.vesselLengthFt) : "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<string[]>([]);
  const [justSucceeded, setJustSucceeded] = useState(false);

  const selectedBerth = berths.find((b) => b.id === berthId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJustSucceeded(false);

    const input: ReservationInput = {
      berthId,
      type,
      title: title.trim(),
      startDate,
      endDate,
      notes: notes.trim() || undefined,
      vesselLengthFt:
        type === "vessel" && vesselLengthFt !== "" ? Number(vesselLengthFt) : undefined,
    };

    const result = onSubmit(input);
    if (result.valid) {
      setErrors([]);
      setJustSucceeded(true);
      if (!initial) {
        // Reset the form after a successful create so it's ready for the next entry.
        setTitle("");
        setNotes("");
        setVesselLengthFt("");
      }
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Reservation type</span>
        <div className="flex gap-2">
          {(["vessel", "event"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                type === t
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t === "vessel" ? "Vessel" : "Event"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="berth">
          Berth
        </label>
        <select
          id="berth"
          value={berthId}
          onChange={(e) => setBerthId(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          {berths.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.lengthFt}')
            </option>
          ))}
        </select>
        {selectedBerth && type === "vessel" && (
          <p className="mt-1 text-xs text-slate-500">
            Vessel length must be {selectedBerth.lengthFt}' or less to fit this berth.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="title">
          {type === "vessel" ? "Vessel name" : "Event name"}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === "vessel" ? "e.g. R/V GOLDEN COMPASS" : "e.g. Community sail day"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {type === "vessel" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="length">
            Vessel length (feet)
          </label>
          <input
            id="length"
            type="number"
            min={1}
            step="1"
            value={vesselLengthFt}
            onChange={(e) => setVesselLengthFt(e.target.value)}
            placeholder="e.g. 120"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="start">
            Start date
          </label>
          <input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="end">
            End date
          </label>
          <input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>
      <p className="-mt-3 text-xs text-slate-500">
        Both dates are inclusive — the berth is held for every day from start through end.
      </p>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="notes">
          Notes <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <ErrorList errors={errors} />
      {justSucceeded && errors.length === 0 && (
        <p className="text-sm font-medium text-teal-700">Saved.</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
