#!/usr/bin/env python3
"""Turn a space's items.csv into items.js so the page opens with a double-click (no server).

Usage:
    python3 tools/csv_to_items.py spaces/my-closet
    python3 tools/csv_to_items.py spaces/my-closet/items.csv -v

items.csv columns (header row required, extra columns are kept):
    name    what the thing is
    at      where it is: a level like T-4, a spot code like SHIP, optionally a bin after a space ("S-3 SMOLBIN")
    status  free text; the space's highlight statuses (default "sold") glow, hideStatuses (default shipped/gone) are hidden
    note    optional
"""
import argparse
import csv
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

log = logging.getLogger("csv_to_items")
REQUIRED = ("name", "at")


def find_csv(target: Path) -> Path:
    if target.is_dir():
        target = target / "items.csv"
    if not target.exists():
        log.error("no items.csv at %s", target)
        sys.exit(1)
    return target


def read_rows(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        cols = [c.strip().lower() for c in (reader.fieldnames or [])]
        missing = [c for c in REQUIRED if c not in cols]
        if missing:
            log.error("%s is missing column(s): %s (has: %s)", path, ", ".join(missing), ", ".join(cols))
            sys.exit(1)
        rows, skipped = [], 0
        for i, raw in enumerate(reader, start=2):
            row = {(k or "").strip().lower(): (v or "").strip() for k, v in raw.items()}
            if not row.get("name"):
                skipped += 1
                log.debug("line %d: no name, skipped", i)
                continue
            if not row.get("at"):
                log.warning("line %d: %r has no 'at' address; it will show as unplaced", i, row["name"])
            rows.append(row)
    log.info("read %d item(s) from %s (%d blank row(s) skipped)", len(rows), path, skipped)
    return rows


def write_js(rows: list[dict], out: Path, source: Path) -> None:
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    body = json.dumps(rows, ensure_ascii=False, indent=1)
    out.write_text(
        f"/* Generated from {source.name} by tools/csv_to_items.py on {stamp}. Edit the CSV, not this file. */\n"
        f"window.DOLLHOUSE_ITEMS = {body};\n",
        encoding="utf-8",
    )
    statuses: dict[str, int] = {}
    for r in rows:
        statuses[r.get("status", "") or "(none)"] = statuses.get(r.get("status", "") or "(none)", 0) + 1
    log.info("wrote %s | statuses: %s", out, ", ".join(f"{k}={v}" for k, v in sorted(statuses.items())))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", type=Path, help="a space folder or its items.csv")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    src = find_csv(args.target)
    write_js(read_rows(src), src.with_name("items.js"), src)


if __name__ == "__main__":
    main()
