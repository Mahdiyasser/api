/*
 * VetroM Player V2 – The Ultimate MediaPlayer API
 * By Mahdi Yasser
 *
 * --- HOW TO USE ---
 * 
 * Before anything you must add this 
 * <script src="https://api.mahdiyasser.site/player/v2/player.js"></script>
 * to your head or body so the api get called
 *
 * 1. Basic Use
 * ------------------------------
 * Simply add the class "vetrom-media" to your <video> element:
 * <video src="video.mp4" class="vetrom-media"></video>
 *
 * This will use the default theme (baby blue, white, and gold).
 *
 * ---
 *
 * 2. Theme Customization
 * ------------------------------
 * You can customize the player theme in several ways:
 *
 * A. Full Custom Theme (theme-color):
 * <video class="vetrom-media-dark-red" src="video.mp4"></video>
 * <video class="vetrom-media-light-blue" src="video.mp4"></video>
 * <video class="vetrom-media-auto-green" src="video.mp4"></video>
 *
 * Format: vetrom-media-{theme}-{color}
 * - theme: dark, light, or auto (auto adapts to background)
 * - color: red, blue, green, purple, orange, etc. OR hex (#ff5733), rgb (rgb(255,87,51)), rgba (rgba(255,87,51,0.8))
 *
 * B. Simple Theme (no color specified):
 * <video class="vetrom-media-dark" src="video.mp4"></video>
 * <video class="vetrom-media-light" src="video.mp4"></video>
 * <video class="vetrom-media-auto" src="video.mp4"></video>
 *
 * These use default colors with the specified theme style.
 *
 * ---
 *
 * 3. Chapters (formerly Checkpoints)
 * ------------------------------
 * Chapters are now defined directly in the video element's ID attribute:
 * <video 
 *   src="video.mp4" 
 *   class="vetrom-media" 
 *   id="Good Part,00:00:03-Great Part,00:00:05-Best Part,00:00:08">
 * </video>
 *
 * Format: "Chapter Name,HH:MM:SS-Chapter Name,HH:MM:SS-..."
 * Time format: HH:MM:SS (hours:minutes:seconds)
 *
 * ---
 *
 * 4. Secure Mode (Copyright Protection)
 * ------------------------------
 * Enable secure mode to show a custom context menu on right-click/long-press:
 * <video class="vetrom-media-secure-dark-red" src="video.mp4"></video>
 *
 * This displays "VetroM Player V2" with a clickable link to:
 * https://api.mahdiyasser.site/player/v2/
 *
 * ---
 *
 * 5. Multiple Quality Sources
 * ------------------------------
 * Add multiple quality options using standard HTML5 source elements:
 * <video class="vetrom-media">
 *   <source src="video-1080p.mp4" type="video/mp4" label="1080p" res="1080">
 *   <source src="video-720p.mp4" type="video/mp4" label="720p" res="720">
 *   <source src="video-480p.mp4" type="video/mp4" label="480p" res="480">
 * </video>
 *
 * ---
 *
 * 6. Subtitles/Captions
 * ------------------------------
 * Add subtitles using standard HTML5 track elements:
 * <video class="vetrom-media">
 *   <source src="video.mp4" type="video/mp4">
 *   <track kind="subtitles" src="subtitles_en.vtt" srclang="en" label="English" default>
 *   <track kind="subtitles" src="subtitles_es.vtt" srclang="es" label="Español">
 *   <track kind="subtitles" src="subtitles_fr.vtt" srclang="fr" label="Français">
 * </video>
 *
 * If a track has the "default" attribute, subtitles will be enabled automatically.
 *
 * ---
 *
 * 7. Instance Numbers (for custom styling)
 * ------------------------------
 * Add a number to separate instances for custom CSS targeting:
 * <video class="vetrom-media-1-secure-dark-red" src="video.mp4"></video>
 * <video class="vetrom-media-2-light-blue" src="video.mp4"></video>
 *
 * This adds a unique identifier for easier CSS customization.
 *
 * ---
 *
 * 8. Complete Example
 * ------------------------------
 * <video 
 *   src="video.mp4" 
 *   class="vetrom-media-1-secure-dark-red" 
 *   id="Introduction,00:00:00-Main Content,00:00:30-Conclusion,00:05:00">
 *   <source src="video-1080p.mp4" type="video/mp4" label="1080p" res="1080">
 *   <source src="video-720p.mp4" type="video/mp4" label="720p" res="720">
 *   <source src="video-480p.mp4" type="video/mp4" label="480p" res="480">
 *   <track kind="subtitles" src="subs_en.vtt" srclang="en" label="English" default>
 *   <track kind="subtitles" src="subs_es.vtt" srclang="es" label="Español">
 * </video>
 *
 * ---
 *
 * 📄 MIT License
 * Copyright (c) 2026 Mahdi Yasser
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
  
  // ==================== PART 1: CORE & INITIALIZATION ====================
  
  // Inject Font Awesome
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(faLink);
  
  // Default theme colors
  const DEFAULT_THEME = {
    primary: '#87CEFA',    // baby blue
    secondary: '#FFFFFF',  // white
    accent: '#FFD700'      // gold
  };
  
  // Utility: Format time
  function formatTime(totalSeconds){
    if(!isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
    const s = Math.floor(totalSeconds % 60).toString().padStart(2,'0');
    const m = Math.floor(totalSeconds/60 % 60).toString().padStart(2,'0');
    const h = Math.floor(totalSeconds/3600);
    return h>0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  }
  
  // Parse class name to extract config
  function parseClassName(className) {
    const config = {
      instanceNumber: null,
      secure: false,
      theme: 'default',
      color: null
    };
    
    if (!className) return config;
    
    const classes = className.split(/\s+/);
    
    for (const cls of classes) {
      if (!cls.startsWith('vetrom-media')) continue;
      
      const parts = cls.split('-').slice(2); // Remove 'vetrom' and 'media'
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        // Check for instance number
        if (/^\d+$/.test(part)) {
          config.instanceNumber = part;
          continue;
        }
        
        // Check for secure
        if (part === 'secure') {
          config.secure = true;
          continue;
        }
        
        // Check for theme
        if (part === 'dark' || part === 'light' || part === 'auto') {
          config.theme = part;
          
          // Check if next part is a color
          if (i + 1 < parts.length) {
            const nextPart = parts[i + 1];
            // Check if it's a named color or starts with a color format
            if (!/^(secure|\d+)$/.test(nextPart)) {
              config.color = nextPart;
            }
          }
          break;
        }
      }
    }
    
    return config;
  }
  
  // Get theme colors based on config
  function getThemeColors(config) {
    const colors = { ...DEFAULT_THEME };
    
    if (!config.color) return colors;
    
    let primaryColor = config.color;
    
    // Handle hex/rgb/rgba colors
    if (config.color.startsWith('#') || config.color.startsWith('rgb')) {
      primaryColor = config.color;
    }
    
    colors.primary = primaryColor;
    
    // Adjust secondary and accent based on theme
    if (config.theme === 'dark') {
      colors.secondary = '#1a1a1a';  // dark gray
      colors.accent = '#808080';     // medium gray
    } else if (config.theme === 'light') {
      colors.secondary = '#FFFFFF';  // white
      colors.accent = '#E0E0E0';     // light gray
    }
    
    return colors;
  }
  
  // Thumbnail cache for hover previews
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
  
  // MutationObserver to handle dynamically added videos
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'VIDEO' && node.className && node.className.includes('vetrom-media')) {
            initPlayer(node);
          }
          // Check children
          if (node.querySelectorAll) {
            node.querySelectorAll('video[class*="vetrom-media"]').forEach(initPlayer);
          }
        }
      });
    });
  });
  
  // Initialize a single player
  function initPlayer(video) {
    if (video.__vetromPlayer) return;
    try {
      video.__vetromPlayer = new VetromPlayer(video);
    } catch(err) {
      console.error('VetroM Player V2 init error:', err);
    }
  }
  
  // Main initialization function
  function init(){
    document.querySelectorAll('video[class*="vetrom-media"]').forEach(initPlayer);
    
    // Start observing DOM for dynamic content
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run initialization on body load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

// ==================== PART 2: CSS STYLES ====================
  
  const CSS = `
/* Container & Video */
.vetrom-player-container {
  position: relative;
  width: 100%;
  max-width: 980px;
  margin: 18px auto;
  background: #0b0b0b;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  overflow: visible;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}

.vetrom-player-container .vetrom-media-inner {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

.vetrom-player-container video {
  position: absolute;
  left: 0;
  top: 5px;
  width: 100%;
  height: calc(100% - 10px);
  object-fit: contain;
  z-index: 1;
}

.vetrom-player-container.fullscreen video {
  margin-top: 5.6%;
}

/* Controls Bar */
.vetrom-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15));
  border-radius: 8px;
  color: #fff;
  z-index: 40;
  transform: translateY(8px);
  opacity: 0;
  transition: opacity 0.18s, transform 0.18s;
  pointer-events: auto;
}

