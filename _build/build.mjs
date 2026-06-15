import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC_ASSETS = 'C:/claude/icf-lv1-clone/assets';
const OUT = 'C:/Github/vci-lv1';
const IMGDIR = path.join(OUT, 'images');
await mkdir(IMGDIR, { recursive: true });

const data = JSON.parse(await readFile('C:/claude/icf-lv1-clone/content.json', 'utf8'));
const S = data.sections;
const struct = JSON.parse(await readFile('C:/claude/icf-lv1-clone/struct.json', 'utf8'));

// ---- image handling ----
const usedImages = new Set();
function img(src) {
  if (!src) return '';
  const base = path.basename(src.split('?')[0]);
  usedImages.add(base);
  return 'images/' + base;
}
function bgImg(field) {
  if (!field) return '';
  return img(field);
}

const CTA = '#dang-ky'; // TODO: thay bằng link form đăng ký thật

// Section side/background images that live as CSS background-image in the source
// (not <img>), captured from the original design.
const NARR_IMG = {
  3: '67907c81141a59044ab77ad7-b5223465ba2c.jpeg', // "Thế giới đang thay đổi" — ảnh phải
  4: '67907c815d20c86fb0754742-c041dbfa63e2.jpeg', // "Trong thời đại bất ổn" — ảnh trái
};
const BENEFIT_PHOTO = '678bc672d06aae450db56722-307c4da0ea82.jpeg';

const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// helper: get section by index
const sec = i => S[i];

// ============ RENDER HELPERS ============
function ctaBtn(label, cls = '') {
  return `<a href="${CTA}" class="btn ${cls}">${esc(label)}</a>`;
}

// =================== BUILD SECTIONS ===================
let html = '';

// ---- HEADER (S0) ----
{
  const s = sec(0);
  const logos = s.imgs;
  html += `
<header class="site-header">
  <div class="container header-inner">
    <a href="#top" class="logo">${logos[0] ? `<img src="${img(logos[0].src)}" alt="VCI International">` : 'VCI'}</a>
    <div class="header-right">
      ${logos[1] ? `<img src="${img(logos[1].src)}" alt="ICF — International Coaching Federation" class="icf-badge">` : ''}
    </div>
  </div>
</header>`;
}

// ---- HERO (S1) ----
{
  const s = sec(1);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const h2 = s.heads.find(h => h.tag === 'H2');
  const bullets = s.paras.slice(0, 3);
  const photo = s.imgs.find(i => i.h > i.w && i.w > 0) || s.imgs.find(i => i.w > 300) || s.imgs[0];
  const badge = s.imgs.find(i => i.w > 300 && Math.abs(i.w - i.h) < 60);
  html += `
<section id="top" class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      ${badge ? `<img src="${img(badge.src)}" alt="ICF Accredited — Level 1" class="hero-badge">` : ''}
      <h1 class="display">${esc(h1?.text)}</h1>
      <p class="hero-sub">${esc(h2?.text)}</p>
      <ul class="hero-bullets">
        ${bullets.map(b => `<li>${esc(b)}</li>`).join('\n        ')}
      </ul>
      ${ctaBtn('TÌM HIỂU THÊM', 'btn-green')}
    </div>
    <div class="hero-media">
      ${photo ? `<img src="${img(photo.src)}" alt="Coach Trần Tiến Công" class="hero-photo">` : ''}
    </div>
  </div>
</section>`;
}

// ---- FOUNDER LETTER (S2) dark ----
{
  const s = sec(2);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const h2 = s.heads.find(h => h.tag === 'H2');
  const paras = s.paras;
  html += `
<section class="founder-letter" style="--bg:url('${bgImg(s.bg)}')">
  <div class="overlay"></div>
  <div class="container letter-inner">
    <h2 class="section-title light center">${esc(h1?.text)}</h2>
    <p class="letter-greet">${esc(h2?.text)}</p>
    ${paras.slice(0, paras.length).map(p => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
</section>`;
}

