const track = document.getElementById('carouselTrack');
const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

function updateCarousel() {
  const itemWidth = items[0].offsetWidth;
  currentTranslate = -currentIndex * itemWidth;
  prevTranslate = currentTranslate;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// Snap to the nearest item after dragging
function setPositionByIndex() {
  const itemWidth = items[0].offsetWidth;
  currentIndex = Math.round(-currentTranslate / itemWidth);
  currentIndex = Math.max(0, Math.min(currentIndex, items.length - 1)); // Clamp index
  updateCarousel();
}

// Handle drag start (mouse or touch)
function dragStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  track.style.transition = 'none'; // Disable transition during drag
}

// Handle drag movement
function drag(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }
}

// Handle drag end
function dragEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  track.style.transition = 'transform 0.5s ease'; // Re-enable transition for snapping
  setPositionByIndex();
}

// Get the X position (for both mouse and touch events)
function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

// Animation loop for smooth dragging
function animation() {
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

// Event listeners for dragging (mouse)
track.addEventListener('mousedown', dragStart);
track.addEventListener('mousemove', drag);
track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', dragEnd);

// Event listeners for dragging (touch)
track.addEventListener('touchstart', dragStart);
track.addEventListener('touchmove', drag);
track.addEventListener('touchend', dragEnd);

// Auto-slide every 5 seconds (stop if user is dragging)
let autoSlideInterval = setInterval(() => {
  if (!isDragging) {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }
}, 5000);

// Reset auto-slide interval when user interacts
track.addEventListener('touchstart', () => clearInterval(autoSlideInterval));
track.addEventListener('mousedown', () => clearInterval(autoSlideInterval));

// Handle window resize
window.addEventListener('resize', updateCarousel);

// Initial update
updateCarousel();