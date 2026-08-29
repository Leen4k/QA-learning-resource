# QA Repository Lesson Quality and Acceptance Gates

This reference is a mandatory overlay for the `$lesson` workflow **when it is
operating in the QA learning resource repository**. The canonical command and
`LESSON-RECIPE.md` still govern repository conventions, lesson structure,
sourcing, markup, navigation, grounding, resources, and notes. This reference
adds the evidence needed to decide how thoroughly a QA repository lesson was
verified and what completion status it may receive. Do not apply its repository
paths, scripts, HTML attributes, or status schema to unrelated standalone
lessons.

A passing `scripts/check-lesson.mjs` result is necessary but not sufficient.

## 1. Establish the outcome contract before drafting

Inspect the exact plan or curriculum row, its `What I'll do` entry, the preceding
lesson, the following lesson when it exists, the index, curriculum, grounding
ledger, shared assets, notes, resources, and two or three strong existing
lessons. Do not draft until the target deliverable is explicit.

Record this outcome contract in the lesson's durable verification record and
summarize it in the final report:

- **Plan row:** exact task identifier.
- **Plan deliverable:** exact `What I'll do` text.
- **Target skill:** the single performable skill being taught.
- **Learner output:** the artifact, decision, analysis, explanation, or action
  the learner must produce.
- **Completion conditions:** observable characteristics of successful work.
- **Prerequisites:** concepts or skills required before this lesson.
- **Final exercise:** the task that produces the plan deliverable.
- **Assessment rubric:** criteria used to judge the output.

Teach one clear skill, not a broad topic survey. Include background only when it
helps the learner perform that skill. If the plan row is broad or ambiguous,
preserve its intended outcome and propose the smallest coherent scope. Obtain
user approval before any material narrowing or split, record the decision in
`NOTES.md`, and keep the plan task incomplete until the combined lesson work
produces the exact deliverable. Never silently substitute a different outcome.

### Rubric requirements

Create the rubric before writing the lesson. Use three to seven observable
criteria and mark them required or optional when that distinction matters.
Describe what successful work contains, such as separating assumptions from
verified facts or including an observable result for every step. Do not use
unobservable criteria such as "shows understanding," "is good," "is complete,"
or "uses best practices."

The final exercise must produce the plan deliverable. A multiple-choice quiz is
not an adequate final exercise unless the deliverable is itself a classification
or judgment task.

## 2. Maintain a claim-level source record

Open and read primary sources during lesson creation. Dossiers, search results,
generated notes, secondary summaries, prior lesson text, and prior citations may
locate sources; they do not prove claims.

Maintain a durable record for every substantive factual or procedural claim:

| Field | Required information |
|---|---|
| Claim | The lesson claim |
| Lesson location | Section, example, or exercise where it appears |
| Source | The authoritative source supporting it |
| Exact location | Heading, page, paragraph, anchor, or standard clause |
| Support summary | How the source supports the claim |
| Qualification | Limits, exceptions, dispute, or uncertainty |
| Status | Supported, qualified, replaced, or removed |

Substantive claims include definitions, technical behavior, numbers, causal
claims, prescribed processes, standards, practitioner recommendations, and any
claim the learner must use in the final exercise.

Do not infer support from a title, search snippet, table of contents, dossier,
keyword, or citation used elsewhere. Read enough surrounding material to
understand context and limits.

Source acceptance requires all of the following:

- Prefer primary and authoritative sources and cite the most specific location.
- Place citations close enough to claims that the relationship is unambiguous.
- Give every external source link a `data-source-locator` containing its exact
  section, clause, heading, or anchor and a `data-accessed="YYYY-MM-DD"` value.
  Keep the locator visible in surrounding lesson text for the learner as well.
- Confirm the cited section supports the claim; syntax such as `§` proves
  nothing by itself.
- Remove or qualify unsupported claims.
- Keep standards, syllabus requirements, research findings, and practitioner
  opinions distinct.
- Preserve disagreement instead of inventing consensus.
- Label context-dependent recommendations.
- Disclose uncertainty, missing coverage, and source substitutions.
- Open every external primary-source link before completion and confirm that it
  reaches the intended material, not merely any successful HTTP response.

