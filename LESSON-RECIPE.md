# How to make a lesson

The recipe that produced lessons 1–5. Follow it and the next 110 lessons will
match; skip steps and they won't. The constraints below are the quality — the
prompt is just how you invoke them.

---

## Which skill to use

All 40 mattpocock skills were surveyed on 2026-07-27. These three earn a place:

| Situation | Skill | Why |
|---|---|---|
| **Every lesson, before writing** | `/mattpocock-skills:research <topic>` | Runs in the background while other work continues. Establishes whether the named source is *sufficient*, and finds what it leaves out. Skip it when `sources/<TASK>.md` already exists. |
| Writing the lesson | `/mattpocock-skills:teach <TASK-ID>` | Stateful. Reads MISSION, RESOURCES, NOTES and learning-records, so lessons stay grounded and in the zone of proximal development. `disable-model-invocation: true` — **only the user can invoke it**, so this half can never be automated behind your back. |
| Ordering concepts across lessons | `/mattpocock-skills:writing-beats` | Not run directly — it is an interactive, one-beat-at-a-time loop. What is borrowed is its **grounding** rule, now enforced by `GROUNDED.md`: a lesson may lean on a concept only if a prerequisite or an earlier lesson grounded it. |

Considered and rejected, so nobody re-litigates it:

