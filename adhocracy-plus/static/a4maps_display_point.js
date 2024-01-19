"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadhocracy_plus"] = self["webpackChunkadhocracy_plus"] || []).push([["a4maps_display_point"],{

/***/ "./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_display_point.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_display_point.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.min.js\");\n\n\nvar _a4maps_common = __webpack_require__(/*! ./a4maps_common */ \"./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_common.js\");\nfunction init() {\n  var L = window.L;\n  $('[data-map=\"display_point\"]').each(function (i, e) {\n    var polygon = JSON.parse(e.getAttribute('data-polygon'));\n    var point = JSON.parse(e.getAttribute('data-point'));\n    var pinSrc = JSON.parse(e.getAttribute('data-pin-src'));\n    var map = (0, _a4maps_common.createMap)(L, e, {\n      baseUrl: e.getAttribute('data-baseurl'),\n      useVectorMap: e.getAttribute('data-usevectormap'),\n      attribution: e.getAttribute('data-attribution'),\n      mapboxToken: e.getAttribute('data-mapbox-token'),\n      omtToken: e.getAttribute('data-omt-token'),\n      dragging: true,\n      scrollWheelZoom: false,\n      zoomControl: false\n    });\n    var polygonStyle = {\n      color: '#0076ae',\n      weight: 2,\n      opacity: 1,\n      fillOpacity: 0.2\n    };\n    var defaultIcon = L.icon({\n      iconUrl: '/static/images/map_pin_default.svg',\n      shadowUrl: '/static/images/map_shadow_01.svg',\n      iconSize: [30, 36],\n      iconAnchor: [15, 36],\n      shadowSize: [40, 54],\n      shadowAnchor: [20, 54],\n      popupAnchor: [0, -45]\n    });\n    var basePolygon = L.geoJson(polygon, {\n      style: polygonStyle\n    }).addTo(map);\n    map.fitBounds(basePolygon.getBounds());\n    map.options.minZoom = map.getZoom();\n    L.control.zoom({\n      position: 'topleft'\n    }).addTo(map);\n    L.geoJson(point, {\n      pointToLayer: function pointToLayer(feature, latlng) {\n        var icon = defaultIcon;\n        if (pinSrc) {\n          icon = L.icon({\n            iconUrl: pinSrc,\n            shadowUrl: '/static/images/map_shadow_01.svg',\n            iconSize: [30, 36],\n            iconAnchor: [15, 36],\n            popupAnchor: [0, 5]\n          });\n        }\n        var marker = L.marker(latlng, {\n          icon: icon\n        }).addTo(map);\n        return marker;\n      }\n    });\n  });\n}\ndocument.addEventListener('DOMContentLoaded', init, false);\ndocument.addEventListener('a4.embed.ready', init, false);\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_display_point.js?");

/***/ }),

/***/ "./node_modules/leaflet/dist/leaflet.css":
/*!***********************************************!*\
  !*** ./node_modules/leaflet/dist/leaflet.css ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/leaflet/dist/leaflet.css?");

/***/ }),

/***/ "./node_modules/maplibre-gl/dist/maplibre-gl.css":
/*!*******************************************************!*\
  !*** ./node_modules/maplibre-gl/dist/maplibre-gl.css ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/maplibre-gl/dist/maplibre-gl.css?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./node_modules/leaflet/dist/leaflet.css"), __webpack_exec__("./node_modules/maplibre-gl/dist/maplibre-gl.css"), __webpack_exec__("./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_display_point.js"));
/******/ }
]);