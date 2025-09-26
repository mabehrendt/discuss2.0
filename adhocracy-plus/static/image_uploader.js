"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadhocracy_plus"] = self["webpackChunkadhocracy_plus"] || []).push([["image_uploader"],{

/***/ "./node_modules/adhocracy4/adhocracy4/images/assets/image_uploader.js":
/*!****************************************************************************!*\
  !*** ./node_modules/adhocracy4/adhocracy4/images/assets/image_uploader.js ***!
  \****************************************************************************/
/***/ (function() {

eval("\n\nfunction init() {\n  var clearInputs = document.querySelectorAll('input[data-upload-clear]');\n  var previewImages = document.querySelectorAll('img[data-upload-preview]');\n  previewImages.forEach(function (previewImage, index) {\n    previewImage = document.getElementById(previewImage.id);\n    var inputId = previewImage.dataset.uploadPreview;\n    var clearInput = Array.from(clearInputs).filter(function (el) {\n      return el.matches('[data-upload-clear=\"' + inputId + '\"]');\n    });\n    document.querySelector('#' + inputId).addEventListener('change', function (e) {\n      var domInput = e.target;\n      if (domInput.files && domInput.files[0]) {\n        var name = domInput.files[0].name;\n        var text = document.querySelector('#text-' + inputId);\n        if (text != null) {\n          text.value = name;\n        }\n        previewImage.alt = name;\n        if (window.FileReader) {\n          var reader = new window.FileReader();\n          reader.addEventListener('load', function (e) {\n            previewImage.setAttribute('src', e.target.result);\n            clearInput.checked = false;\n          });\n          reader.readAsDataURL(domInput.files[0]);\n        } else {\n          clearInput.checked = false;\n        }\n      }\n    });\n  });\n}\ndocument.addEventListener('DOMContentLoaded', init, false);\ndocument.addEventListener('a4.embed.ready', init, false);\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/adhocracy4/adhocracy4/images/assets/image_uploader.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./node_modules/adhocracy4/adhocracy4/images/assets/image_uploader.js"));
/******/ }
]);