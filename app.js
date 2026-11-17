/* Alegro Construction — data, interactions and motion. No build step required. */
(() => {
  'use strict';

  const CATS = {
    roads: 'Roads & bridges',
    buildings: 'Buildings',
    power: 'Power & solar',
    civil: 'Civil works',
    water: 'Water & boreholes'
  };
  const photo = (file, caption) => ({ src: `img/w/${file}.webp`, caption });

  const WORK = [
    { id: 'okigwe', cat: 'roads', title: 'Owerri–Okigwe Road', where: 'Imo State', kind: 'Road rehabilitation', text: 'A failed, waterlogged section rebuilt with drainage, stone base, asphalt, kerbs and markings.', photos: [photo('okigwe-4','Completed: surfaced, kerbed and marked'), photo('okigwe-1','Before: failed, waterlogged section'), photo('okigwe-2','Stone base laid'), photo('okigwe-3','Formation and sub-base')] },
    { id: 'concorde', cat: 'roads', title: 'Imo Concorde Hotel Avenue', where: 'New Owerri, Imo', kind: 'Dual carriageway', text: 'Dual carriageway with a kerbed median, street lighting and road markings.', photos: [photo('concorde-3','Completed dual carriageway with median'), photo('concorde-1','Road markings at the junction'), photo('concorde-2','Median and street lighting')] },
    { id: 'uyo', cat: 'roads', title: 'Awa–Imah Road', where: 'Uyo, Akwa Ibom', kind: 'Road construction', text: 'New road pavement, from base course preparation to asphalt surfacing.', photos: [photo('uyo-3','Asphalt surfacing'), photo('uyo-1','Base course prepared for surfacing'), photo('uyo-2','Base course prepared for surfacing')] },
    { id: 'emekuku', cat: 'roads', title: 'Awaka–Emekuku Road', where: 'Owerri North, Imo', kind: 'Road and drainage', text: 'Road reconstruction with asphalt surfacing and concrete side drains.', photos: [photo('emekuku-2','Asphalt surfacing'), photo('emekuku-1','Graded formation'), photo('emekuku-3','Finished surface'), photo('emekuku-4','Side drain formwork')] },
    { id: 'bridge', cat: 'roads', title: 'Bridge reconstruction', where: 'Nigeria', kind: 'Bridge replacement', text: 'A collapsed river crossing replaced with a new bridge deck, guard rails and approaches.', photos: [photo('bridge-4','Completed deck with guard rails'), photo('bridge-1','Before: collapsed crossing'), photo('bridge-2','Before: failed truss'), photo('bridge-3','Completed bridge from above')] },
    { id: 'walkway', cat: 'civil', title: '2 km concrete walkway, Ikorigho', where: 'Ilaje LGA, Ondo', year: '2022', client: 'Federal Ministry of Niger Delta Affairs', text: 'Rigid concrete walkway for a riverine community, on a 24-month programme.' },
    { id: 'uch', cat: 'buildings', title: 'NHIS Building, University College Hospital', where: 'Ibadan, Oyo', year: '2023', client: 'University College Hospital, Ibadan', text: 'Construction and furnishing under the 2022 Capital Project, Lot 3, in 16 weeks.' },
    { id: 'kubwa', cat: 'buildings', title: 'Plaza A, Section 2, The Kubwa Mall', where: 'Kubwa, Abuja', year: '2023', client: 'Urban Shelter Limited', text: 'Structural carcass construction of a commercial plaza section.' },
    { id: 'naf', cat: 'buildings', title: 'Four 4-bedroom detached duplexes', where: 'NAF-IAD Aviation Village', year: '2025', client: 'NAF Housing & Construction Company', text: 'Carcass construction of four fully detached duplexes on a 12-week programme.' },
    { id: 'nasrda', cat: 'buildings', title: 'Skills Acquisition & Youth Centre, Kwambai', where: 'Taraba State', year: '2025', client: 'National Space Research & Development Agency', text: 'Completion of the centre in the Yangtu Special Development Area, Taraba South.' },
    { id: 'solar', cat: 'power', title: 'Solar street lighting, Owo/Ose Federal Constituency', where: 'Ondo State', year: '2025', client: 'Benin-Owena River Basin Development Authority', text: 'Supply and installation of solar street lights (Lot B42) over three months.' }
  ];

  const SERVICES = [
    { title: 'Roads & Highways', cat: 'roads', image: 'emekuku-2', description: 'Rural roads to dual carriageways: flexible, rigid and hybrid pavements, drainage and erosion control.' },
    { title: 'Bridges & Civil Works', cat: 'roads', image: 'bridge-4', description: 'Bridges and culverts, earthworks, piling and foundations, walkways, reservoirs and dams.' },
    { title: 'Building Construction', cat: 'buildings', image: 'svc-building', description: 'Design, bills of quantities, construction and supervision of estates, hospitals, malls and halls.' },
    { title: 'Boreholes & Water', cat: null, image: 'svc-drilling', description: 'Geophysical survey, deep borehole drilling, treatment plants, storage tanks and reticulation.' },
    { title: 'Power & Solar', cat: 'power', image: 'svc-lights', description: 'Rural electrification, overhead lines, transformers and solar street lighting systems.' },
    { title: 'Project Management & Supply', cat: null, image: 'site-engineer', description: 'Planning, site supervision, quality control and procurement for public and private clients.' }
  ];

  const PLANT = [
    photo('eq-paver','Blaw-Knox paver laying asphalt'),
    photo('plant-batching','20 m³ portable concrete batching plant'),
    photo('eq-dozer','CAT D6R crawler dozer'),
    photo('plant-grader','Motor grader on road formation'),
    photo('eq-roller','Caterpillar vibratory roller'),
    photo('plant-roller2','Tandem roller'),
    photo('plant-compactor','Ride-on compactor'),
    photo('eq-tipper','Tipper truck for haulage'),
    photo('site-loader','Wheel loader on earthworks'),
    photo('eq-excavator','CAT 325CL hydraulic excavator'),
    photo('eq-rig','Truck-mounted borehole drilling rig')
  ];

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  // Triangular line networks: equilateral lattice, crosses at nodes, dashed edges with a triangle marker. Same
  // node > group > segment structure as the reference artwork so the draw animations can target it.
  const buildTriNetwork = (svg) => {
    const [W, H] = svg.dataset.tri.split('x').map(Number);
    const DX = 165.2, DY = DX * Math.sqrt(3) / 2, M = 20.2;
    const SEG = [[26.8, 40.2], [46.9, 67.0], [93.8, 113.9], [120.6, 134.0]];
    const PT = 80.4;
    let seed = Number(svg.dataset.seed || 1);
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const n = v => +v.toFixed(2);
    const rows = [];
    for (let r = 0; M + r * DY < H - 10; r++) {
      const off = r % 2 ? DX / 2 : 0;
      const row = [];
      for (let k = 0; M + off + k * DX < W - 5; k++) row.push([M + off + k * DX, M + r * DY]);
      rows.push(row);
    }
    const out = [];
    rows.forEach((row, ri) => row.forEach(([x, y], ci) => {
      const parts = [`<g><line class="tri-cross" x1="${n(x - 20)}" y1="${n(y)}" x2="${n(x + 20)}" y2="${n(y)}"/><line class="tri-cross" x1="${n(x)}" y1="${n(y - 20)}" x2="${n(x)}" y2="${n(y + 20)}"/></g>`];
      const targets = [];
      if (row[ci + 1]) targets.push(row[ci + 1]);
      (rows[ri + 1] || []).forEach(next => { if (Math.abs(Math.hypot(next[0] - x, next[1] - y) - DX) < 1) targets.push(next); });
      targets.forEach(([nx, ny]) => {
        if (random() < .15) return;
        const L = Math.hypot(nx - x, ny - y), ux = (nx - x) / L, uy = (ny - y) / L;
        const seg = ([a, b]) => `<line class="tri-seg" x1="${n(x + ux * a)}" y1="${n(y + uy * a)}" x2="${n(x + ux * b)}" y2="${n(y + uy * b)}"/>`;
        const cx = x + ux * PT, cy = y + uy * PT, s = 4.2;
        parts.push(`<g>${seg(SEG[0])}${seg(SEG[1])}<polygon class="tri-pt" points="${n(cx)},${n(cy - s)} ${n(cx + s * .952)},${n(cy + s * .62)} ${n(cx - s * .952)},${n(cy + s * .62)}"/>${seg(SEG[2])}${seg(SEG[3])}</g>`);
      });
      out.push(`<g data-name="node">${parts.join('')}</g>`);
    }));
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.aspectRatio = `${W} / ${H}`;
    svg.innerHTML = `<g>${out.join('')}</g>`;
  };
  document.querySelectorAll('[data-tri]').forEach(buildTriNetwork);
  // Keep the artwork sparse like the reference: cut each network down to data-keep nodes (seeded, so it is stable).
  document.querySelectorAll('[data-keep]').forEach((svg, k) => {
    const keep = Number(svg.dataset.keep);
    let seed = Number(svg.dataset.seed || 7 + k * 13);
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    Array.from(svg.querySelectorAll("[data-name='node']")).map(node => ({ node, r: rnd() })).sort((a, b) => a.r - b.r).slice(keep).forEach(({ node }) => node.remove());
  });

  // Services, project filtering and lightbox render only on pages that contain them (see pending-sections.html).
  if (document.getElementById('serviceGrid')) {
  // Services and project filtering retain every item from the supplied artifact.
  document.getElementById('serviceGrid').innerHTML = SERVICES.map((service, index) => {
    const related = service.cat ? WORK.filter(item => item.cat === service.cat || item.cat === service.also).length : 0;
    return `<article class="service-card reveal">
      <span class="service-number">${String(index + 1).padStart(2,'0')}</span>
      <div class="service-image"><img src="img/w/${service.image}.webp" alt="${escapeHTML(service.title)}" loading="lazy"></div>
      <div class="service-content"><h3>${escapeHTML(service.title)}</h3><p>${escapeHTML(service.description)}</p>
      ${related ? `<button type="button" data-filter="${service.cat}">See ${related} related project${related > 1 ? 's' : ''} →</button>` : '<span class="none">Ask us about recent work</span>'}</div>
    </article>`;
  }).join('');

  const filters = document.getElementById('filters');
  const projectGrid = document.getElementById('projectGrid');
  let currentCategory = 'all';
  const categoryNames = { all: 'All work', roads: 'Roads & bridges', civil: 'Civil works', buildings: 'Buildings', power: 'Power & solar' };
  filters.innerHTML = Object.keys(categoryNames).map(cat => `<button type="button" data-category="${cat}" aria-pressed="${cat === 'all'}">${categoryNames[cat]} <em>${cat === 'all' ? WORK.length : WORK.filter(item => item.cat === cat).length}</em></button>`).join('');

  function renderProjects() {
    const filtered = currentCategory === 'all' ? WORK : WORK.filter(item => item.cat === currentCategory);
    projectGrid.innerHTML = filtered.map(item => {
      const body = `<div class="project-body"><div class="project-meta mono"><span>${escapeHTML(item.kind || item.year)}</span><span>${escapeHTML(item.where)}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p><span class="project-cat">${escapeHTML(CATS[item.cat])}</span></div>`;
      if (item.photos) {
        return `<button class="project-card" type="button" data-open="${item.id}"><div class="project-thumb"><img src="${item.photos[0].src}" alt="${escapeHTML(item.title)}" loading="lazy"><span class="photo-count">${item.photos.length} photos</span></div>${body}</button>`;
      }
      return `<article class="project-card"><div class="award-face"><span class="tag">Contract award · ${item.year}</span><strong>${escapeHTML(item.client)}</strong></div>${body}</article>`;
    }).join('');
  }
  function filterProjects(category, scroll = false) {
    currentCategory = category;
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    renderProjects();
    if (scroll) { const work = document.getElementById('work'); if (window.lenis) window.lenis.scrollTo(work, { offset: -(document.querySelector('.site-head')?.offsetHeight || 0) }); else work.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }); }
    if (window.gsap && !reducedMotion.matches) {
      gsap.fromTo(projectGrid.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .04, clearProps: 'opacity,transform', overwrite: true });
    }
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (button) filterProjects(button.dataset.category);
  });
  renderProjects();

  // Keep a balanced two-wide-plus-one gallery, opening the full plant set in the lightbox.
  const galleryOrder = [0,2,1,3,4,5,6];
  document.getElementById('plantGallery').innerHTML = galleryOrder.map(index => {
    const item = PLANT[index];
    const wide = [0,2,1].includes(index);
    return `<button type="button" class="${wide ? 'wide' : ''}" data-plant="${index}" aria-label="Enlarge ${escapeHTML(item.caption)}"><img src="${item.src}" alt="${escapeHTML(item.caption)}" loading="lazy"></button>`;
  }).join('');

  // Native accessible photo dialog with thumbnails and keyboard navigation.
  const dialog = document.getElementById('photoDialog');
  const lbImage = document.getElementById('lbImage');
  let photoSet = [];
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + photoSet.length) % photoSet.length;
    const item = photoSet[photoIndex];
    lbImage.src = item.src;
    lbImage.alt = item.caption;
    document.getElementById('lbCaption').textContent = item.caption;
    document.getElementById('lbCount').textContent = `${photoIndex + 1} / ${photoSet.length}`;
    document.querySelectorAll('#lbThumbs button').forEach((button, i) => button.setAttribute('aria-current', String(i === photoIndex)));
  }
  function openGallery(title, meta, photos, start = 0) {
    photoSet = photos;
    document.getElementById('lbTitle').textContent = `${title} · ${meta}`;
    document.getElementById('lbMeta').textContent = 'Click a thumbnail or use the arrow keys';
    document.getElementById('lbThumbs').innerHTML = photos.map((item, i) => `<button type="button" data-photo="${i}" aria-label="Photo ${i + 1}"><img src="${item.src}" alt=""></button>`).join('');
    document.getElementById('lbPrev').hidden = photos.length < 2;
    document.getElementById('lbNext').hidden = photos.length < 2;
    showPhoto(start);
    if (!dialog.open) dialog.showModal();
  }
  document.addEventListener('click', event => {
    const projectButton = event.target.closest('[data-open]');
    const plantButton = event.target.closest('[data-plant]');
    const filterButton = event.target.closest('[data-filter]');
    if (projectButton) {
      const project = WORK.find(item => item.id === projectButton.dataset.open);
      if (project?.photos) openGallery(project.title, project.kind, project.photos);
    }
    if (plantButton) openGallery('Plant & equipment', 'Alegro fleet', PLANT, Number(plantButton.dataset.plant));
    if (filterButton) filterProjects(filterButton.dataset.filter, true);
  });
  document.getElementById('lbThumbs').addEventListener('click', event => {
    const thumb = event.target.closest('[data-photo]');
    if (thumb) showPhoto(Number(thumb.dataset.photo));
  });
  document.getElementById('lbPrev').addEventListener('click', () => showPhoto(photoIndex - 1));
  document.getElementById('lbNext').addEventListener('click', () => showPhoto(photoIndex + 1));
  document.getElementById('lbClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(photoIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(photoIndex + 1);
  });

  }

  // Header and navigation.
  let savedNoticeDismissal = false;
  try { savedNoticeDismissal = sessionStorage.getItem('alegroNoticeDismissed') === 'true'; } catch (_) {}
  const notice = document.getElementById('notice');
  if (savedNoticeDismissal) notice.hidden = true;
  document.getElementById('closeNotice').addEventListener('click', () => {
    notice.hidden = true;
    try { sessionStorage.setItem('alegroNoticeDismissed', 'true'); } catch (_) {}
    updateHeaderHeight();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  function updateHeaderHeight() {
    document.documentElement.style.setProperty('--head-h', `${document.querySelector('.site-head').offsetHeight}px`);
  }
  if (window.ResizeObserver) new ResizeObserver(updateHeaderHeight).observe(document.querySelector('.site-head'));
  window.addEventListener('load', updateHeaderHeight, { once: true });
  updateHeaderHeight();

  const closeMobile = () => {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenu').setAttribute('aria-hidden', 'true');
    document.getElementById('menuToggle').setAttribute('aria-expanded', 'false');
    document.getElementById('menuToggle').textContent = 'Menu';
    document.body.classList.remove('menu-open');
  };
  document.getElementById('menuToggle').addEventListener('click', () => {
    const open = document.getElementById('mobileMenu').classList.toggle('open');
    document.getElementById('mobileMenu').setAttribute('aria-hidden', String(!open));
    document.getElementById('menuToggle').setAttribute('aria-expanded', String(open));
    document.getElementById('menuToggle').textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('menu-open', open);
  });
  document.querySelectorAll('#mobileMenu a').forEach(link => link.addEventListener('click', closeMobile));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobile(); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMobile(); });

  if (window.IntersectionObserver) {
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    ['about','services','work','plant'].forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
  }

  // Copy office address, with a safe fallback for non-secure contexts.
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  document.getElementById('copyAddress')?.addEventListener('click', async () => {
    const text = document.getElementById('address').innerText.replace(/\n/g, ' ');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Address copied');
    } catch (_) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('address'));
      selection.removeAllRanges();
      selection.addRange(range);
      showToast('Address selected — press Ctrl+C to copy');
    }
  });
  document.getElementById('newsletterForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    showToast('Thank you for signing up');
    form.reset();
  });

  // Timeline carousel: native scroll-snap with previous/next buttons.
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const track = root.querySelector('.ab-carousel__track');
    const step = () => (track.querySelector('.ab-card')?.offsetWidth || 400) + 20;
    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: 'smooth' });
      if (event.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
  });

  // Services slideshow: the active item fills its bar, then the next takes over. The image changes behind a
  // cover of triangular pixels (each square cell split into two triangles) that fades in, swaps, then fades out.
  document.querySelectorAll('[data-slideshow]').forEach(root => {
    const items = Array.from(root.querySelectorAll('[data-slideshow-item]'));
    const stage = document.querySelector('.sv-stage');
    const images = Array.from(document.querySelectorAll('[data-slideshow-image]'));
    if (!items.length) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = -1, token = 0;

    let cover = null, tris = [];
    const buildCover = () => {
      if (!stage || still) return;
      cover?.remove();
      const COLS = window.innerWidth < 640 ? 8 : 10;
      const cell = stage.clientWidth / COLS;
      const rows = Math.max(1, Math.round(stage.clientHeight / cell));
      cover = document.createElement('div');
      cover.className = 'sv-cover';
      cover.setAttribute('aria-hidden', 'true');
      cover.style.setProperty('--c', COLS);
      cover.style.setProperty('--r', rows);
      cover.innerHTML = Array.from({ length: COLS * rows }, () => `<span class="${Math.random() < .5 ? 'flip' : ''}"><i></i><i></i></span>`).join('');
      stage.appendChild(cover);
      tris = Array.from(cover.querySelectorAll('i'));
    };
    const scatter = () => tris.forEach(t => { t.style.transitionDelay = `${Math.round(Math.random() * 380)}ms`; });
    buildCover();
    if (window.ResizeObserver && stage && !still) {
      let resizeTimer;
      new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildCover, 200); }).observe(stage);
    }

    const setImage = index => images.forEach((img, i) => img.classList.toggle('is-active', i === index));
    const show = index => {
      const next = (index + items.length) % items.length;
      if (next === current) return;
      const first = current === -1;
      current = next;
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === current);
        item.classList.toggle('is-static', still);
        const bar = item.querySelector('.sv-item__bar i');
        if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      });
      const mine = ++token;
      if (first || still || !cover) { setImage(current); return; }
      scatter();
      cover.classList.add('on');
      setTimeout(() => {
        if (mine !== token) return;
        setImage(current);
        scatter();
        cover.classList.remove('on');
      }, 780);
    };
    items.forEach((item, i) => {
      item.querySelector('[data-slideshow-label]')?.addEventListener('click', () => show(i));
      item.querySelector('.sv-item__bar i')?.addEventListener('animationend', () => { if (i === current) show(current + 1); });
    });
    show(0);
  });

  // Motion: word reveals, line drawing, panels, parallax and statistic roll-ups.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.split-title').forEach(title => {
    const accessibleText = title.textContent.trim();
    title.setAttribute('aria-label', accessibleText);
    title.innerHTML = accessibleText.split(/\s+/).map(word => `<span class="word" aria-hidden="true">${escapeHTML(word)}&nbsp;</span>`).join('');
  });
  if (window.gsap && window.ScrollTrigger && !reducedMotion.matches) {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: .09, smoothWheel: true, wheelMultiplier: 1 });
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis', 'lenis-smooth');
      document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || link.getAttribute('href') === '#') return;
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -(document.querySelector('.site-head')?.offsetHeight || 0), duration: 1.4 });
      });
    }
    // Matches the reference sequence: accent (0s), lines (1s), subtitle words (1.75s), CTA (2.75s).
    const splitHeroText = (element, wordClass, lineClass, innerClass) => {
      const text = element.dataset.text;
      element.setAttribute('aria-label', text);
      element.innerHTML = text.split(/\s+/).map(word => `<span class="${wordClass}" aria-hidden="true">${escapeHTML(word)}</span>`).join(' ');
      const lines = [];
      let lastTop = null;
      element.querySelectorAll(`.${wordClass}`).forEach(word => {
        if (word.offsetTop !== lastTop) { lines.push([]); lastTop = word.offsetTop; }
        lines[lines.length - 1].push(word.textContent);
      });
      element.innerHTML = lines.map(line => `<span class="${lineClass}" aria-hidden="true"><span class="${innerClass || wordClass}">${line.map(escapeHTML).join(' ')}</span></span>`).join('');
    };
    const splitHero = () => {
      splitHeroText(document.getElementById('heroTitle'), 'hero-word', 'hero-title-line', 'hero-title-inner');
      splitHeroText(document.querySelector('.hero-sub'), 'hero-sub-word', 'hero-sub-line', '');
    };
    let heroRevealComplete = false;
    const startHeroReveal = () => {
      if (!document.getElementById('heroTitle')) return;
      splitHero();
      const accent = document.querySelector('.hero--accent');
      const buttons = document.querySelectorAll('.hero-cta-frame .btn, .hero-mobile-cta-frame .btn');
      gsap.set(accent, { transformOrigin: 'center top' });
      gsap.set(buttons, { yPercent: 100 });
      const timeline = gsap.timeline({ paused: true, delay: 1, onComplete: () => { heroRevealComplete = true; } });
      timeline.from(accent, { duration: 2, scale: 0, ease: 'expo.inOut' }, 0);
      timeline.from('.hero-title-inner', { duration: 3, xPercent: -100, stagger: .15, ease: 'power4.out' }, 1);
      timeline.from('.hero-sub-word', { duration: 1.5, yPercent: 100, stagger: .03, ease: 'power4.out' }, 1.75);
      timeline.to(buttons, { duration: 1, yPercent: 0, ease: 'expo.in' }, 2.75);
      timeline.play();
    };
    if (document.fonts?.ready) document.fonts.ready.then(startHeroReveal);
    else startHeroReveal();
    let heroResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(heroResizeTimer);
      heroResizeTimer = setTimeout(() => { if (heroRevealComplete) splitHero(); }, 200);
    });
    document.querySelectorAll('main .split-title:not(#heroTitle)').forEach(title => {
      gsap.from(title.querySelectorAll('.word'), { y: 35, opacity: 0, duration: .65, stagger: .035, ease: 'power2.out', scrollTrigger: { trigger: title, start: 'top 85%', once: true } });
    });
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.from(el, { y: 32, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 87%', once: true } });
    });
    document.querySelectorAll('.reveal-panel').forEach(el => {
      gsap.from(el, { x: 55, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 87%', once: true } });
    });
    const shuffle = items => items.map(item => ({ item, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ item }) => item);
    // Line networks: every segment is drawn over 3s (expo.inOut), staggered 1% of that apart in shuffled node order,
    // looping with yoyo. Delay comes from data-grid-delay (right network 0s, left network 2s), as on the reference.
    const initHeroLines = () => {
      document.querySelectorAll('[data-grid-hero]').forEach(svg => {
        if (!svg.getClientRects().length) return;
        const nodes = shuffle(Array.from(svg.querySelectorAll("[data-name='node']")));
        const timeline = gsap.timeline({ paused: true, repeat: -1, yoyo: true, delay: parseFloat(svg.dataset.gridDelay || '0') });
        nodes.forEach(node => node.querySelectorAll('g').forEach(group => group.querySelectorAll('*').forEach(el => {
          const vars = { duration: 3, autoAlpha: 0, ease: 'expo.inOut' };
          if (el.tagName === 'line') {
            const length = el.getTotalLength();
            gsap.set(el, { strokeDasharray: length });
            vars.strokeDashoffset = length;
          }
          timeline.from(el, vars, '<+1%');
        })));
        timeline.play();
        ScrollTrigger.create({ trigger: '.hero, .ab-hero', start: 'top bottom', end: 'bottom top', onToggle: self => self.isActive ? timeline.resume() : timeline.pause() });
      });
    };
    initHeroLines();

    // About / Services heroes: lines sit still and slowly draw away as the page scrolls (as on the reference).
    document.querySelectorAll('[data-hero-grid-reveal]').forEach(svg => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top top', end: 'bottom 70%', scrub: 1.5 } });
      shuffle(Array.from(svg.querySelectorAll("[data-name='node']"))).forEach(node => node.querySelectorAll('g').forEach(group => group.querySelectorAll('*').forEach(el => {
        const vars = { duration: 1, autoAlpha: 0, ease: 'none' };
        if (el.tagName === 'line') {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: 0 });
          vars.strokeDashoffset = length;
        }
        timeline.to(el, vars, '<+1%');
      })));
    });

    // Image entrance: a 22 x 13 grid of triangular pixels (each cell split into two triangles) dissolves outward
    // from the top centre (2s fade, .085s per cell, with a little random offset per triangle).
    const heroTiles = document.querySelector('.hero-tiles');
    if (heroTiles) {
      const COLS = 22, ROWS = 13, from = [(COLS - 1) * .5, (ROWS - 1) * .1];
      heroTiles.innerHTML = Array.from({ length: COLS * ROWS }, (_, n) => `<span class="hero-tile${Math.random() < .5 ? ' flip' : ''}" data-c="${n % COLS}" data-r="${Math.floor(n / COLS)}"><i></i><i></i></span>`).join('');
      const tris = Array.from(heroTiles.querySelectorAll('i'));
      gsap.to(tris, {
        autoAlpha: 0, duration: 2, ease: 'none',
        delay: i => {
          const cell = tris[i].parentElement;
          return Math.hypot(Number(cell.dataset.c) - from[0], Number(cell.dataset.r) - from[1]) * .085 + Math.random() * .3;
        },
        onComplete: () => heroTiles.remove()
      });
    }

    // Scroll parallax matching data-speed on the photo and line networks.
    const heroSection = document.querySelector('.hero');
    document.querySelectorAll('.hero [data-speed]').forEach(node => {
      const el = node instanceof SVGElement ? node.parentElement : node;
      gsap.to(el, { y: () => (1 - parseFloat(node.dataset.speed)) * heroSection.offsetHeight, ease: 'none', scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });

    // About section, matching the reference: scrubbed text/quote reveals, node-line drawing, tile dissolve and parallax.
    const SCRUB = .6; // light smoothing on top of Lenis, keeps scrubbed reveals responsive
    document.querySelectorAll('[data-image-reveal]').forEach(tiles => {
      if (!tiles.getClientRects().length) return;
      gsap.timeline({ scrollTrigger: { trigger: tiles, start: 'top 80%', end: 'top 30%', scrub: SCRUB } })
        .to(tiles.children, { autoAlpha: 0, duration: 1, stagger: { each: .185, axis: 'y', from: 'random', grid: 'auto', ease: 'power1.in' } });
    });
    // Services background photo: a smooth left-to-right wipe tied to the scroll (no tiles).
    document.querySelectorAll('.svc-bg').forEach(bg => {
      gsap.fromTo(bg.querySelector('.svc-bg__img'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: bg, start: 'top 85%', end: 'top 25%', scrub: SCRUB } });
    });
    document.querySelectorAll('[data-callout-block-reveal]').forEach(block => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 80%', end: 'bottom 80%', scrub: SCRUB } });
      timeline.from(block.querySelector('.callout__brow > span'), { autoAlpha: 0, y: '-=30', duration: 1 });
      ['.callout__heading > h2', '.callout__subtext > p', '.callout__link'].forEach(selector => timeline.from(block.querySelector(selector), { autoAlpha: 0, y: '+=30', duration: 1 }));
    });
    const aboutQuote = document.querySelector('[data-quote-reveal]');
    if (aboutQuote) {
      gsap.timeline({ scrollTrigger: { trigger: aboutQuote, start: 'top 80%', end: 'top 30%', scrub: SCRUB } })
        .from(aboutQuote.querySelector('.quote--mark'), { autoAlpha: 0, y: '-=30', duration: 1 })
        .from(aboutQuote.querySelector('.quote--block'), { autoAlpha: 0, y: '+=30', duration: 1 })
        .from(aboutQuote.querySelector('.quote__cite > p'), { autoAlpha: 0, y: '+=30', duration: 1 });
    }
    document.querySelectorAll('[data-node-reveal]').forEach(svg => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 50%', end: 'top 10%', scrub: SCRUB } });
      shuffle(Array.from(svg.querySelectorAll("[data-name='node']"))).forEach(node => node.querySelectorAll('g').forEach(group => group.querySelectorAll('*').forEach(el => {
        const vars = { duration: 3, autoAlpha: 0 };
        if (el.tagName === 'line') {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length });
          vars.strokeDashoffset = length;
        }
        timeline.from(el, vars, '<+20%');
      })));
    });

    // Map: rule, character fade, silhouette, location markers and stats scrub in with the scroll.
    const splitChars = el => {
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = text.split(' ').map(word => `<span class="map-word" aria-hidden="true">${[...word].map(c => `<span class="map-char">${escapeHTML(c)}</span>`).join('')}</span>`).join(' ');
      return el.querySelectorAll('.map-char');
    };
    document.querySelectorAll('[data-map-reveal]').forEach(map => {
      const chars = ['.map__brow > span', '.map__heading > h2', '.map__subtext > p'].flatMap(selector => Array.from(splitChars(map.querySelector(selector))));
      const mainland = map.querySelector('.map--mainland');
      const markers = map.querySelectorAll('.map__locations-group > text');
      gsap.set(map.querySelector('.map--vertical-rule'), { transformOrigin: 'center top' });
      gsap.set(mainland, { attr: { 'fill-opacity': .2 } });
      gsap.set(markers, { attr: { 'fill-opacity': 0 } });
      gsap.from(map.querySelector('.map--vertical-rule'), { scaleY: 0, opacity: 0, duration: 1, scrollTrigger: { trigger: map, start: 'top 70%', end: 'top 20%', scrub: SCRUB } });
      gsap.from(chars, { opacity: .2, stagger: .05, duration: 1, scrollTrigger: { trigger: map, start: 'top 70%', end: 'top 20%', scrub: SCRUB } });
      gsap.to(mainland, { attr: { 'fill-opacity': 1 }, duration: 1, scrollTrigger: { trigger: mainland, start: 'top 70%', end: 'top 20%', scrub: SCRUB } });
      gsap.to(markers, { attr: { 'fill-opacity': 1 }, duration: 2, stagger: 1, ease: 'expo.inOut', scrollTrigger: { trigger: mainland, start: 'top 80%', end: 'bottom 80%', scrub: SCRUB } });
      gsap.from(map.querySelectorAll('.stat'), { duration: 1, opacity: 0, y: '+=30', stagger: .5, scrollTrigger: { trigger: mainland, start: 'top 40%', end: 'top 20%', scrub: SCRUB } });
    });

    // Careers callout: rule grows, text slides up out of its mask.
    document.querySelectorAll('[data-callout-reveal]').forEach(callout => {
      const rule = callout.querySelector('.callout--vertical-rule');
      gsap.set(rule, { transformOrigin: 'center top' });
      gsap.from(rule, { duration: 1, opacity: 0, scaleY: 0, scrollTrigger: { trigger: callout, start: 'top 90%', end: 'top 40%', scrub: SCRUB } });
      gsap.timeline({ scrollTrigger: { trigger: callout, start: 'top 80%', end: 'top 40%', scrub: SCRUB } })
        .from(callout.querySelector('.callout__brow > span'), { duration: 1, opacity: 0, yPercent: 100, ease: 'none' })
        .from(callout.querySelector('.callout__heading > h2'), { duration: 1, opacity: 0, yPercent: 100, ease: 'none' })
        .from(callout.querySelector('.callout__subtext > p'), { duration: 1, opacity: 0, yPercent: 50, ease: 'none' })
        .from(callout.querySelector('.callout__link > a'), { duration: 1, opacity: 0, ease: 'none' });
    });

    // Newsletter: watermark drops in, content rises.
    document.querySelectorAll('[data-newsletter-reveal]').forEach(section => {
      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: SCRUB } })
        .from(section.querySelector('.newsletter__logo'), { autoAlpha: 0, duration: 1, y: '-=50' })
        .from(section.querySelector('.newsletter__content'), { autoAlpha: 0, duration: 1, y: '+=50' });
    });

    // Triangular networks that draw in as they scroll into view.
    document.querySelectorAll('[data-grid-reveal]').forEach(target => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: target, start: 'top 80%', end: 'bottom 100%', scrub: SCRUB } });
      shuffle(Array.from(target.querySelectorAll("[data-name='node']"))).forEach(node => node.querySelectorAll('g').forEach(group => group.querySelectorAll('*').forEach(el => {
        const vars = { duration: 1, autoAlpha: 0, ease: 'none' };
        if (el.tagName === 'line') {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length });
          vars.strokeDashoffset = length;
        }
        timeline.from(el, vars, '<+1%');
      })));
    });
    // Parallax: speed < 1 lags the scroll and sits at its natural position when centred in the viewport.
    document.querySelectorAll('.about [data-speed], .ab-hero__photo[data-speed], .ab-banner [data-speed], #services [data-speed], .careers [data-speed], .newsletter [data-speed], .footer [data-speed]').forEach(node => {
      const el = node instanceof SVGElement ? node.parentElement : node;
      const host = /__img$/.test(node.className) ? node.parentElement : el;
      const reach = () => (1 - parseFloat(node.dataset.speed)) * (window.innerHeight + host.offsetHeight) / 2;
      gsap.fromTo(el, { y: () => -reach() }, { y: () => reach(), ease: 'none', immediateRender: true, scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
    document.querySelectorAll('.network-stat').forEach(stat => {
      gsap.from(stat, { x: -25, opacity: 0, duration: .9, scrollTrigger: { trigger: stat, start: 'top 86%', once: true } });
    });
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = Number(counter.dataset.count);
      const state = { value: 0 };
      gsap.to(state, { value: target, duration: 1.4, ease: 'power2.out', snap: { value: 1 }, scrollTrigger: { trigger: counter, start: 'top 90%', once: true }, onUpdate: () => { counter.textContent = Math.round(state.value); } });
    });
    gsap.from('.nigeria-map', { opacity: 0, x: 50, duration: 1.25, ease: 'power3.out', scrollTrigger: { trigger: '.network', start: 'top 70%', once: true } });
    gsap.from('.map-line', { opacity: 0, duration: 1.5, scrollTrigger: { trigger: '.network', start: 'top 65%', once: true } });
    gsap.from('.city-dot, .city-pulse, .city-label', { opacity: 0, duration: .4, stagger: .08, ease: 'power1.out', scrollTrigger: { trigger: '.network', start: 'top 50%', once: true } });
    gsap.from('.service-card', { y: 30, opacity: 0, duration: .65, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: '#serviceGrid', start: 'top 85%', once: true } });
    gsap.from('#projectGrid > *', { y: 28, opacity: 0, duration: .6, stagger: .045, ease: 'power2.out', scrollTrigger: { trigger: '#projectGrid', start: 'top 88%', once: true } });
    gsap.to('.contact-bg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  } else {
    // Content stays fully visible if a CDN is blocked or reduced motion is preferred.
    document.querySelector('.hero-tiles')?.remove();
    document.querySelectorAll('.about-tiles, .svc-tiles').forEach(el => el.remove());
  }
})();
