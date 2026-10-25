#!/usr/bin/env python3
"""Sanity-check a space before you open it: catches the mistakes an AI (or a person) makes when writing space.js.

Checks:
  - every spot has an id, a name and a 4-number box inside the room
  - ids and codes are unique
  - spots don't overlap each other on the floor (warning: piles and things on top of each other are allowed)
  - racks have a code and a level count
  - every item address points at a real spot / level
  - rules and steps point at real spot ids

Usage:
    python3 tools/check.py spaces/my-closet
Exit code 1 if there are errors, 0 if only warnings or nothing.

Needs node on PATH (space.js is JavaScript; node evaluates it in a sandbox to read the data).
"""
import argparse
import json
import logging
import re
import shutil
import subprocess
import sys
from pathlib import Path

log = logging.getLogger("check")

NODE_READ = r"""
const fs = require('fs'), vm = require('vm');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of process.argv.slice(1)) { if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }); }
process.stdout.write(JSON.stringify({ space: ctx.window.DOLLHOUSE || null, items: ctx.window.DOLLHOUSE_ITEMS || null }));
"""


def load(folder: Path) -> tuple[dict, list]:
    node = shutil.which("node")
    if not node:
        log.error("node is not installed; it is needed to read space.js")
        sys.exit(2)
    files = [str(folder / "space.js"), str(folder / "items.js")]
    res = subprocess.run([node, "-e", NODE_READ, *files], capture_output=True, text=True)
    if res.returncode != 0:
        log.error("space.js / items.js did not run:\n%s", res.stderr.strip())
        sys.exit(1)
    data = json.loads(res.stdout)
    if not data["space"]:
        log.error("%s/space.js did not set window.DOLLHOUSE", folder)
        sys.exit(1)
    if data["items"] is None:
        log.warning("no items.js (run tools/csv_to_items.py if you have an items.csv)")
    return data["space"], data["items"] or []


def overlap(a, b) -> float:
    w = min(a[2], b[2]) - max(a[0], b[0])
    d = min(a[3], b[3]) - max(a[1], b[1])
    return w * d if w > 0 and d > 0 else 0.0


def check(space: dict, items: list) -> tuple[list, list]:
    errs, warns = [], []
    room = space.get("room") or {}
    W, D = room.get("width"), room.get("depth")
    if not (isinstance(W, (int, float)) and isinstance(D, (int, float))):
        errs.append("room.width and room.depth must be numbers")
        W, D = 1e9, 1e9
    spots = space.get("spots") or []
    ids, codes = {}, {}
    for i, s in enumerate(spots):
        sid = s.get("id")
        where = f"spot #{i + 1} ({sid or s.get('name') or '?'})"
        if not sid:
            errs.append(f"{where}: missing id")
        elif sid in ids:
            errs.append(f"{where}: id '{sid}' used twice")
        ids[sid] = s
        if not s.get("name"):
            warns.append(f"{where}: no name")
        code = (s.get("code") or "").upper()
        if code:
            if code in codes:
                errs.append(f"{where}: code '{code}' used twice")
            codes[code] = s
        b = s.get("box")
        if not (isinstance(b, list) and len(b) == 4 and all(isinstance(v, (int, float)) for v in b)):
            errs.append(f"{where}: box must be [x0, z0, x1, z1]")
            continue
        if b[0] >= b[2] or b[1] >= b[3]:
            errs.append(f"{where}: box {b} has x0 >= x1 or z0 >= z1")
        if min(b) < 0 or b[2] > W + 0.01 or b[3] > D + 0.01:
            errs.append(f"{where}: box {b} sticks outside the {W} x {D} room")
        if s.get("kind") in ("rack", "shelf"):
            if not code:
                warns.append(f"{where}: rack has no code, so its levels can't be addressed")
            if not s.get("levels"):
                warns.append(f"{where}: rack has no levels count")
        mt = s.get("moveTo")
        if mt and (len(mt) != 4 or min(mt) < 0 or mt[2] > W + 0.01 or mt[3] > D + 0.01):
            errs.append(f"{where}: moveTo {mt} is outside the room")
    solid = [s for s in spots if isinstance(s.get("box"), list) and s.get("kind") not in ("pile", "floor") and s.get("plan") != "new"
             and not s.get("elevation")]  # mounted things (overhead racks, hooks) sit above whatever is under them
    for i, a in enumerate(solid):
        for b in solid[i + 1:]:
            ov = overlap(a["box"], b["box"])
            if ov > 0.25:
                warns.append(f"spots '{a['id']}' and '{b['id']}' overlap by {ov:.1f} sq units on the floor")
    for i, it in enumerate(items):
        at = str(it.get("at") or "").strip().upper()
        head = re.split(r"[\s/,]+", at)[0] if at else ""
        m = re.match(r"^([A-Z0-9]+)-(\d+)[A-Z]?$", head)
        name = it.get("name") or f"item #{i + 1}"
        if not head:
            warns.append(f"item '{name}': no address")
        elif m and m.group(1) in codes:
            lv = codes[m.group(1)].get("levels")
            if lv and not 1 <= int(m.group(2)) <= lv:
                errs.append(f"item '{name}': {head} but {m.group(1)} only has {lv} level(s)")
        elif head not in codes and head not in {k.upper() for k in ids if k}:
            errs.append(f"item '{name}': address '{it.get('at')}' matches no spot code")
    for i, r in enumerate(space.get("rules") or []):
        if r.get("spot") and r["spot"] not in ids:
            errs.append(f"rule #{i + 1} ('{r.get('thing')}'): spot '{r['spot']}' does not exist")
    for i, st in enumerate(space.get("steps") or []):
        if st.get("spot") and st["spot"] not in ids:
            errs.append(f"step #{i + 1} ('{st.get('title')}'): spot '{st['spot']}' does not exist")
    return errs, warns


def main() -> None:
    ap = argparse.ArgumentParser(description="Check a dollhouse space folder.")
    ap.add_argument("folder", type=Path)
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(levelname)s %(message)s")
    space, items = load(args.folder)
    log.info("space '%s': %d spot(s), %d rule(s), %d step(s), %d item(s)", space.get("title"), len(space.get("spots") or []),
             len(space.get("rules") or []), len(space.get("steps") or []), len(items))
    errs, warns = check(space, items)
    for w in warns:
        log.warning(w)
    for e in errs:
        log.error(e)
    log.info("%d error(s), %d warning(s)", len(errs), len(warns))
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
