import type { Reservation } from "../types";
import { SEED_RESERVATIONS } from "./seedReservations";

/**
 * Data access layer.
 *
 * This app persists to the browser's localStorage rather than a real
 * database — see README.md ("Architecture" / "Future improvements") for why
 * that's a deliberate scope decision for a take-home rather than an
 * oversight, and for the Postgres schema this would map onto if it grew a
 * real backend.
 *
 * Nothing outside this file knows *how* reservations are persisted — the
 * rest of the app talks to ReservationsContext, which calls the functions
 * below. Swapping this module for a fetch()-based client hitting a real API
 * would not require touching any component.
 */

const STORAGE_KEY = "dock-scheduler:reservations:v1";

function isReservationArray(value: unknown): value is Reservation[] {
  return (
    Array.isArray(value) &&
    value.every(
      (r) =>
        r &&
        typeof r === "object" &&
        typeof (r as Reservation).id === "string" &&
        typeof (r as Reservation).berthId === "string",
    )
  );
}

export function loadReservations(): Reservation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run in this browser: seed from the real workbook data.
      saveReservations(SEED_RESERVATIONS);
      return SEED_RESERVATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!isReservationArray(parsed)) {
      console.warn("Stored reservations were malformed; resetting to seed data.");
      saveReservations(SEED_RESERVATIONS);
      return SEED_RESERVATIONS;
    }
    return parsed;
  } catch (err) {
    console.warn("Failed to read reservations from localStorage, using seed data.", err);
    return SEED_RESERVATIONS;
  }
}

export function saveReservations(reservations: Reservation[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch (err) {
    console.warn("Failed to persist reservations to localStorage.", err);
  }
}

export function resetToSeedData(): Reservation[] {
  saveReservations(SEED_RESERVATIONS);
  return SEED_RESERVATIONS;
}

let idCounter = 0;
export function generateId(): string {
  idCounter += 1;
  return `res-${Date.now().toString(36)}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}
