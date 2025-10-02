// form-handler.js (updated)
// - Client-side checks for email + UK postcode + minimal address structure
// - Uses Turnstile callback -> hidden #cfToken
// - Uses honeypot #website (must stay empty)
// - Posts to your existing Apps Script endpoint
// - Resets Turnstile + button state on failure; redirects to /thanks/ on success

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // Email + UK postcode regex (same spirit as server)
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const ukPostcodeInText = /\b(?:GIR ?0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/i;

  // Turnstile callback (matches data-callback="oknoSetCFToken" in the form HTML)
  window.oknoSetCFToken = (token) => {
    const cf = document.getElementById("cfToken");
    if (cf) cf.value = token || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name       = document.getElementById("name")?.value.trim() || "";
    const email      = document.getElementById("email")?.value.trim() || "";
    const address    = document.getElementById("address")?.value.trim() || "";
    const product    = document.getElementById("product")?.value.trim() || "";
    const website    = document.getElementById("website")?.value.trim() || ""; // honeypot
    const cfToken    = document.getElementById("cfToken")?.value.trim() || ""; // Turnstile token
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    // Lightweight client-side validation (server also enforces)
    if (!emailRe.test(email)) {
      alert("Please use a real email address.");
      return;
    }
    if (!ukPostcodeInText.test(address)) {
      alert("UK orders need a full UK postcode in the address.");
      return;
    }
    if (address.length < 12 || (address.split(/\n|,/).map(p => p.trim()).filter(Boolean).length < 2)) {
      alert("Please include house/flat + street and town/city with postcode.");
      return;
    }

    let succeeded = false;

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
            orderNumber: String(orderNumber),
            product,
            website,   // honeypot
            cfToken    // Turnstile
          })
        }
      );

      const text = (await response.text()).trim();

      if (response.ok && text === "OK") {
        succeeded = true;
        window.location.href = "../thanks/";
        return;
      }

      // Handle known server responses (plain-text codes)
      if (text === "ERR_CAPTCHA") {
        alert("Please complete the verification and try again.");
      } else if (text === "ERR_SPAM") {
        alert("That didn’t look right. Please reload and try again.");
      } else if (text === "ERR_RATE") {
        alert("You just submitted an order. Please wait 60 seconds and try again.");
      } else if (text === "ERR_INVALID_EMAIL") {
        alert("Please enter a real email address.");
      } else if (text === "ERR_POSTCODE") {
        alert("UK delivery needs a full UK postcode in the address.");
      } else if (text === "ERR_ADDRESS") {
        alert("Please include house/flat + street and town/city with postcode.");
      } else if (text.startsWith("ERR_NON_UK")) {
        const humanMsg = text.split(":").slice(1).join(":").trim()
          || "Sorry — I only ship within the UK. Please provide a UK delivery address with a valid postcode.";
        alert(humanMsg);
      } else {
        alert("Sorry, something went wrong. Please try again.");
      }

      try { window.turnstile?.reset?.(); } catch {}
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Sorry, something went wrong. Please try again.");
      try { window.turnstile?.reset?.(); } catch {}
    } finally {
      if (!succeeded && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "BUY";
      }
    }
  });
});
