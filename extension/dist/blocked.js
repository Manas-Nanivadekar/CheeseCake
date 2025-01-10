/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 312:
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
// src/blocked.ts
document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("resetTimer");
    resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        yield chrome.runtime.sendMessage({ action: "resetTimer" });
        window.location.href = "https://youtube.com";
    }));
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[312]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocked.js.map