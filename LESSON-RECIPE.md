# How to make a lesson

The recipe that produced lessons 1–5. Follow it and the next 110 lessons will
match; skip steps and they won't. The constraints below are the quality — the
prompt is just how you invoke them.

---

## Which skill to use

| Situation | Skill | Why |
|---|---|---|
| **Every lesson, before writing** | `/mattpocock-skills:research <topic>` | Runs in the background while other work continues. Establishes whether the named source is *sufficient*, and finds what it leaves out. |
| Writing the lesson | `/mattpocock-skills:teach <TASK-ID>` | Stateful. Reads MISSION, RESOURCES, NOTES and learning-records, so lessons stay grounded and in the zone of proximal development. |
| Checking a written lesson | `/mattpocock-skills:grilling` | Stress-tests claims. Useful before sharing a lesson you're unsure of. |

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

2. RESEARCH FIRST — ALWAYS, even when the plan names a source.
   Kick off /mattpocock-skills:research on the topic before writing. The
   named source may be the wrong document, a roadmap rather than a
   textbook, or real but too thin to teach from. Assume nothing.
   Scope the research to these five questions:
     a. Does the source named in the plan actually cover this learning
        goal and this deliverable? Quote the part that does, or say it
        doesn't.
     b. What is the single best primary source on this topic, if it isn't
        the one named?
     c. What does the primary source leave out that a learner needs?
     d. Is there a credible practitioner view that disagrees with it?
     e. Are there worked examples, exercises or real defect stories worth
        adapting?

3. THEN READ THE SOURCE YOURSELF.
   Research output is a lead, not a fact — paraphrases drift. Fetch the
   actual document, read the actual section, and cite section numbers.
   Never write from your own memory of the topic, and never promote a
   research summary straight into a lesson claim.
   If after research no trustworthy source exists: STOP. Record the gap in
   RESOURCES.md and mark the lesson blocked in the curriculum page. Tell
   me what you need. Do not fill the hole from memory — a course that
   invents its facts is worse than no course.

4. SCOPE TO ONE SKILL.
   One tangible win, completable in about ten minutes. Teach only the
   knowledge that skill needs. If two skills are fighting for room, split
   it into two lessons and update the curriculum.

5. BUILD FROM assets/.
   Read the folder first. Reuse quiz.js, risk-grid.js, classify.js,
   select-set.js and the .rg-* style primitives. Only write a new widget
   if no existing one fits — and if you do, make it reusable and document
   its markup contract at the top of the file.

6. HIT THE QUALITY BAR BELOW. All of it.

7. WIRE IT IN.
   Add the row to the curriculum page, the card to index.html, the
   .plan-tag line at the top of the lesson, and prev/next links in the
   footer. Verify every local link resolves before telling me you're done.
```

For a batch, add:

```
Do tasks <A>, <B>, <C> in that order. Fire the research passes for all of
them at once and let them run in the background, then read the primary
sources yourself and write. Stop and report if any source turns out to be
insufficient — don't quietly downgrade to memory for that one.
```

Batching is where research pays for itself: the passes run concurrently while
you read the first source, so the cost is roughly one lesson's wait for the
whole batch.

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
