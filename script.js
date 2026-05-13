document.addEventListener('DOMContentLoaded', function () {

  // --- Sticky Navbar ---
  var navbar = document.getElementById('navbar');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // --- Mobile Menu ---
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Hero Fade-Up Animations ---
  var fadeEls = document.querySelectorAll('.fade-up');
  setTimeout(function () {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }, 200);

  // --- Scroll Reveal ---
  var reveals = document.querySelectorAll('.scroll-reveal');

  function checkReveal() {
    var trigger = window.innerHeight * 0.88;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal();

  // --- Animated Counters ---
  var counters = document.querySelectorAll('.counter');
  var counterDone = false;

  function animateCounters() {
    if (counterDone) return;
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counterDone = true;
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight + 20;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Form AJAX Submission ---
  var forms = document.querySelectorAll('form[data-netlify="true"]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new URLSearchParams(new FormData(form)).toString();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })
      .then(function (response) {
        if (response.ok) {
          var wrapper = form.closest('.contact-form-wrapper') || form.parentElement;
          if (form.classList.contains('newsletter-form')) {
            form.reset();
            submitBtn.textContent = 'Subscribed!';
            setTimeout(function () {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 3000);
          } else {
            form.innerHTML = '<div class="form-success"><h3>Message Sent!</h3><p>Thank you for reaching out. We\'ll get back to you soon.</p></div>';
          }
        } else {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      })
      .catch(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  });

  // --- Active Nav Link Highlight ---
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollY = window.pageYOffset;
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = '#c9a84c';
          link.style.fontWeight = '600';
        } else {
          link.style.color = '';
          link.style.fontWeight = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
});
