// Wedding date: 12 December 2026 at 10:00 AM East Africa Time (UTC+3).
const weddingDate = new Date("2026-12-12T10:00:00+03:00").getTime();
function updateCountdown(){
  const diff = weddingDate - Date.now();
  const safe = Math.max(0, diff);
  const values = {
    days: Math.floor(safe / 86400000),
    hours: Math.floor((safe % 86400000) / 3600000),
    minutes: Math.floor((safe % 3600000) / 60000),
    seconds: Math.floor((safe % 60000) / 1000)
  };
  Object.entries(values).forEach(([id,value]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = String(value).padStart(2,"0");
  });
}
updateCountdown();
setInterval(updateCountdown,1000);

// Open gallery photos in a larger view
document.querySelectorAll(".gallery-grid img").forEach((img) => {
  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 20px;
      cursor: pointer;
    `;

    const largeImage = document.createElement("img");
    largeImage.src = img.src;
    largeImage.style.cssText = `
      max-width: 95%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    `;

    overlay.appendChild(largeImage);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => overlay.remove());
  });
});
