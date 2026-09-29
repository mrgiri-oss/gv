document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menu = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");

    const onScroll = () => {
        header.classList.toggle("scrolled", window.scrollY > 35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    menu?.addEventListener("click", () => nav.classList.toggle("open"));
    nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

    const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: .12 });

    document.querySelectorAll(".reveal, .reveal-right").forEach(el => reveal.observe(el));

    const sections = [...document.querySelectorAll("section[id]")];
    const links = [...document.querySelectorAll(".nav-links a")];

    const active = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.remove("active"));
            const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            link?.classList.add("active");
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => active.observe(section));
});
