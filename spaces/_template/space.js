/* Copy this folder (spaces/_template -> spaces/my-space), then describe your space to an AI using intake/SKILL.md,
   or fill this in by hand. Field reference: README.md, "space.js".
   Units: anything, as long as you stay consistent (feet works well).
   x = left to right as you stand in the doorway looking in. z = door wall (0) to back wall.
   box = [x0, z0, x1, z1] footprint on the floor. Rack levels are numbered top-down: X-1 is the top shelf. */
window.DOLLHOUSE = {
  title: "My Space",
  subtitle: "Tap a spot to see what's there.",
  room: { width: 10, depth: 10, height: 8, door: { from: 3.5, to: 6.5, hinge: "right" } },
  now: { headline: "The way in", summary: "" },
  plan: { headline: "The plan", summary: "", walkways: [] },
  highlight: { label: "Grab next trip", statuses: ["grab"] },
  hideStatuses: ["gone"],
  spots: [
    { id: "rack-a", code: "A", name: "Rack A", kind: "rack", box: [8.5, 1, 9.85, 5], height: 6, levels: 5,
      what: "What it is and where.", todo: "What belongs here." }
  ],
  rules: [
    { thing: "Example: books", at: "A-2", note: "Second shelf from the top.", spot: "rack-a" }
  ],
  steps: []
};
