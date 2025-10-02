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

    let succeeded = false; // <— track success to avoid re-enabling after redirect

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING…";
      }

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwtG-eCsf52TVlhMNvr1nzdK0gzBL9bv-fl72POyonzbdRqbY_XXTIxE5jpQBZQY3NA/exec",
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

      // Success → local thank-you page (payment link is only in the email)
      if (response.ok && text === "OK") {
        succeeded = true;
        window.location.href = "../thanks/";
        return;
      }

      // Handle known server rejections (plain-text codes)
      if (text === "ERR_CAPTCHA") {
        alert("Please complete the verification and try again.");
      } else if (text === "ERR_SPAM") {
        alert("That didn’t look right. Please reload and try again.");
      } else if (text === "ERR_RATE") {
        alert("You just submitted an order. Please wait 60 seconds and try again.");
      } else if (text.startsWith("ERR_NON_UK")) {
        // Extract the human message after the colon, if present
        const humanMsg = text.split(":").slice(1).join(":").trim()
          || "Sorry — I only ship within the UK. Please provide a UK delivery address with a valid postcode.";
        alert(humanMsg);
      } else {
        // Generic failure
        alert("Sorry, something went wrong. Please try again.");
      }

      // Reset Turnstile on any failure
      try { window.turnstile?.reset?.(); } catch {}
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Sorry, something went wrong. Please try again.");
      try { window.turnstile?.reset?.(); } catch {}
    } finally {
      // Re-enable button after any failure
      if (!succeeded && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "BUY";
      }
    }
  });
});
