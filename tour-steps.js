/**
 * TOUR STEP CONFIG
 * ------------------------------------------------------------------
 * Each step describes WHERE to point (find) and WHAT to say (title/body).
 *
 * find: how to locate the target element inside the report iframe.
 *   - { type: "data", value: "top-strength" }   -> looks for [data-tour="top-strength"]
 *   - { type: "text", value: "Top Strength", tag: "span" } -> PLACEHOLDER fallback,
 *       finds the smallest element of `tag` whose trimmed text matches exactly.
 *
 * IMPORTANT: every `type: "text"` step below is a placeholder. Once Alicia adds
 * the data-tour attributes listed in the README, flip these to type: "data" —
 * that's the whole migration, nothing else in tour.js needs to change.
 *
 * tab: which report tab must be active before this step's target exists.
 *   null = doesn't matter / no tab switch needed.
 *
 * beforeShow: optional extra action needed before the target exists
 *   (e.g. opening the question modal). Return a Promise if async.
 */

const TOUR_STEPS = [
  {
    id: "intro",
    tab: null,
    find: null, // centered intro modal, no spotlight
    title: "Meet Ms. Regan's classroom",
    body: "This is one real 5th grade classroom, one month into using Compass Math. The report has two views: Review Performance looks back at what just happened, Prepare for Instruction looks ahead at what's coming next.",
  },
  {
    id: "signal",
    tab: "review",
    // NOTE: originally anchored to "Weaker Signal," which was removed from the
    // report between builds — confirmed the day this was written. Retargeted to
    // "View All Misconceptions" (also used by the "pattern" step below) since it
    // was still present. This is the exact fragility the data-tour attributes fix.
    find: { type: "text", value: "View All Misconceptions", tag: "span" }, // PLACEHOLDER
    title: "Every wrong answer is a signal",
    body: "Every wrong answer in Compass Math is developed around a specific common student misconception. So every answer is a signal.",
  },
  {
    id: "specifics",
    tab: "review",
    find: { type: "data", value: "q" }, // uses existing data-q attribute already in the source — first question link
    beforeShow: "openQuestionModal", // programmatically opens the question modal
    title: "See exactly why they got it wrong",
    body: "Open any question and you'll see the answer choices, the specific misconception behind the wrong answer, and which students picked which option. This is the feature teachers valued most in pilot.",
  },
  {
    id: "pattern",
    tab: "review",
    find: { type: "text", value: "View All Misconceptions", tag: "span" }, // PLACEHOLDER — swap to data-tour="pattern-summary"
    title: "See the pattern across the whole class",
    body: "Beyond a single question, the report surfaces the most commonly chosen wrong answer across the whole assessment — a good place to start when addressing what's blocking the class right now.",
  },
  {
    id: "strength",
    tab: "prepare",
    find: { type: "text", value: "Top Strength", tag: "span" }, // PLACEHOLDER — swap to data-tour="top-strength"
    title: "Look forward: what's ready",
    body: "Before the next unit even starts, Compass predicts what this class is ready for based on real answer patterns — not a guess, a leading indicator.",
  },
  {
    id: "challenge",
    tab: "prepare",
    find: { type: "text", value: "Top Challenge", tag: "span" }, // PLACEHOLDER — swap to data-tour="top-challenge"
    title: "Look forward: what's likely to trip them up",
    body: "This predicts where the class is likely to struggle next, before instruction begins. One honest caveat: this assumes standard instruction only, with no extra support already in place.",
  },
  {
    id: "action",
    tab: "prepare",
    find: { type: "text", value: "View Map", tag: "span" }, // PLACEHOLDER — swap to data-tour="lc-map"
    title: "Take action, inside the curriculum already in use",
    body: "Every predicted challenge links back to the teacher's specific lesson through the Learning Component Map, plus a short Instructional Moves video with a concrete teaching strategy — not a new lesson to plan, a move to make inside the one already scheduled.",
  },
  {
    id: "close",
    tab: null,
    find: null, // centered outro modal, no spotlight
    title: "One classroom. Every classroom.",
    body: "Ms. Regan is one teacher. Across a school or a district, this same 30 minutes a month runs for every classroom — predictions, misconceptions, and next steps, without anyone having to go looking for them.",
    isClose: true,
  },
];
