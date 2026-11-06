(function() {
  var KEY = 'deploy-lang';
  var ready = false;

  function getLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch(e) { return 'en'; }
  }

  function rebuildScrollReveal(el) {
    var text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map(function(w) {
      return '<span class="scroll-word">' + w + '</span>';
    }).join(' ');
    var words = el.querySelectorAll('.scroll-word');
    function updateWords() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.85;
      var end = vh * 0.25;
      var progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      var activeCount = Math.round(progress * words.length);
      words.forEach(function(word, i) {
        word.classList.toggle('visible', i < activeCount);
      });
    }
    window.addEventListener('scroll', updateWords, { passive: true });
    updateWords();
  }

  function rebuildSplitText(el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.textContent = '';
    el.style.visibility = 'visible';
    var wrapper = document.createElement('span');
    wrapper.style.display = 'inline';
    words.forEach(function(word, i) {
      var wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.textContent = word;
      inner.style.display = 'inline-block';
      inner.style.opacity = '1';
      inner.style.transform = 'translateY(0)';
      inner.classList.add('word-inner');
      wordSpan.appendChild(inner);
      wrapper.appendChild(wordSpan);
      if (i < words.length - 1) {
        wrapper.appendChild(document.createTextNode(' '));
      }
    });
    el.appendChild(wrapper);
  }

  function applyLang(lang) {
    try { localStorage.setItem(KEY, lang); } catch(e) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-es]').forEach(function(el) {
      if (!el.dataset.en) el.dataset.en = el.textContent;
      var newText = lang === 'es' ? el.dataset.es : el.dataset.en;
      el.textContent = newText;

      if (ready) {
        if (el.hasAttribute('data-scroll-reveal')) {
          rebuildScrollReveal(el);
        } else if (el.hasAttribute('data-text-reveal') || el.matches('.hero h1')) {
          rebuildSplitText(el);
        }
      }
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
    setTimeout(function() { ready = true; }, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
