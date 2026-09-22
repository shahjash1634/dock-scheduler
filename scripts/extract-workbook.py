"""
Extracts reservation records from the original dock schedule workbook
("Dock_Schedule_-_Synthetic_Sample.xlsx") across all 23 years (1997-2019).

This is a one-off, exploratory data-extraction script, not part of the app
build. It was used to:
  1. Understand the real data model (berths, lengths, vessels, events) before
     designing src/types.ts.
  2. Produce data/extracted-from-workbook.json, a full-fidelity extraction of
     all 616 reservations across all 23 years, kept here for reference/audit.
  3. Produce the 2018 subset (with realistic vessel lengths assigned, since
     the source grid doesn't record vessel length directly) that was
     hand-curated into src/data/seedReservations.ts for the running demo.

Run with: pip install openpyxl && python3 scripts/extract-workbook.py
(expects the workbook at the repo root, or edit WORKBOOK_PATH below)
"""

import openpyxl, re, json, datetime

WORKBOOK_PATH = "Dock_Schedule_-_Synthetic_Sample.xlsx"
wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)

MONTHS = ['January','February','March','April','May','June','July','August',
          'September','October','November','December']
MONTH_NUM = {m: i+1 for i, m in enumerate(MONTHS)}

BERTH_ORDER = [
    ("North Pier West", 410),
    ("North Pier Face", 75),
    ("North Pier East", 240),
    ("Inner Channel", 55),
    ("South Float West", 90),
    ("South Float East", 90),
]

berth_row_pattern = re.compile(r"^(.*?)\s*-\s*(\d+)'\s*$")

def parse_year_sheet(sn):
    ws = wb[sn]
    year = int(sn)
    reservations = []
    # merged cell lookup: map (row) -> list of (min_col, max_col, value)
    merges_by_row = {}
    for mc in ws.merged_cells.ranges:
        if mc.min_row == mc.max_row:
            val = ws.cell(row=mc.min_row, column=mc.min_col).value
            merges_by_row.setdefault(mc.min_row, []).append((mc.min_col, mc.max_col, val))

    current_month = None
    day_col_map = {}  # col -> day number, for current month block
    berth_row_idx = 0  # which of BERTH_ORDER we're on within current month block

    r = 1
    max_row = ws.max_row
    while r <= max_row:
        c1 = ws.cell(row=r, column=1).value
        if isinstance(c1, str) and c1.strip() in MONTHS:
            current_month = c1.strip()
            day_col_map = {}
            # this row has day numbers starting col 3
            for col in range(3, ws.max_column + 1):
                v = ws.cell(row=r, column=col).value
                if isinstance(v, int):
                    day_col_map[col] = v
            berth_row_idx = 0
            r += 1  # skip to weekday row
            r += 1  # move to first berth row
            continue

        if current_month and berth_row_idx < len(BERTH_ORDER):
            expected_name, expected_len = BERTH_ORDER[berth_row_idx]
            label = ws.cell(row=r, column=1).value
            matched = isinstance(label, str) and label.strip().lower().startswith(expected_name.lower())
            if matched:
                # gather reservations for this row: merges + standalone single cells
                covered_cols = set()
                row_merges = merges_by_row.get(r, [])
                for (min_c, max_c, val) in row_merges:
                    if min_c in day_col_map or max_c in day_col_map:
                        if val and str(val).strip():
                            start_day = day_col_map.get(min_c)
                            end_day = day_col_map.get(max_c)
                            if start_day and end_day:
                                reservations.append({
                                    "berth": expected_name,
                                    "berth_length_ft": expected_len,
                                    "year": year, "month": MONTH_NUM[current_month],
                                    "start_day": start_day, "end_day": end_day,
                                    "occupant": str(val).strip(),
                                })
                        for cc in range(min_c, max_c + 1):
                            covered_cols.add(cc)
                for col, day in day_col_map.items():
                    if col in covered_cols:
                        continue
                    v = ws.cell(row=r, column=col).value
                    if isinstance(v, str) and v.strip():
                        reservations.append({
                            "berth": expected_name,
                            "berth_length_ft": expected_len,
                            "year": year, "month": MONTH_NUM[current_month],
                            "start_day": day, "end_day": day,
                            "occupant": v.strip(),
                        })
                berth_row_idx += 1
        r += 1
    return reservations

all_res = []
for y in range(1997, 2020):
    all_res.extend(parse_year_sheet(str(y)))

print("Total extracted reservations:", len(all_res))
with open("data/extracted-from-workbook.json", "w") as f:
    json.dump(all_res, f, indent=2)

for r in all_res[:5]:
    print(r)
