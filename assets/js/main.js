/* ganbayard.github.io — boot sequence, interactive shell, matrix rain, section reveal */
(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── clock (Ulaanbaatar) ─────────────────────── */
  const tz = 'Asia/Ulaanbaatar';
  const tFmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  const dFmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, day: '2-digit', month: 'short', year: '2-digit' });
  const longFmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  function tick() {
    const now = new Date();
    $$('[data-clock]').forEach((el) => { el.textContent = 'UB ' + tFmt.format(now); });
    $$('[data-date]').forEach((el) => { el.textContent = dFmt.format(now); });
  }
  tick();
  setInterval(tick, 15000);
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── skills tree summary ─────────────────────── */
  const treeSum = $('#tree-sum');
  if (treeSum) {
    const dirs = $$('#skills .tree > ul > li').length;
    const files = $$('#skills .lvs > span').length;
    treeSum.textContent = `${dirs} directories, ${files} files`;
  }

  /* ── smooth jump helper ──────────────────────── */
  function go(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  /* ── terminal ────────────────────────────────── */
  const out = $('#term-out');
  const form = $('#term-form');
  const input = $('#term-input');
  const term = $('#term');
  const PS1 = 'ganbayard@quantlabs:~$';

  let skip = reduce;
  const sleep = (ms) => (skip ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));
  const scrollOut = () => { out.scrollTop = out.scrollHeight; };

  function print(html, cls) {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p);
    scrollOut();
    return p;
  }
  function promptLine(cmdText) {
    return print(`<span class="ps1">${PS1}</span> ${esc(cmdText)}`);
  }
  async function typeCmd(cmdText) {
    const p = print(`<span class="ps1">${PS1}</span> <span class="typed"></span>`);
    const span = p.querySelector('.typed');
    for (const ch of cmdText) {
      if (skip) { span.textContent = cmdText; break; }
      span.textContent += ch;
      await sleep(38 + Math.random() * 40);
    }
    scrollOut();
  }

  const ROLE = [
    'I build systems where markets, documents, and AI agents meet.',
    'R&amp;D Architect at <span class="amb">QuantLabs</span>: Building <span class="ok">Ⓘntelligence ⎈rchestration</span> pipelines for Quant Research and Systematic Trading.',
  ];

  async function boot() {
    out.innerHTML = '';
    const OK = '<span class="ok">[  OK  ]</span>';
    const lines = [
      `${OK} Started ganbayard.sys secure boot.`,
      `${OK} Loaded modules: quant · ml-platform · distributed-systems.`,
      `${OK} Mounted /dev/intelligence.`,
      `${OK} Verified credentials: CKA.`,
      `${OK} Reached target: Ulaanbaatar (TLS 1.3).`,
    ];
    for (const l of lines) { print(l, 'dim'); await sleep(140); }
    await sleep(260);
    await typeCmd('whoami');
    await sleep(160);
    print('Ganbayar Damdindorj (ganbayard)', 'hi');
    await sleep(320);
    await typeCmd('cat role.txt');
    await sleep(160);
    ROLE.forEach((l) => print(l));
    await sleep(200);
    print('type <span class="amb">help</span> to explore, or just scroll.', 'dim');
    skip = true; // anything after boot is instant
  }

  /* commands */
  const SECTIONS = ['experience', 'projects', 'skills', 'certs', 'community', 'contact'];
  const ALIAS = { exp: 'experience', work: 'experience', proj: 'projects', education: 'certs', edu: 'certs', honors: 'certs', mlub: 'community', home: 'home', '~': 'home' };
  const resolve = (name) => {
    const n = (name || '').replace(/^\.?\/?/, '').replace(/\/$/, '').toLowerCase();
    if (SECTIONS.includes(n)) return n;
    return ALIAS[n] || null;
  };

  const COMMANDS = {
    help: () => [
      '<span class="hi">available commands</span>',
      '  <span class="ok">whoami</span>          who is this',
      '  <span class="ok">ls</span>              list sections',
      '  <span class="ok">cd</span> &lt;section&gt;    jump to a section  <span class="dim">(cd projects)</span>',
      '  <span class="ok">skills</span>          print the skill tree',
      '  <span class="ok">certs</span>           list certifications',
      '  <span class="ok">contact</span>         open channels',
      '  <span class="ok">date</span>            local time in Ulaanbaatar',
      '  <span class="ok">clear</span>           clear the screen',
      '<span class="dim">tip: ↑/↓ for history, tab to complete</span>',
    ],
    whoami: () => ['<span class="hi">Ganbayar Damdindorj (ganbayard)</span>', ...ROLE],
    ls: () => [SECTIONS.map((s) => `<span class="amb">${s}/</span>`).join('  ')],
    cd: (arg) => {
      if (!arg) { go('home'); return []; }
      const id = resolve(arg);
      if (!id) return [`<span class="err">cd: no such file or directory: ${esc(arg)}</span>`];
      go(id);
      return [`<span class="dim">→ /${id}</span>`];
    },
    skills: () => {
      const rows = $$('#skills .tree > ul > li');
      return ['<span class="ok">skills/</span>', ...rows.map((li, i) => {
        const br = li.querySelector('.br').textContent;
        const lv = $$('.lvs > span', li).map((s) => s.textContent).join(' · ');
        return `${i === rows.length - 1 ? '└──' : '├──'} <span class="amb">${esc(br)}</span> ${esc(lv)}`;
      })];
    },
    certs: () => [
      ...$$('#certs .cert__name').map((c) => `<span class="ok">[ ✔ ]</span> ${esc(c.textContent)}`),
      '<span class="amb">[ ★ ]</span> 1st place, Academic Conference',
    ],
    contact: () => $$('#contact .links a').map((a) => {
      const k = a.querySelector('.links__k').textContent.padEnd(9, ' ');
      return `<span class="ok">${esc(k)}</span> <a href="${esc(a.href)}" rel="noopener">${esc(a.querySelector('.links__v').textContent)}</a>`;
    }),
    date: () => [longFmt.format(new Date()) + ' <span class="dim">(Asia/Ulaanbaatar)</span>'],
    echo: (arg, raw) => [esc(raw)],
    pwd: () => ['/home/ganbayard'],
    clear: () => { out.innerHTML = ''; return []; },
    sudo: () => [
      '<span class="err">ganbayard is not in the sudoers file. This incident will be reported.</span>',
      '<span class="dim">(ethically, of course.)</span>',
    ],
    exit: () => ['logout? not yet. there is more to see. try <span class="amb">ls</span>.'],
  };
  COMMANDS.logout = COMMANDS.exit;
  COMMANDS.man = COMMANDS.help;

  const history = [];
  let hIdx = 0;

  function run(raw) {
    const line = raw.trim();
    promptLine(raw);
    if (!line) return;
    history.push(line);
    hIdx = history.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest[0];
    const name = cmd.toLowerCase();
    let res;
    if (COMMANDS[name]) {
      res = COMMANDS[name](arg, rest.join(' '));
    } else if (resolve(name) && !['skills', 'certs', 'contact'].includes(name)) {
      res = COMMANDS.cd(name);
    } else if (name === 'rm' && /-rf?/.test(arg || '')) {
      res = ['<span class="err">rm: refusing to remove \'/\': nice try.</span>'];
    } else {
      res = [`<span class="err">zsh: command not found: ${esc(cmd)}</span>`, '<span class="dim">type help for a list of commands</span>'];
    }
    res.forEach((l) => print(l));
  }

  function complete(value) {
    const parts = value.split(/\s+/);
    const pool = parts.length > 1 ? [...SECTIONS, 'home'] : [...Object.keys(COMMANDS), ...SECTIONS];
    const cur = parts[parts.length - 1].toLowerCase();
    if (!cur) return value;
    const hits = pool.filter((c) => c.startsWith(cur));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      return parts.join(' ') + (parts.length === 1 ? ' ' : '');
    }
    if (hits.length > 1) {
      promptLine(value);
      print(hits.join('  '), 'dim');
    }
    return value;
  }

  if (out && form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      skip = true;
      run(input.value);
      input.value = '';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (!history.length) return;
        e.preventDefault();
        hIdx = Math.max(0, hIdx - 1);
        input.value = history[hIdx];
      } else if (e.key === 'ArrowDown') {
        if (!history.length) return;
        e.preventDefault();
        hIdx = Math.min(history.length, hIdx + 1);
        input.value = history[hIdx] || '';
      } else if (e.key === 'Tab' && input.value.trim()) {
        e.preventDefault();
        input.value = complete(input.value);
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        out.innerHTML = '';
      }
    });
    term.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (window.getSelection && String(window.getSelection())) return;
      skip = true;
      input.focus({ preventScroll: true });
    });
    // any key during boot fast-forwards it
    window.addEventListener('keydown', () => { skip = true; }, { once: true });
    boot();
  }

  /* ── section heading typewriter + reveal ─────── */
  const heads = $$('.section .sh .cmd');
  heads.forEach((el) => { el.dataset.full = el.textContent; if (!reduce) el.textContent = ''; });

  async function typeHead(el) {
    const full = el.dataset.full;
    if (reduce || el.dataset.done) { el.textContent = full; return; }
    el.dataset.done = '1';
    for (const ch of full) {
      el.textContent += ch;
      await new Promise((r) => setTimeout(r, 32));
    }
  }

  const tabs = $$('#tmux-w a');
  const tabFor = (id) => tabs.find((a) => a.getAttribute('href') === '#' + id);

  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        const h = en.target.querySelector('.sh .cmd');
        if (h) typeHead(h);
        revealIO.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    $$('.section').forEach((s) => revealIO.observe(s));

    const winIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        tabs.forEach((a) => a.classList.remove('on'));
        const tab = tabFor(en.target.id);
        if (tab) {
          tab.classList.add('on');
          const list = tab.closest('ol');
          if (list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: tab.offsetLeft - 40, behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-win]').forEach((s) => winIO.observe(s));
  } else {
    $$('.section').forEach((s) => s.classList.add('in'));
    heads.forEach((el) => { el.textContent = el.dataset.full; });
  }

  /* ── matrix rain (hero only) ─────────────────── */
  const canvas = $('#rain');
  if (canvas && !reduce && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const glyphs = '01ABCDEF0123456789ГАНБАЯРДӨҮЖЭ<>/{}[]$#*';
    const fs = 16;
    let w = 0, h = 0, cols = 0, drops = [], last = 0, raf = 0, visible = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / fs);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -(h / fs)));
      ctx.fillStyle = '#07090a';
      ctx.fillRect(0, 0, w, h);
    }
    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 60) return;
      last = t;
      ctx.fillStyle = 'rgba(7, 9, 10, 0.14)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fs}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * fs;
        if (y > 0) {
          ctx.fillStyle = Math.random() < 0.035 ? '#e6fff0' : (Math.random() < 0.5 ? '#2fcf7c' : '#1a7a47');
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * fs, y);
        }
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }
    function start() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    resize();
    start();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(canvas);
    }
  }
})();
