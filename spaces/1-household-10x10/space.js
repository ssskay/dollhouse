/* Demo space: an invented 10 x 10 ft storage unit, the kind a lot of households rent after a move.
   Every size here is an estimate from a walk-through, not a tape measure, which is the point.
   Units: feet. x = left to right as you stand in the doorway looking in. z = door wall (0) to back wall (10).
   box = [x0, z0, x1, z1] footprint on the floor. height = how tall it stands. */
window.DOLLHOUSE = {
  backLink: "../../index.html",
  title: "The Household Unit",
  eyebrow: "Example 1 of 5 · 10×10 storage unit · invented data",
  cover: "photos/door.jpg",
  subtitle: "Tap a spot to see what's there. Tap a shelf to read each level. Plan shows the walkway once the moving boxes are dealt with.",
  room: { width: 10, depth: 10, height: 8, door: { from: 1, to: 9, type: "rollup" } },

  now: {
    headline: "Path in: around the bike, over the boxes",
    summary: "The exercise bike sits right inside the door and the moving boxes nobody unpacked fill the middle, so the back is hard to reach."
  },
  plan: {
    headline: "Walkway: door straight to the back",
    summary: "Open the moving boxes, put what you keep on the shelves by the house rules, and move the bike to the back. A 2 ft walkway opens up the middle.",
    walkways: [[4.0, 0.1, 6.0, 8.2]]
  },

  /* what glows when you open the page */
  highlight: { label: "Grab next trip", statuses: ["grab"], summary: "Things you said you need soon. They're on the glowing shelves." },
  hideStatuses: ["gone"],

  spots: [
    { id: "shelfA", code: "A", name: "Metal shelf A · emergency and fix-it", kind: "rack", photo: "photos/shelfA.jpg", box: [0.15, 0.5, 1.6, 4.5], height: 6, levels: 4,
      what: "Four-level metal shelf on the left wall, nearest the door.", todo: "Emergency kit at eye level (A-2) so it's the first thing you reach. Tools, spare parts and paint below." },
    { id: "yard", code: "YARD", name: "Yard and weather gear", kind: "block", box: [0.15, 4.8, 1.3, 6.3], height: 4, color: "#7fa36b",
      what: "Lawn chairs and the patio umbrella in summer; snow shovel and ice melt in winter. The window AC unit sits under them.", todo: "Swap what's in front each spring and fall." },
    { id: "couch", code: "COUCH", name: "Old sectional and coffee table", kind: "block", box: [0.2, 6.6, 3.1, 9.8], height: 3, color: "#8c7b6a",
      what: "The sectional from the old place, cushions stacked on top, coffee table upside down on it.", todo: "Keeping it for the next apartment." },
    { id: "bed", code: "BED", name: "Mattress and bed frame", kind: "block", box: [3.4, 9.3, 7.2, 9.85], height: 6.5, color: "#e8e3d8",
      what: "Queen mattress on its side against the back wall, frame pieces behind it.", todo: "Stays bagged and standing up." },
    { id: "holiday", code: "HOLIDAY", name: "Holiday bins and the fake tree", kind: "boxes", photo: "photos/holiday.jpg", box: [7.4, 6.6, 9.85, 9.85], height: 4.5, color: "#c0392b",
      what: "Red and green bins, the artificial tree in its box, the Halloween bins on top.", todo: "Holiday stuff only. Next season's bins go in front." },
    { id: "sports", code: "SPORTS", name: "Sports corner", kind: "boxes", box: [8.5, 4.9, 9.85, 6.4], height: 3.5, color: "#4f7cac",
      what: "Golf bag, two kids' bikes, a bucket of balls and rackets.", todo: "Anything with wheels or a bag." },
    { id: "shelfB", code: "B", name: "Metal shelf B · keepsakes and camping", kind: "rack", photo: "photos/shelfB.jpg", box: [8.4, 0.6, 9.85, 4.6], height: 6, levels: 5,
      what: "Five-level metal shelf on the right wall.", todo: "Paper and keepsakes up high, camping gear down low." },
    { id: "bike", code: "BIKE", name: "Exercise bike", kind: "block", box: [4.3, 1.0, 5.5, 2.8], height: 4, color: "#3b3f45", plan: "move", moveTo: [3.4, 7.8, 4.6, 9.1], blocking: true,
      what: "Bought in January, used twice. Parked right inside the door.", todo: "Moves to the back, next to the mattress." },
    { id: "saved", code: "SAVED", name: "Saved for someone", kind: "boxes", photo: "photos/saved.jpg", box: [5.0, 8.3, 7.2, 9.25], height: 3, color: "#9ec7e8",
      what: "Clear bins of baby gear and hand-me-downs, each one labelled with who it's for.", todo: "Only things already promised to someone. Write the name on the bin." },
    { id: "boxes", code: "BOXES", name: "Moving boxes nobody unpacked", kind: "pile", photo: "photos/boxes.jpg", box: [3.0, 3.2, 7.0, 8.1], height: 3, plan: "gone", blocking: true,
      what: "Labelled \"kitchen misc\", \"office\", \"DO NOT OPEN\" and \"???\". Some since the last move.", todo: "Open one at a time. Keepers go to a shelf by the house rules; the rest goes in the leaving pile." },
    { id: "inbox", code: "INBOX", name: "Not-sure bin", kind: "bin", box: [1.8, 0.3, 2.7, 1.2], height: 1.4, color: "#d9a441",
      what: "One bin just inside the door.", todo: "Anything you can't decide on. Sort it next trip." }
  ],

  /* kind of thing in your hand -> where it goes */
  rules: [
    { thing: "Holiday decorations", at: "HOLIDAY", note: "Back right. The season coming up goes in front.", spot: "holiday" },
    { thing: "Emergency kit, flashlights, first aid", at: "A-2", note: "Eye level on the shelf nearest the door. Never behind anything.", spot: "shelfA" },
    { thing: "Tools, spare tiles, paint", at: "A-3", note: "Paint labelled by room.", spot: "shelfA" },
    { thing: "Promised to someone (hand-me-downs, baby gear)", at: "SAVED", note: "Bin labelled with their name.", spot: "saved" },
    { thing: "Hosting stuff (folding chairs, air mattress)", at: "B-5", note: "Bottom of shelf B.", spot: "shelfB" },
    { thing: "Photos, yearbooks, kids' art", at: "B-1 / B-2", note: "Top of shelf B, away from the floor.", spot: "shelfB" },
    { thing: "Tax papers and records", at: "B-3", note: "File boxes, labelled by year.", spot: "shelfB" },
    { thing: "Camping gear", at: "B-4", note: "Second from the bottom on shelf B.", spot: "shelfB" },
    { thing: "Sports gear and bikes", at: "SPORTS", note: "Right wall, between the shelf and the holiday bins.", spot: "sports" },
    { thing: "Furniture", at: "COUCH / BED", note: "Back half. Nothing stacked on the mattress.", spot: "couch" },
    { thing: "Seasonal yard and weather gear", at: "YARD", note: "Left wall. The season you're in goes in front.", spot: "yard" },
    { thing: "Not sure", at: "INBOX", note: "Just inside the door.", spot: "inbox" }
  ],

  /* optional: an ordered checklist */
  stepsLabel: "Clean-out day",
  stepsTitle: "Clean-out day, in order",
  stepsSummary: "Tick each one as you go. Tap a step to see where it happens.",
  steps: [
    { title: "Exercise bike to the back", note: "Next to the mattress. The door area clears.", spot: "bike" },
    { title: "Start a leaving pile outside the door", note: "Anything going goes straight there, not back inside.", spot: "inbox" },
    { title: "Open the moving boxes, one at a time", note: "Keepers onto a shelf by the house rules. Don't re-tape a box you've opened.", spot: "boxes" },
    { title: "Halloween bins to the front of HOLIDAY", note: "So next trip is quick.", spot: "holiday" },
    { title: "Check the emergency shelf", note: "Flashlight batteries, the date on the water jugs, the first aid kit.", spot: "shelfA" },
    { title: "Label the shelf lips, top down", note: "A-1 and B-1 are the top shelves.", spot: "shelfB" }
  ]
};
