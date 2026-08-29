# QA Learning Resource Adapter

Read this reference only when the request targets the QA learning resource
course or resolves its `QA-*` or `PM-*` curriculum tasks. It specializes the
general `$lesson` workflow; it does not limit `$lesson` in other repositories.
An unrelated standalone lesson requested while the current directory happens to
be this repository stays in general standalone mode and must not be wired into
the course unless the user asks for that integration.

## Confirm and resolve repository state

A valid root contains `LESSON-RECIPE.md`, `curriculum.html`, `plan/qa.csv`, and
`lessons/`. For this repository, support:

- `$lesson next` — create the next unwritten QA lesson.
- `$lesson next N` — create the next N lessons in curriculum order.
- `$lesson QA-010` — create or fully revise the mapped lesson.
- `$lesson QA-010 QA-011` — process a batch in the given order.
- `$lesson verify QA-010` — rerun every reliability gate for one lesson.
- `$lesson verify pending` — select the earliest lesson whose deterministic
  evidence check fails.
- `$lesson` — default to `next` in this repository.

Run `./scripts/refresh-plan.sh` before resolving a curriculum target. If refresh
fails, stop unless the user explicitly authorizes the identified cached snapshot
for this run. Persist the authorization reference, cache hash, and modification
time in the verification record; never silently continue from stale plan data.

Cross-check the plan, `curriculum.html`, `NOTES.md`, `index.html`, lesson files,
and persisted verification records. Stop on conflicting mappings or written
state instead of guessing. Announce the resolved lesson number, title, task ID,
and verification status before implementation.

`next` is the first curriculum slot with no lesson file and no index link whose
curriculum and notes state also identify it as unwritten. For `verify pending`,
run `node scripts/check-lesson-verification.mjs <lesson>` in curriculum order and
select the first nonzero result. Stored status is only a discovery hint: changed
artifacts, stale fingerprints, missing screenshots, plan drift, or conflicting
state make the lesson pending even if an old record says complete. A valid
`implementation-verified-learning-acceptance-pending` record is not re-queued
solely because human acceptance remains pending.

Project-management tasks remain subject to the canonical stop condition in
`.claude/commands/lesson.md`. Do not reuse the QA mission for PM. A PM lesson may
proceed only after the repository defines the missing PM mission/context and the
canonical workflow is updated or the user explicitly resolves that blocker.

## Read the repository instruction layers

Before drafting, read these files completely:

1. `.claude/commands/lesson.md` — canonical repository procedure.
2. `LESSON-RECIPE.md` — canonical teaching and sourcing quality bar.
3. [reliable-lesson-gates.md](reliable-lesson-gates.md) — mandatory durable
   evidence, runtime, accessibility, and acceptance overlay.

Follow all three. The reliable gates add requirements; they do not replace or
weaken the canonical workflow. Where they overlap, satisfy the stricter rule.

Translate only agent-specific mechanisms:

- Use available Codex shell, editing, web, browser, and inspection tools in
  place of Claude-specific tool names.
- When Matt Pocock's `research` skill is available, it may perform source
  discovery. Otherwise research directly. In either case, reopen every primary
  source before using its claims.
- Do not automatically invoke the explicit-only `teach` or `writing-beats`
  skills. If the user invokes them, coordinate as described in the main skill.
- A `sources/<TASK>.md` dossier locates sources but is never evidence itself.
- Apply edits and finish the requested workflow; do not stop after a plan unless
  a canonical stop condition or quality-gate blocker is reached.

For batches, complete lessons in order because `GROUNDED.md`, navigation, and
learner prerequisites are sequential state. Keep every completed lesson valid
before proceeding.

## Preserve repository completion behavior

Create the outcome contract and rubric before lesson prose. Maintain the
claim-level source record while writing. Persist all evidence in
`verification/lessons/NN-slug.md`, starting from
`../assets/verification-record-template.md`, and replace every placeholder.

Implement every applicable repository dependency. Run targeted and full-course
static checks, compute the artifact fingerprint, and run the deterministic
verification checker exactly as required by the reliable-gates reference.

Open the lesson through `file://` in a real browser. Exercise every relevant
interaction, inspect the console, test keyboard operation, inspect desktop and
mobile screenshots, and persist the evidence. HTML inspection alone cannot pass
runtime verification.

Use an independent clean-context reviewer for source and teachability review
when available. This does not prove learning. Gate 6 requires an actual fresh
human learner with a declared prerequisite profile who sees only the lesson,
its stated inputs, and final exercise—not hidden answers or author notes.

Do not claim a gate passed without its required evidence. Browser unavailability
blocks runtime verification. Human-learner unavailability limits the maximum
status to `IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING`.

Evaluate all gates independently and finish with exactly one approved repository
status per lesson:

- `COMPLETE — VERIFIED AND ACCEPTED`
- `IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING`
- `INCOMPLETE — REVISION REQUIRED`
- `BLOCKED — VERIFICATION NOT POSSIBLE`

For a batch, use the status precedence defined in the reliable-gates reference
and report the weakest result as the roll-up.