Summarize the record in the final report without reproducing long copyrighted
passages. Persist source gaps and substitutions through the repository's
existing `RESOURCES.md` and notes conventions.

## 3. Design around learner performance

Use the structure best suited to the skill, normally including:

1. A performance-based outcome.
2. A short explanation of why the skill matters.
3. Only the concepts needed to perform it.
4. A worked example or model.
5. Guided practice.
6. Immediate corrective feedback.
7. Independent practice.
8. A final deliverable.
9. The concrete rubric or self-check.
10. A short retrieval or transfer activity.

Keep explanation concise and follow it with learner effort. For each prerequisite
term, confirm that an earlier lesson grounded it or introduce it clearly now and
update `GROUNDED.md`.

Every lesson must include:

- At least one effortful practice activity.
- At least one activity with immediate corrective feedback.
- A final exercise that produces the target deliverable.
- A rubric the learner can apply to that deliverable.
- Retrieval, spacing, interleaving, transfer, comparison, or a useful reasoning
  template.

Possible templates include `Goal → evidence → decision`,
`Context → action → expected result`, `Claim → source → limitation`, and
`Risk → test → observable outcome`. Use one only when it improves performance.

## 4. Require meaningful questions and feedback

For each quiz or decision activity, identify in the durable verification record:

- The skill or misconception being tested.
- Why the correct answer is correct.
- The misconception represented by every distractor.
- The corrective idea the learner should retain.
- Whether the decision is binary or requires graded judgment.

Each distractor must represent a plausible beginner error. Do not create one by
randomly changing a noun, writing an absurd option, hiding the answer through
trick wording, or making the correct answer uniquely long. Similar option length
prevents a visual clue; it does not prove distractor quality.

Incorrect feedback must identify the reasoning error, explain why it fails in
this context, state the governing principle or evidence, and redirect the
learner toward sound reasoning. Correct feedback must reinforce the reasoning,
not merely announce success.

For genuine professional judgment, recognize partially defensible answers,
explain trade-offs, distinguish the preferred answer from context-dependent
alternatives, and state when another choice could become appropriate. Never
force nuance into falsely binary feedback.

## 5. Verify repository completeness and static behavior

Follow the canonical workflow for every applicable dependency, including the
lesson file and stable number, plan tag, index card, curriculum row, both
directions of navigation, previous lesson update, following lesson update when
applicable, grounding ledger, resources, notes, shared CSS and JavaScript,
assets, citations, answer and feedback attributes, labels, and semantic markup.

Do not leave placeholders, dead controls, empty feedback, TODO markers, or links
to nonexistent lessons. Do not duplicate shared assets without need or renumber
existing lessons without explicit authorization.

Run both commands with the actual path:

```sh
node scripts/check-lesson.mjs lessons/NN-slug.html
node scripts/check-lesson.mjs
```

Record each command, exit code, errors, warnings, and changes made in response.
Both commands must exit successfully. Require zero errors, zero warnings for the
target lesson, and zero new full-course warnings. Full-course warnings may remain
only when they match `verification/accepted-static-warnings.md`; explain the
baseline in the report. Investigate any mismatch. Do not expand into unrelated
legacy cleanup without user authorization.

These commands verify repository plumbing and basic markup. They do not prove
source correctness, instructional quality, runtime behavior, accessibility, or
learning effectiveness.

After the plan row, lesson, and its referenced local CSS and JavaScript are
final, compute the combined artifact fingerprint and put it in the verification
record:

```sh
node scripts/check-lesson-verification.mjs --fingerprint lessons/NN-slug.html
```

Then run the deterministic evidence gate:

```sh
node scripts/check-lesson-verification.mjs lessons/NN-slug.html
```

This command must exit successfully before Gates 1–5 can pass. It verifies the
record schema and status, plan provenance, artifact fingerprint, the unique
`NOTES.md` status row, precise external-link locators, PNG dimensions for
runtime screenshots, target checker result, and the full-course warning
baseline. Any exact plan-row, lesson, or referenced CSS/JavaScript change
invalidates the stored fingerprint and requires re-verification. A record whose
status is incomplete or blocked intentionally leaves this command nonzero so
`$lesson verify pending` cannot skip unresolved work.

