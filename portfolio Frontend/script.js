document.addEventListener('DOMContentLoaded', () => {
    // Cache high-use nodes once to avoid repeated DOM queries.
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    const navBackdrop = document.querySelector('.nav-menu-backdrop');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const menuCloseBtn = document.querySelector('.menu-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.querySelector('.contact-form');
    const heroContent = document.querySelector('.hero-content');
    const cvDownloadBtn = document.getElementById('cv-download-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Reusable helper to avoid repeating class toggling boilerplate.
    function setStatusMessage(statusEl, message, type) {
        statusEl.textContent = message;
        statusEl.classList.toggle('success', type === 'success');
        statusEl.classList.toggle('error', type === 'error');
    }

    /* =========================
       1) Scroll Progress Bar
    ========================== */
    (function setupProgressBar() {
        const fill = document.getElementById('progress-bar-fill');
        if (!fill) return;

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            fill.style.width = pct + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    })();

    /* =========================
       2) Landing Page Animation
    ========================== */
    (function setupLandingAnimation() {
        if (!heroContent) return;

        // Add landing animation class on page load
        heroContent.classList.add('landing-animate');

        // Remove animation class after animations complete (for re-triggering if needed)
        setTimeout(() => {
            heroContent.classList.remove('landing-animate');
            // Keep elements visible
            const animatedElements = heroContent.querySelectorAll('.availability-badge, .hero-location, .hero-title, .hero-description, .hero-buttons, .hero-social, .hero-image');
            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }, 2500);
    })();

    projectCards.forEach(function (card) {
        const video = card.querySelector('.project-video');
        if (!video) return;
        card.addEventListener('mouseenter', function () {
            video.play();
        });
        card.addEventListener('mouseleave', function () {
            video.pause();
            video.currentTime = 0; // reset to start for thumbnail effect
        });
    });

    /* =========================
       3) Theme Toggle (Light / Dark)
    ========================== */
    (function setupThemeToggle() {
        if (!themeToggleBtn) return;

        const root = document.documentElement;
        const THEME_KEY = 'preferred-theme';

        function applyTheme(theme) {
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
                themeToggleBtn.title = 'Switch to light mode';
            } else {
                root.removeAttribute('data-theme');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
                themeToggleBtn.title = 'Switch to dark mode';
            }
        }

        let initialTheme = 'light';
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
            initialTheme = stored;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            initialTheme = 'dark';
        }

        applyTheme(initialTheme);

        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem(THEME_KEY, nextTheme);
        });
    })();

    /* =========================
       4) Mobile Navigation Menu
    ========================== */
    (function setupMobileNav() {
        if (!navMenu || !mobileToggle) return;

        function openMenu() {
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            body.classList.add('menu-open');
            if (navBackdrop) navBackdrop.classList.add('active');
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.classList.remove('menu-open');
            if (navBackdrop) navBackdrop.classList.remove('active');
        }

        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', closeMenu);
        }

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }

        // Close menu when a nav link is clicked (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    closeMenu();
                }
            });
        });

        // Close with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    })();

    /* =========================
       5) Smooth Scroll + Active Nav Highlight
    ========================== */
    (function setupSmoothScrollAndActiveNav() {
        if (!navLinks.length) return;

        function scrollToSection(targetId) {
            const target = document.querySelector(targetId);
            if (!target) return;

            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            link.addEventListener('click', (event) => {
                event.preventDefault();
                scrollToSection(href);
            });
        });

        const sections = document.querySelectorAll('main section[id]');
        const sectionToLink = {};

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#')) {
                const id = href.slice(1);
                sectionToLink[id] = link;
            }
        });

        function updateActiveNav() {
            const scrollPos = window.pageYOffset;
            const navHeight = navbar ? navbar.offsetHeight : 0;
            let currentId = null;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 120;
                if (scrollPos >= sectionTop) {
                    currentId = section.id;
                }
            });

            navLinks.forEach(link => link.classList.remove('active'));

            if (currentId && sectionToLink[currentId]) {
                sectionToLink[currentId].classList.add('active');
            }
        }

        updateActiveNav();

        // rAF keeps nav updates smooth during fast scrolling.
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateActiveNav);
        });
    })();

    /* =========================
       6) FAQ Accordion
    ========================== */
    (function setupFaqAccordion() {
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            // .faq-answer is handled through CSS and .active class, so no JS reference is required.
            if (!questionBtn) return;

            questionBtn.addEventListener('click', () => {
                const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

                // Close all other items
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (!otherQuestion) return;
                    otherItem.classList.remove('active');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isExpanded) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    })();

    /* =========================
       7) Contact Form Feedback
    ========================== */
    (function setupContactForm() {
        const contactForm = document.querySelector(".contact-form");
        if (!contactForm) return;

        const submitBtn = contactForm.querySelector("button[type='submit']");

        const messageDiv = document.getElementById("form-message");

        function showMessage(message, type = "info") {
            if (!messageDiv) return;

            messageDiv.textContent = message;
            messageDiv.className = `form-message ${type} show`;

            if (type === "success") {
                setTimeout(() => {
                    messageDiv.classList.remove("show");
                }, 10000);
            }
        }

        function clearMessage() {
            if (messageDiv) {
                messageDiv.textContent = "";
                messageDiv.className = "form-message";
            }
        }

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearMessage();

            const formData = new FormData(contactForm);
            const payload = {
                name: formData.get("name")?.trim(),
                email: formData.get("email")?.trim(),
                subject: formData.get("subject")?.trim(),
                message: formData.get("message")?.trim()
            };

            if (!payload.name || !payload.email || !payload.subject || !payload.message) {
                showMessage("Please fill in all required fields.", "error");
                return;
            }

            const originalBtnText = submitBtn.textContent;

            try {
                submitBtn.disabled = true;
                submitBtn.classList.add("loading-progress");
                submitBtn.innerHTML = '<span class="progress-text">Sending...</span><span class="progress-bar"></span>';

                const response = await fetch("https://my-portfolio-production-01.up.railway.app/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to send message");
                }

                const progressBar = submitBtn.querySelector(".progress-bar");
                if (progressBar) {
                    progressBar.style.animation = 'none';
                    progressBar.style.width = '100%';
                    progressBar.style.transition = 'width 0.5s ease-out';
                }

                submitBtn.classList.remove("loading-progress");
                submitBtn.classList.add("success-btn");
                submitBtn.innerHTML = "✓ Sent!";
                submitBtn.style.backgroundColor = "#04aa6d";

                showMessage("Thank you so much for connecting! I've received your message and will reply to your email as soon as possible.", "success");
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.classList.remove("success-btn");
                    submitBtn.textContent = originalBtnText;
                }, 10000);

            } catch (error) {
                submitBtn.classList.remove("loading-progress");
                showMessage(error.message, "error");
            } finally {
                if (!submitBtn.classList.contains("success-btn")) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    })();

    /* =========================
       8) Scroll Animations
    ========================== */
    (function setupScrollAnimations() {
        const animatedTargets = document.querySelectorAll(
            '.hero-content, .section-header, .skills-grid, .experience-item, .project-card, .testimonial-card, .faq-item, .contact-form'
        );

        if (!animatedTargets.length) return;

        if (!('IntersectionObserver' in window)) {
            animatedTargets.forEach(el => {
                el.style.display = 'none';
            });
            return;
        }

        animatedTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.7s ease forwards';
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        animatedTargets.forEach(el => observer.observe(el));
    })();

    /* =========================
       9) CV Download
    ========================== */

    (function setupCvDownloadButton() {
        if (!cvDownloadBtn) return;

        const DEV_ENDPOINT = "https://my-portfolio-production-01.up.railway.app/api/resume/download";
        const overrideEndpoint = window.RESUME_DOWNLOAD_ENDPOINT || "";
        const defaultEndpoint = overrideEndpoint || DEV_ENDPOINT;

        function resolveEndpoint(value) {
            if (!value) return defaultEndpoint;
            try {
                return new URL(value, window.location.origin).href;
            } catch {
                return value;
            }
        }

        function getEndpoint() {
            const attr = cvDownloadBtn.dataset.resumeEndpoint;
            return resolveEndpoint(attr);
        }

        cvDownloadBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            const btn = cvDownloadBtn;
            const originalText = btn.textContent;

            try {
                btn.disabled = true;
                btn.textContent = "...";

                const response = await fetch(getEndpoint(), {
                    method: "GET",
                    mode: "cors",
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error("Failed to download CV");
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Hemant_Kumar_CV.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                btn.textContent = "✓";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error("Download error:", error);
                btn.textContent = "Download Failed";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        });
    })();


});
