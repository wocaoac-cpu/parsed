import { ParsedEngine as E } from './engine.js';

/* ===================== static UI strings ===================== */
const I18N = {
  en: {
    lock: '100% local · résumé never uploaded',
    kicker: 'ATS RÉSUMÉ CHECK · 100% IN YOUR BROWSER',
    h1: ['75% of résumés are rejected by a robot ', 'before', ' a human sees them.'],
    lede: 'Paste your résumé and get an instant <b>ATS score (0–100)</b>, the exact reasons automated systems reject you, and a fix for each — all in your browser. Not a single word is uploaded. Free, no sign-up.',
    resume_label: 'Your résumé (paste as plain text)', resume_ph: 'Paste your résumé text here…',
    jd_toggle: 'Add a job description for keyword match (optional)', jd_ph: 'Paste the job description…',
    sample: 'Try a sample', check: 'Check my résumé',
    t1: 'Never uploaded', t2: 'Free, no signup', t3: 'Instant',
    f1: 'Project 0034 · built by Claude on the Opportunity Radar',
    disc: 'Heuristic checks model common ATS behavior — guidance, not a guarantee any specific system parses identically. Everything runs in your browser; your résumé never leaves this page.',
    err_empty: 'Paste your résumé first (or click "Try a sample").',
    err_short: 'That looks too short to analyze — paste your full résumé.',
    band_critical: 'Critical', band_weak: 'Needs work', band_ok: 'Decent', band_strong: 'ATS-ready',
    issues_n: '{n} issue{s} are getting you auto-rejected. Fix these first:',
    issues_0: 'No major red flags. A few optional polish items below.',
    kw_title: 'Keyword match with the job', kw_have: 'Found in your résumé', kw_missing: 'Missing from your résumé',
    st_words: 'Words', st_bullets: 'Bullets', st_verbs: 'Action-verb bullets', st_quant: 'Quantified bullets',
    passed_title: "What's working", parser_h: 'Will the ATS even read it?',
    parser_p: 'Tables, columns, text boxes, images, icons and info in headers/footers routinely get scrambled or dropped by ATS parsers.',
    parser_f: 'Export a single-column, plain layout. Tip: copy your résumé and paste it here — if it comes out jumbled, the ATS sees that too.',
    copy: 'Copy report', copyjson: 'Export JSON', copied: 'Copied ✓',
    sev_high: 'critical', sev_med: 'fix', sev_low: 'polish', recheck: 'Re-check'
  },
  zh: {
    lock: '100% 本地 · 简历绝不上传',
    kicker: 'ATS 简历体检 · 100% 浏览器本地运行',
    h1: ['75% 的简历在', '人看到之前', '就被机器拒了。'],
    lede: '粘贴简历，立刻得到 <b>ATS 评分（0–100）</b>+ 正在自动拒掉你的具体原因 + 逐项怎么修——全程在你浏览器本地跑，一个字都不上传。免费，免注册。',
    resume_label: '你的简历（粘贴为纯文本）', resume_ph: '把简历文本粘到这里…',
    jd_toggle: '加上目标职位 JD 做关键词匹配（可选）', jd_ph: '把职位描述粘到这里…',
    sample: '用示例试试', check: '体检我的简历',
    t1: '绝不上传', t2: '免费免注册', t3: '即时出分',
    f1: '项目 0034 · 机会雷达上由 Claude 建造',
    disc: '启发式检查模拟常见 ATS 行为——是参考非保证（不代表某个具体系统解析完全一致）。全程在你浏览器本地运行，简历不离开本页面。',
    err_empty: '先粘上你的简历（或点"用示例试试"）。',
    err_short: '内容太短没法分析——请粘上完整简历。',
    band_critical: '危险', band_weak: '待改进', band_ok: '尚可', band_strong: 'ATS 友好',
    issues_n: '有 {n} 项正在让你被自动拒。先修这些：',
    issues_0: '没有大问题。下面是几项可选的润色。',
    kw_title: '与职位的关键词匹配', kw_have: '简历里已命中', kw_missing: '简历里缺失',
    st_words: '词数', st_bullets: '要点数', st_verbs: '动词开头要点', st_quant: '量化要点',
    passed_title: '做得好的地方', parser_h: 'ATS 到底读不读得了？',
    parser_p: '表格、分栏、文本框、图片、图标，以及放在页眉/页脚里的信息，经常被 ATS 解析器打乱或直接丢掉。',
    parser_f: '导出单栏、朴素排版。小技巧：把简历复制粘到这里——如果粘出来是乱的，ATS 看到的也是乱的。',
    copy: '复制报告', copyjson: '导出 JSON', copied: '已复制 ✓',
    sev_high: '严重', sev_med: '要修', sev_low: '润色', recheck: '重新体检'
  },
  uk: {
    lock: '100% локально · резюме не завантажується',
    kicker: 'ATS-ПЕРЕВІРКА РЕЗЮМЕ · 100% У ВАШОМУ БРАУЗЕРІ',
    h1: ['75% резюме відсіює робот ', 'ще до', ' того, як його побачить людина.'],
    lede: 'Встав резюме й отримай миттєву <b>ATS-оцінку (0–100)</b>, точні причини автоматичних відмов і виправлення для кожної — усе у твоєму браузері. Жодне слово не завантажується. Безкоштовно, без реєстрації.',
    resume_label: 'Твоє резюме (встав як простий текст)', resume_ph: 'Встав текст резюме сюди…',
    jd_toggle: 'Додати опис вакансії для збігу ключових слів (опційно)', jd_ph: 'Встав опис вакансії…',
    sample: 'Спробувати приклад', check: 'Перевірити резюме',
    t1: 'Не завантажується', t2: 'Безкоштовно, без реєстрації', t3: 'Миттєво',
    f1: 'Проєкт 0034 · створено Claude на Radar можливостей',
    disc: 'Евристичні перевірки моделюють типову поведінку ATS — це поради, а не гарантія, що конкретна система парсить так само. Усе працює у браузері; резюме не залишає цю сторінку.',
    err_empty: 'Спершу встав резюме (або натисни «Спробувати приклад»).',
    err_short: 'Замало тексту для аналізу — встав повне резюме.',
    band_critical: 'Критично', band_weak: 'Треба доробити', band_ok: 'Непогано', band_strong: 'Готове до ATS',
    issues_n: '{n} проблем(и) спричиняють автоматичну відмову. Виправ це першим:',
    issues_0: 'Серйозних проблем немає. Нижче — кілька опційних покращень.',
    kw_title: 'Збіг ключових слів з вакансією', kw_have: 'Є в резюме', kw_missing: 'Бракує в резюме',
    st_words: 'Слів', st_bullets: 'Пунктів', st_verbs: 'Пункти з дієсловом', st_quant: 'Пункти з цифрами',
    passed_title: 'Що добре', parser_h: 'Чи ATS взагалі це прочитає?',
    parser_p: 'Таблиці, колонки, текстові поля, зображення, іконки та дані в колонтитулах часто спотворюються або зникають у парсерах ATS.',
    parser_f: 'Експортуй просте одноколонкове резюме. Порада: скопіюй резюме і встав сюди — якщо вийде каша, ATS бачить те саме.',
    copy: 'Копіювати звіт', copyjson: 'Експорт JSON', copied: 'Скопійовано ✓',
    sev_high: 'критично', sev_med: 'виправити', sev_low: 'полірування', recheck: 'Перевірити знову'
  }
};

