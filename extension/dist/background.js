/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 994:
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let youtubeTimer = {
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
chrome.webNavigation.onBeforeNavigate.addListener((details) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (details.url.includes("youtube.com") && details.frameId === 0) {
        // Check if YouTube is blocked
        const state = yield chrome.storage.local.get("youtubeTimer");
        if ((_a = state.youtubeTimer) === null || _a === void 0 ? void 0 : _a.isBlocked) {
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL("blocked.html"),
            });
            return;
        }
    }
}), {
    url: [
        {
            hostContains: "youtube.com",
        },
    ],
});
// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (changeInfo.url) {
        const state = yield chrome.storage.local.get("youtubeTimer");
        if (((_a = state.youtubeTimer) === null || _a === void 0 ? void 0 : _a.isBlocked) &&
            changeInfo.url.includes("youtube.com")) {
            yield blockYouTube(tabId);
            return;
        }
        handleUrlChange(tabId, changeInfo.url);
    }
}));
// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tab = yield chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
        const state = yield chrome.storage.local.get("youtubeTimer");
        if (((_a = state.youtubeTimer) === null || _a === void 0 ? void 0 : _a.isBlocked) && tab.url.includes("youtube.com")) {
            yield blockYouTube(tab.id);
            return;
        }
        handleUrlChange(tab.id, tab.url);
    }
}));
// Handle URL changes
function handleUrlChange(tabId, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const isYouTube = url.includes("youtube.com");
        if (isYouTube && !youtubeTimer.isRunning) {
            // Start timer when YouTube is opened
            startTimer();
        }
        else if (!isYouTube && youtubeTimer.isRunning) {
            // Pause timer when leaving YouTube
            pauseTimer();
        }
        // Check if we need to block YouTube
        if (isYouTube &&
            (youtubeTimer.totalTime >= TIME_LIMIT || youtubeTimer.isBlocked)) {
            yield blockYouTube(tabId);
        }
    });
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
    if (!youtubeTimer.isRunning)
        return;
    if (youtubeTimer.startTime) {
        const currentTime = youtubeTimer.totalTime + (Date.now() - youtubeTimer.startTime);
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
function blockAllYoutubeTabs() {
    return __awaiter(this, void 0, void 0, function* () {
        const tabs = yield chrome.tabs.query({ url: YOUTUBE_URL_PATTERN });
        for (const tab of tabs) {
            if (tab.id) {
                yield blockYouTube(tab.id);
            }
        }
    });
}
function blockYouTube(tabId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL("blocked.html"),
            });
        }
        catch (error) {
            console.error("Error blocking YouTube:", error);
        }
    });
}
// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTimer") {
        const currentTime = youtubeTimer.isRunning && youtubeTimer.startTime
            ? youtubeTimer.totalTime + (Date.now() - youtubeTimer.startTime)
            : youtubeTimer.totalTime;
        sendResponse({
            currentTime,
            isRunning: youtubeTimer.isRunning,
            isBlocked: youtubeTimer.isBlocked,
            timeLimit: TIME_LIMIT,
        });
    }
    else if (request.action === "resetTimer") {
        resetTimer();
        sendResponse({ success: true });
    }
    return true;
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[994]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map