## 6. Perform real-browser runtime and accessibility verification

Open the lesson directly through `file://` in a real browser or browser
automation environment. Static inspection is not a substitute.

Exercise every applicable path: all quizzes and answer options, correct and
incorrect feedback, graded states, retries and resets, disclosure controls,
tabs, checklists, reveal and copy controls, calculators, validation, and other
stateful widgets. Confirm repeated use does not corrupt state and multiple
widgets do not interfere.

Inspect the browser console for JavaScript errors, unhandled rejections, missing
resources, invalid paths, `file://` cross-origin failures, and broken handlers.
Unresolved console errors fail this gate.

Test without a mouse:

- Traverse controls with Tab and Shift+Tab in a logical order.
- Activate controls with expected keys.
- Confirm visible focus, no keyboard trap, and appropriate focus visibility.
- Confirm state changes, selected or expanded state, and form labels are
  communicated through semantic markup.

Test at least these viewports and inspect captured visual evidence:

- Desktop: approximately `1440 × 900`.
- Mobile: approximately `390 × 844`.

At both sizes, check readability, horizontal overflow, tables, code, callouts,
diagrams, reachable controls, unclipped feedback, navigation, focus indicators,
and final-exercise and rubric usability. Also inspect heading hierarchy,
landmarks, link wording, image alternatives, labels, contrast, and obvious
screen-reader barriers. Automated accessibility scans may support but never
replace manual keyboard and visual review.

Open primary-source, previous/next, index, curriculum, local-resource, and
download links. Confirm the destination is the intended one.

Capture desktop and mobile screenshots under
`verification/evidence/NN-slug/`, inspect them, and record their paths plus the
runtime results in the durable verification record. If browser execution is
unavailable, mark runtime verification blocked and identify every untested area.
Never claim this gate passed from source inspection alone.

## 7. Perform learning acceptance and independent review

A technically correct lesson is not accepted until an actual fresh human learner
can use it to produce the target deliverable. Record a non-sensitive learner
identifier or profile, relevant prerequisites, the produced artifact, and rubric
scoring in the durable verification record.

Use a separate independent agent for a clean-context source and instructional
quality review when available. Give it only the lesson path and necessary raw
sources, not author conclusions, suspected problems, hidden explanations, or the
intended solution. This may pass an independent teachability review, but it
cannot substitute for human learning acceptance.

Ask the human learner to complete the lesson, produce the deliverable, explain
relevant reasoning, and apply the lesson rubric. Then score the work independently
against the same rubric.

Learning acceptance passes only when:

- The learner identifies and completes the required output without additional
  teaching.
- Every required rubric criterion is satisfied and the rubric applies
  consistently.
- The lesson contains enough information and feedback to correct likely errors.
- Success depends on applying the taught skill rather than guessing.
- The final exercise matches the plan deliverable.
- No critical factual misunderstanding is introduced.

When acceptance fails, identify whether the cause is missing explanation,
insufficient practice, ambiguity, poor feedback, prerequisite gaps, or a flawed
rubric. Revise and repeat every affected static, runtime, and acceptance check.

A self-review or AI learner simulation is interim evidence only and must be
labeled accurately. If no fresh human learner is available, this gate does not
pass and the maximum status is
`IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING`.

The independent quality reviewer should inspect plan alignment, claim
traceability, source sections, explanations, distractors, feedback, exercise
alignment, rubric usability, and accessibility. Record the reviewer type,
findings, and revisions. Never claim human learning or independence that did not
actually occur.

## 8. Apply the six gates independently

Do not average gates. A failure in one mandatory gate prevents full completion.

### Gate 1: Outcome alignment

Pass only when the exact plan row and deliverable are identified, the lesson
teaches one clear skill, the final exercise produces the deliverable, and a
concrete rubric defines successful work.

### Gate 2: Source integrity

Pass only when primary sources were read, every substantive claim maps to a
specific source location, summaries remained leads, disagreements remain
distinct, uncertainty and substitutions are disclosed, and source links reach
the intended material.

### Gate 3: Instructional quality

