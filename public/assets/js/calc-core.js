function formatINR(n) {
  if (n == null || isNaN(n)) return '₹0';
  let num = Math.round(n);
  let str = num.toString();
  let last3 = str.slice(-3);
  let rest = str.slice(0, -3);
  if (rest) {
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return '₹' + rest + ',' + last3;
  }
  return '₹' + last3;
}

function formatPercent(n) {
  return (n || 0).toFixed(2) + '%';
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let waiting = false;
  return function (...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
}

const STATE_LIST = [
  { id: 'andhrapradesh', name: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश' },
  { id: 'arunachalpradesh', name: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश' },
  { id: 'assam', name: 'Assam', nameHi: 'असम' },
  { id: 'bihar', name: 'Bihar', nameHi: 'बिहार' },
  { id: 'chhattisgarh', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़' },
  { id: 'delhi', name: 'Delhi', nameHi: 'दिल्ली' },
  { id: 'goa', name: 'Goa', nameHi: 'गोवा' },
  { id: 'gujarat', name: 'Gujarat', nameHi: 'गुजरात' },
  { id: 'haryana', name: 'Haryana', nameHi: 'हरियाणा' },
  { id: 'himachalpradesh', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश' },
  { id: 'jharkhand', name: 'Jharkhand', nameHi: 'झारखंड' },
  { id: 'karnataka', name: 'Karnataka', nameHi: 'कर्नाटक' },
  { id: 'kerala', name: 'Kerala', nameHi: 'केरल' },
  { id: 'madhyapradesh', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश' },
  { id: 'maharashtra', name: 'Maharashtra', nameHi: 'महाराष्ट्र' },
  { id: 'manipur', name: 'Manipur', nameHi: 'मणिपुर' },
  { id: 'meghalaya', name: 'Meghalaya', nameHi: 'मेघालय' },
  { id: 'mizoram', name: 'Mizoram', nameHi: 'मिज़ोरम' },
  { id: 'nagaland', name: 'Nagaland', nameHi: 'नागालैंड' },
  { id: 'odisha', name: 'Odisha', nameHi: 'ओडिशा' },
  { id: 'punjab', name: 'Punjab', nameHi: 'पंजाब' },
  { id: 'rajasthan', name: 'Rajasthan', nameHi: 'राजस्थान' },
  { id: 'sikkim', name: 'Sikkim', nameHi: 'सिक्किम' },
  { id: 'tamilnadu', name: 'Tamil Nadu', nameHi: 'तमिल नाडु' },
  { id: 'telangana', name: 'Telangana', nameHi: 'तेलंगाना' },
  { id: 'tripura', name: 'Tripura', nameHi: 'त्रिपुरा' },
  { id: 'uttarpradesh', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश' },
  { id: 'uttarakhand', name: 'Uttarakhand', nameHi: 'उत्तराखंड' },
  { id: 'westbengal', name: 'West Bengal', nameHi: 'पश्चिम बंगाल' },
];

function getStateList() {
  return STATE_LIST;
}

function getStateName(id) {
  const s = STATE_LIST.find(x => x.id === id);
  return s ? s.name : id;
}

function getStateRates(id) {
  if (typeof STAMP_DUTY_RATES !== 'undefined' && STAMP_DUTY_RATES[id]) return STAMP_DUTY_RATES[id];
  if (typeof RTO_RATES !== 'undefined' && RTO_RATES[id]) return RTO_RATES[id];
  return null;
}

function serializeParams(obj) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v != null && v !== '' && v !== false) p.set(k, String(v));
  }
  return p.toString();
}

function deserializeParams() {
  const p = new URLSearchParams(window.location.search);
  const out = {};
  for (const [k, v] of p.entries()) {
    const num = Number(v);
    out[k] = isNaN(num) ? v : num;
  }
  return out;
}

function saveLastInputs(toolKey, data) {
  try {
    localStorage.setItem('desicalc_' + toolKey + '_last', JSON.stringify(data));
  } catch (e) {}
}

function loadLastInputs(toolKey) {
  try {
    const raw = localStorage.getItem('desicalc_' + toolKey + '_last');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

let _currentLang = 'en';
const _langCallbacks = [];

function t(key) {
  const map = window['DESICALC_LANG'] || {};
  return map[key] || key;
}

function setLang(lang) {
  _currentLang = lang;
  try { localStorage.setItem('desicalc_lang', lang); } catch (e) {}
  document.documentElement.setAttribute('data-lang', lang);
  loadLangFile(lang);
}

function getLang() {
  return _currentLang;
}

function loadLangFile(lang) {
  const scriptId = 'desicalc-lang-script';
  const old = document.getElementById(scriptId);
  if (old) old.remove();
  const s = document.createElement('script');
  s.id = scriptId;
  var path = window.location.pathname;
  var prefix = '';
  if (/\/tools\/|\/guides\/|\/comparisons\//.test(path)) {
    prefix = '../';
  } else if (/\/programmatic\//.test(path)) {
    prefix = '../../';
  }
  s.src = prefix + 'assets/js/lang-' + lang + '.js';
  s.onload = () => {
    applyI18n();
    _langCallbacks.forEach(cb => cb(lang));
  };
  document.head.appendChild(s);
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', val);
      } else {
        el.innerHTML = val;
      }
    }
  });
}

function onLangChange(cb) {
  _langCallbacks.push(cb);
}

function initLang() {
  try {
    const saved = localStorage.getItem('desicalc_lang');
    if (saved === 'hi' || saved === 'en') _currentLang = saved;
  } catch (e) {}
  setLang(_currentLang);
}

function debouncedInput(el, cb, delay) {
  delay = delay || 300;
  el.addEventListener('input', debounce(function () {
    cb(this.value);
  }, delay));
}

function liveResult(targetId, getValue) {
  const el = document.getElementById(targetId);
  if (!el) return;
  function update() {
    const val = getValue();
    if (typeof val === 'number') {
      el.innerText = formatINR(val);
    } else {
      el.innerText = String(val);
    }
  }
  return update;
}

var _animFrames = {};
function animateValue(el, newNum) {
  var key = el.id || Math.random();
  if (_animFrames[key]) cancelAnimationFrame(_animFrames[key]);
  var oldText = el.innerText;
  var oldNum = parseInt(oldText.replace(/[₹,]/g, '')) || 0;
  newNum = Math.round(newNum);
  if (oldNum === newNum) return;
  var duration = 220, diff = newNum - oldNum, start = performance.now();
  function step(now) {
    var t = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    el.innerText = formatINR(Math.round(oldNum + diff * eased));
    if (t < 1) { _animFrames[key] = requestAnimationFrame(step); }
    else { el.innerText = formatINR(newNum); flashValue(el); delete _animFrames[key]; }
  }
  _animFrames[key] = requestAnimationFrame(step);
}

function flashValue(el) {
  el.style.transition = 'color 0.2s, opacity 0.2s';
  el.style.color = '#D97706'; el.style.opacity = '0.7';
  setTimeout(function() { el.style.color = ''; el.style.opacity = ''; }, 280);
}

function staggerReveal(containerId) {
  var c = document.getElementById(containerId);
  if (!c) return;
  if (c._staggerTimer) clearTimeout(c._staggerTimer);
  var rows = c.querySelectorAll('.result-row');
  rows.forEach(function(r) { r.classList.remove('revealed'); r.classList.add('stagger-row'); });
  void c.offsetWidth;
  c._staggerTimer = setTimeout(function() {
    rows.forEach(function(r, i) { setTimeout(function() { r.classList.add('revealed'); }, i * 55); });
  }, 30);
}

function initScrollReveal() {
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.scroll-entrance').forEach(function(el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.scroll-entrance').forEach(function(el) { el.classList.add('visible'); });
  }
}

