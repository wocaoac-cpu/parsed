/* ============================================================================
 * TJ NOVA LTD · 可复用英国 LTD 正规公司页脚组件  (site-footer.js)
 * ----------------------------------------------------------------------------
 * 用法（任何 HTML 页面）：
 *   1. 在 </body> 前加一行：  <script src="/lib/site-footer.js"></script>
 *   2. 在想放页脚的地方加：     <site-footer></site-footer>
 *      （不写也行——脚本会自动在 </body> 前补一个）
 *
 * 可选属性（覆盖默认值，一般无需动）：
 *   <site-footer base="/" lang="en"></site-footer>
 *     base = 法律页路径前缀（子站部署在子目录时用，默认 "/"）
 *     lang = 强制语言 en|zh|uk（默认读 <html lang> / localStorage / 浏览器）
 *
 * 设计：简洁、正规、国际化，适合英国 LTD 官网 / AI SaaS / API 平台。
 * 暗亮自适应（跟随 prefers-color-scheme + 宿主页 CSS 变量）。移动端自适应。
 * 英文优先（默认 en），支持 zh / uk 三语，跟随宿主页语言切换。
 *
 * 铁律：所有对外站点的公开页面都必须挂这个组件（见记忆 iron-rule-uk-ltd-footer）。
 * 改公司信息只改下面 COMPANY 一处，全站所有引用页同步生效。
 * ==========================================================================*/