const SECTION_NAMES = {
  en: { experience: 'Experience', education: 'Education', skills: 'Skills' },
  zh: { experience: '工作经历', education: '教育', skills: '技能' },
  uk: { experience: 'Досвід', education: 'Освіта', skills: 'Навички' }
};

/* localized issue text by key (title + detail + fix), built from raw analysis data */
const LIS = {
  en: {
    contact: a => ({ title: 'Missing contact details', detail: `${a.detected.email ? '' : 'No email detected. '}${a.detected.phone ? '' : 'No phone detected.'}`.trim() || 'Contact info may be in a header the ATS can’t read.', fix: 'Put a plain-text email and phone at the very top — not inside a header/footer.' }),
    sections: a => ({ title: 'Missing standard section(s)', detail: `ATS looks for clearly labeled sections. Missing: ${a.detected.missingSections.map(s => SECTION_NAMES.en[s]).join(', ')}.`, fix: 'Use conventional headings: "Experience", "Education", "Skills".' }),
    length: a => a.stats.words < 400 ? ({ title: 'Résumé looks too short', detail: `Only ${a.stats.words} words. Thin résumés read as junior or incomplete.`, fix: 'Aim for ~400–800 words: add quantified accomplishments.' }) : ({ title: 'Résumé may be too long', detail: `${a.stats.words} words — likely 3+ pages.`, fix: 'Trim to 1–2 pages; cut old or irrelevant roles.' }),
    bullets: a => ({ title: 'Too few bullet points', detail: `Only ${a.stats.bullets} bullet lines. Recruiters and ATS skim bullets, not paragraphs.`, fix: 'Turn dense paragraphs into 3–6 bullets per role.' }),
    verbs: a => ({ title: 'Weak bullet openers', detail: `Only ${a.stats.actionBullets} of ${a.stats.bullets} bullets start with an action verb.`, fix: 'Start every bullet with a strong verb: Led, Built, Increased, Reduced…' }),
    quant: a => ({ title: 'Accomplishments aren’t quantified', detail: `Only ${a.stats.quantified} bullet(s) include numbers. "Improved performance" is ignored; "cut load time 40%" isn’t.`, fix: 'Add metrics to ≥⅓ of bullets: %, $, time saved, scale.' }),
    cliche: a => ({ title: `${a.detected.cliches.length} cliché/filler phrase(s)`, detail: `Found: ${a.detected.cliches.slice(0, 5).join(', ')}${a.detected.cliches.length > 5 ? '…' : ''}.`, fix: 'Replace empty phrases with specific, provable results.' }),
    dates: a => ({ title: 'No clear employment dates', detail: 'ATS builds your timeline from date ranges; none were detected.', fix: 'Add "MMM YYYY – MMM YYYY" (or "– Present") to each role.' }),
    keyword: a => ({ title: `Low keyword match (${a.keyword.pct}%)`, detail: `Missing ${a.keyword.missing.length} of the job’s top terms.`, fix: `Work in the ones you genuinely have: ${a.keyword.missing.slice(0, 10).join(', ')}.` })
  },
  zh: {
    contact: a => ({ title: '缺少联系方式', detail: `${a.detected.email ? '' : '没检测到邮箱。'}${a.detected.phone ? '' : '没检测到电话。'}`.trim() || '联系方式可能放在 ATS 读不到的页眉里。', fix: '把纯文本的邮箱和电话放在最顶部——别塞进页眉/页脚。' }),
    sections: a => ({ title: '缺少标准章节', detail: `ATS 会找清晰标注的章节。缺：${a.detected.missingSections.map(s => SECTION_NAMES.zh[s]).join('、')}。`, fix: '用常规标题：「工作经历」「教育」「技能」。' }),
    length: a => a.stats.words < 400 ? ({ title: '简历太短', detail: `只有 ${a.stats.words} 词。太单薄会显得资历浅或不完整。`, fix: '目标 ~400–800 词：给每段经历加量化成果。' }) : ({ title: '简历可能太长', detail: `${a.stats.words} 词——多半超过 3 页。`, fix: '精简到 1–2 页；砍掉过旧或不相关的经历。' }),
    bullets: a => ({ title: '要点太少', detail: `只有 ${a.stats.bullets} 条要点行。招聘方和 ATS 扫的是要点，不是大段文字。`, fix: '把大段文字拆成每段经历 3–6 条要点。' }),
    verbs: a => ({ title: '要点开头太弱', detail: `${a.stats.bullets} 条要点里只有 ${a.stats.actionBullets} 条用动词开头。`, fix: '每条要点都用强动词开头：主导、搭建、提升、降低……' }),
    quant: a => ({ title: '成果没有量化', detail: `只有 ${a.stats.quantified} 条要点含数字。「提升了性能」会被无视，「把加载时间砍了 40%」不会。`, fix: '给至少 ⅓ 的要点加数据：%、$、省下的时间、规模。' }),
    cliche: a => ({ title: `${a.detected.cliches.length} 处套话/废话`, detail: `发现：${a.detected.cliches.slice(0, 5).join('、')}${a.detected.cliches.length > 5 ? '…' : ''}。`, fix: '把空话换成具体、可验证的成果。' }),
    dates: a => ({ title: '没有清晰的任职时间', detail: 'ATS 靠时间区间拼你的时间线；一个都没检测到。', fix: '给每段经历加「YYYY.MM – YYYY.MM」（或「– 至今」）。' }),
    keyword: a => ({ title: `关键词匹配偏低（${a.keyword.pct}%）`, detail: `缺了职位 ${a.keyword.missing.length} 个高频词。`, fix: `把你确实具备的补进去：${a.keyword.missing.slice(0, 10).join('、')}。` })
  },
  uk: {
    contact: a => ({ title: 'Бракує контактів', detail: `${a.detected.email ? '' : 'Не знайдено email. '}${a.detected.phone ? '' : 'Не знайдено телефон.'}`.trim() || 'Контакти можуть бути в колонтитулі, який ATS не читає.', fix: 'Додай email і телефон простим текстом угорі — не в колонтитулі.' }),
    sections: a => ({ title: 'Бракує стандартних розділів', detail: `ATS шукає чітко позначені розділи. Бракує: ${a.detected.missingSections.map(s => SECTION_NAMES.uk[s]).join(', ')}.`, fix: 'Використовуй звичні заголовки: «Досвід», «Освіта», «Навички».' }),
    length: a => a.stats.words < 400 ? ({ title: 'Резюме закоротке', detail: `Лише ${a.stats.words} слів. Тонке резюме читається як неповне.`, fix: 'Орієнтуйся на ~400–800 слів: додай вимірювані досягнення.' }) : ({ title: 'Резюме задовге', detail: `${a.stats.words} слів — ймовірно 3+ сторінки.`, fix: 'Скороти до 1–2 сторінок; прибери старі/нерелевантні ролі.' }),
    bullets: a => ({ title: 'Замало пунктів', detail: `Лише ${a.stats.bullets} пунктів. ATS і рекрутери сканують пункти, не абзаци.`, fix: 'Перетвори абзаци на 3–6 пунктів на роль.' }),
    verbs: a => ({ title: 'Слабкий початок пунктів', detail: `Лише ${a.stats.actionBullets} з ${a.stats.bullets} пунктів починаються дієсловом.`, fix: 'Починай кожен пункт сильним дієсловом: Керував, Створив, Збільшив…' }),
    quant: a => ({ title: 'Досягнення без цифр', detail: `Лише ${a.stats.quantified} пункт(и) з числами. «Покращив» ігнорується; «скоротив на 40%» — ні.`, fix: 'Додай метрики у ≥⅓ пунктів: %, $, час, масштаб.' }),
    cliche: a => ({ title: `${a.detected.cliches.length} шаблонн(их) фраз`, detail: `Знайдено: ${a.detected.cliches.slice(0, 5).join(', ')}${a.detected.cliches.length > 5 ? '…' : ''}.`, fix: 'Заміни пусті фрази конкретними результатами.' }),
    dates: a => ({ title: 'Немає чітких дат роботи', detail: 'ATS будує таймлайн з дат; жодної не знайдено.', fix: 'Додай «MMM РРРР – MMM РРРР» (або «– зараз») до кожної ролі.' }),
    keyword: a => ({ title: `Низький збіг ключових слів (${a.keyword.pct}%)`, detail: `Бракує ${a.keyword.missing.length} ключових термінів вакансії.`, fix: `Додай ті, що справді маєш: ${a.keyword.missing.slice(0, 10).join(', ')}.` })
  }
};

