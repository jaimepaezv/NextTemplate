/**
 * Initializes smooth scrolling using Lenis and GSAP.
 */
let lenis; // Declare Lenis instance globally to be accessible if needed
const initSmoothScrolling = () => {
    // Create a new Lenis instance for smooth scrolling
    lenis = new Lenis({
        lerp: 0.1, // Lower values are smoother, but maybe less responsive
        smoothWheel: true // Enable smooth scrolling on mouse wheel
    });
    // Sync Lenis scroll position with ScrollTrigger updates
    lenis.on('scroll', () => ScrollTrigger.update());
    // Integrate Lenis smooth scroll into GSAP's ticker for animation synchronization
    gsap.ticker.add((timeElapsed) => {
        lenis.raf(timeElapsed * 1000); // Convert elapsed time to milliseconds for Lenis
    });
    // Enable GSAP's lag smoothing to prevent performance issues during rapid scrolling
    gsap.ticker.lagSmoothing(0);
};
/**
 * Handles dark mode functionality for the website.
 */
const DarkMode = {
    elements: {}, // Object to store DOM elements related to dark mode
    /**
     * Initializes dark mode by setting up elements, theme, and event listeners.
     */
    init() {
        // Store relevant DOM elements
        this.elements = {
            darkIcon: document.getElementById("theme-toggle-dark-icon"), // Icon indicating dark theme
            lightIcon: document.getElementById("theme-toggle-light-icon"), // Icon indicating light theme
            toggleBtn: document.getElementById("theme-toggle")         // Button to toggle dark mode
        };
        this.setInitialTheme(); // Set the initial theme based on local storage or system preference
        this.bindEvents();      // Attach event listener to the theme toggle button
    },
    /**
     * Sets the initial theme based on user preference or system settings.
     * Checks local storage for 'color-theme' or uses system preference if not found.
     */
    setInitialTheme() {
        // Check if 'color-theme' is set to 'dark' in local storage
        const storedTheme = localStorage.getItem("color-theme");
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (storedTheme === "dark" || (!storedTheme && prefersDarkMode)) {
            // If dark theme is preferred (either stored or system preference)
            this.elements.lightIcon?.classList.remove("hidden"); // Show light icon (as dark mode is active)
            document.documentElement?.classList.add("dark");     // Add 'dark' class to HTML element to apply dark theme styles
        } else {
            // If light theme is preferred
            this.elements.darkIcon?.classList.remove("hidden");  // Show dark icon (as light mode is active)
            document.documentElement?.classList.remove("dark");  // Remove 'dark' class to revert to light theme styles
        }
    },
    /**
     * Binds a click event listener to the theme toggle button.
     * When clicked, it calls the toggleTheme method.
     */
    bindEvents() {
        if (this.elements.toggleBtn) { // Check if the toggle button element exists
            this.elements.toggleBtn.addEventListener("click", () => this.toggleTheme());
        }
    },
    /**
     * Toggles between dark and light themes when the toggle button is clicked.
     * Updates icons, HTML class, and local storage.
     */
    toggleTheme() {
        // Toggle visibility of dark and light icons
        this.elements.darkIcon.classList.toggle("hidden");
        this.elements.lightIcon.classList.toggle("hidden");
        // Toggle 'dark' class on the HTML element and store the new theme in local storage
        const isDarkMode = document.documentElement.classList.toggle("dark"); // Returns true if 'dark' class is added, false if removed
        localStorage.setItem("color-theme", isDarkMode ? "dark" : "light"); // Store the current theme in local storage
    }
};
/**
 * Handles various animations using GSAP and ScrollTrigger.
 */
