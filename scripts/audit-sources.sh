#!/usr/bin/env bash
#
# audit-sources.sh — fan out one headless Claude per task to answer the five
# research questions from LESSON-RECIPE.md, writing a dossier to sources/<TASK>.md.
#
#   ./scripts/audit-sources.sh --dry-run       # list what would run
#   ./scripts/audit-sources.sh                 # every QA task without a dossier
#   ./scripts/audit-sources.sh QA-006 QA-007   # named tasks only
#   ./scripts/audit-sources.sh --jobs 6        # more concurrency (default 4)
#   ./scripts/audit-sources.sh --force QA-006  # redo one
#   ./scripts/audit-sources.sh --pm            # the PM plan instead
#
# WHY THIS PARALLELISES CLEANLY AND LESSON-WRITING DOES NOT:
# each audit is independent, writes exactly one file nobody else touches, and
# produces a short output that is cheap to verify. Lesson writing is the
# opposite — it mutates index.html, curriculum.html, RESOURCES.md and the
# previous lesson's "Next" link, and its quality bar demands spacing callbacks
# to the lesson written just before it. Parallel writers cannot do that.
#
# WHAT THIS IS NOT: lesson content. Nothing here may be quoted into a lesson
# without re-reading the original — research output is a lead, not a fact.
# The dossier says WHAT TO READ and WHERE, so the sequential writing pass is
# fast and grounded rather than exploratory.

set -euo pipefail
cd "$(dirname "$0")/.."

# ------------------------------------------------------------ one task mode
# Invoked by the fan-out below as: "$0" --audit-one QA-006
if [ "${1:-}" = "--audit-one" ]; then
  task="$2"
  out="sources/${task}.md"
  log="sources/.${task}.log"

  if ! row="$(python3 scripts/plan-task.py "$task" 2>/dev/null)"; then
    printf 'SKIP  %-8s not in plan\n' "$task"
    exit 0
  fi

  prompt="You are auditing ONE task in a QA learning plan. You are NOT writing a lesson.

${row}

KNOWN ACCESS ROUTES — use these rather than rediscovering them. Each cost a
previous run several wasted turns:
- istqb.org and glossary.istqb.org return 403 to automated fetches. The CTFL
  v4.0.1 syllabus PDF is still readable via curl with a browser user-agent,
  then pdftotext -layout. Quote from the PDF; link the reader to the ISTQB page.
- ASTQB section pages return a *summary*, not the syllabus text — for §5.1.1 it
  silently dropped four of seven items in the test-plan content list. Never
  quote ASTQB as if it were the syllabus. Sub-section URLs do not exist.
- roadmap.sh is a node graph with no prose. Its per-node blurbs are 2-4
  sentences from its content repo. If the plan names it, the verdict is almost
  certainly WRONG-DOCUMENT; spend your effort on question (b) instead.

Answer these five questions, then write the result to ${out} and nothing else.

a. Does the source on the 'resource' line above actually cover this learning
   goal AND leave a learner able to produce the DELIVERABLE? Fetch it and look.
   Quote the part that does, or state plainly that it does not. Be blunt: a
   roadmap page or a certification landing page teaches nothing, and saying so
   is the most valuable answer you can give.
b. What is the single best PRIMARY source on this topic, if not the one named?
   Prefer free, stable, authoritative documents (the ISTQB CTFL v4.0 syllabus
   PDF, official project docs, a standards body) over blog posts. Give the exact
   URL and the exact section numbers or headings covering this task.
c. What does that primary source leave out that a learner still needs?
d. Is there a credible practitioner view that disagrees with it? For QA, Rapid
   Software Testing (Bach & Bolton) often disagrees with ISTQB — name the
   disagreement rather than blending the two into a mush.
e. Are there worked examples, exercises, or real defect stories worth adapting?

Write ${out} in exactly this format:

# ${task} — <focus>

> Dossier, not lesson content. Every claim below must be re-read at source
> before it ships in a lesson.

- **Verdict:** SUFFICIENT | PARTIAL | WRONG-DOCUMENT | NO-SOURCE
- **Named source:** <url from the plan>
- **Best primary source:** <title> — <url>
- **Exact sections to read:** <e.g. ISTQB CTFL v4.0 §4.2.1-4.2.3>
- **Read time:** ~<n> min

## a. Does the named source cover this?
## b. Best primary source
## c. What it leaves out
## d. Credible disagreement
## e. Worked examples worth adapting
## Verbatim quotes
<short quotes with section numbers, so the writing pass can verify fast>

Rules:
- NO-SOURCE is a legitimate and useful verdict. Do not invent a source to avoid
  it, and do not pad a thin source into a PARTIAL.
- Never write from memory. If you did not fetch it this session, do not claim it.
- Keep the file under 150 lines."

  if claude -p "$prompt" \
      --allowedTools WebFetch WebSearch Read Write \
      --permission-mode acceptEdits >/dev/null 2>"$log"; then
    if [ -f "$out" ]; then
      verdict="$(sed -n 's/.*\*\*Verdict:\*\* *//p' "$out" | head -1)"
      printf 'ok    %-8s %s\n' "$task" "${verdict:-?}"
      rm -f "$log"
    else
      printf 'EMPTY %-8s wrote no file (see %s)\n' "$task" "$log"
    fi
  else
    printf 'FAIL  %-8s (see %s)\n' "$task" "$log"
  fi
  exit 0
fi

# ------------------------------------------------------------------- flags
JOBS=4
FORCE=0
DRY=0
PM_FLAG=""
TASKS=""

while [ $# -gt 0 ]; do
  case "$1" in
    --jobs)    JOBS="$2"; shift 2 ;;
    --force)   FORCE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    --pm)      PM_FLAG="--pm"; shift ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    -*)        echo "unknown flag: $1" >&2; exit 2 ;;
    *)         TASKS="$TASKS $1"; shift ;;
  esac
done

mkdir -p sources

[ -z "$TASKS" ] && TASKS="$(python3 scripts/plan-task.py --ids $PM_FLAG | tr '\n' ' ')"

TODO=""
have=0
for t in $TASKS; do
  if [ $FORCE -eq 0 ] && [ -f "sources/${t}.md" ]; then
    have=$((have + 1))
    continue
  fi
  TODO="$TODO $t"
done

count=$(echo $TODO | wc -w | tr -d ' ')
if [ "$count" -eq 0 ]; then
  echo "nothing to do — ${have} dossier(s) already exist (use --force to redo)"
  exit 0
fi

echo "${count} task(s) to audit, ${JOBS} at a time (${have} already done):"
echo " $TODO" | fold -s -w 76 | sed 's/^/ /'
[ $DRY -eq 1 ] && exit 0

echo
printf '%s\n' $TODO | xargs -P "$JOBS" -I{} "$0" --audit-one {}

echo
echo "--- verdicts ---"
sed -n 's/.*\*\*Verdict:\*\* *//p' sources/*.md 2>/dev/null \
  | sort | uniq -c | sort -rn
echo
echo "Read the NO-SOURCE and WRONG-DOCUMENT dossiers yourself before trusting"
echo "any of them, then write lessons sequentially with /lesson."
