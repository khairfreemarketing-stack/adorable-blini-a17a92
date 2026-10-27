/* @ds-bundle: {"format":4,"namespace":"RootedWild","components":[{"name":"Wordmark"},{"name":"Nav"},{"name":"Button"},{"name":"WoodTag"},{"name":"Badge"},{"name":"ProductCard"},{"name":"Hero"},{"name":"TwoWoods"},{"name":"FormatTiles"},{"name":"ProcessStrip"},{"name":"DressCrossfade"},{"name":"WorkStrip"},{"name":"TradeBand"},{"name":"CustomBand"},{"name":"EmailSignup"},{"name":"Footer"},{"name":"FilterBar"},{"name":"SpecBlock"},{"name":"HabitatWarning"},{"name":"PairsWith"},{"name":"TrustStrip"},{"name":"GalleryEntry"},{"name":"TwoStates"},{"name":"InquiryForm"}]} */
(function () {
  'use strict';

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var LINKS = { home: '/', shop: '/shop', custom: '/custom', trade: '/trade', work: '/work', studio: '/studio', cart: '/cart', shipping: '/shipping' };
  function url(k) { return LINKS[k] === '/' ? '/' : LINKS[k] + '/'; }

  /* ---------- Img: a photo slot. Until photography lands it is a bone-soft field with the shot named. ---------- */
  function Img(o) {
    o = o || {};
    var cls = 'rw-img ratio-' + (o.ratio || '4-5') + (o.tone ? ' tone-' + o.tone : '') + (o.bleed ? ' is-bleed' : '');
    var el = h('figure', { class: cls, role: o.src ? null : 'img', 'aria-label': o.src ? null : (o.alt || o.label || '') });
    if (o.src) el.appendChild(h('img', { src: o.src, alt: o.alt || '', loading: o.eager ? 'eager' : 'lazy' }));
    else if (o.label) el.appendChild(h('span', { class: 'rw-img-label', text: o.label }));
    if (o.wood) el.appendChild(h('span', { class: 'rw-img-wood' }, WoodTag({ wood: o.wood })));
    return el;
  }

  /* ---------- Wordmark ---------- */
  function Wordmark(o) {
    o = o || {};
    var mark = o.markSrc
      ? h('span', { class: 'rw-wordmark-mark' }, h('img', { src: o.markSrc, alt: '' }))
      : h('span', { class: 'rw-wordmark-mark', 'aria-hidden': 'true', text: 'mark' });
    return h('a', { class: 'rw-wordmark' + (o.large ? ' is-large' : ''), href: o.href || LINKS.home, 'aria-label': 'Rooted and Wild, home' },
      o.hideMark ? null : mark,
      h('span', { class: 'rw-wordmark-text' },
        h('span', { class: 'rw-wordmark-name', text: 'Rooted and Wild' }),
        h('span', { class: 'rw-wordmark-sub', text: 'Décor and Design' })));
  }

  /* ---------- Nav ---------- */
  function Nav(o) {
    o = o || {};
    var items = [['Shop', 'shop'], ['Custom', 'custom'], ['Trade', 'trade'], ['Work', 'work'], ['Studio', 'studio']];
    return h('header', { class: 'rw-nav' },
      h('div', { class: 'rw-container rw-nav-inner' },
        Wordmark({ markSrc: o.markSrc, hideMark: o.hideMark }),
        h('nav', { 'aria-label': 'Main' },
          h('ul', { class: 'rw-nav-links rw-ui' }, items.map(function (it) {
            return h('li', null, h('a', { href: url(it[1]), 'aria-current': o.current === it[1] ? 'page' : null, text: it[0] }));
          }))),
        h('div', { class: 'rw-nav-right' },
          h('a', { class: 'rw-nav-cart rw-ui snipcart-checkout', href: url('cart'), text: 'Cart (' }, h('span', { class: 'snipcart-items-count', text: String(o.cartCount || 0) }), ')'),
          h('button', { class: 'rw-nav-menu rw-ui', type: 'button', 'aria-label': 'Open menu', text: 'Menu' }))));
  }

  /* ---------- Button ---------- */
  function Button(o) {
    o = o || {};
    var cls = 'rw-btn rw-btn-' + (o.variant || 'primary') + (o.block ? ' rw-btn-block' : '');
    if (o.href) return h('a', { class: cls, href: o.href, 'aria-disabled': o.disabled ? 'true' : null, text: o.label || 'Shop trees' });
    return h('button', { class: cls, type: o.type || 'button', disabled: o.disabled ? true : null, onClick: o.onClick, text: o.label || 'Shop trees' });
  }

  /* ---------- WoodTag, Badge, Stock ---------- */
  function WoodTag(o) {
    o = o || {};
    var wood = (o.wood || 'ember').toLowerCase();
    return h('span', { class: 'rw-tag rw-tag-' + wood, text: cap(wood) });
  }
  function Badge(o) { o = o || {}; return h('span', { class: 'rw-badge', text: o.label || 'One of a kind' }); }
  function Stock(o) {
    o = o || {};
    var made = o.inStock === false;
    return h('span', { class: 'rw-stock' + (made ? ' is-made' : ''), text: made ? 'Made to order, 2 to 3 weeks' : 'In stock, ships in 3 days' });
  }

  /* ---------- product data helpers ---------- */
  function money(n) { return typeof n === 'number' ? '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0 }) : (n || ''); }
  function slugify(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function heightBucket(hgt) { return hgt < 24 ? 'tabletop' : hgt <= 40 ? 'statement' : 'floor'; }
  function priceBucket(p) { return p < 50 ? 'under-50' : p < 150 ? '50-150' : p < 300 ? '150-300' : '300-up'; }
  function productTitle(p) { return p.title || (p.format && p.format.toLowerCase().indexOf('strand') >= 0 ? (p.palette || cap(p.wood || 'ink')) + ' Strand Set' : cap(p.wood || 'ember') + ' ' + (p.format || 'Boxed Tree') + ', ' + (p.height || 0) + ' in'); }
  function productUrl(p) { return p.href || (LINKS.shop + '/' + (p.slug || slugify(productTitle(p))) + '/'); }
  function productAlt(p, shot) { return cap(p.wood || 'ember') + ' ' + (p.format || 'boxed tree').toLowerCase() + ' manzanita, ' + (p.height || '') + ' in' + (shot ? ', ' + shot : ''); }
  function isRaw(p) { return /raw/i.test(p.format || '') || /raw/i.test(p.finish || ''); }
  function isStrand(p) { return /strand/i.test(p.format || ''); }

  /* ---------- ProductCard ---------- */
  function ProductCard(o) {
    o = o || {};
    var wood = o.wood || 'ember', format = o.format || 'Boxed Tree', height = o.height || 32;
    var title = productTitle(o);
    var alt = productAlt(o);
    var imgs = o.images || {};
    var price = typeof o.price === 'number' ? money(o.price) : (o.price || '$[185 to 425]');
    return h('a', { class: 'rw-card', href: productUrl(o),
        'data-wood': wood.toLowerCase(), 'data-format': format.toLowerCase().split(' ')[0], 'data-height': heightBucket(+height), 'data-palette': (o.palette || '').toLowerCase(), 'data-price': typeof o.price === 'number' ? priceBucket(o.price) : '', 'data-stock': o.inStock === false ? 'made' : 'in', 'data-price-num': typeof o.price === 'number' ? String(o.price) : '0', 'data-height-num': String(height || 0) },
      h('div', { class: 'rw-card-media' },
        Img({ ratio: '4-5', tone: 'white', label: alt + ', on cream', alt: alt + ' on cream', wood: isStrand(o) ? null : wood, src: o.src || imgs.front }),
        Img({ ratio: '4-5', tone: 'room', label: alt + ', in a room', alt: alt + ' ' + (o.room || 'in a room'), src: o.roomSrc || imgs.room }),
        o.oneOfAKind ? h('span', { class: 'rw-card-badge' }, Badge()) : null),
      h('div', { class: 'rw-card-body' },
        h('h3', { class: 'rw-card-title', text: title }),
        h('div', { class: 'rw-card-meta' },
          h('p', { class: 'rw-caption', text: (isStrand(o) ? (o.description || '') : height + ' in tall') + (o.palette && !isStrand(o) ? ' · ' + o.palette : '') }),
          h('span', { class: 'rw-price', text: price })),
        Stock({ inStock: o.inStock !== false })));
  }

  /* ---------- section wrapper ---------- */
  function Section(o) {
    o = o || {};
    var head = (o.title || o.link) ? h('div', { class: 'rw-section-head' },
      h('div', { class: 'rw-stack' },
        o.overline ? h('p', { class: 'rw-overline rw-muted', text: o.overline }) : null,
        o.title ? h('h2', { class: 'rw-display-2', text: o.title }) : null,
        o.intro ? h('p', { class: 'rw-lead rw-measure', text: o.intro }) : null),
      o.link ? h('a', { class: 'rw-link', href: o.href || '#', text: o.link }) : null) : null;
    return h('section', { class: 'rw-section', id: o.id || null }, h('div', { class: 'rw-container' }, head, o.children));
  }

  /* ---------- Hero ---------- */
  function Hero(o) {
    o = o || {};
    return h('section', { class: 'rw-hero' },
      h('div', { class: 'rw-container rw-hero-inner' },
        h('div', { class: 'rw-hero-copy' },
          h('h1', { class: 'rw-display-1', text: o.headline || 'Grown wild. Rooted here.' }),
          h('p', { class: 'rw-lead rw-measure', text: o.subhead || 'Manzanita trees cut, cleaned and finished by hand in San Diego. Set in cedar boxes I build myself.' }),
          h('div', { class: 'rw-btn-row' },
            Button({ label: 'Shop trees', href: url('shop') }),
            Button({ label: 'Design a custom piece', variant: 'secondary', href: url('custom') }))),
        h('div', { class: 'rw-hero-media' },
          Img({ ratio: '4-5', tone: 'ember', wood: 'ember', eager: true, src: o.emberSrc || (o.images && o.images.ember), label: 'Ember boxed tree, cedar box, clean background', alt: 'Ember boxed manzanita tree in a cedar box on a clean cream background' }),
          Img({ ratio: '4-5', tone: 'bone', wood: 'bone', eager: true, src: o.boneSrc || (o.images && o.images.bone), label: 'Bone boxed tree, cedar box, clean background', alt: 'Bone boxed manzanita tree in a cedar box on a clean cream background' }))));
  }

  /* ---------- TwoWoods ---------- */
  var WOODS = {
    ember: { name: 'Ember', copy: 'Cut while the tree was living. The bark keeps its deep red and goes glossy under finish. This is the statement piece.', link: 'Shop Ember', href: LINKS.shop + '/?wood=ember' },
    bone: { name: 'Bone', copy: 'Standing deadwood, bleached grey by years of sun. Sculptural and quiet. The coastal, modern one.', link: 'Shop Bone', href: LINKS.shop + '/?wood=bone' }
  };
  function WoodPanel(key, images) {
    var w = WOODS[key];
    return h('div', { class: 'rw-wood' },
      Img({ ratio: '3-2', tone: key, src: images && images[key], label: w.name + ' branch, bark detail, daylight', alt: w.name + ' manzanita branch, bark detail' }),
      h('div', { class: 'rw-wood-head' }, h('h3', { class: 'rw-headline', text: w.name }), WoodTag({ wood: key })),
      h('p', { class: 'rw-body', text: w.copy }),
      h('a', { class: 'rw-link', href: w.href, text: w.link }));
  }
  function TwoWoods(o) {
    o = o || {};
    return Section({ title: 'Two woods. One tree knew it was being cut. One had already let go.', children: h('div', { class: 'rw-woods' }, WoodPanel('ember', o.images), WoodPanel('bone', o.images)) });
  }

  /* ---------- FormatTiles ---------- */
  var FORMATS = [
    { name: 'Boxed Trees', from: 'From $[185]', slug: 'boxed-trees', tone: 'cedar', shot: 'Boxed tree, cedar box, chair for scale' },
    { name: 'Single Branches', from: 'From $[45]', slug: 'single-branches', tone: 'bone', shot: 'Single branch laid flat, hand for scale' },
    { name: 'Strands & Adornments', from: 'From $[18]', slug: 'strands-adornments', tone: 'room', shot: 'Three strand sets hanging from one branch' },
    { name: 'Raw Wood', from: 'From $[12]', slug: 'raw-wood', tone: 'white', shot: 'Raw branches, untreated, on cream' }
  ];
  function FormatTiles(o) {
    o = o || {};
    return Section({ title: 'Shop by format', link: 'See everything', href: LINKS.shop + '/', children: h('div', { class: 'rw-tiles' }, FORMATS.map(function (f) {
      var im = o.images && o.images[f.slug], from = (o.from && o.from[f.slug]) || f.from;
      return h('a', { class: 'rw-tile', href: LINKS.shop + '/' + f.slug + '/' },
        Img({ ratio: '1', tone: f.tone, src: im, label: f.shot, alt: f.name + ' manzanita, ' + f.shot.toLowerCase() }),
        h('div', { class: 'rw-tile-row' }, h('h3', { class: 'rw-tile-name', text: f.name }), h('span', { class: 'rw-price rw-muted', text: from })));
    })) });
  }

  /* ---------- ProcessStrip (The box) ---------- */
  function ProcessStrip(o) {
    o = o || {};
    var steps = [['Rough cedar', 'Rough cedar boards, workshop bench'], ['Cut and sanded', 'Box cut and sanded, open joints showing'], ['Finished, tree set', 'Stained cedar box with a Bone tree set in concrete']];
    return Section({ id: 'box', children: h('div', { class: 'rw-process' },
      h('div', { class: 'rw-process-steps' }, steps.map(function (s, i) {
        return h('div', { class: 'rw-process-step' }, Img({ ratio: '4-5', tone: 'cedar', src: o.images && o.images[i], label: s[1], alt: 'Cedar box process, ' + s[0].toLowerCase() }), h('p', { class: 'rw-caption', text: s[0] }));
      })),
      h('div', { class: 'rw-process-copy' },
        h('h2', { class: 'rw-display-2', text: 'The box' }),
        h('p', { class: 'rw-body', text: 'Every boxed tree stands in cedar I cut, sand and stain by hand. Open the shipping carton and the first thing you notice is the smell.' }),
        h('a', { class: 'rw-link', href: LINKS.studio + '/#box', text: 'How the box is made' }))) });
  }

  /* ---------- DressCrossfade: the one thing that moves ---------- */
  var DRESS = [
    { palette: 'Bare', name: 'Nothing on it', shot: 'Bone tree, bare, in a cedar box' },
    { palette: 'Ink', name: 'Modern black and cream beads', shot: 'Same tree, black and cream bead strands' },
    { palette: 'Shoreline', name: 'Coastal capiz and shell', shot: 'Same tree, capiz discs and shell drops' },
    { palette: 'Dune', name: 'Desert rust feathers', shot: 'Same tree, rust macrame feathers' }
  ];
  function DressCrossfade(o) {
    o = o || {};
    var hold = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--crossfade-hold')) || 3200;
    var imgs = DRESS.map(function (d, i) { return Img({ ratio: '4-5', tone: i ? 'room' : 'bone', src: o.images && o.images[i], label: d.shot, alt: 'Bone boxed manzanita tree, ' + d.name.toLowerCase() }); });
    var btns = DRESS.map(function (d, i) {
      return h('button', { type: 'button', class: i === 0 ? 'is-on' : '', 'aria-pressed': i === 0 ? 'true' : 'false', onClick: function () { go(i, true); } },
        h('span', { class: 'rw-overline', text: d.palette }), h('span', { class: 'rw-body-strong', text: d.name }));
    });
    var stage = h('div', { class: 'rw-dress-stage', 'aria-live': 'off' }, imgs);
    var list = h('ul', { class: 'rw-dress-list' }, btns.map(function (b) { return h('li', null, b); }));
    var idx = 0, timer = null, paused = false;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(i, manual) {
      idx = i;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
      btns.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      if (manual) { clearInterval(timer); timer = null; }
    }
    go(0);
    if (!reduced) {
      timer = setInterval(function () { if (!paused) go((idx + 1) % DRESS.length); }, hold);
      stage.addEventListener('mouseenter', function () { paused = true; });
      stage.addEventListener('mouseleave', function () { paused = false; });
    }
    return Section({ id: 'dress', title: 'Same tree. Three rooms.', intro: 'Strands hang from the branches, so one tree gets dressed, undressed and redressed for a season or an event.', link: 'Shop Strands & Adornments', href: LINKS.shop + '/strands-adornments/', children: h('div', { class: 'rw-dress' }, stage, list) });
  }

  /* ---------- WorkStrip ---------- */
  var WORK = [
    ['Hotel lobby, La Jolla', 'Hospitality · 14 Bone boxed trees', 'bone'],
    ['Backyard wedding, Rancho Santa Fe', 'Event · 22 Ember branches, Dune strands', 'ember'],
    ['Dining room, North Park', 'Home · 1 Ember boxed tree, 42 in', 'ember'],
    ['Day spa, Encinitas', 'Hospitality · 6 Bone branches, Shoreline', 'bone'],
    ['Photo studio, Barrio Logan', 'Studio · 3 floor pieces, bare', 'bone'],
    ['Orchid wall, Point Loma', 'Orchid mounts · 9 raw branches', 'ember']
  ];
  function WorkStrip(o) {
    o = o || {};
    var items = (o.entries || []).slice(0, 6).map(function (e) { return [e.where, (e.clientType || '') + ' · ' + (e.count || ''), (e.wood || 'bone').toLowerCase(), e.hero]; });
    if (!items.length) items = WORK;
    return Section({ title: 'Work', link: 'See the Work page', href: LINKS.work + '/', children: h('div', { class: 'rw-masonry' }, items.map(function (w) {
      return h('figure', null, Img({ tone: w[2] === 'ember' ? 'room' : 'bone', wood: w[2], src: w[3], label: w[0], alt: cap(w[2]) + ' manzanita installed, ' + w[0] }), h('figcaption', { class: 'rw-caption', text: w[0] + ' · ' + w[1] }));
    })) });
  }

  /* ---------- TradeBand and CustomBand ---------- */
  function TradeBand(o) {
    o = o || {};
    return h('section', { class: 'rw-band', 'data-theme': 'bark' },
      h('div', { class: 'rw-container rw-band-inner' },
        h('div', { class: 'rw-stack' },
          h('p', { class: 'rw-overline rw-muted', text: 'Trade' }),
          h('h2', { class: 'rw-headline', text: 'I design for planners, florists and venues. Fifteen matching pieces, one palette, one date.' }),
          h('p', { class: 'rw-body rw-muted', text: 'Lead time and pricing on the Trade page.' })),
        h('div', { class: 'rw-btn-row' }, Button({ label: 'Trade inquiry', variant: 'onDark', href: url('trade') }))));
  }
  function CustomBand(o) {
    return h('section', { class: 'rw-band' },
      h('div', { class: 'rw-container rw-band-inner' },
        h('div', { class: 'rw-stack' },
          h('p', { class: 'rw-overline rw-muted', text: 'Custom' }),
          h('h2', { class: 'rw-headline', text: 'Have a space, a wedding or a lobby in mind? Tell me the room and I will build for it.' })),
        h('div', { class: 'rw-btn-row' }, Button({ label: 'Start a custom order', href: url('custom') }))));
  }

  /* ---------- EmailSignup ---------- */
  function EmailSignup(o) {
    o = o || {};
    var input = h('input', { class: 'rw-input', type: 'email', name: 'email', required: true, placeholder: 'you@example.com', 'aria-label': 'Email address', autocomplete: 'email' });
    var msg = h('p', { class: 'rw-help', text: '' });
    var form = h('form', { action: o.action || '#', method: 'post', onSubmit: function (e) {
      e.preventDefault();
      if (!input.checkValidity()) { input.setAttribute('aria-invalid', 'true'); msg.textContent = 'That email does not look right.'; msg.className = 'rw-error'; return; }
      input.removeAttribute('aria-invalid'); msg.className = 'rw-help'; msg.textContent = 'You are on the list. First look at the next batch goes to you.';
      form.reset();
    } }, input, Button({ label: 'Send me the photo', type: 'submit' }));
    var wrap = h('div', { class: 'rw-signup' },
      o.compact ? null : h('h2', { class: 'rw-headline', text: 'New pieces drop in small batches. Get the photo before it sells.' }),
      form, msg);
    return o.bare ? wrap : h('section', { class: 'rw-section' }, h('div', { class: 'rw-container' }, wrap));
  }

  /* ---------- Footer ---------- */
  function Footer(o) {
    o = o || {};
    return h('footer', { class: 'rw-footer', 'data-theme': 'bark' },
      h('div', { class: 'rw-container' },
        h('div', { class: 'rw-footer-grid' },
          h('div', { class: 'rw-stack' },
            Wordmark({ hideMark: !o.markSrc, markSrc: o.markSrc }),
            h('p', { class: 'rw-body rw-muted rw-measure', text: 'Manzanita trees and branches, cut, cleaned and finished by hand in San Diego.' }),
            EmailSignup({ bare: true, compact: true })),
          h('div', null, h('h3', { text: 'Shop' }), h('ul', null, ['Boxed Trees', 'Single Branches', 'Strands & Adornments', 'Raw Wood'].map(function (t, i) { return h('li', null, h('a', { href: LINKS.shop + '/' + FORMATS[i].slug + '/', text: t })); }))),
          h('div', null, h('h3', { text: 'Studio' }), h('ul', null, [['Custom', url('custom')], ['Trade', url('trade')], ['Work', url('work')], ['About the studio', url('studio')], ['Contact', 'mailto:' + (o.email || '[email]')]].map(function (t) { return h('li', null, h('a', { href: t[1], text: t[0] })); }))),
          h('div', null, (function () {
              var links = [['Instagram', o.instagram === undefined ? 'https://instagram.com/[handle]' : o.instagram], ['Pinterest', o.pinterest === undefined ? 'https://pinterest.com/[handle]' : o.pinterest], ['Etsy shop', o.etsy === undefined ? 'https://etsy.com/shop/[shop]' : o.etsy]].filter(function (t) { return t[1]; });
              return links.length ? [h('h3', { text: 'Elsewhere' }), h('ul', null, links.map(function (t) { return h('li', null, h('a', { href: t[1], rel: 'noopener', target: '_blank', text: t[0] })); }))] : null;
            })(),
            h('h3', { class: 'rw-footer-local', text: 'Local' }),
            h('p', { class: 'rw-caption', text: 'Local pickup in San Diego. Shipping insured, box arrives unsealed inside.' }))),
        h('div', { class: 'rw-footer-bottom' },
          h('span', { text: '© ' + new Date().getFullYear() + ' Rooted and Wild. San Diego, California.' }),
          h('span', null, h('a', { href: url('shipping'), text: 'Shipping and returns' }), ' · ', h('a', { href: '/privacy/', text: 'Privacy' })))));
  }

  /* ---------- FilterBar ---------- */
  var FILTERS = [
    ['Wood', ['Ember', 'Bone']],
    ['Format', ['Boxed', 'Single', 'Strand', 'Raw']],
    ['Height', ['Tabletop, under 24 in', 'Statement, 24 to 40 in', 'Floor, 40 in and up']],
    ['Palette', ['Natural', 'Ink', 'Shoreline', 'Dune', 'Homestead']],
    ['Price', ['Under $50', '$50 to $150', '$150 to $300', '$300 and up']],
    ['Availability', ['In stock']]
  ];
  function FilterBar(o) {
    o = o || {};
    var KEYS = { Wood: 'wood', Format: 'format', Height: 'height', Palette: 'palette', Price: 'price', Availability: 'stock' };
    var PRICE = ['under-50', '50-150', '150-300', '300-up'];
    var groups = FILTERS.map(function (g) {
      var key = KEYS[g[0]];
      return h('div', { class: 'rw-filter-group', 'data-filter-group': key }, h('p', { class: 'rw-overline', text: g[0] }),
        h('div', { class: 'rw-chips' }, g[1].map(function (v, i) {
          var on = (o.active || []).indexOf(v) >= 0;
          var val = key === 'price' ? PRICE[i] : key === 'stock' ? 'in' : v.split(',')[0].toLowerCase();
          var b = h('button', { class: 'rw-chip', type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-key': key, 'data-value': val, text: v });
          b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
          return b;
        })));
    });
    var drawer = h('div', { class: 'rw-filter-drawer rw-filters' + (o.open ? ' is-open' : '') },
      h('button', { class: 'rw-btn rw-btn-quiet rw-filter-toggle', type: 'button', 'aria-expanded': o.open ? 'true' : 'false', 'aria-controls': 'rw-filter-body' }, h('span', { text: 'Filter' }), h('span', { 'aria-hidden': 'true', text: '+' })),
      h('div', { class: 'rw-filter-body', id: 'rw-filter-body' }, groups));
    return h('aside', { class: 'rw-shop-side', 'aria-label': 'Filters' }, drawer);
  }

  if (!window.__rwFilterToggle) {
    window.__rwFilterToggle = true;
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.rw-filter-toggle'); if (!t) return;
      var d = t.closest('.rw-filter-drawer'), open = !d.classList.contains('is-open');
      d.classList.toggle('is-open', open); t.setAttribute('aria-expanded', open ? 'true' : 'false'); t.lastChild.textContent = open ? '\u2013' : '+';
    });
  }

  /* ---------- SpecBlock ---------- */
  function SpecBlock(o) {
    o = o || {};
    var rows = o.rows || [
      ['Wood', 'Bone. Standing deadwood, sun-bleached.'],
      ['Height', '32 in'],
      ['Spread', '21 in'],
      ['Box', '8 in cedar, stained walnut, set in concrete'],
      ['Finish', 'Sanded, waxed and sealed'],
      ['Weight', '14 lb'],
      ['Adornments included', 'None. Pairs with Shoreline and Ink strands below.'],
      ['Lead time', 'In stock, ships in 3 days']
    ];
    return h('table', { class: 'rw-spec' }, h('tbody', null, rows.map(function (r) { return h('tr', null, h('th', { scope: 'row', text: r[0] }), h('td', { text: r[1] })); })));
  }

  /* ---------- HabitatWarning ---------- */
  function HabitatWarning(o) {
    o = o || {};
    if (o.raw) return h('p', { class: 'rw-warning is-raw', role: 'note', text: 'Untreated. Nothing on it but sandpaper. Bake or boil before use.' });
    return h('p', { class: 'rw-warning', role: 'note' }, 'Finished with wax and sealant. Not for aquariums, terrariums or animal enclosures. For habitats, ', h('a', { href: LINKS.shop + '/raw-wood/', text: 'shop Raw Wood' }), '.');
  }

  /* ---------- PairsWith ---------- */
  var STRANDS = {
    bone: [['Shoreline', 'Capiz and shell drops'], ['Ink', 'Black and cream beads'], ['Homestead', 'Cream beads and dried flowers']],
    ember: [['Dune', 'Rust feathers and leather'], ['Natural', 'Jute, raffia and amber glass'], ['Ink', 'Black and cream beads, one feather']]
  };
  function PairsWith(o) {
    o = o || {};
    var wood = o.wood || 'bone';
    return Section({ title: 'Pairs with', intro: 'Three strand sets matched to ' + cap(wood) + '. Hang them, swap them, take them off.', children: h('div', { class: 'rw-grid cols-3' }, STRANDS[wood].map(function (s) {
      return h('a', { class: 'rw-card', href: LINKS.shop + '/strands-adornments?palette=' + s[0].toLowerCase() },
        h('div', { class: 'rw-card-media' }, Img({ ratio: '4-5', tone: 'white', label: s[0] + ' strand set on cream', alt: s[0] + ' strand set for a ' + wood + ' manzanita tree' })),
        h('div', { class: 'rw-card-body' },
          h('h3', { class: 'rw-card-title', text: s[0] + ' Strand Set' }),
          h('div', { class: 'rw-card-meta' }, h('p', { class: 'rw-caption', text: s[1] }), h('span', { class: 'rw-price', text: '$[18 to 38]' }))));
    })) });
  }

  /* ---------- TrustStrip ---------- */
  function TrustStrip(o) {
    o = o || {};
    var items = [
      ['Local pickup in San Diego', 'Pick it up from the studio. No shipping charge.'],
      ['Insured shipping', 'Calculated by weight and box size at checkout.'],
      ['Arrives unsealed', 'Inspect it before you keep it.'],
      [(o.returnDays || '[14]') + '-day returns', 'Unused pieces, in the box they came in.']
    ];
    return h('ul', { class: 'rw-trust', 'aria-label': 'Buying from Rooted and Wild' }, items.map(function (it) { return h('li', null, h('strong', { text: it[0] }), h('span', { text: it[1] })); }));
  }

  /* ---------- GalleryEntry and TwoStates ---------- */
  function GalleryEntry(o) {
    o = o || {};
    var wood = o.wood || 'bone';
    var where = o.where || 'Hotel lobby, La Jolla';
    var support = o.support || ['Detail', 'Wide', 'Scale'];
    return h('article', { class: 'rw-entry', 'data-cat': slugify(o.clientType || 'homes') },
      Img({ ratio: '3-2', tone: wood === 'ember' ? 'room' : 'bone', wood: wood, src: o.hero, label: 'Hero: ' + where, alt: cap(wood) + ' manzanita installed, ' + where }),
      h('div', { class: 'rw-entry-side' },
        h('div', { class: 'rw-entry-support' }, support.slice(0, 4).map(function (s, i) { var src = typeof s === 'object' ? s.src : null, lab = typeof s === 'object' ? (s.label || 'Detail') : s; return Img({ ratio: '1', tone: 'room', src: src, label: lab, alt: lab + ' shot, ' + where }); })),
        h('div', { class: 'rw-entry-caption' },
          h('h3', { class: 'rw-title', text: where }),
          h('p', { class: 'rw-caption', text: (o.clientType || 'Hospitality') + ' · ' + (o.count || '14 Bone boxed trees') + (o.palette ? ' · ' + o.palette : '') }))));
  }
  function TwoStates(o) {
    o = o || {};
    var pairs = o.pairs && o.pairs.length ? o.pairs : [['ember', 'Ember branch, 38 in'], ['bone', 'Bone boxed tree, 32 in'], ['ember', 'Ember boxed tree, 48 in'], ['bone', 'Bone branch, 26 in']];
    return h('div', { class: 'rw-twostates-row' }, pairs.map(function (p) {
      if (!Array.isArray(p)) p = [(p.wood || 'bone').toLowerCase(), p.title || '', p.raw, p.finished];
      return h('div', { class: 'rw-twostates' },
        h('figure', null, Img({ ratio: '4-5', tone: 'white', src: p[2], label: 'Raw, as found', alt: p[1] + ', raw branch as found' }), h('figcaption', { class: 'rw-caption', text: 'Raw · ' + p[1] })),
        h('figure', null, Img({ ratio: '4-5', tone: p[0], wood: p[0], src: p[3], label: 'Finished', alt: p[1] + ', finished' }), h('figcaption', { class: 'rw-caption', text: 'Finished · ' + p[1] })));
    }));
  }

  /* ---------- InquiryForm: the custom order form and the trade form ---------- */
  var FORM = {
    purpose: ['Home', 'Wedding or event', 'Business or venue', 'Habitat (raw wood)'],
    wood: ['Ember', 'Bone', 'Either, you choose'],
    format: ['Boxed tree', 'Single branch', 'Strands only', 'Not sure'],
    size: ['Tabletop, under 24 in', 'Statement, 24 to 40 in', 'Floor, 40 in and up'],
    palette: ['Natural', 'Ink', 'Shoreline', 'Dune', 'Homestead', 'Something else'],
    budget: ['Under $200', '$200 to $500', '$500 to $1,500', '$1,500 and up']
  };
  function choiceGroup(name, legend, options, o) {
    o = o || {};
    var err = h('p', { class: 'rw-error', id: name + '-error', hidden: true, text: 'Pick one.' });
    var fs = h('fieldset', { class: 'rw-fieldset', 'data-field': name, 'aria-describedby': name + '-error' },
      h('legend', { text: legend }),
      h('div', { class: 'rw-choices' }, options.map(function (opt, i) {
        var id = name + '-' + i;
        var cls = 'rw-choice' + (name === 'wood' && opt === 'Ember' ? ' is-ember' : '') + (name === 'wood' && opt === 'Bone' ? ' is-bone' : '');
        return h('label', { class: cls, for: id }, h('input', { type: 'radio', name: name, id: id, value: opt, checked: o.value === opt ? true : null }), h('span', { text: opt }));
      })), err);
    if (o.other) {
      var otherInput = h('input', { class: 'rw-input', type: 'text', name: name + '_other', placeholder: 'Tell me the colors', 'aria-label': legend + ', something else', hidden: true });
      fs.appendChild(otherInput);
      fs.addEventListener('change', function (e) { if (e.target.name === name) otherInput.hidden = e.target.value !== 'Something else'; });
    }
    return fs;
  }
  function textField(name, label, type, o) {
    o = o || {};
    var id = 'f-' + name;
    var input = h(o.textarea ? 'textarea' : 'input', { class: o.textarea ? 'rw-textarea' : 'rw-input', id: id, name: name, type: o.textarea ? null : (type || 'text'), required: o.optional ? null : true, placeholder: o.placeholder || null, autocomplete: o.autocomplete || null, inputmode: o.inputmode || null, min: o.min || null, value: o.value || null, 'aria-describedby': id + '-error' });
    return h('div', { class: 'rw-field', 'data-field': name },
      h('label', { class: 'rw-label', for: id }, label, o.optional ? h('span', { class: 'rw-optional', text: ' (optional)' }) : null),
      input,
      o.help ? h('p', { class: 'rw-help', text: o.help }) : null,
      h('p', { class: 'rw-error', id: id + '-error', hidden: true, text: o.error || 'This one I need.' }));
  }

  function InquiryForm(o) {
    o = o || {};
    var variant = o.variant === 'trade' ? 'trade' : 'custom';
    var root = h('div', { class: 'rw-form-root' });
    var files = [];
    var fileList = h('ul', { class: 'rw-upload-list' });
    var fileInput = h('input', { type: 'file', name: 'inspiration', accept: 'image/*,.pdf', multiple: true, 'aria-describedby': 'upload-help' });
    fileInput.addEventListener('change', function () {
      files = Array.prototype.slice.call(fileInput.files, 0, 5);
      fileList.innerHTML = '';
      files.forEach(function (f) { fileList.appendChild(h('li', { text: f.name + ' · ' + Math.round(f.size / 1024) + ' KB' })); });
      if (fileInput.files.length > 5) fileList.appendChild(h('li', { class: 'rw-error', text: 'Five is the limit. I kept the first five.' }));
    });

    var intro = variant === 'trade'
      ? 'Tell me the venue, the dates and the mood board. I will send a sketch, a per-piece price and a lead time within two business days.'
      : 'Tell me the room, the date and the feeling. I will send a sketch, a price and a lead time within two business days.';

    var form = h('form', { class: 'rw-form', novalidate: true, action: o.endpoint || '#', method: 'post', enctype: 'multipart/form-data' },
      h('input', { type: 'hidden', name: 'form', value: variant === 'trade' ? 'Trade inquiry' : 'Custom order' }),
      h('input', { type: 'hidden', name: 'product', value: o.prefillProduct || '' }),
      h('input', { type: 'hidden', name: 'page', value: typeof location !== 'undefined' ? location.pathname : '' }),
      h('input', { type: 'text', name: '_gotcha', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', style: { position: 'absolute', left: '-9999px' } }),
      o.prefillProduct ? h('p', { class: 'rw-help', text: 'About: ' + o.prefillProduct }) : null,
      h('div', { class: 'rw-form-row' },
        textField('name', 'Name', 'text', { autocomplete: 'name', error: 'Your name, so I know who I am writing to.' }),
        textField('email', 'Email', 'email', { autocomplete: 'email', error: 'A working email. The sketch goes here.' })),
      h('div', { class: 'rw-form-row' },
        textField('phone', 'Phone', 'tel', { optional: true, autocomplete: 'tel', inputmode: 'tel' }),
        variant === 'trade' ? textField('company', 'Company', 'text', { autocomplete: 'organization', error: 'Company or venue name.' }) : null),
      choiceGroup('purpose', 'This is for', FORM.purpose, { value: variant === 'trade' ? 'Business or venue' : null }),
      choiceGroup('wood', 'Wood', FORM.wood),
      choiceGroup('format', 'Format', FORM.format),
      choiceGroup('size', 'Size', FORM.size),
      choiceGroup('palette', 'Palette', FORM.palette, { other: true }),
      h('div', { class: 'rw-form-row' },
        textField('quantity', 'Quantity', 'number', { inputmode: 'numeric', min: '1', placeholder: variant === 'trade' ? '10 to 40' : '1', error: 'How many pieces.' }),
        variant === 'trade'
          ? textField('date_range', 'Event or install date range', 'text', { placeholder: 'Mar 14 to Mar 16, 2027', error: 'When it needs to be installed.' })
          : textField('needed_by', 'Needed by', 'date', { error: 'A date, even a rough one.' })),
      variant === 'trade' ? textField('needed_by', 'Needed by', 'date', { error: 'The date the first piece has to be in hand.' }) : null,
      choiceGroup('budget', 'Budget range', FORM.budget),
      h('div', { class: 'rw-field', 'data-field': 'inspiration' },
        h('label', { class: 'rw-label', for: 'inspiration-input' }, 'Upload inspiration or a room photo', h('span', { class: 'rw-optional', text: ' (up to 5 files)' })),
        h('div', { class: 'rw-upload' }, fileInput, h('p', { class: 'rw-help', id: 'upload-help', text: 'Photos or a PDF mood board. 10 MB each.' }), fileList)),
      textField('notes', 'Anything else', 'text', { textarea: true, optional: true, placeholder: 'Ceiling height, table length, the color of the walls, anything.' }),
      h('div', { class: 'rw-form-foot' },
        Button({ label: 'Send it to Michelle.', type: 'submit' }),
        variant === 'trade' ? h('p', { class: 'rw-form-note', text: 'Prefer a call? ' + (o.phone || '[phone]') + '.' }) : h('p', { class: 'rw-form-note', text: 'I reply within two business days.' })));
    fileInput.id = 'inspiration-input';

    var status = h('p', { class: 'rw-help', role: 'status', 'aria-live': 'polite' });

    function setError(fieldEl, show) {
      var err = fieldEl.querySelector('.rw-error');
      var ctl = fieldEl.querySelector('input:not([type=radio]):not([type=hidden]), textarea');
      if (err) err.hidden = !show;
      if (ctl) { if (show) ctl.setAttribute('aria-invalid', 'true'); else ctl.removeAttribute('aria-invalid'); }
    }
    function validate() {
      var firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll('[data-field]'), function (f) {
        var name = f.getAttribute('data-field');
        var ctl = f.querySelector('input:not([type=radio]), textarea');
        var bad = false;
        if (ctl) { bad = ctl.required && !ctl.checkValidity(); }
        else { bad = !form.querySelector('input[name="' + name + '"]:checked'); }
        if (name === 'inspiration') bad = false;
        setError(f, bad);
        if (bad && !firstBad) firstBad = f;
      });
      return firstBad;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = validate();
      if (bad) { status.textContent = 'A few fields still need you. I marked them.'; (bad.querySelector('input, textarea') || bad).focus(); return; }
      if (form.querySelector('[name=_gotcha]').value) return;
      var submit = form.querySelector('button[type=submit]');
      submit.disabled = true; status.textContent = 'Sending.';
      var data = new FormData(form);
      data.delete('inspiration'); files.forEach(function (f) { data.append('inspiration', f, f.name); });
      var transport = o.transport || (o.endpoint && o.endpoint.indexOf('script.google.com') >= 0 ? 'json' : 'multipart');
      var send;
      if (!o.endpoint) send = new Promise(function (res) { setTimeout(res, 600); });
      else if (transport === 'json') {
        /* Apps Script web app: JSON as text/plain (no CORS preflight), files base64 */
        send = Promise.all(files.map(function (f) {
          return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res({ name: f.name, type: f.type, data: String(r.result).split(',')[1] }); }; r.readAsDataURL(f); });
        })).then(function (encoded) {
          var body = {}; data.forEach(function (v, k) { if (k !== 'inspiration') body[k] = v; }); body.files = encoded;
          return fetch(o.endpoint, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) { if (j && j.ok === false) throw new Error(j.error || 'rejected'); });
      } else send = fetch(o.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } }).then(function (r) { if (!r.ok) throw new Error(r.status); });
      send.then(function () {
        var confirm = h('div', { class: 'rw-confirm', role: 'status' },
          h('h2', { class: 'rw-title', text: 'Got it.' }),
          h('p', { class: 'rw-body', text: 'I read every one of these myself. Expect a reply within two business days.' }),
          h('a', { class: 'rw-link', href: url('work'), text: 'See what I have built for other rooms' }));
        root.replaceChildren(confirm);
        if (typeof o.onSuccess === 'function') o.onSuccess(data);
      }).catch(function () {
        submit.disabled = false;
        status.className = 'rw-error';
        status.textContent = 'It did not go through. Try again, or email me at ' + (o.email || '[email]') + '.';
      });
    });
    root.appendChild(h('div', { class: 'rw-stack' }, o.hideIntro ? null : h('p', { class: 'rw-lead rw-measure', text: intro }), form, status));
    return root;
  }
  function mountInquiryForm(el, o) { var f = InquiryForm(o); el.replaceChildren(f); return f; }

  /* ---------- Pages: every page composed from the pieces above. `site` carries contact details, handles, endpoint, cart and images. ---------- */
  var Pages = {};
  function siteOf(o) { return (o && o.site) || {}; }
  function chrome(site, current) { var im = site.images || {}; return { nav: Nav({ current: current, markSrc: im.mark, hideMark: !im.mark }), footer: Footer({ markSrc: im.markOnDark || im.mark, email: site.email, instagram: site.instagram, pinterest: site.pinterest, etsy: site.etsy }) }; }
  function formBlock(o, variant, extra) {
    var site = siteOf(o);
    if (o.formPlaceholder) return h('div', { 'data-rw-form': variant, 'data-phone': site.phone || '', 'data-email': site.email || '' }, h('p', { class: 'rw-help', text: 'Loading the form.' }));
    return InquiryForm(Object.assign({ variant: variant, endpoint: o.endpoint || site.endpoint, phone: site.phone, email: site.email }, extra || {}));
  }
  function minPriceByFormat(products) {
    var out = {};
    (products || []).forEach(function (p) {
      var k = isStrand(p) ? 'strands-adornments' : isRaw(p) ? 'raw-wood' : /single/i.test(p.format || '') ? 'single-branches' : 'boxed-trees';
      if (typeof p.price === 'number' && (out[k] === undefined || p.price < out[k])) out[k] = p.price;
    });
    Object.keys(out).forEach(function (k) { out[k] = 'From ' + money(out[k]); });
    return out;
  }

  Pages.Home = function (o) {
    o = o || {}; var site = siteOf(o), im = site.images || {}, c = chrome(site, 'home');
    return h('div', null, c.nav, Hero({ images: im.hero }), TwoWoods({ images: im.woods }), FormatTiles({ images: im.formats, from: minPriceByFormat(o.products) }), ProcessStrip({ images: im.box3 }), DressCrossfade({ images: im.dress }), WorkStrip({ entries: o.work }), TradeBand(), CustomBand(), EmailSignup({ action: site.newsletterAction }), c.footer);
  };

  var COLLECTIONS = {
    'boxed-trees': { name: 'Boxed Trees', intro: 'Set in concrete inside a cedar box I build by hand. Stand it and walk away.', format: 'boxed' },
    'single-branches': { name: 'Single Branches', intro: 'Free-standing. Lean it, lay it, hang it. Place it however you like.', format: 'single' },
    'strands-adornments': { name: 'Strands & Adornments', intro: 'Bead strands, macrame feathers, capiz discs, shell drops, tassels. Made in-house, hung from the branches, swapped by season.', format: 'strand' },
    'raw-wood': { name: 'Raw Wood', intro: 'Untreated branches for orchid growers and reptile and aquarium keepers. Nothing on it but sandpaper.', format: 'raw' }
  };
  Pages.Shop = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, 'shop');
    var col = o.collection ? COLLECTIONS[o.collection] : null;
    var products = (o.products || []).slice();
    if (col) products = products.filter(function (p) { return (p.format || '').toLowerCase().indexOf(col.format) === 0 || (col.format === 'raw' && isRaw(p)); });
    var cards = products.length ? products.map(ProductCard) : [h('p', { class: 'rw-body rw-muted', text: 'Nothing here yet. New pieces drop in small batches.' })];
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: col ? col.name : 'Shop' }), h('p', { class: 'rw-lead rw-measure', text: col ? col.intro : 'Boxed trees, single branches, strands and raw wood. Every piece tagged Ember or Bone.' })),
      h('div', { class: 'rw-container', style: { paddingBottom: '96px' } },
        h('div', { class: 'rw-shop' }, FilterBar({ open: false }),
          h('div', null,
            h('div', { class: 'rw-shop-head' }, h('p', { class: 'rw-caption', 'data-rw-count': true, text: products.length + ' piece' + (products.length === 1 ? '' : 's') }), h('div', { class: 'rw-row' }, h('label', { class: 'rw-caption', for: 'rw-sort', text: 'Sort' }), h('select', { class: 'rw-select', id: 'rw-sort', 'data-rw-sort': true, style: { minHeight: '40px', width: 'auto' } }, h('option', { value: 'newest', text: 'Newest' }), h('option', { value: 'price', text: 'Price, low to high' }), h('option', { value: 'height', text: 'Height, tall first' })))),
            h('div', { class: 'rw-grid', 'data-rw-grid': true }, cards),
            h('p', { class: 'rw-body rw-muted', 'data-rw-empty': true, hidden: true, text: 'Nothing matches all of that yet. Loosen a filter, or tell me what you need on the Custom page.' })))),
      h('div', { class: 'rw-container', style: { paddingBottom: '64px' } }, TrustStrip({ returnDays: site.returnDays })),
      c.footer);
  };

  Pages.Product = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, 'shop'), p = o.product || {}, im = p.images || {};
    var title = productTitle(p), raw = isRaw(p), strand = isStrand(p);
    var shots = [['front', 'front, on cream'], ['threeQuarter', 'three-quarter view'], ['detail', 'bark and grain detail'], ['scale', 'with a hand for scale'], ['room', 'in a room']];
    var gallery = shots.map(function (sh, i) { return Img({ ratio: i === 0 ? '4-5' : '1', tone: i === 2 ? (p.wood || 'ember').toLowerCase() : i === 4 ? 'room' : 'white', src: im[sh[0]], eager: i === 0, label: sh[1], alt: productAlt(p, sh[1]), wood: i === 0 && !strand ? p.wood : null }); });
    var cart = site.cart || {};
    var buy;
    if (cart.key && typeof p.price === 'number' && p.inStock !== false) {
      buy = h('button', { class: 'rw-btn rw-btn-primary rw-btn-block snipcart-add-item', type: 'button', 'data-item-id': p.id || slugify(title), 'data-item-name': title, 'data-item-price': String(p.price), 'data-item-url': productUrl(p), 'data-item-image': im.front || '', 'data-item-weight': p.weightLb ? String(Math.round(p.weightLb * 453.6)) : null, 'data-item-description': (p.wood ? cap(p.wood) + ' manzanita, ' : '') + (p.height ? p.height + ' in' : ''), 'data-item-max-quantity': p.oneOfAKind ? '1' : null, text: 'Add to cart' });
    } else if (p.inStock === false) {
      buy = Button({ label: 'Sold. Ask for one like it.', variant: 'secondary', block: true, href: url('custom') + '?product=' + encodeURIComponent(title) });
    } else if (p.etsyUrl || site.etsy) {
      buy = Button({ label: 'Buy on Etsy', block: true, href: p.etsyUrl || site.etsy });
    } else {
      buy = Button({ label: 'Ask about this piece', block: true, href: url('custom') + '?product=' + encodeURIComponent(title) });
    }
    var specRows = [
      ['Wood', (p.wood ? cap(p.wood) : '[Wood]') + (p.wood === 'ember' || p.wood === 'Ember' ? '. Cut while living, deep red bark.' : p.wood ? '. Standing deadwood, sun-bleached.' : '')],
      ['Height', p.height ? p.height + ' in' : '[height] in'],
      p.spread ? ['Spread', p.spread + ' in'] : null,
      p.box ? ['Box', p.box] : null,
      ['Finish', p.finish || (raw ? 'Raw and untreated' : 'Sanded, waxed and sealed')],
      ['Weight', p.weightLb ? p.weightLb + ' lb' : '[weight]'],
      ['Adornments included', p.adornments || 'None'],
      ['Lead time', p.inStock === false ? 'Sold' : p.leadTime || 'In stock, ships in 3 days']
    ].filter(Boolean);
    var pairs = (o.products || []).filter(function (q) { return isStrand(q) && (!q.pairsWith || q.pairsWith.map(function (w) { return w.toLowerCase(); }).indexOf((p.wood || '').toLowerCase()) >= 0); }).slice(0, 3);
    var below = strand ? null : raw
      ? Section({ title: 'Other raw sizes', children: h('div', { class: 'rw-grid cols-3' }, (o.products || []).filter(function (q) { return isRaw(q) && q !== p; }).slice(0, 3).map(ProductCard)) })
      : pairs.length ? Section({ title: 'Pairs with', intro: 'Three strand sets matched to ' + cap(p.wood || 'bone') + '. Hang them, swap them, take them off.', children: h('div', { class: 'rw-grid cols-3' }, pairs.map(ProductCard)) })
      : PairsWith({ wood: (p.wood || 'bone').toLowerCase() });
    return h('div', null, c.nav,
      h('div', { class: 'rw-container', style: { paddingTop: '32px', paddingBottom: '64px' } },
        h('nav', { 'aria-label': 'Breadcrumb', class: 'rw-caption', style: { marginBottom: '24px' } }, h('a', { href: url('shop'), text: 'Shop' }), ' / ', h('span', { text: title })),
        h('div', { class: 'rw-product' },
          h('div', { class: 'rw-gallery', 'data-rw-gallery': true }, gallery[0], h('div', { class: 'rw-gallery-thumbs' }, gallery.slice(1))),
          h('div', { class: 'rw-buy' },
            h('div', { class: 'rw-buy-head' }, strand ? (p.palette ? h('span', { class: 'rw-tag rw-tag-sage', text: p.palette }) : null) : WoodTag({ wood: (p.wood || 'ember').toLowerCase() }), h('h1', { class: 'rw-headline', text: title }),
              h('div', { class: 'rw-buy-price' }, h('span', { class: 'rw-price', text: typeof p.price === 'number' ? money(p.price) : (p.price || '$[price]') }), p.oneOfAKind ? Badge() : null),
              Stock({ inStock: p.inStock !== false })),
            h('div', { class: 'rw-stack' }, buy, Button({ label: 'Want this in a different size or palette? Ask.', variant: 'quiet', block: true, href: url('custom') + '?product=' + encodeURIComponent(title) })),
            p.description ? h('p', { class: 'rw-body', text: p.description }) : null,
            strand ? null : h('div', { class: 'rw-split', style: { gap: '16px', gridTemplateColumns: '120px 1fr', alignItems: 'center' } }, Img({ ratio: '1', tone: (p.wood || 'ember').toLowerCase(), src: im.detail, label: 'Grain', alt: productAlt(p, 'grain macro') }), h('p', { class: 'rw-body-strong', text: 'Smooth enough to run a hand down.' })),
            SpecBlock({ rows: strand ? [['Palette', p.palette || '[Palette]'], ['Materials', p.materials || '[materials]'], ['Fits', p.fits || 'Trees 24 in and up'], ['Lead time', p.leadTime || 'In stock, ships in 3 days']] : specRows }),
            strand ? null : HabitatWarning({ raw: raw }),
            h('p', { class: 'rw-body', text: raw ? 'Rinse, then bake or boil before it goes into a habitat. Store dry.' : 'Dust with a soft brush. Keep finished pieces out of direct sun. That is the whole list.' }),
            TrustStrip({ returnDays: site.returnDays })))),
      below,
      c.footer);
  };

  Pages.Custom = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, 'custom');
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: 'Custom' })),
      h('div', { class: 'rw-container', style: { maxWidth: '880px', paddingBottom: '96px' } }, formBlock(o, 'custom', { prefillProduct: o.prefillProduct })),
      c.footer);
  };

  Pages.Trade = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, 'trade');
    var blocks = [
      ['Volume', '10 to 40 matching pieces per order. Same wood, same height range, same box stain. I build them as a set so they photograph as one.'],
      ['Palette', 'Built to your mood board, bare or dressed. Send the board and I match strands to it, or leave the branches clean.'],
      ['Timing', 'Lead time 3 to 5 weeks. Rush is possible, ask. Q1 and spring décor books in November and December.']
    ];
    var names = site.tradeNames && site.tradeNames.length ? site.tradeNames : null;
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: 'For planners, florists, venues and hotels.' })),
      h('div', { class: 'rw-container', style: { paddingBottom: '64px' } },
        h('div', { class: 'rw-three' }, blocks.map(function (b) { return h('div', { class: 'rw-block' }, h('h2', { class: 'rw-title', text: b[0] }), h('p', { class: 'rw-body', text: b[1] })); }))),
      h('section', { class: 'rw-band', 'data-theme': 'bark' }, h('div', { class: 'rw-container rw-stack' },
        h('p', { class: 'rw-headline', text: '20 years producing events in San Diego. I know what arrives broken and what photographs.' }),
        names ? h('div', { class: 'rw-logos' }, names.map(function (n) { return h('span', { text: n }); })) : null)),
      h('div', { class: 'rw-container', style: { maxWidth: '880px', paddingTop: '64px', paddingBottom: '96px' } },
        h('div', { class: 'rw-stack' }, h('h2', { class: 'rw-headline', text: 'Trade inquiry' })),
        h('div', { style: { height: '32px' } }),
        formBlock(o, 'trade', { phone: o.phone || site.phone })),
      c.footer);
  };

  Pages.Work = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, 'work');
    var cats = ['All', 'Homes', 'Events', 'Hospitality', 'Orchid mounts', 'Habitats'];
    var entries = o.entries && o.entries.length ? o.entries : [
      { wood: 'bone', where: 'Hotel lobby, La Jolla', clientType: 'Hospitality', count: '14 Bone boxed trees', palette: 'Bare' },
      { wood: 'ember', where: 'Backyard wedding, Rancho Santa Fe', clientType: 'Events', count: '22 Ember branches', palette: 'Dune' },
      { wood: 'ember', where: 'Dining room, North Park', clientType: 'Homes', count: '1 Ember boxed tree, 42 in', palette: 'Ink' },
      { wood: 'bone', where: 'Orchid wall, Point Loma', clientType: 'Orchid mounts', count: '9 raw branches' }
    ];
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: 'Work' }), h('p', { class: 'rw-lead rw-measure', text: 'Installed pieces, events and client homes. Every photo is a real room.' }),
        h('div', { class: 'rw-chips', role: 'group', 'aria-label': 'Filter work', 'data-rw-workfilter': true }, cats.map(function (cat, i) { return h('button', { class: 'rw-chip', type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false', 'data-cat': slugify(cat), text: cat }); }))),
      h('div', { class: 'rw-container', style: { display: 'grid', gap: '64px', paddingBottom: '64px' }, 'data-rw-work': true }, entries.map(GalleryEntry)),
      Section({ title: 'Two states', intro: 'Raw branch on the left, as it came off the ranch. Finished piece on the right.', children: TwoStates({ pairs: o.twoStates }) }),
      h('section', { class: 'rw-section' }, h('div', { class: 'rw-container rw-stack' },
        h('h2', { class: 'rw-headline', text: 'Bought a piece? Send me the photo in its room and I will add it here.' }),
        h('a', { class: 'rw-link', href: 'mailto:' + (site.email || '[email]') + '?subject=My%20Rooted%20and%20Wild%20piece', text: 'Send a photo' }))),
      c.footer);
  };

  Pages.Studio = function (o) {
    o = o || {}; var site = siteOf(o), im = site.images || {}, c = chrome(site, 'studio');
    var steps = ['Rough cedar, measured', 'Cut on the saw', 'Joined and sanded', 'Stained, two coats', 'Tree set in concrete'];
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: 'Studio' })),
      Section({ id: 'wood', children: h('div', { class: 'rw-split' },
        Img({ ratio: '4-5', tone: 'room', src: im.portrait, label: 'Portrait: Michelle in the workshop, branch in hand', alt: 'Michelle Khair in the Rooted and Wild workshop holding a manzanita branch' }),
        h('div', { class: 'rw-stack' },
          h('p', { class: 'rw-overline rw-muted', text: '01' }),
          h('h2', { class: 'rw-display-2', text: 'The wood' }),
          h('p', { class: 'rw-body', text: 'Every branch comes from one ranch in Descanso, in the mountains east of San Diego. I walk the property and select by hand. Nothing is cut that does not need to come down, and the landowner signs off on every load.' }),
          h('p', { class: 'rw-body', text: 'Ember is cut while the tree is living. Bone is standing deadwood that the sun has already bleached. Same species, two completely different objects.' }),
          h('div', { class: 'rw-woods' }, WoodPanel('ember', im.woods), WoodPanel('bone', im.woods)))) }),
      Section({ id: 'box', title: 'The box', intro: 'Cedar, cut, sanded and stained by hand. Open the carton and you smell it before you see it.', children: h('div', { class: 'rw-steps-5' }, steps.map(function (s, i) { return h('figure', null, Img({ ratio: '4-5', tone: 'cedar', src: im.box5 && im.box5[i], label: s, alt: 'Cedar box process, ' + s.toLowerCase() }), h('figcaption', { class: 'rw-caption', text: s })); })) }),
      Section({ id: 'hands', children: h('div', { class: 'rw-split is-reverse' },
        h('div', { class: 'rw-stack' },
          h('p', { class: 'rw-overline rw-muted', text: '03' }),
          h('h2', { class: 'rw-display-2', text: 'The hands' }),
          h('p', { class: 'rw-body', text: 'I spent twenty years producing events in San Diego. Ballrooms, backyards, hotel lobbies at two in the morning. I was always the one asking the florist for one more branch, then moving it myself after everyone left. At some point I realized the branch was the part I loved.' }),
          h('p', { class: 'rw-body', text: 'So now I make the object. I pick the wood, I sand it until it is smooth enough to run a hand down, I build the box it stands in. When a planner calls for fifteen matching pieces, I know exactly what arrives broken and what photographs, because I have been on the other end of that call.' })),
        h('div', { class: 'rw-stack' },
          Img({ ratio: '1', tone: 'ember', src: im.macro, label: 'Macro: Ember bark grain under finish', alt: 'Macro of Ember manzanita bark under wax finish' }),
          h('div', { class: 'rw-audio' },
            h('p', { class: 'rw-body-strong', text: 'Dense wood rings. Listen.' }),
            h('audio', { controls: true, preload: 'none', src: site.audioSrc || (o && o.audioSrc) || '' }),
            h('p', { class: 'rw-caption', text: 'Six seconds. A Bone branch, tapped twice.' })))) }),
      c.footer);
  };

  Pages.Shipping = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, null);
    var days = site.returnDays || '[14]';
    var blocks = [
      ['Local pickup', 'Local pickup in San Diego. Pick a window at checkout and I will have it ready at the studio.'],
      ['Shipping', 'Shipping is insured and calculated by weight and box size. Boxed trees ship in a double-walled carton, braced at the base. Branches ship flat.'],
      ['Arrives unsealed', 'The box arrives unsealed inside the carton so you smell the cedar first. Inspect the piece before you decide to keep it.'],
      ['A honey stick', 'Every order ships with a local honey stick, tied to the beeswax finish on the wood.'],
      ['Returns', days + ' days on unused pieces, in the box they came in. Custom and trade orders are final once the sketch is approved.'],
      ['If it arrives broken', 'Photograph the carton and the piece before you move anything and email me within 48 hours. I will replace it.']
    ];
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title' }, h('h1', { class: 'rw-display-2', text: 'Shipping and returns' })),
      h('div', { class: 'rw-container', style: { maxWidth: '880px', paddingBottom: '96px', display: 'grid', gap: '32px' } }, blocks.map(function (b) { return h('div', { class: 'rw-block' }, h('h2', { class: 'rw-title', text: b[0] }), h('p', { class: 'rw-body', text: b[1] })); }), TrustStrip({ returnDays: site.returnDays })),
      c.footer);
  };

  Pages.NotFound = function (o) {
    o = o || {}; var site = siteOf(o), c = chrome(site, null);
    return h('div', null, c.nav,
      h('div', { class: 'rw-container rw-page-title', style: { paddingBottom: '96px' } }, h('h1', { class: 'rw-display-2', text: 'That page is not here.' }), h('p', { class: 'rw-lead rw-measure', text: 'It may have sold. Everything that is still standing is in the shop.' }), h('div', { class: 'rw-btn-row' }, Button({ label: 'Shop trees', href: url('shop') }))),
      c.footer);
  };

  /* ---------- export ---------- */
  var RW = window.RootedWild || {};
  Object.assign(RW, {
    h: h, Img: Img, Wordmark: Wordmark, Nav: Nav, Button: Button, WoodTag: WoodTag, Badge: Badge, Stock: Stock, ProductCard: ProductCard, Section: Section,
    Hero: Hero, TwoWoods: TwoWoods, WoodPanel: WoodPanel, FormatTiles: FormatTiles, ProcessStrip: ProcessStrip, DressCrossfade: DressCrossfade, WorkStrip: WorkStrip,
    TradeBand: TradeBand, CustomBand: CustomBand, EmailSignup: EmailSignup, Footer: Footer, FilterBar: FilterBar, SpecBlock: SpecBlock, HabitatWarning: HabitatWarning,
    PairsWith: PairsWith, TrustStrip: TrustStrip, GalleryEntry: GalleryEntry, TwoStates: TwoStates, InquiryForm: InquiryForm, mountInquiryForm: mountInquiryForm, Pages: Pages,
    LINKS: LINKS, FORM: FORM, FILTERS: FILTERS, FORMATS: FORMATS, COLLECTIONS: COLLECTIONS, money: money, slugify: slugify, productTitle: productTitle, productUrl: productUrl, url: url
  });
  window.RootedWild = RW;
})();

