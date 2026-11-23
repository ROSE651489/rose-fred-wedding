// WEDDING COUNTDOWN
const weddingDate = new Date("2026-12-12T10:00:00+03:00").getTime();

function updateCountdown() {
  const diff = Math.max(0, weddingDate - Date.now());

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);


// WEDDING PHOTO GALLERY
document.addEventListener("DOMContentLoaded", () => {
  const photos = document.querySelectorAll(".gallery-grid img");

  photos.forEach((img) => {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      const overlay = document.createElement("div");

      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        padding: 20px;
        cursor: zoom-out;
      `;

      const largeImage = document.createElement("img");
      largeImage.src = img.src;

      largeImage.style.cssText = `
        max-width: 95vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      `;

      overlay.appendChild(largeImage);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => overlay.remove());
    });
  });
});

// ROSELYNE & FRED WEDDING GUESTBOOK

const GUESTBOOK_URL = "https://script.google.com/macros/s/AKfycbyzy6kIOsYoJ1gSQPZ90H19cHbMbW5e-hJexf-wcYRfYvrY4BhydvDycZPS4DweShiS/exec";

const guestbookForm = document.getElementById("guestbookForm");
const guestbookMessages = document.getElementById("guestbookMessages");
const guestbookStatus = document.getElementById("guestbookStatus");

// LOAD EXISTING MESSAGES
function loadGuestbookMessages() {
  const callbackName = "guestbookCallback";
  const script = document.createElement("script");

  window[callbackName] = function(messages) {
    guestbookMessages.innerHTML = "";

    if (!messages.length) {
      guestbookMessages.textContent =
        "Be the first to leave us a blessing! 💌";
    } else {
      messages.forEach((message) => {
        const note = document.createElement("div");
        note.className = "sticky-note";

        const heading = document.createElement("h4");
        heading.textContent = message.name;

        const content = document.createElement("p");
        content.textContent = message.message;

        const relationship = document.createElement("small");
        relationship.textContent = message.relationship || "";

        note.append(heading, content, relationship);
        guestbookMessages.appendChild(note);
      });
    }

    delete window[callbackName];
    script.remove();
  };

  script.onerror = function() {
    guestbookMessages.textContent =
      "Unable to load messages. Please refresh the page.";

    delete window[callbackName];
    script.remove();
  };

  script.src = GUESTBOOK_URL + "?callback=" + callbackName;
  document.body.appendChild(script);
}

// SUBMIT GUEST BLESSINGS
if (guestbookForm) {
  guestbookForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitButton = guestbookForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    guestbookStatus.textContent = "Sending your blessing... 💌";

    const data = {
      name: document.getElementById("guestName").value.trim(),
      relationship: document.getElementById("guestRelationship").value,
      message: document.getElementById("guestMessage").value.trim()
    };

    try {
      await fetch(GUESTBOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      guestbookStatus.textContent =
        "Thank you! Your blessing has been submitted. ❤️";

      guestbookForm.reset();

      setTimeout(loadGuestbookMessages, 2000);

    } catch (error) {
      guestbookStatus.textContent =
        "Something went wrong. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

// DISPLAY MESSAGES WHEN WEBSITE OPENS
if (guestbookMessages) {
  loadGuestbookMessages();
}
