document.addEventListener("DOMContentLoaded", () => {
  // Rotate manually blacked-out elements using CSS variable
  document.querySelectorAll(".blacked-out").forEach(span => {
    const angle = (Math.random() * 8 - 4).toFixed(2); // -4 to +4 degrees
    span.style.setProperty('--angle', `${angle}deg`);
  });
});
