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
    mv "${out}.tmp" "$out"
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
