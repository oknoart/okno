<script>
  document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".hero-text");

    containers.forEach(container => {
      const words = container.textContent.trim().split(/\s+/);
      container.innerHTML = words
        .map(word => `<span class="redact-delay">${word}</span>`)
        .join(" ");

      const spans = container.querySelectorAll(".redact-delay");
      spans.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add("redacted");
        }, 5000 + i * 500); // starts at 5s, redacts one word every 0.5s
      });
    });
  });
</script>
