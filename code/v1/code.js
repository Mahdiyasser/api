/*
 * Vetrom Code Engine V1 — The Ultimate Syntax Display API
 * By Mahdi Yasser
 *
 * --- 🚀 INSTALLATION ---
 * Add this script to your <head> or <body>. It self-initializes immediately.
 * <script src="https://api.mahdiyasser.site/code/v1/code.js"></script>
 *
 * --- 📖 HOW TO USE ---
 *
 * 1. Basic Structure
 * ------------------
 * Wrap your standard <pre><code> blocks in a wrapper <div>.
 * REQUIRED: Add the class "vetrom-codeblock" to the wrapper.
 * REQUIRED: Add a configuration ID to the wrapper to set the theme/behavior.
 *
 * HTML Structure:
 * <div class="vetrom-codeblock" id="[CONFIG-STRING]">
 * <pre><code> console.log("Hello World"); </code></pre>
 * </div>
 *
 * --- ⚙️ CONFIGURATION (The ID API) ---
 *
 * The engine parses the wrapper's ID by splitting it by dashes (-).
 * Order does not strictly matter, but readability is recommended.
 *
 * A. Color Syntax (Backgrounds)
 * * Hex: Use underscore (_) instead of hash (#). Example: _ff0000
 * * RGB/RGBA: standard syntax. Example: rgb(0,0,0)
 * * Names: Standard CSS names. Example: blue, red, slate
 *
 * -> The FIRST color found in the ID becomes the MAIN background.
 * -> The SECOND color found (if 'hover' is enabled) becomes the HOVER background.
 *
 * B. Keywords (Behavior)
 * * copy       : Adds a permanent "COPY" button to the top right.
 * * hovercopy  : Adds a "COPY" button that only appears when hovering the block.
 * * hover      : Enables background color transition (requires a second color in the ID).
 * C. Best Practice
 * SCHEMA: [main_color]-[copy/hovercopy]-[hover]-[hover_color]
 * EXAMPLE: id="_1e293b-hovercopy-hover-blue"
 *
 * --- ✨ SMART AUTOMATION (Built-in Features) ---
 *
 * 1. Auto-Contrast (HSP Algorithm):
 * You do NOT set text colors. The engine calculates the perceived brightness
 * of your background and automatically assigns High-Contrast Dark (#0f172a)
 * or Off-White (#f8fafc) text to ensure readability.
 *
 * 2. Anti-Glare / Eye Safety:
 * If a background is detected as too bright (HSP > 225), the engine automatically
 * adds slight transparency (opacity 0.88) to soften the glare.
 *
 * 3. Dynamic DOM Support:
 * Uses MutationObserver. New code blocks added via JavaScript (React, Vue, AJAX)
 * are detected and styled automatically without re-initialization.
 *
 * --- 💡 EXAMPLES ---
 *
 * 1. Simple Dark Theme:
 * id="_1e293b"
 * (Result: Dark Blue background, White text)
 *
 * 2. Copy Button + Hex Color:
 * id="copy-_222"
 * (Result: Dark Gray background, Permanent Copy Button)
 *
 * 3. Interactive Hover Effect:
 * id="hovercopy-white-hover-_e2e8f0"
 * (Result: White background -> Gray on hover. Button appears on hover.
 * Text automatically switches to Dark for readability.)
 *
 * ---
 *
 * 📄 MIT License
 * * Copyright (c) 2025 Mahdi Yasser
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
 */

(function() {
    const CSS = `
        .vetrom-codeblock { 
            position: relative; margin: 2rem 0; padding: 2rem; 
            border-radius: 12px; overflow: hidden; 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%; box-sizing: border-box;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
            font-family: 'Fira Code', 'Consolas', monospace;
        }
        .vetrom-codeblock pre { margin: 0; padding: 0; background: transparent; overflow-x: auto; }
        .vetrom-codeblock code { font-family: inherit; background: transparent; }
        
        .vetrom-copy-btn {
            position: absolute; top: 1rem; right: 1rem; padding: 8px 16px;
            background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 700;
            backdrop-filter: blur(10px); transition: 0.3s; z-index: 20;
        }
        .vetrom-copy-btn:hover { background: #000; transform: translateY(-2px); border-color: rgba(255,255,255,0.3); }
    `;

    // Inject CSS immediately so styles are ready
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* ---------- Engine Logic ---------- */

    function getSafeColor(colorStr) {
        const temp = document.createElement("div");
        // Replace _ with # for hex, otherwise use text name/rgb/rgba directly
        temp.style.color = colorStr.replace(/_/g, '#');
        // We must append to body to get computed style, but we need body to exist
        // If body doesn't exist yet (very rare if called from init), return defaults
        if(!document.body) return { bg: '#1e293b', text: '#f8fafc' };

        document.body.appendChild(temp);
        const rgbStyle = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        
        const rgb = rgbStyle.match(/\d+/g) ? rgbStyle.match(/\d+/g).map(Number) : [0,0,0];
        
        // HSP perceived brightness for text contrast
        const hsp = Math.sqrt(0.299*(rgb[0]**2) + 0.587*(rgb[1]**2) + 0.114*(rgb[2]**2));
        let finalBg = colorStr.replace(/_/g, '#');
        let textColor = hsp > 155 ? '#0f172a' : '#f8fafc';
        
        // Anti-Sunlight: Dim if it's too bright to be readable
        if (hsp > 225) finalBg = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.88)`;
        
        return { bg: finalBg, text: textColor };
    }

    function transform(el) {
        if (el.getAttribute('data-vetrom-applied')) return;
        
        const segments = el.id.split('-');
        // Filter out keywords to isolate color strings
        const colors = segments.filter(s => !['copy','hovercopy','hover'].includes(s));
        
        const main = getSafeColor(colors[0] || '#1e293b');
        el.style.backgroundColor = main.bg;
        el.style.color = main.text;

        // Copy functionality
        if (segments.includes('copy') || segments.includes('hovercopy')) {
            const btn = document.createElement('button');
            btn.className = 'vetrom-copy-btn';
            btn.innerText = 'COPY';
            
            if(segments.includes('hovercopy')) {
                btn.style.opacity = '0';
                el.addEventListener('mouseenter', () => btn.style.opacity = '1');
                el.addEventListener('mouseleave', () => btn.style.opacity = '0');
            }
            
            btn.onclick = () => {
                const codeNode = el.querySelector('code');
                if (codeNode) {
                    navigator.clipboard.writeText(codeNode.innerText);
                    btn.innerText = 'COPIED';
                    setTimeout(() => btn.innerText = 'COPY', 2000);
                }
            };
            el.appendChild(btn);
        }

        // Hover transition logic
        if (segments.includes('hover')) {
            const hover = getSafeColor(colors[1] || '#334155');
            el.addEventListener('mouseenter', () => {
                el.style.backgroundColor = hover.bg;
                el.style.color = hover.text;
            });
            el.addEventListener('mouseleave', () => {
                el.style.backgroundColor = main.bg;
                el.style.color = main.text;
            });
        }
        el.setAttribute('data-vetrom-applied', 'true');
    }

    // --- Initialization & Observer ---
    function initEngine() {
        // Safe check: ensure body exists
        if (!document.body) return;

        const observer = new MutationObserver(m => m.forEach(r => r.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                if (n.classList.contains('vetrom-codeblock')) transform(n);
                n.querySelectorAll('.vetrom-codeblock').forEach(transform);
            }
        })));

        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll('.vetrom-codeblock').forEach(transform);
    }

    // Fix for "parameter 1 is not of type 'Node'"
    // Wait for DOMContentLoaded so document.body exists
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }
})();
