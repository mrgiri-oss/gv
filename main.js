document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GEETA CLASSES — MAIN JAVASCRIPT
       ===================================================== */

    const header = document.getElementById("siteHeader");
    const menu = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const onScroll = () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 35);
        }
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
        passive: true
    });


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (menu && nav) {

        menu.addEventListener("click", () => {
            nav.classList.toggle("open");
            menu.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menu.classList.remove("active");
            });

        });
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-right"
    );

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    link.classList.remove("active");
                });

                const activeLink = document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                );

                if (activeLink) {
                    activeLink.classList.add("active");
                }

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );


    sections.forEach(section => {
        sectionObserver.observe(section);
    });



    /* =====================================================
       IMAGE LIGHTBOX / REAL-TIME IMAGE VIEWER
       ===================================================== */

    const images = Array.from(
        document.querySelectorAll(
            ".moment img, .gallery-grid img, .sport-card img, .hero-main-image img, .tuition-image img, .achievement-photo img, .collage-main img, .collage-small img, .split-photo img"
        )
    );

    if (images.length > 0) {

        /* ---------------------------------------------
           Create Lightbox
        --------------------------------------------- */

        const lightbox = document.createElement("div");

        lightbox.className = "geeta-lightbox";

        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>

            <button
                class="lightbox-close"
                aria-label="Close image"
                type="button"
            >
                &times;
            </button>

            <button
                class="lightbox-prev"
                aria-label="Previous image"
                type="button"
            >
                &#10094;
            </button>

            <div class="lightbox-content">

                <img
                    class="lightbox-image"
                    src=""
                    alt=""
                >

                <div class="lightbox-caption">
                    <span class="lightbox-counter"></span>
                    <strong class="lightbox-title"></strong>
                </div>

            </div>

            <button
                class="lightbox-next"
                aria-label="Next image"
                type="button"
            >
                &#10095;
            </button>
        `;

        document.body.appendChild(lightbox);


        /* ---------------------------------------------
           Elements
        --------------------------------------------- */

        const lightboxImage =
            lightbox.querySelector(".lightbox-image");

        const closeButton =
            lightbox.querySelector(".lightbox-close");

        const prevButton =
            lightbox.querySelector(".lightbox-prev");

        const nextButton =
            lightbox.querySelector(".lightbox-next");

        const backdrop =
            lightbox.querySelector(".lightbox-backdrop");

        const counter =
            lightbox.querySelector(".lightbox-counter");

        const title =
            lightbox.querySelector(".lightbox-title");


        let currentIndex = 0;


        /* ---------------------------------------------
           Open Image
        --------------------------------------------- */

        const openLightbox = index => {

            currentIndex = index;

            const image = images[currentIndex];

            if (!image) return;

            lightboxImage.src = image.src;

            lightboxImage.alt =
                image.alt || "Geeta Classes";

            counter.textContent =
                `${currentIndex + 1} / ${images.length}`;

            title.textContent =
                image.alt || "Geeta Classes";

            lightbox.classList.add("active");

            document.body.classList.add("lightbox-open");

            /* Prevent background page scrolling */
            document.body.style.overflow = "hidden";
        };


        /* ---------------------------------------------
           Close Image
        --------------------------------------------- */

        const closeLightbox = () => {

            lightbox.classList.remove("active");

            document.body.classList.remove("lightbox-open");

            document.body.style.overflow = "";

            /*
             * Small delay prevents the image from
             * flashing when another image is opened.
             */
            setTimeout(() => {
                lightboxImage.src = "";
            }, 250);
        };


        /* ---------------------------------------------
           Next Image
        --------------------------------------------- */

        const showNext = () => {

            currentIndex++;

            if (currentIndex >= images.length) {
                currentIndex = 0;
            }

            openLightbox(currentIndex);
        };


        /* ---------------------------------------------
           Previous Image
        --------------------------------------------- */

        const showPrevious = () => {

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }

            openLightbox(currentIndex);
        };


        /* ---------------------------------------------
           Click Images
        --------------------------------------------- */

        images.forEach((image, index) => {

            image.style.cursor = "zoom-in";

            image.addEventListener("click", event => {

                event.preventDefault();

                openLightbox(index);
            });

        });


        /* ---------------------------------------------
           Buttons
        --------------------------------------------- */

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

        backdrop.addEventListener(
            "click",
            closeLightbox
        );

        nextButton.addEventListener(
            "click",
            showNext
        );

        prevButton.addEventListener(
            "click",
            showPrevious
        );


        /* ---------------------------------------------
           Keyboard Controls
        --------------------------------------------- */

        document.addEventListener("keydown", event => {

            if (!lightbox.classList.contains("active")) {
                return;
            }

            switch (event.key) {

                case "Escape":
                    closeLightbox();
                    break;

                case "ArrowRight":
                    showNext();
                    break;

                case "ArrowLeft":
                    showPrevious();
                    break;

            }

        });


        /* ---------------------------------------------
           Touch / Swipe Support
        --------------------------------------------- */

        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        lightbox.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const difference =
                    touchStartX - touchEndX;

                /* Swipe left */
                if (difference > 50) {
                    showNext();
                }

                /* Swipe right */
                if (difference < -50) {
                    showPrevious();
                }

            },
            { passive: true }
        );

    }


    /* =====================================================
       IMAGE LOADING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            console.warn(
                "Geeta Classes image could not be loaded:",
                image.src
            );

        });

    });

});

document.addEventListener("click", (event) => {

    if (!nav || !menu) return;

    const clickedInsideMenu =
        nav.contains(event.target);

    const clickedMenuButton =
        menu.contains(event.target);

    if (
        nav.classList.contains("open") &&
        !clickedInsideMenu &&
        !clickedMenuButton
    ) {
        nav.classList.remove("open");
        menu.classList.remove("active");
    }

}); 

document.addEventListener('DOMContentLoaded', () => {
  // Sticky header
  const header = document.getElementById('siteHeader');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 35);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-active');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.classList.toggle('open', open);
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', e => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Hero crossfade carousel — first slide is always the supplied banner.
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  let current = 0;
  let timer;
  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };
  const restart = () => {
    clearInterval(timer);
    if (slides.length > 1) timer = setInterval(() => showSlide(current + 1), 5200);
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restart(); }));
  if (slides.length) { showSlide(0); restart(); }

  // Scroll reveal — BodyFit-inspired interaction, Geeta styling.
  const revealItems = document.querySelectorAll('.reveal, .reveal-right, .service-row, .price-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('element-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('element-visible'));
  }

  // Keep active nav item roughly in sync with page sections.
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }
});

document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(
        ".sports-hero-bg-slide"
    );

    if (slides.length <= 1) return;

    let current = 0;

    setInterval(function () {

        slides[current].classList.remove("active");

        current = (current + 1) % slides.length;

        slides[current].classList.add("active");

    }, 5000);

});
