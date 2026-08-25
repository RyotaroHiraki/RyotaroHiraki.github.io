const nav = document.querySelector(".nav");
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 400);
});

const hamburger = document.querySelector(".nav__hamburger");
const navLinks = document.querySelector(".nav__links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

const sections = document.querySelectorAll("section[id]");
if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (link) link.classList.toggle("active", entry.isIntersecting);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

(function initCarousel() {
  const track = document.querySelector(".carousel__track");
  const prevBtn = document.querySelector(".carousel__btn--prev");
  const nextBtn = document.querySelector(".carousel__btn--next");
  const dotsContainer = document.getElementById("carouselDots");
  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.children);
  let currentPage = 0;

  function getPerPage() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(slides.length / getPerPage()));
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < getTotalPages(); i += 1) {
      const dot = document.createElement("button");
      dot.className = `carousel__dot${i === currentPage ? " active" : ""}`;
      dot.setAttribute("aria-label", `Page ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function getSlideWidth() {
    const perPage = getPerPage();
    const containerWidth = track.parentElement.offsetWidth;
    const gap = perPage <= 1 ? 0 : 19.2;
    return (containerWidth - gap * (perPage - 1)) / perPage;
  }

  function goTo(page) {
    const total = getTotalPages();
    currentPage = Math.max(0, Math.min(page, total - 1));

    const perPage = getPerPage();
    const gap = perPage <= 1 ? 0 : 19.2;
    const slideWidth = getSlideWidth();
    const offset = currentPage * perPage * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= total - 1;

    if (dotsContainer) {
      dotsContainer.querySelectorAll(".carousel__dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
      });
    }
  }

  prevBtn.addEventListener("click", () => goTo(currentPage - 1));
  nextBtn.addEventListener("click", () => goTo(currentPage + 1));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentPage >= getTotalPages()) currentPage = getTotalPages() - 1;
      buildDots();
      goTo(currentPage);
    }, 150);
  });

  buildDots();
  goTo(0);
})();
