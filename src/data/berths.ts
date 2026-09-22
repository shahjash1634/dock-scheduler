import type { Berth } from "../types";

/**
 * Berth catalog, taken directly from the row labels used consistently across
 * every year (1997–2019) of the "Harborview Marine Research Center" dock
 * schedule workbook, e.g. `"North Pier West - 410'"`.
 *
 * Two additional rows in the source workbook — "North Finger Piers" and
 * "Small craft slips (institution boats)" — are NOT modeled as berths here.
 * In the spreadsheet those rows aggregate several small, individually
 * un-numbered slips into a single grid row (extra un-labeled rows are used
 * underneath them for overflow), so a single berth record with a single
 * length doesn't accurately represent them. Modeling that properly would
 * mean inventing a slip-numbering scheme the source data doesn't actually
 * contain. Documented as a scope decision in the README rather than guessed.
 */
export const BERTHS: Berth[] = [
  {
    id: "north-pier-west",
    name: "North Pier West",
    lengthFt: 410,
    description: "The facility's longest berth; typically hosts the largest research vessels.",
  },
  {
    id: "north-pier-face",
    name: "North Pier Face",
    lengthFt: 75,
  },
  {
    id: "north-pier-east",
    name: "North Pier East",
    lengthFt: 240,
  },
  {
    id: "inner-channel",
    name: "Inner Channel",
    lengthFt: 55,
  },
  {
    id: "south-float-west",
    name: "South Float West",
    lengthFt: 90,
  },
  {
    id: "south-float-east",
    name: "South Float East",
    lengthFt: 90,
  },
];