.vetrom-controls.visible {
  opacity: 1;
  transform: translateY(0);
}

.vetrom-controls .vetrom-btn {
  background: rgba(255,255,255,0);
  border: none;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 32px;
  min-height: 32px;
  color: var(--vetrom-primary, #87CEFA);
  font-size: 18px;
  transition: background 0.2s, transform 0.2s;
}

.vetrom-controls .vetrom-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-1px);
}

.vetrom-controls .vetrom-btn i {
  pointer-events: none;
}

/* Time Display */
.vetrom-time {
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
}

/* Progress Bar */
.vetrom-progress-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.vetrom-progress-bar {
  position: relative;
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  overflow: visible;
}

.vetrom-progress-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: var(--vetrom-primary, linear-gradient(90deg, #87CEFA, #FFD700));
  border-radius: 8px;
  pointer-events: none;
  z-index: 2;
}

.vetrom-progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vetrom-secondary, #fff);
  box-shadow: 0 3px 8px rgba(0,0,0,0.6);
  display: none;
  z-index: 3;
}

.vetrom-progress-bar:hover .vetrom-progress-thumb,
.vetrom-progress-bar.dragging .vetrom-progress-thumb {
  display: block;
}

/* Chapter Markers */
.vetrom-chapter-marker {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 16px;
  background: var(--vetrom-accent, #FFD700);
  border-radius: 3px;
  z-index: 4;
  cursor: pointer;
  opacity: 0.95;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vetrom-chapter-marker:hover {
  transform: scaleY(1.3);
  box-shadow: 0 0 6px var(--vetrom-accent, rgba(255,215,0,0.9));
}

/* Skip Overlay Buttons */
.vetrom-skip-btn {
  position: absolute;
  top: 6px;
  bottom: 14px;
  width: fit-content;
  height: fit-content;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 30;
  cursor: pointer;
  pointer-events: auto;
  background: transparent;
  border: none;
  color: var(--vetrom-primary, #87CEFA);
  font-size: 64px;
  transition: opacity 0.2s, transform 0.2s;
}

.vetrom-skip-btn:hover {
  transform: scale(1.1);
}

.vetrom-skip-back {
  left: 24%;
}

.vetrom-skip-forward {
  right: 24%;
}

.vetrom-skip-btn.visible {
  opacity: 1;
}

.vetrom-skip-btn i {
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));
}

/* Center Overlay */
.vetrom-center-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 45;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.vetrom-center-overlay .big-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255,255,255,0);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease;
  color: var(--vetrom-primary, #87CEFA);
  font-size: 48px;
}

.vetrom-center-overlay .big-btn:hover {
  transform: scale(1.08);
}

.vetrom-center-overlay .big-btn i {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
  transition: color 0.15s ease;
}

.vetrom-center-overlay .big-btn:hover i {
  color: var(--vetrom-accent, #FFD700);
}

.vetrom-center-overlay .big-caption {
  margin-top: 8px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  font-size: 14px;
}

/* Settings Menu */
.vetrom-settings-menu {
  position: absolute;
  bottom: 72px;
  right: 12px;
  background: rgba(12,12,12,0.95);
  padding: 0;
  border-radius: 8px;
  color: #fff;
  z-index: 50;
  display: none;
  width: 280px;
  max-height: 400px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
}

.vetrom-settings-menu.submenu-open {
  overflow-y: auto;
}

.vetrom-settings-menu::-webkit-scrollbar {
  width: 4px;
}

.vetrom-settings-menu::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}

