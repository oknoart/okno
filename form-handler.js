document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");

  form.addEventListener("submit", () => {
    const productInput = document.getElementById("product");
    const orderInput = document.getElementById("orderNumber");

    // Inject product name from document title
    productInput.value = document.title.split("–")[0].trim();

    // Inject 6-digit order number
    orderInput.value = Math.floor(100000 + Math.random() * 900000);
  });
});
