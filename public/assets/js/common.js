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
        el.textContent = val;
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

function initGreeting() {
  var el = document.getElementById('greeting');
  if (!el) return;
  var h = new Date().getHours();
  var text = '';
  if (h >= 5 && h < 12) { text = '🌅 ' + (window.DESICALC_LANG && window.DESICALC_LANG['greeting.morning'] ? window.DESICALC_LANG['greeting.morning'] : 'Good morning'); }
  else if (h >= 12 && h < 17) { text = '☀️ ' + (window.DESICALC_LANG && window.DESICALC_LANG['greeting.afternoon'] ? window.DESICALC_LANG['greeting.afternoon'] : 'Good afternoon'); }
  else if (h >= 17 && h < 21) { text = '🌅 ' + (window.DESICALC_LANG && window.DESICALC_LANG['greeting.evening'] ? window.DESICALC_LANG['greeting.evening'] : 'Good evening'); }
  else { text = '🌙 ' + (window.DESICALC_LANG && window.DESICALC_LANG['greeting.night'] ? window.DESICALC_LANG['greeting.night'] : 'Good night'); }
  el.textContent = text;
}

function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        btn.classList.toggle('visible', window.scrollY > 350);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
    tip.style.maxWidth = '';
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + 6;
    var left = rect.left + rect.width / 2;
    var pw = tip.offsetWidth || 260;
    var gap = 8;
    var maxPw = window.innerWidth - gap * 2;
    if (pw > maxPw) { pw = maxPw; tip.style.maxWidth = maxPw + 'px'; }
    left = Math.max(pw / 2 + gap, Math.min(left, window.innerWidth - pw / 2 - gap));
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

document.addEventListener('input', function(e) {
  if (e.target.getAttribute('inputmode') === 'numeric') {
    var val = e.target.value;
    var sanitized = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (sanitized !== val) e.target.value = sanitized;
  }
});
