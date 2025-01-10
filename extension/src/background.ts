// src/background.ts
interface TimerState {
  startTime: number | null;
  totalTime: number;
  isRunning: boolean;
  isBlocked: boolean; // New field to track blocked state
}

let youtubeTimer: TimerState = {
  startTime: null,
  totalTime: 0,
  isRunning: false,
  isBlocked: false,
};

const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const TIME_LIMIT = 1 * 60 * 1000; // 1 minute in milliseconds

// Initialize when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  resetTimer();
});

// Load timer state when background script starts
chrome.storage.local.get("youtubeTimer", (data) => {
  if (data.youtubeTimer) {
    youtubeTimer = data.youtubeTimer;
    // If time limit was already exceeded, ensure blocked state is maintained
    if (youtubeTimer.totalTime >= TIME_LIMIT) {
      youtubeTimer.isBlocked = true;
    }
  }
});

// Web Navigation listener to catch all YouTube navigation attempts
chrome.webNavigation.onBeforeNavigate.addListener(
  async (details) => {
    if (details.url.includes("youtube.com") && details.frameId === 0) {
      // Check if YouTube is blocked
      const state = await chrome.storage.local.get("youtubeTimer");
      if (state.youtubeTimer?.isBlocked) {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocked.html"),
        });
        return;
      }
    }
  },
  {
    url: [
      {
        hostContains: "youtube.com",
      },
    ],
  }
);

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const state = await chrome.storage.local.get("youtubeTimer");
    if (
      state.youtubeTimer?.isBlocked &&
      changeInfo.url.includes("youtube.com")
    ) {
      await blockYouTube(tabId);
      return;
    }
    handleUrlChange(tabId, changeInfo.url);
  }
});

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    const state = await chrome.storage.local.get("youtubeTimer");
    if (state.youtubeTimer?.isBlocked && tab.url.includes("youtube.com")) {
      await blockYouTube(tab.id!);
      return;
    }
    handleUrlChange(tab.id!, tab.url);
  }
});

// Handle URL changes
async function handleUrlChange(tabId: number, url: string) {
  const isYouTube = url.includes("youtube.com");

  if (isYouTube && !youtubeTimer.isRunning) {
    // Start timer when YouTube is opened
    startTimer();
  } else if (!isYouTube && youtubeTimer.isRunning) {
    // Pause timer when leaving YouTube
    pauseTimer();
  }

  // Check if we need to block YouTube
  if (
    isYouTube &&
    (youtubeTimer.totalTime >= TIME_LIMIT || youtubeTimer.isBlocked)
  ) {
    await blockYouTube(tabId);
  }
}

function startTimer() {
  youtubeTimer.startTime = Date.now();
  youtubeTimer.isRunning = true;
  updateTimer();
}

function pauseTimer() {
  if (youtubeTimer.startTime && youtubeTimer.isRunning) {
    youtubeTimer.totalTime += Date.now() - youtubeTimer.startTime;
    youtubeTimer.isRunning = false;
    youtubeTimer.startTime = null;
    // Save state after pausing
    chrome.storage.local.set({ youtubeTimer });
  }
}

function resetTimer() {
  youtubeTimer = {
    startTime: null,
    totalTime: 0,
    isRunning: false,
    isBlocked: false,
  };
  chrome.storage.local.set({ youtubeTimer });
}

function updateTimer() {
  if (!youtubeTimer.isRunning) return;

  if (youtubeTimer.startTime) {
    const currentTime =
      youtubeTimer.totalTime + (Date.now() - youtubeTimer.startTime);

    // Check if time limit is exceeded
    if (currentTime >= TIME_LIMIT) {
      youtubeTimer.isBlocked = true;
      youtubeTimer.totalTime = currentTime;
      chrome.storage.local.set({ youtubeTimer });
      blockAllYoutubeTabs();
    }

    // Save timer state periodically
    chrome.storage.local.set({ youtubeTimer });
  }

  // Update timer every second
  setTimeout(updateTimer, 1000);
}

async function blockAllYoutubeTabs() {
  const tabs = await chrome.tabs.query({ url: YOUTUBE_URL_PATTERN });
  for (const tab of tabs) {
    if (tab.id) {
      await blockYouTube(tab.id);
    }
  }
}

async function blockYouTube(tabId: number) {
  try {
    await chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("blocked.html"),
    });
  } catch (error) {
    console.error("Error blocking YouTube:", error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTimer") {
    const currentTime =
      youtubeTimer.isRunning && youtubeTimer.startTime
        ? youtubeTimer.totalTime + (Date.now() - youtubeTimer.startTime)
        : youtubeTimer.totalTime;

    sendResponse({
      currentTime,
      isRunning: youtubeTimer.isRunning,
      isBlocked: youtubeTimer.isBlocked,
      timeLimit: TIME_LIMIT,
    });
  } else if (request.action === "resetTimer") {
    resetTimer();
    sendResponse({ success: true });
  }
  return true;
});
