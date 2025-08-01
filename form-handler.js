document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const productName = document.title.split("–")[0].trim(); // e.g. "Print 001"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // === VALIDATION ===
    if (!name || !email || !address) {
      alert("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit order number

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxWEu8SsrIcAaH351Y_S7ypEmQC_v2vr61cf2JkOkZibn46DhCEZFHBgvhUve9DW3C8/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address,
          orderNumber,
          productName
        }),
      });
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Sorry, something went wrong. Please try again.");
      return;
    }

    // Redirect to Monzo for payment
    window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
  });
});
