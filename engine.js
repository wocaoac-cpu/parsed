/*
 * Parsed engine — deterministic résumé / ATS analysis. No deps, no network.
 * Runs identically in the browser and Node. Your résumé text is the only input;
 * nothing is sent anywhere. AI is NOT required — every check below is rule-based.
 *
 * The headline: an ATS score (0-100) plus the ranked, concrete reasons a résumé
 * gets auto-rejected before a human ever reads it — including the parser-failure
 * surfacing that paid tools hide behind a paywall.
 */

const ACTION_VERBS = new Set(('led managed built created designed developed launched shipped drove grew increased reduced cut improved optimized delivered owned spearheaded implemented architected automated streamlined scaled negotiated launched founded directed coordinated executed analyzed engineered established generated boosted accelerated transformed mentored coached resolved migrated refactored deployed forecasted closed won acquired retained').split(' '));

const CLICHES = ['team player', 'hard worker', 'hard working', 'hardworking', 'detail oriented', 'detail-oriented', 'results driven', 'results-driven', 'go getter', 'go-getter', 'think outside the box', 'synergy', 'self starter', 'self-starter', 'responsible for', 'duties included', 'fast learner', 'works well under pressure', 'proven track record', 'dynamic', 'go-to person', 'wheelhouse', 'value add', 'rockstar', 'ninja', 'guru'];

const SECTIONS = {
  experience: ['experience', 'work history', 'employment', 'professional experience', 'work experience', '工作经历', '工作经验', 'досвід роботи', 'досвід'],
  education: ['education', 'academic', '教育', 'освіта'],
  skills: ['skills', 'technical skills', 'competencies', '技能', 'навички'],
  summary: ['summary', 'objective', 'profile', 'about', '简介', '概要', 'про себе']
};

const STOPWORDS = new Set(('a an the and or but if of to in on for with at by from is are was were be been being it its this that these those i you he she they we my your our their as so very will would can could should have has had do does did get got not no will work working experience years team strong excellent good great ability able including etc using use used able role responsibilities requirements preferred plus must should you your we our they').split(' '));

// short technical terms that must survive the length filter (C#, Go, R, ML…)
const SHORT_TECH = new Set(['go', 'r', 'c', 'c#', 'c++', 'ai', 'ml', 'ar', 'vr', 'bi', 'qa', 'ux', 'ui', 'ci', 'cd', 'db', 'ds', 'aws', 'gcp', 'sql', 'css', 'php', 'ios', 'seo', 'sem', 'crm', 'erp', 'api', 'etl', 'nlp', 'llm']);

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round = (n) => Math.round(n);

