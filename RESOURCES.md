# QA Resources

Curated sources for the 27-week QA learning plan. Knowledge for lessons is drawn
from here — not from the agent's parametric guesses.

## Knowledge

### Foundations (Weeks 1–5)

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1 (PDF)](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf)
  The primary source for most topics in weeks 1–9. Covers test levels, test
  types, static testing, test techniques (equivalence partitioning, boundary
  value analysis, decision tables), test management, and defect reporting. Use
  for: QA-003 through QA-009, and anywhere a precise definition is needed. It
  presupposes expected results in §1.4.1 but does not teach the oracle problem,
  so do not use it as the source for QA-002. This is the actual syllabus —
  prefer it over any summary or course page.

  **Plan correction:** the certification landing page named by QA-006, QA-007
  and QA-009 is the wrong document. It advertises the certification and links
  to materials, but it does not define test planning, test cases, decision
  tables, state transitions, or defect reporting. Use this PDF and the official
  sample exams instead. Rechecked 2026-08-15: the exact plan URL currently
  renders the separate CTFL Agile Tester (CTFL-AT) storefront, so an HTTP 200
  from that link is not evidence that it covers the task.

  **It is fetchable, contrary to the earlier note here (corrected 2026-07-26).**
  `curl -L` with a browser user-agent returns the full 78-page PDF; `pdftotext
  -layout` then gives clean, greppable text with section numbers intact. This is
  the only way to quote the syllabus *verbatim*, and it should be the default
  route from now on. Section 5.1 is on pages 48–50.