- **`wayfinder`** — the closest fit conceptually ("too big for one agent
  session", and it names *course content* as in-scope). Its charting step even
  fires parallel `/research` subagents, which is what `scripts/audit-sources.sh`
  does. Rejected because it needs an issue tracker and is explicitly *planning
  only* — "Plan, don't do". It decides unknowns; it does not produce 49 lessons.
  Worth revisiting if the source audit turns up enough dead ends that the
  *shape* of the course becomes the open question.
- **`scaffold-exercises`** — sounds ideal, isn't. It scaffolds directories for
  Matt's ai-hero TypeScript repo and validates with `pnpm ai-hero-cli internal
  lint`. Nothing transfers to standalone HTML lessons.
- **`handoff`** — real use across many sessions, but `NOTES.md` already carries
  the teaching state that a handoff doc would.
- **`to-questionnaire`** — turns a decision *you* can't answer into questions
  for a human. Not a quiz generator.
- **`grilling`** — interviews the user one decision at a time until both sides
  share an understanding. It is useful for unresolved product decisions, but it
  does not verify factual claims. Re-open the primary source to check a claim;
  never ask the user to stand in for evidence.
- The ~25 engineering skills (`tdd`, `code-review`, `implement`, `triage`, …)
  are about shipping code. This repo ships lessons.

**Research runs for every lesson, not only for the flagged gaps.** A source
being named in the plan is not evidence that it covers the task. Three ways a
named source fails, all of which have already happened here:

- **It is the wrong document.** Eight QA tasks cite the ISTQB *certification
  landing page* rather than the syllabus. The page teaches nothing.
- **It is a map, not a textbook.** Around forty PM tasks cite one roadmap link.
  Roadmaps name topics; they give no definitions and no worked examples.
- **It is real but partial.** ISTQB §4.2.1 defines equivalence partitioning
  precisely and offers no practice material. The definition was usable; the
  exercise in lesson 5 had to be built from scratch.

The cost of research is a few minutes of background work. The cost of finding
out mid-lesson that the source was thin is a lesson written from memory — which
is the one failure this course cannot absorb.

### The one thing research does not get to do

**Research output is a lead, not a fact.** A background agent returns a
paraphrase, and paraphrases drift. Anything from a research pass that ends up as
a claim in a lesson must be re-read at its source and cited by section number
before it ships. Use research to decide *what to read*; use your own fetch of
the primary document to decide *what to write*.

---

## The prompt

It's a slash command. The full instructions live in
[`.claude/commands/lesson.md`](.claude/commands/lesson.md) — that file *is* the
prompt that used to be pasted here, so edit it when the recipe changes.

```
/lesson QA-006                 one lesson
/lesson QA-006 QA-007 QA-008   a batch, in that order
/lesson next                   next unwritten lesson in curriculum order
/lesson next 3                 next three
```

Batching is where research pays for itself: the passes run concurrently while
the first primary source is being read, so the cost is roughly one lesson's wait
for the whole batch. Batches of 3–4 keep quality up; more than that produces
thin material.

### What the command does not do

It replaces the *typing*, not the *judgement*. It still runs a research pass per
task, still re-reads the primary source before any claim ships, and still stops
dead when no trustworthy source exists. Nothing here should ever become a
fire-and-forget pipeline that writes lessons unattended — the failure mode that
would produce (§ *What breaks quality*, item 3) is the one this course cannot
absorb, because plausible wrong content is harder to fix than no content.

## The supporting scripts

```
./scripts/refresh-plan.sh                       cache both sheet tabs -> plan/*.csv
grep -m1 '^QA-006' plan/qa.csv                  read one task row
node scripts/check-lesson.mjs [file...]         mechanical half of the quality bar
```

`check-lesson.mjs` verifies what is boring to check by hand and therefore gets
skipped: dead local links, a lesson missing from `index.html` or
`curriculum.html`, a missing `.plan-tag` or prev/next, quiz options whose word
counts give the answer away, options with no `data-feedback`, no `§` citation
anywhere, and inline widget code that should have been extracted to `assets/`.

A clean run is **necessary, not sufficient**. It checks plumbing. Everything
below — is the source real, is the distractor a genuine misconception, can the
learner now produce the deliverable — is still a judgement call.

---

## The quality bar

A lesson is not done until every line here is true.

### Sourcing

- [ ] A research pass ran for this task, whether or not the plan named a source.
- [ ] Every factual claim traces to a source **read this session**, not recalled,
      and not lifted from a research summary without re-reading the original.
- [ ] Section numbers cited inline (`ISTQB CTFL v4.0 §5.2.1`), not just a link.
- [ ] If the plan's named source turned out to be wrong or thin, `RESOURCES.md`
      records what replaced it and why. That finding is worth more than the
      lesson — it stops the same wrong source being trusted eleven times.
- [ ] Where ISTQB and Rapid Software Testing disagree, both are given and the
      disagreement is named. Don't blend them into a mush.
- [ ] The recommended primary source is the **best** one found, with an honest
      estimate of how long it takes to read.

### Structure

- [ ] Opens with the win: what the learner can *do* afterwards, in their words.
- [ ] Knowledge first, short. Difficulty in the knowledge section is the enemy —
      it eats the working memory needed for understanding.
- [ ] Then practice. Difficulty here is the tool — effortful retrieval is what
      builds long-term retention.
- [ ] Ends with: primary source, an ask-your-teacher box, prev/next links.
- [ ] Ties back to the mission. For QA that means: does this help defend a
      judgement out loud in an interview?

### Exercises

- [ ] At least one interactive exercise with **immediate, automatic** feedback.
- [ ] Feedback is *corrective*: says why the chosen answer fails **and** why the
      right one works. A bare tick teaches nothing.
- [ ] Quiz options are **equal word count**. Length is a tell; equal length
      forces real discrimination. Four permutations of one frame is a good
      pattern.
- [ ] Distractors are real misconceptions, not filler. The best distractor is
      what a competent beginner actually believes.
- [ ] Where the answer is a genuine judgement call, feedback is **graded** —
      "defensible, one step from the reference" — not binary. Pretending
      judgement has one right answer teaches the wrong lesson.
- [ ] At least one deliberate trap that punishes the instinctive answer, with
      feedback explaining why the instinct is wrong.

### Retention

Fluency is the illusion; storage strength is the goal. Build in at least one:

- [ ] **Retrieval** — recall from memory, not recognition from a list.
- [ ] **Spacing** — a callback to a concept from two or three lessons ago.
- [ ] **Interleaving** — mixing related-but-different problems in practice.
- [ ] A memorable sentence template the learner can carry into a real
      conversation (e.g. "Impact is high *because* ___, likelihood is high
      *because* ___").

### Honesty

- [ ] Anything not covered is stated, not glossed. Partial coverage is marked
      partial in the curriculum.
- [ ] Where the plan and the syllabus disagree (e.g. QA-004 asks for gray-box,
      which ISTQB v4.0 does not define), say so in the lesson.
- [ ] Source gaps are recorded in `RESOURCES.md` and surfaced on the curriculum
      page, never quietly filled.

---

## What breaks quality

Observed failure modes, worth naming so they get avoided:

1. **Writing before reading.** The single biggest risk. Plausible, confident,
   subtly wrong content is harder to fix than no content.
2. **Trusting a named source without checking it covers the task.** The plan
   naming a URL is not evidence. Eight QA tasks point at a certification landing
   page; forty PM tasks point at one roadmap. Research every task.
3. **Promoting a research summary into a lesson claim.** Background agents
   paraphrase, and paraphrases drift from the original. Research tells you what
   to read, not what to write.
4. **Covering the task instead of teaching the skill.** The sheet's "What I'll
   do" column is the test. If the learner can't produce that artifact after the
   lesson, the lesson failed regardless of how much it covered.
5. **Inventing a new widget per lesson.** Duplicated code, inconsistent feel.
   Read `assets/` first, every time.
6. **Binary feedback on judgement calls.** Teaches learners to guess the
   author's preference rather than to reason.
7. **Renumbering lessons to close a gap.** Numbers are permanent. Lesson 4 is
   unwritten and the file list jumps 03 → 05; leave it that way.

---

## Before writing PM lessons

There is no `MISSION.md` for project management. The teach skill grounds every
lesson in the mission — without one, PM lessons will be generic. Establish why
the course is being taken (target role? a live project? the certification at
lesson 63?) before invoking the prompt for any PM task.

See `NOTES.md` for current teaching state, source gaps, and the naming rules.
