document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const productName = document.title.split("–")[0].trim(); // e.g. 'OKNO'
    const orderNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number

    // Use FormData instead of JSON
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("product", productName);
    formData.append("orderNumber", orderNumber);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxWEu8SsrIcAaH351Y_S7ypEmQC_v2vr61cf2JkOkZibn46DhCEZFHBgvhUve9DW3C8/exec", {
        method: "POST",
        body: formData, // no Content-Type needed
      });
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Sorry, something went wrong. Please try again.");
      return;
    }

    // Redirect to Monzo after successful submission
    window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
  });
});
