/* Demo space: an invented two-car garage on the Gulf Coast, about 20 x 22 ft.
   Shows things that aren't storage units: a parked car, a pegboard on the wall, an overhead rack above the car,
   and a storm-prep list that glows when the season starts.
   Units: feet. x = left to right standing in the big door looking in. z = door (0) to back wall (22).
   elevation = how high off the floor something is mounted. */
window.DOLLHOUSE = {
  backLink: "../../index.html",
  title: "The Two-Car Garage",
  eyebrow: "Example 4 of 5 · two-car garage · invented data",
  cover: "photos/door.jpg",
  subtitle: "One car fits, the other lives in the driveway. Storm season is here, so the storm kit glows.",
  room: { width: 20, depth: 22, height: 9, doorHeight: 7, door: { from: 2, to: 18, type: "rollup" } },

  now: {
    headline: "Left bay full, one car in the driveway",
    summary: "Everything from the last move landed in the left bay and never left. The right bay still fits the SUV with a squeeze."
  },
  plan: {
    headline: "Both cars back inside",
    summary: "Clear the left bay into the places below, and the second car parks inside again. The walkway between the cars leads to the workbench.",
    walkways: [[9.5, 0.1, 10.9, 19.6]]
  },

  highlight: { label: "Storm prep", statuses: ["storm"], summary: "Hurricane season. Everything you'd want ready before a storm is on the glowing spots." },
  hideStatuses: ["gone"],

  spots: [
    { id: "car", code: "CAR", name: "The SUV", kind: "car", box: [11.0, 3.0, 17.0, 18.0], height: 5.4, color: "#6b7f99",
      what: "Right bay. Mirrors folded so the door to the house opens." },
    { id: "leftbay", code: "LEFTBAY", name: "Left bay, full", kind: "pile", box: [2.5, 3.0, 9.5, 17.0], height: 3.6, plan: "gone", blocking: true,
      what: "The treadmill, boxes from the last move, the kids' outgrown bikes, two broken patio chairs.", todo: "Each thing gets a spot below or leaves." },
    { id: "car2", code: "CAR2", name: "Second car, back inside", kind: "car", box: [3.0, 3.0, 9.0, 18.0], height: 5, color: "#a0522d", plan: "new",
      what: "Where the sedan parks once the left bay is clear." },
    { id: "bench", code: "BENCH", name: "Workbench", kind: "block", box: [3.0, 20.0, 11.0, 21.95], height: 3, color: "#8c6a4a",
      what: "Eight-foot workbench along the back wall.", todo: "Clear top. Projects go back in their bin when you stop." },
    { id: "peg", code: "PEG", name: "Pegboard over the bench", kind: "pegboard", box: [3.0, 21.7, 11.0, 21.95], height: 3.5, elevation: 3.5, photo: "photos/peg.jpg",
      what: "Hand tools on hooks, each with its outline drawn on the board.", todo: "If a hook's outline is empty, the tool is somewhere it shouldn't be." },
    { id: "freezer", code: "FREEZER", name: "Chest freezer", kind: "block", box: [11.5, 19.6, 15.5, 21.95], height: 3, color: "#f4f4f2",
      what: "The extra freezer: bulk meat, the Thanksgiving turkey, ice for the cooler.", todo: "Inventory taped to the lid." },
    { id: "storm", code: "S", name: "Storm shelf", kind: "rack", box: [15.8, 20.0, 19.85, 21.95], height: 7, levels: 5, photo: "photos/storm.jpg",
      what: "Five-level metal shelf in the back right corner, all storm supplies.", todo: "Check it every June 1, when the season starts." },
    { id: "gen", code: "GEN", name: "Generator and gas cans", kind: "block", box: [17.6, 15.5, 19.85, 17.5], height: 2.4, color: "#c0392b", photo: "photos/gen.jpg",
      what: "Portable generator on wheels, two gas cans beside it.", todo: "Stored here, run outside only, well away from the house. Never inside the garage." },
    { id: "yard", code: "YARD", name: "Yard tools and mower", kind: "block", box: [18.3, 6.0, 19.85, 14.0], height: 5, color: "#5d7a4a",
      what: "Mower, leaf blower, rakes and shovels in a wall rack, the hose reel.", todo: "Right wall, behind the car's back door." },
    { id: "bins", code: "BINS", name: "Trash and recycling", kind: "bin", box: [18.4, 0.8, 19.85, 4.2], height: 3.6, color: "#4a5a6a",
      what: "Two rolling bins by the door.", todo: "Out Tuesday night." },
    { id: "bikes", code: "BIKES", name: "Bikes on wall hooks", kind: "block", box: [0.15, 3.5, 1.0, 10.0], height: 4, elevation: 1, color: "#2f6f8f",
      what: "Two adult bikes and two scooters hung on the left wall.", todo: "Hung up, never on the floor." },
    { id: "kids", code: "KIDS", name: "Outdoor toys bin", kind: "boxes", box: [0.15, 10.5, 2.3, 14.0], height: 2.5, color: "#e6a3b8",
      what: "Balls, chalk, the deflated kiddie pool.", todo: "One bin. When it's full, something goes." },
    { id: "panels", code: "PANELS", name: "Storm panels", kind: "block", box: [0.15, 15.0, 1.0, 21.5], height: 7, color: "#c9a77c", photo: "photos/panels.jpg",
      what: "Plywood storm panels standing on edge, each one labelled with the window it covers.", todo: "Biggest at the back. Labels face out." },
    { id: "up", code: "UP", name: "Overhead rack over the car", kind: "boxes", box: [11.5, 7.5, 17.0, 13.5], height: 1.6, elevation: 7.2, color: "#7f8cc4", photo: "photos/up.jpg",
      what: "Ceiling-mounted rack with lidded totes, labelled on the ends.", todo: "Holiday and once-a-year things only. You need the ladder, so nothing you use monthly." }
  ],

  rules: [
    { thing: "Storm supplies", at: "S-#", note: "Back right corner, one shelf for all of it.", spot: "storm" },
    { thing: "Holiday decor", at: "UP", note: "Overhead rack. Get the ladder.", spot: "up" },
    { thing: "Hand tools", at: "PEG", note: "On its outline.", spot: "peg" },
    { thing: "Yard and garden", at: "YARD", note: "Right wall.", spot: "yard" },
    { thing: "Bikes and scooters", at: "BIKES", note: "On the hooks.", spot: "bikes" },
    { thing: "Kids' outdoor toys", at: "KIDS", note: "One bin.", spot: "kids" },
    { thing: "Anything else", at: "not the left bay", note: "If it doesn't have a spot, it doesn't stay.", spot: "leftbay" }
  ],

  stepsLabel: "Storm prep",
  stepsTitle: "Before a storm, in order",
  stepsSummary: "Do the first three on June 1 every year. The rest when a storm is in the forecast.",
  steps: [
    { title: "Check the storm shelf", note: "Water dates, batteries, the radio, the first aid kit.", spot: "storm" },
    { title: "Test-run the generator, outside", note: "Fresh fuel in the cans. It never runs in the garage.", spot: "gen" },
    { title: "Freezer: write today's contents on the lid", note: "So you know what to use first if the power's out.", spot: "freezer" },
    { title: "Storm panels out, by window label", note: "Biggest first.", spot: "panels" },
    { title: "Both cars inside", note: "That's why the left bay stays clear.", spot: "car2" }
  ]
};
