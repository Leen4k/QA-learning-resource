---
name: lesson
description: Create, revise, or verify evidence-grounded lessons for any subject, either as standalone learning artifacts or inside an existing curriculum workspace. Use when the user invokes $lesson or requests a complete lesson-authoring workflow; do not use for a quick explanation, an isolated typo, or a code-only edit.
---

# Reliable Lesson Builder

Create a lesson that enables a defined learner to perform one observable outcome.
Adapt the content, format, research depth, practice, and verification to the subject
and delivery medium instead of assuming every lesson is a QA lesson or an HTML
file.

## Select the operating mode

Inspect the request and workspace before drafting, then use exactly one mode:

1. **Repository curriculum mode.** A project already defines a mission,
   curriculum, lesson sequence, templates, source conventions, or validators.
   Read and follow those local instructions. Preserve numbering, navigation,
   state files, and existing teaching conventions.
2. **Existing teaching-workspace mode.** Files such as `MISSION.md`,
   `RESOURCES.md`, `learning-records/`, `reference/`, `lessons/`, or `assets/`
   establish the learner's goals and prior knowledge. Use them to keep the lesson
   in the learner's zone of proximal development. Use this state only when the
   requested lesson belongs to that learning project; never borrow an unrelated
   mission merely because it is in the current directory.
3. **Standalone mode.** No course contract exists. Create one self-contained
   lesson for the topic and audience in the format the user requested. If no
   output format or location is established, deliver portable Markdown in the
   conversation rather than inventing a new course structure.

When the request targets the QA learning resource curriculum—identified by its
`QA-*` or `PM-*` task IDs, or by an explicit request to modify that course—and
the root contains `LESSON-RECIPE.md`, `curriculum.html`, `plan/qa.csv`, and
`lessons/`, read and follow
[the QA repository adapter](references/qa-repository-adapter.md). Its stricter
repository and evidence requirements override the general workflow for those
course tasks. Merely launching `$lesson` from that repository does not turn an
unrelated standalone topic into a QA curriculum lesson. Do not import
QA-specific task IDs, mission language, HTML requirements, or completion
statuses into unrelated lessons.

## Interpret the request

Support these general forms:

- `$lesson <topic or outcome>` — create a lesson.
- `$lesson revise <target>` — substantially improve an existing lesson.
- `$lesson verify <target>` — verify an existing lesson without rewriting it
  unless the user also asks for fixes.
- `$lesson next` or `$lesson next N` — create the next curriculum lesson(s), but
  only when the workspace defines a trustworthy curriculum order and state.
- `$lesson <task-id> [<task-id> ...]` — resolve IDs through the repository's
  plan or curriculum adapter.

If `$lesson` has no argument, use `next` only when a curriculum clearly defines
it. Otherwise ask what the user wants to learn; a topic cannot be inferred from
an unrelated workspace safely.

For a batch, resolve every target before writing and complete them in dependency
order. Keep each lesson independently usable before moving to the next.

## Define the outcome before prose

Establish an outcome contract from the user's request and available learning
state:

- target learner and relevant prior knowledge;
- one performable skill or decision;
- the artifact, action, analysis, or explanation the learner will produce;
- observable success criteria;
- prerequisites that may be assumed and concepts that must be introduced;
- delivery format, duration, and accessibility or safety constraints;
- a final exercise that produces the target outcome.

Infer low-risk details from context. Ask only when the missing audience,
mission, or desired outcome would materially change the lesson. If the requested
scope contains multiple independent skills, propose the smallest coherent split
before changing an established curriculum.

Create a short rubric with observable criteria before drafting. Avoid criteria
such as "understands," "is good," or "uses best practices" unless they are
translated into visible behavior.

## Research and source claims

Research every substantive factual, technical, historical, scientific, legal,
medical, or procedural claim to the depth its risk requires. Prefer the sources
that own the claim: official documentation, standards, legislation, original
research, first-party data, or authoritative scholarship as appropriate to the
domain. Distinguish evidence, practitioner judgment, convention, and the
author's teaching example.

Use research output only to locate evidence. Open the cited source, read the
relevant context, and verify the claim before teaching it. Record precise
sections, headings, pages, clauses, or anchors when available. Qualify disputes,
limits, dated guidance, and uncertainty. If a necessary high-stakes claim cannot
be supported, stop or narrow the lesson instead of filling the gap from memory.

For low-risk creative or reflective lessons, do not manufacture citations;
identify examples and exercises as constructed material.

## Use compatible companion skills when available

Companion skills are optional enhancements, never hidden dependencies:

- Use Matt Pocock's `research` skill, when installed and invocable, for
  background source discovery. Its cited note is a lead; independently reopen
  every source used in the lesson.
- Matt Pocock's `teach` skill is user-invoked and owns stateful mission,
  resources, learning records, and zone-of-proximal-development decisions. Do
  not invoke it automatically. If the user invokes both skills, let `teach`
  supply learner state and let `$lesson` own the requested artifact and its
  verification.
- Apply the grounding rule from `writing-beats`: a lesson may rely only on
  concepts declared as prerequisites or introduced earlier. Do not invoke its
  interactive writing loop unless the user explicitly requests that skill.

If these skills are unavailable, perform the same in-scope work with available
research and authoring tools. Never stop merely because an optional companion
skill is missing.

## Design for learner performance

Choose a structure suited to the outcome. A strong default is:

1. State the tangible win and prerequisites.
2. Explain only the knowledge required for the skill.
3. Show a worked example or model with the reasoning made visible.
4. Provide guided practice and immediate corrective feedback.
5. Provide independent practice that produces the target output.
6. Give the rubric or self-check.
7. Add retrieval, transfer, spacing, or interleaving when it improves retention.

Keep a running set of grounded concepts. Introduce an idea before an example or
exercise depends on it. Difficulty should be low while acquiring unfamiliar
knowledge and purposeful while practicing retrieval or application.

Questions and distractors must test a real skill or plausible misconception.
Feedback should explain the reasoning, not merely label an answer correct or
incorrect. Treat professional judgment as graded when multiple answers can be
defensible under different conditions.

Match the medium to the skill. Use prose for explanation, tables or diagrams
for relationships, runnable examples for technical behavior, and interactive
controls only when interaction improves practice. Reuse established components
and templates before creating new ones.

## Verify what was built

Verification is proportional to the artifact but must cover every applicable
area:

- **Outcome alignment:** the final exercise produces the promised output and
  the rubric measures it.
- **Source integrity:** substantive claims trace to sources actually opened and
  read; uncertainty is visible.
- **Instructional quality:** prerequisites are grounded, examples are correct,
  practice is effortful, and feedback addresses likely errors.
- **Artifact integrity:** files render or execute, local links and navigation
  work, and repository validators pass.
- **Runtime and accessibility:** for interactive or visual artifacts, exercise
  every state, inspect errors, test keyboard use, and inspect appropriate
  desktop and mobile layouts.
- **Learning acceptance:** claim learner acceptance only after a fresh human
  learner completes the lesson and satisfies the rubric. An AI or author review
  is useful quality evidence but is not human learning acceptance.

Follow the repository's durable evidence convention when one exists. In
standalone mode, report checks and remaining limitations without creating an
unrequested verification subsystem.

Do not claim a check passed when it was not performed. A verification-only
request is read-only unless the user also authorizes fixes.

## Finish clearly

Report the lesson's outcome, artifact or path, principal sources, verification
performed, and any remaining gap. Distinguish author-verified readiness from
fresh-learner acceptance. For a batch, report each lesson separately and then a
roll-up based on the weakest unresolved result.
