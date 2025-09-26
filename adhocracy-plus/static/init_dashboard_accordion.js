/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./adhocracy-plus/assets/js/init_dashboard_accordion.js":
/*!**************************************************************!*\
  !*** ./adhocracy-plus/assets/js/init_dashboard_accordion.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\nvar _jsCookie = _interopRequireDefault(__webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/dist/js.cookie.js\"));\ndocument.addEventListener('DOMContentLoaded', initDashboardAccordion, false);\ndocument.removeEventListener('unload', initDashboardAccordion);\nfunction initDashboardAccordion() {\n  var COOKIE_NAME = 'dashboard_projects_closed_accordions';\n  var HTML_ATTR = 'aria-expanded';\n  var accordionMenus = document.querySelectorAll('div.dashboard-nav__dropdown');\n  var manageObservers = function manageObservers() {\n    var observer = new MutationObserver(function (mutations) {\n      var foundMutation = mutations.find(function (m) {\n        return m.attributeName === HTML_ATTR;\n      });\n      manageCookie(foundMutation.target);\n    });\n    accordionMenus.forEach(function (accordion) {\n      var config = {\n        attributeFilter: [HTML_ATTR]\n      };\n      observer.observe(accordion, config);\n    });\n  };\n  var setCookie = function setCookie(value) {\n    return _jsCookie.default.set(COOKIE_NAME, value, {\n      sameSite: 'lax'\n    });\n  };\n  var manageCookie = function manageCookie(currentElement) {\n    var currentId = parseInt(currentElement.id.split('--')[1]);\n    var isProject = currentElement.id.startsWith('dashboard-nav__project--');\n    var cookie = _jsCookie.default.get(COOKIE_NAME);\n    var currentExpanded = !currentElement.classList.contains('collapsed');\n    var current = [[], []];\n    var currentList = [];\n    if (cookie) {\n      current = JSON.parse(cookie);\n    }\n    currentList = current[isProject ? 0 : 1];\n    if (!currentExpanded && !currentList.includes(currentId)) {\n      currentList.push(currentId);\n      setCookie(JSON.stringify(current));\n    } else if (currentExpanded && currentList.includes(currentId)) {\n      currentList.splice(currentList.indexOf(currentId), 1);\n      setCookie(JSON.stringify(current));\n    }\n  };\n  if (_jsCookie.default.get(COOKIE_NAME) === undefined) {\n    setCookie('[[], []]');\n  }\n  manageObservers();\n}\n\n//# sourceURL=webpack://adhocracy-plus/./adhocracy-plus/assets/js/init_dashboard_accordion.js?");

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.js":
/*!**************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.js ***!
  \**************************************************/
/***/ (function(module) {

eval("/*! js-cookie v3.0.5 | MIT */\n;\n(function (global, factory) {\n   true ? module.exports = factory() :\n  0;\n})(this, (function () { 'use strict';\n\n  /* eslint-disable no-var */\n  function assign (target) {\n    for (var i = 1; i < arguments.length; i++) {\n      var source = arguments[i];\n      for (var key in source) {\n        target[key] = source[key];\n      }\n    }\n    return target\n  }\n  /* eslint-enable no-var */\n\n  /* eslint-disable no-var */\n  var defaultConverter = {\n    read: function (value) {\n      if (value[0] === '\"') {\n        value = value.slice(1, -1);\n      }\n      return value.replace(/(%[\\dA-F]{2})+/gi, decodeURIComponent)\n    },\n    write: function (value) {\n      return encodeURIComponent(value).replace(\n        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,\n        decodeURIComponent\n      )\n    }\n  };\n  /* eslint-enable no-var */\n\n  /* eslint-disable no-var */\n\n  function init (converter, defaultAttributes) {\n    function set (name, value, attributes) {\n      if (typeof document === 'undefined') {\n        return\n      }\n\n      attributes = assign({}, defaultAttributes, attributes);\n\n      if (typeof attributes.expires === 'number') {\n        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);\n      }\n      if (attributes.expires) {\n        attributes.expires = attributes.expires.toUTCString();\n      }\n\n      name = encodeURIComponent(name)\n        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)\n        .replace(/[()]/g, escape);\n\n      var stringifiedAttributes = '';\n      for (var attributeName in attributes) {\n        if (!attributes[attributeName]) {\n          continue\n        }\n\n        stringifiedAttributes += '; ' + attributeName;\n\n        if (attributes[attributeName] === true) {\n          continue\n        }\n\n        // Considers RFC 6265 section 5.2:\n        // ...\n        // 3.  If the remaining unparsed-attributes contains a %x3B (\";\")\n        //     character:\n        // Consume the characters of the unparsed-attributes up to,\n        // not including, the first %x3B (\";\") character.\n        // ...\n        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];\n      }\n\n      return (document.cookie =\n        name + '=' + converter.write(value, name) + stringifiedAttributes)\n    }\n\n    function get (name) {\n      if (typeof document === 'undefined' || (arguments.length && !name)) {\n        return\n      }\n\n      // To prevent the for loop in the first place assign an empty array\n      // in case there are no cookies at all.\n      var cookies = document.cookie ? document.cookie.split('; ') : [];\n      var jar = {};\n      for (var i = 0; i < cookies.length; i++) {\n        var parts = cookies[i].split('=');\n        var value = parts.slice(1).join('=');\n\n        try {\n          var found = decodeURIComponent(parts[0]);\n          jar[found] = converter.read(value, found);\n\n          if (name === found) {\n            break\n          }\n        } catch (e) {}\n      }\n\n      return name ? jar[name] : jar\n    }\n\n    return Object.create(\n      {\n        set,\n        get,\n        remove: function (name, attributes) {\n          set(\n            name,\n            '',\n            assign({}, attributes, {\n              expires: -1\n            })\n          );\n        },\n        withAttributes: function (attributes) {\n          return init(this.converter, assign({}, this.attributes, attributes))\n        },\n        withConverter: function (converter) {\n          return init(assign({}, this.converter, converter), this.attributes)\n        }\n      },\n      {\n        attributes: { value: Object.freeze(defaultAttributes) },\n        converter: { value: Object.freeze(converter) }\n      }\n    )\n  }\n\n  var api = init(defaultConverter, { path: '/' });\n  /* eslint-enable no-var */\n\n  return api;\n\n}));\n\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/js-cookie/dist/js.cookie.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/***/ (function(module) {

eval("function _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : {\n    \"default\": obj\n  };\n}\nmodule.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports[\"default\"] = module.exports;\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/@babel/runtime/helpers/interopRequireDefault.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./adhocracy-plus/assets/js/init_dashboard_accordion.js");
/******/ 	
/******/ })()
;