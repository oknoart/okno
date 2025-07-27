document.addEventListener("DOMContentLoaded", () => {
  const heroBlocks = document.querySelectorAll(".hero-text");

  heroBlocks.forEach(container => {
    const original = container.textContent.trim();
    const words = original.split(/\s+/);

    // Clear and rebuild innerHTML with span-wrapped words
    container.innerHTML = words
      .map(word => `<span class="redact-delay">${word}</span>`)
      .join(" ");

    // Apply redaction one-by-one
    const spans = container.querySelectorAll(".redact-delay");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add("redacted");
      }, 5000 + i * 500); // starts at 5s, one word every 0.5s
    });
  });
});
