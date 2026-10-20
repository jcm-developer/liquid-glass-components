/**
 * Refraction engine and interaction behaviours for Liquid Glass Components.
 *
 * Liquid Glass Components v2.1.0. Zero dependencies. MIT.
 * https://github.com/jcm-developer/liquid-glass-components
 *
 * Usage:
 *   <script src="liquid-glass.js" defer></script>
 *
 * Refraction: any element with [data-refract] gets an SVG displacement filter generated
 * from its own rounded shape, so the backdrop bends at the bezel like a lens. Strength,
 * bezel, frost and dispersion come from the CSS tokens (--glass-refraction, --glass-bezel,
 * --glass-blur, --glass-chroma) and can be overridden per element with
 * data-refract-strength, data-refract-bezel, data-refract-blur and data-refract-chroma.
 * It is a progressive enhancement: Chromium only (backdrop-filter: url()). Everywhere else,
 * and under reduced transparency, increased contrast or forced colours, the CSS blur
 * fallback from the snippets stays in place.
 *
 * Behaviours, initialised automatically:
 *   .glass-tabs, .glass-segmented, .glass-sidebar__nav, [data-glass-indicator]
 *       sliding and stretching selection indicator, roving focus, arrow keys
 *   .glass-toggle      aria-checked switching
 *   .glass-slider      fill percentage and linked <output>
 *   .glass-dock        proximity magnification
 *   .glass-nav-bar     scroll edge and collapsing title (is-scrolled, is-collapsed)
 *   .glass-sheen       pointer-reactive highlight
 *
 * Options on <html>:
 *   data-glass-refract="off"     disables refraction
 *   data-glass-refract="always"  also refracts on touch devices (off there by default)
 *   data-glass-auto="off"        skips auto-init; call LiquidGlass.init() yourself
 *
 * Events: 'glass:change' bubbles from indicators ({ item, value, index }) and toggles
 * ({ checked }).
 */
