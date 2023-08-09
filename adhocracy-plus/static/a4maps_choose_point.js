"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadhocracy_plus"] = self["webpackChunkadhocracy_plus"] || []).push([["a4maps_choose_point"],{

/***/ "./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_choose_point.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_choose_point.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.min.js\");\n\n\nvar _a4maps_common = __webpack_require__(/*! ./a4maps_common */ \"./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_common.js\");\nfunction createMarker($, L, newlatln, oldlatln, basePolygon, map, name) {\n  var icon = L.icon({\n    iconUrl: '/static/images/map_pin_default.svg',\n    shadowUrl: '/static/images/map_shadow_01.svg',\n    iconSize: [30, 36],\n    iconAnchor: [15, 36],\n    shadowSize: [40, 54],\n    shadowAnchor: [20, 54],\n    popupAnchor: [0, -45]\n  });\n  var marker = L.marker(newlatln, {\n    draggable: true,\n    icon: icon\n  }).addTo(map);\n  marker.on('dragend', function () {\n    var markerInsidePolygon = false;\n    basePolygon.getLayers().forEach(function (each) {\n      if (isMarkerInsidePolygon(marker, each)) {\n        markerInsidePolygon = true;\n        oldlatln = marker.getLatLng();\n        var shape = marker.toGeoJSON();\n        $('#id_' + name).val(JSON.stringify(shape));\n        $('#id_' + name).trigger('change');\n      }\n    });\n    if (!markerInsidePolygon) {\n      marker.setLatLng(oldlatln);\n    }\n  });\n  return marker;\n}\nfunction getLines(array) {\n  var output = [];\n  if (array.length) {\n    if ('lat' in array[0]) {\n      for (var i = 0, j = array.length - 1; i < array.length; j = i++) {\n        output.push([array[i], array[j]]);\n      }\n    } else {\n      array.forEach(function (a) {\n        getLines(a).forEach(function (line) {\n          output.push(line);\n        });\n      });\n    }\n  }\n  return output;\n}\nfunction isMarkerInsidePolygon(marker, poly) {\n  var x = marker.getLatLng().lat;\n  var y = marker.getLatLng().lng;\n\n  // Algorithm comes from:\n  // https://github.com/substack/point-in-polygon/blob/master/index.js\n  var inside = false;\n\n  // FIXME: getLatLngs does not return holes. Maybe use toGetJson instead?\n  getLines(poly.getLatLngs()).forEach(function (line) {\n    var xi = line[0].lat;\n    var yi = line[0].lng;\n    var xj = line[1].lat;\n    var yj = line[1].lng;\n\n    //      *\n    //     /\n    // *--/----------->>\n    //   *\n    // Check that\n    //\n    // 1.  yi and yj are on opposite sites of a ray to the right\n    // 2.  the intersection of the ray and the segment is right of x\n    var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;\n    if (intersect) inside = !inside;\n  });\n  return inside;\n}\nfunction init() {\n  var L = window.L;\n  $('[data-map=\"choose_point\"]').each(function (i, e) {\n    var name = e.getAttribute('data-name');\n    var polygon = JSON.parse(e.getAttribute('data-polygon'));\n    var point = JSON.parse(e.getAttribute('data-point'));\n    var map = (0, _a4maps_common.createMap)(L, e, {\n      baseUrl: e.getAttribute('data-baseurl'),\n      useVectorMap: e.getAttribute('data-usevectormap'),\n      attribution: e.getAttribute('data-attribution'),\n      mapboxToken: e.getAttribute('data-mapbox-token'),\n      omtToken: e.getAttribute('data-omt-token'),\n      dragging: true,\n      scrollWheelZoom: false,\n      zoomControl: false\n    });\n    var polygonStyle = {\n      color: '#0076ae',\n      weight: 2,\n      opacity: 1,\n      fillOpacity: 0.2\n    };\n    var basePolygon = L.geoJson(polygon, {\n      style: polygonStyle\n    }).addTo(map);\n    map.fitBounds(basePolygon.getBounds());\n    map.options.minZoom = map.getZoom();\n    L.control.zoom({\n      position: 'topleft'\n    }).addTo(map);\n    var marker;\n    if (point) {\n      L.geoJson(point, {\n        pointToLayer: function pointToLayer(feature, newlatlng) {\n          var oldlatlng = newlatlng;\n          marker = createMarker($, L, newlatlng, oldlatlng, basePolygon, map, name);\n          return marker;\n        }\n      });\n    }\n    basePolygon.on('click', function (event) {\n      if (typeof marker === 'undefined') {\n        var oldlatlng = event.latlng;\n        marker = createMarker($, L, event.latlng, oldlatlng, basePolygon, map, name);\n        var shape = marker.toGeoJSON();\n        $('#id_' + name).val(JSON.stringify(shape));\n        $('#id_' + name).trigger('change');\n      }\n    });\n    $('#id_' + name).on('change', function (event) {\n      if (!this.value) return;\n      var shape = L.geoJSON(JSON.parse(this.value));\n      var point = shape.getLayers()[0];\n      var latlng = point.getLatLng();\n      if (typeof marker === 'undefined') {\n        marker = createMarker($, L, latlng, null, basePolygon, map, name);\n      } else {\n        marker.setLatLng(latlng);\n      }\n    });\n  });\n}\ndocument.addEventListener('DOMContentLoaded', init, false);\ndocument.addEventListener('a4.embed.ready', init, false);\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_choose_point.js?");

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
/******/ var __webpack_exports__ = (__webpack_exec__("./node_modules/leaflet/dist/leaflet.css"), __webpack_exec__("./node_modules/maplibre-gl/dist/maplibre-gl.css"), __webpack_exec__("./node_modules/adhocracy4/adhocracy4/maps/static/a4maps/a4maps_choose_point.js"));
/******/ }
]);