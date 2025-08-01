document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const productName = document.title.split("–")[0].trim(); // Grabs 'OKNO' or specific title

    const orderNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit

    // Send data to Google Apps Script
    try {
      await fetch("https://script.google.com/macros/s/AKfycbyQb9CouXzVMP12iR0Zj21cbaQRs9vPXLkPJR0Zpw4DTXwY5RJwzFRJ9O9ZMYgZc2kZ/exec", {
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

    // Redirect from your own domain to avoid iframe restrictions
    window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
  });
});
