document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const productName = document.title.split("–")[0].trim();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycby73a3bAuO5KAX3NdL8S4fuHMujqkCA2g6L9KP2pJTbVkIBPwelV4U1JqkYl8iiHlLe/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name,
          email,
          address,
          orderNumber,
          productName
        })
      });

      if (!response.ok) throw new Error("Script error");

    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Sorry, something went wrong. Please try again.");
      return;
    }

    // ✅ Safe redirect AFTER user click
    window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
  });
});
