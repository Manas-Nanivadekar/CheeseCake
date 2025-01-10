// src/popup.ts
document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const messageInput = document.getElementById(
    "messageInput"
  ) as HTMLInputElement;
  const sendButton = document.getElementById("sendButton") as HTMLButtonElement;
  const responseDiv = document.getElementById("response") as HTMLDivElement;

  // Add click event listener to the button
  sendButton?.addEventListener("click", async () => {
    const message = messageInput?.value;

    // Send message to background script
    const response = await chrome.runtime.sendMessage({
      action: "processMessage",
      message,
    });

    // Display the response
    if (responseDiv) {
      responseDiv.textContent = response || "No response received";
    }
  });

  // Example of getting current tab information
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    console.log("Current tab:", currentTab.url);
  });
});
