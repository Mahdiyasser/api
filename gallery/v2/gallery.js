/*
 * Vetrom Gallery V2 – The Ultimate Media Carousel API
 * By Mahdi Yasser
 *
 * ============================================================================
 * WHAT'S NEW IN V2
 * ============================================================================
 * 
 * ✨ FULL VIDEO SUPPORT IN LIGHTBOX
 *    - Videos now work perfectly in the lightbox with native controls
 *    - Auto-pause when switching slides
 *    - Smooth transitions between images and videos
 * 
 * 🎨 NEW CLASS FORMAT
 *    - Old: class="vetrom-gallery:1"
 *    - New: class="vetrom-gallery-{theme}-{color}" id="unique-id"
 *    - Themes: auto, dark, light
 *    - Colors: Named (red, blue), Hex (#FF5733), RGB, RGBA
 * 
 * 🔄 RTL SUPPORT
 *    - Automatically detects RTL direction
 *    - Flips navigation for Arabic/Hebrew layouts
 *    - Works in lightbox and carousel
 * 
 * ⚡ REAL-TIME DOM WATCHING
 *    - Uses MutationObserver for 24/7 monitoring
 *    - Galleries added after page load automatically initialize
 *    - No more manual re-initialization needed
 * 
 * 🎯 IMPROVED BACKGROUND DETECTION
 *    - Better algorithm for detecting page background
 *    - Smarter contrast calculation
 *    - Respects parent container backgrounds
 *
 * ============================================================================
 * HOW TO USE
 * ============================================================================
 *
 * 1. INCLUDE THE SCRIPT
 * ---------------------
 * Add this to your <head> or <body>:
 * <script src="https://api.mahdiyasser.site/gallery/v2/gallery.js"></script>
 *
 * 2. BASIC USAGE (Auto Theme)
 * ----------------------------
 * <div class="vetrom-gallery-auto" id="my-gallery">
 *     <img src="photo1.jpg" alt="Photo 1">
 *     <img src="photo2.png" alt="Photo 2">
 *     <video src="video.mp4"></video>
 * </div>
 *
 * 3. DARK THEME WITH COLOR
 * -------------------------
 * <div class="vetrom-gallery-dark-blue" id="gallery2">
 *     <img src="image.jpg">
 *     <video src="clip.mp4"></video>
 * </div>
 *
 * 4. LIGHT THEME WITH HEX COLOR
 * ------------------------------
 * <div class="vetrom-gallery-light-#FF5733" id="gallery3">
 *     <img src="img1.jpg">
 *     <img src="img2.jpg">
 * </div>
 *
 * 5. AUTO THEME WITH RGB COLOR
 * -----------------------------
 * <div class="vetrom-gallery-auto-rgb(255,87,51)" id="gallery4">
 *     <video src="video1.mp4"></video>
 *     <video src="video2.mp4"></video>
 * </div>
 *
 * 6. RTL SUPPORT (Arabic/Hebrew)
 * -------------------------------
 * <div dir="rtl">
 *     <div class="vetrom-gallery-auto-green" id="gallery-rtl">
 *         <img src="photo.jpg">
 *         <video src="video.mp4"></video>
 *     </div>
 * </div>
 *
 * 7. WITH VETROM PLAYER
 * ----------------------
 * Include player.js first:
 * <script src="https://api.mahdiyasser.site/player/v2/player.js"></script>
 * 
 * <div class="vetrom-gallery-auto-purple" id="gallery-player">
 *     <img src="image.jpg">
 *     <video src="video.mp4" class="vetrom-media-auto-purple"></video>
 * </div>
 *
 * ============================================================================
 * CLASS FORMAT REFERENCE
 * ============================================================================
 *
 * Pattern: vetrom-gallery-{THEME}-{COLOR}
 *
 * THEME OPTIONS:
 * - auto   : Auto-detects from page background (recommended)
 * - dark   : Forces dark theme
 * - light  : Forces light theme
 *
 * COLOR OPTIONS (Optional):
 * - Named: red, blue, green, purple, orange, pink, cyan, yellow, etc.
 * - Hex: #FF5733, #3498db, #e74c3c
 * - RGB: rgb(255,87,51)
 * - RGBA: rgba(52,152,219,0.8)
 *
 * EXAMPLES:
 * - vetrom-gallery-auto                    (auto theme, auto color)
 * - vetrom-gallery-dark-red                (dark theme, red accent)
 * - vetrom-gallery-light-#3498db           (light theme, custom hex)
 * - vetrom-gallery-auto-rgb(255,87,51)     (auto theme, RGB color)
 * - vetrom-gallery-dark-rgba(52,152,219,0.8) (dark theme, RGBA)
 *
 * ============================================================================
 * IMPORTANT NOTES
 * ============================================================================
 *
 * ✓ Always give each gallery a unique ID attribute
 * ✓ Videos in lightbox have native HTML5 controls
 * ✓ Videos auto-pause when switching slides
 * ✓ RTL detection is automatic from parent elements
 * ✓ Dynamic galleries initialize automatically (MutationObserver)
 * ✓ Clicking images opens lightbox, videos can be clicked too
 * ✓ Keyboard navigation in lightbox: Arrow keys + Escape
 * ✓ Right-click protection on media (images and videos)
 *
 * ============================================================================
 * LICENSE
 * ============================================================================
 *
 * 📄 MIT License
 * Copyright (c) 2025 Mahdi Yasser
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // ========================================================================
    // CONSTANTS & SVG ICONS
    // ========================================================================
    
    const SVG_PREV = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 22L4 12L16 2L18 4L8 12L18 20L16 22Z"/></svg>`;
    const SVG_NEXT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 22L20 12L8 2L6 4L16 12L6 20L8 22Z"/></svg>`;
    const MEDIA_TYPE = { IMAGE: 'img', VIDEO: 'video' };
    
    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    /**
     * Parse color string (hex, rgb, rgba, named) to RGB object
     */
    function parseColor(color) {
        let r = 0, g = 0, b = 0;

        // Hex format
        if (color.startsWith('#')) {
            const hex = color.length === 4 
                ? color.slice(1).split('').map(c => c + c).join('') 
                : color.slice(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } 
        // RGB/RGBA format
        else if (color.startsWith('rgb')) {
            const matches = color.match(/\d+/g);
            if (matches && matches.length >= 3) {
                r = parseInt(matches[0]);
                g = parseInt(matches[1]);
                b = parseInt(matches[2]);
            }
        }
        // Named colors - convert via temporary element
        else {
            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);
            const computed = getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return parseColor(computed);
        }
        
        return {r, g, b};
    }

    /**
     * Calculate luminance for contrast determination
     */
    function getLuminance({r, g, b}) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    /**
     * Convert RGB object to string format
     */
    function rgbToRgbString({r, g, b}) {
        return `${r}, ${g}, ${b}`;
    }

    /**
     * Check if element is a video
     */
    function isVideoElement(element) {
        return element.tagName === 'VIDEO';
    }

    /**
     * Detect RTL direction from element or ancestors
     */
    function isRTL(element) {
        let el = element;
        while (el) {
            const dir = el.getAttribute('dir') || getComputedStyle(el).direction;
            if (dir === 'rtl') return true;
            if (dir === 'ltr') return false;
            el = el.parentElement;
        }
        return false;
    }

    /**
     * Get background color of element, checking ancestors if transparent
     */
    function getEffectiveBackgroundColor(element) {
        let el = element;
        let maxDepth = 10;
        let depth = 0;

        while (el && depth < maxDepth) {
            const bgColor = getComputedStyle(el).backgroundColor;
            
            // Check if not transparent
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                return bgColor;
            }
            
            el = el.parentElement;
            depth++;
        }
        
        // Fallback to body background
        return getComputedStyle(document.body).backgroundColor || '#ffffff';
    }

