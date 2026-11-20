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