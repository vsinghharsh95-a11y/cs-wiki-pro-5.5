/* CINEMATIC REDESIGN — progressive scroll motion */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("cinematic-enhanced");

  const candidates = [
    [".page-home .hero-copy", "left"],
    [".page-home .hero-scene", "right"],
    [".home-editorial-spotlight", "right"],
    [".editorial-mini-link", "up"],
    [".stats .stat", "up"],
    [".section-head.reveal", "left"],
    [".grid .card", "up"],
    [".topic-grid .topic-tile", "up"],
    [".path-callout", "left"],
    [".daily-callout", "right"],
    [".labs > .section-head", "left"],
    [".map-explorer", "up"],
    [".paths-page .path-grid > *", "up"],
    [".article-layout > *", "up"],
    [".article-body > section", "up"],
    [".challenge-layout > *", "up"],
    [".space-page .space-panel", "up"],
    [".about-values article", "up"]
  ];

  candidates.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element, localIndex) => {
      if (element.classList.contains("cinema-reveal")) return;
      element.classList.add("cinema-reveal");
      element.dataset.motion = localIndex % 2 && direction === "up" ? "right" : direction;
      element.style.setProperty("--cinema-delay", String(Math.min(localIndex % 5, 4) * 65) + "ms");
    });
  });

  const revealElements = document.querySelectorAll(".cinema-reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

  revealElements.forEach((element) => observer.observe(element));

  if (document.querySelector(".hero-scene")) {
    let queued = false;
    window.addEventListener("scroll", () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        root.style.setProperty("--hero-scroll", String(Math.min(window.scrollY * 0.045, 28)) + "px");
        queued = false;
      });
    }, { passive: true });
  }
})();