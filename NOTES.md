Working notes and preferences.

## Preferences

- Pace: 10+ hrs/week (compressed vs. the original sheet schedule).
- Goal is employment, not certification. See MISSION.md.
- Plan of record: Google Sheet, tasks QA-001 to QA-052.

## Notes

- Weeks 1-5 (QA-001 to QA-010) are written/judgment deliverables only. No code
  until W12 (QA-024, Playwright setup).

## Workspace conventions (established 2026-07-26)

- **Assets are shared, not inlined.** `assets/lesson.css` (all styling),
  `assets/quiz.js` (multiple-choice retrieval, corrective feedback),
  `assets/risk-grid.js` (likelihood x impact triage). Reuse before writing new.
  Classic scripts only — lessons are opened over `file://`, so no ES modules.
- **Quiz options are equal word count** so length never leaks the answer.
- **Graded feedback where judgment is genuine.** The risk grid marks an answer
  one step from the reference as *defensible*, not wrong. Pretending judgment
  calls have single right answers would teach the wrong thing given the mission.
- **Two source voices, kept distinct.** ISTQB wording is what interviewers were
  trained on; RST (Bach/Bolton) is better for the *why*. The glossary tags every
  definition `[ISTQB]` or `[RST]` rather than blending them.

## Purpose change (2026-07-26)

The workspace is now **also a shareable course**, not just personal learning.
The user wants a full lesson for every topic so others can learn from it.
Consequences:

- Lessons must stand alone for a stranger — no assumed shared context with me.
- `index.html` is the front door. Every new lesson gets added to it.
- Build in batches, in teaching order. Batches of 3–4 lessons keep quality up;
  attempting all 52 at once would produce thin material.
- Reference cards remain, but they are the secondary artifact now.

## How to write the next lesson

See `LESSON-RECIPE.md` — the invocation prompt, the quality bar, and the failure
modes that cost quality. Follow it rather than improvising per lesson.

## Two courses now live here

- **QA** — 53 lessons, 27 weeks, sheet tab `gid=1651117697`. Four lessons written.
  `index.html` + `curriculum.html` + `lessons/`.
- **Project management** — 63 lessons, 32 weeks, sheet tab `gid=487507119`,
  tasks PM-001 → PM-063, starting 2026-07-27. Only `curriculum-project-management.html`
  exists; no lessons, no mission, no resources vetted.

The teach skill says one mission per workspace. There is no MISSION.md for PM,
so **do not start writing PM lessons until the user states why they want it** —
without that, the lessons have nothing to be grounded in. Ask before building.

PM plan notes worth keeping:
- Worked example throughout is **DoctorCheck** (their product). Use it.
- ~40 of 63 tasks cite the same roadmap.sh link. That is a map, not a textbook —
  those lessons need real sources found first.
- PMBOK is cited for 8 tasks and is paywalled. Resolve access before week 2
  (the charter lesson) or find an open equivalent.
- Overlaps with QA at PM-031/032 (risk scoring — QA lesson 1 already covers the
  machinery), PM-037/038 (quality plan ↔ QA lesson 8), PM-057 (test pyramid ↔
  QA lesson 24). Cross-reference rather than teach twice.

## Plan of record — now machine-readable

The Google Sheet is publicly exportable. Fetch it as CSV rather than asking:
`https://docs.google.com/spreadsheets/d/1OK_OvNJc1IcmwqIYT3K6PAtV7XUzX8_gBPXf9jOyQA0/export?format=csv&gid=1651117697`
(follow the 307 redirect). Columns: Task ID, Learning area, Week, Focus, What I
want to learn, What I'll do, Resource, dates, hours, Priority, Status, Progress.

Twelve learning areas: Foundations, Test management, SDLC, Manual testing, Web
basics, Automation, API testing, Mobile testing, Non-functional, Supporting
skills, AI testing, Capstone. Weeks 1–27, start 2026-07-27.

## Naming and structure (user decision, 2026-07-26)

- **One unit only: "Lesson N."** No modules, no per-area numbering. The user
  explicitly asked for this after seeing a "Module 1 · Foundations · Lesson 1"
  scheme — it read as clutter.
- `lessons/NN-slug.html`, flat, numbered in teaching order across all 53.
- **Numbers are permanent.** Lesson 04 (test oracles) is unwritten, so the file
  list jumps 03 → 05. Never renumber to close a gap; links and the curriculum
  page depend on the slot staying put.
- `curriculum.html` is the full 53-lesson plan with plan-task mapping.
  `index.html` is the front door. Every lesson carries a `.plan-tag` line
  linking it back to its QA-0XX task.

## Findings about the plan itself

- **No static testing task.** Reviews are an entire ISTQB chapter and the
  cheapest defect removal there is. Lesson 3 covers it anyway — the only lesson
  with no task ID.
- **QA-004 asks for gray-box**, which ISTQB v4.0 does not define. Lesson 2 is
  marked partial. When writing the gray-box section, say explicitly that the
  term is industry practice, not syllabus.
- QA-001/002/003/004/005 all sit at 35% progress; QA-019 is Blocked at 25%.
  Everything from QA-006 on is 0%.

## Teaching state

- Written: lessons 1 (risk triage), 2 (test levels & types), 3 (static testing),
  5 (equivalence partitioning & boundary values). Plus `index.html` and
  `curriculum.html`.
- Next up in curriculum order: 4 (test oracles — QA-002, due week 1), then
  6 (decision tables & state transition), 7 (test cases), 8 (test plan),
  9 (bug reports), 10 (test management tools).
- **Three source gaps to close before writing:** lesson 4 (test oracles) and
  lesson 10 (tool comparison) have no trustworthy source yet; lesson 9 needs a
  route to ISTQB §5.5 that includes the defect-report contents list — the ASTQB
  page omits it. Do not write any of these from memory.
- No learning record yet — coverage isn't learning. Write LR-0001 once there's
  evidence: the user ranking a fresh feature's risks unprompted, or arguing back
  on a reference score.

## Widget library (assets/)

- `quiz.js` — multiple choice, corrective feedback, running score.
- `risk-grid.js` — two-dial (likelihood x impact) scoring on a 3x3 matrix.
- `classify.js` — sort items into named categories.
- `select-set.js` — choose a minimal covering set; flags both missed and
  redundant picks.
- All share the `.rg-*` style primitives in `lesson.css`. Build new widgets on
  those rather than inventing parallel styles.
