document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const productName = document.title.split("–")[0].trim();
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("productName", productName);
    formData.append("orderNumber", orderNumber);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyjI5xlMNSwMmOtGCNLRT28nz0RDnyRnm6ucD2DiRidWt09YV_yzOY_xR3WaP1eLmUo/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (response.ok) {
        window.location.href = "https://monzo.com/pay/r/okno-design_22gJn4qY3WMuBS";
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  });
});