function tokenize(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9'+#.\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

// ---------------------------------------------------------------------------
// parse
// ---------------------------------------------------------------------------
function parseResume(text) {
  const raw = String(text || '').replace(/\r\n?/g, '\n');
  const lines = raw.split('\n').map(l => l.trim());
  const nonEmpty = lines.filter(Boolean);
  const words = tokenize(raw);
  const lower = raw.toLowerCase();

  const email = /[a-z0-9._%+-]+@([a-z0-9-]+\.)+[a-z]{2,}/i.test(raw);
  // phone needs phone-like grouping; excludes bare date ranges like "2020 - 2024" and long IDs
  const phone = /(\(\d{3}\)\s*[\d–—.\- ]{6,}\d)|(\+\d[\d\s().–—-]{7,}\d)|(\b\d{3}[\s.–—-]\d{3}[\s.–—-]\d{4}\b)/.test(raw);
  const link = /(linkedin\.com|github\.com|https?:\/\/|[a-z0-9-]+\.(io|dev|com|me)\b)/i.test(raw);

  const sectionsFound = {};
  for (const key of Object.keys(SECTIONS)) {
    sectionsFound[key] = SECTIONS[key].some(s => {
      // a heading: the term appears on a short-ish line
      return nonEmpty.some(l => l.toLowerCase().includes(s) && l.length <= s.length + 25);
    });
  }

  // bullets: lines starting with common bullet glyphs
  const bulletLines = nonEmpty.filter(l => /^[•▪◦‣·●◆■▸▹➤*\-–—]\s+/.test(l) || /^[•●◦▪◆]/.test(l));
  // years / date ranges
  const years = (raw.match(/\b(19|20)\d{2}\b/g) || []);
  const dateRanges = (raw.match(/\b(?:[A-Za-z]{3,9}\.?\s+)?(?:19|20)\d{2}\s*(?:[–—-]+|\bto\b)\s*(?:(?:[A-Za-z]{3,9}\.?\s+)?(?:19|20)\d{2}|present|current|now)\b/gi) || []);

  return {
    raw, lines, nonEmpty, words,
    wordCount: words.length,
    lineCount: nonEmpty.length,
    email, phone, link,
    sectionsFound,
    bulletLines,
    bulletCount: bulletLines.length,
    years, dateRanges,
    lower
  };
}

// bullets that begin with a strong action verb
function actionBullets(p) {
  return p.bulletLines.filter(l => {
    const first = l.replace(/^[•▪◦‣·●◆■▸▹➤*\-–—\s]+/, '').toLowerCase().split(/\s+/)[0] || '';
    return ACTION_VERBS.has(first.replace(/[^a-z]/g, ''));
  });
}
// bullets that contain a quantified result (number, %, $, k/m)
function quantifiedBullets(p) {
  // require a metric context (%/currency/unit/multiplier) — bare years/versions/codes don't count
  return p.bulletLines.filter(l => /(\d+\s?%|[$€£¥]\s?\d|\b\d[\d,.]*\s?(k|m|b|x|hrs?|hours|mins?|minutes|users|customers|clients|leads|signups|subscribers|downloads|installs|requests|queries|tickets|deals|accounts|reps|people|countries|languages|services|projects|members|students|days|weeks|months|years)\b|\b\d+\+|\b\d+x\b)/i.test(l));
}

function clichesFound(p) {
  return CLICHES.filter(c => p.lower.includes(c));
}

// ---------------------------------------------------------------------------
// keyword match vs a job description
// ---------------------------------------------------------------------------
function extractKeywords(jdText, limit = 25) {
  const toks = tokenize(jdText).filter(t => (t.length > 2 || SHORT_TECH.has(t) || /[#+]/.test(t)) && !STOPWORDS.has(t) && !/^\d+$/.test(t));
  const freq = {};
  for (const t of toks) freq[t] = (freq[t] || 0) + 1;
  // also capture multiword tech phrases lightly via frequency of singles
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word, count]) => ({ word, count }));
}

function keywordMatch(resumeText, jdText) {
  if (!jdText || !String(jdText).trim()) return null;
  const kws = extractKeywords(jdText);
  if (!kws.length) return null;                  // JD had no usable keywords -> treat as no JD
  const rset = new Set(tokenize(resumeText));    // whole-token match: "React" != "reactive", "SQL" != "NoSQL"
  const matched = [], missing = [];
  for (const k of kws) { (rset.has(k.word) ? matched : missing).push(k.word); }
  const pct = round(matched.length / kws.length * 100);
  return { total: kws.length, matched, missing, pct };
}

// ---------------------------------------------------------------------------
// scoring
// ---------------------------------------------------------------------------
const SEV = { high: 3, med: 2, low: 1 };

function analyze(resumeText, jdText) {
  const p = parseResume(resumeText);
  const km = keywordMatch(resumeText, jdText);
  const usableJD = !!km;                          // JD provided AND it yielded real keywords
  const issues = [], passed = [];
  let score = 0;

  // weights (sum 100). keyword block only when the JD yields real keywords; else redistribute.
  const W = usableJD
    ? { contact: 12, sections: 18, length: 10, bullets: 12, quant: 13, cliche: 8, dates: 7, keyword: 20 }
    : { contact: 15, sections: 22, length: 13, bullets: 15, quant: 16, cliche: 9, dates: 10, keyword: 0 };

  // 1. contact
  if (p.email && p.phone) { score += W.contact; passed.push('Contact info (email + phone) found'); }
  else issues.push({ sev: 'high', key: 'contact', title: 'Missing contact details', detail: `${p.email ? '' : 'No email detected. '}${p.phone ? '' : 'No phone number detected.'}`.trim(), fix: 'Put a plain-text email and phone at the top — ATS often can’t read contact info inside headers/footers.' });

  // 2. standard sections
  const need = ['experience', 'education', 'skills'];
  const have = need.filter(s => p.sectionsFound[s]);
  score += round(W.sections * have.length / need.length);
  if (have.length === need.length) passed.push('Standard sections present (Experience, Education, Skills)');
  else issues.push({ sev: 'high', key: 'sections', title: `Missing standard section${need.length - have.length > 1 ? 's' : ''}`, detail: `ATS looks for clearly labeled sections. Missing: ${need.filter(s => !p.sectionsFound[s]).join(', ')}.`, fix: 'Use conventional, plain headings: "Experience", "Education", "Skills". Avoid creative labels like "Where I’ve Been".' });

  // 3. length
  if (p.wordCount >= 400 && p.wordCount <= 1000) { score += W.length; passed.push(`Length looks right (${p.wordCount} words)`); }
  else if (p.wordCount < 400) issues.push({ sev: p.wordCount < 200 ? 'high' : 'med', key: 'length', title: 'Résumé looks too short', detail: `Only ${p.wordCount} words detected. Thin résumés read as junior or incomplete.`, fix: 'Aim for ~400–800 words: add quantified accomplishments to each role.' });
  else issues.push({ sev: 'med', key: 'length', title: 'Résumé may be too long', detail: `${p.wordCount} words detected. Over ~1000 words usually means 3+ pages.`, fix: 'Trim to 1–2 pages. Cut old/irrelevant roles and tighten bullets.' });

  // 4. bullets + action verbs
  const ab = actionBullets(p);
  if (p.bulletCount >= 5 && ab.length >= Math.ceil(p.bulletCount * 0.4)) { score += W.bullets; passed.push(`${ab.length}/${p.bulletCount} bullets start with strong action verbs`); }
  else if (p.bulletCount < 5) issues.push({ sev: 'med', key: 'bullets', title: 'Too few bullet points', detail: `Only ${p.bulletCount} bullet lines found. ATS and recruiters skim bullets, not paragraphs.`, fix: 'Convert dense paragraphs into 3–6 bullets per role.' });
  else issues.push({ sev: 'med', key: 'verbs', title: 'Weak bullet openers', detail: `Only ${ab.length} of ${p.bulletCount} bullets start with an action verb.`, fix: 'Start every bullet with a strong verb: Led, Built, Increased, Reduced…' });

  // 5. quantification
  const qb = quantifiedBullets(p);
  if (p.bulletCount > 0 && qb.length >= Math.ceil(p.bulletCount * 0.3)) { score += W.quant; passed.push(`${qb.length} bullets contain quantified results`); }
  else issues.push({ sev: 'high', key: 'quant', title: 'Accomplishments aren’t quantified', detail: `Only ${qb.length} bullet${qb.length === 1 ? '' : 's'} include numbers. "Improved performance" is ignored; "cut load time 40%" isn’t.`, fix: 'Add metrics to at least a third of bullets: %, $, time saved, scale (users, revenue).' });

  // 6. cliches
  const ch = clichesFound(p);
  if (ch.length === 0) { score += W.cliche; passed.push('No filler clichés detected'); }
  else issues.push({ sev: 'low', key: 'cliche', title: `${ch.length} cliché${ch.length > 1 ? 's' : ''} / filler phrase${ch.length > 1 ? 's' : ''}`, detail: `Found: ${ch.slice(0, 5).join(', ')}${ch.length > 5 ? '…' : ''}.`, fix: 'Replace empty phrases with specific, provable accomplishments.' });

  // 7. dates
  if (p.dateRanges.length >= 1) { score += W.dates; passed.push('Employment dates detected'); }
  else issues.push({ sev: 'med', key: 'dates', title: 'No clear employment dates', detail: 'ATS builds your timeline from date ranges. None were detected.', fix: 'Add "MMM YYYY – MMM YYYY" (or "– Present") to each role.' });

  // 8. keyword match vs JD
  if (usableJD) {
    score += round(W.keyword * km.pct / 100);
    if (km.pct >= 70) passed.push(`Strong keyword match with the job (${km.pct}%)`);
    else issues.push({ sev: km.pct < 45 ? 'high' : 'med', key: 'keyword', title: `Low keyword match (${km.pct}%)`, detail: `Your résumé is missing ${km.missing.length} of the job’s top terms.`, fix: `Naturally work in the missing ones you genuinely have: ${km.missing.slice(0, 10).join(', ')}.` });
  }

  // parser-warning (advisory — can't see layout from text, but warn proactively)
  const parserWarning = {
    title: 'Will the ATS even read it?',
    detail: 'Tables, columns, text boxes, images, icons and info in headers/footers routinely get scrambled or dropped by ATS parsers.',
    fix: 'Export a single-column, plain layout. Tip: copy your résumé and paste it here as plain text — if it comes out jumbled, the ATS sees that too.'
  };

  score = clamp(round(score), 0, 100);
  const order = { high: 0, med: 1, low: 2 };
  issues.sort((a, b) => order[a.sev] - order[b.sev]);

  const band = score >= 80 ? 'strong' : score >= 60 ? 'ok' : score >= 40 ? 'weak' : 'critical';

  return {
    score, band,
    issues, passed,
    topFixes: issues.slice(0, 3),
    keyword: km,
    stats: { words: p.wordCount, bullets: p.bulletCount, actionBullets: actionBullets(p).length, quantified: quantifiedBullets(p).length, sections: p.sectionsFound },
    // raw signals so a UI can fully localize issue text by `key` (no English residue)
    detected: {
      email: p.email, phone: p.phone,
      cliches: clichesFound(p),
      hasDates: (p.dateRanges.length >= 1 || p.years.length >= 2),
      missingSections: need.filter(s => !p.sectionsFound[s])
    },
    parserWarning,
    hasJD: usableJD
  };
}

function toJSON(a) { return JSON.stringify(a, null, 2); }
function toReport(a) {
  const L = [`ATS SCORE: ${a.score}/100 (${a.band})`, ''];
  L.push('TOP FIXES:');
  a.topFixes.forEach((f, i) => L.push(`  ${i + 1}. [${f.sev.toUpperCase()}] ${f.title} — ${f.fix}`));
  if (a.keyword) { L.push('', `KEYWORD MATCH: ${a.keyword.pct}% (missing: ${a.keyword.missing.slice(0, 12).join(', ')})`); }
  L.push('', 'WHAT PASSED:');
  a.passed.forEach(p => L.push('  ✓ ' + p));
  return L.join('\n');
}

const ParsedEngine = {
  parseResume, actionBullets, quantifiedBullets, clichesFound,
  extractKeywords, keywordMatch, analyze, toJSON, toReport,
  ACTION_VERBS, CLICHES, SECTIONS
};

export { ParsedEngine };
export default ParsedEngine;
if (typeof window !== 'undefined') window.ParsedEngine = ParsedEngine;
