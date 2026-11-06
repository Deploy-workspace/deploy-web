(function() {
  var KEY = 'deploy-lang';

  function getLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch(e) { return 'en'; }
  }

  function applyLang(lang) {
    try { localStorage.setItem(KEY, lang); } catch(e) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-es]').forEach(function(el) {
      if (!el.dataset.en) el.dataset.en = el.textContent;
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });

    document.querySelectorAll('[data-es-html]').forEach(function(el) {
      if (!el.dataset.enHtml) el.dataset.enHtml = el.innerHTML;
      el.innerHTML = lang === 'es' ? el.dataset.esHtml : el.dataset.enHtml;
    });

    document.querySelectorAll('.lang-toggle').forEach(function(t) {
      t.querySelectorAll('.lang-opt').forEach(function(o) {
        o.classList.toggle('active', o.dataset.lang === lang);
      });
    });
  }

  function init() {
    applyLang(getLang());
    document.addEventListener('click', function(e) {
      var opt = e.target.closest('.lang-opt');
      if (opt) applyLang(opt.dataset.lang);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