Pass only when the outcome is performable, prerequisites are grounded, concise
explanation leads to effortful practice, feedback is corrective, distractors
are plausible, judgment is graded appropriately, retention or transfer is
built in, and the final exercise and rubric are usable.

### Gate 4: Repository completeness

Pass only when all required files and records are updated, wiring and navigation
are complete, numbering is stable, both lesson-checker commands pass with zero
errors, the target has zero warnings, the full-course warning baseline is
unchanged and explained, and the deterministic evidence checker exits zero.

### Gate 5: Runtime verification

Pass only when the lesson was opened through `file://`, every relevant
interaction state works, no console error remains, keyboard operation works,
desktop and mobile layouts were inspected, links reach correct destinations,
and basic visual and accessibility checks pass.

### Gate 6: Learning acceptance

Pass only when an actual fresh human learner completes the target deliverable
without extra explanation, required rubric criteria are satisfied, and critical
factual and instructional issues are resolved.

## 9. Use only approved completion statuses

Use exactly one of these statuses for each lesson:

- **`COMPLETE — VERIFIED AND ACCEPTED`** — all six gates pass. State separately
  whether an additional independent expert review occurred.
- **`IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING`** — Gates 1–5 pass,
  but no actual fresh human learner was available.
- **`INCOMPLETE — REVISION REQUIRED`** — a known quality problem remains, a gate
  failed, an unsupported claim remains, an interaction is broken, the final
  exercise is misaligned, feedback is inadequate, or repository checks fail.
- **`BLOCKED — VERIFICATION NOT POSSIBLE`** — a required check could not run
  because source access, browser capability, tooling, dependencies, or required
  files were unavailable. State the blocker and unverified scope.

Never use a successful static checker as justification for `COMPLETE — VERIFIED
AND ACCEPTED`.

Status precedence is deterministic:

1. A known quality failure is `INCOMPLETE — REVISION REQUIRED`, even if another
   check is also unavailable.
2. With no known failure, unavailable required evidence is
   `BLOCKED — VERIFICATION NOT POSSIBLE`.
3. With Gates 1–5 passing but no human learner, use
   `IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING`.
4. Use `COMPLETE — VERIFIED AND ACCEPTED` only when all six gates pass.

For a batch, retain one record and status per lesson. Also report a batch roll-up
using the first applicable status in the precedence list above. Do not collapse
different lesson outcomes into an ambiguous narrative.

## 10. Persist the verification record

Create `verification/lessons/NN-slug.md` for every created, revised, or verified
lesson. Copy
[`../assets/verification-record-template.md`](../assets/verification-record-template.md)
and replace every placeholder. Use this frontmatter with the appropriate
lowercase status slug:

```yaml
---
lesson: "NN"
task: "QA-NNN"
status: "complete-verified-and-accepted"
verified: "YYYY-MM-DD"
artifact_sha256: "SHA-256 from check-lesson-verification.mjs --fingerprint"
plan_source: "refreshed"
plan_sha256: "SHA-256 of plan/qa.csv"
plan_modified: "ISO UTC modified_at copied from plan/refresh-metadata.json"
plan_authorization: "not-required"
plan_refresh_id: "refresh_id copied from plan/refresh-metadata.json"
---
```

For the documented legacy lesson whose `.plan-tag` says `no matching task`, use
`task: "NO-TASK"` and identify the curriculum exception as the plan row in the
outcome contract. No other taskless lesson is permitted.

`plan_source: refreshed` is valid only when `plan/refresh-metadata.json` exists
and a current or retained refresh snapshot matches the record's QA hash and
modified time. Refresh metadata retains bounded history so re-fetching unchanged
plan content does not invalidate earlier lesson evidence. The latest refresh
must itself have `status: success`; an in-progress or failed refresh invalidates
older freshness claims. If refresh was
unavailable and the user explicitly approved the current cache, use
`plan_source: authorized-cache`, the cache's actual hash and modified time, and
`plan_authorization: user-authorized-cache:YYYY-MM-DD:<durable request or issue
reference>`, plus `plan_refresh_id: not-applicable`. Never invent that
authorization.

Allowed status slugs are:

