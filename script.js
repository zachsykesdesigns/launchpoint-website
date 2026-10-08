// Launchpoint Media — script.js
// Mobile nav toggle + smooth anchor scrolling + contact form placeholder

(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu when a link is tapped
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scrolling for anchor links (native CSS handles most, this is a fallback)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 68; // fixed header height
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Contact form — online submission coming soon; direct to email for now
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      if (name && email && message) {
        var subject = encodeURIComponent('Website inquiry from ' + name);
        var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = 'mailto:zachsykesdesigns@gmail.com?subject=' + subject + '&body=' + body;
        if (note) note.textContent = 'Opening your email app — just hit send.';
      }
    });
  }

  // Video lightbox — tap thumbnail to play fullscreen on black
  var lightbox = document.getElementById('video-lightbox');
  var lightboxVideo = document.getElementById('lightbox-video');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxBackdrop = document.getElementById('lightbox-backdrop');

  var videoHistoryPushed = false;

  function openLightbox(videoSrc) {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.src = videoSrc;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(function () {});
    // Push history state so phone back button closes popup instead of leaving site
    try {
      history.pushState({ lightbox: 'video' }, '');
      videoHistoryPushed = true;
    } catch (e) {}
  }

  function closeLightbox(fromPopstate) {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // If closed via X/backdrop (not via back button), pop the history entry we added
    if (!fromPopstate && videoHistoryPushed) {
      videoHistoryPushed = false;
      try { history.back(); } catch (e) {}
    } else {
      videoHistoryPushed = false;
    }
  }

  document.querySelectorAll('.video-card[data-video]').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card.getAttribute('data-video'));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  // Image lightbox / carousel — tap Root & Ripple designs to see mockups
  var imgLightbox = document.getElementById('img-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var imgLightboxClose = document.getElementById('img-lightbox-close');
  var imgLightboxBackdrop = document.getElementById('img-lightbox-backdrop');
  var carouselPrev = document.getElementById('carousel-prev');
  var carouselNext = document.getElementById('carousel-next');
  var carouselDots = document.getElementById('carousel-dots');

  var galleries = {
    shirts: [
      { src: 'mockup-bear-meditating-worn.webp?v=2', alt: 'Bear meditating shirt being worn' },
      { src: 'mockup-bears-worn.webp?v=2', alt: 'Bear tree pose shirt being worn' },
      { src: 'mockup-bear-warrior-worn.webp?v=2', alt: 'Bear warrior II shirt being worn' },
      { src: 'mockup-bear-dancer-worn.webp?v=2', alt: 'Bear dancer shirt being worn' },
      { src: 'mockup-chic-worn.webp?v=2', alt: 'Chic warrior shirt being worn' },
      { src: 'mockup-chic-tree-worn.webp?v=2', alt: 'Chic tree pose shirt being worn' },
      { src: 'mockup-chic-dancer-worn.webp?v=2', alt: 'Chic dancer shirt being worn' },
      { src: 'mockup-chic-cobra-worn.webp?v=2', alt: 'Chic cobra shirt being worn' },
      { src: 'mockup-pizza-worn.webp?v=2', alt: 'Pizza night shirt being worn' }
    ]
  };
  var currentGallery = null;
  var currentIndex = 0;

  function showCarouselImage() {
    if (!currentGallery || !lightboxImg) return;
    var item = currentGallery[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (carouselDots) {
      var dots = carouselDots.querySelectorAll('.dot');
      dots.forEach(function (d, i) { d.classList.toggle('active', i === currentIndex); });
    }
  }

  function buildDots() {
    if (!carouselDots || !currentGallery) return;
    carouselDots.innerHTML = '';
    currentGallery.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function (e) { e.stopPropagation(); currentIndex = i; showCarouselImage(); });
      carouselDots.appendChild(dot);
    });
  }

  function setCarouselMode(isCarousel) {
    [carouselPrev, carouselNext, carouselDots].forEach(function (el) {
      if (el) el.classList.toggle('hidden', !isCarousel);
    });
  }

  var imgHistoryPushed = false;

  function openImgLightbox(src, alt, galleryName, startIndex) {
    if (!imgLightbox || !lightboxImg) return;
    if (galleryName && galleries[galleryName]) {
      currentGallery = galleries[galleryName];
      currentIndex = startIndex || 0;
      buildDots();
      setCarouselMode(true);
      showCarouselImage();
    } else {
      currentGallery = null;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      setCarouselMode(false);
    }
    imgLightbox.classList.add('open');
    imgLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Push history state so phone back button closes popup instead of leaving site
    try {
      history.pushState({ lightbox: 'image' }, '');
      imgHistoryPushed = true;
    } catch (e) {}
  }

  function closeImgLightbox(fromPopstate) {
    if (!imgLightbox || !lightboxImg) return;
    lightboxImg.removeAttribute('src');
    imgLightbox.classList.remove('open');
    imgLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentGallery = null;
    // If closed via X/backdrop (not via back button), pop the history entry we added
    if (!fromPopstate && imgHistoryPushed) {
      imgHistoryPushed = false;
      try { history.back(); } catch (e) {}
    } else {
      imgHistoryPushed = false;
    }
  }

  // Handle phone back button: close any open lightbox instead of leaving the site
  window.addEventListener('popstate', function () {
    if (lightbox && lightbox.classList.contains('open')) {
      closeLightbox(true);
    } else if (imgLightbox && imgLightbox.classList.contains('open')) {
      closeImgLightbox(true);
    }
  });

  function carouselStep(dir) {
    if (!currentGallery) return;
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    showCarouselImage();
  }

  // Single-image cards (decal -> storefront)
  document.querySelectorAll('.img-card[data-full]').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      openImgLightbox(card.getAttribute('data-full'), img ? img.alt : '');
    });
  });

  // Gallery cards (shirts -> swipeable carousel), start at tapped shirt
  var shirtOrder = ['mockup-bears-worn.webp', 'mockup-chic-worn.webp', 'mockup-pizza-worn.webp'];
  document.querySelectorAll('.img-card[data-gallery]').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      var startAt = 0;
      // match tapped thumbnail to its worn mockup
      if (img && img.src.indexOf('rr-bears') > -1) startAt = 0;
      else if (img && img.src.indexOf('rr-chic') > -1) startAt = 1;
      else if (img && img.src.indexOf('rr-pizza') > -1) startAt = 2;
      openImgLightbox(null, null, card.getAttribute('data-gallery'), startAt);
    });
  });

  if (carouselPrev) carouselPrev.addEventListener('click', function (e) { e.stopPropagation(); carouselStep(-1); });
  if (carouselNext) carouselNext.addEventListener('click', function (e) { e.stopPropagation(); carouselStep(1); });
  if (imgLightboxClose) imgLightboxClose.addEventListener('click', closeImgLightbox);
  if (imgLightboxBackdrop) imgLightboxBackdrop.addEventListener('click', closeImgLightbox);
  document.addEventListener('keydown', function (e) {
    if (!imgLightbox || !imgLightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeImgLightbox();
    if (e.key === 'ArrowLeft') carouselStep(-1);
    if (e.key === 'ArrowRight') carouselStep(1);
  });

  // Touch swipe support
  var touchStartX = 0;
  if (imgLightbox) {
    imgLightbox.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    imgLightbox.addEventListener('touchend', function (e) {
      if (!currentGallery) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) carouselStep(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
})();