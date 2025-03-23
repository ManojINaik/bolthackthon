import { Application } from '@splinetool/runtime';

export default function createSplineScene(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID ${containerId} not found`);
    return;
  }

  // Create canvas with full dimensions
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  
  // Create loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'spline-loading';
  loadingDiv.innerHTML = '<div class="spline-spinner"></div><div>Loading 3D Experience...</div>';
  container.appendChild(loadingDiv);

  // Initialize Spline
  const spline = new Application(canvas);
  
  // Add event listeners for interactive elements
  let isDragging = false;
  let lastPosition = { x: 0, y: 0 };
  
  // Enhanced scene loading with perspective adjustment
  spline.load('https://prod.spline.design/zjLHWiRgph4ErOAg/scene.splinecode')
    .then(() => {
      console.log('Spline scene loaded successfully');
      
      // Remove loading indicator with fade effect
      loadingDiv.style.opacity = '0';
      setTimeout(() => {
        loadingDiv.remove();
      }, 500);
      
      // Add responsive behavior
      window.addEventListener('resize', handleResize);
      
      // Add optional mouse/touch interaction for scene rotation
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchUp);
    })
    .catch(err => {
      console.error('Error loading Spline scene:', err);
      loadingDiv.innerHTML = '<div>Failed to load 3D scene</div>';
    });
  
  // Event handlers for interaction
  function handleResize() {
    // Basic resize handling - the spline runtime handles resizing automatically
    console.log('Window resized');
  }
  
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    lastPosition = { x: e.clientX, y: e.clientY };
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    
    lastPosition = { x: e.clientX, y: e.clientY };
  }
  
  function handleMouseUp() {
    isDragging = false;
  }
  
  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      isDragging = true;
      lastPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging || e.touches.length !== 1) return;
    
    lastPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  
  function handleTouchUp() {
    isDragging = false;
  }
  
  // Return cleanup function
  return {
    cleanup: () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchUp);
    }
  };
} 