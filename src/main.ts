import "./main.css";
import WebGL from "./webgl";

// Wait for the DOM to be ready before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
  // We don't initialize WebGL immediately
  let webglInitialized = false;
  
  function initWebGL() {
    if (!webglInitialized) {
      WebGL();
      webglInitialized = true;
      console.log('WebGL initialized successfully');
    }
  }
  
  // Listen for custom event when loading screen is dismissed
  document.addEventListener('loadingComplete', function() {
    initWebGL();
  });
  
  // Backup event listeners for loading screen dismissal
  document.addEventListener('keydown', function() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen && loadingScreen.style.visibility === 'hidden') {
      initWebGL();
    }
  });
  
  document.addEventListener('click', function() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen && loadingScreen.style.visibility === 'hidden') {
      initWebGL();
    }
  });
  
  // Fallback initialization after 15 seconds if loading screen isn't dismissed
  setTimeout(() => {
    if (!webglInitialized) {
      console.log('Fallback WebGL initialization');
      initWebGL();
    }
  }, 15000);
});

const root = document.documentElement;

function onScroll() {
  if (window.scrollY > 10) root.dataset.scroll = "true";
  else root.dataset.scroll = "false";
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Add global functions for menu
(window as any).toggleMenu = function() {
  document.querySelector(".menu-body")?.classList.toggle("open");
};

(window as any).closeMenu = function() {
  document.querySelector(".menu-body")?.classList.remove("open");
};

// Look for any color settings or materials for text and update them

// If there are functions or settings that control text color, modify them
// Example (replace with actual code):
// textColor = [0.97, 0.72, 0]; // RGB for #f8b700
// textMaterial.color = new Color(0xf8b700);

// If there's a uniform or shader parameter for text color, update it
// uniform vec3 textColor = vec3(0.97, 0.72, 0);

// If there's a specific text rendering or creation function, look for color parameters
// createText("text", {color: "#f8b700", glow: true, glowColor: "#f8b700", glowIntensity: 0.6});
