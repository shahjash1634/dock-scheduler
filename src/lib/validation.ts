/**
 * Scheduling & validation rules.
 *
 * This module is the entire "business logic" of the dock scheduler and is
 * intentionally free of any UI or storage code so it can be unit tested and
 * reasoned about in isolation. Every function here is pure: given the same
 * inputs, it always returns the same outputs.
 *
 * ---------------------------------------------------------------------------
 * DATE BOUNDARY CONVENTION (read this first)
 * ---------------------------------------------------------------------------
 * A reservation's startDate/endDate are an INCLUSIVE whole-day range: the
 * berth is occupied for every calendar day from startDate through endDate,
 * with no time-of-day granularity (the source spreadsheet never recorded
 * arrival/departure times, only which day-cells a booking covered).
 *
 * A berth can hold at most one reservation per calendar day. Two
 * reservations on the same berth conflict if and only if their inclusive
 * date ranges share at least one day.
 *
 * Practical consequence for back-to-back bookings: if one reservation ends
 * on 2018-05-27, the next reservation on that berth may start on 2018-05-28
 * at the earliest (the very next day) — starting on 2018-05-27 itself would
 * conflict, since that day is already claimed. This mirrors how the original
 * spreadsheet worked (each day was a single grid cell that could only show
 * one occupant) and is applied consistently everywhere in this app.
 */

import type {
  AvailabilityQuery,
  AvailabilityResult,
  Berth,
  Reservation,
  ReservationInput,
  ValidationResult,
} from "../types";
import { isValidIsoDate, rangesOverlap } from "./dateUtils";

export function findBerth(berths: Berth[], berthId: string): Berth | undefined {
  return berths.find((b) => b.id === berthId);
}

/** Reservations on the same berth that overlap the given range (inclusive). */
export function findConflicts(
  reservations: Reservation[],
  berthId: string,
  startDate: string,
  endDate: string,
  excludeReservationId?: string,
): Reservation[] {
  return reservations.filter(
    (r) =>
      r.berthId === berthId &&
      r.id !== excludeReservationId &&
      rangesOverlap(r.startDate, r.endDate, startDate, endDate),
  );
}

export function vesselFitsBerth(vesselLengthFt: number, berth: Berth): boolean {
  return vesselLengthFt <= berth.lengthFt;
}

/**
 * Validate a reservation input against the current set of reservations.
 * Pass `excludeReservationId` when editing an existing reservation so it
 * doesn't conflict with itself.
 */
export function validateReservation(
  input: ReservationInput,
  berths: Berth[],
  existingReservations: Reservation[],
  excludeReservationId?: string,
): ValidationResult {
  const errors: string[] = [];

  const berth = findBerth(berths, input.berthId);
  if (!berth) {
    errors.push("Select a valid berth.");
    return { valid: false, errors };
  }

  if (!input.title || !input.title.trim()) {
    errors.push(
      input.type === "vessel" ? "Vessel name is required." : "Event name is required.",
    );
  }

  if (!isValidIsoDate(input.startDate) || !isValidIsoDate(input.endDate)) {
    errors.push("Enter valid start and end dates.");
    return { valid: errors.length === 0, errors };
  }

  if (input.startDate > input.endDate) {
    errors.push("Start date must be on or before the end date.");
  }

  if (input.type === "vessel") {
    if (input.vesselLengthFt === undefined || input.vesselLengthFt === null) {
      errors.push("Vessel length is required.");
    } else if (!(input.vesselLengthFt > 0)) {
      errors.push("Vessel length must be greater than zero.");
    } else if (!vesselFitsBerth(input.vesselLengthFt, berth)) {
      errors.push(
        `${berth.name} is only ${berth.lengthFt}' long, which is too short for a ${input.vesselLengthFt}' vessel.`,
      );
    }
  }

  // Only check for date/berth conflicts once the range itself is sane —
  // otherwise an invalid range can produce a misleading "conflict" message.
  if (input.startDate <= input.endDate) {
    const conflicts = findConflicts(
      existingReservations,
      input.berthId,
      input.startDate,
      input.endDate,
      excludeReservationId,
    );
    for (const c of conflicts) {
      errors.push(
        `${berth.name} is already booked by "${c.title}" from ${c.startDate} to ${c.endDate}.`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * For a desired vessel length and date range, classify every berth as
 * available, too short, or already booked (with the conflicting
 * reservation(s) attached so the UI can explain why).
 */
export function findAvailableBerths(
  berths: Berth[],
  reservations: Reservation[],
  query: AvailabilityQuery,
): AvailabilityResult[] {
  return berths.map((berth) => {
    if (!vesselFitsBerth(query.vesselLengthFt, berth)) {
      return { berth, status: "too_short" as const };
    }
    const conflicts = findConflicts(
      reservations,
      berth.id,
      query.startDate,
      query.endDate,
    );
    if (conflicts.length > 0) {
      return { berth, status: "booked" as const, conflicts };
    }
    return { berth, status: "available" as const };
  });
}
