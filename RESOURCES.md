# QA Resources

Curated sources for the 27-week QA learning plan. Knowledge for lessons is drawn
from here — not from the agent's parametric guesses.

## Knowledge

### Foundations (Weeks 1–5)

- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1 (PDF)](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf)
  The primary source for weeks 1–9. Covers test levels, test types, static
  testing, test techniques (equivalence partitioning, boundary value analysis,
  decision tables), test management, and defect reporting. Use for: QA-002
  through QA-009, and anywhere a precise definition is needed. This is the
  actual syllabus — prefer it over any summary or course page.
- [ISTQB CTFL v4.0 download index](https://istqb.org/sdm_categories/certified-tester-foundation-level-ctfl-v4-0/)
  Official listing for the syllabus, sample exams, and glossary. Use for:
  checking for a newer errata release, and pulling sample exam questions for
  retrieval practice.
- [ASTQB — syllabus section pages](https://astqb.org/5-2-risk-management/)
  The American board republishes the CTFL v4.0 syllabus section by section as
  web pages (e.g. `/5-2-risk-management/`, `/1-3-testing-principles/`). Same
  wording as the PDF, but readable and linkable. Use for: citing a specific
  section in a lesson. Note the official PDF blocks automated fetching, so this
  is the practical route to the exact text.
- [Rapid Software Testing — the RST approach (Bach & Bolton)](https://developsense.com/rst-approach)
  The main counterweight to ISTQB. Source of "quality is value to some person
  who matters", the testing-vs-checking distinction, and the framing of testing
  as discovering threats to value. Use for: the *why* behind a practice, and for
  interview answers that need to sound like a thinker rather than a syllabus.
  Read alongside ISTQB, not instead of it — the two disagree deliberately.
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

### SDLC (Weeks 5–7)

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
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
  Use for: QA-039, QA-040. Authoritative on common web risk categories.

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

## Gaps

Areas the plan needs where no strong source is yet identified:

- **Test oracles (QA-002).** The CTFL syllabus touches expected results but does
  not treat the oracle problem directly. Needs a dedicated source.
- **Exploratory testing (QA-015).** The syllabus covers it only briefly; the
  practitioner literature is much richer. Partially addressed by the Test
  Heuristics Cheat Sheet above; still needs a source on session-based test
  management and how to leave *evidence* of exploratory work (which the mission
  needs — the portfolio has to show it, not just claim it).
- **Test management tools (QA-008).** Vendor docs for TestRail/qTest/Zephyr are
  marketing-adjacent. Needs a neutral comparison, or accept vendor docs with
  that bias noted explicitly.
- **AI testing (QA-046, QA-047).** The sheet points at ISTQB certification pages
  rather than syllabi. Needs the actual CT-AI syllabus.
