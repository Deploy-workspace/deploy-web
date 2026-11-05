document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════
  // PRELOADER
  // ══════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fly');
        setTimeout(() => {
          preloader.classList.add('hidden');
        }, 1000);
      }, 1000);
    });
  }

  // ══════════════════════════════════════════
  // SPRING ANIMATION ENGINE (Framer-style)
  // ══════════════════════════════════════════
  function springAnimation(element, from, to, config = {}) {
    const { duration = 1.5, delay = 0, bounce = 0 } = config;
    const delayMs = delay * 1000;
    const durationMs = duration * 1000;

    Object.keys(from).forEach(prop => {
      if (prop === 'opacity') {
        element.style.opacity = from[prop];
      } else if (prop === 'y') {
        element.style.transform = `translateY(${from[prop]}px)`;
      } else if (prop === 'x') {
        element.style.transform = `translateX(${from[prop]}px)`;
      } else if (prop === 'scale') {
        element.style.transform = `scale(${from[prop]})`;
      }
    });

    setTimeout(() => {
      element.style.transition = `all ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      Object.keys(to).forEach(prop => {
        if (prop === 'opacity') {
          element.style.opacity = to[prop];
        } else if (prop === 'y') {
          element.style.transform = `translateY(${to[prop]}px)`;
        } else if (prop === 'x') {
          element.style.transform = `translateX(${to[prop]}px)`;
        } else if (prop === 'scale') {
          element.style.transform = `scale(${to[prop]})`;
        }
      });

      if (Object.keys(to).length > 1) {
        const transforms = [];
        if ('y' in to) transforms.push(`translateY(${to.y}px)`);
        if ('x' in to) transforms.push(`translateX(${to.x}px)`);
        if ('scale' in to) transforms.push(`scale(${to.scale})`);
        if (transforms.length) element.style.transform = transforms.join(' ');
        if ('opacity' in to) element.style.opacity = to.opacity;
      }
    }, delayMs);
  }

  // ══════════════════════════════════════════
  // TEXT SPLIT ANIMATIONS
  // ══════════════════════════════════════════
  function splitTextIntoWords(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.textContent = '';
    element.style.visibility = 'visible';

    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline';

    words.forEach((word, i) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'top';

      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.display = 'inline-block';
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(100%)';
      inner.style.transition = `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.04 * i}s`;
      inner.classList.add('word-inner');

      wordSpan.appendChild(inner);
      wrapper.appendChild(wordSpan);

      if (i < words.length - 1) {
        const space = document.createTextNode(' ');
        wrapper.appendChild(space);
      }
    });

    element.appendChild(wrapper);
    return element.querySelectorAll('.word-inner');
  }

  function animateWords(wordElements) {
    wordElements.forEach(word => {
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
    });
  }

  // ══════════════════════════════════════════
  // HERO TEXT ANIMATION (on load)
  // ══════════════════════════════════════════
  const heroTitle = document.querySelector('.hero h1');
  const heroLabel = document.querySelector('.hero .label');
  const heroSubhead = document.querySelector('.hero .subhead');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroGuarantee = document.querySelector('.hero .guarantee');

  let heroWords = null;
  if (heroTitle) {
    heroTitle.style.visibility = 'hidden';
    heroWords = splitTextIntoWords(heroTitle);
  }

  const heroElements = [
    { el: heroLabel, delay: 0, y: 20 },
    { el: heroSubhead, delay: 0.6, y: 24 },
    { el: heroButtons, delay: 0.8, y: 24 },
    { el: heroGuarantee, delay: 1.0, y: 16 }
  ];

  heroElements.forEach(({ el, delay, y }) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
  });

  setTimeout(() => {
    if (heroWords) animateWords(heroWords);

    heroElements.forEach(({ el, delay, y }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay * 1000);
    });
  }, 200);

  // ══════════════════════════════════════════
  // SCROLL REVEAL SYSTEM
  // ══════════════════════════════════════════
  const revealElements = document.querySelectorAll('[data-reveal]');

  revealElements.forEach(el => {
    const type = el.dataset.reveal || 'up';
    const delay = parseFloat(el.dataset.revealDelay || 0);

    el.style.opacity = '0';
    el.style.willChange = 'transform, opacity';

    switch (type) {
      case 'up':
        el.style.transform = 'translateY(60px)';
        break;
      case 'down':
        el.style.transform = 'translateY(-40px)';
        break;
      case 'left':
        el.style.transform = 'translateX(-60px)';
        break;
      case 'right':
        el.style.transform = 'translateX(60px)';
        break;
      case 'scale':
        el.style.transform = 'scale(0.92)';
        break;
      case 'fade':
        break;
    }
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.revealDelay || 0);

        setTimeout(() => {
          el.style.transition = 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, delay * 1000);

        scrollObserver.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => scrollObserver.observe(el));

  // ══════════════════════════════════════════
  // TEXT REVEAL ON SCROLL
  // ══════════════════════════════════════════
  const textRevealElements = document.querySelectorAll('[data-text-reveal]');

  textRevealElements.forEach(el => {
    el.style.visibility = 'hidden';
    const words = splitTextIntoWords(el);

    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateWords(words);
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    textObserver.observe(el);
  });

  // ══════════════════════════════════════════
  // STAGGER CHILDREN
  // ══════════════════════════════════════════
  const staggerParents = document.querySelectorAll('[data-stagger]');

  staggerParents.forEach(parent => {
    const staggerDelay = parseFloat(parent.dataset.stagger || 0.1);
    const children = Array.from(parent.children);

    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(40px)';
      child.style.willChange = 'transform, opacity';
    });

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const kids = Array.from(entry.target.children);
          kids.forEach((child, i) => {
            setTimeout(() => {
              child.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, i * staggerDelay * 1000);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    staggerObserver.observe(parent);
  });

  // ══════════════════════════════════════════
  // BLOB ICON ENTRANCE
  // ══════════════════════════════════════════
  document.querySelectorAll('.value-icon').forEach((icon, i) => {
    const blobObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => { icon.classList.add('enter'); }, i * 180 + 300);
          blobObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    blobObserver.observe(icon);
  });

  // ══════════════════════════════════════════
  // SCROLL TEXT REVEAL — word-by-word on scroll
  // ══════════════════════════════════════════
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map(w => `<span class="scroll-word">${w}</span>`).join(' ');

    const words = el.querySelectorAll('.scroll-word');

    function updateWords() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const activeCount = Math.round(progress * words.length);

      words.forEach((word, i) => {
        word.classList.toggle('visible', i < activeCount);
      });
    }

    window.addEventListener('scroll', updateWords, { passive: true });
    updateWords();
  });

  // ══════════════════════════════════════════
  // NAV SCROLL STATE
  // ══════════════════════════════════════════
  const nav = document.querySelector('.nav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });

  // ══════════════════════════════════════════
  // MOBILE MENU
  // ══════════════════════════════════════════
  const toggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ══════════════════════════════════════════
  // FAQ ACCORDION
  // ══════════════════════════════════════════
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ══════════════════════════════════════════
  // SMOOTH ANCHOR SCROLL
  // ══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ══════════════════════════════════════════
  // INTERACTIVE HERO — WebGL ripple distortion
  // ══════════════════════════════════════════
  const heroCanvas = document.getElementById('hero-canvas');
  const heroFlowImg = document.getElementById('hero-flow-src');

  if (heroCanvas && heroFlowImg) {
    const gl = heroCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) { console.warn('WebGL not supported'); }

    let width, height, animFrame;
    let mouseX = 0.5, mouseY = 0.5;
    let targetX = 0.5, targetY = 0.5;
    let cursorStrength = 0;
    let targetStrength = 0;
    let time = 0;

    const vertSrc = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_image;
      uniform vec2 u_mouse;
      uniform float u_strength;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 diff = (uv - u_mouse) * aspect;
        float dist = length(diff);

        float radius = 0.30;
        float ripple = smoothstep(radius, 0.0, dist);

        float wave1 = sin(dist * 28.0 - u_time * 2.4) * 0.5 + 0.5;
        float wave2 = sin(dist * 18.0 - u_time * 1.8 + 1.5) * 0.5 + 0.5;
        float waveMix = mix(wave1, wave2, 0.4);

        vec2 offset = normalize(diff + 0.001) * ripple * waveMix * 0.11 * u_strength;

        float chromatic = ripple * u_strength * 0.024;
        vec2 uvR = uv + offset + diff * chromatic;
        vec2 uvG = uv + offset;
        vec2 uvB = uv + offset - diff * chromatic;

        float r = texture2D(u_image, uvR).r;
        float g = texture2D(u_image, uvG).g;
        float b = texture2D(u_image, uvB).b;
        float a = texture2D(u_image, uv + offset).a;

        float brightness = ripple * u_strength * 0.20;

        gl_FragColor = vec4(r + brightness, g + brightness, b + brightness, a);
      }
    `;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uStrength = gl.getUniformLocation(prog, 'u_strength');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uResolution = gl.getUniformLocation(prog, 'u_resolution');

    function loadTexture(img) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return tex;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = heroCanvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      heroCanvas.style.width = width + 'px';
      heroCanvas.style.height = height + 'px';
      gl.viewport(0, 0, heroCanvas.width, heroCanvas.height);
    }

    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = 1.0 - (e.clientY - rect.top) / rect.height;
      targetStrength = 1.0;
    });
    heroSection.addEventListener('mouseleave', () => {
      targetStrength = 0;
    });

    function render() {
      time += 0.016;
      mouseX += (targetX - mouseX) * 0.12;
      mouseY += (targetY - mouseY) * 0.12;
      cursorStrength += (targetStrength - cursorStrength) * 0.10;

      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uStrength, cursorStrength);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, width, height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrame = requestAnimationFrame(render);
    }

    function startWebGL() {
      resize();
      window.addEventListener('resize', resize);
      loadTexture(heroFlowImg);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      render();
    }

    if (heroFlowImg.complete && heroFlowImg.naturalWidth > 0) {
      startWebGL();
    } else {
      heroFlowImg.addEventListener('load', startWebGL);
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animFrame) render();
        } else {
          if (animFrame) {
            cancelAnimationFrame(animFrame);
            animFrame = null;
          }
        }
      });
    });
    visibilityObserver.observe(heroCanvas);
  }

  // ══════════════════════════════════════════
  // CARD HOVER TILT
  // ══════════════════════════════════════════
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  // ══════════════════════════════════════════
  // PLAN CARD 3D TILT + BORDER GLOW
  // ══════════════════════════════════════════
  document.querySelectorAll('.plan-card').forEach(card => {
    const isFeatured = card.classList.contains('featured');
    const glowColor = isFeatured ? '154, 172, 255' : '19, 59, 199';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.transform = `translateY(-4px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg)`;
      card.style.boxShadow = `${(px * 30).toFixed(1)}px ${(py * 30).toFixed(1)}px 40px rgba(${glowColor}, 0.2), 0 0 20px rgba(${glowColor}, 0.08), 0 20px 60px rgba(0,0,0,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      card.style.boxShadow = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
    });
  });

  // ══════════════════════════════════════════
  // PARALLAX ON SCROLL
  // ══════════════════════════════════════════
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.1);
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateParallax);
    });
  }

  // ══════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ══════════════════════════════════════════
  document.querySelectorAll('.btn-primary, .btn-cta, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.15s ease-out';
    });
  });

  // ══════════════════════════════════════════
  // PROCESS TIMELINE — scroll-driven active step
  // ══════════════════════════════════════════
  // Arc-based process section
  const processScroll = document.querySelector('.process-scroll');
  const processNums = document.querySelectorAll('.process-num');
  const processPanels = document.querySelectorAll('.process-panel');
  const processDot = document.querySelector('.process-dot');
  const arcPath = document.querySelector('.process-arc-path');
  const arcWrap = document.querySelector('.process-arc-wrap');

  if (processScroll && arcPath && processDot) {
    const stepCount = processPanels.length;
    let currentStep = -1;

    function getPointOnArc(t) {
      const svg = arcPath.ownerSVGElement;
      const len = arcPath.getTotalLength();
      const pt = arcPath.getPointAtLength(t * len);
      const wrapRect = arcWrap.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svgRect.width / svg.viewBox.baseVal.width;
      const scaleY = svgRect.height / svg.viewBox.baseVal.height;
      return {
        x: svgRect.left - wrapRect.left + pt.x * scaleX,
        y: svgRect.top - wrapRect.top + pt.y * scaleY
      };
    }

    function positionNums() {
      processNums.forEach((num, i) => {
        const t = i / (stepCount - 1);
        const pos = getPointOnArc(t);
        num.style.left = pos.x + 'px';
        num.style.top = (pos.y + 10) + 'px';
      });
    }

    function updateProcess() {
      const rect = processScroll.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
      const stepIdx = Math.min(stepCount - 1, Math.floor(progress * stepCount));

      const t = progress;
      const dotPos = getPointOnArc(t);
      processDot.style.left = (dotPos.x - 5) + 'px';
      processDot.style.top = (dotPos.y - 5) + 'px';

      if (stepIdx !== currentStep) {
        currentStep = stepIdx;
        processNums.forEach((n, i) => n.classList.toggle('active', i === stepIdx));
        processPanels.forEach((p, i) => p.classList.toggle('active', i === stepIdx));
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { updateProcess(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener('resize', () => { positionNums(); updateProcess(); });
    positionNums();
    updateProcess();
  }

  // ══════════════════════════════════════════
  // COUNTER ANIMATION (Spots left)
  // ══════════════════════════════════════════
  const counterEl = document.querySelector('[data-counter]');
  if (counterEl) {
    const target = parseInt(counterEl.dataset.counter);
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let current = 0;
          const increment = target / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counterEl.textContent = Math.round(current);
          }, 50);
          counterObserver.unobserve(entry.target);
        }
      });
    });
    counterObserver.observe(counterEl);
  }

  // ══════════════════════════════════════════
  // TESTIMONIALS CAROUSEL
  // ══════════════════════════════════════════
  const carousel = document.querySelector('.testimonials-carousel');
  const track = document.querySelector('.testimonials-track');
  const dotsContainer = document.querySelector('.testimonials-dots');
  if (carousel && track && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationId = null;

    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function getSlidePosition(index) {
      const card = cards[index];
      if (!card) return 0;
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.width / 2;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return -(cardCenter - carouselCenter);
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      currentTranslate = getSlidePosition(currentIndex);
      prevTranslate = currentTranslate;
      track.style.transform = `translateX(${currentTranslate}px)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function touchStart(e) {
      isDragging = true;
      startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      track.classList.add('dragging');
      if (animationId) cancelAnimationFrame(animationId);
    }

    function touchMove(e) {
      if (!isDragging) return;
      const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -50 && currentIndex < cards.length - 1) currentIndex++;
      if (movedBy > 50 && currentIndex > 0) currentIndex--;
      goTo(currentIndex);
    }

    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchmove', touchMove, { passive: true });
    carousel.addEventListener('touchend', touchEnd);

    carousel.addEventListener('click', (e) => {
      if (Math.abs(currentTranslate - prevTranslate) > 5) e.preventDefault();
    });

    goTo(0);
    window.addEventListener('resize', () => goTo(currentIndex));
  }
});
