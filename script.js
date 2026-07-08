(function () {
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.focus();
      }
    });
  }

  var jumpNav = document.querySelector(".jump-nav");
  var sentinel = document.querySelector(".jump-nav-sentinel");
  if (jumpNav && sentinel && "IntersectionObserver" in window) {
    var stuckObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        jumpNav.classList.toggle("is-stuck", !entry.isIntersecting);
      });
    });
    stuckObserver.observe(sentinel);
  }

  var jumpLinks = Array.prototype.slice.call(document.querySelectorAll(".jump-nav__link"));
  if (jumpLinks.length && "IntersectionObserver" in window) {
    var jumpSections = jumpLinks
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);
    var navHeight = jumpNav ? jumpNav.offsetHeight : 0;

    var setActiveLink = function (id) {
      jumpLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var scrollSpy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-" + (navHeight + 1) + "px 0px -70% 0px", threshold: 0 }
    );
    jumpSections.forEach(function (section) { scrollSpy.observe(section); });
  }
})();
