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

  function openLightbox(videoSrc) {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.src = videoSrc;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(function () {});
  }

  function closeLightbox() {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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

  // Image lightbox — tap Root & Ripple designs to see mockups
  var imgLightbox = document.getElementById('img-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var imgLightboxClose = document.getElementById('img-lightbox-close');
  var imgLightboxBackdrop = document.getElementById('img-lightbox-backdrop');

  function openImgLightbox(imgSrc, imgAlt) {
    if (!imgLightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt || '';
    imgLightbox.classList.add('open');
    imgLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeImgLightbox() {
    if (!imgLightbox || !lightboxImg) return;
    lightboxImg.removeAttribute('src');
    imgLightbox.classList.remove('open');
    imgLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.img-card[data-full]').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      openImgLightbox(card.getAttribute('data-full'), img ? img.alt : '');
    });
  });

  if (imgLightboxClose) imgLightboxClose.addEventListener('click', closeImgLightbox);
  if (imgLightboxBackdrop) imgLightboxBackdrop.addEventListener('click', closeImgLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && imgLightbox && imgLightbox.classList.contains('open')) closeImgLightbox();
  });
})();