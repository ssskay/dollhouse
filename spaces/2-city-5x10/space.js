/* Demo space: an invented 5 x 10 ft storage unit for a city apartment with no closet space.
   Long and narrow: one shelf down the right wall, a 2 ft aisle, things standing along the left.
   Units: feet. x = left to right from the doorway. z = door wall (0) to back wall (10). */
window.DOLLHOUSE = {
  backLink: "../../index.html",
  title: "The City Apartment Overflow",
  eyebrow: "Example 2 of 5 · 5×10 storage unit · invented data",
  cover: "photos/door.jpg",
  subtitle: "A narrow unit that holds whatever the apartment can't: the off-season, the hobby on pause, the furniture with nowhere to go.",
  room: { width: 5, depth: 10, height: 8, door: { from: 0.5, to: 4.5, type: "rollup" } },

  now: {
    headline: "Aisle blocked halfway back",
    summary: "Last trip's drop-offs are sitting in the aisle, so the back half (winter coats, skis) means climbing over them."
  },
  plan: {
    headline: "Keep the aisle empty, door to back wall",
    summary: "Everything lives against a wall. The 2 ft aisle down the middle stays clear, so you can reach the back without moving anything.",
    walkways: [[1.3, 0.1, 3.4, 8.2]]
  },

  highlight: { label: "Season swap", statuses: ["swap"], summary: "It's getting cold. These come home this trip; the summer things go back in their place." },
  hideStatuses: ["gone"],

  spots: [
    { id: "shelf", code: "A", name: "Shelf A · runs down the right wall", kind: "rack", box: [3.5, 0.4, 4.85, 4.4], height: 6, levels: 5, photo: "photos/shelf.jpg",
      what: "Five-level metal shelf, 18 in deep, the whole front half of the right wall.", todo: "Keepsakes up top, the season you're not in at hand height, heavy things at the bottom." },
    { id: "bike", code: "BIKE", name: "Road bike", kind: "block", box: [0.15, 0.4, 1.2, 5.6], height: 3.4, color: "#2f6f8f", photo: "photos/bike.jpg",
      what: "Standing on its wheels along the left wall, handlebars turned flat.", todo: "Summer only. Comes out in April." },
    { id: "aisle", code: "AISLE", name: "Stuff dropped in the aisle", kind: "pile", box: [1.4, 3.2, 3.3, 5.2], height: 2.2, plan: "gone", blocking: true,
      what: "A bag of returns, flattened boxes, a lamp with no shade.", todo: "Nothing lives in the aisle. Put it against a wall or take it home." },
    { id: "coats", code: "COATS", name: "Wardrobe boxes", kind: "boxes", box: [0.15, 6.0, 1.6, 8.0], height: 4, photo: "photos/coats.jpg",
      what: "Two tall cardboard wardrobe boxes with a hanging bar inside.", todo: "Whatever season you're not wearing, hanging." },
    { id: "luggage", code: "LUGGAGE", name: "Luggage and the window AC", kind: "boxes", box: [3.5, 4.7, 4.85, 6.5], height: 2.6, color: "#2b2e31",
      what: "Two suitcases standing up, the window AC unit in its box behind them.", todo: "AC goes back in the window in May." },
    { id: "ski", code: "SKI", name: "Skis and snowboard", kind: "block", box: [3.7, 6.8, 4.85, 8.2], height: 5.6, color: "#c0392b", photo: "photos/ski.jpg",
      what: "Leaning in the corner, boots in a bag at their feet.", todo: "Winter only." },
    { id: "music", code: "MUSIC", name: "Guitar and keyboard", kind: "block", box: [1.0, 8.5, 2.9, 9.85], height: 3.4, color: "#3b3f45",
      what: "Guitar in its hard case, the keyboard on its stand folded flat.", todo: "On pause, not gone." },
    { id: "chairs", code: "CHAIRS", name: "Extra dining chairs", kind: "block", box: [3.1, 8.5, 4.85, 9.85], height: 3.2, color: "#a07a52",
      what: "Four chairs stacked seat-to-seat.", todo: "Out for parties, back the next day." },
    { id: "art", code: "ART", name: "Framed art, leaning", kind: "block", box: [0.15, 8.3, 0.6, 9.85], height: 3, color: "#e8e3d8",
      what: "Three framed posters with cardboard corners, leaning on the left wall.", todo: "Waiting for a place with more wall." }
  ],

  rules: [
    { thing: "The season you're not in", at: "COATS / A-3", note: "Wardrobe boxes for hanging, A-3 for folded.", spot: "coats" },
    { thing: "Keepsakes", at: "A-1", note: "Top shelf, away from the floor.", spot: "shelf" },
    { thing: "Holiday decor", at: "A-2", note: "One tote. If it doesn't fit the tote, it doesn't come back.", spot: "shelf" },
    { thing: "Heavy things", at: "A-5", note: "Bottom shelf.", spot: "shelf" },
    { thing: "Anything with wheels or a case", at: "left wall", note: "Standing along the wall, never in the aisle.", spot: "bike" },
    { thing: "Furniture", at: "CHAIRS / ART", note: "Back wall.", spot: "chairs" }
  ],

  stepsLabel: "Season swap",
  stepsTitle: "Fall season swap, in order",
  stepsSummary: "One trip. Bring the summer things in a tote, leave with the winter ones.",
  steps: [
    { title: "Clear the aisle first", note: "Everything sitting there goes against a wall or into the car.", spot: "aisle" },
    { title: "Winter coats, boots and sweaters out of the wardrobe boxes", note: "Summer clothes from the tote go back on the hangers.", spot: "coats" },
    { title: "Space heater and humidifier off A-4", note: "Box fan and beach towels go back in their place.", spot: "shelf" },
    { title: "Skis and boots to the car", note: "Check the boots still fit before the season starts.", spot: "ski" },
    { title: "Bike stays", note: "It's the last thing in the door, so it's the first thing out in April.", spot: "bike" }
  ]
};
