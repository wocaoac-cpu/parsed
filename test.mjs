// Parsed engine tests — deterministic résumé/ATS checks. Run: node test.mjs
import { ParsedEngine as E } from './engine.js';

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
function eq(a, b, m) { ok(a === b, `${m} — got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); }
const has = (a, k) => a.issues.some(i => i.key === k);

const GOOD = `Jane Smith
jane.smith@email.com | (555) 123-4567 | linkedin.com/in/janesmith

Summary
Senior software engineer with 8 years building scalable web applications and leading small teams.

Experience
Senior Software Engineer, Acme Corp — Jan 2020 – Present
• Led migration to microservices, reduced p95 latency 40%
• Built a CI pipeline that cut deploy time from 30 minutes to 5 minutes
• Mentored 4 junior engineers and improved code review turnaround 25%
• Drove adoption of typed APIs across 12 services

Software Engineer, Beta Inc — Jun 2016 – Dec 2019
• Developed REST APIs serving 2M requests per day
• Increased automated test coverage from 45% to 90%
• Reduced infrastructure cost $120k per year by right-sizing instances

Education
BS Computer Science, State University — 2016

Skills
JavaScript, Python, React, Node.js, AWS, Docker, Kubernetes, PostgreSQL`;

const BAD = `John Doe
Looking for a job. I am a hard worker and team player, responsible for many things.
I worked at some places doing stuff. Detail-oriented self-starter with synergy.`;

// ---- parse ----
const pg = E.parseResume(GOOD);
ok(pg.email, 'good: email detected');
ok(pg.phone, 'good: phone detected');
ok(pg.link, 'good: link detected');
eq(pg.sectionsFound.experience, true, 'good: experience section');
eq(pg.sectionsFound.education, true, 'good: education section');
eq(pg.sectionsFound.skills, true, 'good: skills section');
eq(pg.bulletCount, 7, 'good: bullet count');
ok(pg.dateRanges.length >= 2, 'good: date ranges');

// action verbs + quantification
eq(E.actionBullets(pg).length, 7, 'good: all bullets start with action verbs');
ok(E.quantifiedBullets(pg).length >= 6, 'good: most bullets quantified');
eq(E.clichesFound(pg).length, 0, 'good: no cliches');

// ---- analyze: good ----
const ag = E.analyze(GOOD);
ok(ag.score >= 80, `good: score strong (${ag.score})`);
eq(ag.band, 'strong', 'good: band strong');
ok(!has(ag, 'contact'), 'good: no contact issue');
ok(!has(ag, 'sections'), 'good: no sections issue');
ok(!has(ag, 'quant'), 'good: no quantification issue');
ok(Array.isArray(ag.passed) && ag.passed.length >= 4, 'good: several passed checks');

// ---- analyze: bad ----
const ab = E.analyze(BAD);
ok(ab.score < 30, `bad: score low (${ab.score})`);
eq(ab.band, 'critical', 'bad: band critical');
ok(has(ab, 'contact'), 'bad: contact issue flagged');
ok(has(ab, 'sections'), 'bad: sections issue flagged');
ok(has(ab, 'quant'), 'bad: quantification issue flagged');
ok(has(ab, 'cliche'), 'bad: cliche issue flagged');
ok(ab.issues.some(i => i.key === 'length'), 'bad: length issue flagged');
eq(ab.topFixes.length, 3, 'bad: 3 top fixes surfaced');
eq(ab.topFixes[0].sev, 'high', 'bad: top fix is high severity');

// cliche detection specifics
const ch = E.clichesFound(E.parseResume(BAD));
ok(ch.includes('hard worker'), 'bad: detects "hard worker"');
ok(ch.includes('team player'), 'bad: detects "team player"');
ok(ch.length >= 4, 'bad: multiple cliches');

// ---- keyword match ----
const kw = E.extractKeywords('We need a senior React developer with strong Python and Kubernetes experience. AWS and Docker required.');
ok(kw.some(k => k.word === 'react'), 'jd: react extracted');
ok(kw.some(k => k.word === 'kubernetes'), 'jd: kubernetes extracted');
ok(!kw.some(k => k.word === 'the' || k.word === 'with'), 'jd: stopwords excluded');

const km = E.keywordMatch(GOOD, 'React developer with Python, Kubernetes, AWS, Docker, and GraphQL experience.');
ok(km.matched.includes('react'), 'match: react present in resume');
ok(km.matched.includes('python'), 'match: python present');
ok(km.matched.includes('kubernetes'), 'match: kubernetes present');
ok(km.missing.includes('graphql'), 'match: graphql missing');
ok(km.pct > 0 && km.pct <= 100, 'match: pct in range');
eq(E.keywordMatch(GOOD, ''), null, 'no JD -> null match');
eq(E.keywordMatch(GOOD, null), null, 'null JD -> null match');

// analyze with JD adds keyword block + issue when low
const ajd = E.analyze(GOOD, 'Rust Go Elixir Scala Haskell blockchain Solidity quantum');
ok(ajd.keyword && ajd.keyword.pct < 50, 'jd: low match computed');
ok(has(ajd, 'keyword'), 'jd: low keyword match flagged as issue');
ok(ajd.hasJD === true, 'jd: hasJD true');

// ---- edge cases ----
const empty = E.analyze('');
ok(empty.score === 0 || empty.score < 20, 'empty: low score');
ok(Array.isArray(empty.issues) && empty.issues.length > 0, 'empty: issues present');
ok(E.parseResume('').wordCount === 0, 'empty: zero words');
ok(E.analyze(GOOD).parserWarning && E.analyze(GOOD).parserWarning.title.length > 0, 'parser warning always present');

// score bounds
ok(ag.score <= 100 && ab.score >= 0, 'scores within 0-100');

// ---- exports ----
const rep = E.toReport(ab);
ok(rep.includes('ATS SCORE:'), 'report has score line');
ok(rep.includes('TOP FIXES'), 'report has top fixes');
ok(JSON.parse(E.toJSON(ag)).score === ag.score, 'json parseable');

// ---- robustness (hardening from Codex audit) ----
ok(!E.parseResume('jane@x.com\n2020 - 2024').phone, 'date range is not a phone');
ok(E.parseResume('(415) 555-0182').phone, 'real phone detected');
ok(!E.parseResume('jane@company..com').email, 'double-dot domain rejected');
// keyword whole-token match (no substring inflation)
const kmReact = E.keywordMatch('I am highly reactive and use NoSQL', 'React SQL');
ok(!kmReact.matched.includes('react'), 'React not matched by "reactive"');
ok(!kmReact.matched.includes('sql'), 'SQL not matched by "NoSQL"');
// short tech terms survive
const kt = E.extractKeywords('Need Go and C# and R and machine learning').map(k => k.word);
ok(kt.includes('go'), 'extract: Go kept');
ok(kt.includes('c#'), 'extract: C# kept');
// JD with only stopwords -> null (no false 0% penalty)
eq(E.keywordMatch('resume text', 'the and or with for'), null, 'stopword-only JD -> null');
// quantification: bare years/versions are not "quantified"
ok(E.quantifiedBullets({ bulletLines: ['• Shipped Java 17 in 2024'] }).length === 0, 'version/year not quantified');
ok(E.quantifiedBullets({ bulletLines: ['• Cut load time 40%'] }).length === 1, 'percentage is quantified');
ok(E.quantifiedBullets({ bulletLines: ['• Served 2M requests/day'] }).length === 1, 'unit metric is quantified');
// dates require a real range, not just stray years
const strayYears = E.analyze('Education\nDegree 2016\nAward 2024\nSkills\nThings');
ok(strayYears.issues.some(i => i.key === 'dates'), 'stray years do not satisfy dates');
// black-circle bullet glyph counted
eq(E.parseResume('● Led the team\n● Built the app').bulletCount, 2, 'black-circle bullets counted');

// ---- report ----
console.log(`\nParsed engine tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail) { console.log('\nFAILURES:'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
else console.log('ALL GREEN ✓');