(function () {
  "use strict";

  /* ====== 公司信息（唯一真源·改这里即可全站生效） ====== */
  var COMPANY = {
    name:        "TJ NOVA LTD",
    number:      "17308318",
    addressLine: "128 City Road, London, EC1V 2NX, United Kingdom",
    jurisdiction:"Registered in England and Wales",
    domain:      "tjnovaltd.com",
    support:     "support@tjnovaltd.com",
    security:    "security@tjnovaltd.com",
    business:    "support@tjnovaltd.com", /* 商务咨询暂用 support */
    year:        2026
  };

  /* ====== 法律链接（路径） ====== */
  var LINKS = [
    { href: "legal/terms",          i18n: { en: "Terms of Service",     zh: "服务条款",   uk: "Умови надання послуг" } },
    { href: "legal/privacy",        i18n: { en: "Privacy Policy",       zh: "隐私政策",   uk: "Політика конфіденційності" } },
    { href: "legal/cookies",        i18n: { en: "Cookie Policy",        zh: "Cookie 政策", uk: "Політика щодо файлів cookie" } },
    { href: "legal/refund",         i18n: { en: "Refund Policy",        zh: "退款政策",   uk: "Політика повернення коштів" } },
    { href: "legal/acceptable-use", i18n: { en: "Acceptable Use Policy",zh: "可接受使用政策", uk: "Політика допустимого використання" } },
    { href: "company",              i18n: { en: "Company",              zh: "公司",       uk: "Компанія" } },
    { href: "contact",              i18n: { en: "Contact",              zh: "联系我们",   uk: "Контакти" } }
  ];

  /* ====== 文案三语 ====== */
  var T = {
    en: {
      rights:   "All rights reserved.",
      regline:  COMPANY.name + " is a company registered in England and Wales.",
      number:   "Company Number",
      office:   "Registered Office",
      contact:  "Contact",
      security: "Security"
    },
    zh: {
      rights:   "保留所有权利。",
      regline:  COMPANY.name + " 是一家在英格兰和威尔士注册的公司。",
      number:   "公司注册号",
      office:   "注册地址",
      contact:  "联系邮箱",
      security: "安全邮箱"
    },
    uk: {
      rights:   "Усі права захищено.",
      regline:  COMPANY.name + " — компанія, зареєстрована в Англії та Уельсі.",
      number:   "Реєстраційний номер",
      office:   "Юридична адреса",
      contact:  "Контакт",
      security: "Безпека"
    }
  };

  function pickLang(forced) {
    if (forced && T[forced]) return forced;
    var htmlLang = (document.documentElement.getAttribute("lang") || "").slice(0, 2).toLowerCase();
    if (T[htmlLang]) return htmlLang;
    try {
      var ls = localStorage.getItem("lang") || localStorage.getItem("LANG");
      if (ls && T[ls.slice(0, 2)]) return ls.slice(0, 2);
    } catch (e) {}
    /* 英文优先：仅亚洲中文区显示中文，其余一律英文 */
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("zh") === 0) return "zh";
    if (nav.indexOf("uk") === 0) return "uk";
    return "en";
  }

  function normBase(b) {
    if (!b) b = "/";
    if (b.charAt(b.length - 1) !== "/") b += "/";
    return b;
  }

  /* 配色变量在 render() 里按宿主站实际背景/前景/强调色动态注入到每个 footer 的 inline style，
     让页脚和所在站融为一体（白底站→浅页脚配站点主色，暗底站→暗页脚）。CSS 里只写布局，颜色全走变量。 */
  var CSS = '\
.tjn-footer{\
  background:var(--_bg);color:var(--_fg);border-top:1px solid var(--_line);\
  font-family:var(--_font,-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,"Helvetica Neue",Arial,"Noto Sans SC",sans-serif);\
  padding:56px 34px 30px;box-sizing:border-box;line-height:1.6;font-size:14px}\
.tjn-footer *{box-sizing:border-box}\
.tjn-foot-in{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr;gap:48px}\
.tjn-brand{font-weight:600;font-size:1.05rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}\
.tjn-brand .seal{color:var(--_accent)}\
.tjn-legal{color:var(--_dim);font-size:.86rem;line-height:1.95}\
.tjn-legal b{color:var(--_fg);font-weight:600}\
.tjn-legal a{color:var(--_dim);text-decoration:none;border-bottom:1px solid var(--_line)}\
.tjn-legal a:hover{color:var(--_fg)}\
.tjn-kv{display:block}\
.tjn-meta{font-size:.78rem;color:var(--_faint);line-height:2.05;text-align:right}\
.tjn-meta a{color:var(--_faint);text-decoration:none;border-bottom:1px solid var(--_line)}\
.tjn-meta a:hover{color:var(--_fg)}\
.tjn-links{max-width:1240px;margin:40px auto 0;padding-top:22px;border-top:1px solid var(--_line);\
  display:flex;flex-wrap:wrap;gap:10px 22px}\
.tjn-links a{color:var(--_dim);text-decoration:none;font-size:.8rem;letter-spacing:.02em;white-space:nowrap}\
.tjn-links a:hover{color:var(--_fg)}\
.tjn-bottom{max-width:1240px;margin:22px auto 0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;\
  font-size:.74rem;color:var(--_faint);letter-spacing:.03em}\
.tjn-lang{display:flex;gap:6px;justify-content:flex-end}\
.tjn-meta:first-child .tjn-lang,.tjn-foot-in .tjn-lang{justify-content:flex-end}\
.tjn-lang button{background:none;border:1px solid var(--_line);color:var(--_faint);font:inherit;font-size:.7rem;letter-spacing:.06em;padding:3px 9px;border-radius:4px;cursor:pointer;transition:color .25s,border-color .25s}\
.tjn-lang button:hover{color:var(--_fg);border-color:var(--_accent)}\
.tjn-lang button.on{color:var(--_accent);border-color:var(--_accent)}\
@media(max-width:860px){.tjn-foot-in{grid-template-columns:1fr;gap:30px}.tjn-meta{text-align:left}.tjn-lang{justify-content:flex-start}.tjn-footer{padding:48px 20px 26px}}\
@media(prefers-reduced-motion:reduce){.tjn-footer a{transition:none}}';

  /* ---- 把任意 CSS 颜色解析成 [r,g,b]（借浏览器计算） ---- */
  function toRGB(str) {
    if (!str) return null;
    var m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) {
      var probe = document.createElement("span");
      probe.style.color = str; probe.style.display = "none";
      document.body.appendChild(probe);
      str = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
    }
    var p = m[1].split(",").map(function (x) { return parseFloat(x); });
    if (p.length >= 4 && p[3] === 0) return null; /* 透明不算 */
    return [p[0], p[1], p[2]];
  }
  function lum(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255; }
  function mix(a, b, w) { return [Math.round(a[0]*(1-w)+b[0]*w), Math.round(a[1]*(1-w)+b[1]*w), Math.round(a[2]*(1-w)+b[2]*w)]; }
  function rgbStr(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  /* ---- 嗅探宿主站配色：从 body 实际背景/前景 + 站点强调色，算出和站融为一体的页脚配色 ---- */
  function sniffPalette(el) {
    var bodyBg = toRGB(getComputedStyle(document.body).backgroundColor)
              || toRGB(getComputedStyle(document.documentElement).backgroundColor)
              || [14, 19, 17];
    var bodyFg = toRGB(getComputedStyle(document.body).color) || [237, 234, 227];
    var dark = lum(bodyBg) < 0.5;
    var black = [0, 0, 0], white = [255, 255, 255];

    /* 页脚背景：在站点背景基础上朝深/浅微调一档，形成"页脚区"但同色系不突兀 */
    var bg = dark ? mix(bodyBg, black, 0.28) : mix(bodyBg, black, 0.045);
    var fg = bodyFg;
    var dim = dark ? mix(fg, bodyBg, 0.32) : mix(fg, white, 0.28);
    var faint = dark ? mix(fg, bodyBg, 0.55) : mix(fg, white, 0.5);
    var line = dark ? rgba(white, 0.13) : rgba(black, 0.12);

    /* 强调色：优先用站点已声明的 --accent/--terra/--brand/--primary 等 CSS 变量；取不到才用品牌陶土橙 */
    var accent = "";
    var rootCS = getComputedStyle(document.documentElement);
    var vars = ["--accent", "--terra", "--brand", "--primary", "--color-primary", "--c-accent", "--theme", "--main"];
    for (var i = 0; i < vars.length; i++) {
      var v = (rootCS.getPropertyValue(vars[i]) || "").trim();
      if (v) { accent = v; break; }
    }
    if (!accent) accent = "#C8744A"; /* TJ 品牌陶土橙兜底 */

    /* 字体：继承站点 body 字体，跟站一致 */
    var font = getComputedStyle(document.body).fontFamily || "";

    el.style.setProperty("--_bg", rgbStr(bg));
    el.style.setProperty("--_fg", rgbStr(fg));
    el.style.setProperty("--_dim", rgbStr(dim));
    el.style.setProperty("--_faint", rgbStr(faint));
    el.style.setProperty("--_line", line);
    el.style.setProperty("--_accent", accent);
    if (font) el.style.setProperty("--_font", font);
  }

  function render(el) {
    var lang = pickLang(el.getAttribute("lang"));
    var base = normBase(el.getAttribute("base"));
    var t = T[lang];
    try { sniffPalette(el); } catch (e) {}

    var linksHtml = LINKS.map(function (l) {
      return '<a href="' + base + l.href + '">' + (l.i18n[lang] || l.i18n.en) + '</a>';
    }).join('<span aria-hidden="true" style="color:var(--_faint)">|</span>');

    var html =
      '<div class="tjn-foot-in">' +
        '<div>' +
          '<div class="tjn-brand">' + COMPANY.name + ' <span class="seal">· No. ' + COMPANY.number + '</span></div>' +
          '<div class="tjn-legal">' +
            '<span class="tjn-kv">' + t.regline + '</span>' +
            '<span class="tjn-kv"><b>' + t.number + ':</b> ' + COMPANY.number + '</span>' +
            '<span class="tjn-kv"><b>' + t.office + ':</b> ' + COMPANY.addressLine + '</span>' +
            '<span class="tjn-kv"><b>' + t.contact + ':</b> <a href="mailto:' + COMPANY.support + '">' + COMPANY.support + '</a></span>' +
            '<span class="tjn-kv"><b>' + t.security + ':</b> <a href="mailto:' + COMPANY.security + '">' + COMPANY.security + '</a></span>' +
          '</div>' +
        '</div>' +
        '<div class="tjn-meta">' +
          '<div>London · United Kingdom</div>' +
          '<div>' + COMPANY.jurisdiction + '</div>' +
          '<div><a href="mailto:' + COMPANY.support + '">' + COMPANY.support + '</a></div>' +
          '<div class="tjn-lang" style="margin-top:10px">' +
            '<button type="button" data-tjn-lang="en"' + (lang === "en" ? ' class="on"' : '') + '>EN</button>' +
            '<button type="button" data-tjn-lang="zh"' + (lang === "zh" ? ' class="on"' : '') + '>中文</button>' +
            '<button type="button" data-tjn-lang="uk"' + (lang === "uk" ? ' class="on"' : '') + '>UA</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<nav class="tjn-links" aria-label="Legal">' + linksHtml + '</nav>' +
      '<div class="tjn-bottom">' +
        '<span>© ' + COMPANY.year + ' ' + COMPANY.name + '. ' + t.rights + '</span>' +
        '<span>' + COMPANY.jurisdiction + ' · Company No. ' + COMPANY.number + '</span>' +
      '</div>';

    el.className = "tjn-footer";
    el.setAttribute("role", "contentinfo");
    el.innerHTML = html;

    /* 语言切换：改 <html lang> + 重渲染全部页脚 + 通知宿主页（若宿主有自己的 i18n） */
    var btns = el.querySelectorAll(".tjn-lang button");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        var lg = b.getAttribute("data-tjn-lang");
        document.documentElement.setAttribute("lang", lg);
        try { localStorage.setItem("lang", lg); } catch (e) {}
        /* 若宿主页有自己的语言切换器（如主站的 [data-lang] 按钮），一并触发，保持全站同步 */
        var hostBtn = document.querySelector('[data-lang="' + lg + '"]');
        if (hostBtn && hostBtn.click) { hostBtn.click(); }
        window.TJNFooter.refresh();
      });
    });
  }

  function injectCss() {
    if (document.getElementById("tjn-footer-css")) return;
    var s = document.createElement("style");
    s.id = "tjn-footer-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function boot() {
    injectCss();
    var nodes = document.querySelectorAll("site-footer");
    if (!nodes.length) {
      /* 页面没写标签 → 自动在 </body> 前补一个 */
      var auto = document.createElement("site-footer");
      document.body.appendChild(auto);
      nodes = [auto];
    }
    Array.prototype.forEach.call(nodes, render);
  }

  /* 暴露重渲染接口：宿主页切换语言后调用 window.TJNFooter.refresh() */
  window.TJNFooter = {
    refresh: function () { Array.prototype.forEach.call(document.querySelectorAll("site-footer"), render); },
    company: COMPANY
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
