import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Berth, Reservation, ReservationInput, ValidationResult } from "../types";
import { BERTHS } from "../data/berths";
import { generateId, loadReservations, resetToSeedData, saveReservations } from "../data/storage";
import { validateReservation } from "../lib/validation";

interface ReservationsContextValue {
  berths: Berth[];
  reservations: Reservation[];
  /** Validates and, if valid, creates the reservation. Always returns the validation result. */
  createReservation: (input: ReservationInput) => ValidationResult;
  /** Validates and, if valid, updates the reservation (excluding itself from conflict checks). */
  updateReservation: (id: string, input: ReservationInput) => ValidationResult;
  deleteReservation: (id: string) => void;
  resetDemoData: () => void;
  getReservation: (id: string) => Reservation | undefined;
}

const ReservationsContext = createContext<ReservationsContextValue | undefined>(undefined);

export function ReservationsProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(() => loadReservations());

  const persist = useCallback((next: Reservation[]) => {
    setReservations(next);
    saveReservations(next);
  }, []);

  const createReservation = useCallback(
    (input: ReservationInput): ValidationResult => {
      const result = validateReservation(input, BERTHS, reservations);
      if (!result.valid) return result;

      const now = new Date().toISOString();
      const newReservation: Reservation = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      persist([...reservations, newReservation]);
      return result;
    },
    [reservations, persist],
  );

  const updateReservation = useCallback(
    (id: string, input: ReservationInput): ValidationResult => {
      const result = validateReservation(input, BERTHS, reservations, id);
      if (!result.valid) return result;

      const now = new Date().toISOString();
      persist(
        reservations.map((r) => (r.id === id ? { ...r, ...input, updatedAt: now } : r)),
      );
      return result;
    },
    [reservations, persist],
  );

  const deleteReservation = useCallback(
    (id: string) => {
      persist(reservations.filter((r) => r.id !== id));
    },
    [reservations, persist],
  );

  const resetDemoData = useCallback(() => {
    persist(resetToSeedData());
  }, [persist]);

  const getReservation = useCallback(
    (id: string) => reservations.find((r) => r.id === id),
    [reservations],
  );

  const value = useMemo(
    () => ({
      berths: BERTHS,
      reservations,
      createReservation,
      updateReservation,
      deleteReservation,
      resetDemoData,
      getReservation,
    }),
    [reservations, createReservation, updateReservation, deleteReservation, resetDemoData, getReservation],
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

export function useReservations(): ReservationsContextValue {
  const ctx = useContext(ReservationsContext);
  if (!ctx) {
    throw new Error("useReservations must be used within a ReservationsProvider");
  }
  return ctx;
}
