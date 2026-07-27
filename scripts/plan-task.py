#!/usr/bin/env python3
"""Read task rows out of the cached plan.

    python3 scripts/plan-task.py QA-006          # human-readable block
    python3 scripts/plan-task.py QA-006 --json   # machine-readable
    python3 scripts/plan-task.py --ids           # every QA task id
    python3 scripts/plan-task.py --ids --pm      # every PM task id

The sheet's CSV export carries two junk rows before the real header, and
"What I'll do" uses a curly apostrophe. Both are handled here so nothing
else has to know.
"""

import csv
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADER_OFFSET = 2  # title row + blank row before the real header


def load(pm: bool = False) -> list[dict]:
    path = ROOT / "plan" / ("pm.csv" if pm else "qa.csv")
    if not path.exists():
        sys.exit(f"{path} missing — run ./scripts/refresh-plan.sh first")
    text = path.read_text(encoding="utf-8").split("\n")
    rows = csv.DictReader(io.StringIO("\n".join(text[HEADER_OFFSET:])))
    prefix = "PM-" if pm else "QA-"
    return [r for r in rows if (r.get("Task ID") or "").startswith(prefix)]


def get(row: dict, *names: str) -> str:
    """Fetch a column, tolerating the curly-vs-straight apostrophe."""
    for n in names:
        for key in (n, n.replace("'", "’"), n.replace("’", "'")):
            if row.get(key):
                return row[key].strip()
    return ""


def normalise(row: dict) -> dict:
    return {
        "id": get(row, "Task ID"),
        "area": get(row, "Learning area"),
        "week": get(row, "Week"),
        "focus": get(row, "Focus"),
        "learn": get(row, "What I want to learn"),
        "deliverable": get(row, "What I'll do"),
        "resource": get(row, "Resource"),
        "hours": get(row, "Est. hours"),
        "priority": get(row, "Priority"),
        "status": get(row, "Status"),
        "progress": get(row, "Progress %"),
    }


def main() -> None:
    args = sys.argv[1:]
    pm = "--pm" in args
    rows = [normalise(r) for r in load(pm)]

    if "--ids" in args:
        print("\n".join(r["id"] for r in rows))
        return

    wanted = [a.upper() for a in args if not a.startswith("--")]
    if not wanted:
        sys.exit(__doc__)

    picked = [r for r in rows if r["id"] in wanted]
    missing = set(wanted) - {r["id"] for r in picked}
    if missing:
        sys.exit(f"no such task(s): {', '.join(sorted(missing))}")

    if "--json" in args:
        print(json.dumps(picked if len(picked) > 1 else picked[0], indent=2))
        return

    for r in picked:
        print(f"{r['id']} — {r['focus']}")
        print(f"  area         {r['area']}   week {r['week']}   "
              f"{r['hours']}h   {r['priority']}   {r['status']} {r['progress']}")
        print(f"  wants        {r['learn']}")
        print(f"  DELIVERABLE  {r['deliverable']}")
        print(f"  resource     {r['resource'] or '(none)'}")
        print()


if __name__ == "__main__":
    main()
