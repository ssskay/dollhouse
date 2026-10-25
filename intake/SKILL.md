---
name: dollhouse-intake
description: Build or update a dollhouse (a clickable 3D map of a storage unit, closet, garage or room, with what's on every shelf) from someone talking through their space. Use when the person wants to map a space, says "make a dollhouse of my storage unit/closet/garage", or tells you something moved.
---

# Dollhouse intake

The person describes their space out loud or in rough chat messages. You turn that into two files the viewer reads:

- `spaces/<name>/space.js` — the room, every spot in it, house rules, optional steps
- `spaces/<name>/items.csv` — what is where (then run `python3 tools/csv_to_items.py spaces/<name>` to make `items.js`)

Then run `python3 tools/check.py spaces/<name>` and fix anything it reports before showing them.

Start a new space by copying `spaces/_template/`. The field reference is in `README.md`.

## The one rule: they never measure

Do not ask for a tape measure. Every size comes from something they already know or you can look up:

- **The room.** Storage units are rented by size (5×10, 10×10, 10×15), so the contract or the facility's website has it. For rooms, ask what's along a wall ("a queen bed and a dresser" is about 9 ft) or count floor tiles.
- **Racks, shelves, bins, furniture.** Ask for the brand or where they bought it, then look up the product's listed dimensions. If they can't remember, ask for a photo and estimate from it, and say it's an estimate.
- **Body and common objects.** A doorway is about 3 ft wide and 6 ft 8 in tall. A standard sheet of paper is 8.5×11 in. A forearm from elbow to fingertip is about 1.5 ft. Use whatever they mention.
- **Their phone.** A walk-through video, filmed from the door and panning around, is the best single input. Pull a few stills from it and use them as each spot's `photo`.

When a number is an estimate, put that in the spot's `what` text. Being roughly right and easy to fix beats being exact and never finished.

## How to run the conversation

Let them talk in whatever order things come out. Don't hand them a form. Collect, then structure it yourself at the end of each round.

1. **The room.** Width, depth, ceiling height, where the door is and which side it hinges on. Coordinates: stand in the doorway looking in; x runs left to right, z runs from the door wall (0) to the back wall.
2. **Walk the walls.** Go clockwise from the door: "What's on your left as you walk in? What's next to that?" Each thing they name becomes a spot with a footprint `box: [x0, z0, x1, z1]`, a `height` and a `kind` (rack, shelf, boxes, bin, pile, wardrobe, panel, chair, suitcase, floor, block).
3. **Then the middle.** Piles and anything on the floor. Mark things that block the way in with `blocking: true`.
4. **Addresses.** Give every rack a one-letter code and number its levels top-down: T-1 is the top shelf of rack T. Other spots get a short code (HOLIDAY, SPORTS, INBOX). Tell them to tape the code on the shelf lip. Small things can live in a named bin on a level: the item's address becomes `B-2 LEGOBIN`.
5. **House rules.** For each kind of thing they own, one place it goes: "Kind of thing in your hand → spot." Always include an INBOX for anything undecided, so nothing ends up on the floor. Keep walkways and the floor empty by rule.
6. **The plan (optional).** If they're reorganizing: which spots stay, clear out (`plan: "gone"`), move (`plan: "move"` with `moveTo`), or are new (`plan: "new"`), and where the walkway will be (`plan.walkways`).
7. **Steps (optional).** If there's a build or clear-out day, the order to do it in. Batch what happens in one trip. Each step names the spot it happens at.
8. **Items.** What's on each level. They can list it as they go, or paste an existing inventory spreadsheet; map its location column into `at`. Statuses are free text. By default `grab` glows (things they need on the next trip) and `gone` is hidden. If they want a different glowing list, change `highlight` (a reseller might use `sold`).

## Updating later

When they say "the drill is on A-2 now" or "the crib is gone", change the CSV row (or the spot in space.js), regenerate items.js, run the check, and say what changed in one line. Don't redraw anything they didn't mention.

## Before you show it

- `tools/check.py` passes with no errors.
- Open the page and look at it: does the door sit on the right wall, are racks against the walls they said, do the labels face into the room?
- Ask one question about the thing you're least sure of, not a list.
