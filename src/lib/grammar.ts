// Grammar review. Local rule-based linter is the FREE path (offline, no setup).
// The AI path is PRO and gated by entitlements.llm_grammar — and critically,
// for a real product the LLM call should go through YOUR backend, not directly
// from the client, so the API key and the entitlement check live server-side.
export interface Issue { kind: "grammar" | "style" | "spelling"; msg: string; from?: string; to?: string; }
export interface Review { score: number; issues: Issue[]; fixed: string; recommendation: string; source: string; }

export function reviewLocal(text: string): Review {
  const issues: Issue[] = [];
  let fixed = text;
  const push = (kind: Issue["kind"], msg: string, from?: string, to?: string) =>
    issues.push({ kind, msg, from, to });

  if (/\s{2,}/.test(fixed)) { push("style", "Collapse repeated spaces"); fixed = fixed.replace(/[ \t]{2,}/g, " "); }
  if (/\s+[,.;:!?]/.test(fixed)) { push("style", "Remove space before punctuation"); fixed = fixed.replace(/\s+([,.;:!?])/g, "$1"); }
  if (/\bi\b/.test(fixed)) { push("grammar", "Capitalize the pronoun “I”", "i", "I"); fixed = fixed.replace(/\bi\b/g, "I"); }
  const dup = fixed.match(/\b(\w+)\s+\1\b/i);
  if (dup) { push("grammar", "Remove the repeated word", `${dup[1]} ${dup[1]}`, dup[1]); fixed = fixed.replace(/\b(\w+)\s+\1\b/gi, "$1"); }
  if (/\ba\s+[aeiou]/i.test(fixed)) { push("grammar", "Use “an” before a vowel sound", "a apple", "an apple"); }
  fixed = fixed.replace(/(^|[.!?]\s+)([a-z])/g, (_m, p, c) => { push("grammar", "Capitalize the start of a sentence"); return p + c.toUpperCase(); });
  const trimmed = fixed.trim();
  if (trimmed && !/[.!?]$/.test(trimmed)) { push("style", "Add closing punctuation"); fixed = trimmed + "."; }

  const seen = new Set<string>();
  const uniq = issues.filter((i) => (seen.has(i.msg) ? false : (seen.add(i.msg), true)));
  const score = Math.max(40, 100 - uniq.length * 9);
  const recommendation = score >= 85 ? "Reads well — ship it as is."
    : score >= 65 ? "A couple of tidy-ups and this is publish-ready."
    : "Worth a careful pass before sharing.";
  return { score, issues: uniq, fixed: fixed.trim(), recommendation, source: "local rules" };
}

// ---- Filler-word removal (PRD §8 #5, MVP, local) -------------------------------
// Conservative set: we only strip words that are filler in (nearly) all contexts.
// We intentionally DON'T auto-remove bare "like"/"actually"/"literally" — they're
// usually meaningful ("I like coffee", "it literally broke"), and silently deleting
// them would change the user's meaning. Better to under-remove than corrupt text.
const FILLERS: { re: RegExp; label: string }[] = [
  { re: /\b(?:um|uh|er|ah|eh|hmm|mm|uhm)\b/gi, label: "um/uh" },
  { re: /\byou know\b/gi, label: "you know" },
  { re: /\bi mean\b/gi, label: "I mean" },
  { re: /\b(?:sort of|kind of|kinda|sorta)\b/gi, label: "sort of/kind of" },
  { re: /\bbasically\b/gi, label: "basically" },
];

export interface FillerResult { cleaned: string; removed: number; byType: Record<string, number>; }

/** Strip filler words and tidy the leftover spacing/punctuation. Counts what it removed. */
export function removeFillers(text: string): FillerResult {
  const byType: Record<string, number> = {};
  let removed = 0;
  let out = text;
  for (const { re, label } of FILLERS) {
    const matches = out.match(re);
    if (matches) {
      byType[label] = (byType[label] ?? 0) + matches.length;
      removed += matches.length;
      out = out.replace(re, "");
    }
  }
  // Tidy seams left by removal: doubled spaces, space-before-punct, orphaned commas.
  out = out
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/,(\s*,)+/g, ",")
    .replace(/(^[\s,]+)|([\s,]+$)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { cleaned: out, removed, byType };
}

// ---- Writing-score scaffold (PRD §8 #6 — local heuristics first) ---------------
export interface WritingScore {
  overall: number;
  metrics: { label: string; score: number }[];
  words: number;
  sentences: number;
  fillerCount: number;
}

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Local, heuristic writing score (0–100) with a sub-metric breakdown. Scaffold for
 *  the Pro AI scorer; deterministic so it can be unit-tested. */
export function scoreWriting(text: string): WritingScore {
  const t = text.trim();
  const words = (t.match(/\b[\w']+\b/g) ?? []).length;
  if (words === 0) {
    return {
      overall: 0,
      metrics: [
        { label: "Grammar", score: 0 },
        { label: "Conciseness", score: 0 },
        { label: "Readability", score: 0 },
        { label: "Clarity", score: 0 },
      ],
      words: 0, sentences: 0, fillerCount: 0,
    };
  }
  const sentences = Math.max(1, (t.match(/[.!?]+/g) ?? []).length);
  const avgLen = words / sentences;
  const fillerCount = removeFillers(t).removed;
  const grammarIssues = reviewLocal(t).issues.length;

  const grammar = clamp100(100 - grammarIssues * 9);
  // Penalize filler density (3x weight) — wordy speech reads as less concise.
  const conciseness = clamp100(100 - (fillerCount / words) * 100 * 3);
  // Ideal ~12–20 words/sentence; penalize run-ons harder than terseness.
  const readability = clamp100(100 - Math.max(0, avgLen - 20) * 4 - Math.max(0, 8 - avgLen) * 2);
  const clarity = clamp100((grammar + conciseness + readability) / 3);

  const metrics = [
    { label: "Grammar", score: grammar },
    { label: "Conciseness", score: conciseness },
    { label: "Readability", score: readability },
    { label: "Clarity", score: clarity },
  ];
  const overall = clamp100(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);
  return { overall, metrics, words, sentences, fillerCount };
}
