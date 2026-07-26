# How to make a lesson

The recipe that produced lessons 1–5. Follow it and the next 110 lessons will
match; skip steps and they won't. The constraints below are the quality — the
prompt is just how you invoke them.

---

## Which skill to use

| Situation | Skill | Why |
|---|---|---|
| Writing a lesson | `/mattpocock-skills:teach <TASK-ID>` | Stateful. Reads MISSION, RESOURCES, NOTES and learning-records, so lessons stay grounded and in the zone of proximal development. |
| A topic has no trustworthy source | `/mattpocock-skills:research <topic>` | Delegates the reading to a background agent and writes findings into the repo as Markdown. Use for the flagged gaps only — not for topics that already have a primary source. |
| Checking a written lesson | `/mattpocock-skills:grilling` | Stress-tests claims. Useful before sharing a lesson you're unsure of. |

Do **not** use `research` for a topic where `RESOURCES.md` already names a
primary source. Re-researching a solved question burns budget and adds a
paraphrase layer between the lesson and the source.

---

## The prompt

Paste this, replacing `<TASK-ID>`. One task per invocation.

```
/mattpocock-skills:teach <TASK-ID>

Write the next lesson. Follow LESSON-RECIPE.md exactly.

1. READ THE TASK FIRST.
   Fetch the plan row for <TASK-ID> from the sheet CSV export (follow the
   307 redirect to the signed googleusercontent URL):
   QA  → .../export?format=csv&gid=1651117697
   PM  → .../export?format=csv&gid=487507119
   Take: Focus, "What I want to learn", "What I'll do", Week, Resource.
   The "What I'll do" column is the deliverable — the lesson must leave me
   able to produce exactly that thing.

2. GET THE SOURCE BEFORE WRITING A WORD.
   Fetch the primary source and read the actual section. Cite section
   numbers. Never write from your own memory of the topic.
   If no trustworthy source exists: STOP. Record the gap in RESOURCES.md
   and mark the lesson blocked in the curriculum page. Tell me what you
   need. Do not fill the hole from memory — a course that invents its
   facts is worse than no course.

3. SCOPE TO ONE SKILL.
   One tangible win, completable in about ten minutes. Teach only the
   knowledge that skill needs. If two skills are fighting for room, split
   it into two lessons and update the curriculum.

4. BUILD FROM assets/.
   Read the folder first. Reuse quiz.js, risk-grid.js, classify.js,
   select-set.js and the .rg-* style primitives. Only write a new widget
   if no existing one fits — and if you do, make it reusable and document
   its markup contract at the top of the file.

5. HIT THE QUALITY BAR BELOW. All of it.

6. WIRE IT IN.
   Add the row to the curriculum page, the card to index.html, the
   .plan-tag line at the top of the lesson, and prev/next links in the
   footer. Verify every local link resolves before telling me you're done.
```

For a batch, add: `Do tasks <A>, <B>, <C> in that order. Fetch all the sources
first, then write. Stop and report if any source is missing.`

---

## The quality bar

A lesson is not done until every line here is true.

### Sourcing

- [ ] Every factual claim traces to a source **read this session**, not recalled.
- [ ] Section numbers cited inline (`ISTQB CTFL v4.0 §5.2.1`), not just a link.
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
2. **One roadmap link as the source.** A roadmap names topics; it doesn't teach
   them. About forty of the sixty-three PM tasks cite the same roadmap page —
   each of those needs a real source found first.
3. **Covering the task instead of teaching the skill.** The sheet's "What I'll
   do" column is the test. If the learner can't produce that artifact after the
   lesson, the lesson failed regardless of how much it covered.
4. **Inventing a new widget per lesson.** Duplicated code, inconsistent feel.
   Read `assets/` first, every time.
5. **Binary feedback on judgement calls.** Teaches learners to guess the
   author's preference rather than to reason.
6. **Renumbering lessons to close a gap.** Numbers are permanent. Lesson 4 is
   unwritten and the file list jumps 03 → 05; leave it that way.

---

## Before writing PM lessons

There is no `MISSION.md` for project management. The teach skill grounds every
lesson in the mission — without one, PM lessons will be generic. Establish why
the course is being taken (target role? a live project? the certification at
lesson 63?) before invoking the prompt for any PM task.

See `NOTES.md` for current teaching state, source gaps, and the naming rules.