/* ===================== sample ===================== */
const SAMPLE_RESUME = `Alex Rivera
alex.rivera@email.com  |  (415) 555-0182  |  linkedin.com/in/alexrivera

Summary
Product marketer who loves a good spreadsheet. Hard worker and team player.

Experience
Marketing Lead, Brightly  —  2021 to Present
- Ran the email program and social channels
- Responsible for the blog and helped with events
- Worked with sales on campaigns

Marketing Coordinator, NorthPeak  —  2019 to 2021
- Did social media and some reporting
- Helped grow the newsletter

Education
BA Communications, City College, 2019`;

const SAMPLE_JD = `We are hiring a Growth Marketing Manager. You will own paid acquisition, SEO, marketing analytics, A/B testing, lifecycle email, and conversion optimization. Experience with HubSpot, Google Analytics, and SQL is required.`;

/* ===================== state ===================== */
let lang = 'en', last = null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (k) => (I18N[lang] && I18N[lang][k] != null) ? I18N[lang][k] : I18N.en[k];
const BAND_COLOR = { critical: 'var(--crit)', weak: 'var(--weak)', ok: 'var(--ok)', strong: 'var(--strong)' };
const BAND_CLASS = { critical: 'colorcrit', weak: 'colorweak', ok: 'colorok', strong: 'colorstrong' };