// ---- TWO NARRATIVE BLOCKS (S3, S4) — 2 cột text + ảnh, xen kẽ ----
for (const idx of [3, 4]) {
  const s = sec(idx);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const reverse = idx === 4; // S4: ảnh bên trái
  const photo = NARR_IMG[idx];
  html += `
<section class="narrative">
  <div class="container narr-grid${reverse ? ' reverse' : ''}">
    <div class="narr-copy">
      <h2 class="section-title sm">${esc(h1?.text)}</h2>
      ${s.paras.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
    <div class="narr-media">${photo ? `<img src="${img('assets/' + photo)}" alt="">` : ''}</div>
  </div>
</section>`;
}

// ---- WHY COACHING (S5) ----
{
  const s = sec(5);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const subs = s.heads.filter(h => h.tag === 'H2');
  const photo = s.imgs[0];
  // first H2 is the lead, next 3 are reasons; paras align to reasons (4 paras: 0 lead?,...)
  const lead = subs[0];
  const reasons = subs.slice(1);
  const rParas = s.paras; // 4 paras correspond to 3 reasons + closing
  html += `
<section class="why">
  <div class="container">
    <h2 class="section-title">${esc(h1?.text)}</h2>
    <p class="lead green">${esc(lead?.text)}</p>
    ${photo ? `<div class="why-photo"><img src="${img(photo.src)}" alt=""></div>` : ''}
    <div class="why-list">
      ${reasons.map((r, i) => `<div class="why-item">
        <h3 class="green">${esc(r.text)}</h3>
        <p>${esc(rParas[i] || '')}</p>
      </div>`).join('\n      ')}
    </div>
    ${rParas[3] ? `<p class="why-closing">${esc(rParas[3])}</p>` : ''}
  </div>
</section>`;
}

// ---- BENEFITS (S6) 6 cards ----
{
  const s = sec(6);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const lead = s.heads.find(h => h.tag === 'H2' && h.color.includes('115'));
  const cards = s.heads.filter(h => h.tag === 'H2' && !h.color.includes('115'));
  const paras = s.paras;
  const left = cards.slice(0, 3), right = cards.slice(3, 6);
  const benItem = (c, i) => `<div class="benefit-item"><h3>${esc(c.text)}</h3><p>${esc(paras[i] || '')}</p></div>`;
  html += `
<section class="benefits">
  <div class="container">
    <h2 class="section-title">${esc(h1?.text)}</h2>
    <p class="lead green">${esc(lead?.text)}</p>
    <div class="benefit-3col">
      <div class="benefit-col">${left.map((c, i) => benItem(c, i)).join('')}</div>
      <div class="benefit-photo"><img src="${img('assets/' + BENEFIT_PHOTO)}" alt=""></div>
      <div class="benefit-col">${right.map((c, i) => benItem(c, i + 3)).join('')}</div>
    </div>
  </div>
</section>`;
}