- [ISTQB CTFL v4.0 download index](https://istqb.org/sdm_categories/certified-tester-foundation-level-ctfl-v4-0/)
  Official listing for the syllabus, sample exams, and glossary. Use for:
  checking for a newer errata release, and pulling sample exam questions for
  retrieval practice.
- [ISTQB CTFL v4.0 Sample Exam A — questions](https://astqb.org/assets/documents/ISTQB_CTFL_Sample-Exam-Questions_v4.0.pdf)
  and [published answers](https://astqb.org/assets/documents/ISTQB_CTFL_Sample-Exam-Answers_v4.0.pdf).
  Official worked practice for the syllabus techniques. Q22 supplies a decision
  table with an impossible rule; Q23 asks for a minimal set of sequences that
  covers every valid transition. Use with §4.2.3–4.2.4 for lesson 6. The
  syllabus defines the techniques but provides no worked permissions example.
- [ASTQB — syllabus section pages](https://astqb.org/5-2-risk-management/)
  The American board republishes the CTFL v4.0 syllabus section by section as
  web pages (e.g. `/5-2-risk-management/`, `/1-3-testing-principles/`). Use for:
  giving the learner a readable, linkable destination for one section.
  **Do not use it to source a quote.** Only top-level section pages exist
  (`/5-1-test-planning/` resolves; `/5-1-1-.../` is a 404), and fetching one
  returns a *summary* of the section rather than its text — during lesson 8 it
  silently dropped four of the seven items in the §5.1.1 content list. Quote
  from the PDF; link to ASTQB.
- [Mozilla — Bug Writing Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html)
  The practical source for QA-009, verified from the live Bugzilla page on
  2026-08-15. Use with ISTQB §5.5: the syllabus supplies the report field list;
  Mozilla teaches clear summaries, precise and minimal reproduction steps,
  frequency, actual versus expected results, and the separation of observations
  from speculation. It is Mozilla-specific in its product and component fields,
  so adapt the method rather than copying the tracker vocabulary. ~12 minutes.
- [Mozilla BMO User Guide — BugFields](https://wiki.mozilla.org/BMO/UserGuide/BugFields)
  A live, concrete severity-versus-priority model for QA-009. Severity describes
  impact; priority describes importance and repair order. The S1–S4 and
  P1–P5 scales and ownership rules belong to Mozilla, not to every team;
  use them as an example of a defined local policy rather than a universal
  standard.
- [Michael Bolton — *Oracles* (PDF)](https://www.developsense.com/resource/Oracles.pdf)
  The primary practical source for QA-002, verified from the original three-page
  PDF on 2026-08-08. Defines an oracle as a fallible, context-dependent aid to
  recognising a problem; explains the HICCUPPS(F) consistency guidewords; and
  shows that oracles may be used before, during or after testing. It does not
  provide a written expected-result template or a complete worked flow, so
  lesson 4 supplies those openly. ~10 minutes.
- [Barr et al. — *The Oracle Problem in Software Testing: A Survey* (PDF)](https://discovery.ucl.ac.uk/1471263/1/06963470.pdf)
  The research authority behind QA-002, verified from the CC BY 3.0 paper on
  2026-08-08. Read §1, §2.2 Definition 2.4, §5.5, §6 and §7 for the formal
  oracle problem, partial and ambiguous textual specifications, implicit
  oracles, and the cases where a human must judge behaviour. Use for framing;
  it is an automation survey, not a method for writing expectations. ~25
  minutes for the relevant sections.
- [Michael Bolton — *What Should A Test Plan Contain?*](https://developsense.com/blog/2008/12/what-should-test-plan-contain)
  The counterweight to ISTQB §5.1 on test planning, and the source used for
  lesson 8. Written as a reply to a reader's question, so it is unusually
  concrete: a plan is "the sum or intersection of strategy and logistics" and
  "not a physical thing; it's a set of ideas"; the document should be "the very
  least expensive representation of the idea that can sufficiently store or
  communicate the idea". Also the source of Kaner's tool-vs-product heuristic,
  which is the fastest available rule for deciding how much plan to write. Use
  for: QA-006, and QA-049 (test strategy) later. ~10 minutes.
- [Rapid Software Testing — the RST approach (Bach & Bolton)](https://developsense.com/rst-approach)
  The main counterweight to ISTQB. Source of "quality is value to some person
  who matters", the testing-vs-checking distinction, and the framing of testing
  as discovering threats to value. Use for: the *why* behind a practice, and for
  interview answers that need to sound like a thinker rather than a syllabus.
  Read alongside ISTQB, not instead of it — the two disagree deliberately.
- [Michael Bolton — *You've Got Issues*](https://developsense.com/blog/2011/01/youve-got-issues)
  The practitioner counterweight for QA-009, re-read from the original post on
  2026-08-15. Locates a bug in a threat to product value for people who matter,
  and broadens a tester’s reporting mission to project issues that can hide
  risk. Use beside ISTQB §5.5 rather than blending the definitions. ~8 minutes.
- [James Bach & Aaron Hodder — *Test Cases Are Not Testing*](https://www.satisfice.com/download/test-cases-are-not-testing)
  The practitioner counterweight used in lesson 7. It argues that creating and
  executing scripted cases is not equivalent to testing, and that case counts
  are a poor measure of testing progress. Use this to keep test cases in their
  proper role: repeatable checks, handoff artifacts and regression evidence,
  not proof that investigation is complete.
- [ISO/IEC 25010 product quality model](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
  The nine quality characteristics and their sub-characteristics. Use for: a
  checklist of *axes along which a thing can fail* when generating risks or test
  ideas from a thin feature description. Also underpins non-functional test
  types (QA-035 to QA-040).
- [Test Heuristics Cheat Sheet — Hendrickson, Lyndsay & Emery](https://www.ministryoftesting.com/articles/test-heuristics-cheat-sheet)
  Compact list of test-idea generators (boundaries, CRUD, interruptions,
  starvation, sequences, multi-user…). Required reading on the BBST Test Design
  course. Use for: QA-015 exploratory testing, and any time risk brainstorming
  dries up.
- [roadmap.sh QA roadmap](https://roadmap.sh/qa)
  A structured map of the QA discipline. Good for orientation and for seeing how
  topics connect. Use for: QA-001, QA-004, QA-008 — breadth and vocabulary.
  Treat as a map, not a textbook: it is thin on depth and gives no worked
  examples.
- [TestRail — *Introduction to TestRail*](https://support.testrail.com/hc/en-us/articles/7076810203028-Introduction-to-TestRail)
  One of the three product-primary sources for QA-008, re-read from the live
  support page on 2026-08-16. Its sections on cases, sections, runs, tests and
  configuration plans define TestRail's object model. Pair it with
  [*Projects and their types*](https://support.testrail.com/hc/en-us/articles/7076923860244-Projects-and-their-types),
  whose multi-suite and migration cautions expose consequences a feature matrix
  would hide. Vendor documentation, so use for structure rather than ranking.
  ~12 minutes.
- [Tricentis qTest — *Introduction to qTest Objects*](https://docs.tricentis.com/qtest-saas/content/manager/introduction/introduction_to_qtest_objects.htm)
  One of the three product-primary sources for QA-008, re-read on 2026-08-16.
  The Test Design and Test Execution sections define the separate
  Module/Test-Case repository and Release/Cycle/Suite/Run hierarchy. qTest uses
  "Test Run" for one executed case instance, not the multi-case group TestRail
  calls a run. Vendor documentation; ~8 minutes.
- [SmartBear Zephyr — *Test Plans (overview)*](https://support.smartbear.com/zephyr/docs/en/test-plans/test-plans--overview-)
  One of the three product-primary sources for QA-008, re-read on 2026-08-16.
  It connects the Jira test library to test cycles and optional release-level
  plans. SmartBear's current documentation also confirms the naming change:
  Zephyr Scale is now Zephyr, while Zephyr Squad is Zephyr Essential. Vendor
  documentation; ~8 minutes.
- [Michael Bolton — *Breaking the Test Case Addiction, Part 1*](https://developsense.com/blog/2019/01/breaking-the-test-case-addiction-part-1)
  The practitioner counterweight for QA-008, re-read on 2026-08-16. Stored cases
  and result counts can support coordination, but they do not communicate the
  tester's risk model, investigation or omissions. Use beside the three vendor
  models so a dashboard is not mistaken for a testing story. ~10 minutes.

### SDLC (Weeks 5–7)

- [ISTQB CTFL Syllabus v4.0.1 (PDF)](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf)
  The current source used by QA-010 for testware (§1.4.3), traceability
  (§1.4.4), lifecycle impact (§2.1–§2.1.1), and the model-independent rule that
  every development activity has a corresponding test activity and test
  analysis/design starts during the matching phase (§2.1.2). It names
  Waterfall and V-model as sequential examples but does not diagram or teach
  their classic pairing. Re-read from the official PDF on 2026-08-29.
- [ISTQB CTFL Syllabus 2018 v3.1.1 (PDF)](https://istqb.org/wp-content/uploads/2024/11/ISTQB-CTFL_Syllabus_2018_v3.1.1.pdf)
  The historical model source for QA-010. §2.1.1 explicitly contrasts classic
  Waterfall with the V-model; §§2.2.1–2.2.4 list the work products used as test
  bases for component, integration, system and acceptance testing. The English
  syllabus retired on 9 May 2024, so use it for this removed model detail, not
  as current exam guidance. Re-read 2026-08-29; ~15 minutes for the relevant
  sections.
- [W. W. Royce — *Managing the Development of Large Software Systems* (PDF)](https://cse.msu.edu/~cse435/Homework/HW3/royce1970.pdf)
  The historical counterweight for QA-010. Pages 328–329 draw a staged
  development flow and immediately call the shown implementation risky because
  late testing can force disruptive redesign. Pages 332–333 argue that current
  written work provides tangible evidence of completion and supports downstream
  testing. The paper does not use the term Waterfall and must not be presented
  as endorsing iteration-free development. Re-read 2026-08-29; ~12 minutes.

  **Plan correction:** the roadmap.sh resource named by QA-010 contains only an
  SDLC Delivery Model node with Waterfall and V Model labels. It supplies no
  phases, corresponding test levels, evidence model or worked requirement
  trace. Use the three sources above instead.

- [The Scrum Guide](https://scrumguides.org/scrum-guide.html)
  The definitive, short (~13pp) source on Scrum. Use for: QA-011, where QA's
  role in a sprint is the question. Note it deliberately says little about
  testing — that absence is itself worth noticing.

### Web basics (Weeks 10–11)

- [MDN — Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
  The reference for HTML, CSS, JS, and HTTP. Use for: QA-019, QA-021, QA-022.
- [Chrome DevTools documentation](https://developer.chrome.com/docs/devtools)
  Use for: QA-020 (Elements/Console/Network/Storage) and QA-036 (Lighthouse).

### Automation & API (Weeks 12–16)

- [Playwright documentation](https://playwright.dev/docs/intro)
  Use for: QA-024 through QA-027, and the QA-050 capstone. The Locators and
  Fixtures pages are the load-bearing ones.
- [Postman Learning Center](https://learning.postman.com/docs/getting-started/quick-start/)
  Use for: QA-029 through QA-031.

### Non-functional (Weeks 18–20)

- [WebAIM — Introduction to Web Accessibility](https://webaim.org/intro/)
  Use for: QA-035. WebAIM is a high-trust, practitioner-focused source.
- [Grafana k6 — Running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
  Use for: QA-037, QA-038, QA-051.
- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
  Use for: QA-039, QA-040. Authoritative on common web risk categories.
  **The list was revised in 2025 — cite `A01:2025`, not `A01:2021`.** Current
  order: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software
  Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure
  Design, A07 Authentication Failures, A08 Software or Data Integrity Failures,
  A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional
  Conditions. Verified 2026-07-26. Note the generic project landing page does
  not carry the list; fetch `/Top10/2025/` directly.

### Supporting (Weeks 21–24)

- [Allure Report docs](https://allurereport.org/docs/) — QA-042.
- [Git tutorial (official)](https://git-scm.com/docs/gittutorial) — QA-044.
- [GitHub Actions docs](https://docs.github.com/en/actions) — QA-045.
- [Appium docs](https://appium.io/docs/en/latest/) — QA-033, QA-034.

## Wisdom (Communities)

- [Ministry of Testing — The Club](https://club.ministryoftesting.com/)
  The highest-signal, actively moderated testing forum. Discourse-based, and
  practitioners answer concrete questions readily. Use for: putting a risk
  ranking, test-case set, or bug report in front of working testers and asking
  what they would have done differently. This is the main wisdom loop for the
  mission — employers respond to judgment, and judgment needs contradiction.
  Suggested first post: a risk triage with reasoning, asking for reordering.

Not yet tried. Worth adding once used in anger: r/QualityAssurance for job-market
and interview reality-checks, which The Club covers less.

## Source dossiers (`sources/`)

`./scripts/audit-sources.sh` runs one headless Claude per plan task and writes
`sources/<TASK>.md` — what the plan's named source actually covers, the best
primary source found, what it leaves out, and where practitioners disagree.

**A dossier is a lead, not a fact.** It says *what to read and where*; it is
never quotable into a lesson. Re-read the original and cite the section number.
Promoting a dossier claim straight into a lesson is failure mode 3 in
`LESSON-RECIPE.md`.

First full pass complete, 2026-07-27 — all 52 QA tasks:

| Verdict | Count | Meaning |
|---|---|---|
| `WRONG-DOCUMENT` | 39 | Named source cannot teach the task; a real one was found |
| `PARTIAL` | 13 | Named source is real but incomplete |
| `SUFFICIENT` | 0 | — |
| `NO-SOURCE` | 0 | — |

Two findings worth more than any single lesson:

- **Not one named source fully covers its task.** Zero `SUFFICIENT`. This is the
  evidence for the recipe's rule that research runs for *every* task, not only
  the flagged gaps.
- **Every task is writable.** Nothing came back `NO-SOURCE`, including the
  capstone tasks and the fourteen that pointed at roadmap.sh. The plan's
  Resource column is wrong; the course underneath it is sound.

## The teaching skills

The lesson workflow leans on three skills from Matt Pocock's plugin, installed at
user level and deliberately **not** vendored here — `skills/` is gitignored
because it is a nested git repo, and a copy would go stale silently.

- Upstream: <https://github.com/mattpocock/skills> (version in use: 1.2.0)
- Which three, and why each earns its place: see `LESSON-RECIPE.md`.

## Gaps

Areas the plan needs where no strong source is yet identified.

**Under review as of 2026-08-16** — the audit proposes answers for the AI
testing gaps below. Those remain unverified leads in `sources/QA-046.md` and
`sources/QA-047.md`. The QA-002 test-oracle and QA-008 test-management-tool
gaps are resolved above after reading the original sources.
- **Exploratory testing (QA-015).** The syllabus covers it only briefly; the
  practitioner literature is much richer. Partially addressed by the Test
  Heuristics Cheat Sheet above; still needs a source on session-based test
  management and how to leave *evidence* of exploratory work (which the mission
  needs — the portfolio has to show it, not just claim it).
- **AI testing (QA-046, QA-047).** The sheet points at ISTQB certification pages
  rather than syllabi. Needs the actual CT-AI syllabus.
