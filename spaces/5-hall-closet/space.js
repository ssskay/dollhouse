/* Demo space: an invented hall closet, about 5 ft wide and 2.5 ft deep.
   Same tool at a tiny scale: two high shelves, a coat rod, and the go-bag on the floor by the door.
   Units: feet. x = left to right facing the open closet. z = door (0) to back wall (2.5).
   elevation = how high off the floor something is mounted. */
window.DOLLHOUSE = {
  backLink: "../../index.html",
  title: "The Hall Closet",
  eyebrow: "Example 5 of 5 · hall closet · invented data",
  cover: "photos/door.jpg",
  subtitle: "Five feet of closet by the front door. The go-bag sits where you can grab it in the dark.",
  room: { width: 5, depth: 2.5, height: 8, doorHeight: 6.8, door: { from: 0.4, to: 4.6, hinge: "left" } },

  now: {
    headline: "Go-bag in front, nothing on top of it",
    summary: "The go-bag sits on the floor at the front right, so it's the first thing your hand finds when the door opens."
  },
  plan: {
    headline: "Keep the floor in front of the go-bag clear",
    summary: "Boots and the vacuum stay to the left. Nothing gets set down on the go-bag.",
    walkways: []
  },

  highlight: { label: "Grab and go", statuses: ["go"], summary: "If you had to leave in five minutes: the bag, the leash, rain jackets." },
  hideStatuses: ["gone"],

  spots: [
    { id: "top", code: "T", name: "High shelves", kind: "shelf", box: [0.1, 0.3, 4.9, 2.4], height: 1.8, levels: 2, elevation: 5.6, photo: "photos/top.jpg",
      what: "Two shelves above the coat rod. T-1 is the very top.", todo: "Light things up high, things you need monthly on T-2." },
    { id: "coats", code: "COATS", name: "Coat rod", kind: "wardrobe", box: [0.1, 0.9, 4.9, 1.7], height: 3.4, elevation: 2.1,
      what: "Coats and rain jackets on the rod.", todo: "This season's coats only." },
    { id: "vac", code: "VAC", name: "Vacuum and mop", kind: "block", box: [0.2, 0.5, 1.1, 1.4], height: 3.8, color: "#7f8cc4",
      what: "Stick vacuum on its dock, the mop beside it.", todo: "Back left." },
    { id: "boots", code: "BOOTS", name: "Boots and umbrellas", kind: "block", box: [1.3, 1.5, 2.6, 2.4], height: 1.2, color: "#3b3f45",
      what: "Boot tray with rain boots, two umbrellas in a bucket.", todo: "Wet things only on the tray." },
    { id: "wrap", code: "WRAP", name: "Wrapping paper bin", kind: "bin", box: [2.8, 1.6, 3.5, 2.4], height: 3, color: "#e6a3b8",
      what: "Tall bin with rolls standing up, ribbon and tape in a pouch.", todo: "Gift bags flattened on T-2." },
    { id: "go", code: "GO", name: "Go-bag", kind: "block", box: [3.7, 0.7, 4.8, 1.6], height: 1.6, color: "#c0392b", photo: "photos/go.jpg",
      what: "Red backpack on the floor at the front right, with the leash and a bag of dog food clipped to it.", todo: "Nothing goes on top of it. Check it when the clocks change." }
  ],

  rules: [
    { thing: "Emergency go-bag", at: "GO", note: "Floor, front right. Never under anything.", spot: "go" },
    { thing: "Guest bedding", at: "T-1", note: "Very top shelf.", spot: "top" },
    { thing: "Light bulbs, batteries, gift bags", at: "T-2", note: "Lower shelf, in labelled boxes.", spot: "top" },
    { thing: "Coats", at: "COATS", note: "This season only. The rest go wherever your off-season lives.", spot: "coats" },
    { thing: "Wet boots and umbrellas", at: "BOOTS", note: "On the tray.", spot: "boots" }
  ],

  stepsLabel: "Go-bag check",
  stepsTitle: "Go-bag check, twice a year",
  stepsSummary: "When the clocks change. Five minutes.",
  steps: [
    { title: "Water and food: check the dates", note: "Swap anything expiring in the next six months.", spot: "go" },
    { title: "Medications and glasses", note: "A week's worth, not expired.", spot: "go" },
    { title: "Copies of IDs and insurance cards", note: "In the zip pouch. Still current?", spot: "go" },
    { title: "Flashlight, batteries, power bank charged", note: "", spot: "go" },
    { title: "Kids' clothes still fit", note: "And the dog food isn't stale.", spot: "go" }
  ]
};