const Animations = {
    /**
     * Initializes the hero gradient animation, making it scale and rotate infinitely.
     */
    initHeroGradient() {
        const gradientWrapper = document.getElementById("hero-gradient-wrapper"); // Wrapper element for gradient
        const gradientElement = document.getElementById("hero-gradient");       // Gradient element itself
        // Animate the wrapper to scale up and down repeatedly
        gsap.to(gradientWrapper, {
            scale: 0.6,          // Scale down to 60%
            repeat: -1,         // Repeat infinitely
            duration: 3,         // Duration of each scale animation in seconds
            yoyo: true,          // Yoyo effect: reverse animation after each cycle
            ease: Linear.easeNone // Linear easing for constant speed
        }).play(); // Start the animation immediately
        // Animate the gradient element to rotate 360 degrees repeatedly
        gsap.to(gradientElement, {
            repeat: -1,         // Repeat infinitely
            duration: 3,         // Duration of each rotation in seconds
            rotation: 360,      // Rotate 360 degrees
            ease: Linear.easeNone // Linear easing for constant speed
        }).play(); // Start the animation immediately
    },
    /**
     * Initializes pointer animation for desktop screens (cursor following effect).
     */
    initPointerAnimation() {
        const pointerElement = document.querySelector(".pointer"); // Custom pointer element
        // Only apply pointer animation if screen width is 1024px or wider (desktop)
        if (window.innerWidth >= 1024) {
            // Attach event listeners for mousemove and mouseenter events
            ["mousemove", "mouseenter"].forEach(eventType => {
                document.addEventListener(eventType, (event) => {
                    // Animate the pointer element to follow the mouse position
                    gsap.to(pointerElement, {
                        duration: 0.8,       // Animation duration
                        left: event.clientX,   // X position of the mouse
                        top: event.clientY,    // Y position of the mouse
                        ease: "expo.out"      // Expo out easing for a fast and smooth follow
                    });
                });
            });
        }
    },
    /**
     * Initializes text reveal animation for elements with class 'reveal-text'.
     * Characters are revealed with a scrub effect on scroll.
     */
    initTextReveal() {
        document.querySelectorAll(".reveal-text").forEach(element => {
            // Split text into characters for individual animation
            const splitText = new SplitType(element, { types: "chars" });
            // GSAP animation to reveal characters on scroll
            gsap.from(splitText.chars, {
                scrollTrigger: {
                    trigger: element,       // Element that triggers the animation
                    start: "top 34%",      // Animation starts when the top of the element is 34% from the top of the viewport
                    end: "top -10%",       // Animation ends when the top of the element is -10% from the top of the viewport
                    scrub: true,           // Scrub animation progress based on scroll position
                    pin: ".about",         // Pin the '.about' element during the animation
                    pinSpacing: true       // Add spacing to prevent content jump when pinning
                },
                opacity: 0.1,          // Initial opacity of characters (almost invisible)
                stagger: 5,            // Stagger animation of characters
                ease: "back.out"        // Back out easing for a slight overshoot effect
            });
        });
    },
    /**
     * Initializes text reveal animation for elements with class 'reveal-text-2'.
     * Similar to initTextReveal but with different scroll trigger points.
     */
    initTextReveal2() {
        document.querySelectorAll(".reveal-text-2").forEach(element => {
            // Split text into characters for individual animation
            const splitText = new SplitType(element, { types: "chars" });
            // GSAP animation to reveal characters on scroll
            gsap.from(splitText.chars, {
                scrollTrigger: {
                    trigger: element,       // Element that triggers the animation
                    start: "top 90%",      // Animation starts when the top of the element is 90% from the top of the viewport
                    end: "top 40%",       // Animation ends when the top of the element is 40% from the top of the viewport
                    scrub: true            // Scrub animation progress based on scroll position
                },
                opacity: 0.1,          // Initial opacity of characters (almost invisible)
                stagger: 5,            // Stagger animation of characters
                ease: "back.out"        // Back out easing for a slight overshoot effect
            });
        });
    },
    /**
     * Initializes horizontal scrolling for the service section.
     */
    initHorizontalScroll() {
        const serviceWrapper = document.querySelector(".service-wrapper"); // Wrapper for service items
        if (serviceWrapper) { // Check if the service wrapper element exists
            // Calculate the horizontal scroll distance based on content width and viewport width
            const scrollDistance = () => -(serviceWrapper.scrollWidth - window.innerWidth);
            // GSAP animation for horizontal scrolling
            const horizontalScrollTween = gsap.to(serviceWrapper, {
                x: scrollDistance,     // Translate the wrapper horizontally
                duration: 3,         // Animation duration
                ease: "none"          // No easing for constant speed horizontal scroll
            });
            // ScrollTrigger to control horizontal scroll animation and pinning
            ScrollTrigger.create({
                trigger: ".service-section", // Section that triggers the horizontal scroll
                start: "top 0%",         // Animation starts when the top of the section reaches the top of the viewport
                end: () => "+=" + -1 * scrollDistance(), // Animation ends after scrolling the calculated distance
                pin: true,              // Pin the section during horizontal scroll
                animation: horizontalScrollTween, // Apply the horizontal scroll animation
                scrub: 1,                // Scrub animation progress based on scroll position
                invalidateOnRefresh: true // Recalculate scroll values on refresh
            });
        }
    },
    /**
     * Initializes CTA image reveal animation on scroll.
     */
    initCtaImageReveal() {
        const ctaImage = document.getElementById("cta-img"); // CTA image element
        if (ctaImage) { // Check if the CTA image element exists
            // GSAP animation to reveal the CTA image
            gsap.from(ctaImage, {
                scale: 0,            // Start with scale 0 (invisible)
                rotation: -45,        // Start with rotation -45 degrees
                duration: 2.1,         // Animation duration
                ease: "elastic.out(1.4, 1.2)", // Elastic out easing for a bouncy reveal effect
                scrollTrigger: {
                    trigger: ctaImage,     // Element that triggers the animation
                    start: "top 70%",      // Animation starts when the top of the image is 70% from the top of the viewport
                    end: "top 30%",       // Animation ends when the top of the image is 30% from the top of the viewport
                    scrub: false           // No scrub, animation plays once on scroll
                }
            });
        }
    },
    /**
     * Initializes horizontal scrolling for a section with an extra-large image.
     */
    initImageHorizontalScroll() {
        const imageContainer = document.getElementById("extra-large-image-container"); // Container for the extra-large image
        if (imageContainer) { // Check if the image container element exists
            ScrollTrigger.addEventListener("refreshInit", () => { }); // Empty listener, possibly for future use
            // GSAP animation for horizontal scrolling of the image container
            gsap.to(imageContainer, {
                x: () => -(imageContainer.scrollWidth - document.documentElement.clientWidth), // Calculate horizontal scroll distance
                ease: "none",          // No easing for constant speed horizontal scroll
                pin: true,              // Pin the image container during horizontal scroll
                scrollTrigger: {
                    trigger: imageContainer, // Element that triggers the animation
                    pin: false,             // Pinning is handled by the parent section, not the image container itself
                    start: "top 90%",      // Animation starts when the top of the container is 90% from the top of the viewport
                    end: () => "+=" + (imageContainer.scrollWidth - document.documentElement.clientWidth), // Animation ends after scrolling the calculated distance
                    scrub: 1,                // Scrub animation progress based on scroll position
                    invalidateOnRefresh: false, // Do not invalidate on refresh, as width is recalculated dynamically
                    anticipatePin: 1         // Anticipate pinning for smoother experience
                }
            });
            // Refresh ScrollTrigger on window resize to recalculate scroll positions
            window.addEventListener("resize", () => {
                ScrollTrigger.refresh();
            });
        }
    },
    /**
     * Initializes text appearance animation for section titles with class 'text-appear'.
     * Words in titles appear with a slight rotation and stagger effect.
     */
    initSectionTitles() {
        document.querySelectorAll(".text-appear").forEach(titleElement => {
            // Split each title into lines, then each line into words
            const splitLines = new SplitType(titleElement, { types: "lines" });
            splitLines.lines.forEach(line => {
                const splitWords = new SplitType(line, { types: "words" });
                // GSAP animation to make words appear
                gsap.from(splitWords.words, {
                    scrollTrigger: {
                        trigger: titleElement,    // Element that triggers the animation (section title)
                        start: "top 50%",       // Animation starts when the top of the title is 50% from the top of the viewport
                        end: "top 30%",        // Animation ends when the top of the title is 30% from the top of the viewport
                        scrub: false            // No scrub, animation plays once on scroll
                    },
                    y: 120,               // Initial vertical position (moved down)
                    rotation: 21,          // Initial rotation
                    stagger: 0.02,         // Stagger animation of words
                    duration: 0.7,          // Animation duration
                    ease: "power2.out"      // Power2 out easing for smooth appearance
                });
            });
        });
    },
    /**
     * Initializes text appearance animation for section titles with class 'text-appear-2'.
     * Similar to initSectionTitles but with different scroll trigger points.
     */
    initSectionTitles2() {
        document.querySelectorAll(".text-appear-2").forEach(titleElement => {
            // Split each title into lines, then each line into words
            const splitLines = new SplitType(titleElement, { types: "lines" });
            splitLines.lines.forEach(line => {
                const splitWords = new SplitType(line, { types: "words" });
                // GSAP animation to make words appear
                gsap.from(splitWords.words, {
                    scrollTrigger: {
                        trigger: titleElement,    // Element that triggers the animation (section title)
                        start: "top 90%",       // Animation starts when the top of the title is 90% from the top of the viewport
                        end: "top 30%",        // Animation ends when the top of the title is 30% from the top of the viewport
                        scrub: false            // No scrub, animation plays once on scroll
                    },
                    y: 120,               // Initial vertical position (moved down)
                    rotation: 21,          // Initial rotation
                    stagger: 0.02,         // Stagger animation of words
                    duration: 0.7,          // Animation duration
                    ease: "power2.out"      // Power2 out easing for smooth appearance
                });
            });
        });
    },
    /**
     * Initializes reveal animation for elements with class 'reveal-me'.
     * Elements fade in and move up with a slight rotation and blur effect on scroll.
     */
    initRevealElements() {
        document.querySelectorAll(".reveal-me").forEach(element => {
            // GSAP animation to reveal elements
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,       // Element that triggers the animation
                    start: "top 90%",      // Animation starts when the top of the element is 90% from the top of the viewport
                    end: "top 50%",       // Animation ends when the top of the element is 50% from the top of the viewport
                    scrub: false           // No scrub, animation plays once on scroll
                },
                opacity: 0,            // Initial opacity (invisible)
                y: 95,                // Initial vertical position (moved down)
                rotation: 2,           // Initial rotation
                filter: "blur(10px)",  // Initial blur effect
                duration: 0.9,          // Animation duration
                stagger: 0.1,          // Stagger animation of elements
                ease: "power2.out"      // Power2 out easing for smooth appearance
            });
        });
    },
    /**
     * Initializes zoom animation for elements with class 'zoom-image'.
     * Images zoom in on scroll and are pinned during the zoom animation.
     */
    initZoomAnimation() {
        const zoomImages = document.querySelectorAll(".zoom-image"); // All elements with class 'zoom-image'
        // GSAP animation to zoom in images
        gsap.to(zoomImages, {
            scale: 3.2,            // Target scale (zoom in)
            ease: "expoScale",      // Custom easing (likely defined elsewhere or a typo, should be 'expo.out' or similar)
            scrollTrigger: {
                trigger: zoomImages,    // Element that triggers the animation (zoom image)
                start: "top 20%",       // Animation starts when the top of the image is 20% from the top of the viewport
                end: "top -30%",      // Animation ends when the top of the image is -30% from the top of the viewport
                pin: true,              // Pin the image during zoom animation
                scrub: 1                // Scrub animation progress based on scroll position
            }
        });
    },
    /**
     * Initializes video scale animation for elements with class 'video-wrapper'.
     * Video wrappers scale up on scroll.
     */
    initVideoAnimation() {
        const videoWrappers = document.querySelectorAll(".video-wrapper"); // All elements with class 'video-wrapper'
        // GSAP animation to scale up video wrappers
        gsap.to(videoWrappers, {
            scale: 1,             // Target scale (scale up to 100%)
            scrollTrigger: {
                trigger: ".video-section", // Section that triggers the animation (video section)
                start: "top 80%",       // Animation starts when the top of the section is 80% from the top of the viewport
                end: "top 0%",        // Animation ends when the top of the section reaches the top of the viewport
                scrub: 1                // Scrub animation progress based on scroll position
            }
        });
    },
    /**
     * Initializes scale down animation for elements with class 'scale-small-img'.
     * Images scale down slightly on scroll.
     */
    initScaleSmallAnimation() {
        const scaleSmallImages = document.querySelectorAll(".scale-small-img"); // All elements with class 'scale-small-img'
        // GSAP animation to scale down images
        gsap.to(scaleSmallImages, {
            scale: 0.8,           // Target scale (scale down to 80%)
            scrollTrigger: {
                trigger: scaleSmallImages, // Element that triggers the animation (small scale image)
                start: "top 50%",       // Animation starts when the top of the image is 50% from the top of the viewport
                end: "top 0%",        // Animation ends when the top of the image reaches the top of the viewport
                scrub: 1,                // Scrub animation progress based on scroll position
                ease: "power4.inOut"    // Power4 inOut easing for smooth scale down and up
            }
        });
    },
    /**
     * Initializes scale down animation for elements with class 'scale-hero-img'.
     * Hero images scale down slightly on scroll, similar to initScaleSmallAnimation but with different trigger points.
     */
    initScaleSmallAnimation2() {
        const scaleHeroImages = document.querySelectorAll(".scale-hero-img"); // All elements with class 'scale-hero-img'
        // GSAP animation to scale down hero images
        gsap.to(scaleHeroImages, {
            scale: 0.94,          // Target scale (scale down to 94%)
            duration: 0.8,          // Animation duration
            scrollTrigger: {
                trigger: scaleHeroImages, // Element that triggers the animation (hero scale image)
                start: "top 7%",        // Animation starts when the top of the image is 7% from the top of the viewport
                end: "top 0%",        // Animation ends when the top of the image reaches the top of the viewport
                scrub: 1,                // Scrub animation progress based on scroll position
                ease: "power4.inOut"    // Power4 inOut easing for smooth scale down and up
            }
        });
    }
};
/**
 * Handles various UI components and their functionalities.
 */
