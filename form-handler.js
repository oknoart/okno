document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const productName = document.getElementById("product")?.value.trim();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzjMkQ3VQd_R_hF0t1ZyhmwlDdJFIEige6yWtBVJwHVfySE3F43iDarEHMlbyKdldhE/exec", {
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