/* ===================== render ===================== */
function check() {
  $('#err').style.display = 'none';
  const resume = $('#resume').value.trim();
  if (!resume) { showErr('err_empty'); return; }
  if (resume.length < 80) { showErr('err_short'); return; }
  const jd = $('#jd').value.trim();
  last = E.analyze(resume, jd);
  render(last);
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function showErr(k) { const e = $('#err'); e.textContent = t(k); e.style.display = 'block'; }

function render(a) {
  const R = $('#results');
  const realIssues = a.issues; // already sorted by severity
  const bandColor = BAND_COLOR[a.band];

  // scorecard
  const headline = realIssues.length
    ? t('issues_n').replace('{n}', realIssues.length).replace('{s}', lang === 'en' && realIssues.length === 1 ? '' : (lang === 'en' ? 's' : ''))
    : t('issues_0');
  const scorecard = `<div class="scorecard">
    <div class="gauge" style="background:conic-gradient(${bandColor} ${a.score * 3.6}deg, var(--bg2) 0)">
      <div class="gv"><b class="${BAND_CLASS[a.band]}">${a.score}</b><small>/ 100 ATS</small></div>
    </div>
    <div class="sc-r">
      <div class="band ${BAND_CLASS[a.band]}">${esc(t('band_' + a.band))}</div>
      <h2>${esc(headline)}</h2>
    </div>
  </div>`;

  // fixes (all issues, localized by key)
  const sevLabel = { high: t('sev_high'), med: t('sev_med'), low: t('sev_low') };
  const fixes = realIssues.map((iss, i) => {
    const L = (LIS[lang][iss.key] || LIS.en[iss.key]);
    const o = L ? L(a) : { title: iss.title, detail: iss.detail, fix: iss.fix };
    return `<div class="fix ${iss.sev}">
      <div class="n">${i + 1}</div>
      <div>
        <div class="ftitle">${esc(o.title)}<span class="sev ${iss.sev}">${esc(sevLabel[iss.sev])}</span></div>
        <div class="fdetail">${esc(o.detail)}</div>
        <div class="ffix"><b>→</b> ${esc(o.fix)}</div>
      </div>
    </div>`;
  }).join('');
  const fixesBlock = realIssues.length ? `<div class="fixes">${fixes}</div>` : '';

  // keyword block
  let kwBlock = '';
  if (a.hasJD && a.keyword) {
    const k = a.keyword, col = k.pct >= 70 ? 'var(--strong)' : k.pct >= 45 ? 'var(--weak)' : 'var(--crit)';
    const hit = k.matched.slice(0, 18).map(w => `<span class="chip hit">${esc(w)}</span>`).join('');
    const miss = k.missing.slice(0, 18).map(w => `<span class="chip miss">${esc(w)}</span>`).join('');
    kwBlock = `<div class="block"><h3><span class="dot" style="background:var(--acc)"></span>${esc(t('kw_title'))}</h3>
      <div class="kwbar"><span class="kwpct" style="color:${col}">${k.pct}%</span><div class="kwtrack"><div class="kwfill" style="width:${k.pct}%;background:${col}"></div></div></div>
      ${miss ? `<div class="chips-h">${esc(t('kw_missing'))}</div><div class="chips">${miss}</div>` : ''}
      ${hit ? `<div class="chips-h">${esc(t('kw_have'))}</div><div class="chips">${hit}</div>` : ''}
    </div>`;
  }

  // stats
  const s = a.stats;
  const stats = `<div class="block"><h3><span class="dot" style="background:var(--acc)"></span>${esc(t('passed_title'))}</h3>
    <div class="statrow">
      <div class="stat"><div class="sv">${s.words}</div><div class="sl">${esc(t('st_words'))}</div></div>
      <div class="stat"><div class="sv">${s.bullets}</div><div class="sl">${esc(t('st_bullets'))}</div></div>
      <div class="stat"><div class="sv">${s.actionBullets}</div><div class="sl">${esc(t('st_verbs'))}</div></div>
      <div class="stat"><div class="sv">${s.quantified}</div><div class="sl">${esc(t('st_quant'))}</div></div>
    </div>
    ${a.passed.length ? `<div class="passed" style="margin-top:14px">${a.passed.map(p => `<div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--strong)" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>${esc(localizePassed(p))}</div>`).join('')}</div>` : ''}
  </div>`;

  const parser = `<div class="parser"><h3>${esc(t('parser_h'))}</h3><p>${esc(t('parser_p'))}</p><p class="pf"><b>→</b> ${esc(t('parser_f'))}</p></div>`;

  const toolbar = `<div class="toolbar"><button class="btn" id="exCopy">${esc(t('copy'))}</button><button class="btn" id="exJson">${esc(t('copyjson'))}</button></div>`;

  R.innerHTML = scorecard + fixesBlock + (kwBlock ? `<div class="grid2">${kwBlock}${stats}</div>` : stats) + parser + toolbar;
  R.classList.add('show');
  $('#exCopy').addEventListener('click', e => copyReport(e.target));
  $('#exJson').addEventListener('click', () => download('parsed-report.json', E.toJSON(a), 'application/json'));
}

// passed checks come from engine in English; map the common ones to localized text
function localizePassed(p) {
  if (lang === 'en') return p;
  const M = {
    zh: [[/contact info/i, '联系方式（邮箱+电话）齐全'], [/standard sections/i, '标准章节齐全（经历/教育/技能）'], [/length looks right/i, '篇幅合适'], [/action verbs/i, '要点用动词开头'], [/quantified results/i, '要点含量化成果'], [/no filler/i, '没有套话废话'], [/employment dates/i, '检测到任职时间'], [/keyword match/i, '与职位关键词匹配好']],
    uk: [[/contact info/i, 'Контакти присутні (email+телефон)'], [/standard sections/i, 'Стандартні розділи присутні'], [/length looks right/i, 'Обсяг доречний'], [/action verbs/i, 'Пункти з дієсловами'], [/quantified results/i, 'Пункти з цифрами'], [/no filler/i, 'Без шаблонних фраз'], [/employment dates/i, 'Дати роботи виявлено'], [/keyword match/i, 'Добрий збіг ключових слів']]
  };
  const rules = M[lang] || [];
  for (const [re, txt] of rules) if (re.test(p)) return txt;
  return p;
}

/* ===================== export ===================== */
function download(name, content, type) {
  const blob = new Blob([content], { type }), url = URL.createObjectURL(blob);
  const el = document.createElement('a'); el.href = url; el.download = name; el.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyReport(btn) {
  const txt = E.toReport(last);
  try { await navigator.clipboard.writeText(txt); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e2) {} ta.remove();
  }
  const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => btn.textContent = old, 1500);
}