const Components = {
    /**
     * Initializes circular text effect for elements with the given selector.
     * @param {string} elementSelector - CSS selector for the text element (default: '.text').
     * @param {number} charSpacing - Spacing between characters in degrees (default: 10.3).
     */
    initCircleText(elementSelector = ".text", charSpacing = 10.3) {
        const textElement = document.querySelector(elementSelector); // Target text element
        if (textElement) { // Check if the text element exists
            // Function to create a span for each character with rotation style
            const createCharSpan = (char, index) => `<span style="transform:rotate(${index * charSpacing}deg)">${char}</span>`;
            // Use requestAnimationFrame for smoother rendering
            requestAnimationFrame(() => {
                // Split text into characters, create spans, and join them back into the element
                textElement.innerHTML = Array.from(textElement.textContent.trim()) // Convert text to array of characters
                    .map(createCharSpan) // Map each character to a rotated span
                    .join("");          // Join spans back into a string
            });
        }
    },
    /**
     * Initializes scrolling marquee effect for elements with class 'marquee-inner'.
     */
    initScrollingMarquee() {
        const marqueeInner = document.querySelector(".marquee-inner"); // Inner element of the marquee
        if (marqueeInner) { // Check if the marquee inner element exists
            let scrollY = 0; // Variable to track scroll position
            const originalContent = marqueeInner.innerHTML; // Store original content
            // Duplicate content three times for seamless loop
            marqueeInner.innerHTML = originalContent + originalContent + originalContent;
            const singleWidth = marqueeInner.offsetWidth / 3; // Width of a single content repetition
            // GSAP animation for horizontal marquee scrolling
            const marqueeTween = gsap.to(".marquee-inner", {
                x: 2 * -singleWidth,    // Scroll to the left by twice the single width
                duration: 30,           // Animation duration (adjust for speed)
                ease: "none",            // No easing for constant speed
                repeat: -1,           // Repeat infinitely
                onRepeat: () => {
                    gsap.set(".marquee-inner", { x: -singleWidth }); // Reset position on repeat for seamless loop
                }
            });
            let animationFrameId; // Variable to store requestAnimationFrame ID for scroll handling
            // Event listener for scroll to control marquee speed based on scroll direction
            window.addEventListener("scroll", () => {
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId); // Cancel previous animation frame
                }
                animationFrameId = window.requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset; // Get current scroll position
                    if (Math.abs(currentScrollY - scrollY) > 1) { // Check if scroll amount is significant
                        marqueeTween.timeScale(currentScrollY > scrollY ? 1 : -1); // Adjust time scale based on scroll direction
                        scrollY = currentScrollY; // Update tracked scroll position
                    }
                });
            });
            let resizeAnimationFrameId; // Variable to store requestAnimationFrame ID for resize handling
            // Event listener for resize to recalculate marquee width and reset animation
            window.addEventListener("resize", () => {
                if (resizeAnimationFrameId) {
                    window.cancelAnimationFrame(resizeAnimationFrameId); // Cancel previous animation frame
                }
                resizeAnimationFrameId = window.requestAnimationFrame(() => {
                    const newSingleWidth = marqueeInner.offsetWidth / 3; // Recalculate single width on resize
                    marqueeTween.vars.x = 2 * -newSingleWidth;         // Update animation target x position
                    gsap.set(".marquee-inner", { x: -newSingleWidth });     // Reset position
                    marqueeTween.invalidate().restart();                // Invalidate and restart animation
                });
            });
        }
    },
    /**
     * Initializes FAQ accordion functionality for different accordion versions.
     */
    initFAQ() {
        const accordionItemsV1 = document.querySelectorAll(".accordion-item");     // Accordion items version 1
        const accordionItemsV4 = document.querySelectorAll(".accordion-itemV4");     // Accordion items version 4
        const accordionItemsV5 = document.querySelectorAll(".accordion-itemV5");     // Accordion items version 5
        // Accordion version 1 logic
        accordionItemsV1.forEach(item => {
            const header = item.querySelector(".accordion-header"); // Header of the accordion item
            header.addEventListener("click", () => {
                const isOpen = header.classList.contains("open"); // Check if header is already open
                // Close all accordion items
                accordionItemsV1.forEach(otherItem => {
                    const otherHeader = otherItem.querySelector(".accordion-header");
                    const otherBody = otherItem.querySelector(".accordion-body");
                    otherHeader.classList.remove("open", "active");
                    otherBody.style.height = "0";
                    otherItem.style.borderColor = "transparent";
                    otherItem.style.paddingBottom = "0";
                });
                // Open clicked accordion item if it was not already open
                if (!isOpen) {
                    header.classList.add("open", "active");
                    const body = item.querySelector(".accordion-body");
                    body.style.height = body.scrollHeight + "px"; // Set body height to content height
                    item.style.border = "1px solid black";
                    item.style.paddingBottom = "40px";
                }
            });
        });
        // Accordion version 4 logic
        accordionItemsV4.forEach((item, index) => {
            const header = item.querySelector(".accordion-headerV4"); // Header of the accordion item version 4
            const body = item.querySelector(".accordion-bodyV4");     // Body of the accordion item version 4
            item.setAttribute("data-active", "false"); // Set initial data-active attribute
            header.addEventListener("click", () => {
                const isOpen = header.classList.toggle("open"); // Toggle 'open' class and get its new state
                // Close other accordion items in version 4
                accordionItemsV4.forEach((otherItem, otherIndex) => {
                    if (otherIndex !== index) { // Skip current item
                        const otherHeader = otherItem.querySelector(".accordion-headerV4");
                        const otherBody = otherItem.querySelector(".accordion-bodyV4");
                        otherHeader.classList.remove("open", "active");
                        otherBody.style.height = "0";
                        otherBody.style.marginBottom = "0";
                        otherItem.setAttribute("data-active", "false");
                    }
                });
                // Open/close current accordion item based on 'isOpen' state
                if (isOpen) {
                    body.style.height = body.scrollHeight + "px"; // Set body height to content height
                    header.classList.add("active");
                    item.setAttribute("data-active", "true");
                    body.style.marginBottom = "20px";
                } else {
                    body.style.height = "0";
                    header.classList.remove("active");
                    item.setAttribute("data-active", "false");
                    body.style.marginBottom = "0";
                }
            });
        });
        // Accordion version 5 logic (similar to version 1)
        accordionItemsV5.forEach(item => {
            const header = item.querySelector(".accordion-header"); // Header of the accordion item version 5
            header.addEventListener("click", () => {
                const isOpen = header.classList.contains("open"); // Check if header is already open
                // Close all accordion items in version 5
                accordionItemsV5.forEach(otherItem => {
                    const otherHeader = otherItem.querySelector(".accordion-header");
                    const otherBody = otherItem.querySelector(".accordion-body");
                    otherHeader.classList.remove("open", "active");
                    otherBody.style.height = "0";
                    otherItem.style.paddingBottom = "0";
                });
                // Open clicked accordion item if it was not already open
                if (!isOpen) {
                    header.classList.add("open", "active");
                    const body = item.querySelector(".accordion-body");
                    body.style.height = body.scrollHeight + "px"; // Set body height to content height
                    item.style.paddingBottom = "40px";
                }
            });
        });
    },
    /**
     * Initializes counter animation for the element with ID 'counter' and its child counters.
     */
    initCounter() {
        const counterSection = document.querySelector("#counter"); // Section containing counters
        if (counterSection) { // Check if the counter section exists
            const counters = document.querySelectorAll(".counter"); // All counter elements
            const observer = new IntersectionObserver(entries => {
                const [entry] = entries; // Get the first entry (as we are observing a single element)
                if (entry.isIntersecting) { // Check if the counter section is in viewport
                    counters.forEach((counter, index) => {
                        const updateCounter = () => {
                            const targetValue = +counter.getAttribute("data-value"); // Target count value from data attribute
                            let currentValue = +counter.innerText || 0;              // Current displayed count value
                            const increment = Math.ceil(targetValue / 100);         // Increment step for smooth animation
                            if (currentValue < targetValue) { // Continue animation until target value is reached
                                counter.innerText = Math.min(currentValue + increment, targetValue); // Update counter value
                                setTimeout(updateCounter, 20); // Call updateCounter again after a short delay
                            }
                        };
                        counter.innerText = "0"; // Reset counter to 0 initially
                        updateCounter();        // Start counter animation
                        const counterParent = counter.parentElement; // Parent element for opacity animation
                        counterParent.style.opacity = "0";
                        counterParent.style.transform = "translateY(20px)";
                        setTimeout(() => {
                            counterParent.style.transition = "all 0.7s ease"; // Add transition for smooth opacity and transform
                            counterParent.style.opacity = "1";
                            counterParent.style.transform = "translateY(0)";
                        }, 200 * index); // Stagger opacity animation for each counter
                    });
                    observer.unobserve(counterSection); // Stop observing after animation starts once
                }
            }, {
                threshold: 0.17 // Trigger when 17% of the counter section is visible
            });
            observer.observe(counterSection); // Start observing the counter section
        }
    },
    /**
     * Initializes team member tab functionality.
     */
    initTeam() {
        const teamTabs = document.querySelectorAll(".tab-member");       // All team member tab elements
        const teamDetails = document.querySelector(".our-team-details"); // Container for team member details
        let isTransitioning = false;                                  // Flag to prevent rapid tab switching during transition
        teamTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                if (!tab.classList.contains("tab-active") && !isTransitioning) { // Check if tab is not active and not transitioning
                    const activeTab = document.querySelector(".tab-active"); // Currently active tab
                    if (activeTab) {
                        activeTab.classList.remove("tab-active"); // Remove active class from previous tab
                    }
                    tab.classList.add("tab-active"); // Add active class to clicked tab
                    isTransitioning = true; // Set transitioning flag
                    teamDetails.classList.add("transitioning"); // Add transitioning class for CSS transition
                    setTimeout(() => {
                        // Get team member details from the clicked tab
                        const memberName = tab.querySelector("h3").textContent;
                        const memberDescription = tab.querySelector("p").textContent;
                        const memberImageSrc = tab.querySelector("img").src;
                        // Update team details section with new member information
                        teamDetails.querySelector("h2").textContent = memberName;
                        teamDetails.querySelector("p").textContent = memberDescription;
                        teamDetails.querySelector("img").src = memberImageSrc;
                        teamDetails.offsetWidth; // Trigger reflow to enable CSS transition
                        teamDetails.classList.remove("transitioning"); // Remove transitioning class after content update
                        setTimeout(() => {
                            isTransitioning = false; // Reset transitioning flag after transition completes
                        }, 400); // Timeout to match CSS transition duration
                    }, 300); // Timeout to allow transition to start before content change
                }
            });
        });
    }
};
/**
 * Handles menu functionality, including opening, closing, and dropdowns.
 */
