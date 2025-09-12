// form-handler.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (!form) return; // safe if this file is included on pages without the form

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect fields
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const product = document.getElementById("product")?.value.trim(); // hidden product field
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    // Turnstile token (Cloudflare auto-injects this hidden input)
    const cfToken = document.querySelector('input[name="cf-turnstile-response"]')?.value || "";

    // Honeypot (must exist as a hidden text input with id="hp")
    const website = document.getElementById("hp")?.value || "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING…";
      }

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyS7z_ZVEK_GbRG_VW_aKvZ2AX_SqdJ9knzG3a2x99R6jpyY-j-LvooF_WIn8YDb2EU/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            name,
            email,
            address,
            orderNumber,
            product,
            cfToken,  // Turnstile token
            website   // honeypot
          })
        }
      );

      const text = (await response.text()).trim();
      if (response.ok && text === "OK") {
        // Success → local thank-you page (payment link is only in the email)
        window.location.href = "thanks.html";
        return;
      }

      // Handle known server rejections
if (text === "ERR_CAPTCHA") {
  alert("Please complete the verification and try again.");
  try { window.turnstile?.reset?.(); } catch {}
} else if (text === "ERR_SPAM") {
  alert("That didn’t look right. Please reload and try again.");
  try { window.turnstile?.reset?.(); } catch {}
} else if (text === "ERR_RATE") {
  alert("You just submitted an order. Please wait 60 seconds and try again.");
  try { window.turnstile?.reset?.(); } catch {}
} else {
  // Generic failure
  alert("Sorry, something went wrong. Please try again.");
  try { window.turnstile?.reset?.(); } catch {}
}

// Re-enable button after any failure
if (submitBtn) {
  submitBtn.disabled = false;
  submitBtn.textContent = "BUY";
}
  });
});
