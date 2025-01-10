chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  // Example: Set up initial extension state
  chrome.storage.local.set({
    isEnabled: true,
    settings: {
      theme: "light",
      notifications: true,
    },
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processMessage") {
    // Process the message
    const processedMessage = `Processed: ${request.message}`;

    // Send response back to popup
    sendResponse(processedMessage);
  }

  // Return true to indicate you want to send a response asynchronously
  return true;
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log(`Tab ${tabId} updated to ${tab.url}`);
  }
});
