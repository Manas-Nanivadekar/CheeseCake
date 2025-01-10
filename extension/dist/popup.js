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

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function() {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// src/popup.ts\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    // Get elements\n    const messageInput = document.getElementById(\"messageInput\");\n    const sendButton = document.getElementById(\"sendButton\");\n    const responseDiv = document.getElementById(\"response\");\n    // Add click event listener to the button\n    sendButton === null || sendButton === void 0 ? void 0 : sendButton.addEventListener(\"click\", () => __awaiter(void 0, void 0, void 0, function* () {\n        const message = messageInput === null || messageInput === void 0 ? void 0 : messageInput.value;\n        // Send message to background script\n        const response = yield chrome.runtime.sendMessage({\n            action: \"processMessage\",\n            message,\n        });\n        // Display the response\n        if (responseDiv) {\n            responseDiv.textContent = response || \"No response received\";\n        }\n    }));\n    // Example of getting current tab information\n    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {\n        const currentTab = tabs[0];\n        console.log(\"Current tab:\", currentTab.url);\n    });\n});\n\n\n//# sourceURL=webpack://extension/./src/popup.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup.ts"]();
/******/ 	
/******/ })()
;