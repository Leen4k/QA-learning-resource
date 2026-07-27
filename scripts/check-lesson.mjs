#!/usr/bin/env node
/*
 * check-lesson.mjs — the mechanically checkable half of the quality bar.
 *
 *   node scripts/check-lesson.mjs                    # every lesson
 *   node scripts/check-lesson.mjs lessons/06-foo.html
 *
 * This does NOT judge teaching quality. It catches the things that are
 * boring to verify by hand and therefore get skipped: dead links, a lesson
 * missing from the front door, a quiz whose longest option is the answer.
 * Judgement — is the source real, is the exercise a genuine trap, does the
 * learner end able to produce the deliverable — stays in LESSON-RECIPE.md.
 *
 * Exit 1 on ERROR, 0 on WARN-only.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- tiny HTML helpers (adequate for files we author) ---------- */

const stripTags = (s) => s.replace(/<[^>]*>/g, " ");

const decode = (s) =>
  s
    .replace(/&(mdash|ndash);/g, "-")
    .replace(/&(ldquo|rdquo|lsquo|rsquo|quot|apos);/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, "")
    .replace(/&#\d+;/g, "");

const words = (s) =>
  decode(stripTags(s))
    .split(/\s+/)
    .filter(Boolean).length;

/* ---------- the checks ---------- */

function checkLesson(file, indexHtml, curriculumHtml) {
  const abs = resolve(ROOT, file);
  const html = readFileSync(abs, "utf8");
  const dir = dirname(abs);
  const name = basename(file);
  const problems = [];
  const err = (m) => problems.push({ level: "ERROR", m });
  const warn = (m) => problems.push({ level: "WARN", m });

  /* 1. Every local link and script resolves. A lesson that 404s to its own
        stylesheet looks broken to a stranger, which is who this is for now. */
  const refs = [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map(
    (m) => m[1],
  );
  for (const ref of refs) {
    if (/^(https?:|mailto:|#|data:)/.test(ref)) continue;
    const target = resolve(dir, ref.split("#")[0]);
    if (!existsSync(target)) {
      err(`dead link -> ${ref}`);
    }
  }

  /* 2. Shared assets, not one-offs. */
  if (!/assets\/lesson\.css/.test(html)) {
    err("does not link assets/lesson.css");
  }
  const inlineStyle = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (inlineStyle && inlineStyle[1].trim().length > 200) {
    warn(
      `inline <style> of ${inlineStyle[1].trim().length} chars — ` +
        `should this be a .rg-* primitive in assets/lesson.css?`,
    );
  }
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type\s*=\s*"application\/json"/.test(m[1])) continue; // data blocks are fine
    const lines = m[2].trim().split("\n").length;
    if (lines > 15) {
      warn(
        `inline <script> of ${lines} lines — new widget? ` +
          `extract to assets/ so the next lesson can reuse it`,
      );
    }
  }

  /* 3. Structure the recipe requires. */
  if (!/class="plan-tag"/.test(html)) {
    err("no .plan-tag — lesson is not traceable back to a plan task");
  }
  if (!/class="footer-nav"/.test(html)) {
    err("no .footer-nav");
  } else {
    const nav = html.match(/class="footer-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
    // Lesson 01 has nothing before it; every other lesson does.
    const isFirst = /^0*1-/.test(name);
    if (!isFirst && !/Previous/i.test(nav)) err("footer-nav has no Previous link");
    if (!/Next/i.test(nav)) err("footer-nav has no Next link");
  }

  /* 4. Citations carry section numbers, not just a bare URL. The recipe is
        explicit that "ISTQB CTFL v4.0 §5.2.1" is the citation format — a
        link alone is what a lesson written from memory looks like. */
  const sections = (html.match(/§|&sect;/g) ?? []).length;
  if (sections === 0) {
    warn("no § section citation found — every factual claim needs one");
  }

  /* 5. Quizzes: one correct answer, feedback on every option, and options
        of near-equal length. Length is the single biggest answer tell. */
  const quizzes = [...html.matchAll(/<div class="quiz"[^>]*data-quiz[^>]*>([\s\S]*?)<\/ol>/g)];
  quizzes.forEach((q, i) => {
    const body = q[1];
    const buttons = [...body.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)];
    const label = `quiz ${i + 1}`;

    if (!buttons.length) {
      err(`${label}: no option buttons`);
      return;
    }
    const correct = buttons.filter((b) => /\bdata-correct\b/.test(b[1]));
    if (correct.length !== 1) {
      err(`${label}: ${correct.length} options marked data-correct, expected 1`);
    }
    const noFeedback = buttons.filter((b) => !/\bdata-feedback\s*=/.test(b[1]));
    if (noFeedback.length) {
      err(
        `${label}: ${noFeedback.length} option(s) with no data-feedback — ` +
          `a bare tick teaches nothing`,
      );
    }

    const counts = buttons.map((b) => words(b[2]));
    const spread = Math.max(...counts) - Math.min(...counts);
    if (spread > 2) {
      const longest = counts.indexOf(Math.max(...counts));
      const isAnswer = /\bdata-correct\b/.test(buttons[longest][1]);
      const msg =
        `${label}: option word counts ${counts.join("/")} ` +
        `(spread ${spread})${isAnswer ? " — and the LONGEST one is the answer" : ""}`;
      isAnswer ? err(msg) : warn(msg);
    }
  });
  if (!quizzes.length && !/data-(risk-grid|classify|select-set)/.test(html)) {
    warn("no interactive exercise found");
  }

  /* 6. Wired in. A lesson nobody can navigate to is not shipped. */
  if (!indexHtml.includes(`lessons/${name}`)) {
    err(`not linked from index.html`);
  }
  if (!curriculumHtml.includes(name)) {
    err(`not linked from curriculum.html`);
  }

  /* 7. Grounding (writing-beats). A term this lesson introduces must be
        recorded in GROUNDED.md, so later lessons know they may lean on it.
        The ledger is the sequential state that makes parallel lesson-writing
        impossible — keeping it accurate is what keeps callbacks honest. */
  const defs = [...html.matchAll(/<dfn[^>]*>([\s\S]*?)<\/dfn>/g)].map((m) =>
    decode(stripTags(m[1])).trim().toLowerCase(),
  );
  if (!defs.length) {
    warn(
      "no <dfn> terms — new lessons should mark the terms they ground " +
        "(see GROUNDED.md); pre-convention lessons can ignore this",
    );
  }
  for (const term of defs) {
    if (!grounded.has(term)) {
      err(`grounds "${term}" but GROUNDED.md does not record it`);
    }
  }

  return problems;
}

/* ---------- run ---------- */

const indexHtml = readFileSync(resolve(ROOT, "index.html"), "utf8");
const curriculumHtml = readFileSync(resolve(ROOT, "curriculum.html"), "utf8");

/* The grounding ledger, as an exact-match set of terms.
   Terms are the **bold** spans on list lines: "- **Risk level** — the product…"
   yields "risk level". Matching must be exact — an earlier version substring-
   matched the whole file, so <dfn>ris</dfn> passed by hiding inside "risk". */
function loadGrounded() {
  const path = resolve(ROOT, "GROUNDED.md");
  if (!existsSync(path)) return new Set();
  const terms = new Set();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!/^\s*[-*]\s/.test(line)) continue; // list items only, not prose
    for (const m of line.matchAll(/\*\*([^*]+)\*\*/g)) {
      terms.add(m[1].trim().toLowerCase());
    }
  }
  return terms;
}
const grounded = loadGrounded();

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(resolve(ROOT, "lessons"))
      .filter((f) => f.endsWith(".html"))
      .sort()
      .map((f) => `lessons/${f}`);

let errors = 0;
let warns = 0;

for (const t of targets) {
  const rel = relative(ROOT, resolve(ROOT, t));
  if (!existsSync(resolve(ROOT, t))) {
    console.log(`      ${rel}\n  ERROR no such file`);
    errors++;
    continue;
  }
  const problems = checkLesson(t, indexHtml, curriculumHtml);
  errors += problems.filter((p) => p.level === "ERROR").length;
  warns += problems.filter((p) => p.level === "WARN").length;

  if (!problems.length) {
    console.log(`ok    ${rel}`);
  } else {
    console.log(`      ${rel}`);
    for (const p of problems) console.log(`  ${p.level.padEnd(5)} ${p.m}`);
  }
}

console.log(
  `\n${targets.length} lesson(s): ${errors} error(s), ${warns} warning(s)`,
);
process.exit(errors ? 1 : 0);
