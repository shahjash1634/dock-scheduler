import { useState } from "react";
import type { Berth, Reservation, ReservationInput } from "../types";
import { TypeBadge } from "./Badges";
import { ReservationForm } from "./ReservationForm";
import { formatDisplayRange, rangeLengthDays } from "../lib/dateUtils";

interface ReservationDetailsModalProps {
  reservation: Reservation;
  berths: Berth[];
  onUpdate: (id: string, input: ReservationInput) => { valid: boolean; errors: string[] };
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ReservationDetailsModal({
  reservation,
  berths,
  onUpdate,
  onDelete,
  onClose,
}: ReservationDetailsModalProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const berth = berths.find((b) => b.id === reservation.berthId);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-16">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            {mode === "view" ? "Reservation details" : "Edit reservation"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          {mode === "view" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TypeBadge type={reservation.type} />
                <h4 className="text-lg font-semibold text-slate-900">{reservation.title}</h4>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-slate-500">Berth</dt>
                <dd className="font-medium text-slate-800">
                  {berth ? `${berth.name} (${berth.lengthFt}')` : reservation.berthId}
                </dd>

                <dt className="text-slate-500">Dates</dt>
                <dd className="font-medium text-slate-800">
                  {formatDisplayRange(reservation.startDate, reservation.endDate)}{" "}
                  <span className="text-slate-400">
                    ({rangeLengthDays(reservation.startDate, reservation.endDate)} day
                    {rangeLengthDays(reservation.startDate, reservation.endDate) === 1 ? "" : "s"})
                  </span>
                </dd>

                {reservation.type === "vessel" && (
                  <>
                    <dt className="text-slate-500">Vessel length</dt>
                    <dd className="font-medium text-slate-800">{reservation.vesselLengthFt}'</dd>
                  </>
                )}

                {reservation.notes && (
                  <>
                    <dt className="text-slate-500">Notes</dt>
                    <dd className="col-span-1 font-medium text-slate-800">{reservation.notes}</dd>
                  </>
                )}
              </dl>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                {!confirmingDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Delete this reservation?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(reservation.id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ReservationForm
              berths={berths}
              initial={reservation}
              submitLabel="Save changes"
              onCancel={() => setMode("view")}
              onSubmit={(input) => {
                const result = onUpdate(reservation.id, input);
                if (result.valid) setMode("view");
                return result;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
