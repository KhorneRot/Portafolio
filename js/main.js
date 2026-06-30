const root = document.documentElement;
const nav = document.querySelector(".nav");
let lastScrollY = window.scrollY;
let navScrollTicking = false;

const updateNavVisibility = () => {
  const currentScrollY = window.scrollY;

  if (nav?.classList.contains("nav-menu-open")) {
    nav.classList.remove("nav-hidden");
    lastScrollY = currentScrollY;
    navScrollTicking = false;
    return;
  }

  const goingDown = currentScrollY > lastScrollY;

  if (currentScrollY < 80) {
    nav?.classList.remove("nav-hidden");
  } else if (Math.abs(currentScrollY - lastScrollY) > 8) {
    nav?.classList.toggle("nav-hidden", goingDown);
    lastScrollY = currentScrollY;
  }

  navScrollTicking = false;
};

window.addEventListener("scroll", () => {
  if (!navScrollTicking) {
    window.requestAnimationFrame(updateNavVisibility);
    navScrollTicking = true;
  }
}, { passive: true });

window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  root.style.setProperty("--mx", `${x}%`);
  root.style.setProperty("--my", `${y}%`);
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const financeProjectToggle = document.querySelector("[data-finance-toggle]");
const financeProjectDetail = document.querySelector("#hormigon-completo");
const financeProjectCloseButtons = document.querySelectorAll("[data-finance-close]");

const scrollToFinanceTarget = (targetSelector) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const headerOffset = window.innerWidth <= 700 ? 84 : 112;
  const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: targetY, left: 0, behavior: "smooth" });
};

const setFinanceProjectOpen = (willOpen, shouldScroll = true) => {
  if (!financeProjectDetail) return;

  financeProjectDetail.classList.toggle("is-open", willOpen);
  financeProjectDetail.setAttribute("aria-hidden", String(!willOpen));

  if (financeProjectToggle) {
    financeProjectToggle.setAttribute("aria-expanded", String(willOpen));
    financeProjectToggle.textContent = willOpen ? "Mostrar menos" : "Ver proyecto completo";
  }

  if (willOpen) {
    financeProjectDetail.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });

    if (shouldScroll) {
      window.requestAnimationFrame(() => scrollToFinanceTarget("#hormigon-historia"));
    }

    return;
  }

  window.setTimeout(() => {
    if (financeProjectDetail.classList.contains("is-open")) return;

    financeProjectDetail.querySelectorAll(".reveal").forEach((element) => {
      element.classList.remove("is-visible");
    });
  }, 420);

  if (shouldScroll) {
    window.requestAnimationFrame(() => scrollToFinanceTarget("#hormigon"));
  }
};

financeProjectToggle?.addEventListener("click", () => {
  if (!financeProjectDetail) return;

  const willOpen = !financeProjectDetail.classList.contains("is-open");
  setFinanceProjectOpen(willOpen);
});

financeProjectCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setFinanceProjectOpen(false);
    financeProjectToggle?.focus({ preventScroll: true });
  });
});


const projectAnchorLinks = document.querySelectorAll('a[href="#hormigon"]');

projectAnchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const detailIsOpen = financeProjectDetail?.classList.contains('is-open');
    const targetSelector = detailIsOpen ? '#hormigon-historia' : '#hormigon';
    scrollToFinanceTarget(targetSelector);
    if (window.location.hash !== '#hormigon') {
      history.replaceState(null, '', '#hormigon');
    }
  });
});

const horizontalFlows = document.querySelectorAll(".case-flow");

horizontalFlows.forEach((flow) => {
  flow.addEventListener(
    "wheel",
    (event) => {
      if (window.innerWidth < 900) return;

      const maxScrollLeft = flow.scrollWidth - flow.clientWidth;
      const goingRight = event.deltaY > 0;
      const goingLeft = event.deltaY < 0;

      const atStart = flow.scrollLeft <= 0;
      const atEnd = flow.scrollLeft >= maxScrollLeft - 2;

      if ((goingLeft && atStart) || (goingRight && atEnd)) return;

      event.preventDefault();

      flow.scrollBy({
        left: event.deltaY * 1.15,
        behavior: "smooth"
      });
    },
    { passive: false }
  );
});

const financeFunctionsBlocks = document.querySelector(".finance-functions-blocks");
const financeImageModal = document.querySelector("[data-finance-modal]");
const financeImageModalImage = document.querySelector("[data-finance-modal-image]");
const financeImageModalTitle = document.querySelector("#finance-modal-title");
const financeImageModalFrame = document.querySelector("[data-finance-modal-frame]");
let financeLastFocusedElement = null;

const financeSmartShowcase = document.querySelector(".finance-smart-showcase");
const financeSmartControls = Array.from(document.querySelectorAll(".finance-smart-control"));
const financeSmartMainDevice = document.querySelector("[data-smart-main-device]");
const financeSmartMainImage = document.querySelector("[data-smart-main-image]");
const financeMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const financeSmartMobileQuery = window.matchMedia("(max-width: 900px)");
const financeSmartFallbackImage = financeSmartMainImage?.getAttribute("src") || "";
let financeSmartActiveIndex = 0;
let financeSmartTimer = null;
let financeSmartLockedByUser = false;
let financeSmartRequestId = 0;