// ---- FOR WHOM (S7) dark 4 cards w/ images ----
{
  const s = sec(7);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const cards = s.heads.filter(h => h.tag === 'H2');
  const paras = s.paras;
  const imgs = s.imgs;
  html += `
<section class="for-whom" style="--bg:url('${bgImg(s.bg)}')">
  <div class="overlay"></div>
  <div class="container">
    <h2 class="section-title light center">${esc(h1?.text)}</h2>
    <div class="card-grid cols-2">
      ${cards.map((c, i) => `<div class="whom-card">
        ${imgs[i] ? `<img src="${img(imgs[i].src)}" alt="">` : ''}
        <div class="whom-body">
          <h3 class="lime">${esc(c.text)}</h3>
          <p>${esc(paras[i] || '')}</p>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- CERTIFICATE (S8) ----
{
  const s = sec(8);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const photo = s.imgs[0];
  html += `
<section class="certificate">
  <div class="container narrow center">
    <h2 class="section-title center">${esc(h1?.text)}</h2>
    <p>${esc(s.paras[0] || '')}</p>
    ${photo ? `<img src="${img(photo.src)}" alt="Chứng nhận quốc tế" class="cert-img">` : ''}
  </div>
</section>`;
}

// ---- WHAT YOU GET (S9) dark, 4 items ----
{
  const s = sec(9);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const items = s.heads.filter(h => h.tag === 'H2');
  const paras = s.paras;
  html += `
<section class="you-get" style="--bg:url('${bgImg(s.bg)}')">
  <div class="overlay"></div>
  <div class="container">
    <h2 class="section-title light center">${esc(h1?.text)}</h2>
    <div class="card-grid cols-2">
      ${items.map((c, i) => `<div class="get-card">
        <h3 class="lime">${esc(c.text)}</h3>
        <p>${esc(paras[i] || '')}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- 4 FEATURE BLOCKS (S10-13) alternating image/text ----
for (let k = 0; k < 4; k++) {
  const s = sec(10 + k);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const photo = s.imgs[s.imgs.length - 1] || s.imgs[0];
  const dark = s.heads[0]?.color.includes('255');
  html += `
<section class="feature ${k % 2 ? 'reverse' : ''} ${dark ? 'feature-dark' : ''}">
  <div class="container feature-grid">
    <div class="feature-media">${photo ? `<img src="${img(photo.src)}" alt="">` : ''}</div>
    <div class="feature-copy">
      <h2 class="section-title sm ${dark ? 'light' : ''}">${esc(h1?.text)}</h2>
      ${s.paras.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- 10 DIFFERENCES (S14) dark ----
{
  const s = sec(14);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const closing = s.heads.find(h => h.tag === 'H2');
  const items = s.heads.filter(h => h.tag === 'H4');
  // paras: pairs of [title, body]; pick bodies (odd indices)
  const bodies = s.paras.filter((_, i) => i % 2 === 1);
  html += `
<section class="differences" style="--bg:url('${bgImg(s.bg)}')">
  <div class="overlay"></div>
  <div class="container">
    <h2 class="section-title light center">${esc(h1?.text)}</h2>
    <div class="diff-grid">
      ${items.map((it, i) => `<div class="diff-item">
        <span class="diff-num">${i + 1}</span>
        <div><h3 class="light">${esc(it.text.replace(/^\d+\.\s*/, ''))}</h3><p>${esc(bodies[i] || '')}</p></div>
      </div>`).join('\n      ')}
    </div>
    ${closing ? `<p class="diff-closing light center">${esc(closing.text)}</p>` : ''}
  </div>
</section>`;
}

// ---- CURRICULUM MODULES (S15) — module + panel Mục tiêu/Nội dung ----
{
  const s = sec(15);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const curSec = struct.find(x => x.id === 'section-W58EyOU0jM');
  const rows = curSec ? curSec.rows.map(r => r.cols[0]?.items || []) : [];
  // overview row = the row whose first item mentions "Chương trình bao gồm"
  const ovRow = rows.find(items => items.some(it => /Chương trình bao gồm/.test(it.text || '')));
  const overview = ovRow ? [...new Set(ovRow.filter(it => it.t === 'li').map(it => it.text))] : [];
  // module rows = first heading starts with "Module"
  const modRows = rows.filter(items => /^Module/i.test(items[0]?.text || ''));
  function parseModule(items) {
    const m = { title: '', meta: [], intro: [], objective: '', content: [] };
    let mode = 'intro'; const seenI = new Set(), seenC = new Set();
    for (const it of items) {
      const t = (it.text || '').trim();
      if (it.t === 'h') {
        if (/^Module/i.test(t)) m.title = t;
        else if (/^(Hình thức|Thời lượng)/i.test(t)) m.meta.push(t);
        else if (/Mục tiêu/i.test(t)) mode = 'obj';
        else if (/Nội dung/i.test(t)) mode = 'content';
      } else if (it.t === 'li') {
        if (mode === 'intro' && !seenI.has(t)) { seenI.add(t); m.intro.push(t); }
      } else if (it.t === 'p') {
        if (mode === 'obj' && !m.objective) m.objective = t;
        else if (mode === 'content') { const c = t.replace(/^\d+\.\s*/, ''); if (c && !seenC.has(c)) { seenC.add(c); m.content.push(c); } }
      }
    }
    return m;
  }
  const modules = modRows.map(parseModule);
  html += `
<section class="curriculum">
  <div class="container">
    <h2 class="section-title center">${esc(h1?.text)}</h2>
    ${overview.length ? `<ul class="overview-list">${overview.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
    <div class="modules">
      ${modules.map(m => `<div class="module-card">
        <h3 class="green">${esc(m.title)}</h3>
        ${m.meta.map(mt => `<p class="module-meta">${esc(mt)}</p>`).join('\n        ')}
        ${m.intro.length ? `<ul class="module-intro">${m.intro.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
        ${m.objective ? `<details class="module-panel"><summary>Mục tiêu học tập</summary><div class="acc-body"><p>${esc(m.objective)}</p></div></details>` : ''}
        ${m.content.length ? `<details class="module-panel"><summary>Nội dung</summary><div class="acc-body"><ol>${m.content.map(c => `<li>${esc(c.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ol></div></details>` : ''}
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- PRICING CTA (S16) teal ----
{
  const s = sec(16);
  const h2top = s.heads.find(h => h.tag === 'H2');
  const tcaption = s.heads.filter(h => h.tag === 'H1');
  const benefits = s.paras.filter(p => /^(Chương trình đào tạo có cấu trúc|5 ngày học|4 phiên|10 giờ|Cơ hội|Định hướng)/.test(p));
  const priceOld = s.paras.find(p => /65\.000\.000/.test(p));
  const priceNew = s.paras.find(p => /58\.000\.000/.test(p));
  html += `
<section id="dang-ky" class="pricing">
  <div class="container">
    <p class="pricing-eyebrow">${esc(h2top?.text)}</p>
    <h2 class="display lime center">${esc(tcaption[0]?.text)}</h2>
    <div class="pricing-card">
      <h3>Bạn sẽ nhận được:</h3>
      <ul class="check-list">
        ${benefits.map(b => `<li>${esc(b)}</li>`).join('\n        ')}
      </ul>
      <div class="price">
        <span class="price-old">${esc(priceOld || 'Học phí: 65.000.000đ')}</span>
        <span class="price-new">${esc(priceNew || 'Ưu đãi: 58.000.000đ')} <small>cho Lớp Virtual</small></span>
      </div>
      ${ctaBtn('Đăng ký tư vấn', 'btn-lime btn-lg')}
      <p class="fineprint">*** Tất cả thông tin bạn cung cấp đều được bảo mật tuyệt đối.</p>
    </div>
  </div>
</section>`;
}

// ---- TESTIMONIALS GRID helper ----
function testimonialSection(idx, opts = {}) {
  const s = sec(idx);
  const h1s = s.heads.filter(h => h.tag === 'H1');
  const quotes = s.heads.filter(h => h.tag === 'H2');
  const imgs = s.imgs;
  // group paras into cards: each card = some body paras + name + role. Heuristic: name lines are short (<40) Title Case Vietnamese.
  // We'll just attach each quote (H2) with following paras until next; fallback simple.
  return { s, h1s, quotes, imgs };
}

// ---- TESTIMONIALS S17 ----
{
  const { s, h1s, quotes, imgs } = testimonialSection(17);
  const eyebrow = s.paras[0];
  html += `
<section class="testimonials">
  <div class="container">
    <h2 class="section-title green">${esc(h1s[0]?.text)}</h2>
    <p class="eyebrow">${esc(eyebrow)}</p>
    <div class="card-grid cols-3">
      ${quotes.map((q, i) => `<figure class="tcard">
        ${imgs[i] ? `<img src="${img(imgs[i].src)}" alt="">` : ''}
        <blockquote>${esc(q.text)}</blockquote>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- FOUNDER PROFILE (S18) dark ----
{
  const s = sec(18);
  const title = s.heads.find(h => h.tag === 'H1' && h.color.includes('255'));
  const name = s.heads.find(h => h.tag === 'H1' && h.color.includes('167'));
  const tags = s.heads.filter(h => h.tag === 'H2');
  const photo = s.imgs[0];
  html += `
<section class="founder-profile" style="--bg:url('${bgImg(s.bg)}')">
  <div class="overlay"></div>
  <div class="container founder-grid">
    <div class="founder-photo">${photo ? `<img src="${img(photo.src)}" alt="Trần Tiến Công">` : ''}</div>
    <div class="founder-copy">
      <h2 class="section-title light">${esc(title?.text)}</h2>
      <p class="founder-name lime">${esc(name?.text)}</p>
      <ul class="founder-tags">
        ${tags.map(t => `<li class="lime">${esc(t.text)}</li>`).join('\n        ')}
      </ul>
      ${s.paras.slice(0, 6).map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- ABOUT VCI (S19) accordion-ish 4 blocks ----
{
  const s = sec(19);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const intro = s.paras[0];
  const blocks = s.heads.filter(h => h.tag === 'H4');
  // bodies: bullet paras grouped by heading text occurrences
  html += `
<section class="about-vci">
  <div class="container">
    <h2 class="section-title">${esc(h1?.text)}</h2>
    <p class="lead">${esc(intro)}</p>
    <div class="accordion">
      ${blocks.map((b) => {
        // gather bullet paras belonging to this block: those starting with • after the block title
        const all = s.paras;
        const start = all.findIndex(p => p === b.text);
        let bodies = [];
        for (let j = start + 1; j < all.length; j++) {
          if (blocks.some(bl => bl.text === all[j])) break;
          if (all[j].startsWith('•')) bodies.push(all[j]);
        }
        // dedupe
        bodies = [...new Set(bodies)];
        return `<details class="acc-item">
        <summary>${esc(b.text)}</summary>
        <div class="acc-body">${bodies.map(x => `<p>${esc(x)}</p>`).join('')}</div>
      </details>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- TRANSFORMATION RESULTS (S20) ----
{
  const { s, h1s, quotes, imgs } = testimonialSection(20);
  html += `
<section class="results">
  <div class="container">
    <h2 class="section-title">${esc(h1s[0]?.text)} <span class="green">${esc(h1s[1]?.text || '')}</span></h2>
    <p class="lead">${esc(s.paras[0])}</p>
    <div class="card-grid cols-3">
      ${quotes.map((q) => `<div class="result-card teal-card">
        <blockquote>${esc(q.text)}</blockquote>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- PROGRAM INTRO (S21) dark teal ----
{
  const s = sec(21);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const h2 = s.heads.find(h => h.tag === 'H2');
  html += `
<section class="program-intro teal-bg">
  <div class="container narrow">
    <h2 class="display light">${esc(h1?.text)}</h2>
    <p class="lead lime">${esc(h2?.text)}</p>
    ${s.paras.map(p => `<p class="light-p">${esc(p)}</p>`).join('\n    ')}
  </div>
</section>`;
}

// ---- APPLY COACHING TESTIMONIALS (S22) ----
{
  const { s, h1s, quotes, imgs } = testimonialSection(22);
  html += `
<section class="testimonials alt">
  <div class="container">
    <h2 class="section-title center">${esc(h1s[0]?.text)} ${esc(h1s[1]?.text || '')}</h2>
    <div class="card-grid cols-3">
      ${quotes.map((q, i) => `<figure class="tcard">
        ${imgs[i] ? `<img src="${img(imgs[i].src)}" alt="">` : ''}
        <blockquote>${esc(q.text)}</blockquote>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// ---- GUARANTEE (S23) navy ----
{
  const s = sec(23);
  const h1 = s.heads.find(h => h.tag === 'H1');
  const photo = s.imgs[0];
  html += `
<section class="guarantee">
  <div class="container guarantee-grid">
    ${photo ? `<img src="${img(photo.src)}" alt="Cam kết" class="guarantee-badge">` : ''}
    <div>
      <h2 class="section-title light">${esc(h1?.text)}</h2>
      ${s.paras.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
      ${ctaBtn('Đăng ký ngay', 'btn-lime')}
    </div>
  </div>
</section>`;
}

// ---- FAQ (S24) ----
{
  const s = sec(24);
  const eyebrow = s.heads.find(h => h.tag === 'H2' && h.color.includes('115'));
  const h1 = s.heads.find(h => h.tag === 'H1');
  const closing = s.heads.find(h => h.tag === 'H2' && !h.color.includes('115'));
  const qs = s.heads.filter(h => h.tag === 'H4');
  // answers: for each question text, gather following paras until next question
  const all = s.paras;
  html += `
<section class="faq">
  <div class="container narrow">
    <p class="eyebrow green center">${esc(eyebrow?.text)}</p>
    <h2 class="section-title center">${esc(h1?.text)}</h2>
    <div class="accordion">
      ${qs.map(q => {
        const start = all.findIndex(p => p === q.text);
        let ans = [];
        for (let j = start + 1; j < all.length; j++) {
          if (qs.some(qq => qq.text === all[j])) break;
          ans.push(all[j]);
        }
        ans = [...new Set(ans)];
        return `<details class="acc-item">
        <summary>${esc(q.text)}</summary>
        <div class="acc-body">${ans.map(a => `<p>${esc(a)}</p>`).join('')}</div>
      </details>`;
      }).join('\n      ')}
    </div>
    <p class="faq-closing center">${esc(closing?.text)}</p>
    <div class="center">${ctaBtn('Đăng ký tư vấn', 'btn-green btn-lg')}</div>
  </div>
</section>`;
}

// ---- FOOTER (S25 + S26) ----
{
  const s = sec(25);
  const cp = sec(26).paras[0] || 'Copyrights 2024 | VCI International';
  const addr = s.paras.find(p => /Địa chỉ/.test(p));
  const phone = s.paras.find(p => /Điện thoại/.test(p));
  const email = s.paras.find(p => /Email/.test(p));
  const links = s.links.filter(l => l.href && l.href.startsWith('http'));
  const socialImgs = s.imgs;
  html += `
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <h3 class="light">${esc(s.heads.find(h=>h.tag==='H1')?.text)}</h3>
      ${addr ? `<p>${esc(addr)}</p>` : ''}
      ${phone ? `<p>${esc(phone)}</p>` : ''}
      ${email ? `<p>${esc(email)}</p>` : ''}
    </div>
    <div class="footer-links">
      <h4 class="light">Liên kết</h4>
      ${links.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.text)}</a>`).join('\n      ')}
    </div>
  </div>
  <div class="copyright">${esc(cp)}</div>
</footer>`;
}

// floating CTA
html += `
<a href="${CTA}" class="floating-cta">Đăng ký tư vấn</a>`;

// ---- WRAP ----
const page = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Transformation Coaching — VCI International</title>
<meta name="description" content="Transformation Coaching — Chứng nhận ICF Level 1, 75 giờ. Hành trình trở thành Coach chuyên nghiệp cùng VCI International.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap">
<link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
</body>
</html>`;

// minor source-text cleanups
const pageClean = page.replace(/CỦATRANSFORMATION/g, 'CỦA TRANSFORMATION');
await writeFile(path.join(OUT, 'index.html'), pageClean, 'utf8');

// ---- copy images ----
let copied = 0, missing = [];
for (const base of usedImages) {
  const src = path.join(SRC_ASSETS, base);
  if (existsSync(src)) { await copyFile(src, path.join(IMGDIR, base)); copied++; }
  else missing.push(base);
}
console.log('images used:', usedImages.size, 'copied:', copied, 'missing:', missing.length);
if (missing.length) console.log('MISSING:', missing.slice(0, 10));
console.log('index.html size:', page.length);
