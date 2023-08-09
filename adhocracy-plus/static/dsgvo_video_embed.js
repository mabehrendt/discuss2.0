/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkadhocracy_plus"] = self["webpackChunkadhocracy_plus"] || []).push([["dsgvo_video_embed"],{

/***/ "./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.js":
/*!**********************************************************************!*\
  !*** ./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.js ***!
  \**********************************************************************/
/***/ (function() {

eval("/**\n * DSGVO Video Embed, v1.0.2\n * (c) 2018 Arndt von Lucadou\n * MIT License\n * https://github.com/a-v-l/dsgvo-video-embed\n */\n\n !function(){var e={youtube:\"<strong>\"+django.gettext(\"External Video\")+\"</strong><div><p>\"+django.gettext(\"Here you can find a video from Google (YouTube). To protect your data the content will only be loaded after you give your consent. Only then will YouTube set Cookies that collect information on user behaviour.\")+\"</p><p>\"+django.gettext(\"More information can be found in the privacy policy of Google under: \")+'<a href=\"https://www.google.de/intl/de/policies/privacy/\" rel=\"noopener\" target=\"_blank\">https://policies.google.com/privacy/</a></p></div><a class=\"video-link\" href=\"https://youtu.be/%id%\" rel=\"noopener\" target=\"_blank\">'+django.gettext(\"Link to Video: \")+\"https://youtu.be/%id%</a><button>\"+django.gettext(\"Play video\")+\"</button>\",vimeo:\"<strong>\"+django.gettext(\"External Video\")+\"</strong><div><p>\"+django.gettext(\"Here you can find a video from Vimeo. To protect your data the content will only be loaded after you give your consent. Only then will Vimeo set Cookies that collect information on user behaviour.\")+\"</p><p>\"+django.gettext(\"More information can be found in the privacy policy of Vimeo under: \")+'<a href=\"https://vimeo.com/privacy\" rel=\"noopener\" target=\"_blank\">https://vimeo.com/privacy</a></p></div><a class=\"video-link\" href=\"https://vimeo.com/%id%\" rel=\"noopener\" target=\"_blank\">'+django.gettext(\"Link to Video: \")+\"https://vimeo.com/%id%</a><button>\"+django.gettext(\"Play video\")+\"</button>\"};window.video_iframes=[],document.addEventListener(\"DOMContentLoaded\",function(){for(var t,o,i,n,a,r,d,l=0,c=window.frames.length-1;l<=c;l+=1)r=(t=document.getElementsByTagName(\"iframe\")[0]).getAttribute(\"width\"),d=t.getAttribute(\"height\"),n=t.src,video_iframes.push(t),o=document.createElement(\"article\"),null!=n.match(/youtube|vimeo/)&&(setTimeout(function(){window.video_iframes[0].stop},1e3),i=null==n.match(/vimeo/)?\"youtube\":\"vimeo\",a=n.match(/(embed|video)\\/([^?\\s]*)/)[2],o.setAttribute(\"class\",\"video-wall\"),o.setAttribute(\"data-index\",l),r&&d&&o.setAttribute(\"style\",\"width:\"+r+\"px;height:\"+d+\"px\"),o.innerHTML=e[i].replace(/\\%id\\%/g,a),t.parentNode.replaceChild(o,t),document.querySelectorAll(\".video-wall button\")[l].addEventListener(\"click\",function(){var e=this.parentNode,t=e.getAttribute(\"data-index\");video_iframes[t].src=video_iframes[t].src.replace(/www\\.youtube\\.com/,\"www.youtube-nocookie.com\"),e.parentNode.replaceChild(video_iframes[t],e),video_iframes[t].classList.add(\"ck_embed_iframe\"),video_iframes[t].parentNode.classList.add(\"ck_embed_iframe__container\")},!1))})}();\n\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.js?");

/***/ }),

/***/ "./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.css":
/*!***********************************************************************!*\
  !*** ./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.css ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.css?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__("./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.css"), __webpack_exec__("./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.js"));
/******/ }
]);