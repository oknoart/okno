document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".blacked-out").forEach(span => {
        const angle = (Math.random() * 8 - 4).toFixed(2);
        span.style.setProperty('--angle', `${angle}deg`);
    });
});
