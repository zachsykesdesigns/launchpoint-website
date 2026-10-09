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
      { src: 'rr-chakra-lotus.webp', alt: 'Chakra lotus shirt design — black' },
      { src: 'rr-chakra-lotus-white.webp', alt: 'Chakra lotus shirt — white' },
      { src: 'rr-chakra-lotus-gray.webp', alt: 'Chakra lotus shirt — gray' },
      { src: 'rr-chakra-lotus-navy.webp', alt: 'Chakra lotus shirt — navy' },
      { src: 'rr-chakra-meditation.webp', alt: 'Chakra meditation shirt design — black' },
      { src: 'rr-chakra-meditation-white.webp', alt: 'Chakra meditation shirt — white' },
      { src: 'rr-chakra-meditation-gray.webp', alt: 'Chakra meditation shirt — gray' },
      { src: 'rr-chakra-meditation-navy.webp', alt: 'Chakra meditation shirt — navy' },
      { src: 'rr-tree-pose.webp', alt: 'Tree pose shirt design — black' },
      { src: 'rr-tree-pose-white.webp', alt: 'Tree pose shirt — white' },
      { src: 'rr-tree-pose-gray.webp', alt: 'Tree pose shirt — gray' },
      { src: 'rr-tree-pose-navy.webp', alt: 'Tree pose shirt — navy' },
      { src: 'rr-pizza.webp', alt: 'Pizza night shirt design' },
      { src: 'mockup-chakra-lotus-worn.webp', alt: 'Chakra lotus shirt being worn' },
      { src: 'mockup-chakra-meditation-worn.webp', alt: 'Chakra meditation shirt being worn' },
      { src: 'mockup-tree-pose-worn.webp', alt: 'Tree pose shirt being worn' },
      { src: 'mockup-bear-meditating-worn-final.webp', alt: 'Bear meditating shirt being worn' },
      { src: 'mockup-bears-worn-final.webp', alt: 'Bear tree pose shirt being worn' },
      { src: 'mockup-bear-warrior-worn-final.webp', alt: 'Bear warrior II shirt being worn' },
      { src: 'mockup-bear-dancer-worn-final.webp', alt: 'Bear dancer shirt being worn' },
      { src: 'mockup-chic-worn.webp?v=2', alt: 'Chic warrior shirt being worn' },
      { src: 'mockup-chic-tree-worn.webp?v=2', alt: 'Chic tree pose shirt being worn' },
      { src: 'mockup-chic-dancer-worn.webp?v=2', alt: 'Chic dancer shirt being worn' },
      { src: 'mockup-chic-cobra-worn.webp?v=2', alt: 'Chic cobra shirt being worn' },
      { src: 'mockup-pizza-worn.webp?v=2', alt: 'Pizza night shirt being worn' }
    ],
    'ads-fitness': [
      { src: 'fitness-tennessee-2.webp', alt: 'Tennessee fitness ad' },
      { src: 'fitness-florida.webp', alt: 'Florida fitness ad' },
      { src: 'fitness-michigan-state.webp', alt: 'Michigan State fitness ad' },
      { src: 'fitness-lsu.webp', alt: 'LSU fitness ad' },
      { src: 'fitness-kansas.webp', alt: 'Kansas fitness ad' },
      { src: 'fitness-vanderbilt.webp', alt: 'Vanderbilt fitness ad' }
    ],
    'ads-workday': [
      { src: 'workday-tennessee.webp', alt: 'Tennessee workday ad' },
      { src: 'workday-indiana.webp', alt: 'Indiana workday ad' },
      { src: 'workday-michigan-state.webp', alt: 'Michigan State workday ad' },
      { src: 'workday-lsu.webp', alt: 'LSU workday ad' },
      { src: 'workday-illinois.webp', alt: 'Illinois workday ad' },
      { src: 'workday-ims.webp', alt: 'IMS workday ad' }
    ],
    'ads-basketball': [
      { src: 'sports-tennessee-basketball.webp', alt: 'Tennessee basketball ad' },
      { src: 'sports-alabama-basketball.webp', alt: 'Alabama basketball ad' },
      { src: 'sports-florida-basketball.webp', alt: 'Florida basketball ad' },
      { src: 'sports-michigan-state-basketball.webp', alt: 'Michigan State basketball ad' },
      { src: 'sports-indiana-basketball.webp', alt: 'Indiana basketball ad' }
    ],
    'ads-alumni': [
      { src: 'alumni-tennessee.webp', alt: 'Tennessee alumni gift ad' },
      { src: 'alumni-florida.webp', alt: 'Florida alumni gift ad' },
      { src: 'alumni-michigan-state.webp', alt: 'Michigan State alumni gift ad' }
    ],
    'ads-gameday': [
      { src: 'gameday-illinois-ohio-state.webp', alt: 'Illinois vs Ohio State rivalry ad' },
      { src: 'gameday-iu-northwestern.webp', alt: 'IU vs Northwestern matchup ad' },
      { src: 'gameday-team-recovery.webp', alt: 'Team recovery for every fan ad' },
      { src: 'gameday-clemson-support.webp', alt: 'Clemson support starts at your feet ad' },
      { src: 'gameday-alabama-locker.webp', alt: 'Alabama locker room recovery ad' },
      { src: 'gameday-full-lineup.webp', alt: 'Full team lineup ad' },
      { src: 'gameday-tamu-missouri-v2.webp', alt: 'Texas A&M vs Missouri GameDay VS matchup' },
      { src: 'gameday-arizona-wvu-v2.webp', alt: 'Arizona vs West Virginia GameDay VS matchup' },
      { src: 'gameday-illinois-msu-v2.webp', alt: 'Illinois vs Michigan State GameDay VS matchup' },
      { src: 'gameday-minnesota-purdue-v2.webp', alt: 'Minnesota vs Purdue GameDay VS matchup' }
    ],
    'site-walkthrough': [
      { src: 'site-homepage-top.webp', alt: 'Homepage — hero and featured product' },
      { src: 'site-homepage-bottom.webp', alt: 'Homepage — styles and footer' },
      { src: 'site-collection-top.webp', alt: 'Shop by school — product grid' },
      { src: 'site-collection-bottom.webp', alt: 'Shop by school — features' },
      { src: 'site-product.webp', alt: 'Product page — details and lifestyle' },
      { src: 'site-cart.webp', alt: 'Cart page' },
      { src: 'site-checkout-top.webp', alt: 'Checkout — contact and delivery' },
      { src: 'site-checkout-bottom.webp', alt: 'Checkout — payment' }
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

  // Single-image cards (decal -> storefront, AirFeet strip -> full size)
  document.querySelectorAll('.img-card[data-full]').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      openImgLightbox(card.getAttribute('data-full'), img ? img.alt : '');
    });
  });

  // Gallery cards -> swipeable carousel (shirts start at tapped design, ads start at 0)
  document.querySelectorAll('.img-card[data-gallery]').forEach(function (card) {
    card.addEventListener('click', function () {
      var galleryName = card.getAttribute('data-gallery');
      var startAt = 0;
      openImgLightbox(null, null, galleryName, startAt);
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

  // Consultation popup
  var consultPopup = document.getElementById('consult-popup');
  var consultHistoryPushed = false;

  function openConsultPopup() {
    if (!consultPopup) return;
    consultPopup.classList.add('open');
    consultPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    try {
      history.pushState({ lightbox: 'consult' }, '');
      consultHistoryPushed = true;
    } catch (e) {}
    var firstInput = consultPopup.querySelector('input');
    if (firstInput) setTimeout(function() { firstInput.focus(); }, 100);
  }

  function closeConsultPopup(fromPopstate) {
    if (!consultPopup) return;
    consultPopup.classList.remove('open');
    consultPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (!fromPopstate && consultHistoryPushed) {
      consultHistoryPushed = false;
      try { history.back(); } catch (e) {}
    } else {
      consultHistoryPushed = false;
    }
  }

  document.querySelectorAll('.consult-trigger').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openConsultPopup();
    });
  });

  var consultClose = document.getElementById('consult-close');
  if (consultClose) consultClose.addEventListener('click', function () { closeConsultPopup(false); });
  var consultBackdrop = document.getElementById('consult-backdrop');
  if (consultBackdrop) consultBackdrop.addEventListener('click', function () { closeConsultPopup(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && consultPopup && consultPopup.classList.contains('open')) {
      closeConsultPopup(false);
    }
  });

  window.addEventListener('popstate', function () {
    if (consultPopup && consultPopup.classList.contains('open')) {
      closeConsultPopup(true);
    }
  });

  var consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('consult-name').value;
      var email = document.getElementById('consult-email').value;
      var message = document.getElementById('consult-message').value;
      var subject = encodeURIComponent('Free Consultation Request from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:zachsykesdesigns@gmail.com?subject=' + subject + '&body=' + body;
      closeConsultPopup(false);
    });
  }

  // Auto-open consultation popup when arriving from a package page
  if (window.location.search.indexOf('consult=open') > -1) {
    // Clean the URL without reloading
    try {
      history.replaceState({}, '', window.location.pathname);
    } catch (e) {}
    setTimeout(openConsultPopup, 300);
  }
})();