/**
 * Core domain types for the dock scheduling system.
 *
 * Dates are always plain ISO calendar strings ("YYYY-MM-DD"), never Date
 * objects or timestamps. There is no time-of-day component anywhere in this
 * system (the source spreadsheet only ever tracked whole days), so we avoid
 * JS Date/timezone arithmetic entirely and rely on the fact that ISO date
 * strings of the same format sort and compare correctly as plain strings.
 *
 * Date ranges are INCLUSIVE of both startDate and endDate: a reservation
 * occupies the berth for every calendar day from startDate through endDate,
 * inclusive. See src/lib/dateUtils.ts for the full boundary convention.
 */

export type ReservationType = "vessel" | "event";

export interface Berth {
  /** Stable slug id, e.g. "north-pier-west" */
  id: string;
  /** Display name, e.g. "North Pier West" */
  name: string;
  /** Usable length in feet, as printed on the original dock schedule */
  lengthFt: number;
  /** Optional free-text description shown in the UI */
  description?: string;
}

export interface Reservation {
  id: string;
  berthId: string;
  type: ReservationType;
  /** Vessel name for vessel reservations, event name for events */
  title: string;
  /** Inclusive ISO start date, "YYYY-MM-DD" */
  startDate: string;
  /** Inclusive ISO end date, "YYYY-MM-DD" */
  endDate: string;
  /** Required for vessel reservations, absent for events */
  vesselLengthFt?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Shape accepted by create/update — the fields a user actually fills in. */
export interface ReservationInput {
  berthId: string;
  type: ReservationType;
  title: string;
  startDate: string;
  endDate: string;
  vesselLengthFt?: number;
  notes?: string;
}

export interface ValidationResult {
  valid: boolean;
  /** Human-readable problems, empty when valid */
  errors: string[];
}

export interface AvailabilityQuery {
  startDate: string;
  endDate: string;
  vesselLengthFt: number;
}

export type AvailabilityStatus = "available" | "too_short" | "booked";

export interface AvailabilityResult {
  berth: Berth;
  status: AvailabilityStatus;
  /** Present when status is "booked" — the reservation(s) causing the conflict */
  conflicts?: Reservation[];
}
