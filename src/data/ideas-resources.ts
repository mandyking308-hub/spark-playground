/**
 * Static, curated public content for the Ideas & Resources hub.
 * Presentation data only — no backend, no personalisation, no tracking.
 */

export const ageBands = ["Under 9", "9–12", "13–15"] as const;
export type AgeBand = (typeof ageBands)[number];

export const interests = [
  "Making & creating",
  "Science & invention",
  "Storytelling",
  "Design",
  "Coding & games",
  "World & culture",
  "Enterprise & ideas",
] as const;
export type Interest = (typeof interests)[number];

export interface ProjectStarter {
  id: string;
  title: string;
  format: "Podcast" | "Story" | "Film" | "Art" | "Invention" | "Coding & game" | "Social impact";
  interest: Interest;
  ages: AgeBand[];
  summary: string;
  steps: string[];
  evidence: string;
}

export const projectStarters: ProjectStarter[] = [
  {
    id: "podcast-three-questions",
    title: "The three questions podcast",
    format: "Podcast",
    interest: "Storytelling",
    ages: ["9–12", "13–15"],
    summary:
      "Plan and record a short episode built around three good questions on a subject the young person genuinely cares about.",
    steps: [
      "Choose a subject and write three questions you cannot answer in one word.",
      "Draft a 60-second opening in your own voice.",
      "Record, listen back once, and note two things to improve.",
      "Record the improved take and write a one-line episode description.",
    ],
    evidence: "Script draft, first take, final take and a short reflection on what changed.",
  },
  {
    id: "podcast-sound-map",
    title: "A sound map of our week",
    format: "Podcast",
    interest: "World & culture",
    ages: ["Under 9", "9–12"],
    summary:
      "Collect everyday sounds at home or school and arrange them into a short audio portrait of a week.",
    steps: [
      "List ten sounds that describe your week.",
      "Record five of them with an adult present.",
      "Order them into a story with a beginning and an end.",
      "Add a sentence of narration to each.",
    ],
    evidence: "Sound list, recordings and the ordered final piece.",
  },
  {
    id: "story-object",
    title: "The object that remembers",
    format: "Story",
    interest: "Storytelling",
    ages: ["9–12", "13–15"],
    summary:
      "Write a short story told from the point of view of an ordinary object that has watched something change.",
    steps: [
      "Pick an object older than you are.",
      "Write half a page of what it has seen.",
      "Redraft with one detail removed and one added.",
      "Read it aloud and mark the sentences that sound wrong.",
    ],
    evidence: "First draft, redraft and the read-aloud notes.",
  },
  {
    id: "story-picture-book",
    title: "A picture book for someone smaller",
    format: "Story",
    interest: "Making & creating",
    ages: ["Under 9", "9–12"],
    summary:
      "Make an eight-page picture book written specifically for a younger child you know.",
    steps: [
      "Fold and number eight pages.",
      "Write one sentence per page before drawing anything.",
      "Illustrate the two most important pages first.",
      "Test it by reading it aloud to the reader it is for.",
    ],
    evidence: "Page plan, illustrations and a note on how the reading went.",
  },
  {
    id: "film-sixty-seconds",
    title: "Sixty seconds, one place",
    format: "Film",
    interest: "Making & creating",
    ages: ["9–12", "13–15"],
    summary:
      "Film a one-minute portrait of a single place using no more than eight shots.",
    steps: [
      "Draw an eight-box storyboard.",
      "Film each shot twice, holding steady for five seconds.",
      "Edit to sixty seconds exactly.",
      "Add one sound layer that is not music.",
    ],
    evidence: "Storyboard, raw shots and the finished cut.",
  },
  {
    id: "art-hundred-marks",
    title: "One hundred marks",
    format: "Art",
    interest: "Design",
    ages: ["Under 9", "9–12", "13–15"],
    summary:
      "Fill a page with one hundred different marks, then build a finished artwork from the five best.",
    steps: [
      "Make one hundred marks with at least three tools.",
      "Circle the five that feel most like you.",
      "Build one composition using only those five.",
      "Write two sentences on why you chose them.",
    ],
    evidence: "The mark sheet, the composition and the written choice.",
  },
  {
    id: "invention-annoying-problem",
    title: "Fix one small annoying problem",
    format: "Invention",
    interest: "Science & invention",
    ages: ["9–12", "13–15"],
    summary:
      "Identify a genuinely small everyday problem and prototype three possible fixes from household materials.",
    steps: [
      "Watch one routine closely and write down what goes wrong.",
      "Sketch three different fixes.",
      "Build the roughest one first from card and tape.",
      "Test it, note the failure, and rebuild once.",
    ],
    evidence: "Problem notes, sketches, prototype photos and the failure log.",
  },
  {
    id: "invention-measure-it",
    title: "Measure something nobody measures",
    format: "Invention",
    interest: "Science & invention",
    ages: ["9–12", "13–15"],
    summary:
      "Design a simple, repeatable way to measure an everyday thing and record a week of results.",
    steps: [
      "Choose what to measure and define the unit.",
      "Design a method you can repeat identically.",
      "Record results for seven days.",
      "Chart the results and say what surprised you.",
    ],
    evidence: "Method description, raw results table and the chart.",
  },
  {
    id: "game-one-rule",
    title: "A game with exactly one rule",
    format: "Coding & game",
    interest: "Coding & games",
    ages: ["9–12", "13–15"],
    summary:
      "Design and build the smallest playable game you can, governed by a single rule.",
    steps: [
      "Write the one rule in a single sentence.",
      "Build the smallest version that is playable.",
      "Watch someone else play without helping them.",
      "Change one thing and test again.",
    ],
    evidence: "Rule statement, build versions and playtest notes.",
  },
  {
    id: "game-paper-prototype",
    title: "Paper prototype first",
    format: "Coding & game",
    interest: "Coding & games",
    ages: ["Under 9", "9–12"],
    summary:
      "Prototype a game on paper before writing any code, so the idea is tested before the build.",
    steps: [
      "Draw the board, the pieces and the goal.",
      "Play it twice with someone at home.",
      "Cut one thing that is not fun.",
      "Only then plan how it could be built digitally.",
    ],
    evidence: "Paper prototype, play notes and the digital plan.",
  },
  {
    id: "impact-local-question",
    title: "One local question",
    format: "Social impact",
    interest: "Enterprise & ideas",
    ages: ["9–12", "13–15"],
    summary:
      "Research a real question about your local area and turn the findings into something other people can use.",
    steps: [
      "Write the question so it can actually be answered.",
      "Gather evidence from at least two sources.",
      "Decide who the answer is useful to.",
      "Make a poster, guide or short film for that audience.",
    ],
    evidence: "Question, sources, audience decision and the final artefact.",
  },
  {
    id: "impact-kinder-design",
    title: "Redesign one thing to be kinder",
    format: "Social impact",
    interest: "World & culture",
    ages: ["Under 9", "9–12", "13–15"],
    summary:
      "Take something ordinary that excludes someone and redesign it so more people can use it.",
    steps: [
      "Find one thing that is hard for someone you know to use.",
      "Ask them what actually makes it hard.",
      "Sketch a version that removes that barrier.",
      "Show them the sketch and change it once.",
    ],
    evidence: "Interview notes, sketches and the revised design.",
  },
];

