// Additional Codex adversarial edge-case tests for ParsedEngine.
// Run: node test_codex.mjs
import { ParsedEngine as E } from './engine.js';

let pass = 0;
let fail = 0;
const fails = [];

function ok(condition, message) {
  if (condition) pass++;
  else {
    fail++;
    fails.push(message);
  }
}

function eq(actual, expected, message) {
  ok(actual === expected, `${message} -- got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

const has = (analysis, key) => analysis.issues.some(issue => issue.key === key);

const dateRangeNoPhone = `Jane Doe
jane@example.com
Experience
Engineer, Acme 2020 - 2024
Education
BS Computer Science 2019
Skills
JavaScript, React`;
const parsedDateRangeNoPhone = E.parseResume(dateRangeNoPhone);
eq(parsedDateRangeNoPhone.phone, false, 'phone: a year range is not a phone number');
ok(has(E.analyze(dateRangeNoPhone), 'contact'), 'contact: email plus date range should still be missing a phone');

eq(E.parseResume(`Jane Doe
jane@example.com
555\u2013123\u20134567`).phone, true, 'phone: en-dash separated phone should be detected');

eq(E.parseResume(`Jane Doe
jane@company..com
(555) 123-4567`).email, false, 'email: consecutive dots in domain should not be accepted');

const reactiveMatch = E.keywordMatch('Built reactive services for internal tooling.', 'React');
ok(reactiveMatch.missing.includes('react') && !reactiveMatch.matched.includes('react'), 'keywords: React should not match reactive');

const nosqlMatch = E.keywordMatch('Built NoSQL indexes for customer data.', 'SQL');
ok(nosqlMatch.missing.includes('sql') && !nosqlMatch.matched.includes('sql'), 'keywords: SQL should not match NoSQL');

const shortTechKeywords = E.extractKeywords('C# Go React developer');
ok(shortTechKeywords.some(k => k.word === 'c#'), 'keywords: C# should be retained');
ok(shortTechKeywords.some(k => k.word === 'go'), 'keywords: Go should be retained');

const baseline = `Jane Doe
jane@example.com
(555) 123-4567
Experience
Engineer, Acme Jan 2020 - Present
- Led migration, reduced latency 40%
- Built APIs for 200 users
- Improved onboarding by 30%
- Managed 5 engineers
- Automated 10 hours of reporting
Education
BS Computer Science 2019
Skills
React, Node.js, AWS, Docker, Kubernetes, Python`;
const stopwordOnlyJD = E.analyze(baseline, 'and the of to in');
ok(!has(stopwordOnlyJD, 'keyword'), 'keywords: stopword-only JD should not create a keyword issue');

eq(E.parseResume('\u25cf Led migration by 20%').bulletCount, 1, 'bullets: black-circle bullet glyph should be recognized');

eq(E.quantifiedBullets(E.parseResume('- Used Java 17 and React 18')).length, 0, 'quant: version numbers are not quantified accomplishments');
eq(E.quantifiedBullets(E.parseResume('- Joined project in 2024')).length, 0, 'quant: a year alone is not a quantified accomplishment');

const unrelatedYears = `Jane Doe
jane@example.com
(555) 123-4567
Experience
Engineer
Education
BS Computer Science 2016
Skills
JavaScript
Award 2024`;
ok(has(E.analyze(unrelatedYears), 'dates'), 'dates: unrelated years should not satisfy employment date detection');

const weirdInputs = [null, undefined, 0, false, 42, { toString() { return 'Jane jane@example.com (555) 123-4567'; } }, Symbol('resume')];
ok(weirdInputs.every(input => {
  const analysis = E.analyze(input);
  return Number.isFinite(analysis.score) && analysis.score >= 0 && analysis.score <= 100 && Number.isFinite(analysis.stats.words);
}), 'robustness: non-string inputs should return finite bounded scores');

const hugeAnalysis = E.analyze('Experience\n- Led launch by 20%\n'.repeat(2000));
ok(Number.isFinite(hugeAnalysis.score) && hugeAnalysis.score >= 0 && hugeAnalysis.score <= 100, 'robustness: huge input should return a finite bounded score');

console.log(`\nCodex edge tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail) {
  console.log('\nFAILURES:');
  fails.forEach(f => console.log('  X ' + f));
  process.exit(1);
} else {
  console.log('ALL GREEN');
}
