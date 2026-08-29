#!/usr/bin/env node
/*
 * check-lesson-verification.mjs — deterministic evidence gate for new or
 * re-verified lessons.
 *
 *   node scripts/check-lesson-verification.mjs --fingerprint lessons/11-foo.html
 *   node scripts/check-lesson-verification.mjs lessons/11-foo.html
 *
 * The ordinary lesson checker verifies HTML plumbing. This checker binds the
 * verification record to the plan row, lesson, and local CSS/JS dependencies,
 * checks durable record structure and NOTES agreement, enforces precise external
 * source locators, and compares the full-course warning output to the accepted
 * baseline.
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  statSync,
} from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LESSON_CHECKER = resolve(ROOT, "scripts/check-lesson.mjs");
const WARNING_BASELINE = resolve(
  ROOT,
  "verification/accepted-static-warnings.md",
);

const args = process.argv.slice(2);
const fingerprintOnly = args[0] === "--fingerprint";
const targetArg = fingerprintOnly ? args[1] : args[0];

if (!targetArg || args.length !== (fingerprintOnly ? 2 : 1)) {
  console.error(
    "usage: check-lesson-verification.mjs [--fingerprint] lessons/NN-slug.html",
  );
  process.exit(2);
}

const lessonPath = resolve(ROOT, targetArg);
const lessonRel = relative(ROOT, lessonPath);
if (
  lessonRel.startsWith("..") ||
  !lessonRel.startsWith(`lessons/`) ||
  !lessonRel.endsWith(".html") ||
  !existsSync(lessonPath)
) {
  console.error(`invalid or missing lesson path: ${targetArg}`);
  process.exit(2);
}

const html = readFileSync(lessonPath, "utf8");
const planTags = [
  ...html.matchAll(
    /<p\b[^>]*class\s*=\s*"[^"]*\bplan-tag\b[^"]*"[^>]*>([\s\S]*?)<\/p\s*>/g,
  ),
];
if (planTags.length !== 1) {
  console.error(`lesson must contain exactly one .plan-tag; found ${planTags.length}`);
  process.exit(1);
}
const planTagTasks = [...new Set(planTags[0][1].match(/\bQA-\d{3}\b/g) ?? [])];
const documentedNoTask =
  planTagTasks.length === 0 && /\bno matching task\b/i.test(planTags[0][1]);
if (planTagTasks.length > 1 || (planTagTasks.length === 0 && !documentedNoTask)) {
  console.error(
    ".plan-tag must contain exactly one QA task identifier or the documented no matching task exception",
  );
  process.exit(1);
}
const taskId = documentedNoTask ? "NO-TASK" : planTagTasks[0];
const planPath = resolve(ROOT, "plan/qa.csv");
const planBytes = readFileSync(planPath);
const planSha256 = createHash("sha256").update(planBytes).digest("hex");
const planRow = documentedNoTask
  ? `NO-TASK,${planTags[0][1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`
  : planBytes
      .toString("utf8")
      .split("\n")
      .find((line) => line.startsWith(`${taskId},`));
if (!planRow) {
  console.error(`plan row not found for ${taskId}`);
  process.exit(1);
}
const localCodeRefs = [
  ...html.matchAll(/(?:href|src)\s*=\s*"([^"]+\.(?:css|js)(?:#[^"]*)?)"/g),
]
  .map((match) => match[1].split("#")[0])
  .filter((ref) => !/^(?:https?:|data:)/.test(ref))
  .map((ref) => resolve(dirname(lessonPath), ref))
  .sort();

function artifactFingerprint() {
  const hash = createHash("sha256");
  hash.update(`lesson\0${lessonRel}\0`);
  hash.update(readFileSync(lessonPath));
  hash.update(`\0plan-row\0${taskId}\0${planRow}\0`);
  for (const dependency of localCodeRefs) {
    if (!existsSync(dependency)) {
      console.error(`missing fingerprint dependency: ${relative(ROOT, dependency)}`);
      process.exit(1);
    }
    hash.update(`\0dependency\0${relative(ROOT, dependency)}\0`);
    hash.update(readFileSync(dependency));
  }
  return hash.digest("hex");
}

const currentFingerprint = artifactFingerprint();
if (fingerprintOnly) {
  console.log(currentFingerprint);
  process.exit(0);
}

const errors = [];
const requireCondition = (condition, message) => {
  if (!condition) errors.push(message);
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const lessonName = basename(lessonPath, ".html");
const lessonNumber = lessonName.match(/^(\d+)-/)?.[1]?.replace(/^0+(?=\d)/, "");
const recordPath = resolve(
  ROOT,
  `verification/lessons/${lessonName}.md`,
);
const recordRel = relative(ROOT, recordPath);

requireCondition(Boolean(lessonNumber), "lesson filename has no numeric prefix");
if (!existsSync(recordPath)) {
  console.error(`verification failed for ${lessonRel}`);
  console.error(`  ERROR missing verification record: ${recordRel}`);
  process.exit(1);
}

let record = "";
let frontmatter = "";
if (existsSync(recordPath)) {
  record = readFileSync(recordPath, "utf8");
  frontmatter = record.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
  requireCondition(Boolean(frontmatter), "verification record has no frontmatter");
}

const yamlField = (name) =>
  frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1]?.trim();

const recordLesson = yamlField("lesson");
const recordTask = yamlField("task");
const recordStatus = yamlField("status");
const recordDate = yamlField("verified");
const recordFingerprint = yamlField("artifact_sha256");
const recordPlanSource = yamlField("plan_source");
const recordPlanSha256 = yamlField("plan_sha256");
const recordPlanModified = yamlField("plan_modified");
const recordPlanAuthorization = yamlField("plan_authorization");
const recordPlanRefreshId = yamlField("plan_refresh_id");
const allowedStatuses = new Set([
  "complete-verified-and-accepted",
  "implementation-verified-learning-acceptance-pending",
  "incomplete-revision-required",
  "blocked-verification-not-possible",
]);

requireCondition(recordLesson === lessonNumber, "record lesson number does not match filename");
requireCondition(recordTask === taskId, "record task does not match lesson plan tag");
requireCondition(allowedStatuses.has(recordStatus), "record has an invalid status slug");
requireCondition(/^\d{4}-\d{2}-\d{2}$/.test(recordDate ?? ""), "record has an invalid verified date");
requireCondition(
  recordFingerprint === currentFingerprint,
  `artifact fingerprint is stale; expected ${currentFingerprint}`,
);
requireCondition(
  recordPlanSource === "refreshed" || recordPlanSource === "authorized-cache",
  "record plan_source must be refreshed or authorized-cache",
);
requireCondition(
  recordPlanSha256 === planSha256,
  `record plan_sha256 is stale; expected ${planSha256}`,
);
requireCondition(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(
    recordPlanModified ?? "",
  ),
  "record plan_modified must be an ISO UTC timestamp",
);

if (recordPlanSource === "refreshed") {
  requireCondition(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      recordPlanRefreshId ?? "",
    ),
    "refreshed plan provenance requires a UUIDv4 plan_refresh_id",
  );
  const metadataPath = resolve(ROOT, "plan/refresh-metadata.json");
  requireCondition(existsSync(metadataPath), "plan refresh metadata is missing");
  let metadata;
  if (existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
    } catch {
      errors.push("plan refresh metadata is invalid JSON");
    }
  }
  const refreshSnapshots = metadata
    ? [metadata, ...(Array.isArray(metadata.history) ? metadata.history : [])]
    : [];
  const matchingRefresh = refreshSnapshots.find((snapshot) => {
    const entry = snapshot?.files?.["plan/qa.csv"];
    return (
      snapshot?.refresh_id === recordPlanRefreshId &&
      entry?.sha256 === planSha256 &&
      entry?.modified_at === recordPlanModified
    );
  });
  requireCondition(
    metadata?.status === "success",
    "latest plan refresh did not complete successfully",
  );
  requireCondition(
    metadata?.files?.["plan/qa.csv"]?.sha256 === planSha256,
    "latest successful refresh does not match the current QA plan cache",
  );
  requireCondition(
    Boolean(matchingRefresh),
    "no refresh-metadata snapshot matches the record refresh ID, plan hash, and modified time",
  );
  requireCondition(
    recordPlanAuthorization === "not-required",
    "refreshed plan provenance must use plan_authorization: not-required",
  );
}

if (recordPlanSource === "authorized-cache") {
  requireCondition(
    recordPlanRefreshId === "not-applicable",
    "authorized cache must use plan_refresh_id: not-applicable",
  );
  requireCondition(
    /^user-authorized-cache:\d{4}-\d{2}-\d{2}:.{4,}$/i.test(
      recordPlanAuthorization ?? "",
    ),
    "authorized cache requires plan_authorization: user-authorized-cache:YYYY-MM-DD:<durable reference>",
  );
  requireCondition(
    statSync(planPath).mtime.toISOString() === recordPlanModified,
    "authorized-cache plan_modified does not match the cached plan file",
  );
}

const requiredHeadings = [
  "Outcome contract",
  "Assessment rubric",
  "Claim ledger",
  "Question and misconception review",
  "Files changed",
  "Source integrity",
  "Static verification",
  "Runtime verification",
  "Independent quality review",
  "Learning acceptance",
  "Gate summary",
  "Final status",
  "Remaining risks",
];
const recordLines = record.split("\n");
requireCondition(
  !/\{\{[^}\n]+\}\}/.test(record) &&
    !/Pass\/Fail|Fail\/Blocked|Pass\/Fail\/Blocked/i.test(record),
  "verification record still contains template placeholders",
);
const sections = {};
for (const heading of requiredHeadings) {
  const indexes = recordLines
    .map((line, index) => (line.trim() === `## ${heading}` ? index : -1))
    .filter((index) => index >= 0);
  requireCondition(indexes.length === 1, `record must contain one ## ${heading}`);
  if (indexes.length === 1) {
    const start = indexes[0] + 1;
    const next = recordLines.findIndex(
      (line, index) => index >= start && /^##\s+/.test(line),
    );
    sections[heading] = recordLines
      .slice(start, next >= 0 ? next : undefined)
      .join("\n")
      .trim();
    requireCondition(
      sections[heading].length >= 8,
      `verification section is empty or trivial: ${heading}`,
    );
  } else {
    sections[heading] = "";
  }
}

function requiredField(sectionName, label) {
  const value = sections[sectionName].match(
    new RegExp(`^${escapeRegExp(label)}\\s*(\\S.*)$`, "mi"),
  )?.[1]?.trim();
  requireCondition(Boolean(value), `${sectionName} is missing a value for ${label}`);
  return value ?? "";
}

for (const label of [
  "Plan row:",
  "Plan deliverable:",
  "Target skill:",
  "Learner output:",
  "Completion conditions:",
  "Prerequisites:",
  "Final exercise:",
]) {
  requiredField("Outcome contract", label);
}

const rubricCriteria = [
  ...sections["Assessment rubric"].matchAll(
    /^-\s+(Required|Optional):\s+\S.+$/gim,
  ),
];
requireCondition(
  rubricCriteria.length >= 3 && rubricCriteria.length <= 7,
  "assessment rubric must contain 3–7 Required/Optional criteria",
);
requireCondition(
  rubricCriteria.some((criterion) => criterion[1].toLowerCase() === "required"),
  "assessment rubric must contain at least one required criterion",
);

const claimSection = sections["Claim ledger"];
for (const column of [
  "Claim",
  "Lesson location",
  "Source",
  "Exact location",
  "Support summary",
  "Qualification",
  "Status",
]) {
  requireCondition(claimSection.includes(column), `claim ledger is missing ${column}`);
}
const claimRows = claimSection
  .split("\n")
  .filter((line) => /^\s*\|/.test(line) && !/^\s*\|?\s*:?-{3}/.test(line));
requireCondition(claimRows.length >= 2, "claim ledger must contain at least one claim row");
const claimDataRows = claimRows
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
  .filter((cells) => cells[0] !== "Claim");
for (const [index, cells] of claimDataRows.entries()) {
  requireCondition(
    cells.length === 7 && cells.every(Boolean),
    `claim ledger row ${index + 1} must contain seven nonempty cells`,
  );
  requireCondition(
    /^(Supported|Qualified|Replaced|Removed)$/i.test(cells[6] ?? ""),
    `claim ledger row ${index + 1} has an invalid status`,
  );
}

for (const label of [
  "Tested skill:",
  "Correct reasoning:",
  "Distractor misconception:",
  "Corrective takeaway:",
  "Judgment type:",
]) {
  requiredField("Question and misconception review", label);
}

requireCondition(
  /^-\s+\S/m.test(sections["Files changed"]),
  "files changed must contain at least one bullet",
);
for (const label of [
  "Primary sources opened:",
  "Claims qualified or removed:",
  "Link verification:",
]) {
  requiredField("Source integrity", label);
}
const expectedEvidenceExit = allowedStatuses.has(recordStatus) &&
  ![
    "incomplete-revision-required",
    "blocked-verification-not-possible",
  ].includes(recordStatus)
  ? 0
  : 1;
const staticCommands = [
  { command: `node scripts/check-lesson.mjs ${lessonRel}`, exit: 0 },
  { command: "node scripts/check-lesson.mjs", exit: 0 },
  {
    command: `node scripts/check-lesson-verification.mjs ${lessonRel}`,
    exit: expectedEvidenceExit,
  },
];
for (const { command, exit } of staticCommands) {
  const commandPattern = new RegExp(
    `^Command:\\s*${escapeRegExp(command)}\\s*$`,
    "gm",
  );
  const matches = [...sections["Static verification"].matchAll(commandPattern)];
  requireCondition(
    matches.length === 1,
    `static verification must contain one exact command record: ${command}`,
  );
  if (matches.length === 1) {
    const afterCommand = sections["Static verification"].slice(
      matches[0].index + matches[0][0].length,
    );
    const nextCommand = afterCommand.search(/^Command:/m);
    const commandBlock = afterCommand.slice(
      0,
      nextCommand >= 0 ? nextCommand : undefined,
    );
    requireCondition(
      new RegExp(`^Exit code:\\s*${exit}\\s*$`, "m").test(commandBlock),
      `${command} must record Exit code: ${exit}`,
    );
    for (const label of ["Errors:", "Warnings:", "Result:"]) {
      requireCondition(
        commandBlock.includes(label),
        `${command} record is missing ${label}`,
      );
    }
  }
}
for (const label of [
  "file://",
  "Console:",
  "Keyboard:",
  "Desktop:",
  "Mobile:",
  "Source links:",
]) {
  requireCondition(
    sections["Runtime verification"].includes(label),
    `runtime verification is missing ${label}`,
  );
}
for (const column of ["Check", "Environment", "Result", "Evidence or notes"]) {
  requireCondition(
    sections["Runtime verification"].includes(column),
    `runtime verification matrix is missing ${column}`,
  );
}
const runtimeRows = sections["Runtime verification"]
  .split("\n")
  .filter((line) => /^\s*\|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
  .filter(
    (cells) =>
      cells[0] !== "Check" && !cells.every((cell) => /^:?-{3,}:?$/.test(cell)),
  );
const requiredRuntimeChecks = [
  "Lesson opened through `file://`",
  "Correct feedback paths",
  "Incorrect feedback paths",
  "Graded feedback paths",
  "Retry and reset",
  "Console errors",
  "Keyboard navigation",
  "Desktop layout",
  "Mobile layout",
  "Source links",
];
for (const check of requiredRuntimeChecks) {
  const matches = runtimeRows.filter((cells) => cells[0] === check);
  requireCondition(matches.length === 1, `runtime matrix must contain one ${check} row`);
  if (matches.length === 1) {
    requireCondition(
      matches[0].length === 4 && matches[0].every(Boolean),
      `${check} runtime row must contain four nonempty cells`,
    );
    requireCondition(
      /^(Pass|Fail|Blocked|Not applicable)$/i.test(matches[0][2] ?? ""),
      `${check} has an invalid runtime result`,
    );
  }
}
for (const label of ["Reviewer type:", "Result:"]) {
  requiredField("Independent quality review", label);
}
for (const label of [
  "Reviewer type:",
  "Prerequisite profile:",
  "Deliverable produced:",
  "Rubric result:",
  "Difficulties encountered:",
  "Revisions made:",
  "Acceptance result:",
]) {
  requiredField("Learning acceptance", label);
}
const gateNames = [
  "Outcome alignment",
  "Source integrity",
  "Instructional quality",
  "Repository completeness",
  "Runtime verification",
  "Learning acceptance",
];
const gateRows = sections["Gate summary"]
  .split("\n")
  .filter((line) => /^\s*\|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
requireCondition(
  gateRows.some((cells) => cells.join("|") === "Gate|Result|Evidence"),
  "gate summary table has the wrong or missing header",
);
for (const gate of gateNames) {
  const matches = gateRows.filter((cells) => cells[0] === gate);
  requireCondition(matches.length === 1, `gate summary must contain one ${gate} row`);
  if (matches.length === 1) {
    requireCondition(
      /^(Pass|Fail|Blocked|Pending)$/i.test(matches[0][1]),
      `${gate} has an invalid gate result`,
    );
  }
}

const humanStatuses = {
  "complete-verified-and-accepted": "COMPLETE — VERIFIED AND ACCEPTED",
  "implementation-verified-learning-acceptance-pending":
    "IMPLEMENTATION VERIFIED — LEARNING ACCEPTANCE PENDING",
  "incomplete-revision-required": "INCOMPLETE — REVISION REQUIRED",
  "blocked-verification-not-possible": "BLOCKED — VERIFICATION NOT POSSIBLE",
};
requireCondition(
  sections["Final status"].includes(humanStatuses[recordStatus] ?? "__invalid__"),
  "record final status does not match frontmatter",
);

if (
  recordStatus === "complete-verified-and-accepted" ||
  recordStatus === "implementation-verified-learning-acceptance-pending"
) {
  const coreRuntimeChecks = new Set([
    "Lesson opened through `file://`",
    "Console errors",
    "Keyboard navigation",
    "Desktop layout",
    "Mobile layout",
    "Source links",
  ]);
  for (const check of requiredRuntimeChecks) {
    const result = runtimeRows.find((cells) => cells[0] === check)?.[2] ?? "";
    requireCondition(
      coreRuntimeChecks.has(check)
        ? result.toLowerCase() === "pass"
        : /^(Pass|Not applicable)$/i.test(result),
      `verified implementation requires an acceptable runtime result for ${check}`,
    );
  }
}

if (recordStatus === "complete-verified-and-accepted") {
  requireCondition(
    /Reviewer type:\s*actual fresh human learner/i.test(
      sections["Learning acceptance"],
    ),
    "complete status requires an actual fresh human learner",
  );
  requireCondition(
    /Acceptance result:\s*pass/i.test(sections["Learning acceptance"]),
    "complete status requires a passing human acceptance result",
  );
  for (const gate of gateNames) {
    requireCondition(
      gateRows.some(
        (cells) => cells[0] === gate && cells[1].toLowerCase() === "pass",
      ),
      `complete status requires ${gate}: Pass`,
    );
  }
}
if (recordStatus === "implementation-verified-learning-acceptance-pending") {
  requireCondition(
    /Acceptance result:\s*pending/i.test(sections["Learning acceptance"]),
    "pending status must label learning acceptance as pending",
  );
  for (const gate of gateNames.slice(0, 5)) {
    requireCondition(
      gateRows.some(
        (cells) => cells[0] === gate && cells[1].toLowerCase() === "pass",
      ),
      `implementation-verified status requires ${gate}: Pass`,
    );
  }
  requireCondition(
    gateRows.some(
      (cells) =>
        cells[0] === "Learning acceptance" &&
        cells[1].toLowerCase() === "pending",
    ),
    "implementation-verified status requires Learning acceptance: Pending",
  );
}

const notes = readFileSync(resolve(ROOT, "NOTES.md"), "utf8");
const notesLines = notes.split("\n");
const verificationHeadingIndexes = notesLines
  .map((line, index) => (line.trim() === "## Verification status" ? index : -1))
  .filter((index) => index >= 0);
requireCondition(
  verificationHeadingIndexes.length === 1,
  "NOTES.md must contain exactly one ## Verification status section",
);
const verificationSection = verificationHeadingIndexes.length === 1
  ? notesLines.slice(
      verificationHeadingIndexes[0] + 1,
      notesLines.findIndex(
        (line, index) =>
          index > verificationHeadingIndexes[0] && /^##\s+/.test(line),
      ) >= 0
        ? notesLines.findIndex(
            (line, index) =>
              index > verificationHeadingIndexes[0] && /^##\s+/.test(line),
          )
        : undefined,
    )
  : [];
const notesRows = verificationSection
  .filter((line) => /^\s*\|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
requireCondition(
  notesRows.some(
    (cells) =>
      cells.join("|") === "Lesson|Task|Status|Verified|Record",
  ),
  "NOTES.md verification table has the wrong or missing header",
);
const lessonNotesRows = notesRows.filter((cells) => cells[0] === lessonNumber);
requireCondition(
  lessonNotesRows.length === 1,
  `NOTES.md must contain exactly one verification row for lesson ${lessonNumber}`,
);
const matchingNotesRow = lessonNotesRows.find(
  (cells) =>
    cells[0] === lessonNumber &&
    cells[1] === taskId &&
    cells[2] === recordStatus &&
    cells[3] === recordDate &&
    cells[4] === recordRel,
);
requireCondition(
  Boolean(matchingNotesRow),
  "NOTES.md verification-status row is missing or disagrees with the record",
);

const externalLinks = [
  ...html.matchAll(
    /<a\b([^>]*\bhref\s*=\s*"https?:\/\/[^"]+"[^>]*)>([\s\S]*?)<\/a\s*>/g,
  ),
];
for (const [index, link] of externalLinks.entries()) {
  const attributes = link[1];
  const hasLocator = /\bdata-source-locator\s*=\s*"[^"]+"/.test(attributes);
  const hasAccessDate = /\bdata-accessed\s*=\s*"\d{4}-\d{2}-\d{2}"/.test(attributes);
  requireCondition(
    hasLocator && hasAccessDate,
    `external link ${index + 1} lacks data-source-locator or data-accessed`,
  );
}

const screenshotRoot = resolve(ROOT, `verification/evidence/${lessonName}`);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function decodePngEvidence(png) {
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  if (!png || png.length < 45 || !png.subarray(0, 8).equals(signature)) {
    throw new Error("missing PNG signature or required chunks");
  }

  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  let interlace;
  let sawHeader = false;
  let sawEnd = false;
  const imageData = [];

  while (offset + 12 <= png.length) {
    const length = png.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > png.length) throw new Error("truncated PNG chunk");
    const type = png.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const storedCrc = png.readUInt32BE(dataEnd);
    const calculatedCrc = crc32(png.subarray(offset + 4, dataEnd));
    if (storedCrc !== calculatedCrc) throw new Error(`invalid ${type} CRC`);

    if (!sawHeader && type !== "IHDR") {
      throw new Error("IHDR is not the first PNG chunk");
    }
    if (type === "IHDR") {
      if (sawHeader || length !== 13) throw new Error("invalid IHDR chunk");
      sawHeader = true;
      width = png.readUInt32BE(dataStart);
      height = png.readUInt32BE(dataStart + 4);
      bitDepth = png[dataStart + 8];
      colorType = png[dataStart + 9];
      const compression = png[dataStart + 10];
      const filter = png[dataStart + 11];
      interlace = png[dataStart + 12];
      if (compression !== 0 || filter !== 0 || interlace !== 0) {
        throw new Error("unsupported PNG encoding");
      }
    } else if (type === "IDAT") {
      imageData.push(png.subarray(dataStart, dataEnd));
    } else if (type === "IEND") {
      if (length !== 0) throw new Error("invalid IEND chunk");
      sawEnd = true;
      offset = end;
      break;
    }
    offset = end;
  }

  if (!sawHeader || !sawEnd || imageData.length === 0 || offset !== png.length) {
    throw new Error("incomplete PNG chunk stream");
  }
  const formats = new Map([
    [0, { channels: 1, depths: [1, 2, 4, 8, 16] }],
    [2, { channels: 3, depths: [8, 16] }],
    [3, { channels: 1, depths: [1, 2, 4, 8] }],
    [4, { channels: 2, depths: [8, 16] }],
    [6, { channels: 4, depths: [8, 16] }],
  ]);
  const format = formats.get(colorType);
  if (!format || !format.depths.includes(bitDepth)) {
    throw new Error("unsupported PNG color format");
  }
  const { channels } = format;
  const rowBytes = Math.ceil((width * channels * bitDepth) / 8);
  const decoded = inflateSync(Buffer.concat(imageData));
  if (decoded.length !== (rowBytes + 1) * height) {
    throw new Error("decoded PNG data does not match its dimensions");
  }
  return { width, height };
}

if (
  recordStatus === "complete-verified-and-accepted" ||
  recordStatus === "implementation-verified-learning-acceptance-pending"
) {
  for (const [screenshot, bounds] of [
    [
      "desktop.png",
      { minWidth: 1360, maxWidth: 1520, minHeight: 850, maxHeight: 1000 },
    ],
    [
      "mobile.png",
      { minWidth: 360, maxWidth: 430, minHeight: 800, maxHeight: 900 },
    ],
  ]) {
    const path = resolve(screenshotRoot, screenshot);
    const rel = relative(ROOT, path);
    let png;
    if (existsSync(path)) png = readFileSync(path);
    requireCondition(
      Boolean(png) && png.length >= 24,
      `missing or truncated runtime screenshot: ${rel}`,
    );
    let dimensions;
    if (png) {
      try {
        dimensions = decodePngEvidence(png);
      } catch (error) {
        errors.push(`runtime screenshot is not a decodable PNG: ${rel} (${error.message})`);
      }
    }
    if (dimensions) {
      const { width, height } = dimensions;
      requireCondition(
        width >= bounds.minWidth &&
          width <= bounds.maxWidth &&
          height >= bounds.minHeight &&
          height <= bounds.maxHeight,
        `${rel} dimensions ${width}x${height} do not match the required viewport evidence`,
      );
    }
    requireCondition(
      sections["Runtime verification"].includes(rel),
      `runtime verification does not reference ${rel}`,
    );
  }
}

function runLessonChecker(target) {
  return spawnSync(process.execPath, [LESSON_CHECKER, ...(target ? [target] : [])], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

const targetCheck = runLessonChecker(lessonRel);
requireCondition(targetCheck.status === 0, "target lesson checker failed");
requireCondition(
  /1 lesson\(s\): 0 error\(s\), 0 warning\(s\)/.test(targetCheck.stdout),
  "target lesson checker must report zero errors and zero warnings",
);

const fullCheck = runLessonChecker();
requireCondition(fullCheck.status === 0, "full-course lesson checker failed");

function warningKeys(output) {
  const keys = [];
  let currentLesson = "";
  for (const line of output.split("\n")) {
    const lesson = line.match(/^\s+(lessons\/[^\s]+\.html)\s*$/)?.[1];
    if (lesson) currentLesson = lesson;
    const warning = line.match(/^\s+WARN\s+(.+)$/)?.[1];
    if (warning) keys.push(`${currentLesson} :: ${warning}`);
  }
  return keys.sort();
}

requireCondition(existsSync(WARNING_BASELINE), "accepted warning baseline is missing");
const expectedWarnings = existsSync(WARNING_BASELINE)
  ? readFileSync(WARNING_BASELINE, "utf8")
      .split("\n")
      .map((line) =>
        line.replaceAll("`", "").match(/^- (lessons\/.*\.html :: .+)$/)?.[1],
      )
      .filter(Boolean)
      .sort()
  : [];
const actualWarnings = warningKeys(fullCheck.stdout);
requireCondition(
  JSON.stringify(actualWarnings) === JSON.stringify(expectedWarnings),
  `full-course warnings differ from baseline\nexpected: ${expectedWarnings.join("\n")}\nactual: ${actualWarnings.join("\n")}`,
);

requireCondition(
  ![
    "incomplete-revision-required",
    "blocked-verification-not-possible",
  ].includes(recordStatus),
  `record status ${recordStatus} intentionally remains pending verification`,
);

if (errors.length) {
  console.error(`verification failed for ${lessonRel}`);
  for (const error of errors) console.error(`  ERROR ${error}`);
  process.exit(1);
}

console.log(`ok    ${recordRel}`);
console.log(`      artifact_sha256 ${currentFingerprint}`);
console.log(`      ${actualWarnings.length} accepted full-course warning(s)`);
