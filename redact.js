document.addEventListener("DOMContentLoaded", () => {
  // First, rotate manually blacked-out elements
  document.querySelectorAll(".blacked-out").forEach(span => {
    const angle = (Math.random() * 8 - 4).toFixed(2); // -4 to +4 degrees
    span.style.transform = `rotate(${angle}deg)`;
    span.style.display = "inline-block"; // required for rotation
    span.style.transformOrigin = "center center";
  });

  const heroBlocks = document.querySelectorAll(".hero-text");

  heroBlocks.forEach(container => {
    const newContent = [];

    container.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/\s+/);
        words.forEach(word => {
          if (word.trim() !== "") {
            const span = document.createElement("span");
            span.className = "redact-delay";
            span.textContent = word;
            newContent.push(span, document.createTextNode(" "));
          }
        });
      } else {
        newContent.push(node, document.createTextNode(" "));
      }
    });

    container.innerHTML = "";
    newContent.forEach(n => container.appendChild(n));

    const spans = container.querySelectorAll(".redact-delay");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add("redacted");

        // Apply random angle between -4deg and +4deg
        const angle = (Math.random() * 8 - 4).toFixed(2);
        span.style.setProperty('--angle', `${angle}deg`);
        span.style.display = "inline-block";
        span.style.transformOrigin = "center center";
      }, 10000 + i * 5000); // adjust delay here
    });
  });
});
