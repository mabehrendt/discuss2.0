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

eval("(function(){var text={youtube:\"<strong>\"+django.gettext(\"External Video\")+\"</strong>\"+\"<div>\"+\"<p>\"+django.gettext(\"Here you can find a video from Google (YouTube). To protect your data the content will only be loaded after you give your consent. Only then will YouTube set Cookies that collect information on user behaviour.\")+\"</p>\"+\"<p>\"+django.gettext(\"More information can be found in the privacy policy of Google under: \")+'<a href=\"https://www.google.de/intl/de/policies/privacy/\" rel=\"noopener\" target=\"_blank\">'+\"https://policies.google.com/privacy/\"+\"</a>\"+\"</p>\"+\"</div>\"+'<a class=\"video-link\" href=\"https://youtu.be/%id%\" rel=\"noopener\" target=\"_blank\">'+django.gettext(\"Link to Video: \")+\"https://youtu.be/%id%\"+\"</a>\"+\"<button>\"+django.gettext(\"Play video\")+\"</button>\",vimeo:\"<strong>\"+django.gettext(\"external video\")+\"</strong>\"+\"<div>\"+\"<p>\"+django.gettext(\"here you can find a video from vimeo. to protect your data the content will only be loaded after you give your consent. only then will vimeo set cookies that collect information on user behaviour.\")+\"</p>\"+\"<p>\"+django.gettext(\"more information can be found in the privacy policy of vimeo under: \")+'<a href=\"https://vimeo.com/privacy\" rel=\"noopener\" target=\"_blank\">'+\"https://vimeo.com/privacy\"+\"</a>\"+\"</p>\"+\"</div>\"+'<a class=\"video-link\" href=\"https://vimeo.com/%id%\" rel=\"noopener\" target=\"_blank\">'+django.gettext(\"link to video: \")+\"https://vimeo.com/%id%\"+\"</a>\"+\"<button>\"+django.gettext(\"play video\")+\"</button>\"};window.video_iframes=[];document.addEventListener(\"DOMContentLoaded\",function(){var video_frame,wall,video_platform,video_src,video_id,video_w,video_h;for(var i=0,max=window.frames.length-1;i<=max;i+=1){video_frame=document.getElementsByTagName(\"iframe\")[0];video_src=video_frame.src||video_frame.dataset.src;if(video_src.match(/youtube|vimeo/)==null){continue}video_iframes.push(video_frame);video_w=video_frame.getAttribute(\"width\");video_h=video_frame.getAttribute(\"height\");wall=document.createElement(\"article\");if(!!video_frame.src){if(typeof window.frames[0].stop===\"undefined\"){setTimeout(function(){window.frames[0].execCommand(\"Stop\")},1e3)}else{setTimeout(function(){window.frames[0].stop()},1e3)}}video_platform=video_src.match(/vimeo/)==null?\"youtube\":\"vimeo\";video_id=video_src.match(/(embed|video)\\/([^?\\s]*)/)[2];wall.setAttribute(\"class\",\"video-wall\");wall.setAttribute(\"data-index\",i);if(video_w&&video_h){wall.setAttribute(\"style\",\"width:\"+video_w+\"px;height:\"+video_h+\"px\")}wall.innerHTML=text[video_platform].replace(/\\%id\\%/g,video_id);video_frame.parentNode.replaceChild(wall,video_frame);document.querySelectorAll(\".video-wall button\")[i].addEventListener(\"click\",function(){var video_frame=this.parentNode,index=video_frame.dataset.index;if(!!video_iframes[index].dataset.src){video_iframes[index].src=video_iframes[index].dataset.src;video_iframes[index].removeAttribute(\"data-src\")}video_iframes[index].src=video_iframes[index].src.replace(/www\\.youtube\\.com/,\"www.youtube-nocookie.com\");video_frame.parentNode.replaceChild(video_iframes[index],video_frame);video_iframes[index].classList.add(\"ck_embed_iframe\");video_iframes[index].parentNode.classList.add(\"ck_embed_iframe__container\")},false)}})})();\n\n//# sourceURL=webpack://adhocracy-plus/./node_modules/dsgvo-video-embed/dist/dsgvo-video-embed.min.js?");

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