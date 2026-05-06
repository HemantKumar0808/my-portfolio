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
    const heroContent = document.querySelector('.hero-content');
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

    /* =========================
       3) Hero Role Typewriter
    ========================== */
    (function setupRoleTypewriter() {
        const roleEl = document.querySelector('.typewriter-role');
        if (!roleEl) return;

        const roles = [
            'Software Engineer',
            'Software Developer',
            'Java Backend Developer',
            'Java Full Stack Developer'
            
        ];

        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            roleEl.textContent = roles[3];
            return;
        }

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeRole() {
            const currentRole = roles[roleIndex];
            roleEl.textContent = currentRole.slice(0, charIndex);

            if (!isDeleting && charIndex < currentRole.length) {
                charIndex += 1;
                setTimeout(typeRole, 90);
                return;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeRole, 1300);
                return;
            }

            if (isDeleting && charIndex > 0) {
                charIndex -= 1;
                setTimeout(typeRole, 45);
                return;
            }

            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 300);
        }

        typeRole();
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
        const contactEmail = "hemusharma10001@gmail.com";

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

        contactForm.addEventListener("submit", (event) => {
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
            const emailBody = [
                `Name: ${payload.name}`,
                `Email: ${payload.email}`,
                "",
                payload.message
            ].join("\n");
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(emailBody)}`;
            const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(emailBody)}`;

            try {
                submitBtn.disabled = true;
                submitBtn.classList.add("loading-progress");
                submitBtn.innerHTML = '<span class="progress-text">Opening Gmail...</span><span class="progress-bar"></span>';

                window.open(gmailUrl, "_blank", "noopener");

                submitBtn.classList.remove("loading-progress");
                submitBtn.classList.add("success-btn");
                submitBtn.innerHTML = "Gmail Ready";
                submitBtn.style.backgroundColor = "#04aa6d";

                showMessage("Gmail should open with the message filled in. Please press send there.", "success");

                setTimeout(() => {
                    submitBtn.classList.remove("success-btn");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.disabled = false;
                }, 10000);

            } catch (error) {
                submitBtn.classList.remove("loading-progress");
                window.location.href = mailtoUrl;
                showMessage("If Gmail did not open, please email me directly at hemusharma10001@gmail.com.", "error");
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

});
