/* Demo space: an invented 10 x 20 ft storage unit holding a whole house between homes
   (sold the old place, renting short-term until the new one is ready).
   Boxes grouped by room down the left wall, furniture down the right and at the back, an aisle in the middle.
   Units: feet. x = left to right from the doorway. z = door wall (0) to back wall (20). */
window.DOLLHOUSE = {
  backLink: "../../index.html",
  title: "Between Homes",
  eyebrow: "Example 3 of 5 · 10×20 storage unit · invented data",
  cover: "photos/door.jpg",
  subtitle: "A whole three-bedroom house, parked for four months. Boxes by room, furniture by size, and the boxes you'll want first night right by the door.",
  room: { width: 10, depth: 20, height: 10, door: { from: 1, to: 9, type: "rollup" } },

  now: {
    headline: "Aisle clear, door to back wall",
    summary: "The movers packed it in rows: boxes by room on the left, furniture on the right, beds against the back. The aisle down the middle stays open."
  },
  plan: {
    headline: "Move-in day: unload in the order you need it",
    summary: "Whatever goes on the truck first comes off last. So the furniture goes on first and the open-first boxes ride in the car.",
    walkways: [[4.0, 0.1, 6.0, 18.5]]
  },

  highlight: { label: "Unload first", statuses: ["first"], summary: "The first night in the new place: sheets, a shower curtain, coffee, chargers, the bag of bed bolts, and the stuffed animals nobody can sleep without." },
  hideStatuses: ["gone"],

  spots: [
    { id: "first", code: "FIRST", name: "Open-first boxes", kind: "boxes", box: [6.5, 0.4, 9.85, 2.4], height: 2.6, color: "#d9a441", photo: "photos/first.jpg",
      what: "Four boxes marked OPEN FIRST in red, right inside the door.", todo: "These ride in the car on move-in day, not the truck." },
    { id: "kitchen", code: "KITCHEN", name: "Kitchen boxes", kind: "boxes", box: [0.15, 0.4, 3.6, 5.0], height: 5.2, photo: "photos/kitchen.jpg",
      what: "Fourteen boxes and two dish-pack boxes, stacked three high, labelled KITCHEN on two sides.", todo: "Heaviest on the bottom. Label faces the aisle." },
    { id: "bedrooms", code: "BEDROOMS", name: "Bedroom boxes", kind: "boxes", box: [0.15, 5.3, 3.6, 10.0], height: 5.2,
      what: "Eleven boxes plus four tall wardrobe boxes.", todo: "Label faces the aisle." },
    { id: "kids", code: "KIDS", name: "Kids' room boxes", kind: "boxes", box: [0.15, 10.3, 3.6, 13.6], height: 4.6, color: "#c79560",
      what: "Six boxes and the crib, taken apart and bagged.", todo: "The stuffed-animals box sits on top, where it can be seen." },
    { id: "shelf", code: "R", name: "Shelf R · lamps, tools, the TV", kind: "rack", box: [8.3, 2.8, 9.85, 7.8], height: 6.5, levels: 5,
      what: "Five-level metal shelf on the right wall for the small, fragile and easy-to-lose things.", todo: "Anything that would get crushed in a stack." },
    { id: "piano", code: "PIANO", name: "Upright piano", kind: "block", box: [7.6, 8.2, 9.85, 10.4], height: 4.2, color: "#2b1d16", photo: "photos/piano.jpg",
      what: "Upright piano, padded and strapped, on a furniture dolly.", todo: "The movers move it. Nobody else touches it." },
    { id: "dining", code: "DINING", name: "Dining table and chairs", kind: "block", box: [6.4, 10.8, 9.85, 15.0], height: 5, color: "#8c6a4a",
      what: "Table on its side with the legs off, chairs stacked in pairs behind it.", todo: "Legs and bolts in a bag taped under the tabletop." },
    { id: "dressers", code: "DRESSERS", name: "Dressers and nightstands", kind: "block", box: [0.15, 14.0, 3.6, 18.5], height: 4.2, color: "#a07a52",
      what: "Three dressers in moving blankets, nightstands on top.", todo: "Drawers stay in, with clothes still in them." },
    { id: "outdoor", code: "OUTDOOR", name: "Grill and mower", kind: "block", box: [6.4, 15.5, 9.85, 18.5], height: 3.6, color: "#3b3f45",
      what: "Gas grill with the propane tank removed, lawn mower with the fuel drained.", todo: "Most storage places don't allow propane or gas in a unit, so tanks and fuel stay out." },
    { id: "beds", code: "BEDS", name: "Mattresses and bed frames", kind: "block", box: [0.3, 18.8, 9.7, 19.85], height: 7, color: "#e8e3d8", photo: "photos/beds.jpg",
      what: "King and two twins standing on edge in plastic mattress bags, frames behind them.", todo: "Standing on edge against the back wall. Nothing leans on them." }
  ],

  rules: [
    { thing: "Need it the first night", at: "FIRST", note: "Right inside the door. Goes in the car.", spot: "first" },
    { thing: "Boxes", at: "KITCHEN / BEDROOMS / KIDS", note: "By room, left wall, label facing the aisle.", spot: "kitchen" },
    { thing: "Small, fragile, easy to lose", at: "R-#", note: "Shelf on the right wall.", spot: "shelf" },
    { thing: "Hardware (bolts, legs, brackets)", at: "R-2", note: "One bag per piece of furniture, labelled. Or taped to the piece itself.", spot: "shelf" },
    { thing: "Furniture", at: "right wall / back", note: "Biggest at the back.", spot: "dining" },
    { thing: "Anything with fuel", at: "OUTDOOR", note: "Drained, tank out. Check your facility's rules.", spot: "outdoor" }
  ],

  stepsLabel: "Move-in day",
  stepsTitle: "Move-in day, in loading order",
  stepsSummary: "First on the truck is last off, so this is the order things go on.",
  steps: [
    { title: "Car, not truck: the open-first boxes, the hardware bag, the stuffed-animals box", note: "These are in the house before the truck is even open.", spot: "first" },
    { title: "Truck first: piano, dressers, dining table", note: "Heaviest against the cab. The movers do the piano.", spot: "piano" },
    { title: "Mattresses and frames along the truck wall", note: "Standing on edge, still bagged.", spot: "beds" },
    { title: "Boxes by room, heaviest on the bottom", note: "Kitchen, then bedrooms, then kids.", spot: "kitchen" },
    { title: "Grill and mower last on", note: "First off, straight to the new garage.", spot: "outdoor" },
    { title: "Photo of the empty unit before you lock it", note: "For the move-out check.", spot: "first" }
  ]
};
