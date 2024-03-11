"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadhocracy_plus"] = self["webpackChunkadhocracy_plus"] || []).push([["unload_warning"],{

/***/ "./adhocracy-plus/assets/js/unload_warning.js":
/*!****************************************************!*\
  !*** ./adhocracy-plus/assets/js/unload_warning.js ***!
  \****************************************************/
/***/ (function() {

eval("\n\n/* This code checks if something has been changed in a form but not submitted.\n   If the user wants to leave the the page there will be warning. */\n\n/* global django */\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var submitted = false;\n  var changeHandler = function changeHandler(event) {\n    if (event.target === undefined) {\n      return;\n    } else {\n      var target = event.target.id;\n      if (target.includes('dashboardToggle')) {\n        submitted = true;\n      }\n    }\n    window.addEventListener('beforeunload', function (e) {\n      if (!submitted) {\n        // string is ignored on most modern browsers\n        var string = django.gettext('If you leave this page changes you made will not be saved.');\n        e.preventDefault();\n        e.returnValue = string;\n        return string;\n      }\n    });\n  };\n  if (window.CKEDITOR) {\n    // eslint-disable-next-line no-undef\n    CKEDITOR.on('instanceReady', function (e) {\n      e.editor.on('change', changeHandler);\n    });\n  }\n  document.addEventListener('change', changeHandler, {\n    once: true\n  });\n  document.addEventListener('submit', function (e) {\n    if (e.target.getAttribute('ignore-submit') === true) {\n      return true;\n    }\n    submitted = true;\n  });\n});\n\n//# sourceURL=webpack://adhocracy-plus/./adhocracy-plus/assets/js/unload_warning.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./adhocracy-plus/assets/js/unload_warning.js"));
/******/ }
]);