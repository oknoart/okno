// form-handler.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (!form) return; // safe on pages without the form

  const submitBtn = form.querySelector('button[type="submit"]');
  const productInput = document.getElementById("product");
  const productName = productInput?.value?.trim() || "";

  // USE THE SAME /exec URL YOU'RE POSTING TO
  const EXEC_URL = "https://script.google.com/macros/s/AKfycbzci1ibt8l9AtoEf36TtaUd4sk-4o21i51XjVrSRD32VtwenFwZG4GkdJt-oTYVvsds/exec";

  // ---- OOS state flag
  let isOOS = false;

  // ---- Flip UI to OUT OF STOCK
  function setOOS() {
    isOOS = true;
    if (submitBtn) {
      submitBtn.textContent = "OUT OF STOCK";
      submitBtn.classList.add("is-oos");
      submitBtn.style.background = "#D40000";
      submitBtn.style.color = "#fff";
      submitBtn.disabled = true;
      // Belt + braces: avoid Enter-key submits
      submitBtn.setAttribute("type", "button");
    }
  }

  // ---- JSONP stock check (avoids CORS)
  function checkStockJSONP(product, onDone) {
    if (!product) return onDone?.(null);

    const cbName = "__oknoStockCB_" + Math.random().toString(36).slice(2);
    // Define global callback
    window[cbName] = function (data) {
      try {
        onDone?.(data);
      } finally {
        // cleanup the script + callback
        delete window[cbName];
        script.remove();
      }
    };

    const script = document.createElement("script");
    script.src = `${EXEC_URL}?product=${encodeURIComponent(product)}&callback=${encodeURIComponent(cbName)}`;
    script.onerror = () => {
      try { delete window[cbName]; } catch {}
      onDone?.(null);
    };
    document.head.appendChild(script);
  }

  // ---- Kick off stock check on load
  checkStockJSONP(productName, (data) => {
    const stock = Number(data && data.stock);
    if (Number.isFinite(stock) && stock <= 0) {
      setOOS();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Block immediately if OOS
    if (isOOS) {
      alert("Sorry — this is sold out.");
      return;
    }

    // Honeypot (must exist as #hp)
    const website = document.getElementById("hp")?.value || "";
    if (website) {
      // Bot — silently drop
      return;
    }

    // Collect fields
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const product = productName;
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const cfToken = document.querySelector('input[name="cf-turnstile-response"]')?.value || "";

    // Optional: quick last-second stock recheck to reduce race conditions
    try {
      await new Promise((resolve) => {
        let done = false;
        checkStockJSONP(product, (d) => {
          if (done) return;
          done = true;
          const s = Number(d && d.stock);
          if (Number.isFinite(s) && s <= 0) setOOS();
          resolve();
        });
        // fail-safe timeout (don’t block purchase on slow JSONP)
        setTimeout(() => { if (!done) resolve(); }, 1200);
      });
      if (isOOS) {
        alert("Sorry — this is sold out.");
        return;
      }
    } catch {
      // Ignore recheck errors; proceed to submit
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING…";
      }

      const response = await fetch(
        EXEC_URL,
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
        // Success → local thank-you page (payment link in email)
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
        alert("Sorry, something went wrong. Please try again.");
        try { window.turnstile?.reset?.(); } catch {}
      }
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Sorry, something went wrong. Please try again.");
      try { window.turnstile?.reset?.(); } catch {}
    } finally {
      // Re-enable after any failure
      if (!isOOS && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "BUY";
        submitBtn.setAttribute("type", "submit");
      }
    }
  });
});