/* Rooted & Wild · site.js · wakes up the prerendered pages: forms, the one crossfade, filters, menu, gallery, signup */
(function () {
  'use strict';
  var RW = window.RootedWild, cfg = window.RW_CONFIG || {};
  if (!RW) return;
  var h = RW.h;

  /* ---------- forms (Custom, Trade) ---------- */
  var params = new URLSearchParams(location.search);
  document.querySelectorAll('[data-rw-form]').forEach(function (el) {
    RW.mountInquiryForm(el, { variant: el.getAttribute('data-rw-form'), endpoint: cfg.endpoint || '', phone: el.getAttribute('data-phone') || cfg.phone, email: el.getAttribute('data-email') || cfg.email, prefillProduct: params.get('product') || '' });
  });

  /* ---------- the crossfade: swap the static section for the live one ---------- */
  var dress = document.getElementById('dress');
  if (dress) dress.replaceWith(RW.DressCrossfade({ images: cfg.dressImages }));

  /* ---------- email signup ---------- */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.rw-signup form');
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input[type=email]'), msg = form.parentNode.querySelector('.rw-help, .rw-error') || form.parentNode.appendChild(h('p', { class: 'rw-help' }));
    if (!input.checkValidity()) { input.setAttribute('aria-invalid', 'true'); msg.className = 'rw-error'; msg.textContent = 'That email does not look right.'; return; }
    input.removeAttribute('aria-invalid');
    var done = function () { msg.className = 'rw-help'; msg.textContent = 'You are on the list. First look at the next batch goes to you.'; form.reset(); };
    if (cfg.newsletterAction) {
      var data = new FormData(form); data.append('source', location.pathname);
      fetch(cfg.newsletterAction, { method: 'POST', body: data, mode: 'no-cors' }).then(done, done);
    } else done();
  });

  /* ---------- mobile menu ---------- */
  document.querySelectorAll('.rw-nav-menu').forEach(function (btn) {
    var nav = btn.closest('.rw-nav'), open = false, drawer = null;
    btn.addEventListener('click', function () {
      open = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
      if (!drawer) {
        var links = Array.prototype.map.call(nav.querySelectorAll('.rw-nav-links a'), function (a) { return h('li', null, h('a', { href: a.getAttribute('href'), 'aria-current': a.getAttribute('aria-current'), text: a.textContent })); });
        drawer = h('div', { class: 'rw-drawer' }, h('div', { class: 'rw-container' }, h('ul', { class: 'rw-drawer-links' }, links)));
        nav.appendChild(drawer);
      }
      drawer.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('rw-menu-open', open);
    });
  });

  /* ---------- shop: filters, sort, URL presets ---------- */
  var grid = document.querySelector('[data-rw-grid]');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.rw-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.rw-filter-group .rw-chip'));
    var count = document.querySelector('[data-rw-count]'), empty = document.querySelector('[data-rw-empty]'), sort = document.querySelector('[data-rw-sort]');
    ['wood', 'format', 'height', 'palette', 'price', 'stock'].forEach(function (k) {
      var v = params.get(k); if (!v) return;
      chips.forEach(function (c) { if (c.getAttribute('data-key') === k && c.getAttribute('data-value') === v.toLowerCase()) c.setAttribute('aria-pressed', 'true'); });
    });
    function apply() {
      var active = {};
      chips.forEach(function (c) { if (c.getAttribute('aria-pressed') === 'true') { var k = c.getAttribute('data-key'); (active[k] = active[k] || []).push(c.getAttribute('data-value')); } });
      var shown = 0;
      cards.forEach(function (card) {
        var ok = Object.keys(active).every(function (k) { return active[k].indexOf(card.getAttribute('data-' + k) || '') >= 0; });
        card.hidden = !ok; if (ok) shown++;
      });
      if (count) count.textContent = shown + ' piece' + (shown === 1 ? '' : 's');
      if (empty) empty.hidden = shown > 0;
      var q = new URLSearchParams();
      Object.keys(active).forEach(function (k) { if (active[k].length === 1) q.set(k, active[k][0]); });
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); apply(); }); });
    if (sort) sort.addEventListener('change', function () {
      var by = sort.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (by === 'price') return (+a.getAttribute('data-price-num')) - (+b.getAttribute('data-price-num'));
        if (by === 'height') return (+b.getAttribute('data-height-num')) - (+a.getAttribute('data-height-num'));
        return cards.indexOf(a) - cards.indexOf(b);
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
    });
    apply();
  }

  /* ---------- work: category chips ---------- */
  var wf = document.querySelector('[data-rw-workfilter]');
  if (wf) {
    var entries = Array.prototype.slice.call(document.querySelectorAll('[data-rw-work] .rw-entry'));
    wf.addEventListener('click', function (e) {
      var b = e.target.closest('.rw-chip'); if (!b) return;
      wf.querySelectorAll('.rw-chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      var cat = b.getAttribute('data-cat');
      entries.forEach(function (en) { en.hidden = cat !== 'all' && en.getAttribute('data-cat') !== cat; });
    });
  }

  /* ---------- product gallery: thumbnails swap into the main slot ---------- */
  var gal = document.querySelector('[data-rw-gallery]');
  if (gal) {
    var main = gal.querySelector(':scope > .rw-img');
    gal.querySelectorAll('.rw-gallery-thumbs .rw-img').forEach(function (t) {
      t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button');
      function swap() {
        var mi = main.innerHTML, mc = main.className, ml = main.getAttribute('aria-label'), ti = t.innerHTML, tc = t.className, tl = t.getAttribute('aria-label');
        main.innerHTML = ti; main.className = tc.replace('ratio-1', 'ratio-4-5'); if (tl) main.setAttribute('aria-label', tl); else main.removeAttribute('aria-label');
        t.innerHTML = mi; t.className = mc.replace('ratio-4-5', 'ratio-1'); if (ml) t.setAttribute('aria-label', ml); else t.removeAttribute('aria-label');
      }
      t.addEventListener('click', swap);
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swap(); } });
    });
  }

  /* ---------- cart count (Snipcart) ---------- */
  document.addEventListener('snipcart.ready', function () {
    if (!window.Snipcart) return;
    window.Snipcart.store.subscribe(function () {
      var n = window.Snipcart.store.getState().cart.items.count;
      document.querySelectorAll('.snipcart-items-count').forEach(function (el) { el.textContent = n; });
    });
  });
})();
