---
lesson: "11"
task: "QA-010"
status: "implementation-verified-learning-acceptance-pending"
verified: "2026-08-29"
artifact_sha256: "21a96e289beae14f9b5fa7fdf1e55f3dc100a60686d355700170c2d5ca32e7a7"
plan_source: "refreshed"
plan_sha256: "ade48be34109c531054f8215f818dc32a34796bb0672f31ba006f04e3acee740"
plan_modified: "2026-08-29T05:51:27.924Z"
plan_authorization: "not-required"
plan_refresh_id: "d281791c-9edd-4506-9fcb-3008cb768941"
---

# Lesson 11 verification

## Outcome contract

Plan row: QA-010
Plan deliverable: Trace one requirement through the V-model and note the evidence produced at each stage.
Target skill: Build a requirement-to-evidence trace using a stated four-pair reference V, while choosing each test level by its primary test object and objective rather than treating the diagram as universal.
Learner output: A completed nine-stage trace for supplied requirement TS-EXP-01, from user need and system/design work products through one implementation anchor and recorded component, integration, system, and acceptance evidence.
Completion conditions: One stable requirement ID anchors the trace; each pairing fits the stated reference V or is defended by a different object and objective; each stage names a concrete supplied work product or result; planned testware stays distinct from recorded observations; links support a coverage or change-impact conclusion; the learner states the model limitation.
Prerequisites: Test levels from Lesson 2; expected results from Lesson 4; test cases and traceability from Lesson 7; test plans and entry/exit criteria from Lesson 8; test results and defect evidence from Lessons 9–10. The supplied packet removes any need to write code or invent architecture and execution records.
Final exercise: Trace the supplied Teamspace member-export requirement and training evidence packet through four development stages, an implementation anchor, and four corresponding test levels in the editable worksheet, then use the observable self-check.

## Assessment rubric

- Required: Uses TS-EXP-01 as the anchor and preserves it or an explicit derived ID through every stage.
- Required: Pairs artifacts consistently with this lesson's reference V, or explains a different primary test object and objective.
- Required: Names a concrete reviewed work product and planned testware on the descending side instead of vague phase labels.
- Required: Uses only the supplied recorded observations on the ascending side, keeps expected and observed results distinct, and names the shared build.
- Required: Explains one coverage or change-impact conclusion supported by the trace.
- Required: States that the V-model is a planning and traceability model, not proof that real work proceeds without iteration.

## Claim ledger

| Claim | Lesson location | Source | Exact location | Support summary | Qualification | Status |
|---|---|---|---|---|---|---|
| An SDLC model relates development phases logically and chronologically. | Section 1 | ISTQB CTFL Syllabus v4.0.1 | §2.1, p. 24 | Defines an SDLC model and names sequential models including waterfall and V-model. | The current syllabus names but does not diagram either model. | Supported |
| In sequential models, testers can review and design early, while executable code and dynamic testing usually arrive later. | Section 1 | ISTQB CTFL Syllabus v4.0.1 | §2.1.1, p. 24 | Describes typical test work and timing in sequential development. | Describes a typical pattern, not an unavoidable rule. | Supported |
| Good testing pairs development activities with test activities and begins test analysis/design during the corresponding development phase. | Sections 1–2 | ISTQB CTFL Syllabus v4.0.1 | §2.1.2, pp. 24–25 | Lists both practices explicitly. | Applies independently of the chosen SDLC; the V diagram is the lesson's teaching representation. | Supported |
| Classic Waterfall completes development activities one after another and places test activity after the other development activities; the V-model integrates test work and pairs test levels with development phases. | Section 1 | ISTQB CTFL Syllabus 2018 v3.1.1 | §2.1.1, p. 28 | Gives the explicit Waterfall/V-model contrast. | This syllabus retired in 2024; the lesson identifies it as historical, while current v4.0.1 supplies the still-current testing practices. | Supported |
| Test levels have distinct objectives, test bases, test objects, typical defects, approaches, and responsibilities. | Sections 2–3 | ISTQB CTFL Syllabus 2018 v3.1.1 | §2.2, p. 30 | Lists the attributes used to reason about a V-model trace. | Levels can be combined, reorganized, overlapped, or repeated. | Supported |
| Detailed design/code, architecture/interfaces, system requirements, and business/user requirements can serve as bases for component, integration, system, and acceptance testing respectively. | Sections 2–4 | ISTQB CTFL Syllabus 2018 v3.1.1 | §§2.2.1–2.2.4, pp. 31–38 | Each section lists example work products used as the test basis for that level. | These are examples, so the lesson labels them a reference V and permits justified contextual mappings. | Qualified |
| Testware includes planned, designed, implemented, executed, and completion work products such as cases, procedures, logs, defect reports, and completion reports. | Sections 2–4 | ISTQB CTFL Syllabus v4.0.1 | §1.4.3, pp. 19–20 | Enumerates outputs from the test activities. | Decisions use test evidence but are not presented as an ISTQB testware category. | Qualified |
| Traceability connects test basis elements, testware, results, and defects and supports coverage and change-impact analysis. | Sections 2 and 5 | ISTQB CTFL Syllabus v4.0.1 | §1.4.4, p. 20 | States the chain and the coverage/change-impact uses. | Trace depth should serve the question; a direct acceptance link can answer a narrower question. | Qualified |
| Royce's staged implementation figure was followed immediately by a warning that the described implementation was risky and invited failure. | Historical caveat and Recall 3 | W. W. Royce, “Managing the Development of Large Software Systems” | pp. 328–329, Figure 2 and following paragraph | The paper describes the late-testing feedback problem and major redesign risk. | Royce did not use the term “waterfall” or define the reference V pairings. | Supported |
| Royce treated current written documentation as tangible evidence of completion and connected it to downstream testing and operations. | Historical caveat | W. W. Royce, “Managing the Development of Large Software Systems” | pp. 332–333, Step 2 and Figure 6 | Explains why written descriptions and a documentation plan matter. | The paper's document volume is context-specific and is not prescribed by this lesson. | Supported |

