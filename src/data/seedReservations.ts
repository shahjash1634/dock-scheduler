import type { Reservation } from "../types";

/**
 * Seed reservations for the demo, extracted from the real 2018 sheet of the
 * "Dock_Schedule_-_Synthetic_Sample.xlsx" workbook (see scripts/extract-workbook.py
 * and data/extracted-from-workbook.json for the full extraction of all 23 years),
 * plus a handful of non-vessel events pulled from other years' vocabulary and
 * placed on verified-open berth/date slots so the demo shows event variety too.
 *
 * Vessel names in the schedule grid are not the same name pool as the "Science"
 * / "Yachts" contact tabs elsewhere in the workbook (this is synthetic sample
 * data, so the tabs don't cross-reference), so vessel lengths below are assigned
 * deterministically by vessel-name and prefix (R/V, M/V, F/V, S/V, M/Y, OSV, Tug,
 * Barge each have a realistic length band) and clamped so every vessel still fits
 * every berth it was historically booked into. This dataset contains NO overlaps
 * and NO vessel/berth length mismatches by construction — conflicts and
 * too-long-for-berth vessels are meant to be demonstrated live, by using the app
 * to create a new reservation, not baked into the starting data.
 */
export const SEED_RESERVATIONS: Reservation[] = [
  {
    id: "seed-001",
    berthId: "inner-channel",
    type: "vessel",
    title: "R/V Long Horizon",
    startDate: "2018-05-24",
    endDate: "2018-05-27",
    vesselLengthFt: 46,
    createdAt: "2018-05-24T00:00:00.000Z",
    updatedAt: "2018-05-24T00:00:00.000Z"
  },
  {
    id: "seed-002",
    berthId: "inner-channel",
    type: "event",
    title: "Community sail day",
    startDate: "2018-05-28",
    endDate: "2018-05-28",
    notes: "Follows R/V Long Horizon's stay back-to-back \u2014 demonstrates same-day turnover.",
    createdAt: "2018-05-28T00:00:00.000Z",
    updatedAt: "2018-05-28T00:00:00.000Z"
  },
  {
    id: "seed-003",
    berthId: "inner-channel",
    type: "event",
    title: "Student tour",
    startDate: "2018-08-25",
    endDate: "2018-08-25",
    createdAt: "2018-08-25T00:00:00.000Z",
    updatedAt: "2018-08-25T00:00:00.000Z"
  },
  {
    id: "seed-004",
    berthId: "inner-channel",
    type: "event",
    title: "Safety training (RIBs)",
    startDate: "2018-09-08",
    endDate: "2018-09-08",
    createdAt: "2018-09-08T00:00:00.000Z",
    updatedAt: "2018-09-08T00:00:00.000Z"
  },
  {
    id: "seed-005",
    berthId: "north-pier-east",
    type: "vessel",
    title: "OSV Far Tide",
    startDate: "2018-01-13",
    endDate: "2018-01-25",
    vesselLengthFt: 35,
    createdAt: "2018-01-13T00:00:00.000Z",
    updatedAt: "2018-01-13T00:00:00.000Z"
  },
  {
    id: "seed-006",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V Northern Star",
    startDate: "2018-02-03",
    endDate: "2018-02-05",
    vesselLengthFt: 57,
    createdAt: "2018-02-03T00:00:00.000Z",
    updatedAt: "2018-02-03T00:00:00.000Z"
  },
  {
    id: "seed-007",
    berthId: "north-pier-east",
    type: "vessel",
    title: "OSV Quiet Ketch",
    startDate: "2018-02-08",
    endDate: "2018-02-08",
    vesselLengthFt: 51,
    createdAt: "2018-02-08T00:00:00.000Z",
    updatedAt: "2018-02-08T00:00:00.000Z"
  },
  {
    id: "seed-008",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V Northern Star",
    startDate: "2018-03-02",
    endDate: "2018-03-03",
    vesselLengthFt: 57,
    createdAt: "2018-03-02T00:00:00.000Z",
    updatedAt: "2018-03-02T00:00:00.000Z"
  },
  {
    id: "seed-009",
    berthId: "north-pier-east",
    type: "vessel",
    title: "F/V SALT FATHOM",
    startDate: "2018-03-19",
    endDate: "2018-03-19",
    vesselLengthFt: 62,
    createdAt: "2018-03-19T00:00:00.000Z",
    updatedAt: "2018-03-19T00:00:00.000Z"
  },
  {
    id: "seed-010",
    berthId: "north-pier-east",
    type: "vessel",
    title: "Barge Silver Voyager",
    startDate: "2018-03-23",
    endDate: "2018-03-23",
    vesselLengthFt: 84,
    createdAt: "2018-03-23T00:00:00.000Z",
    updatedAt: "2018-03-23T00:00:00.000Z"
  },
  {
    id: "seed-011",
    berthId: "north-pier-east",
    type: "vessel",
    title: "F/V Salt Ketch",
    startDate: "2018-04-06",
    endDate: "2018-04-07",
    vesselLengthFt: 68,
    createdAt: "2018-04-06T00:00:00.000Z",
    updatedAt: "2018-04-06T00:00:00.000Z"
  },
  {
    id: "seed-012",
    berthId: "north-pier-east",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-04-19",
    endDate: "2018-04-20",
    vesselLengthFt: 143,
    createdAt: "2018-04-19T00:00:00.000Z",
    updatedAt: "2018-04-19T00:00:00.000Z"
  },
  {
    id: "seed-013",
    berthId: "north-pier-east",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-04-26",
    endDate: "2018-04-26",
    vesselLengthFt: 146,
    createdAt: "2018-04-26T00:00:00.000Z",
    updatedAt: "2018-04-26T00:00:00.000Z"
  },
  {
    id: "seed-014",
    berthId: "north-pier-east",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-05-01",
    endDate: "2018-05-31",
    vesselLengthFt: 146,
    createdAt: "2018-05-01T00:00:00.000Z",
    updatedAt: "2018-05-01T00:00:00.000Z"
  },
  {
    id: "seed-015",
    berthId: "north-pier-east",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-06-06",
    endDate: "2018-06-06",
    vesselLengthFt: 146,
    createdAt: "2018-06-06T00:00:00.000Z",
    updatedAt: "2018-06-06T00:00:00.000Z"
  },
  {
    id: "seed-016",
    berthId: "north-pier-east",
    type: "vessel",
    title: "F/V Coral Marlin",
    startDate: "2018-06-18",
    endDate: "2018-06-18",
    vesselLengthFt: 68,
    createdAt: "2018-06-18T00:00:00.000Z",
    updatedAt: "2018-06-18T00:00:00.000Z"
  },
  {
    id: "seed-017",
    berthId: "north-pier-east",
    type: "vessel",
    title: "F/V Coral Marlin",
    startDate: "2018-06-27",
    endDate: "2018-06-29",
    vesselLengthFt: 68,
    createdAt: "2018-06-27T00:00:00.000Z",
    updatedAt: "2018-06-27T00:00:00.000Z"
  },
  {
    id: "seed-018",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V Amber Anchor",
    startDate: "2018-07-30",
    endDate: "2018-07-30",
    vesselLengthFt: 91,
    createdAt: "2018-07-30T00:00:00.000Z",
    updatedAt: "2018-07-30T00:00:00.000Z"
  },
  {
    id: "seed-019",
    berthId: "north-pier-east",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-08-03",
    endDate: "2018-08-03",
    vesselLengthFt: 143,
    createdAt: "2018-08-03T00:00:00.000Z",
    updatedAt: "2018-08-03T00:00:00.000Z"
  },
  {
    id: "seed-020",
    berthId: "north-pier-east",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-08-12",
    endDate: "2018-08-12",
    vesselLengthFt: 143,
    createdAt: "2018-08-12T00:00:00.000Z",
    updatedAt: "2018-08-12T00:00:00.000Z"
  },
  {
    id: "seed-021",
    berthId: "north-pier-east",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-08-19",
    endDate: "2018-08-19",
    vesselLengthFt: 143,
    createdAt: "2018-08-19T00:00:00.000Z",
    updatedAt: "2018-08-19T00:00:00.000Z"
  },
  {
    id: "seed-022",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-09-04",
    endDate: "2018-09-14",
    vesselLengthFt: 142,
    createdAt: "2018-09-04T00:00:00.000Z",
    updatedAt: "2018-09-04T00:00:00.000Z"
  },
  {
    id: "seed-023",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-09-19",
    endDate: "2018-09-25",
    vesselLengthFt: 142,
    createdAt: "2018-09-19T00:00:00.000Z",
    updatedAt: "2018-09-19T00:00:00.000Z"
  },
  {
    id: "seed-024",
    berthId: "north-pier-east",
    type: "vessel",
    title: "R/V Quiet Osprey",
    startDate: "2018-10-12",
    endDate: "2018-10-12",
    vesselLengthFt: 115,
    createdAt: "2018-10-12T00:00:00.000Z",
    updatedAt: "2018-10-12T00:00:00.000Z"
  },
  {
    id: "seed-025",
    berthId: "north-pier-east",
    type: "event",
    title: "Campus event",
    startDate: "2018-11-20",
    endDate: "2018-11-20",
    createdAt: "2018-11-20T00:00:00.000Z",
    updatedAt: "2018-11-20T00:00:00.000Z"
  },
  {
    id: "seed-026",
    berthId: "north-pier-face",
    type: "vessel",
    title: "F/V Salt Ketch",
    startDate: "2018-05-12",
    endDate: "2018-05-13",
    vesselLengthFt: 68,
    createdAt: "2018-05-12T00:00:00.000Z",
    updatedAt: "2018-05-12T00:00:00.000Z"
  },
  {
    id: "seed-027",
    berthId: "north-pier-face",
    type: "event",
    title: "Donor reception",
    startDate: "2018-07-20",
    endDate: "2018-07-20",
    createdAt: "2018-07-20T00:00:00.000Z",
    updatedAt: "2018-07-20T00:00:00.000Z"
  },
  {
    id: "seed-028",
    berthId: "north-pier-face",
    type: "event",
    title: "Dock maintenance - restricted access",
    startDate: "2018-10-05",
    endDate: "2018-10-06",
    createdAt: "2018-10-05T00:00:00.000Z",
    updatedAt: "2018-10-05T00:00:00.000Z"
  },
  {
    id: "seed-029",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-01-01",
    endDate: "2018-01-13",
    vesselLengthFt: 142,
    createdAt: "2018-01-01T00:00:00.000Z",
    updatedAt: "2018-01-01T00:00:00.000Z"
  },
  {
    id: "seed-030",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-01-18",
    endDate: "2018-01-18",
    vesselLengthFt: 142,
    createdAt: "2018-01-18T00:00:00.000Z",
    updatedAt: "2018-01-18T00:00:00.000Z"
  },
  {
    id: "seed-031",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-02-01",
    endDate: "2018-02-28",
    vesselLengthFt: 142,
    createdAt: "2018-02-01T00:00:00.000Z",
    updatedAt: "2018-02-01T00:00:00.000Z"
  },
  {
    id: "seed-032",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-03-01",
    endDate: "2018-03-31",
    vesselLengthFt: 142,
    createdAt: "2018-03-01T00:00:00.000Z",
    updatedAt: "2018-03-01T00:00:00.000Z"
  },
  {
    id: "seed-033",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-04-01",
    endDate: "2018-04-01",
    vesselLengthFt: 142,
    createdAt: "2018-04-01T00:00:00.000Z",
    updatedAt: "2018-04-01T00:00:00.000Z"
  },
  {
    id: "seed-034",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-04-13",
    endDate: "2018-04-13",
    vesselLengthFt: 142,
    createdAt: "2018-04-13T00:00:00.000Z",
    updatedAt: "2018-04-13T00:00:00.000Z"
  },
  {
    id: "seed-035",
    berthId: "north-pier-west",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-04-27",
    endDate: "2018-04-30",
    vesselLengthFt: 143,
    createdAt: "2018-04-27T00:00:00.000Z",
    updatedAt: "2018-04-27T00:00:00.000Z"
  },
  {
    id: "seed-036",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-05-09",
    endDate: "2018-05-14",
    vesselLengthFt: 142,
    createdAt: "2018-05-09T00:00:00.000Z",
    updatedAt: "2018-05-09T00:00:00.000Z"
  },
  {
    id: "seed-037",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-05-19",
    endDate: "2018-05-28",
    vesselLengthFt: 142,
    createdAt: "2018-05-19T00:00:00.000Z",
    updatedAt: "2018-05-19T00:00:00.000Z"
  },
  {
    id: "seed-038",
    berthId: "north-pier-west",
    type: "event",
    title: "Bunker barge",
    startDate: "2018-06-02",
    endDate: "2018-06-02",
    createdAt: "2018-06-02T00:00:00.000Z",
    updatedAt: "2018-06-02T00:00:00.000Z"
  },
  {
    id: "seed-039",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-06-04",
    endDate: "2018-06-04",
    vesselLengthFt: 142,
    createdAt: "2018-06-04T00:00:00.000Z",
    updatedAt: "2018-06-04T00:00:00.000Z"
  },
  {
    id: "seed-040",
    berthId: "north-pier-west",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-06-28",
    endDate: "2018-06-30",
    vesselLengthFt: 146,
    createdAt: "2018-06-28T00:00:00.000Z",
    updatedAt: "2018-06-28T00:00:00.000Z"
  },
  {
    id: "seed-041",
    berthId: "north-pier-west",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-07-01",
    endDate: "2018-07-01",
    vesselLengthFt: 146,
    createdAt: "2018-07-01T00:00:00.000Z",
    updatedAt: "2018-07-01T00:00:00.000Z"
  },
  {
    id: "seed-042",
    berthId: "north-pier-west",
    type: "vessel",
    title: "OSV Green Cove",
    startDate: "2018-07-07",
    endDate: "2018-07-07",
    vesselLengthFt: 76,
    createdAt: "2018-07-07T00:00:00.000Z",
    updatedAt: "2018-07-07T00:00:00.000Z"
  },
  {
    id: "seed-043",
    berthId: "north-pier-west",
    type: "vessel",
    title: "M/V Deep Beacon",
    startDate: "2018-07-12",
    endDate: "2018-07-12",
    vesselLengthFt: 97,
    createdAt: "2018-07-12T00:00:00.000Z",
    updatedAt: "2018-07-12T00:00:00.000Z"
  },
  {
    id: "seed-044",
    berthId: "north-pier-west",
    type: "vessel",
    title: "M/V NORTHERN HARBOR",
    startDate: "2018-07-24",
    endDate: "2018-07-24",
    vesselLengthFt: 146,
    createdAt: "2018-07-24T00:00:00.000Z",
    updatedAt: "2018-07-24T00:00:00.000Z"
  },
  {
    id: "seed-045",
    berthId: "north-pier-west",
    type: "vessel",
    title: "Tug BLUE FATHOM",
    startDate: "2018-07-28",
    endDate: "2018-07-30",
    vesselLengthFt: 143,
    createdAt: "2018-07-28T00:00:00.000Z",
    updatedAt: "2018-07-28T00:00:00.000Z"
  },
  {
    id: "seed-046",
    berthId: "north-pier-west",
    type: "vessel",
    title: "OSV Green Current",
    startDate: "2018-07-31",
    endDate: "2018-07-31",
    vesselLengthFt: 38,
    createdAt: "2018-07-31T00:00:00.000Z",
    updatedAt: "2018-07-31T00:00:00.000Z"
  },
  {
    id: "seed-047",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V High Horizon",
    startDate: "2018-08-02",
    endDate: "2018-08-05",
    vesselLengthFt: 138,
    createdAt: "2018-08-02T00:00:00.000Z",
    updatedAt: "2018-08-02T00:00:00.000Z"
  },
  {
    id: "seed-048",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-10-18",
    endDate: "2018-10-21",
    vesselLengthFt: 142,
    createdAt: "2018-10-18T00:00:00.000Z",
    updatedAt: "2018-10-18T00:00:00.000Z"
  },
  {
    id: "seed-049",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-10-26",
    endDate: "2018-10-31",
    vesselLengthFt: 142,
    createdAt: "2018-10-26T00:00:00.000Z",
    updatedAt: "2018-10-26T00:00:00.000Z"
  },
  {
    id: "seed-050",
    berthId: "north-pier-west",
    type: "event",
    title: "Fuel truck",
    startDate: "2018-11-05",
    endDate: "2018-11-05",
    createdAt: "2018-11-05T00:00:00.000Z",
    updatedAt: "2018-11-05T00:00:00.000Z"
  },
  {
    id: "seed-051",
    berthId: "north-pier-west",
    type: "vessel",
    title: "R/V GOLDEN COMPASS",
    startDate: "2018-12-01",
    endDate: "2018-12-31",
    vesselLengthFt: 142,
    createdAt: "2018-12-01T00:00:00.000Z",
    updatedAt: "2018-12-01T00:00:00.000Z"
  },
  {
    id: "seed-052",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-05-09",
    endDate: "2018-05-09",
    vesselLengthFt: 85,
    createdAt: "2018-05-09T00:00:00.000Z",
    updatedAt: "2018-05-09T00:00:00.000Z"
  },
  {
    id: "seed-053",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-06-06",
    endDate: "2018-06-06",
    vesselLengthFt: 85,
    createdAt: "2018-06-06T00:00:00.000Z",
    updatedAt: "2018-06-06T00:00:00.000Z"
  },
  {
    id: "seed-054",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-06-19",
    endDate: "2018-06-26",
    vesselLengthFt: 85,
    createdAt: "2018-06-19T00:00:00.000Z",
    updatedAt: "2018-06-19T00:00:00.000Z"
  },
  {
    id: "seed-055",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-07-01",
    endDate: "2018-07-02",
    vesselLengthFt: 85,
    createdAt: "2018-07-01T00:00:00.000Z",
    updatedAt: "2018-07-01T00:00:00.000Z"
  },
  {
    id: "seed-056",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-07-09",
    endDate: "2018-07-18",
    vesselLengthFt: 85,
    createdAt: "2018-07-09T00:00:00.000Z",
    updatedAt: "2018-07-09T00:00:00.000Z"
  },
  {
    id: "seed-057",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-07-25",
    endDate: "2018-07-31",
    vesselLengthFt: 85,
    createdAt: "2018-07-25T00:00:00.000Z",
    updatedAt: "2018-07-25T00:00:00.000Z"
  },
  {
    id: "seed-058",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-08-01",
    endDate: "2018-08-05",
    vesselLengthFt: 85,
    createdAt: "2018-08-01T00:00:00.000Z",
    updatedAt: "2018-08-01T00:00:00.000Z"
  },
  {
    id: "seed-059",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-08-12",
    endDate: "2018-08-17",
    vesselLengthFt: 85,
    createdAt: "2018-08-12T00:00:00.000Z",
    updatedAt: "2018-08-12T00:00:00.000Z"
  },
  {
    id: "seed-060",
    berthId: "south-float-east",
    type: "vessel",
    title: "M/Y Silver Ketch",
    startDate: "2018-09-16",
    endDate: "2018-09-17",
    vesselLengthFt: 76,
    createdAt: "2018-09-16T00:00:00.000Z",
    updatedAt: "2018-09-16T00:00:00.000Z"
  },
  {
    id: "seed-061",
    berthId: "south-float-east",
    type: "vessel",
    title: "OSV AMBER REEF",
    startDate: "2018-10-02",
    endDate: "2018-10-11",
    vesselLengthFt: 85,
    createdAt: "2018-10-02T00:00:00.000Z",
    updatedAt: "2018-10-02T00:00:00.000Z"
  },
  {
    id: "seed-062",
    berthId: "south-float-east",
    type: "event",
    title: "Public open house",
    startDate: "2018-11-10",
    endDate: "2018-11-10",
    createdAt: "2018-11-10T00:00:00.000Z",
    updatedAt: "2018-11-10T00:00:00.000Z"
  },
  {
    id: "seed-063",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-04-13",
    endDate: "2018-04-13",
    vesselLengthFt: 83,
    createdAt: "2018-04-13T00:00:00.000Z",
    updatedAt: "2018-04-13T00:00:00.000Z"
  },
  {
    id: "seed-064",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-04-27",
    endDate: "2018-04-27",
    vesselLengthFt: 83,
    createdAt: "2018-04-27T00:00:00.000Z",
    updatedAt: "2018-04-27T00:00:00.000Z"
  },
  {
    id: "seed-065",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-05-03",
    endDate: "2018-05-03",
    vesselLengthFt: 83,
    createdAt: "2018-05-03T00:00:00.000Z",
    updatedAt: "2018-05-03T00:00:00.000Z"
  },
  {
    id: "seed-066",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-05-08",
    endDate: "2018-05-10",
    vesselLengthFt: 83,
    createdAt: "2018-05-08T00:00:00.000Z",
    updatedAt: "2018-05-08T00:00:00.000Z"
  },
  {
    id: "seed-067",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-05-15",
    endDate: "2018-05-16",
    vesselLengthFt: 83,
    createdAt: "2018-05-15T00:00:00.000Z",
    updatedAt: "2018-05-15T00:00:00.000Z"
  },
  {
    id: "seed-068",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-05-24",
    endDate: "2018-05-24",
    vesselLengthFt: 83,
    createdAt: "2018-05-24T00:00:00.000Z",
    updatedAt: "2018-05-24T00:00:00.000Z"
  },
  {
    id: "seed-069",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-06-10",
    endDate: "2018-06-10",
    vesselLengthFt: 83,
    createdAt: "2018-06-10T00:00:00.000Z",
    updatedAt: "2018-06-10T00:00:00.000Z"
  },
  {
    id: "seed-070",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-06-25",
    endDate: "2018-06-25",
    vesselLengthFt: 83,
    createdAt: "2018-06-25T00:00:00.000Z",
    updatedAt: "2018-06-25T00:00:00.000Z"
  },
  {
    id: "seed-071",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-01",
    endDate: "2018-07-01",
    vesselLengthFt: 83,
    createdAt: "2018-07-01T00:00:00.000Z",
    updatedAt: "2018-07-01T00:00:00.000Z"
  },
  {
    id: "seed-072",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-08",
    endDate: "2018-07-08",
    vesselLengthFt: 83,
    createdAt: "2018-07-08T00:00:00.000Z",
    updatedAt: "2018-07-08T00:00:00.000Z"
  },
  {
    id: "seed-073",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-10",
    endDate: "2018-07-10",
    vesselLengthFt: 83,
    createdAt: "2018-07-10T00:00:00.000Z",
    updatedAt: "2018-07-10T00:00:00.000Z"
  },
  {
    id: "seed-074",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-13",
    endDate: "2018-07-13",
    vesselLengthFt: 83,
    createdAt: "2018-07-13T00:00:00.000Z",
    updatedAt: "2018-07-13T00:00:00.000Z"
  },
  {
    id: "seed-075",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-15",
    endDate: "2018-07-15",
    vesselLengthFt: 83,
    createdAt: "2018-07-15T00:00:00.000Z",
    updatedAt: "2018-07-15T00:00:00.000Z"
  },
  {
    id: "seed-076",
    berthId: "south-float-west",
    type: "vessel",
    title: "S/V Swift Marlin",
    startDate: "2018-07-20",
    endDate: "2018-07-20",
    vesselLengthFt: 28,
    createdAt: "2018-07-20T00:00:00.000Z",
    updatedAt: "2018-07-20T00:00:00.000Z"
  },
  {
    id: "seed-077",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-22",
    endDate: "2018-07-22",
    vesselLengthFt: 83,
    createdAt: "2018-07-22T00:00:00.000Z",
    updatedAt: "2018-07-22T00:00:00.000Z"
  },
  {
    id: "seed-078",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-07-29",
    endDate: "2018-07-29",
    vesselLengthFt: 83,
    createdAt: "2018-07-29T00:00:00.000Z",
    updatedAt: "2018-07-29T00:00:00.000Z"
  },
  {
    id: "seed-079",
    berthId: "south-float-west",
    type: "vessel",
    title: "M/V Western Horizon",
    startDate: "2018-07-30",
    endDate: "2018-07-30",
    vesselLengthFt: 74,
    createdAt: "2018-07-30T00:00:00.000Z",
    updatedAt: "2018-07-30T00:00:00.000Z"
  },
  {
    id: "seed-080",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-08-03",
    endDate: "2018-08-03",
    vesselLengthFt: 83,
    createdAt: "2018-08-03T00:00:00.000Z",
    updatedAt: "2018-08-03T00:00:00.000Z"
  },
  {
    id: "seed-081",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-08-05",
    endDate: "2018-08-05",
    vesselLengthFt: 83,
    createdAt: "2018-08-05T00:00:00.000Z",
    updatedAt: "2018-08-05T00:00:00.000Z"
  },
  {
    id: "seed-082",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-08-09",
    endDate: "2018-08-09",
    vesselLengthFt: 83,
    createdAt: "2018-08-09T00:00:00.000Z",
    updatedAt: "2018-08-09T00:00:00.000Z"
  },
  {
    id: "seed-083",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-08-19",
    endDate: "2018-08-19",
    vesselLengthFt: 83,
    createdAt: "2018-08-19T00:00:00.000Z",
    updatedAt: "2018-08-19T00:00:00.000Z"
  },
  {
    id: "seed-084",
    berthId: "south-float-west",
    type: "vessel",
    title: "M/Y Silver Ketch",
    startDate: "2018-09-05",
    endDate: "2018-09-05",
    vesselLengthFt: 76,
    createdAt: "2018-09-05T00:00:00.000Z",
    updatedAt: "2018-09-05T00:00:00.000Z"
  },
  {
    id: "seed-085",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-09-09",
    endDate: "2018-09-09",
    vesselLengthFt: 83,
    createdAt: "2018-09-09T00:00:00.000Z",
    updatedAt: "2018-09-09T00:00:00.000Z"
  },
  {
    id: "seed-086",
    berthId: "south-float-west",
    type: "vessel",
    title: "R/V Long Ketch",
    startDate: "2018-09-19",
    endDate: "2018-09-20",
    vesselLengthFt: 83,
    createdAt: "2018-09-19T00:00:00.000Z",
    updatedAt: "2018-09-19T00:00:00.000Z"
  },
  {
    id: "seed-087",
    berthId: "south-float-west",
    type: "event",
    title: "Float rebuild - no usage permitted",
    startDate: "2018-11-15",
    endDate: "2018-11-18",
    createdAt: "2018-11-15T00:00:00.000Z",
    updatedAt: "2018-11-15T00:00:00.000Z"
  },
];