const MenuHandler = {
    elements: {}, // Object to store menu related DOM elements
    timeline: null, // GSAP timeline for menu animations
    /**
     * Initializes menu handler by setting up elements, timeline, initial state, and event listeners.
     */
    init() {
        // Store relevant DOM elements
        this.elements = {
            menu: document.querySelector(".menu"),            // The main menu element
            overflow: document.querySelector(".menu-overflow"),   // Overflow element for menu background effect
            items: document.querySelectorAll(".menu-list"),    // List of menu items
            anchors: document.querySelectorAll(".menu-list-item"), // Menu list items
            dropdownAnchors: document.querySelectorAll(".menu-list-item-anchor"), // Anchors that trigger dropdowns
            openBtn: document.querySelector(".menu-open"),      // Button to open the menu
            closeBtn: document.querySelector(".menu-close")     // Button to close the menu
        };
        this.timeline = gsap.timeline({ paused: true, defaults: { ease: "custom", duration: 0.8 } }); // Create GSAP timeline for menu animations, paused initially
        gsap.registerEase("custom", function (progress) { // Define custom easing function
            return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        });
        this.setupInitialState(); // Set initial styles for menu elements (hidden, positioned off-screen)
        this.createTimeline();    // Define animations within the GSAP timeline
        this.bindEvents();       // Attach event listeners to menu buttons and dropdown anchors
    },
    /**
     * Sets initial styles for menu elements to prepare for animation.
     * Hides menu and overflow elements, positions them off-screen, and disables pointer events.
     */
    setupInitialState() {
        gsap.set(this.elements.menu, { pointerEvents: "none", autoAlpha: 0 });        // Hide menu and disable pointer events
        gsap.set(this.elements.overflow, { pointerEvents: "none", autoAlpha: 0, y: -30, rotate: -1, scale: 0.98 }); // Hide overflow, position off-screen, scale down
        gsap.set(this.elements.items, { autoAlpha: 0, y: -10, scale: 0.95 });        // Hide menu items, position off-screen, scale down
        gsap.set(this.elements.closeBtn, { autoAlpha: 0, y: -10, scale: 0.95 });       // Hide close button, position off-screen, scale down
    },
    /**
     * Creates GSAP timeline with animations for menu opening sequence.
     * Defines animations for menu, overflow, menu items, and buttons.
     */
    createTimeline() {
        const tl = this.timeline; // Get the GSAP timeline instance
        // Animate menu to fade in and enable pointer events
        tl.to(this.elements.menu, { autoAlpha: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" }, 0);
        // Animate overflow to fade in, move to position, rotate, and scale up
        tl.to(this.elements.overflow, { autoAlpha: 1, pointerEvents: "auto", y: 0, rotate: 0, scale: 1, duration: 0.6, ease: "custom" }, 0.1);
        // Animate menu items to fade in, move to position, and scale up with stagger effect
        tl.to(this.elements.items, { autoAlpha: 1, y: 0, scale: 1, stagger: { amount: 0.4, ease: "power2.out" }, duration: 0.7, ease: "custom" }, 0.2);
        // Animate close button to fade in, move to position, and scale up
        tl.to(this.elements.closeBtn, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 0.3);
        // Animate open button to fade out and move off-screen
        tl.to(this.elements.openBtn, { autoAlpha: 0, y: -10, scale: 0.95, duration: 0.5, delay: 0.3, ease: "back.out(1.7)" }, 0.1);
        // Disable body overflow and pointer events during menu opening (optional, might interfere with scrolling)
        tl.to("body", { overflow: "hidden", pointerEvents: "none", duration: 0.1 }, 0);
    },
    /**
     * Binds event listeners to menu open/close buttons and dropdown anchors.
     */
    bindEvents() {
        if (this.elements.openBtn) {
            this.elements.openBtn.addEventListener("click", () => this.open());   // Open menu on open button click
        }
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener("click", () => this.close());  // Close menu on close button click
        }
        this.elements.dropdownAnchors.forEach(anchor => {
            anchor.addEventListener("click", () => this.handleDropdownClick(anchor)); // Handle dropdown click for each dropdown anchor
        });
    },
    /**
     * Handles dropdown click event, toggling active class for dropdown on mobile, and activating only one on desktop.
     * @param {HTMLElement} anchor - The clicked dropdown anchor element.
     */
    handleDropdownClick(anchor) {
        if (window.screen.width >= 768) { // Desktop behavior: only one dropdown active at a time
            this.elements.dropdownAnchors.forEach(otherAnchor => {
                otherAnchor.classList.remove("active"); // Remove active class from all dropdown anchors
            });
            anchor.classList.add("active"); // Add active class to clicked dropdown anchor
        } else { // Mobile behavior: toggle active class on click
            anchor.classList.toggle("active"); // Toggle active class on clicked dropdown anchor
        }
    },
    /**
     * Opens the menu by playing the GSAP timeline forward and enabling menu pointer events.
     */
    open() {
        gsap.set(this.elements.overflow, { scale: 0.98 }); // Reset overflow scale before opening animation
        this.elements.openBtn.classList.add("opacity-0");   // Hide open button (using opacity class)
        this.timeline.timeScale(1).play();                   // Play timeline forward at normal speed
        this.elements.menu.style.pointerEvents = "auto";    // Enable pointer events for menu
    },
    /**
     * Closes the menu by reversing the GSAP timeline and disabling menu pointer events.
     */
    close() {
        this.elements.openBtn.classList.remove("opacity-1"); // Show open button (remove opacity class)
        gsap.to(this.elements.openBtn, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, delay: 0.5, ease: "back.out(1.7)" }); // Animate open button back in
        this.timeline.timeScale(1.2).reverse();              // Reverse timeline at 1.2x speed for faster closing
        this.elements.menu.style.pointerEvents = "none";     // Disable pointer events for menu during closing
    }
};
/**
 * Initializes Swiper sliders.
 */
