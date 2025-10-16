document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".blacked-out").forEach(span => {
        const angle = (Math.random() * 8 - 4).toFixed(2);
        span.style.setProperty('--angle', `${angle}deg`);
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

                const angle = (Math.random() * 8 - 4).toFixed(2);
                span.style.setProperty('--angle', `${angle}deg`);
            }, 25000 + i * 5000);
        });
    });
});
