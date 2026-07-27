# QA learning resource

A QA engineering course, built lesson by lesson from primary sources. Open
`index.html` to read it — the lessons are standalone HTML and need no server.

Two courses live here: **QA** (52 plan tasks, `curriculum.html`) and **project
management** (63 tasks, `curriculum-project-management.html`, not yet started).

- `MISSION.md` — why this course exists. Every lesson is grounded in it.
- `LESSON-RECIPE.md` — how a lesson gets made, and the quality bar it must hit.
- `GROUNDED.md` — which lesson grounds which concept.
- `RESOURCES.md` — vetted sources, and the gaps still open.
- `NOTES.md` — working state: what's written, what's next.

## Working on it from a fresh clone

The repo carries the workflow; two things live outside it.

**1. Claude Code and the teaching skills.** The lesson workflow calls skills from
Matt Pocock's plugin, which installs at user level and is deliberately not
vendored here. Inside Claude Code:

```
/plugin marketplace add mattpocock/skills
/plugin install mattpocock-skills@mattpocock
```

Without it, `/lesson` still runs — it degrades rather than breaks. The research
step is the part that needs the plugin, and `sources/` already holds a dossier
for every task, so that step is usually skippable anyway.

**2. Node, Python 3 and curl** for the scripts. Nothing to install beyond what
macOS and most Linux boxes ship, and there are no package dependencies — no
`npm install`, no virtualenv.

Then:

```
./scripts/refresh-plan.sh     # pull the plan of record from the Google Sheet
/lesson next                  # write the next lesson in curriculum order
```

`.claude/commands/lesson.md` is committed, so the `/lesson` command travels with
the repo. It carries the full recipe.

## Scripts

| Command | What it does |
|---|---|
| `./scripts/refresh-plan.sh` | Cache both sheet tabs to `plan/qa.csv`, `plan/pm.csv` |
| `python3 scripts/plan-task.py QA-006` | Read one task row |
| `node scripts/check-lesson.mjs` | Lint lessons: dead links, wiring, quiz tells, grounding |
| `./scripts/audit-sources.sh` | One headless Claude per task → `sources/<TASK>.md` |

`check-lesson.mjs` checks plumbing, not teaching. A clean run is necessary, not
sufficient — the judgement calls stay in `LESSON-RECIPE.md`.

## A note on `sources/`

Each file answers "does a real source exist for this task, and where is it?"
**A dossier is a lead, not a fact.** It tells you what to read and where; it is
never quotable into a lesson. Re-read the original and cite the section number.

The first full pass (2026-07-27) covered all 52 QA tasks. Not one named source
fully covers its task, and 39 cannot teach it at all — roadmap.sh is a node
diagram, and the ISTQB link is a certification storefront rather than the
syllabus. But nothing came back unwritable: every task has a usable primary
source. The plan was pointing at the wrong document, not at nothing.
