# Parsed

**A free ATS résumé checker that runs 100% in your browser. See your ATS score, the exact reasons you're auto-rejected, and a keyword match against any job — without uploading your résumé anywhere.**

🔗 **Live: https://pd-8pj.pages.dev**

About **75% of résumés are filtered out by an Applicant Tracking System before a human ever reads them.** Most checkers that tell you why (Jobscan and friends) are paid, account-walled, and — the part that matters in 2026 — they upload your résumé to their servers. Parsed doesn't. Everything runs locally in your browser; your résumé never leaves the page.

## What it does

- **ATS score (0–100)** with a color-coded band and the headline: *how many things are getting you auto-rejected.*
- **Ranked, concrete fixes** — missing contact details, non-standard sections, no quantified results, weak bullet openers, filler clichés, missing dates — each with a specific "do this" fix.
- **Keyword match vs a job description** (optional) — whole-word match (so `React` ≠ `reactive`), with the exact terms you're missing.
- **Parser-failure warning** — the tables/columns/headers/images that silently break ATS parsing (the thing paid tools hide behind a paywall).
- **Private** — no upload, no account, no tracking. Static files; open DevTools and watch the network tab.
- **Trilingual** — English / 中文 / Українська.

## How it scores (deterministic, no AI)

Weighted, rule-based checks: contact info, standard sections, length, bullet density, action-verb openers, quantified accomplishments, cliché/filler, employment date ranges, and (with a JD) keyword coverage. Every number is computed from your text — there's no model and no server.

## Project structure

```
index.html      UI, styling, trilingual scaffold
engine.js       Deterministic résumé/ATS engine (no deps; browser + Node)
app.js          i18n, rendering, full localization of findings, export
test.mjs        63 assertions
test_codex.mjs  15 adversarial edge-case assertions
```

## Run the tests

```bash
node test.mjs
node test_codex.mjs
```

## Run locally

```bash
python -m http.server 8034
# open http://localhost:8034
```

## Note

These are heuristic checks that model common ATS behavior — guidance, not a guarantee that any specific system parses identically. Always tailor to the role.

## License

MIT — see [LICENSE](LICENSE).