.vetrom-settings-menu::-webkit-scrollbar-thumb {
  background: var(--vetrom-primary, #87CEFA);
  border-radius: 4px;
}

.vetrom-settings-menu::-webkit-scrollbar-thumb:hover {
  background: var(--vetrom-accent, #FFD700);
}

.vetrom-menu-main {
  padding: 10px;
  display: block;
}

.vetrom-menu-main.hidden {
  display: none;
}

.vetrom-menu-submenu-view {
  display: none;
  flex-direction: column;
  height: 100%;
}

.vetrom-menu-submenu-view.active {
  display: flex;
}

.vetrom-submenu-header {
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.02);
  cursor: pointer;
  transition: background 0.2s;
}

.vetrom-submenu-header:hover {
  background: rgba(255,255,255,0.05);
}

.vetrom-submenu-header i {
  color: var(--vetrom-primary, #87CEFA);
  font-size: 16px;
}

.vetrom-submenu-header span {
  font-size: 14px;
  font-weight: 600;
  color: var(--vetrom-accent, #FFD700);
}

.vetrom-submenu-content {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

.vetrom-submenu-content::-webkit-scrollbar {
  width: 4px;
}

.vetrom-submenu-content::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}

.vetrom-submenu-content::-webkit-scrollbar-thumb {
  background: var(--vetrom-primary, #87CEFA);
  border-radius: 4px;
}

.vetrom-submenu-content::-webkit-scrollbar-thumb:hover {
  background: var(--vetrom-accent, #FFD700);
}

.vetrom-menu-section {
  margin-bottom: 8px;
}

.vetrom-menu-section:last-child {
  margin-bottom: 0;
}

.vetrom-menu-header {
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.vetrom-menu-header:hover {
  background: rgba(255,255,255,0.04);
  color: var(--vetrom-primary, #87CEFA);
}

.vetrom-menu-header i {
  font-size: 12px;
  color: var(--vetrom-accent, #FFD700);
}

.vetrom-menu-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s, color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vetrom-menu-item:hover {
  background: rgba(255,255,255,0.04);
  color: var(--vetrom-primary, #87CEFA);
}

.vetrom-menu-item.active {
  background: rgba(255,255,255,0.08);
  color: var(--vetrom-accent, #FFD700);
}

.vetrom-menu-item i {
  font-size: 12px;
  margin-left: 8px;
  color: var(--vetrom-accent, #FFD700);
}

/* Thumbnail Tooltip */
.vetrom-thumb-tooltip {
  position: absolute;
  bottom: 56px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 60;
  pointer-events: none;
}

.vetrom-thumb-tooltip .thumb-time {
  background: rgba(0,0,0,0.75);
  padding: 4px 8px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  margin-bottom: 6px;
}

.vetrom-thumb-tooltip .thumb-img {
  width: 160px;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.6);
  background: #000;
  overflow: hidden;
}

.vetrom-thumb-tooltip canvas {
  width: 160px;
  height: 90px;
  display: block;
}

/* Volume Panel */
.vetrom-volume-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vetrom-volume-panel {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  padding: 15px 8px 8px;
  background: rgba(12,12,12,0.95);
  border-radius: 10px;
  display: none;
  align-items: center;
  z-index: 55;
  flex-direction: column;
  gap: 8px;
}

.vetrom-volume-vertical {
  position: relative;
  width: 12px;
  height: 120px;
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  overflow: visible;
  display: block;
}

.vetrom-volume-vertical .vol-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40%;
  background: var(--vetrom-primary, linear-gradient(180deg, #87CEFA, #FFD700));
  border-radius: 8px;
}

.vetrom-volume-vertical .vol-thumb {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vetrom-secondary, #fff);
  box-shadow: 0 3px 8px rgba(0,0,0,0.6);
  pointer-events: none;
}

.vetrom-volume-percent {
  font-size: 12px;
  color: #fff;
}

/* Secure Context Menu Badge */
.vetrom-secure-badge {
  position: fixed;
  background: rgba(12,12,12,0.95);
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  z-index: 9999;
  display: none;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  pointer-events: auto;
}

.vetrom-secure-badge img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.vetrom-secure-badge a {
  color: var(--vetrom-primary, #87CEFA);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.vetrom-secure-badge a:hover {
  color: var(--vetrom-accent, #FFD700);
}

/* Fullscreen */
.vetrom-player-container.fullscreen {
  max-width: 100vw;
  border-radius: 0;
  box-shadow: none;
}

/* Mobile & Tablet Responsive */
@media (max-width: 1024px) {
  .vetrom-player-container {
    width: 100%;
    margin: 12px auto;
    border-radius: 6px;
  }

  .vetrom-player-container.fullscreen video {
    margin-top: 0;
  }

  .vetrom-controls {
    height: 48px;
    padding: 4px 8px;
    gap: 6px;
  }

  .vetrom-controls .vetrom-btn {
    min-width: 28px;
    min-height: 28px;
    padding: 4px;
    font-size: 16px;
  }

  .vetrom-progress-thumb {
    width: 10px;
    height: 10px;
  }

  .vetrom-skip-btn {
    font-size: 48px;
  }

  .vetrom-center-overlay .big-btn {
    width: 60px;
    height: 60px;
    font-size: 40px;
  }

  .vetrom-volume-panel {
    width: 48px;
    padding: 10px 6px 6px;
  }

  .vetrom-volume-vertical {
    width: 10px;
    height: 100px;
  }

  #vetrom-vol {
    display: none;
  }

  .vetrom-thumb-tooltip .thumb-img {
    width: 120px;
  }

  .vetrom-thumb-tooltip .thumb-time {
    font-size: 10px;
    padding: 3px 6px;
  }

  .vetrom-settings-menu {
    bottom: 60px;
    width: 240px;
    padding: 0;
  }

  .vetrom-menu-item {
    font-size: 12px;
    padding: 8px 10px;
  }
}
`;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

// ==================== PART 3: VETROMPL AYER CLASS ====================
  
  class VetromPlayer {
    constructor(video) {
      this.video = video;
      this.container = null;
      this.innerWrap = null;
      this.controls = null;
      this.thumbTooltip = null;
      this.settingsMenu = null;
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
      this.chapterData = [];
      this.qualitySources = [];
      this.subtitleTracks = [];
      this.currentQuality = null;
      this.currentSubtitle = null;
      this.config = parseClassName(video.className);
      this.themeColors = getThemeColors(this.config);
      this.secureBadge = null;
      this.currentSubmenu = null;
      
      this.init();
    }

    init() {
      this.video.controls = false;
      this.buildUI();
      this.parseQualitySources();
      this.parseSubtitleTracks();
      this.attachEvents();
      this.loadChapters();
      
      const src = this.video.currentSrc || this.video.src;
      if (src) {
        this.thumbVideo = createThumbVideo(src);
      }
      
      this.applyDynamicHeight();
      this.applyThemeColors();
      
      this.video.addEventListener('loadedmetadata', () => this.applyDynamicHeight());
      new ResizeObserver(() => this.applyDynamicHeight()).observe(this.innerWrap);
      
      // Initialize subtitle if default is set
      this.initializeDefaultSubtitle();
    }

    buildUI() {
      // Container & inner wrap
      const c = document.createElement('div');
      c.className = 'vetrom-player-container';
      if (this.config.instanceNumber) {
        c.setAttribute('data-instance', this.config.instanceNumber);
      }
      
      const inner = document.createElement('div');
      inner.className = 'vetrom-media-inner';
      this.video.parentNode.insertBefore(c, this.video);
      c.appendChild(inner);
      inner.appendChild(this.video);
      this.container = c;
      this.innerWrap = inner;

      // Controls
      const controls = document.createElement('div');
      controls.className = 'vetrom-controls';
      controls.innerHTML = `
        <button class="vetrom-btn vetrom-play-btn" id="vetrom-play" title="Play/Pause">
          <i class="fas fa-play"></i>
        </button>
        <div class="vetrom-time vetrom-current-time">00:00</div>
        <div class="vetrom-progress-wrap">
          <div class="vetrom-progress-bar" aria-hidden="true">
            <div class="vetrom-progress-line"></div>
            <div class="vetrom-progress-thumb" aria-hidden="true"></div>
          </div>
        </div>
        <div class="vetrom-volume-wrap">
          <button class="vetrom-btn vetrom-volume-btn" id="vetrom-vol" title="Volume">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
        <button class="vetrom-btn vetrom-settings-btn" title="Settings">
          <i class="fas fa-cog"></i>
        </button>
        <button class="vetrom-btn vetrom-fullscreen-btn" title="Fullscreen">
          <i class="fas fa-expand"></i>
        </button>
      `;
      c.appendChild(controls);
      this.controls = controls;

      // Skip buttons
      const skipBack = document.createElement('button');
      skipBack.className = 'vetrom-skip-btn vetrom-skip-back';
      skipBack.dataset.skip = -10;
      skipBack.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
      c.appendChild(skipBack);
      
      const skipFwd = document.createElement('button');
      skipFwd.className = 'vetrom-skip-btn vetrom-skip-forward';
      skipFwd.dataset.skip = 10;
      skipFwd.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>';
      c.appendChild(skipFwd);
      this.skipBtns = [skipBack, skipFwd];

      // Center overlay
      const center = document.createElement('div');
      center.className = 'vetrom-center-overlay';
      center.innerHTML = `
        <button class="big-btn" title="Play/Pause">
          <i class="fas fa-play"></i>
        </button>
        <div class="big-caption"></div>
      `;
      c.appendChild(center);
      this.centerOverlay = center;

      // Settings menu
      const settingsMenu = document.createElement('div');
      settingsMenu.className = 'vetrom-settings-menu';
      this.buildSettingsMenu(settingsMenu);
      c.appendChild(settingsMenu);
      this.settingsMenu = settingsMenu;

      // Tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'vetrom-thumb-tooltip';
      tooltip.style.display = 'none';
      tooltip.innerHTML = `
        <div class="thumb-time">00:00</div>
        <div class="thumb-img"><canvas width="160" height="90"></canvas></div>
      `;
      c.appendChild(tooltip);
      this.thumbTooltip = tooltip;
      this.thumbCanvas = tooltip.querySelector('canvas');
      this.thumbTimeDom = tooltip.querySelector('.thumb-time');

      // Volume panel
      const volPanel = document.createElement('div');
      volPanel.className = 'vetrom-volume-panel';
      volPanel.style.display = 'none';
      volPanel.innerHTML = `
        <div class="vetrom-volume-vertical">
          <div class="vol-fill"></div>
          <div class="vol-thumb"></div>
        </div>
        <div class="vetrom-volume-percent">0%</div>
      `;
      const volWrap = controls.querySelector('.vetrom-volume-wrap');
      volWrap.appendChild(volPanel);
      this.volumePanel = volPanel;
      this.volumeTrack = volPanel.querySelector('.vetrom-volume-vertical');
      this.volumeFill = volPanel.querySelector('.vol-fill');
      this.volumeThumb = volPanel.querySelector('.vol-thumb');
      this.volumePercent = volPanel.querySelector('.vetrom-volume-percent');

      // Secure badge (if enabled)
      if (this.config.secure) {
        this.createSecureBadge();
      }

      // Refs
      this.playBtn = controls.querySelector('.vetrom-play-btn');
      this.centerBigBtn = center.querySelector('.big-btn');
      this.centerCaption = center.querySelector('.big-caption');
      this.currentTimeDom = controls.querySelector('.vetrom-current-time');
      this.progressBar = controls.querySelector('.vetrom-progress-bar');
      this.progressLine = controls.querySelector('.vetrom-progress-line');
      this.progressThumb = controls.querySelector('.vetrom-progress-thumb');
      this.volumeBtn = controls.querySelector('.vetrom-volume-btn');
      this.fullscreenBtn = controls.querySelector('.vetrom-fullscreen-btn');
      this.settingsBtn = controls.querySelector('.vetrom-settings-btn');
    }

    buildSettingsMenu(menu) {
      let html = `
        <div class="vetrom-menu-main">
          <div class="vetrom-menu-section">
            <div class="vetrom-menu-header" data-section="speed">
              Speed <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div class="vetrom-menu-section" id="quality-section" style="display:none">
            <div class="vetrom-menu-header" data-section="quality">
              Quality <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div class="vetrom-menu-section" id="subtitle-section" style="display:none">
            <div class="vetrom-menu-header" data-section="subtitles">
              Subtitles <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div class="vetrom-menu-section" id="chapters-section" style="display:none">
            <div class="vetrom-menu-header" data-section="chapters">
              Chapters <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
        
        <div class="vetrom-menu-submenu-view" data-submenu="speed">
          <div class="vetrom-submenu-header" data-back="speed">
            <i class="fas fa-chevron-left"></i>
            <span>Speed</span>
          </div>
          <div class="vetrom-submenu-content">
            <div class="vetrom-menu-item" data-speed="0.5">0.5x</div>
            <div class="vetrom-menu-item" data-speed="0.75">0.75x</div>
            <div class="vetrom-menu-item active" data-speed="1">Normal <i class="fas fa-check"></i></div>
            <div class="vetrom-menu-item" data-speed="1.25">1.25x</div>
            <div class="vetrom-menu-item" data-speed="1.5">1.5x</div>
            <div class="vetrom-menu-item" data-speed="2">2x</div>
          </div>
        </div>
        
        <div class="vetrom-menu-submenu-view" data-submenu="quality">
          <div class="vetrom-submenu-header" data-back="quality">
            <i class="fas fa-chevron-left"></i>
            <span>Quality</span>
          </div>
          <div class="vetrom-submenu-content"></div>
        </div>
        
        <div class="vetrom-menu-submenu-view" data-submenu="subtitles">
          <div class="vetrom-submenu-header" data-back="subtitles">
            <i class="fas fa-chevron-left"></i>
            <span>Subtitles</span>
          </div>
          <div class="vetrom-submenu-content"></div>
        </div>
        
        <div class="vetrom-menu-submenu-view" data-submenu="chapters">
          <div class="vetrom-submenu-header" data-back="chapters">
            <i class="fas fa-chevron-left"></i>
            <span>Chapters</span>
          </div>
          <div class="vetrom-submenu-content"></div>
        </div>
      `;
      
      menu.innerHTML = html;
      this.menuMain = menu.querySelector('.vetrom-menu-main');
    }

    parseQualitySources() {
      const sources = this.video.querySelectorAll('source[label][res]');
      if (sources.length === 0) return;
      
      sources.forEach(source => {
        this.qualitySources.push({
          src: source.src,
          label: source.getAttribute('label'),
          res: source.getAttribute('res'),
          type: source.type
        });
      });
      
      if (this.qualitySources.length > 0) {
        this.currentQuality = this.qualitySources[0];
        this.populateQualityMenu();
      }
    }

    populateQualityMenu() {
      const section = this.settingsMenu.querySelector('#quality-section');
      const submenu = this.settingsMenu.querySelector('[data-submenu="quality"] .vetrom-submenu-content');
      
      if (!section || !submenu || this.qualitySources.length === 0) return;
      
      section.style.display = 'block';
      
      let html = '';
      this.qualitySources.forEach((quality, index) => {
        const active = index === 0 ? 'active' : '';
        const checkIcon = index === 0 ? '<i class="fas fa-check"></i>' : '';
        html += `<div class="vetrom-menu-item ${active}" data-quality="${index}">${quality.label} ${checkIcon}</div>`;
      });
      
      submenu.innerHTML = html;
    }

    parseSubtitleTracks() {
      const tracks = this.video.querySelectorAll('track[kind="subtitles"]');
      if (tracks.length === 0) return;
      
      tracks.forEach((track, index) => {
        this.subtitleTracks.push({
          element: track,
          label: track.label || track.srclang || `Track ${index + 1}`,
          srclang: track.srclang,
          default: track.hasAttribute('default')
        });
      });
      
      if (this.subtitleTracks.length > 0) {
        this.populateSubtitleMenu();
      }
    }

    populateSubtitleMenu() {
      const section = this.settingsMenu.querySelector('#subtitle-section');
      const submenu = this.settingsMenu.querySelector('[data-submenu="subtitles"] .vetrom-submenu-content');
      
      if (!section || !submenu || this.subtitleTracks.length === 0) return;
      
      section.style.display = 'block';
      
      let html = '<div class="vetrom-menu-item" data-subtitle="off">Off</div>';
      this.subtitleTracks.forEach((track, index) => {
        const active = track.default ? 'active' : '';
        const checkIcon = track.default ? '<i class="fas fa-check"></i>' : '';
        html += `<div class="vetrom-menu-item ${active}" data-subtitle="${index}">${track.label} ${checkIcon}</div>`;
      });
      
      submenu.innerHTML = html;
    }

    initializeDefaultSubtitle() {
      const defaultTrack = this.subtitleTracks.find(t => t.default);
      if (defaultTrack) {
        defaultTrack.element.track.mode = 'showing';
        this.currentSubtitle = this.subtitleTracks.indexOf(defaultTrack);
      } else {
        this.subtitleTracks.forEach(t => t.element.track.mode = 'hidden');
      }
    }

    createSecureBadge() {
      const badge = document.createElement('div');
      badge.className = 'vetrom-secure-badge';
      badge.innerHTML = `
        <img src="https://vetrom.mahdiyasser.site/favicon.png" alt="VetroM">
        <a href="https://api.mahdiyasser.site/player/v2/" target="_blank">VetroM Player V2</a>
      `;
      document.body.appendChild(badge);
      this.secureBadge = badge;
    }

    applyThemeColors() {
      this.container.style.setProperty('--vetrom-primary', this.themeColors.primary);
      this.container.style.setProperty('--vetrom-secondary', this.themeColors.secondary);
      this.container.style.setProperty('--vetrom-accent', this.themeColors.accent);
      
      if (this.secureBadge) {
        this.secureBadge.style.setProperty('--vetrom-primary', this.themeColors.primary);
        this.secureBadge.style.setProperty('--vetrom-accent', this.themeColors.accent);
      }
    }

    applyDynamicHeight() {
      const width = this.innerWrap.clientWidth || this.innerWrap.getBoundingClientRect().width;
      const vw = this.video.videoWidth || this.video.naturalWidth || 16;
      const vh = this.video.videoHeight || this.video.naturalHeight || 9;
      const ratio = (vw > 0 && vh > 0) ? (vh / vw) : (9/16);
      const videoHeightPx = Math.max(20, Math.round(width * ratio));
      const totalHeight = videoHeightPx + 10;
      this.innerWrap.style.height = totalHeight + 'px';
    }

    loadChapters() {
      if (!this.video.id) return;
      
      const idParts = this.video.id.split('-');
      if (idParts.length === 0) return;
      
      this.chapterData = [];
      
      idParts.forEach((part, index) => {
        const match = part.match(/^(.+?),(\d{2}:\d{2}:\d{2})$/);
        if (match) {
          const label = match[1].trim();
          const timeStr = match[2];
          const secs = this.parseTimeToken(timeStr);
          if (secs !== null) {
            this.chapterData.push({ time: secs, label });
          }
        }
      });
      
      if (this.chapterData.length > 0) {
        this.populateChaptersMenu();
        this.renderChapterMarkers();
      }
    }

    populateChaptersMenu() {
      const section = this.settingsMenu.querySelector('#chapters-section');
      const submenu = this.settingsMenu.querySelector('[data-submenu="chapters"] .vetrom-submenu-content');
      
      if (!section || !submenu || this.chapterData.length === 0) return;
      
      section.style.display = 'block';
      
      let html = '';
      this.chapterData.forEach((ch, index) => {
        html += `<div class="vetrom-menu-item" data-chapter="${index}">${ch.label} – ${formatTime(ch.time)}</div>`;
      });
      
      submenu.innerHTML = html;
    }

    renderChapterMarkers() {
      const existing = this.progressBar.querySelectorAll('.vetrom-chapter-marker');
      existing.forEach(n => n.remove());
      
      const dur = this.video.duration || 0;
      if (!(dur > 0)) {
        this.video.addEventListener('loadedmetadata', () => this.renderChapterMarkers(), {once: true});
        return;
      }
      
      this.chapterData.forEach(ch => {
        const pct = (ch.time / this.video.duration) * 100;
        const marker = document.createElement('div');
        marker.className = 'vetrom-chapter-marker';
        marker.style.left = pct + '%';
        marker.title = ch.label + ' – ' + formatTime(ch.time);
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          this.video.currentTime = ch.time;
          this.showControls(900);
        });
        this.progressBar.appendChild(marker);
      });
    }

    parseTimeToken(token) {
      if (!token) return null;
      const parts = token.split(':').map(s => s.trim());
      if (parts.length === 3) {
        const h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        const s = parseInt(parts[2], 10) || 0;
        return h * 3600 + m * 60 + s;
      } else if (parts.length === 2) {
        const m = parseInt(parts[0], 10) || 0;
        const s = parseInt(parts[1], 10) || 0;
        return m * 60 + s;
      } else {
        const n = parseFloat(parts[0]);
        return isNaN(n) ? null : n;
      }
    }

    openSubmenu(section) {
      this.currentSubmenu = section;
      this.menuMain.classList.add('hidden');
      const submenuView = this.settingsMenu.querySelector(`[data-submenu="${section}"]`);
      if (submenuView) {
        submenuView.classList.add('active');
        this.settingsMenu.classList.add('submenu-open');
      }
    }

    closeSubmenu() {
      if (this.currentSubmenu) {
        const submenuView = this.settingsMenu.querySelector(`[data-submenu="${this.currentSubmenu}"]`);
        if (submenuView) {
          submenuView.classList.remove('active');
        }
        this.currentSubmenu = null;
      }
      this.menuMain.classList.remove('hidden');
      this.settingsMenu.classList.remove('submenu-open');
    }

// ==================== PART 4: EVENT HANDLERS & METHODS ====================
    
    attachEvents() {
      // Play/Pause
      this.playBtn.addEventListener('click', e => { e.stopPropagation(); this.togglePlay(); });
      this.centerBigBtn.addEventListener('click', e => { e.stopPropagation(); this.togglePlay(); });

      this.video.addEventListener('play', () => this.onPlay());
      this.video.addEventListener('pause', () => this.onPause());
      this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.video.addEventListener('loadedmetadata', () => this.onTimeUpdate());

      // Volume
      this.volumeBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.video.muted = !this.video.muted;
        if (!this.video.muted && (this.video.volume === 0 || !isFinite(this.video.volume))) {
          this.video.volume = 0.6;
        }
        this.updateVolumeUI();
      });

      this.volumeBtn.addEventListener('mouseenter', () => this.showVolumePanel());
      this.volumeBtn.addEventListener('mouseleave', () => setTimeout(() => {
        if (!this.volumePanel.matches(':hover')) this.hideVolumePanel();
      }, 120));
      this.volumePanel.addEventListener('mouseenter', () => this.showVolumePanel());
      this.volumePanel.addEventListener('mouseleave', () => this.hideVolumePanel());

      this.volumeTrack.addEventListener('pointerdown', e => {
        e.preventDefault();
        this.onVolumePointer(e);
        const move = ev => this.onVolumePointer(ev);
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });

      // Skip buttons
      this.skipBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const skip = parseFloat(btn.dataset.skip) || 10;
          this.video.currentTime = Math.min(Math.max(0, this.video.currentTime + skip), this.video.duration || 0);
          this.showControls(900);
        });
      });

      // Progress bar
      this.progressBar.addEventListener('pointerdown', e => {
        e.preventDefault();
        this.dragging = true;
        this.progressBar.classList.add('dragging');
        this.setCurrentTimeFromEvent(e);
      });
      
      window.addEventListener('pointermove', e => {
        if (this.dragging) this.setCurrentTimeFromEvent(e);
      });
      
      window.addEventListener('pointerup', e => {
        if (this.dragging) {
          this.dragging = false;
          this.progressBar.classList.remove('dragging');
          this.setCurrentTimeFromEvent(e);
          this.showControls(900);
        }
      });

      this.progressBar.addEventListener('mousemove', e => this.onProgressHover(e));
      this.progressBar.addEventListener('mouseleave', () => this.hideThumbTooltip());

      // Video click toggle controls
      this.video.addEventListener('click', e => {
        if (e.detail === 2) return;
        if (!this.dragging) {
          if (this.controlsVisible) {
            this.hideControls();
          } else {
            this.showControls(this.video.paused ? 0 : 2000);
          }
        }
      });

      // Double click fullscreen
      this.video.addEventListener('dblclick', () => this.toggleFullscreen());

      // Fullscreen button
      this.fullscreenBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleFullscreen();
      });

      // Settings menu
      this.settingsBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleSettings();
      });

      // Settings menu interactions
      this.settingsMenu.addEventListener('click', e => {
        e.stopPropagation();
        
        const header = e.target.closest('.vetrom-menu-header');
        if (header) {
          const section = header.dataset.section;
          this.openSubmenu(section);
          return;
        }
        
        const backBtn = e.target.closest('.vetrom-submenu-header');
        if (backBtn) {
          this.closeSubmenu();
          return;
        }
        
        const item = e.target.closest('.vetrom-menu-item');
        if (!item) return;
        
        // Speed
        if (item.dataset.speed) {
          this.video.playbackRate = parseFloat(item.dataset.speed);
          const submenu = this.settingsMenu.querySelector('[data-submenu="speed"] .vetrom-submenu-content');
          submenu.querySelectorAll('.vetrom-menu-item').forEach(el => {
            el.classList.remove('active');
            const icon = el.querySelector('i');
            if (icon) icon.remove();
          });
          item.classList.add('active');
          const icon = document.createElement('i');
          icon.className = 'fas fa-check';
          item.appendChild(icon);
          this.showControls(900);
        }
        
        // Quality
        if (item.dataset.quality !== undefined) {
          const index = parseInt(item.dataset.quality);
          this.changeQuality(index);
          const submenu = this.settingsMenu.querySelector('[data-submenu="quality"] .vetrom-submenu-content');
          submenu.querySelectorAll('.vetrom-menu-item').forEach(el => {
            el.classList.remove('active');
            const icon = el.querySelector('i');
            if (icon) icon.remove();
          });
          item.classList.add('active');
          const icon = document.createElement('i');
          icon.className = 'fas fa-check';
          item.appendChild(icon);
        }
        
        // Subtitles
        if (item.dataset.subtitle !== undefined) {
          const subtitle = item.dataset.subtitle;
          this.changeSubtitle(subtitle);
          const submenu = this.settingsMenu.querySelector('[data-submenu="subtitles"] .vetrom-submenu-content');
          submenu.querySelectorAll('.vetrom-menu-item').forEach(el => {
            el.classList.remove('active');
            const icon = el.querySelector('i');
            if (icon) icon.remove();
          });
          item.classList.add('active');
          const icon = document.createElement('i');
          icon.className = 'fas fa-check';
          item.appendChild(icon);
        }
        
        // Chapters
        if (item.dataset.chapter !== undefined) {
          const index = parseInt(item.dataset.chapter);
          this.video.currentTime = this.chapterData[index].time;
          this.settingsMenu.style.display = 'none';
          this.closeSubmenu();
          this.showControls(900);
        }
      });

      // Close menus on outside click
      document.addEventListener('click', e => {
        if (this.settingsMenu && this.settingsMenu.style.display === 'block' && 
            !this.controls.contains(e.target) && !this.settingsMenu.contains(e.target)) {
          this.settingsMenu.style.display = 'none';
          this.closeSubmenu();
        }
        if (this.secureBadge && this.secureBadge.style.display === 'flex' &&
            !this.secureBadge.contains(e.target)) {
          this.secureBadge.style.display = 'none';
        }
      });

      // Secure mode context menu
      if (this.config.secure) {
        this.video.addEventListener('contextmenu', e => {
          e.preventDefault();
          this.showSecureBadge(e.clientX, e.clientY);
        });
        
        this.container.addEventListener('contextmenu', e => {
          if (e.target === this.video || this.innerWrap.contains(e.target)) {
            e.preventDefault();
            this.showSecureBadge(e.clientX, e.clientY);
          }
        });
        
        // Mobile long press
        let pressTimer;
        this.video.addEventListener('touchstart', e => {
          pressTimer = setTimeout(() => {
            const touch = e.touches[0];
            this.showSecureBadge(touch.clientX, touch.clientY);
          }, 500);
        });
        
        this.video.addEventListener('touchend', () => {
          clearTimeout(pressTimer);
        });
        
        this.video.addEventListener('touchmove', () => {
          clearTimeout(pressTimer);
        });
      }

      // Show/hide controls on movement
      let moveTimer = null;
      this.container.addEventListener('mousemove', () => {
        this.showControls();
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => {
          if (!this.video.paused) this.hideControls();
        }, 2000);
      });
      
      this.container.addEventListener('mouseenter', () => this.showControls());
      this.container.addEventListener('mouseleave', () => {
        if (!this.video.paused) this.hideControls();
      });

      // Keyboard controls
      this.container.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          e.preventDefault();
          this.togglePlay();
        }
        if (e.key === 'f') this.toggleFullscreen();
        
        const dur = this.video.duration || 0;
        
        if (e.key === 'ArrowRight' || e.key === 'l') {
          e.preventDefault();
          this.video.currentTime = Math.min(dur, this.video.currentTime + 5);
          this.showControls(900);
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'j') {
          e.preventDefault();
          this.video.currentTime = Math.max(0, this.video.currentTime - 5);
          this.showControls(900);
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const newVolume = Math.min(1, this.video.volume + 0.05);
          this.video.volume = newVolume;
          if (newVolume > 0 && this.video.muted) this.video.muted = false;
          this.updateVolumeUI();
          this.showControls(900);
          this.showVolumePanel();
          setTimeout(() => this.hideVolumePanel(), 500);
        }
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const newVolume = Math.max(0, this.video.volume - 0.05);
          this.video.volume = newVolume;
          if (newVolume === 0) this.video.muted = true;
          this.updateVolumeUI();
          this.showControls(900);
          this.showVolumePanel();
          setTimeout(() => this.hideVolumePanel(), 500);
        }
        
        if (e.key === 'm') {
          e.preventDefault();
          this.video.muted = !this.video.muted;
          if (!this.video.muted && (this.video.volume === 0 || !isFinite(this.video.volume))) {
            this.video.volume = 0.6;
          }
          this.updateVolumeUI();
          this.showControls(900);
          this.showVolumePanel();
          setTimeout(() => this.hideVolumePanel(), 500);
        }
      });

      // Mobile touch controls
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        this.video.addEventListener('click', e => {
          if (e.detail === 2) return;
          if (this.dragging) return;
          e.stopPropagation();
          if (this.controlsVisible) {
            this.hideControls();
          } else {
            this.showControls(this.video.paused ? 0 : 2000);
          }
        });
        
        this.container.addEventListener('touchstart', () => this.showControls(this.video.paused ? 0 : 2000));
        this.container.addEventListener('touchend', () => {
          if (!this.video.paused) this.hideControls(2000);
        });
      }

      // Initial volume state
      if (this.video.volume == null || !isFinite(this.video.volume)) this.video.volume = 1;
      this.updateVolumeUI();

      // Initial controls visibility
      if (this.video.paused) this.showControls();
      else this.hideControls(1200);
    }

    togglePlay() {
      if (this.video.paused) {
        const p = this.video.play();
        if (p && p.catch) p.catch(err => {
          console.warn('Play failed:', err);
          this.showControls();
        });
      } else {
        this.video.pause();
      }
      this.showControls(900);
    }

    onPlay() {
      this.playBtn.querySelector('i').className = 'fas fa-pause';
      this.centerBigBtn.querySelector('i').className = 'fas fa-pause';
      this.centerCaption.textContent = '';
      this.showControls(1000);
      this.hideControls(2000);
    }

    onPause() {
      this.playBtn.querySelector('i').className = 'fas fa-play';
      this.centerBigBtn.querySelector('i').className = 'fas fa-play';
      this.centerCaption.textContent = '';
      this.showControls();
    }

    onTimeUpdate() {
      this.currentTimeDom.textContent = formatTime(this.video.currentTime);
      const dur = this.video.duration || 0;
      const percent = dur > 0 ? (this.video.currentTime / dur) * 100 : 0;
      this.progressLine.style.width = percent + '%';
      this.progressThumb.style.left = percent + '%';
    }

    setCurrentTimeFromEvent(e) {
      const rect = this.progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const pct = x / rect.width;
      const t = (this.video.duration || 0) * pct;
      this.progressLine.style.width = (pct * 100) + '%';
      this.progressThumb.style.left = (pct * 100) + '%';
      try {
        this.video.currentTime = t;
      } catch(err) {}
    }

    onVolumePointer(e) {
      const rect = this.volumeTrack.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const pct = 1 - (y / rect.height);
      this.video.volume = Math.round(Math.max(0, Math.min(1, pct)) * 100) / 100;
      if (this.video.volume > 0) this.video.muted = false;
      this.updateVolumeUI();
    }

    updateVolumeUI() {
      const vol = this.video.volume || 0;
      const muted = this.video.muted || vol === 0;
      
      const icon = this.volumeBtn.querySelector('i');
      if (muted) {
        icon.className = 'fas fa-volume-mute';
      } else if (vol < 0.5) {
        icon.className = 'fas fa-volume-down';
      } else {
        icon.className = 'fas fa-volume-up';
      }
      
      const pct = Math.round(vol * 100);
      const h = this.volumeTrack.clientHeight || 120;
      const fillH = Math.round((pct / 100) * h);
      this.volumeFill.style.height = fillH + 'px';
      this.volumeThumb.style.top = (h - fillH) + 'px';
      this.volumePercent.textContent = pct + '%';
    }

    showVolumePanel() {
      this.volumePanel.style.display = 'flex';
      this.updateVolumeUI();
    }

    hideVolumePanel() {
      this.volumePanel.style.display = 'none';
    }

    showControls(timeout) {
      this.controlsVisible = true;
      this.controls.classList.add('visible');
      this.centerOverlay.style.display = 'flex';
      this.skipBtns.forEach(b => {
        b.classList.add('visible');
        b.style.display = 'flex';
      });
      
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
      }
      
      if (timeout && !this.video.paused) {
        this.idleTimer = setTimeout(() => this.hideControls(), timeout);
      }
    }

    hideControls(delay) {
      if (this.video.paused) return;
      
      if (delay) {
        if (this.idleTimer) clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
          this.controlsVisible = false;
          this.controls.classList.remove('visible');
          this.centerOverlay.style.display = 'none';
          this.skipBtns.forEach(b => {
            b.classList.remove('visible');
            b.style.display = 'none';
          });
        }, delay);
      } else {
        this.controlsVisible = false;
        this.controls.classList.remove('visible');
        this.centerOverlay.style.display = 'none';
        this.skipBtns.forEach(b => {
          b.classList.remove('visible');
          b.style.display = 'none';
        });
      }
    }

    toggleSettings() {
      if (this.settingsMenu.style.display === 'block') {
        this.settingsMenu.style.display = 'none';
        this.closeSubmenu();
      } else {
        this.settingsMenu.style.display = 'block';
      }
    }

    toggleFullscreen() {
      const el = this.container;
      const doc = document;
      const screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
      
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        el.classList.add('fullscreen');
        this.fullscreenBtn.querySelector('i').className = 'fas fa-compress';
        
        if (screenOrientation && screenOrientation.lock) {
          screenOrientation.lock('landscape').catch(err => {
            if (err.name !== 'NotSupportedError') {
              console.warn('Screen orientation lock failed:', err);
            }
          });
        }
      } else {
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        el.classList.remove('fullscreen');
        this.fullscreenBtn.querySelector('i').className = 'fas fa-expand';
        
        if (screenOrientation && screenOrientation.unlock) {
          screenOrientation.unlock();
        }
      }
      this.showControls(1500);
    }

    changeQuality(index) {
      if (index < 0 || index >= this.qualitySources.length) return;
      
      const currentTime = this.video.currentTime;
      const wasPlaying = !this.video.paused;
      
      this.currentQuality = this.qualitySources[index];
      this.video.src = this.currentQuality.src;
      this.video.load();
      
      this.video.addEventListener('loadedmetadata', () => {
        this.video.currentTime = currentTime;
        if (wasPlaying) {
          this.video.play().catch(err => console.warn('Play after quality change failed:', err));
        }
      }, { once: true });
    }

    changeSubtitle(subtitle) {
      this.subtitleTracks.forEach((track, index) => {
        if (subtitle === 'off') {
          track.element.track.mode = 'hidden';
        } else if (index === parseInt(subtitle)) {
          track.element.track.mode = 'showing';
          this.currentSubtitle = index;
        } else {
          track.element.track.mode = 'hidden';
        }
      });
    }

    showSecureBadge(x, y) {
      if (!this.secureBadge) return;
      
      this.secureBadge.style.display = 'flex';
      this.secureBadge.style.left = x + 'px';
      this.secureBadge.style.top = y + 'px';
    }

    onProgressHover(e) {
      const containerRect = this.container.getBoundingClientRect();
      const left = e.clientX - containerRect.left;
      this.thumbTooltip.style.left = left + 'px';
      this.thumbTooltip.style.display = 'flex';
      
      const barRect = this.progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(barRect.width, e.clientX - barRect.left));
      const pct = x / barRect.width;
      const t = (this.video.duration || 0) * pct;
      this.thumbTimeDom.textContent = formatTime(t);
      
      const key = Math.round(t);
      if (thumbCache.has(key)) {
        this.paintThumb(thumbCache.get(key));
      } else {
        this.generateLowResThumb(key).then(dataUrl => {
          if (dataUrl) {
            thumbCache.set(key, dataUrl);
            this.paintThumb(dataUrl);
          }
        }).catch(() => {});
      }
    }

    hideThumbTooltip() {
      this.thumbTooltip.style.display = 'none';
    }

    paintThumb(dataUrl) {
      const canvas = this.thumbCanvas;
      const ctx = canvas.getContext('2d');
      if (!dataUrl) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const img = new Image();
      img.onload = () => {
        canvas.width = 160;
        canvas.height = Math.round(160 * img.height / img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
    }

    generateLowResThumb(timeSec) {
      if (!this.thumbVideo) return Promise.resolve(null);
      const v = this.thumbVideo;
      return new Promise((resolve) => {
        let timeout = null;
        function cleanup() {
          v.removeEventListener('seeked', onseeked);
          v.removeEventListener('error', onerror);
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
        }
        function onerror() {
          cleanup();
          resolve(null);
        }
        function onseeked() {
          try {
            const vw = v.videoWidth || 320;
            const vh = v.videoHeight || 180;
            const targetW = 160;
            const scale = Math.max(0.2, Math.min(1, targetW / vw));
            const cw = Math.round(vw * scale);
            const ch = Math.round(vh * scale);
            const canvas = document.createElement('canvas');
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(v, 0, 0, cw, ch);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.55);
            cleanup();
            resolve(dataUrl);
          } catch(err) {
            cleanup();
            resolve(null);
          }
        }
        v.addEventListener('seeked', onseeked);
        v.addEventListener('error', onerror);
        const dur = v.duration || this.video.duration || 0;
        const t = Math.max(0, Math.min(dur, timeSec));
        try {
          v.currentTime = t;
        } catch(e) {
          try {
            v.load();
            v.currentTime = t;
          } catch(_) {}
        }
        timeout = setTimeout(() => {
          cleanup();
          resolve(null);
        }, 1500);
      });
    }
  }

})();

// ==================== PART 5: VIDEO POSITION PERSISTENCE ====================

(function(){
  // Generate a consistent unique identifier for each video based on DOM position and attributes
  function generateVideoId(video) {
    const src = video.currentSrc || video.src || '';
    if (!src) return null;
    
    // Hash the source URL
    let srcHash = 0;
    for (let i = 0; i < src.length; i++) {
      const char = src.charCodeAt(i);
      srcHash = ((srcHash << 5) - srcHash) + char;
      srcHash = srcHash & srcHash;
    }
    
    // Get all vetrom videos on the page
    const allVideos = Array.from(document.querySelectorAll('video[class*="vetrom-media"]'));
    
    // Find videos with the same source
    const sameSourceVideos = allVideos.filter(v => {
      const vSrc = v.currentSrc || v.src || '';
      return vSrc === src;
    });
    
    // Get the index among videos with the same source
    const indexAmongSameSource = sameSourceVideos.indexOf(video);
    
    // Build unique identifier parts
    const parts = [Math.abs(srcHash)];
    
    // Add instance number if available
    const config = video.__vetromPlayer?.config;
    if (config?.instanceNumber) {
      parts.push(`inst${config.instanceNumber}`);
    }
    
    // Add index among same-source videos (if more than one video with same source)
    if (sameSourceVideos.length > 1 && indexAmongSameSource >= 0) {
      parts.push(`idx${indexAmongSameSource}`);
    }
    
    // Add chapter data hash if available (from id attribute)
    if (video.id) {
      let idHash = 0;
      for (let i = 0; i < video.id.length; i++) {
        const char = video.id.charCodeAt(i);
        idHash = ((idHash << 5) - idHash) + char;
        idHash = idHash & idHash;
      }
      parts.push(`ch${Math.abs(idHash)}`);
    }
    
    // Add parent container class/id if available for more context
    const container = video.closest('.vetrom-player-container');
    if (container) {
      const parentId = container.getAttribute('data-instance');
      if (parentId) {
        parts.push(`p${parentId}`);
      }
    }
    
    return `vetrom_${parts.join('_')}`;
  }
  
  // Save video position to localStorage
  function saveVideoPosition(video) {
    const videoId = generateVideoId(video);
    if (!videoId) return;
    
    const position = {
      time: video.currentTime,
      duration: video.duration,
      timestamp: Date.now(),
      src: video.currentSrc || video.src
    };
    
    try {
      localStorage.setItem(videoId, JSON.stringify(position));
    } catch(e) {
      console.warn('Failed to save video position:', e);
    }
  }
  
  // Load video position from localStorage
  function loadVideoPosition(video) {
    const videoId = generateVideoId(video);
    if (!videoId) return null;
    
    try {
      const saved = localStorage.getItem(videoId);
      if (!saved) return null;
      
      const position = JSON.parse(saved);
      
      // Check if saved position is from within the last 30 days
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - position.timestamp > thirtyDaysInMs) {
        localStorage.removeItem(videoId);
        return null;
      }
      
      // Check if the source matches
      const currentSrc = video.currentSrc || video.src;
      if (position.src && position.src !== currentSrc) {
        return null;
      }
      
      // Check if the duration matches (to ensure it's the same video)
      if (video.duration && Math.abs(video.duration - position.duration) > 1) {
        return null;
      }
      
      return position;
    } catch(e) {
      console.warn('Failed to load video position:', e);
      return null;
    }
  }
  
  // Clean up old video positions (older than 30 days)
  function cleanupOldPositions() {
    try {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('vetrom_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data.timestamp && Date.now() - data.timestamp > thirtyDaysInMs) {
              localStorage.removeItem(key);
            }
          } catch(e) {
            // Invalid data, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch(e) {
      console.warn('Failed to cleanup old positions:', e);
    }
  }
  
  // Initialize position persistence for all VetroM players
  function initPositionPersistence() {
    // Clean up old positions on page load
    cleanupOldPositions();
    
    // Find all video elements with vetrom-media class
    const videos = document.querySelectorAll('video[class*="vetrom-media"]');
    
    videos.forEach(video => {
      // Wait for the player to be fully initialized
      const checkInit = setInterval(() => {
        if (video.__vetromPlayer) {
          clearInterval(checkInit);
          setupVideoPositionTracking(video);
        }
      }, 100);
      
      // Clear interval after 5 seconds if player doesn't initialize
      setTimeout(() => clearInterval(checkInit), 5000);
    });
    
    // Watch for dynamically added videos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === 'VIDEO' && node.className && node.className.includes('vetrom-media')) {
              const checkInit = setInterval(() => {
                if (node.__vetromPlayer) {
                  clearInterval(checkInit);
                  setupVideoPositionTracking(node);
                }
              }, 100);
              setTimeout(() => clearInterval(checkInit), 5000);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll('video[class*="vetrom-media"]').forEach(v => {
                const checkInit = setInterval(() => {
                  if (v.__vetromPlayer) {
                    clearInterval(checkInit);
                    setupVideoPositionTracking(v);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkInit), 5000);
              });
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Setup position tracking for a specific video
  function setupVideoPositionTracking(video) {
    // Skip if already set up
    if (video.__vetromPositionTracking) return;
    video.__vetromPositionTracking = true;
    
    let saveInterval = null;
    let hasLoadedPosition = false;
    
    // Load saved position when metadata is loaded
    const loadPosition = () => {
      if (hasLoadedPosition) return;
      hasLoadedPosition = true;
      
      const position = loadVideoPosition(video);
      if (position && position.time > 5 && position.time < video.duration - 10) {
        video.currentTime = position.time;
      }
    };
    
    if (video.readyState >= 1) {
      loadPosition();
    } else {
      video.addEventListener('loadedmetadata', loadPosition, { once: true });
    }
    
    // Save position periodically while playing
    video.addEventListener('play', () => {
      if (saveInterval) clearInterval(saveInterval);
      saveInterval = setInterval(() => {
        saveVideoPosition(video);
      }, 5000); // Save every 5 seconds
    });
    
    // Stop saving when paused
    video.addEventListener('pause', () => {
      if (saveInterval) {
        clearInterval(saveInterval);
        saveInterval = null;
      }
      saveVideoPosition(video);
    });
    
    // Save on time update (for scrubbing)
    let lastSaveTime = 0;
    video.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - lastSaveTime > 3000) { // Throttle to every 3 seconds
        lastSaveTime = now;
        saveVideoPosition(video);
      }
    });
    
    // Save before page unload
    const unloadHandler = () => {
      saveVideoPosition(video);
    };
    window.addEventListener('beforeunload', unloadHandler);
    
    // Clear saved position when video ends
    video.addEventListener('ended', () => {
      const videoId = generateVideoId(video);
      if (videoId) {
        try {
          localStorage.removeItem(videoId);
        } catch(e) {
          console.warn('Failed to clear video position:', e);
        }
      }
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPositionPersistence);
  } else {
    initPositionPersistence();
  }
})();