## Question and misconception review

Tested skill: Pairing work products to test levels by primary object and objective; distinguishing planned testware from recorded execution evidence; locating test design in time; using traceability for change impact; recognizing the one-pass Waterfall caveat.
Correct reasoning: A V trace follows stated relationships: tests derive from named bases, planning can precede execution, result records link to the same build, and a change can be followed across the chain. The reference pairs are contextual examples, not universal ownership rules.
Distractor misconception: Familiar artifact names alone determine a level; only right-arm results count as evidence; test design waits for code; one passed acceptance check answers every traceability question; Royce's staged figure is his unqualified recommended end state.
Corrective takeaway: Pair by the object and objective each level addresses, preserve links from basis through case and result to the build, start analysis/design with the matching development work, and treat the diagram as a traceability aid rather than literal project history.
Judgment type: Binary for the deliberately fixed training context and cited timing claim; graded for learner-authored relationships and conclusions when an alternate mapping states a defensible object and objective.

## Files changed

- `lessons/11-waterfall-and-v-model.html` — lesson, classification practice, worked trace, supplied evidence packet, retrieval practice, and editable deliverable.
- `assets/classify.js`, `assets/quiz.js`, and `assets/lesson.css` — selected-category feedback, live-region/name semantics, and print-safe worksheet layout.
- `lessons/10-where-test-cases-live.html`, `index.html`, and `curriculum.html` — previous/next and course navigation wiring.
- `GROUNDED.md`, `RESOURCES.md`, `reference/glossary.html`, and `NOTES.md` — terminology, source, reference, progress, and verification documentation.
- `plan/qa.csv`, `plan/pm.csv`, and `plan/refresh-metadata.json` — refreshed plan-of-record cache and provenance.
- `verification/lessons/11-waterfall-and-v-model.md` — durable contract, source ledger, reviewer findings, and gate evidence.
- `verification/evidence/11-waterfall-and-v-model/` — inspected desktop, mobile, worksheet, print, and accessibility evidence.

## Source integrity

Primary sources opened: ISTQB CTFL v4.0.1 §§1.4.3–1.4.4 and §§2.1–2.1.2; ISTQB CTFL 2018 v3.1.1 §§2.1.1 and 2.2–2.2.4; Royce 1970 pp. 328–333.
Claims qualified or removed: The lesson labels the four mappings a contextual reference V, removes the claim that decisions are ISTQB testware, scopes direct acceptance traceability by its question, and says Royce neither coined Waterfall nor defined the V pairings. The retired syllabus remains explicitly historical.
Link verification: Playwright browser requests opened five unique external destinations on 2026-08-29; roadmap.sh, the official ISTQB retirement page, both direct ISTQB PDFs, and the MSU-hosted Royce PDF all returned HTTP 200 with the expected HTML or PDF content type. All seven unique local destinations opened with the expected page title.

## Static verification

Command: node scripts/check-lesson.mjs lessons/11-waterfall-and-v-model.html
Exit code: 0
Errors: 0
Warnings: 0
Result: Pass — the target lesson is clean.

Command: node scripts/check-lesson.mjs
Exit code: 0
Errors: 0
Warnings: 5 accepted pre-convention `<dfn>` warnings, exactly matching `verification/accepted-static-warnings.md`.
Result: Pass — all 11 lessons checked with no errors and no new warnings.

Command: node scripts/check-lesson-verification.mjs lessons/11-waterfall-and-v-model.html
Exit code: 0
Errors: 0
Warnings: 5 accepted full-course warnings reported by the nested baseline check; 0 new warnings.
Result: Pass — deterministic plan, fingerprint, record, screenshot, navigation, and warning-baseline evidence agrees.

## Runtime verification

Opened: file:///Users/wathnakchhay/QA-learning-resource/lessons/11-waterfall-and-v-model.html