// ========================================================================
    // CSS STYLES
    // ========================================================================

    const css = `
        :root {
            --vetrom-bg: #ffffff; 
            --vetrom-text: #000000;
            --vetrom-accent: rgba(0, 0, 0, 0.5);
            --vetrom-text-rgb: 0, 0, 0; 
            --vetrom-lightbox-icon-color: #ffffff; 
        }
        
        .vetrom-gallery-container {
            position: relative;
            max-width: 100%;
            padding-bottom: 50.625%; 
            height: 0;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
        }
        
        .vetrom-gallery-image-wrapper {
            position: absolute; 
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            transition: transform 0.3s ease-in-out;
            cursor: pointer;
        }
        
        /* RTL Support */
        .vetrom-gallery-container[dir="rtl"] .vetrom-gallery-image-wrapper {
            direction:rtl;
        }

        /* RTL: Swap button positions */
        .vetrom-gallery-container[dir="rtl"] .vetrom-gallery-control.prev {
            left: auto;
            right: 10px;
            transform: rotate(180deg);
        }
        
        .vetrom-gallery-container[dir="rtl"] .vetrom-gallery-control.next {
            right: auto;
            left: 10px;
            transform: rotate(180deg);
        }
        
        .vetrom-gallery-slide {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            user-select: none;
            display: flex; 
            align-items: center;
            justify-content: center;
            background-color: var(--vetrom-bg); 
        }
        
        .vetrom-gallery-slide img,
        .vetrom-gallery-slide video { 
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            object-fit: contain; 
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none; 
            -moz-user-select: none; 
            -ms-user-select: none; 
            user-select: none;
        }
        
        .vetrom-gallery-slide video {
            cursor: pointer; 
        }
        
        .vetrom-gallery-control {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: var(--vetrom-accent); 
            color: var(--vetrom-text);
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 10;
            user-select: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        
        .vetrom-gallery-control svg {
            width: 32px; 
            height: 32px;
        }
        
        .vetrom-gallery-control:hover {
            background: rgba(var(--vetrom-text-rgb), 0.7); 
        }
        
        .vetrom-gallery-control.prev {
            left: 10px;
        }
        
        .vetrom-gallery-control.next {
            right: 10px;
        }
        
        
        /* Lightbox Styles */
        .vetrom-lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
            opacity: 0;
        }
        
        .vetrom-lightbox-overlay.active {
            display: flex;
            opacity: 1;
        }
        
        .vetrom-lightbox-content {
            position: relative;
            max-width: calc(100vw - 80px);
            max-height: calc(100vh - 80px);
            width: 100%; 
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .vetrom-lightbox-image,
        .vetrom-lightbox-video {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            display: block;
            object-fit: contain; 
            user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none; 
            -moz-user-select: none; 
            -ms-user-select: none; 
            user-select: none;
            border-radius: 4px;
        }
        
        .vetrom-lightbox-video {
            background: #000;
        }
        
        .vetrom-lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: var(--vetrom-lightbox-icon-color); 
            font-size: 40px;
            font-weight: bold;
            transition: 0.2s;
            cursor: pointer;
            z-index: 10000;
            user-select: none;
            background: var(--vetrom-accent); 
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        
        .vetrom-lightbox-close:hover,
        .vetrom-lightbox-close:focus {
            color: #ccc; 
        }
        
        .vetrom-lightbox-control {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: var(--vetrom-lightbox-icon-color);
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 10000;
            user-select: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--vetrom-accent);
            transition: background 0.2s;
        }
        
        .vetrom-lightbox-control svg {
            width: 40px;
            height: 40px;
        }
        
        .vetrom-lightbox-control:hover {
            background: rgba(var(--vetrom-text-rgb), 0.7);
        }
        
        .vetrom-lightbox-control.prev {
            left: 20px;
        }
        
        .vetrom-lightbox-control.next {
            right: 20px;
        }
    `;

    // Inject CSS into page
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ========================================================================
    // THEME SYSTEM
    // ========================================================================

    /**
     * Parse gallery class name to extract theme and color
     * Format: vetrom-gallery-{theme}-{color}
     */
    function parseGalleryClass(classList) {
        const classArray = Array.from(classList);
        const regex = /^vetrom-gallery-(auto|dark|light)(?:-(.+))?$/;
        
        for (let className of classArray) {
            const match = className.match(regex);
            if (match) {
                return {
                    theme: match[1],  // auto, dark, or light
                    color: match[2] || null  // color string or null
                };
            }
        }
        
        return null;
    }

    /**
     * Apply theme to a specific gallery container
     */
    function applyGalleryTheme(container, rootElement) {
        const parsed = parseGalleryClass(rootElement.classList);
        if (!parsed) return;

        const { theme, color } = parsed;
        
        let bgColor, textColor, textRgb, accentColor;

        // Determine base theme colors
        if (theme === 'dark') {
            bgColor = '#1a1a1a';
            textColor = '#ffffff';
            textRgb = '255, 255, 255';
        } else if (theme === 'light') {
            bgColor = '#ffffff';
            textColor = '#000000';
            textRgb = '0, 0, 0';
        } else { // auto
            const effectiveBg = getEffectiveBackgroundColor(rootElement);
            const parsed = parseColor(effectiveBg);
            const luminance = getLuminance(parsed);
            const isDark = luminance < 0.5;
            
            bgColor = effectiveBg;
            textColor = isDark ? '#ffffff' : '#000000';
            textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
        }

        // Apply custom accent color if provided
        if (color) {
            const accentRgb = parseColor(color);
            accentColor = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.6)`;
        } else {
            accentColor = `rgba(${textRgb}, 0.5)`;
        }

        // Apply CSS variables to container
        container.style.setProperty('--vetrom-bg', bgColor);
        container.style.setProperty('--vetrom-text', textColor);
        container.style.setProperty('--vetrom-text-rgb', textRgb);
        container.style.setProperty('--vetrom-accent', accentColor);
        container.style.setProperty('--vetrom-lightbox-icon-color', textColor);
    }

// ========================================================================
    // GALLERY STATE MANAGEMENT
    // ========================================================================

    const galleries = [];
    let currentLightboxGalleryIndex = -1;
    let currentLightboxSlideIndex = -1;

    /**
     * Initialize a single gallery
     */
    function initGallery(rootDiv, galleryIndex) {
        const mediaElements = Array.from(rootDiv.querySelectorAll('img, video'));
        if (mediaElements.length === 0) return;

        // Detect RTL
        const isRTLMode = isRTL(rootDiv);

        if (isRTLMode) {
        mediaElements.reverse();
        }

        // Update slide position
        const updateSlide = (slideIndex) => {
            const wrapper = galleries[galleryIndex].root.querySelector('.vetrom-gallery-image-wrapper');
            if (!wrapper) return;

            const offset = isRTLMode ? slideIndex * 100 : -slideIndex * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            
            // Pause all videos except current
            wrapper.querySelectorAll('video').forEach((video, index) => {
                if (index !== slideIndex) {
                    video.pause();
                }
            });
        };

        // Store gallery state
        const galleryState = {
            root: rootDiv,
            items: mediaElements.map(media => ({
                src: isVideoElement(media) 
                    ? (media.querySelector('source') ? media.querySelector('source').src : media.src)
                    : media.src,
                type: isVideoElement(media) ? MEDIA_TYPE.VIDEO : MEDIA_TYPE.IMAGE,
                originalElement: media.cloneNode(true)
            })),
            currentSlide: 0,
            index: galleryIndex,
            isRTL: isRTLMode,
            updateSlide: updateSlide 
        };
        galleries.push(galleryState);

        // Create container structure
        const container = document.createElement('div');
        container.className = 'vetrom-gallery-container';
        if (isRTLMode) {
            container.setAttribute('dir', 'rtl');
        }

        // Apply theme
        applyGalleryTheme(container, rootDiv);

        // Create slides wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'vetrom-gallery-image-wrapper';
        
        // Create slides
        mediaElements.forEach((media, i) => {
            const slide = document.createElement('div');
            slide.className = 'vetrom-gallery-slide';
            
            const mediaClone = media.cloneNode(true);
            
            // Click handler for lightbox
            slide.addEventListener('click', (e) => {
                // Allow video controls to work
                if (isVideoElement(e.target)) {
                    const rect = e.target.getBoundingClientRect();
                    const clickY = e.clientY - rect.top;
                    const controlsHeight = 50; // Approximate controls height
                    
                    // If clicking in controls area, let native controls handle it
                    if (clickY > rect.height - controlsHeight) {
                        return;
                    } else {
                        // FIX: Prevent the video from playing/toggling when opening lightbox
                        e.preventDefault();
                        e.target.pause();
                    }
                }
                
                openLightbox(galleryIndex, i);
            });
            
            slide.appendChild(mediaClone);
            media.remove();
            wrapper.appendChild(slide);
        });
        
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'vetrom-gallery-control prev';
        prevButton.innerHTML = SVG_PREV;
        prevButton.setAttribute('aria-label', 'Previous slide');

        const nextButton = document.createElement('button');
        nextButton.className = 'vetrom-gallery-control next';
        nextButton.innerHTML = SVG_NEXT;
        nextButton.setAttribute('aria-label', 'Next slide');

        // Navigation handlers
        const prevSlide = (e) => {
            e.stopPropagation();
            galleryState.currentSlide = (galleryState.currentSlide - 1 + galleryState.items.length) % galleryState.items.length;
            galleryState.updateSlide(galleryState.currentSlide);
        };

        const nextSlide = (e) => {
            e.stopPropagation();
            galleryState.currentSlide = (galleryState.currentSlide + 1) % galleryState.items.length;
            galleryState.updateSlide(galleryState.currentSlide);
        };

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        // Assemble container
        container.appendChild(wrapper);
        container.appendChild(prevButton);
        container.appendChild(nextButton);

        // Replace original div with container
        rootDiv.parentNode.replaceChild(container, rootDiv);
        galleryState.root = container;
    }

    // ========================================================================
    // LIGHTBOX FUNCTIONALITY
    // ========================================================================

    // Lightbox elements (will be created when needed)
    let lightboxOverlay = null;
    let lightboxContent = null;
    let closeButton = null;
    let lightboxPrev = null;
    let lightboxNext = null;

    /**
     * Create lightbox elements if they don't exist
     */
    function ensureLightboxExists() {
        if (lightboxOverlay) return; // Already created

        // Create lightbox overlay
        lightboxOverlay = document.createElement('div');
        lightboxOverlay.className = 'vetrom-lightbox-overlay';

        lightboxContent = document.createElement('div');
        lightboxContent.className = 'vetrom-lightbox-content';
        lightboxOverlay.appendChild(lightboxContent);

        // Close button
        closeButton = document.createElement('span');
        closeButton.className = 'vetrom-lightbox-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close lightbox');
        lightboxOverlay.appendChild(closeButton);

        // Navigation buttons
        lightboxPrev = document.createElement('button');
        lightboxPrev.className = 'vetrom-lightbox-control prev';
        lightboxPrev.innerHTML = SVG_PREV;
        lightboxPrev.setAttribute('aria-label', 'Previous');
        lightboxOverlay.appendChild(lightboxPrev);

        lightboxNext = document.createElement('button');
        lightboxNext.className = 'vetrom-lightbox-control next';
        lightboxNext.innerHTML = SVG_NEXT;
        lightboxNext.setAttribute('aria-label', 'Next');
        lightboxOverlay.appendChild(lightboxNext);

        document.body.appendChild(lightboxOverlay);

        // Set up event listeners
        setupLightboxEvents();
    }

    /**
     * Update lightbox content with current media
     */
    const updateLightboxImage = () => {
        if (currentLightboxGalleryIndex === -1) return;
        
        const gallery = galleries[currentLightboxGalleryIndex];
        const currentItem = gallery.items[currentLightboxSlideIndex];

        // Clear previous content
        lightboxContent.innerHTML = ''; 

        if (currentItem.type === MEDIA_TYPE.IMAGE) {
            // Display image
            const img = document.createElement('img');
            img.className = 'vetrom-lightbox-image';
            img.src = currentItem.src;
            img.alt = currentItem.originalElement.alt || 'Gallery image';
            lightboxContent.appendChild(img);
        } else if (currentItem.type === MEDIA_TYPE.VIDEO) {
            // Clone the original video element completely
            const videoClone = currentItem.originalElement.cloneNode(true);
            videoClone.className = (videoClone.className || '') + ' vetrom-lightbox-video';
            
            lightboxContent.appendChild(videoClone);
        }
        
        // Show navigation buttons
        lightboxPrev.style.display = 'flex';
        lightboxNext.style.display = 'flex';
    };

    /**
     * Navigate to next slide in lightbox
     */
    const nextLightboxSlide = () => {
        const gallery = galleries[currentLightboxGalleryIndex];
        
        // Pause current video if playing
        const currentVideo = lightboxContent.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }
        
        currentLightboxSlideIndex = (currentLightboxSlideIndex + 1) % gallery.items.length;
        updateLightboxImage();
    };

    /**
     * Navigate to previous slide in lightbox
     */
    const prevLightboxSlide = () => {
        const gallery = galleries[currentLightboxGalleryIndex];
        
        // Pause current video if playing
        const currentVideo = lightboxContent.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }
        
        currentLightboxSlideIndex = (currentLightboxSlideIndex - 1 + gallery.items.length) % gallery.items.length;
        updateLightboxImage();
    };

    /**
     * Open lightbox at specific slide
     */
    const openLightbox = (galleryIndex, slideIndex) => {
        ensureLightboxExists(); // Make sure lightbox exists
        currentLightboxGalleryIndex = galleryIndex;
        currentLightboxSlideIndex = slideIndex;
        updateLightboxImage();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close lightbox
     */
    const closeLightbox = () => {
        if (!lightboxOverlay) return;
        
        // Pause any playing video
        const video = lightboxContent.querySelector('video');
        if (video) {
            video.pause();
        }
        
        // Sync carousel with lightbox position
        if (currentLightboxGalleryIndex !== -1) {
            const gallery = galleries[currentLightboxGalleryIndex];
            gallery.currentSlide = currentLightboxSlideIndex;
            gallery.updateSlide(gallery.currentSlide); 
        }
        
        lightboxOverlay.classList.remove('active');
        currentLightboxGalleryIndex = -1;
        currentLightboxSlideIndex = -1;
        document.body.style.overflow = '';
    };

    /**
     * Set up lightbox event listeners (called once when lightbox is created)
     */
    function setupLightboxEvents() {
        // Lightbox event listeners
        closeButton.addEventListener('click', closeLightbox);
        
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation(); 
            prevLightboxSlide();
        });
        
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation(); 
            nextLightboxSlide();
        });

        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation (global, always active)
    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                nextLightboxSlide();
            }
            if (e.key === 'ArrowLeft') {
                prevLightboxSlide();
            }
            if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Prevent right-click on media
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
            const isGalleryMedia = e.target.closest('.vetrom-gallery-slide');
            const isLightboxMedia = e.target.classList.contains('vetrom-lightbox-image') || 
                                    e.target.classList.contains('vetrom-lightbox-video');

            if (isGalleryMedia || isLightboxMedia) {
                e.preventDefault();
            }
        }
    });

// ========================================================================
    // DOM SCANNING & INITIALIZATION
    // ========================================================================

    /**
     * Scan document for gallery elements and initialize them
     */
    function scanAndInitGalleries() {
        const regex = /^vetrom-gallery-(auto|dark|light)(?:-(.+))?$/;
        
        document.querySelectorAll('div').forEach((div) => {
            // Skip if already initialized
            if (div.classList.contains('vetrom-gallery-container')) {
                return;
            }

            // Check if div has valid gallery class
            const classList = Array.from(div.classList);
            const hasGalleryClass = classList.some(cls => regex.test(cls));
            
            if (hasGalleryClass) {
                initGallery(div, galleries.length);
            }
        });
    }

    // ========================================================================
    // MUTATION OBSERVER - 24/7 DOM WATCHING
    // ========================================================================

    /**
     * Set up MutationObserver to watch for dynamically added galleries
     */
    function setupDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;

            for (let mutation of mutations) {
                // Check added nodes
                if (mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        // Check if it's an element node
                        if (node.nodeType === 1) {
                            const regex = /^vetrom-gallery-(auto|dark|light)(?:-(.+))?$/;
                            
                            // Check the node itself
                            if (node.classList) {
                                const classList = Array.from(node.classList);
                                if (classList.some(cls => regex.test(cls))) {
                                    shouldScan = true;
                                    break;
                                }
                            }
                            
                            // Check descendants
                            if (node.querySelectorAll) {
                                const galleries = node.querySelectorAll('div');
                                for (let gallery of galleries) {
                                    const classList = Array.from(gallery.classList);
                                    if (classList.some(cls => regex.test(cls))) {
                                        shouldScan = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (shouldScan) break;
            }

            // Scan for new galleries if DOM changed
            if (shouldScan) {
                scanAndInitGalleries();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,      // Watch for added/removed children
            subtree: true,        // Watch all descendants
            attributes: false,    // Don't watch attribute changes
            characterData: false  // Don't watch text changes
        });

        return observer;
    }

    // ========================================================================
    // INITIALIZATION SEQUENCE
    // ========================================================================

    /**
     * Initialize on DOMContentLoaded
     */
    document.addEventListener('DOMContentLoaded', () => {
        // Initial scan for galleries
        scanAndInitGalleries();
        
        // Set up continuous DOM watching
        setupDOMObserver();
    });

    /**
     * Fallback: Initialize immediately if DOM already loaded
     */
    if (document.readyState === 'loading') {
        // DOM is still loading, DOMContentLoaded will fire
    } else {
        // DOM already loaded, run immediately
        scanAndInitGalleries();
        setupDOMObserver();
    }

    // ========================================================================
    // PUBLIC API 
    // ========================================================================

    /**
     * Expose public API for manual control if needed
     */
    window.VetromGallery = {
        version: '2.0.0',
        
        /**
         * Manually scan and initialize galleries
         */
        refresh: function() {
            scanAndInitGalleries();
        },
        
        /**
         * Get all initialized galleries
         */
        getGalleries: function() {
            return galleries.map(g => ({
                index: g.index,
                currentSlide: g.currentSlide,
                totalSlides: g.items.length,
                isRTL: g.isRTL
            }));
        },
        
        /**
         * Navigate to specific slide in a gallery
         */
        goToSlide: function(galleryIndex, slideIndex) {
            if (galleryIndex >= 0 && galleryIndex < galleries.length) {
                const gallery = galleries[galleryIndex];
                if (slideIndex >= 0 && slideIndex < gallery.items.length) {
                    gallery.currentSlide = slideIndex;
                    gallery.updateSlide(slideIndex);
                }
            }
        },
        
        /**
         * Open lightbox for specific gallery and slide
         */
        openLightbox: function(galleryIndex, slideIndex) {
            if (galleryIndex >= 0 && galleryIndex < galleries.length) {
                const gallery = galleries[galleryIndex];
                if (slideIndex >= 0 && slideIndex < gallery.items.length) {
                    openLightbox(galleryIndex, slideIndex);
                }
            }
        },
        
        /**
         * Close lightbox
         */
        closeLightbox: function() {
            closeLightbox();
        }
    };

    // Console info
    console.log('%c Vetrom Gallery V2 ', 'background: #007bff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    console.log('✓ Loaded successfully');
    console.log('✓ DOM Observer active');
    console.log('✓ RTL support enabled');
    console.log('✓ Video lightbox support enabled');
    console.log('API: window.VetromGallery');

})();
