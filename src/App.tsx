import { useMemo, useState } from "react";
import { ReservationsProvider, useReservations } from "./context/ReservationsContext";
import { ScheduleView } from "./components/ScheduleView";
import { ReservationForm } from "./components/ReservationForm";
import { ReservationDetailsModal } from "./components/ReservationDetailsModal";
import { AvailabilityFinder } from "./components/AvailabilityFinder";
import { TypeBadge } from "./components/Badges";
import { formatDisplayRange } from "./lib/dateUtils";
import type { Reservation } from "./types";

type Tab = "schedule" | "new" | "find" | "manage";

function AppShell() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [prefillBerthId, setPrefillBerthId] = useState<string | undefined>(undefined);
  const [prefillDates, setPrefillDates] = useState<{ start: string; end: string } | undefined>();

  const {
    berths,
    reservations,
    createReservation,
    updateReservation,
    deleteReservation,
    resetDemoData,
  } = useReservations();

  function goToNewReservation(berthId?: string, start?: string, end?: string) {
    setPrefillBerthId(berthId);
    setPrefillDates(start && end ? { start, end } : undefined);
    setTab("new");
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Harborview Marine Research Center
            </p>
            <h1 className="text-xl font-bold text-slate-900">Dock Scheduler</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all reservations back to the original sample data?")) {
                resetDemoData();
              }
            }}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset sample data
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-4">
          {(
            [
              ["schedule", "Schedule"],
              ["new", "New reservation"],
              ["find", "Find a berth"],
              ["manage", "Manage reservations"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`border-b-2 px-3 py-2 text-sm font-medium transition ${
                tab === key
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "schedule" && (
          <ScheduleView
            berths={berths}
            reservations={reservations}
            onSelectReservation={setSelectedReservation}
          />
        )}

        {tab === "new" && (
          <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">New reservation</h2>
            <ReservationForm
              berths={berths}
              defaultBerthId={prefillBerthId}
              onSubmit={(input) =>
                createReservation(
                  prefillDates ? { ...input, startDate: prefillDates.start, endDate: prefillDates.end } : input,
                )
              }
            />
          </div>
        )}

        {tab === "find" && (
          <AvailabilityFinder
            berths={berths}
            reservations={reservations}
            onBookBerth={(berthId, start, end) => goToNewReservation(berthId, start, end)}
          />
        )}

        {tab === "manage" && (
          <ManageReservations
            reservations={reservations}
            onSelect={setSelectedReservation}
          />
        )}
      </main>

      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          berths={berths}
          onUpdate={(id, input) => {
            const result = updateReservation(id, input);
            if (result.valid) {
              setSelectedReservation({ ...selectedReservation, ...input });
            }
            return result;
          }}
          onDelete={(id) => {
            deleteReservation(id);
            setSelectedReservation(null);
          }}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}

function ManageReservations({
  reservations,
  onSelect,
}: {
  reservations: Reservation[];
  onSelect: (r: Reservation) => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "vessel" | "event">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations
      .filter((r) => (typeFilter === "all" ? true : r.type === typeFilter))
      .filter((r) => (q ? r.title.toLowerCase().includes(q) : true))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [reservations, query, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className="min-w-[12rem] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <div className="flex gap-1">
          {(["all", "vessel", "event"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                typeFilter === t
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All" : t === "vessel" ? "Vessels" : "Events"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            No reservations match your search.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onSelect(r)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <TypeBadge type={r.type} />
                    <span className="font-medium text-slate-900">{r.title}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {formatDisplayRange(r.startDate, r.endDate)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReservationsProvider>
      <AppShell />
    </ReservationsProvider>
  );
}
