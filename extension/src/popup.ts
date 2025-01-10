// src/popup.ts
document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer") as HTMLDivElement;
  const resetButton = document.getElementById(
    "resetTimer"
  ) as HTMLButtonElement;

  function formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function updateDisplay() {
    chrome.runtime.sendMessage({ action: "getTimer" }, (response) => {
      if (response) {
        const timeLeft = Math.max(0, response.timeLimit - response.currentTime);
        timerDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;

        if (response.isRunning) {
          timerDisplay.classList.add("running");
        } else {
          timerDisplay.classList.remove("running");
        }
      }
    });
  }

  resetButton?.addEventListener("click", async () => {
    await chrome.runtime.sendMessage({ action: "resetTimer" });
    updateDisplay();
  });

  // Update display immediately and every second
  updateDisplay();
  setInterval(updateDisplay, 1000);
});
