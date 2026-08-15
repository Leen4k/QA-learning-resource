# Grounded concepts

Borrowed from the `writing-beats` skill's **grounding** rule, applied across
lessons instead of across paragraphs:

> Every concept has to be grounded before a beat can lean on it: the audience
> either walked in knowing it or met it in an earlier beat. A beat that reaches
> for an ungrounded concept loses the reader — that is the one move the journey
> can't make.

A lesson may lean on a concept only if it is a **prerequisite** below, or was
**grounded by an earlier lesson**. Anything else has to be grounded by this
lesson before it is used — or the lesson has to be reordered.

This file is the reason lessons cannot be written in parallel. The grounded set
is sequential state: lesson 12 may lean on equivalence partitioning *because*
lesson 5 grounded it. Two writers working at once cannot both know what the
other has grounded.

## The convention

The first time a lesson grounds a term, wrap it in `<dfn>`:

```html
<p>A <dfn>test oracle</dfn> is the source that tells you what the correct
   result should be.</p>
```

Then add it here under that lesson. `node scripts/check-lesson.mjs` verifies
every `<dfn>` in a lesson appears below, and that no term is grounded twice.

Retrofitting the five pre-convention lessons is not urgent — their terms are
listed here already, which is what later lessons read.

## Prerequisites

What a reader walks in with. Everything else must be grounded by a lesson.
Keep this list short: demand too much and you shut out the reader this course
is for — someone moving into QA, not someone already in it.

- Software is built by teams, shipped in versions, and sometimes broken.
- A web app has a user interface and a server behind it.
- Basic spreadsheet literacy (rows, columns, filters).
- **No** assumed programming ability until lesson 24 (Playwright), which
  grounds what it needs.

## Grounded by lesson

### Lesson 1 — Quality risk triage `QA-001`
- **Risk** `[ISTQB §5.2]` — a possible future event with a negative consequence
- **Risk likelihood** / **risk impact** — the two independent dials
- **Risk level** — the product of the two, not a single gut number
- **Product risk** vs **project risk** `[ISTQB §5.2.2]`
- **Risk-based testing** — ordering test effort by risk level
- **Risk analysis**, **risk control**, **residual risk**
- **Sampling** — testing is always a sample; the choice is how well you sample
- **Quality**, **testing vs. checking** `[RST]`

### Lesson 2 — Test levels and types `QA-005`
- **Test level** `[ISTQB §2.2.1]` — component, integration, system, acceptance
- **Test type** `[ISTQB §2.2.2]` — functional, non-functional, black-box, white-box
- **Levels and types are independent axes** — the load-bearing idea
- **Confirmation testing** vs **regression testing** `[ISTQB §2.2.3]`
- **Gray-box** — flagged as industry practice, *not* in ISTQB v4.0

### Lesson 3 — Static testing (no plan task)
- **Static testing** `[ISTQB §3.1]` — examining work products without executing
- **Dynamic testing** — the contrast
- **Review types** — informal, walkthrough, technical review, inspection
- **Defect vs failure** — static testing finds defects directly, not failures
- **Shift left** — cost of a defect rises with how late it is found

### Lesson 4 — Test oracles and expected results `QA-002`
- **Expected result** `[ISTQB §1.4.1]` — the observable outcome a tester has
  reason to anticipate after a particular action and starting condition
- **Test oracle** `[Bolton, Oracles, p.1]` — a fallible, context-dependent
  principle or mechanism used to recognise a possible problem
- **Test oracle problem** `[Barr et al. §1]` — distinguishing desired behaviour
  from behaviour that may be incorrect

### Lesson 5 — Equivalence partitioning and boundary values `QA-007`
- **Equivalence partition** `[ISTQB §4.2.1]` — a set of values expected to be
  treated the same
- **Valid** vs **invalid partition**
- **Boundary value analysis** `[ISTQB §4.2.2]` — the edges of a partition
- **Two-value** vs **three-value** boundary testing
- **Coverage** — partitions exercised ÷ partitions identified

### Lesson 6 — Decision tables and state transitions `QA-007`
- **Decision table** `[ISTQB §4.2.3]` — conditions and actions as rows, with
  each feasible combination represented by a column
- **Decision rule** — one table column: a unique condition combination and its
  resulting actions
- **State** — the current situation that matters to what the system may do next
- **State transition** `[ISTQB §4.2.4]` — a move between states initiated by an
  event
- **State table** — states as rows and events as columns, including invalid
  transitions
- **Valid transitions coverage** — valid transitions exercised ÷ valid
  transitions identified

### Lesson 7 — Test cases someone else can run `QA-007`
- **Test condition** `[ISTQB §1.4.1]` — a testable aspect identified during
  analysis; a rule, transition, risk, or other target that answers what to test
- **Test case** `[ISTQB §1.4.1, §4.5.3]` — a concrete example with the necessary
  starting state, inputs or actions, and observable expected result
- **Test procedure** `[ISTQB §1.4.1]` — cases organised into an executable order,
  including the setup, reset and cleanup needed to run them
- **Traceability** `[ISTQB §1.4.4]` — visible links from the test basis through
  conditions and cases to results and defects

### Lesson 8 — The one-page test plan `QA-006`
- **Test plan** `[ISTQB §5.1.1]` — the seven content categories
- **Entry criteria** and **exit criteria** `[ISTQB §5.1.3]`
- **Definition of ready** — the agile relative of entry criteria
- **Definition of done** — the agile relative of exit criteria
- **Teamspace** — the running worked example (B2B workspace app; Owner /
  Admin / Member / Viewer roles across a web UI and a REST API)

### Lesson 9 — Bug reports that get reproduced first try `QA-009`
- **Defect report** `[ISTQB §5.5]` — a record of an observed anomaly with the
  information needed to reproduce, resolve, track and learn from it
- **Test object** `[ISTQB §5.5]` — the product, component and exact version or
  build being tested
- **Test environment** `[ISTQB §5.5]` — the hardware, software, configuration,
  accounts and interfaces under which the observation was made
- **Severity** `[ISTQB §5.5]` — the degree of impact on stakeholder interests or
  requirements
- **Priority** `[Mozilla BMO User Guide, BugFields]` — the importance and order
  in which a fix competes with other work
- **Defect triage** `[ISTQB §5.5]` — analysing and classifying a report, then
  deciding its response and status

## Not yet grounded — needed soon

Terms later lessons will reach for. Whichever lesson gets there first grounds
them; note it here when it does.

- **Test pyramid** — lesson 23 `QA-023`; ISTQB §5.1.6
