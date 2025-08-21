document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const product = document.getElementById("product")?.value.trim(); // hidden product field
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzhlDoA-mw9xwY7dLTOPizQscoe8gwEpXELEAo19Yr8co4RFqbxcvX4ka_okPz67LLQ/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name,
          email,
          address,
          orderNumber,
          product
        })
      });

      if (!response.ok) throw new Error("Script error");
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Sorry, something went wrong. Please try again.");
      return;
    }

    // Store a couple of values for the thank-you screen (not the payment link)
    try {
      sessionStorage.setItem("okno_orderNumber", String(orderNumber));
      sessionStorage.setItem("okno_customerEmail", email || "");
    } catch (_) {
      // sessionStorage might be unavailable; it's non-critical
    }

    // Redirect to local confirmation page (payment link goes by email only)
    window.location.href = "thanks.html";
  });
});