| Check | Environment | Result | Evidence or notes |
|---|---|---|---|
| Lesson opened through `file://` | Chromium via Playwright | Pass | Title loaded; 8 classification items, 3 quizzes, and 27 named editable textboxes initialized. |
| Correct feedback paths | Chromium via Playwright | Pass | All 8 reference classifications produced 8 hits; every correct quiz option produced visible corrective feedback. |
| Incorrect feedback paths | Chromium via Playwright | Pass | A deliberately wrong classification run produced 6 misses and selected-category feedback; all 9 incorrect quiz paths revealed the chosen misconception and correct answer. |
| Graded feedback paths | Chromium via Playwright | Pass | Classification feedback distinguishes the selected level's object/goal from the reference answer for every miss. |
| Retry and reset | Chromium via Playwright | Pass | Clear reset all 8 selections, verdicts, summary, and disabled state; a new keyboard selection then worked. Quizzes intentionally lock one retrieval attempt until reload. |
| Console errors | Chromium console | Pass | Across classification, 12 quiz paths, worksheet editing, navigation, and reloads: 0 console messages and 0 page errors. |
| Keyboard navigation | Keyboard only | Pass | Space activated classification; Enter activated quiz/check controls; Tab moved between all 27 labelled textboxes and escaped the final control; Shift+Tab moved backward; no trap. |
| Desktop layout | Chromium 1440 × 900 | Pass | No document overflow; visually inspected `verification/evidence/11-waterfall-and-v-model/desktop.png` and `verification/evidence/11-waterfall-and-v-model/desktop-deliverable.png`. |
| Mobile layout | Chromium 390 × 844 | Pass | No document overflow; wide evidence and worksheet tables remain inside intentional horizontal scrollers; interaction passed; visually inspected `verification/evidence/11-waterfall-and-v-model/mobile.png` and `verification/evidence/11-waterfall-and-v-model/mobile-worksheet.png`. |
| Source links | Chromium browser requests | Pass | Five unique external destinations returned 200 and all seven local destinations opened successfully; every external link carries an exact locator and access date. |

Console: 0 messages and 0 page errors across the exhaustive Lesson 11 pass. A shared-widget regression opened all 11 lessons, activated the first quiz and classifier where present, and reported 11/11 passes with no page errors.
Keyboard: Native focus outlines were visible; controls activated by Space/Enter; textbox labels and logical Tab order were confirmed; feedback uses polite status regions.
Desktop: `verification/evidence/11-waterfall-and-v-model/desktop.png` is a visually inspected 1440 × 900 PNG; the deliverable view also rendered without clipping.
Mobile: `verification/evidence/11-waterfall-and-v-model/mobile.png` is a visually inspected 390 × 844 PNG; the document stays at 390 px while wide tables scroll within 342 px containers.
Source links: Five external and seven local destinations passed; direct sources expose locator/access-date metadata in the lesson.

Print handoff: At an 816 × 1056 print viewport, the worksheet, parent, and scroll widths were all 816 px with `min-width: 0` and fixed layout. `verification/evidence/11-waterfall-and-v-model/print-worksheet.png` was visually inspected; all five columns and nine stages remain visible.

## Independent quality review

Reviewer type: Clean-context independent AI source/instructional reviewer, followed by a bounded read-only re-review after revision; not a human learner.
Result: Pass — the reviewer initially found invented-evidence, universal-mapping, worked-trace, prerequisite, accessibility, testware, quiz-order, corrective-feedback, and handoff problems. The supplied fixture packet, contextual reference wording, build-bound result IDs, plain-language component framing, labelled worksheet/table/live-region semantics, corrected source claim, moved caveat, selected-category feedback, and print handoff resolved the implementation blockers. Re-review found no remaining source or instructional blockers and explicitly recommended PASS, with runtime/accessibility and human acceptance kept separate.

## Learning acceptance

Reviewer type: No actual fresh human learner was available during authoring.
Prerequisite profile: Required profile is a learner who completed Lessons 2, 4, and 7–10 and has not read or authored Lesson 11.
Deliverable produced: No fresh-human deliverable exists; the editable nine-stage worksheet is ready for the learner.
Rubric result: Not evaluated against a fresh-human artifact.
Difficulties encountered: Unknown until a fresh learner attempts the supplied packet and explains the resulting trace.
Revisions made: Independent AI review caused substantial instructional revisions, but those revisions do not substitute for learning acceptance.
Acceptance result: PENDING

## Gate summary

| Gate | Result | Evidence |
|---|---|---|
| Outcome alignment | Pass | Exact QA-010 deliverable and observable rubric bind the lesson to a supplied nine-stage trace. |
| Source integrity | Pass | Primary sections were opened, historical sources are labelled, claims are qualified, and all source destinations returned 200. |
| Instructional quality | Pass | Independent re-review accepted the revised evidence packet, contextual mapping, worked example, practice, feedback, and capstone. |
| Repository completeness | Pass | Navigation, curriculum, glossary, source registry, grounding ledger, notes, and static warning baseline agree. |
| Runtime verification | Pass | Exhaustive classification/quiz paths, reset, keyboard, semantics, console, responsive layouts, print handoff, and links passed. |
| Learning acceptance | Pending | No actual fresh human learner has completed and defended the deliverable. |

## Final status

IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING

## Remaining risks

The remaining risk is pedagogical rather than an implementation defect: an actual fresh human learner still needs to complete the nine-stage trace, explain one coverage or change-impact conclusion, and satisfy the rubric. Screen-reader semantics were inspected in the browser DOM, but no human assistive-technology session was available.
