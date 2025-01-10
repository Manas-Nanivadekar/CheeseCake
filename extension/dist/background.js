/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/***/ (() => {

eval("\nchrome.runtime.onInstalled.addListener(() => {\n    console.log(\"Extension installed\");\n    // Example: Set up initial extension state\n    chrome.storage.local.set({\n        isEnabled: true,\n        settings: {\n            theme: \"light\",\n            notifications: true,\n        },\n    });\n});\n// Listen for messages from popup\nchrome.runtime.onMessage.addListener((request, sender, sendResponse) => {\n    if (request.action === \"processMessage\") {\n        // Process the message\n        const processedMessage = `Processed: ${request.message}`;\n        // Send response back to popup\n        sendResponse(processedMessage);\n    }\n    // Return true to indicate you want to send a response asynchronously\n    return true;\n});\n// Example: Listen for tab updates\nchrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {\n    if (changeInfo.status === \"complete\" && tab.url) {\n        console.log(`Tab ${tabId} updated to ${tab.url}`);\n    }\n});\n\n\n//# sourceURL=webpack://extension/./src/background.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background.ts"]();
/******/ 	
/******/ })()
;