(function (global) {
  'use strict';
  if (typeof document === 'undefined') return;

  /** Library version, kept in step with the snippet headers. */
  const VERSION = '2.1.0';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const html = document.documentElement;
  const mq = (query) => global.matchMedia(query);
  /** Preferences under which refraction must stand down for the solid fallbacks. */
  const blockers = [
    mq('(prefers-reduced-transparency: reduce)'),
    mq('(forced-colors: active)'),
    mq('(prefers-contrast: more)'),
  ];
  const coarse = mq('(pointer: coarse)');
  const reducedMotion = mq('(prefers-reduced-motion: reduce)');
  const brands = navigator.userAgentData && navigator.userAgentData.brands;
  // backdrop-filter: url() only renders in Chromium; Safari and Firefox ignore it.
  const isChromium = !!(brands && brands.some((b) => b.brand === 'Chromium'));

  /* ── Refraction engine ── */

  const records = new Map();
  const mapCache = new Map();
  /** Maximum number of displacement maps kept in memory. */
  const MAP_CACHE_SIZE = 48;
  let defs = null;
  let uid = 0;
  let active = false;

  /**
   * Checks whether refraction may run with the current browser and preferences.
   *
   * @return {boolean} True when the SVG filter path is allowed.
   */
  function canRefract() {
    const mode = html.dataset.glassRefract;
    if (mode === 'off' || !isChromium) return false;
    if (blockers.some((m) => m.matches)) return false;
    // Touch devices skip it by default: one filter per surface costs battery.
    if (coarse.matches && mode !== 'always') return false;
    return true;
  }

  /**
   * Returns the shared hidden <defs> that holds every filter, creating it on first use.
   *
   * @return {SVGDefsElement} The defs element.
   */
  function svgDefs() {
    if (defs && defs.isConnected) return defs;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return defs;
  }

  /**
   * Builds the displacement map of a rounded rectangle as a PNG data URL.
   *
   * Inside the bezel each pixel samples the backdrop further inward along the edge normal,
   * which is how the rim of a convex lens bends light. Red encodes the x offset, green the
   * y offset; 128 means no displacement. Maps are cached by geometry (least recently used).
   *
   * @param {number} w - The width in CSS pixels.
   * @param {number} h - The height in CSS pixels.
   * @param {number} r - The corner radius in CSS pixels.
   * @param {number} bezel - The width of the curved edge in CSS pixels.
   * @return {string} The map as a data URL.
   */
  function displacementMap(w, h, r, bezel) {
    const key = w + 'x' + h + 'r' + r + 'b' + bezel;
    if (mapCache.has(key)) {
      const hit = mapCache.get(key);
      mapCache.delete(key);
      mapCache.set(key, hit);
      return hit;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const hw = w / 2;
    const hh = h / 2;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5 - hw;
        const py = y + 0.5 - hh;
        const qx = Math.abs(px) - (hw - r);
        const qy = Math.abs(py) - (hh - r);
        let dist;
        let nx = 0;
        let ny = 0;
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy);
          dist = r - l;
          nx = (qx / l) * Math.sign(px);
          ny = (qy / l) * Math.sign(py);
        } else {
          dist = r - Math.max(qx, qy);
          if (qx > qy) nx = Math.sign(px);
          else ny = Math.sign(py);
        }
        let mag = 0;
        if (dist > 0 && dist < bezel) {
          const t = 1 - dist / bezel;
          mag = t * t;
        }
        const i = (y * w + x) * 4;
        d[i] = 128 - nx * mag * 127;
        d[i + 1] = 128 - ny * mag * 127;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const url = canvas.toDataURL();
    mapCache.set(key, url);
    if (mapCache.size > MAP_CACHE_SIZE) mapCache.delete(mapCache.keys().next().value);
    return url;
  }

  /**
   * Creates the SVG filter for one element.
   *
   * The backdrop is displaced three times with slightly different strengths, one per colour
   * channel, and recombined: that small split is the chromatic fringe at the edge.
   *
   * @param {string} id - The filter id.
   * @return {Object} The filter element and the primitives the engine updates.
   */
  function createFilter(id) {
    svgDefs().insertAdjacentHTML('beforeend',
      '<filter id="' + id + '" x="0" y="0" width="1" height="1" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
        '<feImage x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/>' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="2" edgeMode="duplicate" result="src"/>' +
        '<feDisplacementMap in="src" in2="map" xChannelSelector="R" yChannelSelector="G" result="dr"/>' +
        '<feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>' +
        '<feDisplacementMap in="src" in2="map" xChannelSelector="R" yChannelSelector="G" result="dg"/>' +
        '<feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>' +
        '<feDisplacementMap in="src" in2="map" xChannelSelector="R" yChannelSelector="G" result="db"/>' +
        '<feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>' +
        '<feBlend in="r" in2="g" mode="screen" result="rg"/>' +
        '<feBlend in="rg" in2="b" mode="screen" result="rgb"/>' +
        '<feColorMatrix in="rgb" type="saturate" values="1.8"/>' +
      '</filter>');
    const filter = document.getElementById(id);
    return {
      filter,
      img: filter.getElementsByTagName('feImage')[0],
      blur: filter.getElementsByTagName('feGaussianBlur')[0],
      disp: filter.getElementsByTagName('feDisplacementMap'),
      sat: filter.querySelector('[type="saturate"]'),
    };
  }

  /**
   * Parses a number, falling back when the value is empty or invalid.
   *
   * @param {*} value - The value to parse.
   * @param {number} fallback - The value used when parsing fails.
   * @return {number} The parsed number or the fallback.
   */
  function num(value, fallback) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  /**
   * Resolves an element's refraction options: data attributes win over CSS tokens, and
   * values passed to update() win over both.
   *
   * @param {HTMLElement} el - The glass element.
   * @param {Object} rec - The element's engine record.
   * @return {Object} The strength, bezel, blur, chroma and saturate values.
   */
  function readOptions(el, rec) {
    const cs = getComputedStyle(el);
    const d = el.dataset;
    return Object.assign({
      strength: num(d.refractStrength, num(cs.getPropertyValue('--glass-refraction'), 48)),
      bezel: num(d.refractBezel, num(cs.getPropertyValue('--glass-bezel'), 22)),
      blur: num(d.refractBlur, num(cs.getPropertyValue('--glass-blur'), 2)),
      chroma: num(d.refractChroma, num(cs.getPropertyValue('--glass-chroma'), 0.5)),
      saturate: num(cs.getPropertyValue('--glass-saturation'), 180) / 100,
    }, rec.overrides);
  }

  /**
   * Writes the current options into the filter primitives.
   *
   * @param {Object} rec - The element's engine record.
   */
  function writeParams(rec) {
    const o = rec.opts;
    rec.nodes.blur.setAttribute('stdDeviation', o.blur);
    [1, 1 - 0.07 * o.chroma, 1 - 0.14 * o.chroma].forEach((k, i) => {
      rec.nodes.disp[i].setAttribute('scale', (o.strength * k).toFixed(2));
    });
    rec.nodes.sat.setAttribute('values', o.saturate);
  }

  /**
   * Sizes the filter region and its map image to the element.
   *
   * @param {Object} rec - The element's engine record.
   * @param {number} w - The width in CSS pixels.
   * @param {number} h - The height in CSS pixels.
   */
  function sizeFilter(rec, w, h) {
    [rec.nodes.filter, rec.nodes.img].forEach((node) => {
      node.setAttribute('width', w);
      node.setAttribute('height', h);
    });
  }

  /**
   * Removes the inline filter so the snippet's CSS fallback takes over again.
   *
   * @param {HTMLElement} el - The glass element.
   */
  function clearStyle(el) {
    el.style.removeProperty('backdrop-filter');
    el.style.removeProperty('-webkit-backdrop-filter');
    el.classList.remove('is-refracting');
  }

  /**
   * Returns the element's top-left corner radius in pixels, resolving percentages.
   *
   * @param {HTMLElement} el - The glass element.
   * @param {number} w - The width in CSS pixels.
   * @param {number} h - The height in CSS pixels.
   * @return {number} The radius, clamped to half the shorter side.
   */
  function radiusOf(el, w, h) {
    const raw = getComputedStyle(el).borderTopLeftRadius || '0';
    const value = parseFloat(raw) || 0;
    const r = raw.trim().endsWith('%') ? (value / 100) * Math.min(w, h) : value;
    return Math.round(Math.min(r, w / 2, h / 2));
  }

  /**
   * Builds or rebuilds an element's refraction, or removes it when it is not allowed.
   *
   * @param {HTMLElement} el - The glass element.
   */
  function apply(el) {
    const rec = records.get(el);
    if (!rec) return;
    if (!active || !rec.enabled) {
      clearStyle(el);
      rec.applied = false;
      return;
    }
    const w = Math.round(el.offsetWidth);
    const h = Math.round(el.offsetHeight);
    // Hidden elements report zero; the resize observer applies them once they show.
    if (!w || !h) return;
    rec.opts = readOptions(el, rec);
    if (rec.opts.strength <= 0) {
      clearStyle(el);
      rec.applied = false;
      return;
    }
    const bezel = Math.max(1, Math.round(Math.min(rec.opts.bezel, w / 2, h / 2)));
    sizeFilter(rec, w, h);
    rec.nodes.img.setAttribute('href', displacementMap(w, h, radiusOf(el, w, h), bezel));
    writeParams(rec);
    const value = 'url(#' + rec.id + ')';
    // Inline style is required to point at a per-element filter; it also beats the
    // snippet's blur fallback, which is why every blocker has to call clearStyle().
    el.style.setProperty('backdrop-filter', value);
    el.style.setProperty('-webkit-backdrop-filter', value);
    el.classList.add('is-refracting');
    rec.applied = true;
  }

  /**
   * Handles a size change. While the element is still resizing (a spring width animation,
   * for example) the current map is stretched; the exact map is rebuilt once it settles,
   * because building one on every frame would stall the animation.
   *
   * @param {HTMLElement} el - The glass element.
   */
  function onResize(el) {
    const rec = records.get(el);
    if (!rec) return;
    if (rec.applied) sizeFilter(rec, Math.round(el.offsetWidth), Math.round(el.offsetHeight));
    clearTimeout(rec.timer);
    rec.timer = setTimeout(() => apply(el), rec.applied ? 140 : 0);
  }

  const resizeObserver = 'ResizeObserver' in global
    ? new ResizeObserver((entries) => entries.forEach((e) => onResize(e.target)))
    : null;

  /**
   * Gives an element real refraction. Safe to call twice; the second call is ignored.
   *
   * @param {HTMLElement} el - The glass element.
   * @param {Object} [overrides] - Options that win over CSS tokens and data attributes:
   *     strength, bezel, blur, chroma.
   */
  function refract(el, overrides) {
    if (!el || records.has(el)) return;
    const id = 'glass-refract-' + (++uid);
    records.set(el, {
      id,
      nodes: createFilter(id),
      overrides: Object.assign({}, overrides),
      opts: null,
      enabled: true,
      applied: false,
      timer: 0,
    });
    if (resizeObserver) resizeObserver.observe(el);
    else apply(el);
  }

  /**
   * Changes an element's refraction options. Strength, blur and chroma only rewrite filter
   * attributes; a bezel change rebuilds the displacement map.
   *
   * @param {HTMLElement} el - The glass element.
   * @param {Object} overrides - The options to change: strength, bezel, blur, chroma.
   */
  function update(el, overrides) {
    const rec = records.get(el);
    if (!rec) return;
    Object.assign(rec.overrides, overrides);
    const wasOn = !!(rec.opts && rec.opts.strength > 0);
    const isOn = !('strength' in overrides) || overrides.strength > 0;
    if ('bezel' in overrides || !rec.applied || wasOn !== isOn) {
      apply(el);
      return;
    }
    rec.opts = readOptions(el, rec);
    writeParams(rec);
  }

  /**
   * Re-reads the CSS tokens of one element, or of every refracting element, and rebuilds.
   * Call it after changing a --glass-* custom property: style changes do not trigger
   * the resize observer.
   *
   * @param {HTMLElement} [el] - The element to refresh; omit to refresh all.
   */
  function refresh(el) {
    if (el) apply(el);
    else records.forEach((rec, node) => apply(node));
  }

  /**
   * Turns refraction on or off for one element without forgetting its options.
   *
   * @param {HTMLElement} el - The glass element.
   * @param {boolean} on - Whether refraction should render.
   */
  function enable(el, on) {
    const rec = records.get(el);
    if (!rec) return;
    rec.enabled = !!on;
    apply(el);
  }

  /**
   * Removes an element's refraction and its filter for good.
   *
   * @param {HTMLElement} el - The glass element.
   */
  function detach(el) {
    const rec = records.get(el);
    if (!rec) return;
    clearTimeout(rec.timer);
    if (resizeObserver) resizeObserver.unobserve(el);
    rec.nodes.filter.remove();
    clearStyle(el);
    records.delete(el);
  }

  /**
   * Re-checks the browser and preferences and applies or removes refraction everywhere.
   * Runs automatically when a blocking preference changes.
   */
  function reevaluate() {
    active = canRefract();
    html.classList.toggle('glass-refraction', active);
    refresh();
  }
  blockers.concat(coarse).forEach((m) => m.addEventListener('change', reevaluate));

  /* ── Selection indicator ── */

  /** Items an indicator can move between. */
  const ITEM_SELECTOR = '[role="tab"], [role="radio"], [data-glass-item], .glass-sidebar__link';
  /** Containers that get an indicator. */
  const INDICATOR_SELECTOR = '.glass-tabs, .glass-segmented, .glass-sidebar__nav, [data-glass-indicator]';

  /**
   * Returns the ARIA attribute that marks an item as selected.
   *
   * @param {Element} item - The tab, radio or link.
   * @return {string} The attribute name.
   */
  function stateAttr(item) {
    const role = item.getAttribute('role');
    if (role === 'radio') return 'aria-checked';
    if (role === 'tab') return 'aria-selected';
    return 'aria-current';
  }

  /**
   * Adds a sliding selection indicator to a tab bar, segmented control or sidebar, with
   * roving focus and arrow keys for tab and radio groups.
   *
   * @param {HTMLElement} el - The container.
   */
  function initIndicator(el) {
    if (el.__glassIndicator) return;
    const items = [...el.querySelectorAll(ITEM_SELECTOR)]
      .filter((item) => item.closest(INDICATOR_SELECTOR) === el);
    if (!items.length) return;

    // v1 markup marked selection with a class; keep it in sync so old CSS still works.
    const activeClass = (() => {
      for (const item of items) {
        for (const c of item.classList) if (c === 'active' || c.endsWith('--active')) return c;
      }
      return null;
    })();
    const isOn = (item) => {
      const attr = stateAttr(item);
      const v = item.getAttribute(attr);
      if (attr === 'aria-current') return (!!v && v !== 'false') || (!!activeClass && item.classList.contains(activeClass));
      return v === 'true';
    };
    const setOn = (item, on) => {
      const attr = stateAttr(item);
      if (attr === 'aria-current') {
        if (on) item.setAttribute(attr, 'page');
        else item.removeAttribute(attr);
      } else {
        item.setAttribute(attr, String(on));
      }
      if (activeClass) item.classList.toggle(activeClass, on);
    };
    const current = () => items.find(isOn) || null;
    const roving = items.every((item) => /^(tab|radio)$/.test(item.getAttribute('role') || ''));
    const vertical = el.getAttribute('aria-orientation') === 'vertical' || el.classList.contains('glass-sidebar__nav');

    const indicator = document.createElement('span');
    indicator.className = 'glass-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    el.prepend(indicator);
    el.classList.add('is-enhanced');

    /**
     * Moves the indicator onto an item.
     *
     * @param {?HTMLElement} item - The selected item, or null to hide the indicator.
     * @param {boolean} animate - Whether to spring there or jump instantly.
     */
    function place(item, animate) {
      if (!item) {
        indicator.style.opacity = '0';
        return;
      }
      indicator.style.opacity = '';
      if (!animate) indicator.classList.add('is-instant');
      indicator.style.setProperty('--glass-ind-x', item.offsetLeft + 'px');
      indicator.style.setProperty('--glass-ind-y', item.offsetTop + 'px');
      indicator.style.setProperty('--glass-ind-w', item.offsetWidth + 'px');
      indicator.style.setProperty('--glass-ind-h', item.offsetHeight + 'px');
      if (!animate) {
        void indicator.offsetWidth;
        indicator.classList.remove('is-instant');
        return;
      }
      // Restart the stretch so quick successive taps each get their squash.
      indicator.classList.remove('is-stretching');
      void indicator.offsetWidth;
      indicator.classList.add('is-stretching');
      clearTimeout(indicator._timer);
      indicator._timer = setTimeout(() => indicator.classList.remove('is-stretching'), 200);
    }

    /**
     * Selects an item, updates ARIA and announces the change.
     *
     * @param {HTMLElement} item - The item to select.
     * @param {boolean} [focus] - Whether to move focus to it.
     */
    function select(item, focus) {
      if (!item || item === current()) return;
      items.forEach((other) => {
        setOn(other, other === item);
        if (roving) other.tabIndex = other === item ? 0 : -1;
      });
      place(item, true);
      if (focus) item.focus();
      el.dispatchEvent(new CustomEvent('glass:change', {
        bubbles: true,
        detail: { item, value: item.dataset.value, index: items.indexOf(item) },
      }));
    }

    if (roving) items.forEach((item) => { item.tabIndex = isOn(item) ? 0 : -1; });
    el.addEventListener('click', (e) => {
      const item = e.target.closest && e.target.closest(ITEM_SELECTOR);
      if (item && items.includes(item)) select(item);
    });
    if (roving) {
      el.addEventListener('keydown', (e) => {
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
        const next = vertical ? 'ArrowDown' : 'ArrowRight';
        const index = items.indexOf(current());
        let target = null;
        if (e.key === prev) target = items[(index - 1 + items.length) % items.length];
        else if (e.key === next) target = items[(index + 1) % items.length];
        else if (e.key === 'Home') target = items[0];
        else if (e.key === 'End') target = items[items.length - 1];
        if (!target) return;
        e.preventDefault();
        select(target, true);
      });
    }

    const sync = () => place(current(), false);
    if (resizeObserver) new ResizeObserver(sync).observe(el);
    // Item widths change once web fonts load.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    sync();
    el.__glassIndicator = { select, sync, items, current };
  }

  /* ── Toggle, slider, dock, nav bar, sheen ── */

  /**
   * Makes a button switch flip its aria-checked state on click.
   *
   * @param {HTMLElement} el - The .glass-toggle button.
   */
  function initToggle(el) {
    if (el.__glassToggle || el.tagName === 'INPUT') return;
    el.__glassToggle = true;
    el.addEventListener('click', () => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      const on = el.getAttribute('aria-checked') !== 'true';
      el.setAttribute('aria-checked', String(on));
      el.dispatchEvent(new CustomEvent('glass:change', { bubbles: true, detail: { checked: on } }));
    });
  }

  /**
   * Keeps a slider's filled track and its linked <output> in sync with its value.
   *
   * @param {HTMLInputElement} el - The .glass-slider range input.
   */
  function initSlider(el) {
    if (el.__glassSlider) return;
    el.__glassSlider = true;
    const output = el.id ? document.querySelector('output[for~="' + el.id + '"]') : null;
    const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
    const sync = () => {
      const min = num(el.min, 0);
      const max = num(el.max, 100);
      const pct = ((num(el.value, 0) - min) / (max - min || 1)) * 100;
      el.style.setProperty('--glass-slider-pct', pct + '%');
      if (output) output.textContent = el.value + suffix;
    };
    el.addEventListener('input', sync);
    sync();
  }

  /**
   * Magnifies dock items by their distance to the pointer, like the macOS dock.
   *
   * @param {HTMLElement} el - The .glass-dock container.
   */
  function initDock(el) {
    if (el.__glassDock) return;
    el.__glassDock = true;
    const items = [...el.querySelectorAll('.glass-dock__item')];
    el.addEventListener('pointermove', (e) => {
      if (reducedMotion.matches || e.pointerType === 'touch') return;
      el.classList.add('is-magnifying');
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        const k = Math.max(0, 1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 130);
        item.style.setProperty('--glass-dock-scale', (1 + k * 0.45).toFixed(3));
        item.style.setProperty('--glass-dock-lift', (-k * 8).toFixed(1) + 'px');
      });
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnifying');
      items.forEach((item) => {
        item.style.removeProperty('--glass-dock-scale');
        item.style.removeProperty('--glass-dock-lift');
      });
    });
  }

  /**
   * Finds the element that scrolls a navigation bar: its nearest ancestor with a scrollable
   * overflow, or null when the window scrolls it.
   *
   * @param {HTMLElement} el - The .glass-nav-bar.
   * @return {?HTMLElement} The scroll container, or null for the window.
   */
  function scrollParent(el) {
    for (let node = el.parentElement; node && node !== document.body && node !== html; node = node.parentElement) {
      const overflow = global.getComputedStyle(node).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return node;
    }
    return null;
  }

  /**
   * Shows the scroll edge once content moves under a navigation bar, and moves the title
   * into the bar once the large title has scrolled beneath it.
   *
   * @param {HTMLElement} el - The .glass-nav-bar.
   */
  function initNavBar(el) {
    if (el.__glassNavBar) return;
    el.__glassNavBar = true;
    el.classList.add('is-enhanced');
    const scroller = scrollParent(el);
    const target = scroller || global;
    const largeTitle = (scroller || document).querySelector('.glass-nav-bar__large-title');
    let frame = 0;

    /** Recomputes both states from the current scroll position. */
    function sync() {
      frame = 0;
      const top = scroller ? scroller.scrollTop : global.scrollY;
      el.classList.toggle('is-scrolled', top > 0);
      const collapsed = largeTitle
        ? largeTitle.getBoundingClientRect().bottom <= el.getBoundingClientRect().bottom
        : top > 0;
      el.classList.toggle('is-collapsed', collapsed);
    }
    target.addEventListener('scroll', () => {
      if (!frame) frame = global.requestAnimationFrame(sync);
    }, { passive: true });
    sync();
  }

  let pointerBound = false;

  /**
   * Feeds the pointer position to sheen highlights and button press glows. One delegated
   * listener serves every element, including ones added later.
   */
  function bindPointer() {
    if (pointerBound) return;
    pointerBound = true;
    document.addEventListener('pointermove', (e) => {
      const target = e.target instanceof Element ? e.target.closest('.glass-sheen, .glass-btn') : null;
      if (!target) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty('--glass-mx', (e.clientX - r.left) + 'px');
      target.style.setProperty('--glass-my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ── Public API ── */

  /**
   * Initialises every behaviour and refraction inside a root. Safe to call again after
   * adding markup; already initialised elements are skipped.
   *
   * @param {ParentNode} [root=document] - The subtree to scan.
   */
  function init(root) {
    const scope = root || document;
    const all = (selector) => scope.querySelectorAll(selector);
    all(INDICATOR_SELECTOR).forEach(initIndicator);
    all('.glass-toggle').forEach(initToggle);
    all('input.glass-slider').forEach(initSlider);
    all('.glass-dock').forEach(initDock);
    all('.glass-nav-bar').forEach(initNavBar);
    all('[data-refract]').forEach((el) => refract(el));
    bindPointer();
  }

  /**
   * Selects an item of an initialised tab bar, segmented control or sidebar.
   *
   * @param {HTMLElement} container - The indicator container.
   * @param {number|HTMLElement} target - The item or its index.
   */
  function select(container, target) {
    const api = container && container.__glassIndicator;
    if (!api) return;
    api.select(typeof target === 'number' ? api.items[target] : target);
  }

  active = canRefract();
  html.classList.toggle('glass-refraction', active);

  global.LiquidGlass = {
    version: VERSION,
    init,
    select,
    refract,
    update,
    refresh,
    enable,
    detach,
    reevaluate,
    /** Whether refraction is currently active. */
    get supported() { return active; },
  };

  if (html.dataset.glassAuto !== 'off') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
    else init();
  }
})(typeof window !== 'undefined' ? window : this);