export const resourceTypes = [
  "Project starters",
  "Family guides",
  "Educator briefs",
  "Constructive feedback",
  "Digital wellbeing",
] as const;
export type ResourceType = (typeof resourceTypes)[number];

export interface ResourceCard {
  id: string;
  title: string;
  type: Exclude<ResourceType, "Project starters">;
  audience: "Families" | "Educators" | "Both";
  summary: string;
  points: string[];
}

export const resourceCards: ResourceCard[] = [
  {
    id: "wellbeing-guide",
    type: "Digital wellbeing",
    title: "Creation over consumption: a family guide",
    audience: "Families",
    summary:
      "A short guide to shifting screen time from scrolling towards making, with pause points built into the habit rather than bolted on.",
    points: [
      "Agree what a finished thing looks like before starting.",
      "Use a fixed making window rather than an open-ended session.",
      "Close each session by naming one thing that improved.",
      "Keep devices out of the room where the work is talked about.",
    ],
  },
  {
    id: "feedback-guide",
    type: "Constructive feedback",
    title: "How to give constructive feedback to a young maker",
    audience: "Both",
    summary:
      "A practical structure for feedback that improves the work without deflating the maker.",
    points: [
      "Describe what you actually see before you judge it.",
      "Ask what they were trying to do — then respond to that.",
      "Offer one change, not five.",
      "End on the decision that was genuinely theirs.",
    ],
  },
  {
    id: "approval-guide",
    type: "Family guides",
    title: "What guardian approval actually involves",
    audience: "Families",
    summary:
      "What a guardian is asked to review, what they see, and what deliberately stays private to the child.",
    points: [
      "You approve what leaves the family, not every private draft.",
      "You can withdraw an approval later.",
      "Approval requests explain who will see the work.",
      "Nothing is shared beyond the family without an approval.",
    ],
  },
  {
    id: "brief-template",
    type: "Educator briefs",
    title: "Educator brief template: making with evidence",
    audience: "Educators",
    summary:
      "A static template you can adapt when setting a creative brief that will end in verified evidence. Example only — not a live submission form.",
    points: [
      "Outcome: what will exist at the end that does not exist now.",
      "Constraint: the one limit that makes the work interesting.",
      "Evidence: the drafts and decisions to keep along the way.",
      "Verification: the specific skill an adult will be asked to confirm.",
    ],
  },
  {
    id: "brief-template-impact",
    type: "Educator briefs",
    title: "Educator brief template: local impact project",
    audience: "Educators",
    summary:
      "An example brief structure for a project that leaves the classroom and serves a real audience.",
    points: [
      "Audience: who this is genuinely for.",
      "Research: two sources minimum, recorded.",
      "Artefact: the thing that audience receives.",
      "Reflection: what the maker would change next time.",
    ],
  },
  {
    id: "portfolio-guide",
    type: "Family guides",
    title: "Building a portfolio a young person is proud of",
    audience: "Both",
    summary:
      "How to help a young person select work for their Achievement Passport instead of hoarding everything.",
    points: [
      "Choose work that shows a decision, not just an outcome.",
      "Keep the draft that shows the turning point.",
      "Write one line on what was hard.",
      "Let the young person make the final selection.",
    ],
  },
  {
    id: "planning-worksheet",
    type: "Project starters",
    title: "The one-page project planning worksheet",
    audience: "Both",
    summary:
      "A worksheet concept a young maker can fill in on paper before they start, so the project has a finish line from day one. Example resource — nothing is submitted anywhere.",
    points: [
      "The thing I am making, in one sentence.",
      "Who it is for, and why they would care.",
      "Three steps, and which one I do first.",
      "How I will know it is finished.",
      "The drafts I will keep as evidence.",
    ],
  },
  {
    id: "safe-ai-prompts",
    type: "Digital wellbeing",
    title: "Using AI safely alongside a young maker",
    audience: "Both",
    summary:
      "How to use assistance without handing over authorship, and the kinds of prompts that help a child think rather than think for them.",
    points: [
      "Ask for questions about the work, not a finished version of it.",
      "Ask it to explain a technique, then do the technique yourself.",
      "Never share a real name, school, address or photograph in a prompt.",
      "Say out loud which parts were assisted — Aurelia labels authorship for the same reason.",
      "If the answer sounds certain, check it against a second source.",
    ],
  },
];