function initializeSliders() {
    // Initialize Swiper for main slider with multiple breakpoints
    new Swiper(".swiper", {
        loop: true,                 // Enable infinite loop
        slidesPerView: 1,          // Default number of slides per view
        spaceBetween: 10,         // Default space between slides
        speed: 800,                // Slide transition speed
        allowTouchMove: true,       // Enable touch swiping
        navigation: {              // Navigation buttons
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        breakpoints: {             // Responsive breakpoints
            0: { slidesPerView: 1, spaceBetween: 10 },     // Mobile: 1 slide per view
            640: { slidesPerView: 2, spaceBetween: 20 },   // Small tablet: 2 slides per view
            1024: { slidesPerView: 2, spaceBetween: 30 },  // Large tablet: 2 slides per view
            1280: { slidesPerView: 4, spaceBetween: 24 }  // Desktop: 4 slides per view
        }
    });
    // Initialize Swiper for user testimonial slider
    new Swiper(".user-swiper", {
        loop: true,                 // Enable infinite loop
        slidesPerView: 1,          // 1 slide per view
        spaceBetween: 4,          // Space between slides
        speed: 1500,               // Slide transition speed
        allowTouchMove: true,       // Enable touch swiping
        navigation: {              // Navigation buttons
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
}
/**
 * Initializes various functionalities when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    initSmoothScrolling();      // Initialize smooth scrolling
    DarkMode.init();           // Initialize dark mode functionality
    MenuHandler.init();        // Initialize menu handler functionality
    Components.initCircleText();        // Initialize circle text component
    Components.initScrollingMarquee();   // Initialize scrolling marquee component
    Components.initFAQ();               // Initialize FAQ accordion component
    Components.initCounter();           // Initialize counter component
    Components.initTeam();              // Initialize team member tab component
    Animations.initHeroGradient();         // Initialize hero gradient animation
    Animations.initPointerAnimation();      // Initialize pointer animation
    Animations.initTextReveal();          // Initialize text reveal animation 1
    Animations.initTextReveal2();         // Initialize text reveal animation 2
    Animations.initHorizontalScroll();    // Initialize horizontal scroll animation
    Animations.initImageHorizontalScroll(); // Initialize image horizontal scroll animation
    Animations.initCtaImageReveal();        // Initialize CTA image reveal animation
    Animations.initSectionTitles();       // Initialize section title animation 1
    Animations.initSectionTitles2();      // Initialize section title animation 2
    Animations.initRevealElements();      // Initialize general reveal elements animation
    Animations.initZoomAnimation();         // Initialize zoom image animation
    Animations.initVideoAnimation();        // Initialize video scale animation
    Animations.initScaleSmallAnimation();   // Initialize small scale image animation 1
    Animations.initScaleSmallAnimation2();  // Initialize small scale image animation 2
    initializeSliders();         // Initialize Swiper sliders
});
/**
 * Price toggle functionality for monthly/yearly billing.
 */
const toggleSwitch = document.getElementById("toggle");         // Toggle switch element
const monthlyOptionElement = document.getElementById("monthlyOption");  // Monthly option label
const yearlyOptionElement = document.getElementById("yearlyOption");   // Yearly option label
let isYearlyBilling = false;                                 // Flag to track billing cycle (initially monthly)
const monthlyChargeElement = document.getElementById("monthlyCharge"); // Element displaying monthly charge
const yearlyChargeElement = document.getElementById("yearlyCharge");  // Element displaying yearly charge
// Set initial state: monthly option active
if (toggleSwitch) {
    monthlyOptionElement.classList.add("active"); // Initially select monthly option
    // Event listener for toggle switch click
    toggleSwitch.addEventListener("click", () => {
        isYearlyBilling = !isYearlyBilling; // Toggle billing cycle flag
        toggleSwitch.classList.toggle("yearly");          // Toggle 'yearly' class on toggle switch for styling
        monthlyOptionElement.classList.toggle("active");   // Toggle 'active' class on monthly option label
        yearlyOptionElement.classList.toggle("active");    // Toggle 'active' class on yearly option label
        // Show/hide monthly and yearly charges based on billing cycle
        if (isYearlyBilling) {
            monthlyChargeElement.style.display = "none";
            yearlyChargeElement.style.display = "block";
        } else {
            monthlyChargeElement.style.display = "block";
            yearlyChargeElement.style.display = "none";
        }
    });
}
/**
 * Skew marquee animation initialization.
 */
const skewMarqueeElement = document.getElementById("skew-Marquee"); // Skew marquee element
// Initialize skew marquee animation if the element exists
if (skewMarqueeElement) {
    gsap.from(skewMarqueeElement, {
        scrollTrigger: {
            trigger: skewMarqueeElement, // Element that triggers the animation
            start: "top 80%",          // Animation starts when the top of the element is 80% from the top of the viewport
            end: "top 50%",          // Animation ends when the top of the element is 50% from the top of the viewport
            scrub: false              // No scrub, animation plays once on scroll
        },
        y: 200,                  // Initial vertical position (moved down)
        skewX: "0deg",             // Initial X skew
        skewY: "0deg",             // Initial Y skew
        rotation: 0,             // Initial rotation
        duration: 3               // Animation duration
    });
}
/**
 * CTA inline slider animation.
 */
document.addEventListener("DOMContentLoaded", function () {
    const ctaInlineSlider = document.querySelector(".cta-inline-slider"); // CTA inline slider element
    let slideIndex = 0;                                            // Current slide index
    // Set interval to change slides every 3 seconds
    setInterval(function () {
        slideIndex = (slideIndex + 1) % 3; // Increment slide index, loop back to 0 after 2
        if (ctaInlineSlider) {
            ctaInlineSlider.style.transform = `translateY(-${100 * slideIndex}px)`; // Translate slider to show next slide
        }
    }, 3000); // 3000 milliseconds = 3 seconds
});
/**
 * Header headroom.js initialization for sticky header behavior.
 */
const headerElement = document.getElementById("header"); // Header element
// Initialize Headroom.js for the header if the element exists
if (headerElement) {
    const headroom = new Headroom(headerElement); // Create new Headroom instance
    headroom.init();                             // Initialize Headroom
}
/**
 * Infinite marquee initializations using InfiniteMarquee library.
 */
new InfiniteMarquee({
    element: ".marquee-container",      // Selector for the first marquee container
    speed: 120000,                   // Speed of the marquee (pixels per second, adjust as needed)
    smoothEdges: true,               // Enable smooth edges for better visual appearance
    direction: "left",               // Marquee direction (left to right)
    pauseOnHover: true,             // Pause marquee on mouse hover
    gap: "30px",                     // Gap between duplicated content
    duplicateCount: 1,              // Number of times to duplicate content (1 for seamless loop)
    mobileSettings: {                // Mobile-specific settings
        direction: "top",            // Change direction to vertical on mobile
        speed: 150000               // Adjust speed for mobile
    },
    on: {                           // Event handlers
        beforeInit: () => { console.log("Not Yet Initialized"); }, // Log before initialization
        afterInit: () => { console.log("Initialized"); }       // Log after initialization
    }
});
new InfiniteMarquee({
    element: ".marquee-reverse-container", // Selector for the second marquee container
    speed: 120000,                   // Speed of the marquee
    smoothEdges: true,               // Enable smooth edges
    direction: "right",              // Marquee direction (right to left)
    pauseOnHover: true,              // Pause on hover
    gap: "30px",                     // Gap between duplicated content
    duplicateCount: 1,               // Duplicate count
    mobileSettings: {                // Mobile settings
        direction: "right",          // Vertical direction for mobile
        speed: 150000                // Mobile speed
    },
    on: {                            // Event handlers
        beforeInit: () => { console.log("Not Yet Initialized"); }, // Log before initialization
        afterInit: () => { console.log("Initialized"); }       // Log after initialization
    }
});