/* ===================== language ===================== */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  $$('[data-i]').forEach(el => {
    const k = el.dataset.i;
    if (k === 'h1') { const a = t('h1'); el.innerHTML = `${esc(a[0])}<em>${esc(a[1])}</em>${esc(a[2])}`; return; }
    const v = t(k);
    if (k === 'lede') el.innerHTML = v; else el.textContent = v;
  });
  $$('[data-ph]').forEach(el => el.placeholder = t(el.dataset.ph));
  $$('.langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  try { localStorage.setItem('parsed_lang', lang); } catch (e) {}
  if (last) render(last);
}

/* ===================== init ===================== */
function init() {
  try {
    const saved = localStorage.getItem('parsed_lang');
    lang = (saved && I18N[saved]) ? saved : 'en';  // English-first public face; zh/uk via switcher (persisted)
  } catch (e) {}
  applyLang();

  $$('.langs button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; applyLang(); }));
  $('#btnCheck').addEventListener('click', check);
  $('#jdToggle').addEventListener('click', () => {
    const body = $('#jdBody'); body.classList.toggle('open');
    $('#jdChev').textContent = body.classList.contains('open') ? '−' : '+';
  });
  $('#btnSample').addEventListener('click', () => {
    $('#resume').value = SAMPLE_RESUME; $('#jd').value = SAMPLE_JD;
    $('#jdBody').classList.add('open'); $('#jdChev').textContent = '−';
    check();
  });
}
init();