export const compareModel = [
  {
    dimension: "Purpose",
    social: "Attention and engagement time.",
    portal: "Administration and reporting.",
    aurelia: "Making real work and recording genuine achievement.",
  },
  {
    dimension: "Child identity",
    social: "Public profile, often discoverable.",
    portal: "An institutional record owned by the school.",
    aurelia: "A protected identity with no public directory of children.",
  },
  {
    dimension: "Adult access",
    social: "Strangers can often reach a child.",
    portal: "Staff access defined by the institution.",
    aurelia: "Verified adults with defined roles; organisations never contact children privately.",
  },
  {
    dimension: "Feedback",
    social: "Likes, comments and counts.",
    portal: "Grades and marks.",
    aurelia: "Structured constructive feedback tied to the work.",
  },
  {
    dimension: "Achievement",
    social: "Popularity signals.",
    portal: "Attainment data.",
    aurelia: "Achievements verified by an adult who witnessed the work.",
  },
  {
    dimension: "AI",
    social: "Often generating and ranking content for you.",
    portal: "Rarely addressed explicitly.",
    aurelia: "Bounded, age-banded assistance with authorship labelled.",
  },
  {
    dimension: "Data",
    social: "Behavioural profiling and advertising.",
    portal: "Institutional data retention.",
    aurelia: "Minimal data, purpose limits, no behavioural targeting of children.",
  },
  {
    dimension: "Turning 16",
    social: "Nothing changes.",
    portal: "The record usually stays with the school.",
    aurelia: "A deliberate move to a separate adult environment, with selected work carried forward.",
  },
];