function toggleFaq(btn) {
  btn.classList.toggle('open');
  var answer = btn.nextElementSibling;
  if (btn.classList.contains('open')) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.classList.add('open');
  } else {
    answer.style.maxHeight = '0px';
    answer.classList.remove('open');
  }
}

function showToast(msg) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.classList.remove('show'); }, 2500);
}

function shareUrl() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else {
    copyUrl();
  }
}

function copyUrl() {
  var url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function () { showToast(t('common.copied')); });
  } else {
    var ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast(t('common.copied')); } catch (e) {}
    document.body.removeChild(ta);
  }
}

function initTooltips() {
  document.addEventListener('mouseover', function (e) {
    var trigger = e.target.closest('[data-tooltip]');
    if (!trigger) { hideTooltip(); return; }
    var text = trigger.getAttribute('data-tooltip');
    if (!text) return;
    var tip = document.getElementById('tooltip-el');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'tooltip-el';
      tip.className = 'tooltip-popup';
      document.body.appendChild(tip);
    }
    tip.textContent = text;
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + 6;
    var left = rect.left + rect.width / 2;
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    tip.classList.add('show');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('[data-tooltip]')) hideTooltip();
  });
}

function hideTooltip() {
  var tip = document.getElementById('tooltip-el');
  if (tip) tip.classList.remove('show');
}

function initOnboarding() {
  var key = 'desicalc_onboarded_v1';
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
  } catch (e) { return; }
  var overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.className = 'onboarding-overlay';
  overlay.innerHTML =
    '<div class="onboarding-card">' +
    '<button class="onboarding-close" onclick="dismissOnboarding()" aria-label="Close">&times;</button>' +
    '<div class="onboarding-icon">🧮</div>' +
    '<h3 class="onboarding-title">' + t('onboarding.title') + '</h3>' +
    '<ul class="onboarding-list">' +
    '<li>' + t('onboarding.step1') + '</li>' +
    '<li>' + t('onboarding.step2') + '</li>' +
    '<li>' + t('onboarding.step3') + '</li>' +
    '</ul>' +
    '<button class="btn btn-primary" onclick="dismissOnboarding()">' + t('onboarding.cta') + '</button>' +
    '</div>';
  document.body.appendChild(overlay);
  setTimeout(function () { overlay.classList.add('active'); }, 100);
}

function dismissOnboarding() {
  var overlay = document.getElementById('onboarding-overlay');
  if (overlay) { overlay.classList.remove('active'); setTimeout(function () { overlay.remove(); }, 300); }
}

document.addEventListener('input', function(e) {
  if (e.target.getAttribute('inputmode') === 'numeric') {
    var val = e.target.value;
    var sanitized = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (sanitized !== val) e.target.value = sanitized;
  }
});
