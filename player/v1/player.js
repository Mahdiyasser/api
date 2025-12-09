/*
 * Vetrom Player V1 — The Ultimate MediaPlayer API
 * By Mahdi Yasser
 *
 * --- HOW TO USE ---
 * 
 * Before anything you must add this 
 * <script src="https://api.mahdiyasser.site/player/v1/player.js"></script>
 * to your head or body so the api get called
 *
 * 1. Standard Use (Basic Player)
 * ------------------------------
 * To integrate the default media player, simply apply the required class to your
 * HTML <video> element. The player will automatically initialize.
 * * ACTION:
 * * Add the class "vetrom-media-selected" to your <video> tag.
 * * EXAMPLE:
 * <video src="video.mp4" class="vetrom-media-selected"></video>
 *
 * ---
 *
 * 2. Advanced Use (Adding Chapters/Checkpoints)
 * ---------------------------------------------
 * To add navigational chapters to your video timeline, you must identify the video
 * using an ID and define the checkpoints in a <meta> tag within the document's <head>.
 *
 * A. Set the Video Target:
 * * Assign a unique ID to your target video element (e.g., id="the-test-video").
 *
 * B. Define Checkpoints:
 * * Add the required <meta> tag inside the <head> of your HTML document.
 * * EXAMPLE TAG:
 * * <meta name="vetrom-checkpoint" points="00:5-good part,00:10-better" target="the-test-video">
 * * Points Format: MM:SS-Chapter Name. Separate multiple chapters with a comma (,).
 * * NOTE : The meta name must be as in the example and you must follow the HOW TO USE
 *
 * C. Complete Example (Copy-Paste Ready):
 * * This is the full working example used in the documentation.
 *
 * * In the <head> of your HTML:
 * * <meta name="vetrom-checkpoint" points="00:5-good part,00:10-better" target="the-test-video">
 *
 * * In the <body> of your HTML:
 * * <video src="test.mp4" class="vetrom-media-selected" id="the-test-video"></video>
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
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(){
  const CSS = `
/* container & video */
.vetrom-player-container{position:relative;width:100%;max-width:980px;margin:18px auto;background:#0b0b0b;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.6);overflow:visible;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}
.vetrom-player-container .vetrom-media-inner{position:relative;overflow:hidden;border-radius:8px;background:#000;}
.vetrom-player-container video{position:absolute;left:0;width:100%;object-fit:contain;z-index:1;}
.vetrom-player-container.fullscreen video{margin-top:5.6%;}
/* controls */
.vetrom-controls{position:absolute;left:0;right:0;bottom:0px;height:56px;display:flex;align-items:center;gap:8px;padding:6px 12px;background:linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15));border-radius:8px;color:#fff;z-index:40;transform:translateY(8px);opacity:0;transition:opacity .18s,transform .18s;pointer-events:auto;}
.vetrom-controls.visible{opacity:1;transform:translateY(0);}
.vetrom-controls .vetrom-btn{background:rgba(255,255,255,0.0);border:none;padding:8px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;min-width:44px;min-height:44px;}
.vetrom-controls .vetrom-btn:hover{background:rgba(255,255,255,0.0);transform:translateY(-1px);}

/* progress */
.vetrom-progress-wrap{flex:1;display:flex;align-items:center;gap:8px}
.vetrom-progress-bar{position:relative;height:10px;background:rgba(255,255,255,0.08);border-radius:8px;cursor:pointer;flex:1;overflow:visible}
.vetrom-progress-line{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#ff5a3c,#ffd33d);border-radius:8px;pointer-events:none;z-index:2}
.vetrom-progress-thumb{position:absolute;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,0.6);display:none;z-index:3}
.vetrom-progress-bar:hover .vetrom-progress-thumb, .vetrom-progress-bar.dragging .vetrom-progress-thumb{display:block}

/* chapter markers */
.vetrom-chapter-marker{position:absolute;top:-4px;width:5px;height:18px;background:linear-gradient(180deg,#ffd33d,#ffb700);border-radius:3px;z-index:4;cursor:pointer;opacity:0.95;transition:transform 0.2s ease,box-shadow 0.2s ease}
.vetrom-chapter-marker:hover{transform:scaleY(1.3);box-shadow:0 0 6px rgba(255,211,61,0.9)}


/* skip overlays */
.vetrom-skip-btn{position:absolute;top:6px;bottom:14px;width:fit-contnet; height:fit-content;margin:auto 0;display:flex;align-items:center;justify-content:center;opacity:0;z-index:30;cursor:pointer;pointer-events:auto;background:transparent;border:none}
.vetrom-skip-btn svg{width:92px;height:92px;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.6));}
.vetrom-skip-back{left:24%}
.vetrom-skip-forward{right:24%}
.vetrom-skip-btn.visible{opacity:1}

/* center overlay */
.vetrom-center-overlay{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:45;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto}
.vetrom-center-overlay .big-btn{width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,0);display:flex;align-items:center;justify-content:center;border:5px solid rgba(255,255,255,0);cursor:pointer;transition:transform 0.15s ease}
.vetrom-center-overlay .big-btn:hover{transform:scale(1.08);}
.vetrom-center-overlay .big-btn svg{width:100px;height:100px;fill:#fff;transition:fill 0.15s ease} /* SVG made bigger */
.vetrom-center-overlay .big-btn:hover svg{fill:#ffd33d}
.vetrom-center-overlay .big-caption{margin-top:8px;color:#fff;font-weight:600;text-shadow:0 2px 8px rgba(0,0,0,0.6);font-size:14px}


/* menus */
.vetrom-checkpoints-menu, .vetrom-settings-menu{position:absolute;bottom:72px;right:12px; text-align:center; background:rgba(12,12,12,0.95);padding:10px;border-radius:8px;color:#fff;z-index:50;display:none;min-width:140px;box-shadow:0 12px 40px rgba(0,0,0,0.6)}
.vetrom-settings-menu{right:68px}
.vetrom-checkpoint-item, .vetrom-settings-menu div{padding:8px;border-radius:6px;cursor:pointer;font-size:13px}
.vetrom-checkpoint-item:hover, .vetrom-settings-menu div:hover{background:rgba(255,255,255,0.04);color:#ff6b4a}

/* thumbnail tooltip (follows pointer) */
.vetrom-thumb-tooltip{position:absolute;bottom:56px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;z-index:60;pointer-events:none}
.vetrom-thumb-tooltip .thumb-time{background:rgba(0,0,0,0.75);padding:4px 8px;border-radius:6px;color:#fff;font-size:12px;margin-bottom:6px}
.vetrom-thumb-tooltip .thumb-img{width:160px;height:auto;border-radius:6px;box-shadow:0 6px 20px rgba(0,0,0,0.6);background:#000;overflow:hidden}
.vetrom-thumb-tooltip canvas{width:160px;height:90px;display:block}

/* volume vertical (centered & pretty) */
.vetrom-volume-wrap{position:relative;display:flex;align-items:center;justify-content:center}
.vetrom-volume-panel{position:absolute;bottom:70px;left:50%;transform:translateX(-50%);width:64px;padding:15px 8px 8px;background:rgba(12,12,12,0.95);border-radius:10px;display:none;align-items:center;z-index:55;flex-direction:column;gap:8px}
.vetrom-volume-vertical{position:relative;width:12px;height:120px;background:rgba(255,255,255,0.06);border-radius:8px;overflow:visible;display:block}
.vetrom-volume-vertical .vol-fill{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(180deg,#ff5a3c,#ffd33d);border-radius:8px}
.vetrom-volume-vertical .vol-thumb{position:absolute;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,0.6);pointer-events:none}
.vetrom-volume-percent{font-size:12px;color:#fff}

/* fullscreen */
.vetrom-player-container.fullscreen{max-width:100vw;border-radius:0;box-shadow:none}


/* Mobile & Tablet Responsive */
@media (max-width: 1024px) {
  .vetrom-player-container {
    width: 100%;
    margin: 12px auto;
    border-radius: 6px;
  }

  .vetrom-player-container.fullscreen video{
    margin-top:0;
  }

  .vetrom-controls {
    height: 48px;
    padding: 4px 8px;
    gap: 6px;
  }

  .vetrom-controls .vetrom-btn {
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
  }

  .vetrom-progress-thumb {
    width: 12px;
    height: 12px;
  }

  .vetrom-skip-btn svg {
    width: 64px;
    height: 64px;
  }

  .vetrom-skip-btn {
    width: 64px;
    height: 64px;
    margin-top:auto;
    margin-bottom:auto;
  }

  .vetrom-center-overlay .big-btn {
    width: 70px;
    height: 70px;
    border-width: 4px;
  }

  .vetrom-center-overlay .big-btn svg {
    width: 80px;
    height: 80px;
  }

  .vetrom-volume-panel {
    width: 48px;
    padding: 10px 6px 6px;
  }

  .vetrom-volume-vertical {
    width: 10px;
    height: 100px;
  }

  #vetrom-vol{
  display:none;
  }

  .vetrom-thumb-tooltip .thumb-img {
    width: 120px;
  }

  .vetrom-thumb-tooltip .thumb-time {
    font-size: 10px;
    padding: 3px 6px;
  }

  .vetrom-checkpoints-menu,
  .vetrom-settings-menu {
    bottom: 60px;
    min-width: 120px;
    padding: 8px;
  }

  .vetrom-checkpoint-item,
  .vetrom-settings-menu div {
    font-size: 12px;
    padding: 6px;
  }
}

`;

  // icons: not-muted kept similar, muted icon added, settings/bookmark updated
  const ICONS = {
    PLAY: `
<svg height="24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <style type="text/css">
    .triangle{fill:url(#grad1);}
  </style>
  <g>
    <!-- Triangle sized to match pause bars -->
    <polygon class="triangle" points="6,5 6,19 18,12"/>
  </g>
</svg>

`,
    PAUSE: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEFA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="6" y="5" width="4" height="14" rx="0.8" fill="url(#grad1)"/>
  <rect x="14" y="5" width="4" height="14" rx="0.8" fill="url(#grad1)"/>
</svg>

`,
    VOLUME_ON: `<svg version="1.1" id="Controls" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" xml:space="preserve">
  <g id="row3">
    <path d="M77 19.9v88.2c0 7.3-7.9 11.7-14.1 7.9L18.6 85.1v3.1H0V43.9h18.6V47l43.9-34.7C68.6 8 77 12.4 77 19.9z"
      fill="#4A90E2"/>
    <path d="M92 40l-6.2 6.2c7.4 7.4 7.4 19.4 0 26.8L92 79c10.8-10.8 10.8-28.2 0-39z"
      fill="#E94E77"/>
    <path d="M106 28.8l-6.3 6.3c14.2 14.2 14.2 37.2 0 51.4l6.3 6.3c17.8-17.8 17.8-46.3 0-64z"
      fill="#F5A623"/>
  </g>
</svg>
`,
    VOLUME_MUTED: `<svg version="1.1" id="Controls" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" xml:space="preserve">
  <g id="row3">
    <path id="_x31__2_" d="M77 19.9v88.2c0 7.3-7.9 11.7-14.1 7.9L18.6 85.1v3.1H0V43.9h18.6V47l43.9-34.7C68.6 8 77 12.4 77 19.9z"
      fill="#4A90E2"/> <!-- blue -->
    <path d="M128 78.2L95.7 45.8 89 52.5l32.3 32.3 6.7-6.6z"
      fill="#E94E77"/> <!-- pink/red -->
    <path d="M95.7 84.9L128 52.6l-6.7-6.7-32.4 32.3 6.8 6.7z"
      fill="#F5A623"/> <!-- orange -->
  </g>
</svg>
`,
    SKIP_BACK: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEFA;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <path d="M13 18V6l8.5 6L13 18zM11 6v12h-2V6h2z" fill="url(#grad1)" transform="scale(-1,1) translate(-24,0)"/>
</svg>

`,
    SKIP_FWD: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEFA;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <path d="M13 18V6l8.5 6L13 18zM11 6v12h-2V6h2z" fill="url(#grad1)"/>
</svg>
`,
    FULLSCREEN: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zM5 5v5h2V7h3V5H5zm14 9h-2v3h-3v2h5v-5zM14 5v2h3v3h2V5h-5z" fill="#8ce99a"/></svg>`,
    EXIT_FULLSCREEN: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9H5V4h5v2H7v3zM19 5h-5v2h3v3h2V5zM7 15v3h3v2H5v-5h2zM19 14v5h-5v-2h3v-3h2z" fill="#ffb86b"/></svg>`,
    SETTINGS: `<svg id="Gear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><style>.cls-2{fill:#2e58ff}</style></defs><path d="M62 36v-8a2 2 0 0 0-2-2h-1.85a4 4 0 0 1-3.72-2.55c-.16-.42-.33-.84-.52-1.25a4 4 0 0 1 .82-4.45L56 16.44a2 2 0 0 0 0-2.82L50.38 8a2 2 0 0 0-2.82 0l-1.31 1.27a4 4 0 0 1-4.45.82c-.41-.19-.83-.36-1.25-.52A4 4 0 0 1 38 5.85V4.27A2.07 2.07 0 0 0 36 2h-8a2 2 0 0 0-2 2v1.85a4 4 0 0 1-2.55 3.72c-.42.16-.84.33-1.25.52a4 4 0 0 1-4.45-.82L16.44 8a2 2 0 0 0-2.82 0L8 13.62a2 2 0 0 0 0 2.82l1.31 1.31a4 4 0 0 1 .82 4.45c-.19.41-.36.83-.52 1.25A4 4 0 0 1 5.85 26H4.27A2.07 2.07 0 0 0 2 28v8a2 2 0 0 0 2 2h1.85a4 4 0 0 1 3.72 2.55c.16.42.33.84.52 1.25a4 4 0 0 1-.82 4.45L8 47.56a2 2 0 0 0 0 2.82L13.62 56a2 2 0 0 0 2.82 0l1.31-1.31a4 4 0 0 1 4.45-.82c.41.19.83.36 1.25.52A4 4 0 0 1 26 58.15v1.58A2.07 2.07 0 0 0 28 62h8a2 2 0 0 0 2-2v-1.85a4 4 0 0 1 2.55-3.72 22.3 22.3 0 0 0 2.39-1.07 2 2 0 0 1 2.31.37L47.56 56a2 2 0 0 0 2.82 0L56 50.38a2 2 0 0 0 0-2.82l-1.31-1.31a4 4 0 0 1-.82-4.45c.19-.41.36-.83.52-1.25A4 4 0 0 1 58.15 38h1.58A2.07 2.07 0 0 0 62 36z" style="fill:#8bc4ff"/><path class="cls-2" d="M36 64h-8a4 4 0 0 1-4-4.27v-1.58a2 2 0 0 0-1.27-1.85c-.45-.18-.9-.36-1.35-.56a2 2 0 0 0-2.21.41l-1.31 1.31a4.1 4.1 0 0 1-5.66 0L6.54 51.8A4 4 0 0 1 5.37 49c0-3.46 4-3.85 2.89-6.35-.2-.45-.38-.9-.56-1.35A2 2 0 0 0 5.85 40H4a4 4 0 0 1-4-4v-8a4 4 0 0 1 4.27-4h1.58a2 2 0 0 0 1.85-1.27c.18-.45.36-.9.56-1.35a2 2 0 0 0-.41-2.21l-1.31-1.31a4 4 0 0 1 0-5.66l5.66-5.66a4.1 4.1 0 0 1 5.66 0l1.31 1.31a2 2 0 0 0 2.21.41c.45-.2.9-.38 1.35-.56A2 2 0 0 0 24 5.85V4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4.27v1.58a2 2 0 0 0 1.27 1.85c.45.18.9.36 1.35.56a2 2 0 0 0 2.21-.41l1.31-1.31a4.1 4.1 0 0 1 5.66 0l5.66 5.66a4 4 0 0 1 1.17 2.8c0 3.46-4 3.85-2.89 6.35.2.45.38.9.56 1.35a2 2 0 0 0 1.85 1.3H60a4 4 0 0 1 4 4v8a4 4 0 0 1-4.27 4h-1.58a2 2 0 0 0-1.85 1.27c-.18.45-.36.9-.56 1.35a2 2 0 0 0 .41 2.21l1.31 1.31a4 4 0 0 1 0 5.66l-5.66 5.66a4.1 4.1 0 0 1-5.66 0l-2.31-2.31a25.84 25.84 0 0 1-2.56 1.15A2 2 0 0 0 40 58.15V60a4 4 0 0 1-4 4zM20.59 51.57a8.42 8.42 0 0 1 3.57 1A6 6 0 0 1 28 58.15c0 1.49 0 1.78.06 1.88L36 60v-1.85a6 6 0 0 1 3.84-5.59 19.35 19.35 0 0 0 2.18-1 4 4 0 0 1 4.64.74L49 54.63 54.63 49l-1.31-1.31A6 6 0 0 1 52.09 41c.17-.38.32-.76.47-1.14A6 6 0 0 1 58.15 36 8.23 8.23 0 0 0 60 36v-8h-1.85a6 6 0 0 1-5.59-3.84c-.15-.38-.3-.76-.47-1.14a6 6 0 0 1 1.23-6.68L54.63 15 49 9.37l-1.31 1.31A6 6 0 0 1 41 11.91c-.38-.17-.76-.32-1.14-.47A6 6 0 0 1 36 5.85c0-1.49 0-1.78-.06-1.88L28 4v1.85a6 6 0 0 1-3.84 5.59c-.38.15-.76.3-1.14.47a6 6 0 0 1-6.68-1.23L15 9.37 9.37 15l1.31 1.31A6 6 0 0 1 11.91 23c-.17.38-.32.76-.47 1.14A6 6 0 0 1 5.85 28c-1.49 0-1.78 0-1.88.06L4 36h1.85a6 6 0 0 1 5.59 3.84c.15.38.3.76.47 1.14a6 6 0 0 1-1.23 6.68L9.37 49 15 54.63c1.51-1.48 2.77-3.06 5.59-3.06z"/><circle cx="32" cy="32" r="15" style="fill:#d1e7ff"/><path class="cls-2" d="M32 49a17 17 0 1 1 17-17 17 17 0 0 1-17 17zm0-30a13 13 0 1 0 13 13 13 13 0 0 0-13-13z"/></svg>`,
    CHAPTER_ICON: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9a1 1 0 011 1v18l-6-3-6 3V3a1 1 0 011-1z" fill="#ffd36b"/></svg>`
  };

  // inject CSS
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ---------- Utilities ---------- */
  function formatTime(totalSeconds){
    if(!isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
    const s = Math.floor(totalSeconds % 60).toString().padStart(2,'0');
    const m = Math.floor(totalSeconds/60 % 60).toString().padStart(2,'0');
    const h = Math.floor(totalSeconds/3600);
    return h>0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  // thumbnail cache
  const thumbCache = new Map();
  function createThumbVideo(src){
    try {
      const v = document.createElement('video');
      v.muted = true;
      v.preload = 'auto';
      v.crossOrigin = 'anonymous';
      v.src = src;
      v.style.display = 'none';
      document.body.appendChild(v);
      return v;
    } catch(e){
      return null;
    }
  }

  /* ---------- VetromPlayer class ---------- */
  class VetromPlayer {
    constructor(video){
      this.video = video;
      this.container = null;
      this.innerWrap = null;
      this.controls = null;
      this.thumbTooltip = null;
      this.settingsMenu = null;
      this.chaptersMenu = null;
      this.centerOverlay = null;
      this.thumbVideo = null;
      this.controlsVisible = false;
      this.dragging = false;
      this.idleTimer = null;
      this.skipBtns = [];
      this.volumePanel = null;
      this.volumeTrack = null;
      this.volumeFill = null;
      this.volumeThumb = null;
      this.volumePercent = null;
      this.chapterData = []; // {time, label}
      this.init();
    }

    init(){
      this.video.controls = false;
      this.buildUI();
      this.attachEvents();
      this.loadChapters(); // changed name: chapters instead of checkpoints
      const src = this.video.currentSrc || this.video.src;
      this.thumbVideo = createThumbVideo(src);
      this.applyDynamicHeight();
      this.video.addEventListener('loadedmetadata', ()=> this.applyDynamicHeight());
      new ResizeObserver(()=>this.applyDynamicHeight()).observe(this.innerWrap);
    }

    buildUI(){
      // container & inner wrap
      const c = document.createElement('div');
      c.className = 'vetrom-player-container';
      const inner = document.createElement('div');
      inner.className = 'vetrom-media-inner';
      this.video.parentNode.insertBefore(c, this.video);
      c.appendChild(inner);
      inner.appendChild(this.video);
      this.container = c; this.innerWrap = inner;

      // controls
      const controls = document.createElement('div');
      controls.className = 'vetrom-controls';
      controls.innerHTML = `
        <button class="vetrom-btn vetrom-play-btn" id="vetrom-play" title="Play/Pause">${ICONS.PLAY}</button>
        <div class="vetrom-time vetrom-current-time">00:00</div>
        <div class="vetrom-progress-wrap">
          <div class="vetrom-progress-bar" aria-hidden="true">
             <div class="vetrom-progress-line"></div>
             <div class="vetrom-progress-thumb" aria-hidden="true"></div>
          </div>
        </div>
        <div class="vetrom-volume-wrap">
          <button class="vetrom-btn vetrom-volume-btn" id="vetrom-vol" title="Volume">${ICONS.VOLUME_ON}<span class="mute-slash" style="display:none"></span></button>
        </div>
        <button class="vetrom-btn vetrom-settings-btn" title="Settings">${ICONS.SETTINGS}</button>
        <button class="vetrom-btn vetrom-chapters-btn" style="display:none" title="Chapters">${ICONS.CHAPTER_ICON}</button>
        <button class="vetrom-btn vetrom-fullscreen-btn" title="Fullscreen">${ICONS.FULLSCREEN}</button>
      `;
      c.appendChild(controls);
      this.controls = controls;

      // skip back/forward
      const skipBack = document.createElement('button');
      skipBack.className = 'vetrom-skip-btn vetrom-skip-back';
      skipBack.dataset.skip = -10;
      skipBack.innerHTML = ICONS.SKIP_BACK;
      c.appendChild(skipBack);
      const skipFwd = document.createElement('button');
      skipFwd.className = 'vetrom-skip-btn vetrom-skip-forward';
      skipFwd.dataset.skip = 10;
      skipFwd.innerHTML = ICONS.SKIP_FWD;
      c.appendChild(skipFwd);
      this.skipBtns = [skipBack, skipFwd];

      // center overlay
      const center = document.createElement('div'); center.className = 'vetrom-center-overlay';
      center.innerHTML = `<button class="big-btn" title="Play/Pause">${ICONS.PLAY}</button><div class="big-caption"></div>`;
      c.appendChild(center);
      this.centerOverlay = center;

      // settings menu
      const settingsMenu = document.createElement('div'); settingsMenu.className = 'vetrom-settings-menu';
      settingsMenu.innerHTML = `<div data-speed="0.5">0.5x</div><div data-speed="0.75">0.75x</div><div data-speed="1">1x (Normal)</div><div data-speed="1.25">1.25x</div><div data-speed="1.5">1.5x</div><div data-speed="2">2x</div>`;
      c.appendChild(settingsMenu); this.settingsMenu = settingsMenu;

      // chapters menu
      const chaptersMenu = document.createElement('div'); chaptersMenu.className = 'vetrom-checkpoints-menu';
      c.appendChild(chaptersMenu); this.chaptersMenu = chaptersMenu;

      // tooltip (thumbnail + time)
      const tooltip = document.createElement('div'); tooltip.className = 'vetrom-thumb-tooltip'; tooltip.style.display='none';
      tooltip.innerHTML = `<div class="thumb-time">00:00</div><div class="thumb-img"><canvas width="160" height="90"></canvas></div>`;
      c.appendChild(tooltip); this.thumbTooltip = tooltip; this.thumbCanvas = tooltip.querySelector('canvas'); this.thumbTimeDom = tooltip.querySelector('.thumb-time');

      // volume panel (vertical)
      const volPanel = document.createElement('div'); volPanel.className='vetrom-volume-panel'; volPanel.style.display='none';
      volPanel.innerHTML = `<div class="vetrom-volume-vertical"><div class="vol-fill"></div><div class="vol-thumb"></div></div><div class="vetrom-volume-percent">0%</div>`;
      const volWrap = controls.querySelector('.vetrom-volume-wrap'); volWrap.appendChild(volPanel);
      this.volumePanel = volPanel; this.volumeTrack = volPanel.querySelector('.vetrom-volume-vertical'); this.volumeFill = volPanel.querySelector('.vol-fill'); this.volumeThumb = volPanel.querySelector('.vol-thumb'); this.volumePercent = volPanel.querySelector('.vetrom-volume-percent');

      // refs
      this.playBtn = controls.querySelector('.vetrom-play-btn');
      this.centerBigBtn = center.querySelector('.big-btn');
      this.centerCaption = center.querySelector('.big-caption');
      this.currentTimeDom = controls.querySelector('.vetrom-current-time');
      this.durationDom = controls.querySelector('.vetrom-duration-time');
      this.progressBar = controls.querySelector('.vetrom-progress-bar');
      this.progressLine = controls.querySelector('.vetrom-progress-line');
      this.progressThumb = controls.querySelector('.vetrom-progress-thumb');
      this.volumeBtn = controls.querySelector('.vetrom-volume-btn');
      this.fullscreenBtn = controls.querySelector('.vetrom-fullscreen-btn');
      this.settingsBtn = controls.querySelector('.vetrom-settings-btn');
      this.chaptersBtn = controls.querySelector('.vetrom-chapters-btn');

      // small visual adjustments
      this.playBtn.style.minWidth = '';
      this.centerBigBtn.style.width = '110px';
      this.centerBigBtn.style.height = '110px';
      // 5px top/bottom
      this.video.style.top = '5px';
      this.video.style.height = 'calc(100% - 10px)';
      this.video.style.position = 'absolute';
    }

    applyDynamicHeight(){
      const width = this.innerWrap.clientWidth || this.innerWrap.getBoundingClientRect().width;
      const vw = this.video.videoWidth || this.video.naturalWidth || 16;
      const vh = this.video.videoHeight || this.video.naturalHeight || 9;
      const ratio = (vw > 0 && vh > 0) ? (vh / vw) : (9/16);
      const videoHeightPx = Math.max(20, Math.round(width * ratio));
      const totalHeight = videoHeightPx + 10; // 5px top + bottom
      this.innerWrap.style.height = totalHeight + 'px';
    }

    attachEvents(){
      // play/pause
      this.playBtn.addEventListener('click', e=>{ e.stopPropagation(); this.togglePlay(); });
      this.centerBigBtn.addEventListener('click', e=>{ e.stopPropagation(); this.togglePlay(); });

      this.video.addEventListener('play', ()=> this.onPlay());
      this.video.addEventListener('pause', ()=> this.onPause());
      this.video.addEventListener('timeupdate', ()=> this.onTimeUpdate());
      this.video.addEventListener('loadedmetadata', ()=> this.onTimeUpdate());

      // volume: click toggles mute
      this.volumeBtn.addEventListener('click', e=>{ e.stopPropagation(); this.video.muted = !this.video.muted; if(!this.video.muted && (this.video.volume === 0 || !isFinite(this.video.volume))) this.video.volume = 0.6; this.updateVolumeUI(); });

      // show/hide volume panel on hover
      this.volumeBtn.addEventListener('mouseenter', ()=> this.showVolumePanel());
      this.volumeBtn.addEventListener('mouseleave', ()=> setTimeout(()=>{ if(!this.volumePanel.matches(':hover')) this.hideVolumePanel(); }, 120));
      this.volumePanel.addEventListener('mouseenter', ()=> this.showVolumePanel());
      this.volumePanel.addEventListener('mouseleave', ()=> this.hideVolumePanel());

      // volume pointer handling (vertical, bottom -> top = 0 -> 1)
      this.volumeTrack.addEventListener('pointerdown', e=>{
        e.preventDefault();
        this.onVolumePointer(e);
        const move = ev => this.onVolumePointer(ev);
        const up = ()=>{ window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });

      // skip buttons
      this.skipBtns.forEach(btn=>{
        btn.addEventListener('click', e=>{ e.stopPropagation(); const skip = parseFloat(btn.dataset.skip) || 10; this.video.currentTime = Math.min(Math.max(0, this.video.currentTime + skip), this.video.duration || 0); this.showControls(900); });
      });

      // progress click/drag
      this.progressBar.addEventListener('pointerdown', e=>{ e.preventDefault(); this.dragging = true; this.progressBar.classList.add('dragging'); this.setCurrentTimeFromEvent(e); });
      window.addEventListener('pointermove', e=>{ if(this.dragging) this.setCurrentTimeFromEvent(e); });
      window.addEventListener('pointerup', e=>{ if(this.dragging){ this.dragging=false; this.progressBar.classList.remove('dragging'); this.setCurrentTimeFromEvent(e); this.showControls(900); } });

      // progress hover -> tooltip follow pointer
      this.progressBar.addEventListener('mousemove', e=> this.onProgressHover(e));
      this.progressBar.addEventListener('mouseleave', ()=> this.hideThumbTooltip());

      // clicking video toggles controls (Simplified for reliable toggle on mobile)
      this.video.addEventListener('click', e=> {
        if(e.detail === 2) return; // Ignore double-click (which is reserved for fullscreen)

        // Only toggle if we are NOT dragging the progress bar
        if (!this.dragging) {
            if(this.controlsVisible) {
                // If controls are visible, hide them immediately without a delay
                this.hideControls();
            } else {
                // If controls are hidden, show them and set a pause-aware timeout
                this.showControls(this.video.paused ? 0 : 2000); // 0 timeout if paused
            }
        }
      });

      // dblclick fullscreen
      this.video.addEventListener('dblclick', ()=> this.toggleFullscreen());

      // fullscreen button
      this.fullscreenBtn.addEventListener('click', e=> { e.stopPropagation(); this.toggleFullscreen(); });

      // settings
      this.settingsBtn.addEventListener('click', e=> { e.stopPropagation(); this.toggleSettings(); });
      this.settingsMenu.addEventListener('click', e=> { e.stopPropagation(); const el = e.target.closest('[data-speed]'); if(el){ this.video.playbackRate = parseFloat(el.dataset.speed); this.settingsMenu.style.display='none'; this.showControls(900); } });

      // chapters button
      this.chaptersBtn.addEventListener('click', e=> { e.stopPropagation(); this.chaptersMenu.style.display = this.chaptersMenu.style.display === 'block' ? 'none' : 'block'; });

      // close menus on outside click
      document.addEventListener('click', e=>{
        if(this.chaptersMenu && this.chaptersMenu.style.display === 'block' && !this.controls.contains(e.target) && !this.chaptersMenu.contains(e.target)) this.chaptersMenu.style.display = 'none';
        if(this.settingsMenu && this.settingsMenu.style.display === 'block' && !this.controls.contains(e.target) && !this.settingsMenu.contains(e.target)) this.settingsMenu.style.display = 'none';
      });

      // show/hide controls on movement
      let moveTimer = null;
      this.container.addEventListener('mousemove', ()=>{ this.showControls(); clearTimeout(moveTimer); moveTimer = setTimeout(()=>{ if(!this.video.paused) this.hideControls(); }, 2000); });
      this.container.addEventListener('mouseenter', ()=> this.showControls());
      this.container.addEventListener('mouseleave', ()=> { if(!this.video.paused) this.hideControls(); });

      // keyboard
      // keyboard
this.container.addEventListener('keydown', e=>{ 
  if(e.code === 'Space'){ 
    e.preventDefault(); 
    this.togglePlay(); 
  } 
  if(e.key === 'f') this.toggleFullscreen(); 
  
  // Custom Controls
  const dur = this.video.duration || 0;
  
  if(e.key === 'ArrowRight' || e.key === 'l'){
    e.preventDefault();
    // Skip forward 5 seconds
    this.video.currentTime = Math.min(dur, this.video.currentTime + 5);
    this.showControls(900);
  }
  
  if(e.key === 'ArrowLeft' || e.key === 'j'){
    e.preventDefault();
    // Skip back 5 seconds
    this.video.currentTime = Math.max(0, this.video.currentTime - 5);
    this.showControls(900);
  }
  
  if(e.key === 'ArrowUp'){
    e.preventDefault();
    // Volume up by 0.05 (5%)
    const newVolume = Math.min(1, this.video.volume + 0.05);
    this.video.volume = newVolume;
    if(newVolume > 0 && this.video.muted) this.video.muted = false;
    this.updateVolumeUI();
    this.showControls(900);
    this.showVolumePanel();
    setTimeout(()=> this.hideVolumePanel(), 500);
  }
  
  if(e.key === 'ArrowDown'){
    e.preventDefault();
    // Volume down by 0.05 (5%)
    const newVolume = Math.max(0, this.video.volume - 0.05);
    this.video.volume = newVolume;
    if(newVolume === 0) this.video.muted = true;
    this.updateVolumeUI();
    this.showControls(900);
    this.showVolumePanel();
    setTimeout(()=> this.hideVolumePanel(), 500);
  }
  
  if(e.key === 'm'){
    e.preventDefault();
    // Toggle mute
    this.video.muted = !this.video.muted;
    if(!this.video.muted && (this.video.volume === 0 || !isFinite(this.video.volume))) this.video.volume = 0.6;
    this.updateVolumeUI();
    this.showControls(900);
    this.showVolumePanel();
    setTimeout(()=> this.hideVolumePanel(), 500);
  }
});

// --- [START] STANDALONE MOBILE-ONLY TAP TOGGLE ---
// Helper to detect if touch events are primary for the device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {

    this.video.addEventListener('click', e => {
        if (e.detail === 2) return;
        if (this.dragging) return;

        e.stopPropagation(); // Stop propagation from the video element

        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls(this.video.paused ? 0 : 2000);
        }
    });

    this.container.removeEventListener('mousemove', ()=>{}); // This is a placeholder for safety.
    this.container.addEventListener('touchstart', ()=> this.showControls(this.video.paused ? 0 : 2000));
    this.container.addEventListener('touchend', ()=> { if(!this.video.paused) this.hideControls(2000); });
}
// --- [END] STANDALONE MOBILE-ONLY TAP TOGGLE ---

      // initial volume state
      if(this.video.volume == null || !isFinite(this.video.volume)) this.video.volume = 1;
      this.updateVolumeUI();

      // initial controls visibility
      if(this.video.paused) this.showControls(); else this.hideControls(1200);
    }

    // volume pointer: y inside track. top=0 -> max; bottom=height -> min.
    onVolumePointer(e){
      const rect = this.volumeTrack.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      // compute pct so bottom => 0, top => 1
      const pct = 1 - (y / rect.height);
      this.video.volume = Math.round(Math.max(0, Math.min(1, pct)) * 100) / 100;
      if(this.video.volume > 0) this.video.muted = false;
      this.updateVolumeUI();
    }

    updateVolumeUI(){
      // update icon and slash presence
      const iconHtml = (this.video.muted || this.video.volume === 0) ? ICONS.VOLUME_MUTED : ICONS.VOLUME_ON;
      this.volumeBtn.innerHTML = iconHtml;
      // add or preserve slash element (visually redundant with VOLUME_MUTED but keep for safety)
      let slash = this.volumeBtn.querySelector('.mute-slash');
      if((this.video.muted || this.video.volume === 0)){
        if(!slash){ slash = document.createElement('span'); slash.className = 'mute-slash'; this.volumeBtn.appendChild(slash); } else { slash.style.display = 'block'; }
      } else { if(slash) slash.style.display = 'none'; }
      // update panel fill & thumb percent
      const pct = Math.round((this.video.volume ?? 0) * 100);
      const h = this.volumeTrack.clientHeight || 120;
      const fillH = Math.round((pct/100) * h);
      this.volumeFill.style.height = fillH + 'px';
      // thumb y pos: bottom -> 0 , top -> h so thumb top = h - fillH
      this.volumeThumb.style.top = (h - fillH) + 'px';
      // percent text
      this.volumePercent.textContent = pct + '%';
    }

    showVolumePanel(){ this.volumePanel.style.display = 'flex'; this.updateVolumeUI(); }
    hideVolumePanel(){ this.volumePanel.style.display = 'none'; }

    togglePlay(){
      if(this.video.paused){
        const p = this.video.play();
        if(p && p.catch) p.catch(err => { console.warn('play failed', err); this.showControls(); });
      } else this.video.pause();
      this.showControls(900);
    }

    onPlay(){
      this.playBtn.innerHTML = ICONS.PAUSE;
      this.centerBigBtn.innerHTML = ICONS.PAUSE;
      this.centerCaption.textContent = '';
      this.showControls(1000);
      this.hideControls(2000);
    }

    onPause(){
      this.playBtn.innerHTML = ICONS.PLAY;
      this.centerBigBtn.innerHTML = ICONS.PLAY;
      this.centerCaption.textContent = '';
      this.showControls();
    }

    onTimeUpdate(){
      this.currentTimeDom.textContent = formatTime(this.video.currentTime);
      const dur = this.video.duration || 0;
      const percent = dur > 0 ? (this.video.currentTime / dur) * 100 : 0;
      this.progressLine.style.width = percent + '%';
      this.progressThumb.style.left = percent + '%';
    }

    setCurrentTimeFromEvent(e){
      const rect = this.progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const pct = x / rect.width;
      const t = (this.video.duration || 0) * pct;
      this.progressLine.style.width = (pct*100)+'%';
      this.progressThumb.style.left = (pct*100)+'%';
      try { this.video.currentTime = t; } catch(err){}
    }

    showControls(timeout){
      this.controlsVisible = true;
      this.controls.classList.add('visible');
      this.centerOverlay.style.display = 'flex';
      this.skipBtns.forEach(b => { b.classList.add('visible'); b.style.display = 'flex'; });
      if(this.idleTimer){ clearTimeout(this.idleTimer); this.idleTimer = null; }
      if(timeout && !this.video.paused) this.idleTimer = setTimeout(()=> this.hideControls(), timeout);
    }

    hideControls(delay){
      if(this.video.paused) return;
      if(delay){
        if(this.idleTimer) clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(()=>{ this.controlsVisible=false; this.controls.classList.remove('visible'); this.centerOverlay.style.display='none'; this.skipBtns.forEach(b => { b.classList.remove('visible'); b.style.display = 'none'; }); }, delay);
      } else {
        this.controlsVisible=false;
        this.controls.classList.remove('visible');
        this.centerOverlay.style.display='none';
        this.skipBtns.forEach(b => { b.classList.remove('visible'); b.style.display = 'none'; });
      }
    }

    toggleSettings(){ this.settingsMenu.style.display = this.settingsMenu.style.display === 'block' ? 'none' : 'block'; }

    /* Inside the VetromPlayer class */

    toggleFullscreen(){
      const el = this.container;
      const doc = document;
      const screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation; // Get screen orientation object
      
      if(!doc.fullscreenElement && !doc.webkitFullscreenElement){
        if(el.requestFullscreen) el.requestFullscreen();
        else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        el.classList.add('fullscreen'); this.fullscreenBtn.innerHTML = ICONS.EXIT_FULLSCREEN;
        
        if (screenOrientation && screenOrientation.lock) {
            screenOrientation.lock('landscape').catch(err => {
                if (err.name !== 'NotSupportedError') {
                    console.warn('Screen orientation lock failed:', err);
                }
            });
        }
        
      } else {
        if(doc.exitFullscreen) doc.exitFullscreen();
        else if(doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        el.classList.remove('fullscreen'); this.fullscreenBtn.innerHTML = ICONS.FULLSCREEN;
        
        if (screenOrientation && screenOrientation.unlock) {
            screenOrientation.unlock();
        }
        
      }
      this.showControls(1500);
    }

    /* ---------- Chapters (was checkpoints) ---------- */
    loadChapters(){
      // accept meta[name="vetrom-checkpoint"][target="..."] but parse label after hyphen '-'
      const meta = document.querySelector(`meta[name="vetrom-checkpoint"][target="${this.video.id}"]`);
      if(!meta) return;
      const ptsStr = meta.getAttribute('points') || '';
      const arr = ptsStr.split(',').map(s=>s.trim()).filter(Boolean);
      if(arr.length === 0) return;
      this.chaptersBtn.style.display = 'inline-flex';
      this.chapterData = [];
      arr.forEach((entry, index)=>{
        // entry format: time[-label] e.g. 00:05-good part
        const [timeToken, labelRaw] = entry.split('-').map(s => s ? s.trim() : '');
        const secs = this.parseTimeToken(timeToken || '');
        if(secs === null) return;
        const label = labelRaw || `Chapter ${index+1}`;
        this.chapterData.push({time: secs, label});
      });
      // build chapters menu UI
      let html = '<h4 style="margin:0 0 6px 0;font-weight:700">Chapters</h4>';
      this.chapterData.forEach((ch, i) => {
        html += `<div class="vetrom-checkpoint-item" data-time="${ch.time}" title="${ch.label}">${ch.label} — ${formatTime(ch.time)}</div>`;
      });
      this.chaptersMenu.innerHTML = html;
      this.chaptersMenu.querySelectorAll('.vetrom-checkpoint-item').forEach(it=>{
        it.addEventListener('click', e=>{
          e.stopPropagation();
          const t = parseFloat(it.dataset.time);
          this.video.currentTime = t;
          this.chaptersMenu.style.display = 'none';
          this.showControls(900);
        });
      });
      // add markers on progress bar
      this.renderChapterMarkers();
    }

    renderChapterMarkers(){
      // remove existing markers
      const existing = this.progressBar.querySelectorAll('.vetrom-chapter-marker');
      existing.forEach(n => n.remove());
      const dur = this.video.duration || 0;
      if(!(dur > 0)) {
        // if duration unknown, wait for loadedmetadata to render later
        this.video.addEventListener('loadedmetadata', ()=> this.renderChapterMarkers(), {once:true});
        return;
      }
      this.chapterData.forEach(ch => {
        const pct = (ch.time / this.video.duration) * 100;
        const marker = document.createElement('div');
        marker.className = 'vetrom-chapter-marker';
        marker.style.left = pct + '%';
        marker.title = ch.label + ' — ' + formatTime(ch.time);
        marker.addEventListener('click', (e)=>{ e.stopPropagation(); this.video.currentTime = ch.time; this.showControls(900); });
        this.progressBar.appendChild(marker);
      });
    }

    parseTimeToken(token){
      if(!token) return null;
      const parts = token.split(':').map(s=>s.trim());
      if(parts.length === 3){
        const h = parseInt(parts[0],10)||0; const m = parseInt(parts[1],10)||0; const s = parseInt(parts[2],10)||0;
        return h*3600 + m*60 + s;
      } else if(parts.length === 2){
        const m = parseInt(parts[0],10)||0; const s = parseInt(parts[1],10)||0; return m*60 + s;
      } else {
        const n = parseFloat(parts[0]);
        return isNaN(n) ? null : n;
      }
    }

    /* ---------- Hover preview thumbnail (fast low-res) ---------- */
    onProgressHover(e){
      const containerRect = this.container.getBoundingClientRect();
      const left = e.clientX - containerRect.left;
      this.thumbTooltip.style.left = left + 'px';
      this.thumbTooltip.style.display = 'flex';
      const barRect = this.progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(barRect.width, e.clientX - barRect.left));
      const pct = x / barRect.width;
      const t = (this.video.duration || 0) * pct;
      this.thumbTimeDom.textContent = formatTime(t);
      const key = Math.round(t); // coarse
      if(thumbCache.has(key)){
        this.paintThumb(thumbCache.get(key));
      } else {
        this.generateLowResThumb(key).then(dataUrl => {
          if(dataUrl){ thumbCache.set(key, dataUrl); this.paintThumb(dataUrl); }
        }).catch(()=>{});
      }
    }

    hideThumbTooltip(){ this.thumbTooltip.style.display = 'none'; }

    paintThumb(dataUrl){
      const canvas = this.thumbCanvas;
      const ctx = canvas.getContext('2d');
      if(!dataUrl){ ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height); return; }
      const img = new Image();
      img.onload = ()=> {
        canvas.width = 160; canvas.height = Math.round(160 * img.height / img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
    }

    generateLowResThumb(timeSec){
      if(!this.thumbVideo) return Promise.resolve(null);
      const v = this.thumbVideo;
      return new Promise((resolve)=>{
        let timeout = null;
        function cleanup(){ v.removeEventListener('seeked', onseeked); v.removeEventListener('error', onerror); if(timeout){ clearTimeout(timeout); timeout=null; } }
        function onerror(){ cleanup(); resolve(null); }
        function onseeked(){
          try {
            const vw = v.videoWidth || 320;
            const vh = v.videoHeight || 180;
            const targetW = 160;
            const scale = Math.max(0.2, Math.min(1, targetW / vw));
            const cw = Math.round(vw * scale);
            const ch = Math.round(vh * scale);
            const canvas = document.createElement('canvas');
            canvas.width = cw; canvas.height = ch;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,cw,ch);
            ctx.drawImage(v, 0, 0, cw, ch);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.55);
            cleanup();
            resolve(dataUrl);
          } catch(err){ cleanup(); resolve(null); }
        }
        v.addEventListener('seeked', onseeked);
        v.addEventListener('error', onerror);
        const dur = v.duration || this.video.duration || 0;
        const t = Math.max(0, Math.min(dur, timeSec));
        try { v.currentTime = t; } catch(e){ try { v.load(); v.currentTime = t; } catch(_){} }
        timeout = setTimeout(()=>{ cleanup(); resolve(null); }, 1500);
      });
    }

  } // end class

    // initialize
  function init(){
    document.querySelectorAll('video.vetrom-media-selected').forEach(v=>{
      if(v.__vetromPlayer) return;
      try { v.__vetromPlayer = new VetromPlayer(v); } catch(err){ console.error('vetrom init err', err); }
    });
  }

  // Helper to run initialization
  function runInit() {
    init();

    // If no players were found on the first run, try again in 500ms
    // to catch dynamically loaded videos from script.js
    if (document.querySelectorAll('video.vetrom-media-selected').length === 0) {
      setTimeout(init, 500); 
    }
  }

  // Use DOMContentLoaded for the first attempt as before
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

})();
