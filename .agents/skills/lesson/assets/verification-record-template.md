---
lesson: "NN"
task: "QA-NNN"
status: "implementation-verified-learning-acceptance-pending"
verified: "YYYY-MM-DD"
artifact_sha256: "{{COMBINED ARTIFACT FINGERPRINT}}"
plan_source: "refreshed"
plan_sha256: "{{PLAN/QA.CSV SHA-256}}"
plan_modified: "{{ISO UTC TIMESTAMP FROM REFRESH METADATA}}"
plan_authorization: "not-required"
plan_refresh_id: "{{REFRESH_ID FROM REFRESH METADATA}}"
---

# Lesson NN verification

## Outcome contract

Plan row: QA-NNN
Plan deliverable: {{EXACT WHAT I'LL DO TEXT}}
Target skill: {{ONE PERFORMABLE SKILL}}
Learner output: {{ARTIFACT, DECISION, ANALYSIS, EXPLANATION, OR ACTION}}
Completion conditions: {{OBSERVABLE SUCCESS CONDITIONS}}
Prerequisites: {{GROUNDED CONCEPTS OR SKILLS}}
Final exercise: {{TASK THAT PRODUCES THE PLAN DELIVERABLE}}

## Assessment rubric

- Required: {{OBSERVABLE CRITERION}}
- Required: {{OBSERVABLE CRITERION}}
- Required: {{OBSERVABLE CRITERION}}

## Claim ledger

| Claim | Lesson location | Source | Exact location | Support summary | Qualification | Status |
|---|---|---|---|---|---|---|
| {{CLAIM}} | {{SECTION/EXAMPLE}} | {{PRIMARY SOURCE}} | {{HEADING/CLAUSE/ANCHOR}} | {{SUPPORT}} | {{LIMITS OR NONE}} | Supported |

## Question and misconception review

Tested skill: {{SKILL OR MISCONCEPTION TESTED}}
Correct reasoning: {{WHY THE CORRECT RESPONSE IS CORRECT}}
Distractor misconception: {{EACH PLAUSIBLE BEGINNER ERROR}}
Corrective takeaway: {{PRINCIPLE THE LEARNER SHOULD RETAIN}}
Judgment type: {{BINARY OR GRADED, WITH CONDITIONS}}

## Files changed

- `{{PATH}}` — {{REASON}}

## Source integrity

Primary sources opened: {{SOURCES AND PRECISE LOCATIONS}}
Claims qualified or removed: {{CLAIMS AND REASON, OR NONE}}
Link verification: {{DATE, DESTINATIONS CHECKED, AND RESULT}}

## Static verification

Command: node scripts/check-lesson.mjs lessons/NN-slug.html
Exit code: 0
Errors: 0
Warnings: 0
Result: Pass

Command: node scripts/check-lesson.mjs
Exit code: 0
Errors: 0
Warnings: {{ACCEPTED BASELINE COUNT}}
Result: Pass

Command: node scripts/check-lesson-verification.mjs lessons/NN-slug.html
Exit code: 0
Errors: 0
Warnings: {{ACCEPTED BASELINE COUNT}}
Result: Pass

## Runtime verification

Opened: file:///absolute/path/to/lessons/NN-slug.html

| Check | Environment | Result | Evidence or notes |
|---|---|---|---|
| Lesson opened through `file://` | Browser | Pass/Fail/Blocked | {{EVIDENCE}} |
| Correct feedback paths | Browser | Pass/Fail/Blocked | {{EVIDENCE}} |
| Incorrect feedback paths | Browser | Pass/Fail/Blocked | {{EVIDENCE}} |
| Graded feedback paths | Browser | Pass/Fail/Blocked | {{EVIDENCE OR NOT APPLICABLE}} |
| Retry and reset | Browser | Pass/Fail/Blocked | {{EVIDENCE OR NOT APPLICABLE}} |
| Console errors | Browser console | Pass/Fail/Blocked | {{EVIDENCE}} |
| Keyboard navigation | Keyboard only | Pass/Fail/Blocked | {{EVIDENCE}} |
| Desktop layout | 1440 × 900 | Pass/Fail/Blocked | `verification/evidence/NN-slug/desktop.png` |
| Mobile layout | 390 × 844 | Pass/Fail/Blocked | `verification/evidence/NN-slug/mobile.png` |
| Source links | Browser | Pass/Fail/Blocked | {{DESTINATIONS CHECKED}} |

Console: {{RESULT AND EVIDENCE}}
Keyboard: {{RESULT AND EVIDENCE}}
Desktop: {{RESULT AND INSPECTED SCREENSHOT}}
Mobile: {{RESULT AND INSPECTED SCREENSHOT}}
Source links: {{RESULT AND INTENDED DESTINATIONS}}

## Independent quality review

Reviewer type: {{CLEAN-CONTEXT AGENT, SUBJECT-MATTER EXPERT, OR UNAVAILABLE}}
Result: {{FINDINGS, REVISIONS, AND RESULT}}

## Learning acceptance

Reviewer type: {{ACTUAL FRESH HUMAN LEARNER, SELF-REVIEW, OR UNAVAILABLE}}
Prerequisite profile: {{NON-SENSITIVE RELEVANT BACKGROUND}}
Deliverable produced: {{ARTIFACT OR PENDING}}
Rubric result: {{CRITERION-BY-CRITERION RESULT OR PENDING}}
Difficulties encountered: {{OBSERVATIONS OR PENDING}}
Revisions made: {{CHANGES FROM ACCEPTANCE OR NONE}}
Acceptance result: {{PASS, FAIL, OR PENDING}}

## Gate summary

| Gate | Result | Evidence |
|---|---|---|
| Outcome alignment | Pass/Fail/Blocked | {{EVIDENCE}} |
| Source integrity | Pass/Fail/Blocked | {{EVIDENCE}} |
| Instructional quality | Pass/Fail/Blocked | {{EVIDENCE}} |
| Repository completeness | Pass/Fail/Blocked | {{EVIDENCE}} |
| Runtime verification | Pass/Fail/Blocked | {{EVIDENCE}} |
| Learning acceptance | Pass/Fail/Blocked/Pending | {{EVIDENCE}} |

## Final status

{{EXACTLY ONE APPROVED COMPLETION STATUS}}

## Remaining risks

{{REMAINING RISKS, OR `NONE IDENTIFIED.`}}
