// src/blocked.ts
document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("resetTimer");

  resetButton?.addEventListener("click", async () => {
    await chrome.runtime.sendMessage({ action: "resetTimer" });
    window.location.href = "https://youtube.com";
  });
});
