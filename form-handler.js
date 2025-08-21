document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const product = document.getElementById("product")?.value.trim(); // <-- corrected
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzoMuXY8lR_Piob7ZM2M5GfyS463xgyZ2yMqcc936j1LFt21OhHPgOgRCYuxxwFyt9x/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name,
          email,
          address,
          orderNumber,
          product // not productName
        })
      });

      if (!response.ok) throw new Error("Script error");

    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Sorry, something went wrong. Please try again.");
      return;
    }

    window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
  });
});
