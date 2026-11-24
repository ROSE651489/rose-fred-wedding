const SUPABASE_URL = "https://iplqdcnbvwhyitruzmpu.supabase.co";
const SUPABASE_KEY = "sb_publishable_cs-rXtXGOFOoPrIyc2MiRQ_p_hzHiqv";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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


// =====================================
// ROSELYNE & FRED WEDDING MEMORY WALL
// =====================================

const wallForm = document.getElementById("wallForm");
const wallPhotos = document.getElementById("wallPhotos");
const wallMessage = document.getElementById("wallMessage");
const wallCharCount = document.getElementById("wallCharCount");
const wallStatus = document.getElementById("wallStatus");
const memoryWall = document.getElementById("memoryWall");

// COUNT MESSAGE CHARACTERS
if (wallMessage && wallCharCount) {
  wallMessage.addEventListener("input", () => {
    wallCharCount.textContent = wallMessage.value.length;
  });
}

// LOAD MEMORIES FROM SUPABASE
async function loadMemoryWall() {
  if (!memoryWall) return;

  const { data, error } = await supabaseClient
    .from("wedding_memories")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    memoryWall.textContent = "Unable to load memories. Please refresh.";
    console.error(error);
    return;
  }

  memoryWall.innerHTML = "";

  if (!data.length) {
    memoryWall.textContent = "Be the first to share a beautiful memory! ❤️";
    return;
  }

  data.forEach((memory) => {
    const card = document.createElement("div");
    card.className = "memory-card";

    if (memory.photo_path) {
      const image = document.createElement("img");
      const { data: imageData } = supabaseClient
        .storage
        .from("wedding-photos")
        .getPublicUrl(memory.photo_path);

      image.src = imageData.publicUrl;
      image.alt = "Wedding memory";
      image.loading = "lazy";
      card.appendChild(image);
    }

    if (memory.message) {
      const note = document.createElement("div");
      note.className = "sticky-note";

      const message = document.createElement("p");
      message.textContent = memory.message;

      note.appendChild(message);
      card.appendChild(note);
    }

    const name = document.createElement("h4");
    name.textContent = memory.guest_name;
    card.appendChild(name);

    if (memory.relationship) {
      const relationship = document.createElement("small");
      relationship.textContent = memory.relationship;
      card.appendChild(relationship);
    }

    memoryWall.appendChild(card);
  });
}

// SUBMIT PHOTOS AND STICKY NOTES
if (wallForm) {
  wallForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("wallGuestName").value.trim();
    const relationship = document.getElementById("wallRelationship").value.trim();
    const message = wallMessage.value.trim();
    const files = Array.from(wallPhotos.files || []);
    const submitButton = wallForm.querySelector('button[type="submit"]');

    if (!message && files.length === 0) {
      wallStatus.textContent = "Please add a message or at least one photo.";
      return;
    }

    if (files.length > 10) {
      wallStatus.textContent = "Please select no more than 10 photos.";
      return;
    }

    if (files.some(file => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      wallStatus.textContent = "Please use image files no larger than 5 MB each.";
      return;
    }

    submitButton.disabled = true;
    wallStatus.textContent = "Sharing your memories... ❤️";

    try {
      if (files.length === 0) {
        const { error } = await supabaseClient
          .from("wedding_memories")
          .insert([{
            guest_name: name,
            relationship: relationship,
            message: message,
            photo_path: null
          }]);

        if (error) throw error;
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const filePath = `${crypto.randomUUID()}-${safeName}`;

          const { error: uploadError } = await supabaseClient
            .storage
            .from("wedding-photos")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: insertError } = await supabaseClient
            .from("wedding_memories")
            .insert([{
              guest_name: name,
              relationship: relationship,
              message: i === 0 ? message : null,
              photo_path: filePath
            }]);

          if (insertError) throw insertError;
        }
      }

      wallStatus.textContent = "Your memory has been shared! Thank you! ❤️";
      wallForm.reset();
      wallCharCount.textContent = "0";

      await loadMemoryWall();

    } catch (error) {
      console.error("Memory wall error:", error);
      wallStatus.textContent = "Something went wrong. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

// SHOW MEMORIES WHEN THE WEBSITE OPENS
loadMemoryWall();
