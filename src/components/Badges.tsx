import type { ReservationType } from "../types";

export function TypeBadge({ type }: { type: ReservationType }) {
  const isVessel = type === "vessel";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isVessel ? "bg-teal-100 text-teal-800" : "bg-violet-100 text-violet-800"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isVessel ? "bg-teal-600" : "bg-violet-600"}`}
      />
      {isVessel ? "Vessel" : "Event"}
    </span>
  );
}

export function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3">
      <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  );
}
