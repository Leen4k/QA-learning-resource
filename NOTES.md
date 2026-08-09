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

`/lesson QA-006`, or `/lesson next`, or `/lesson QA-006 QA-007 QA-008` for a
batch. The command lives in `.claude/commands/lesson.md` and carries the full
recipe; `LESSON-RECIPE.md` holds the quality bar and the failure modes.

Edit `.claude/commands/lesson.md` when the recipe changes — it is the prompt,
not a copy of it.

## Two courses now live here

- **QA** — 53 lessons, 27 weeks, sheet tab `gid=1651117697`. Eight lesson files available.
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

## Plan of record — now machine-readable and cached

The Google Sheet is publicly exportable, and `./scripts/refresh-plan.sh` caches
both tabs to `plan/qa.csv` and `plan/pm.csv`. Read a task with
`grep -m1 '^QA-006' plan/qa.csv` rather than fetching per lesson. Re-run the
script when the sheet changes. Columns: Task ID, Learning area, Week, Focus,
What I want to learn, What I'll do, Resource, dates, hours, Priority, Status,
Progress.

Twelve learning areas: Foundations, Test management, SDLC, Manual testing, Web
basics, Automation, API testing, Mobile testing, Non-functional, Supporting
skills, AI testing, Capstone. Weeks 1–27, start 2026-07-27.

## Naming and structure (user decision, 2026-07-26)

- **One unit only: "Lesson N."** No modules, no per-area numbering. The user
  explicitly asked for this after seeing a "Module 1 · Foundations · Lesson 1"
  scheme — it read as clutter.
- `lessons/NN-slug.html`, flat, numbered in teaching order across all 53.
- **Numbers are permanent.** Lesson 04 (test oracles) was initially unwritten,
  so the file list jumped 03 → 05 until its slot was filled. Never renumber to
  close a gap; links and the curriculum page depend on each slot staying put.
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
  4 (test oracles), 5 (equivalence partitioning & boundary values), 6 (decision
  tables & state transitions), 7 (handoff-ready test cases), and 8 (one-page
  test plan). Plus `index.html` and `curriculum.html`.
- Next up in curriculum order: 9 (bug reports), then 10 (test management tools).
- Lesson 6 turns Teamspace permissions into five decision rules and four valid
  state transitions. Lesson 7 uses those nine targets to derive a 12-case suite,
  adding only three cases for UI/API parity and stale-authorization risk.
- Lesson 8 introduced a running worked example, **Teamspace** — a B2B workspace
  app with Owner/Admin/Member/Viewer roles enforced in both a web UI and a REST
  API. It generates good material (UI hides the button but the API does not
  check; demoted admin keeps a live session; last owner leaves). Reuse it for
  lessons 6, 7 and 9 rather than inventing a new domain each time — the learner
  then plans, specifies, executes and reports against one feature, which is
  also how the portfolio artifact should read.
- **One source gap left:** lesson 10 (tool comparison) has no trustworthy
  neutral source yet. Do not write it from memory.
- **Lesson 4 is unblocked and written (2026-08-08).** Bolton's
  `Oracles.pdf` supplies the practical HICCUPPS(F) guidewords and fallibility
  model; Barr et al. supplies the formal oracle problem and explains why prose
  specifications are partial. The CTFL syllabus only presupposes expected
  results in §1.4.1, so it remains explicitly the wrong source for QA-002.
- **Lesson 9 is unblocked (2026-07-26).** The ISTQB PDF *is* fetchable — `curl -L`
  with a browser user-agent, then `pdftotext -layout`. §5.5 Defect Management is
  on pages 56–57 and carries the full defect-report contents list the ASTQB page
  dropped. See RESOURCES.md.
- **Quote from the PDF, link to ASTQB.** Fetching an ASTQB section page returns a
  *summary*, not the text: for §5.1.1 it silently dropped four of the seven items
  in the test-plan content list. Sub-section URLs (`/5-1-1-.../`) do not exist at
  all. Getting this wrong is exactly failure mode 3 in LESSON-RECIPE.md.
- No learning record yet — coverage isn't learning. Write LR-0001 once there's
  evidence: the user ranking a fresh feature's risks unprompted, or arguing back
  on a reference score.

## Widget library (assets/)

- `quiz.js` — multiple choice, corrective feedback, running score.
- `risk-grid.js` — two-dial (likelihood x impact) scoring on a 3x3 matrix.
- `classify.js` — sort items into named categories.
- `select-set.js` — choose a minimal covering set; flags both missed and
  redundant picks.
- `coverage-set.js` — choose paths or scenarios whose union covers named
  targets; accepts alternate minimal sets and distinguishes gaps from complete
  but redundant answers.
- All share the `.rg-*` style primitives in `lesson.css`. Build new widgets on
  those rather than inventing parallel styles.

## Grounding ledger (added 2026-07-27)

`GROUNDED.md` tracks which lesson grounds which concept, borrowed from the
`writing-beats` skill: a lesson may lean on a concept only if it is a listed
prerequisite or an *earlier* lesson grounded it. Mark the first mention of a
term with `<dfn>`; `check-lesson.mjs` errors if a `<dfn>` term is missing from
the ledger.

This is the concrete reason lessons cannot be written in parallel — the grounded
set is sequential state. It is also where the quality bar's *spacing* callback
should come from: the ledger says what is available to call back to.

The five pre-convention lessons have no `<dfn>` markup yet (warns, does not
error). Their terms are already listed in the ledger, which is what later
lessons read, so retrofitting is optional.
