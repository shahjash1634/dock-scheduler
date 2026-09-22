import { describe, expect, it } from "vitest";
import { BERTHS } from "../data/berths";
import { findAvailableBerths, validateReservation } from "../lib/validation";
import type { Reservation, ReservationInput } from "../types";

const NORTH_PIER_WEST = "north-pier-west"; // 410'
const NORTH_PIER_FACE = "north-pier-face"; // 75'
const INNER_CHANNEL = "inner-channel"; // 55'

function makeReservation(overrides: Partial<Reservation> = {}): Reservation {
  return {
    id: overrides.id ?? "existing-1",
    berthId: overrides.berthId ?? NORTH_PIER_WEST,
    type: overrides.type ?? "vessel",
    title: overrides.title ?? "R/V Existing",
    startDate: overrides.startDate ?? "2024-06-01",
    endDate: overrides.endDate ?? "2024-06-10",
    vesselLengthFt: overrides.type === "event" ? undefined : (overrides.vesselLengthFt ?? 100),
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("validateReservation", () => {
  it("accepts a valid vessel reservation", () => {
    const input: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "vessel",
      title: "R/V New Horizon",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      vesselLengthFt: 150,
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("accepts a valid event reservation (no vessel length needed)", () => {
    const input: ReservationInput = {
      berthId: INNER_CHANNEL,
      type: "event",
      title: "Community sail day",
      startDate: "2024-07-01",
      endDate: "2024-07-01",
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(true);
  });

  it("rejects an overlapping reservation on the same berth", () => {
    const existing = [makeReservation({ startDate: "2024-06-01", endDate: "2024-06-10" })];
    const input: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "vessel",
      title: "R/V Overlapper",
      startDate: "2024-06-05",
      endDate: "2024-06-15",
      vesselLengthFt: 100,
    };
    const result = validateReservation(input, BERTHS, existing);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("already booked"))).toBe(true);
  });

  it("allows overlapping dates on a different berth", () => {
    const existing = [
      makeReservation({ berthId: NORTH_PIER_WEST, startDate: "2024-06-01", endDate: "2024-06-10" }),
    ];
    const input: ReservationInput = {
      berthId: NORTH_PIER_FACE,
      type: "vessel",
      title: "F/V Other Berth",
      startDate: "2024-06-05",
      endDate: "2024-06-15",
      vesselLengthFt: 60,
    };
    const result = validateReservation(input, BERTHS, existing);
    expect(result.valid).toBe(true);
  });

  it("rejects a vessel longer than the berth", () => {
    const input: ReservationInput = {
      berthId: INNER_CHANNEL, // 55'
      type: "vessel",
      title: "M/V Too Big",
      startDate: "2024-07-01",
      endDate: "2024-07-02",
      vesselLengthFt: 200,
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.toLowerCase().includes("too short"))).toBe(true);
  });

  it("allows a vessel that fits exactly (length === berth length)", () => {
    const input: ReservationInput = {
      berthId: INNER_CHANNEL, // 55'
      type: "vessel",
      title: "R/V Exact Fit",
      startDate: "2024-07-01",
      endDate: "2024-07-02",
      vesselLengthFt: 55,
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(true);
  });

  it("treats back-to-back reservations consistently: same-day handoff conflicts, next-day does not", () => {
    const existing = [makeReservation({ startDate: "2024-06-01", endDate: "2024-06-10" })];

    const sameDay: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "vessel",
      title: "R/V Same Day",
      startDate: "2024-06-10", // shares the departure day — conflict
      endDate: "2024-06-12",
      vesselLengthFt: 100,
    };
    expect(validateReservation(sameDay, BERTHS, existing).valid).toBe(false);

    const nextDay: ReservationInput = {
      ...sameDay,
      title: "R/V Next Day",
      startDate: "2024-06-11", // starts the day after — allowed
    };
    expect(validateReservation(nextDay, BERTHS, existing).valid).toBe(true);
  });

  it("does not conflict with itself when editing", () => {
    const existing = [makeReservation({ id: "res-1", startDate: "2024-06-01", endDate: "2024-06-10" })];
    const input: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "vessel",
      title: "R/V Existing (renamed)",
      startDate: "2024-06-02", // still overlaps its own old range
      endDate: "2024-06-11",
      vesselLengthFt: 100,
    };
    const result = validateReservation(input, BERTHS, existing, "res-1");
    expect(result.valid).toBe(true);
  });

  it("rejects a start date after the end date", () => {
    const input: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "event",
      title: "Backwards range",
      startDate: "2024-07-10",
      endDate: "2024-07-01",
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(false);
  });

  it("requires a vessel length for vessel reservations", () => {
    const input: ReservationInput = {
      berthId: NORTH_PIER_WEST,
      type: "vessel",
      title: "R/V No Length",
      startDate: "2024-07-01",
      endDate: "2024-07-02",
    };
    const result = validateReservation(input, BERTHS, []);
    expect(result.valid).toBe(false);
  });
});

describe("findAvailableBerths", () => {
  const reservations = [
    makeReservation({ berthId: NORTH_PIER_WEST, startDate: "2024-06-01", endDate: "2024-06-10" }),
  ];

  it("marks a berth booked when it overlaps the query range", () => {
    const results = findAvailableBerths(BERTHS, reservations, {
      startDate: "2024-06-05",
      endDate: "2024-06-06",
      vesselLengthFt: 100,
    });
    const northPierWest = results.find((r) => r.berth.id === NORTH_PIER_WEST)!;
    expect(northPierWest.status).toBe("booked");
    expect(northPierWest.conflicts?.[0].title).toBe("R/V Existing");
  });

  it("marks a berth too_short when the vessel doesn't fit, even if the dates are free", () => {
    const results = findAvailableBerths(BERTHS, reservations, {
      startDate: "2024-08-01",
      endDate: "2024-08-02",
      vesselLengthFt: 9999,
    });
    expect(results.every((r) => r.status === "too_short")).toBe(true);
  });

  it("marks a berth available when it fits and the dates are free", () => {
    const results = findAvailableBerths(BERTHS, reservations, {
      startDate: "2024-08-01",
      endDate: "2024-08-02",
      vesselLengthFt: 50,
    });
    const innerChannel = results.find((r) => r.berth.id === INNER_CHANNEL)!;
    expect(innerChannel.status).toBe("available");
  });
});