- `complete-verified-and-accepted`
- `implementation-verified-learning-acceptance-pending`
- `incomplete-revision-required`
- `blocked-verification-not-possible`

Use these exact level-two headings so the evidence checker can detect omissions:

- `## Outcome contract`
- `## Assessment rubric`
- `## Claim ledger`
- `## Question and misconception review`
- `## Files changed`
- `## Source integrity`
- `## Static verification`
- `## Runtime verification`
- `## Independent quality review`
- `## Learning acceptance`
- `## Gate summary`
- `## Final status`
- `## Remaining risks`

The record must contain the full outcome contract, rubric, claim ledger,
question-and-misconception notes, files changed, source and link evidence, all
three static-check records, runtime matrix and screenshot paths, independent
review, human learning acceptance and rubric scoring, six gate results, final
status, and remaining risks. Maintain a `Verification status` table in
`NOTES.md` with this exact column order:

```markdown
| Lesson | Task | Status | Verified | Record |
|---|---|---|---|---|
| NN | QA-NNN | status-slug | YYYY-MM-DD | verification/lessons/NN-slug.md |
```

Gate 4 fails when the durable record is missing, its plan-bound artifact
fingerprint is stale, or its frontmatter, notes row, final report, and actual
artifacts disagree.

Use the field labels the checker expects. The outcome contract uses `Plan row:`,
`Plan deliverable:`, `Target skill:`, `Learner output:`, `Completion
conditions:`, `Prerequisites:`, and `Final exercise:`. Write each rubric item as
`- Required:` or `- Optional:` and include three to seven items. Use the
seven-column claim-ledger table from section 2. For each static run, record
`Command:`, `Exit code:`, `Errors:`, `Warnings:`, and `Result:`. The runtime
section must contain a `Check | Environment | Result | Evidence or notes` table,
the `file://` URL, and `Console:`, `Keyboard:`, `Desktop:`, `Mobile:`, and
`Source links:` notes. Learning acceptance uses `Reviewer type:`, `Prerequisite
profile:`, `Deliverable produced:`, `Rubric result:`, `Difficulties
encountered:`, `Revisions made:`, and `Acceptance result:`. The gate table uses
`Gate | Result | Evidence` and exactly one row per gate.

## 11. Produce an evidence-backed final report

Include these sections:

1. **Lesson:** number, title, path, plan row, and exact deliverable.
2. **Outcome contract:** target skill, learner output, final exercise, rubric
   criteria, and prerequisites.
3. **Files changed:** every created or modified file and its purpose.
4. **Source integrity:** primary sources opened, claims and exact sections
   verified, qualifications or removals, conflict or uncertainty, gaps,
   substitutions, and link result.
5. **Instructional review:** practice, feedback, misconceptions, judgment
   treatment, retention or transfer mechanism, exercise alignment, and rubric.
6. **Static verification:** for both lesson-checker commands and the evidence
   checker, give command, exit code, errors, warnings, response changes, and
   result. Include the recorded artifact fingerprint.
7. **Runtime verification:** give Pass, Fail, or Blocked plus evidence for
   `file://` loading, correct/incorrect/graded states, retry/reset, console,
   keyboard, desktop, mobile, and links.
8. **Learning acceptance:** human learner profile or pending state, deliverable,
   rubric result,
   difficulties, revisions, and acceptance result. Do not imply independence
   for self-review.
9. **Gate summary:** result and evidence for each of the six gates.
10. **Final status:** exactly one approved status and all remaining risks.

## Prohibited shortcuts

Do not stop at HTML generation or a passing static checker. Do not treat
citation markup as source proof, feedback text as useful feedback, equal option
length as plausible distractors, a self-review or AI simulation as human learning
acceptance, or HTML inspection as browser verification. Do not cite unread sources, conceal gaps or
warnings, claim untested keyboard or mobile quality, leave interactions
unexercised, overstate blocked verification, broaden the lesson until practice
becomes thin, or change numbering without explicit authorization.

The governing principle is: a lesson is complete only when its outcome is
aligned, claims are traceable, instruction supports performance, repository
integration is complete, runtime behavior has been exercised, and a fresh
learner can produce the intended deliverable.
