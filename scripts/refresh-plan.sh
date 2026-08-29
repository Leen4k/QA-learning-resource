#!/usr/bin/env bash
# Refresh the local copy of the plan of record.
#
# The Google Sheet is the plan of record, but fetching it per lesson is slow
# and the export URL 307s to a signed googleusercontent URL that expires.
# Cache both tabs here so writing a lesson starts with a grep, not a fetch.
#
#   ./scripts/refresh-plan.sh          # both tabs
#   grep '^QA-006' plan/qa.csv         # read one task
#
# Re-run whenever the sheet changes (status, progress, new tasks).

set -euo pipefail

cd "$(dirname "$0")/.."

# Invalidate prior "fresh plan" evidence before any network work. A failed
# refresh must not leave the previous success looking current to lesson checks.
plan_refresh_id="$(node --input-type=module -e '
  import { randomUUID } from "node:crypto";
  import { readFileSync, writeFileSync } from "node:fs";

  let history = [];
  try {
    const previous = JSON.parse(readFileSync("plan/refresh-metadata.json", "utf8"));
    history = Array.isArray(previous.history) ? previous.history : [];
    if (
      previous.status === "success" &&
      previous.refresh_id &&
      previous.refreshed_at &&
      previous.files
    ) {
      history.push({
        refresh_id: previous.refresh_id,
        refreshed_at: previous.refreshed_at,
        files: previous.files,
      });
    }
  } catch {
    // The first refresh has no prior metadata to preserve.
  }
  history = history
    .filter(
      (snapshot, index, snapshots) =>
        snapshot?.refresh_id &&
        snapshots.findIndex(
          (candidate) => candidate?.refresh_id === snapshot.refresh_id,
        ) === index,
    )
    .slice(-100);
  const refresh_id = randomUUID();
  writeFileSync(
    "plan/refresh-metadata.json",
    `${JSON.stringify(
      {
        status: "in-progress",
        refresh_id,
        started_at: new Date().toISOString(),
        history,
      },
      null,
      2,
    )}\n`,
  );
  process.stdout.write(refresh_id);
')"

mark_plan_refresh_failed() {
  LESSON_PLAN_REFRESH_ID="$plan_refresh_id" node --input-type=module -e '
    import { readFileSync, writeFileSync } from "node:fs";

    const path = "plan/refresh-metadata.json";
    const metadata = JSON.parse(readFileSync(path, "utf8"));
    if (metadata.refresh_id === process.env.LESSON_PLAN_REFRESH_ID) {
      writeFileSync(
        path,
        `${JSON.stringify(
          { ...metadata, status: "failed", failed_at: new Date().toISOString() },
          null,
          2,
        )}\n`,
      );
    }
  '
}

trap mark_plan_refresh_failed ERR

SHEET="1OK_OvNJc1IcmwqIYT3K6PAtV7XUzX8_gBPXf9jOyQA0"
QA_GID="1651117697"
PM_GID="487507119"

mkdir -p plan

fetch() {
  local gid="$1" out="$2" label="$3"
  local url="https://docs.google.com/spreadsheets/d/${SHEET}/export?format=csv&gid=${gid}"

  # -L follows the 307 to the signed URL. --fail so an HTML error page
  # never silently overwrites a good CSV.
  if curl -sSL --fail --max-time 30 "$url" -o "${out}.tmp"; then
    # Google exports CRLF. Normalize line endings so refreshed plan evidence
    # remains diff-clean on this LF-based repository.
    sed $'s/\r$//' "${out}.tmp" > "${out}.normalized"
    mv "${out}.normalized" "$out"
    rm -f "${out}.tmp"
    # Two junk rows (sheet title, blank) precede the real header, so count
    # task ids rather than lines — otherwise the tally is silently wrong.
    printf '%-4s %s (%s tasks)\n' "$label" "$out" \
      "$(grep -c "^${label}-[0-9]" "$out" || true)"
  else
    rm -f "${out}.tmp"
    echo "FAILED to fetch ${label} tab — kept existing ${out}" >&2
    return 1
  fi
}

fetch "$QA_GID" plan/qa.csv QA
fetch "$PM_GID" plan/pm.csv PM

# Persist evidence that both cached tabs came from a successful refresh. Lesson
# verification binds to this metadata so a stale cache cannot silently claim to
# represent the current plan of record.
LESSON_PLAN_REFRESH_ID="$plan_refresh_id" node --input-type=module -e '
  import { createHash } from "node:crypto";
  import { readFileSync, statSync, writeFileSync } from "node:fs";

  const files = {};
  for (const path of ["plan/qa.csv", "plan/pm.csv"]) {
    const bytes = readFileSync(path);
    files[path] = {
      sha256: createHash("sha256").update(bytes).digest("hex"),
      modified_at: statSync(path).mtime.toISOString(),
    };
  }
  const refreshed_at = new Date().toISOString();
  const inProgress = JSON.parse(
    readFileSync("plan/refresh-metadata.json", "utf8"),
  );
  if (inProgress.refresh_id !== process.env.LESSON_PLAN_REFRESH_ID) {
    throw new Error("plan refresh metadata changed during refresh");
  }
  writeFileSync(
    "plan/refresh-metadata.json",
    `${JSON.stringify(
      {
        status: "success",
        refresh_id: inProgress.refresh_id,
        refreshed_at,
        files,
        history: inProgress.history ?? [],
      },
      null,
      2,
    )}\n`,
  );
'

trap - ERR
