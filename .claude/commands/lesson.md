---
description: Write the next QA/PM lesson(s) to the LESSON-RECIPE.md quality bar
argument-hint: "QA-006 [QA-007 ...] | next | next 3"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Skill, Agent
---

Write lesson(s) for: **$ARGUMENTS**

This is the LESSON-RECIPE.md prompt, invoked. Follow it exactly. The steps below
are the constraints that make the lessons good — none of them is optional, and
none of them may be shortened because this was invoked as a command rather than
typed out.

## 0. Resolve the target

- If the argument is a task ID (`QA-006`, `PM-004`), that is the task.
- If it is `next` (optionally `next N`), read `NOTES.md` "Teaching state" and
  `curriculum.html` and pick the next N unwritten lesson(s) **in curriculum
  order**. Say which you picked and why before starting.
- Multiple IDs = a batch. Do them **in the order given**.
- **PM tasks: stop.** There is no `MISSION.md` for project management. Ask the
  user why they want it before writing anything — an ungrounded lesson is
  exactly what this workspace is built to avoid.

## 1. Read the task from the plan

The plan is cached locally. Refresh it, then read the row:

```
./scripts/refresh-plan.sh
grep -m1 '^QA-006' plan/qa.csv      # or plan/pm.csv
```

Columns: Task ID, Learning area, Week, Focus, What I want to learn, What I'll
do, Resource, dates, hours, Priority, Status, Progress.

**"What I'll do" is the deliverable.** The lesson must leave a stranger able to
produce exactly that artifact. That column, not the topic, is the test of whether
the lesson worked.

Also read `MISSION.md`, `NOTES.md`, `RESOURCES.md` and `learning-records/` — the
teach skill grounds every lesson in the mission and the zone of proximal
development, and this command does not get to skip that.

## 2. Research — always, even when the plan names a source

**First check `sources/<TASK>.md`.** If a dossier exists, `./scripts/audit-sources.sh`
already answered the five questions below — read it and skip to step 3. It is a
lead, not a fact: it tells you *what to read and where*, never what to write.

If there is no dossier, fire `/mattpocock-skills:research` on the topic **before
writing**. For a batch, fire every research pass at once and let them run in the
background while you read the first primary source.

The plan naming a URL is not evidence it covers the task. Three ways it has
already failed here: wrong document (eight QA tasks cite the ISTQB certification
*landing page*), a map not a textbook (~40 PM tasks cite one roadmap link), real
but partial (ISTQB §4.2.1 defines equivalence partitioning and offers no
practice material).

Scope each research pass to these five questions:

a. Does the source named in the plan actually cover this learning goal and this
   deliverable? Quote the part that does, or say it doesn't.
b. What is the single best primary source, if it isn't the one named?
c. What does that primary source leave out that a learner needs?
d. Is there a credible practitioner view that disagrees with it?
e. Are there worked examples, exercises or real defect stories worth adapting?

## 3. Then read the source yourself

**Research output is a lead, not a fact.** A background agent returns a
paraphrase and paraphrases drift. Fetch the actual document, read the actual
section, cite section numbers inline (`ISTQB CTFL v4.0 §5.2.1`). Never promote a
research summary straight into a lesson claim, and never write from memory.

**If no trustworthy source exists: STOP.** Record the gap in `RESOURCES.md`,
mark the lesson blocked in `curriculum.html`, and tell the user what you need.
Do not fill the hole from memory. In a batch, stop only that lesson and report
it — carry on with the rest.

## 4. Scope to one skill, and check what is grounded

One tangible win, about ten minutes. Teach only the knowledge that skill needs.
If two skills are fighting for room, split into two lessons and update the
curriculum. Numbers are permanent — never renumber to close a gap.

**Then read `GROUNDED.md`** — the concept ledger, borrowed from the
`writing-beats` grounding rule. A lesson may lean on a concept only if it is a
listed prerequisite or was grounded by an *earlier* lesson. A lesson that
reaches for an ungrounded concept loses the reader; that is the one move it
cannot make.

- Leaning on something ungrounded? Either ground it in this lesson first, or
  reorder — say which you chose and why.
- Wrap the first mention of each term you ground in `<dfn>`, and add it to
  `GROUNDED.md` under this lesson.
- Grounded-two-or-three-lessons-ago concepts are exactly where the quality
  bar's **spacing** callback should come from. The ledger tells you what is
  available to call back to.

## 5. Build from `assets/`

Read the folder first, every time. Reuse `quiz.js`, `risk-grid.js`,
`classify.js`, `select-set.js`, `coverage-set.js` and the `.rg-*` primitives in
`lesson.css`. Only write a new widget if none fits — and then make it reusable
and document its markup contract at the top of the file. Classic scripts only;
lessons open over `file://`.

## 6. Hit the quality bar in LESSON-RECIPE.md

Read it and satisfy every line — sourcing, structure, exercises, retention,
honesty. In particular: equal-word-count options, distractors that are real
misconceptions, corrective feedback both ways, graded feedback where the
judgement is genuine, at least one deliberate trap, and a retention device
(retrieval / spacing / interleaving / a carryable sentence template).

## 7. Wire it in, then verify mechanically

Add the curriculum row, the `index.html` card, the `.plan-tag` line, and
prev/next links — including updating the *previous* lesson's "Next" so it stops
saying "not yet written".

Then run the checker and fix everything it reports:

```
node scripts/check-lesson.mjs lessons/NN-slug.html
```

It catches dead links, missing wiring, quizzes where the longest option is the
answer, missing `data-feedback`, inline widget code that should live in
`assets/`, and `<dfn>` terms absent from `GROUNDED.md`. A clean run is
necessary, not sufficient — it checks plumbing, not teaching.

**If any claim in the lesson still feels shaky, re-open the primary source and
verify it before reporting done.** The `/mattpocock-skills:grilling` skill is an
interview for resolving human decisions; it is not a factual claim checker.
Never ask the user to stand in for evidence that can be read directly.

## 8. Report

For each lesson: the deliverable it enables, the primary source with section
numbers, anything the source did not cover, and any gap recorded in
`RESOURCES.md`. Update `NOTES.md` "Teaching state". If a named source turned out
to be wrong or thin, say so loudly — that finding is worth more than the lesson,
because it stops the same wrong source being trusted eleven more times.