const preloadFinanceSmartImage = (src) => {
  if (!src) return Promise.reject(new Error("No se encontró la ruta de imagen."));

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = reject;
    image.src = src;
  });
};

const setFinanceSmartScreen = async (control, index = 0) => {
  if (!control || !financeSmartMainImage || !financeSmartMainDevice) return;

  const { smartTitle, smartImage, smartAlt } = control.dataset;
  const nextImage = smartImage || financeSmartFallbackImage;
  const currentRequestId = ++financeSmartRequestId;

  financeSmartControls.forEach((item) => {
    const isSelected = item === control;
    item.classList.toggle("is-active", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });

  financeSmartActiveIndex = index;
  financeSmartMainDevice.classList.add("is-switching");

  try {
    const loadedImage = await preloadFinanceSmartImage(nextImage);

    if (currentRequestId !== financeSmartRequestId) return;

    financeSmartMainImage.src = loadedImage;
    financeSmartMainDevice.dataset.fullImage = loadedImage;
  } catch (error) {
    if (currentRequestId !== financeSmartRequestId) return;

    if (financeSmartFallbackImage) {
      financeSmartMainImage.src = financeSmartFallbackImage;
      financeSmartMainDevice.dataset.fullImage = financeSmartFallbackImage;
    }
  }

  financeSmartMainImage.alt = smartAlt || smartTitle || "Captura de Hormigon";
  financeSmartMainDevice.dataset.fullTitle = smartTitle || "Vista completa";
  financeSmartMainDevice.setAttribute("aria-label", `Ver imagen completa de ${smartTitle || "Hormigon"}`);

  window.setTimeout(() => {
    if (currentRequestId === financeSmartRequestId) {
      financeSmartMainDevice.classList.remove("is-switching");
    }
  }, financeMotionReduced ? 0 : 90);
};

const startFinanceSmartAutoplay = () => {
  if (financeMotionReduced || financeSmartMobileQuery.matches || financeSmartLockedByUser || financeSmartControls.length < 2 || financeSmartTimer) return;

  financeSmartTimer = window.setInterval(() => {
    const nextIndex = (financeSmartActiveIndex + 1) % financeSmartControls.length;
    setFinanceSmartScreen(financeSmartControls[nextIndex], nextIndex);
  }, 4200);
};

const stopFinanceSmartAutoplay = () => {
  if (!financeSmartTimer) return;
  window.clearInterval(financeSmartTimer);
  financeSmartTimer = null;
};

financeSmartControls.forEach((control, index) => {
  control.setAttribute("aria-pressed", String(control.classList.contains("is-active")));

  control.addEventListener("click", () => {
    financeSmartLockedByUser = true;
    stopFinanceSmartAutoplay();
    setFinanceSmartScreen(control, index);
  });
});

if (financeSmartControls.length) {
  setFinanceSmartScreen(financeSmartControls[0], 0);
  startFinanceSmartAutoplay();
}

financeSmartMobileQuery.addEventListener?.("change", () => {
  if (financeSmartMobileQuery.matches) {
    stopFinanceSmartAutoplay();
    return;
  }

  startFinanceSmartAutoplay();
});

if (financeFunctionsBlocks) {
  financeFunctionsBlocks.classList.add("is-ready");
}

const updateFinanceModalPhoneSize = () => {
  if (!financeImageModal || !financeImageModalFrame || !financeImageModalTitle) return;
  if (!financeImageModal.classList.contains("finance-image-modal--phone-frame")) return;

  const modalStyles = window.getComputedStyle(financeImageModal);
  const content = financeImageModal.querySelector(".finance-image-modal__content");
  const contentStyles = content ? window.getComputedStyle(content) : null;
  const modalPaddingY = parseFloat(modalStyles.paddingTop) + parseFloat(modalStyles.paddingBottom);
  const contentPaddingY = contentStyles
    ? parseFloat(contentStyles.paddingTop) + parseFloat(contentStyles.paddingBottom)
    : 36;
  const contentGap = contentStyles ? parseFloat(contentStyles.rowGap || contentStyles.gap) || 12 : 12;
  const titleHeight = financeImageModalTitle.getBoundingClientRect().height || 28;
  const extraBreathingSpace = 10;
  const viewport = window.visualViewport || window;
  const viewportHeight = viewport.height || window.innerHeight;
  const viewportWidth = viewport.width || window.innerWidth;
  const availableHeight = Math.max(
    120,
    viewportHeight - modalPaddingY - contentPaddingY - contentGap - titleHeight - extraBreathingSpace
  );
  const maxResponsiveWidth = viewportWidth <= 560 ? viewportWidth * 0.86 : viewportWidth * 0.82;
  const maxDesignWidth = viewportWidth <= 560 ? 320 : 360;
  const widthFromHeight = availableHeight * (9 / 18.2);
  const nextWidth = Math.floor(Math.max(118, Math.min(maxResponsiveWidth, maxDesignWidth, widthFromHeight)));

  financeImageModal.style.setProperty("--finance-modal-phone-width", `${nextWidth}px`);
};

const openFinanceImageModal = (trigger) => {
  if (!financeImageModal || !financeImageModalImage || !financeImageModalTitle) return;

  const image = trigger.querySelector("img");
  const imageSrc = trigger.dataset.fullImage || image?.getAttribute("src");
  const imageTitle = trigger.dataset.fullTitle || image?.getAttribute("alt") || "Vista completa";

  if (!imageSrc) return;

  const shouldShowPhoneFrame = trigger.classList.contains("finance-smart-device") || trigger.dataset.modalFrame === "phone";
  const shouldUseWireframeModal = trigger.classList.contains("finance-wireframe-thumb");

  financeLastFocusedElement = document.activeElement;
  financeImageModalImage.src = imageSrc;
  financeImageModalImage.alt = image?.getAttribute("alt") || imageTitle;
  financeImageModalTitle.textContent = imageTitle;
  financeImageModal.classList.toggle("finance-image-modal--phone-frame", shouldShowPhoneFrame);
  financeImageModal.classList.toggle("finance-image-modal--wireframe", shouldUseWireframeModal);
  financeImageModalFrame?.classList.toggle("is-phone-frame", shouldShowPhoneFrame);
  financeImageModal.classList.add("is-open");
  financeImageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("finance-modal-open");

  if (shouldShowPhoneFrame) {
    updateFinanceModalPhoneSize();
  } else {
    financeImageModal.style.removeProperty("--finance-modal-phone-width");
  }

  const closeButton = financeImageModal.querySelector("[data-finance-modal-close]");
  closeButton?.focus({ preventScroll: true });
};

const closeFinanceImageModal = () => {
  if (!financeImageModal || !financeImageModalImage) return;

  financeImageModal.classList.remove("is-open", "finance-image-modal--phone-frame", "finance-image-modal--wireframe");
  financeImageModalFrame?.classList.remove("is-phone-frame");
  financeImageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("finance-modal-open");
  financeImageModalImage.removeAttribute("src");
  financeImageModalImage.alt = "";
  financeImageModal.style.removeProperty("--finance-modal-phone-width");

  if (financeLastFocusedElement instanceof HTMLElement) {
    financeLastFocusedElement.focus({ preventScroll: true });
  }

  financeLastFocusedElement = null;
};

document.addEventListener("click", (event) => {
  const clickedElement = event.target instanceof Element ? event.target : null;
  if (!clickedElement) return;

  const zoomTrigger = clickedElement.closest(".finance-function-zoom");

  if (zoomTrigger) {
    openFinanceImageModal(zoomTrigger);
    return;
  }

  if (clickedElement.closest("[data-finance-modal-close]")) {
    closeFinanceImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && financeImageModal?.classList.contains("is-open")) {
    closeFinanceImageModal();
  }
});

const resizeFinanceModal = () => {
  if (financeImageModal?.classList.contains("is-open")) {
    updateFinanceModalPhoneSize();
  }
};

window.addEventListener("resize", resizeFinanceModal);
window.visualViewport?.addEventListener("resize", resizeFinanceModal);

const navMenuToggle = document.querySelector("[data-nav-toggle]");
const navMenuLinks = document.querySelectorAll(".nav-links a");
let navMenuLastScrollY = window.scrollY;

const setNavMenuOpen = (isOpen) => {
  if (!nav || !navMenuToggle) return;

  nav.classList.toggle("nav-menu-open", isOpen);
  navMenuToggle.setAttribute("aria-expanded", String(isOpen));
  navMenuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
};

const closeNavMenu = () => setNavMenuOpen(false);

navMenuToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = nav?.classList.contains("nav-menu-open") ?? false;

  if (!isOpen) {
    nav?.classList.remove("nav-hidden");
  }

  setNavMenuOpen(!isOpen);
});

navMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeNavMenu();
    nav?.classList.remove("nav-hidden");
  });
});

document.addEventListener("click", (event) => {
  const clickedElement = event.target instanceof Element ? event.target : null;
  if (!clickedElement || !nav?.classList.contains("nav-menu-open")) return;
  if (clickedElement.closest(".nav")) return;

  closeNavMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavMenu();
  }
});

window.addEventListener("scroll", () => {
  if (!nav?.classList.contains("nav-menu-open")) {
    navMenuLastScrollY = window.scrollY;
    return;
  }

  if (Math.abs(window.scrollY - navMenuLastScrollY) > 12) {
    closeNavMenu();
    navMenuLastScrollY = window.scrollY;
  }
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeNavMenu();
  }
});

