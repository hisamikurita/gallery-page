/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/scripts/app.js":
/*!***********************************!*\
  !*** ./src/assets/scripts/app.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gsap */ "./node_modules/gsap/index.js");

var body = document.querySelector('body');
var wheelEl = document.querySelector('.wheel');
var keyEl = document.querySelector('.key');
var mouseEl = document.querySelector('.mouseMove');
var mouseStartEl = document.querySelector('.mouseStart');
var mouseEndEl = document.querySelector('.mouseEnd');
var mouseDistanceEl = document.querySelector('.mouseDistance');
var scrollEl = document.querySelector('.scroll');
var list = document.querySelector('.list');
var items = document.querySelectorAll('.item');
var wheelX = document.querySelector('.wheelX');
var wheelY = document.querySelector('.wheelY');
var keyX = document.querySelector('.keyX');
var keyY = document.querySelector('.keyY');
var startX = document.querySelector('.startX');
var startY = document.querySelector('.startY');
var endX = document.querySelector('.endX');
var endY = document.querySelector('.endY');
var allDistanceX = document.querySelector('.allDistanceX');
var allDistanceY = document.querySelector('.allDistanceY');
var distanceX = document.querySelector('.distanceX');
var distanceY = document.querySelector('.distanceY');
var scrollX = document.querySelector('.scrollX');
var scrollY = document.querySelector('.scrollY');
var targetX = document.querySelector('.targetX');
var targetY = document.querySelector('.targetY');
var currentX = document.querySelector('.currentX');
var currentY = document.querySelector('.currentY');
var isDown = false;
var keyStrength = 0;
var timeoutId = null;
var array = [];

for (var i = 0; i < items.length; i++) {
  array.push({
    item: items[i],
    extra: {
      x: 0,
      y: 0
    }
  });
}

var x = {
  start: 0,
  end: 0,
  distance: 0,
  mouse: 0,
  current: 0,
  target: 0,
  scroll: 0,
  save: 0,
  wheel: 0,
  key: 0,
  direction: 0
};
var y = {
  start: 0,
  end: 0,
  distance: 0,
  mouse: 0,
  current: 0,
  target: 0,
  scroll: 0,
  save: 0,
  wheel: 0,
  key: 0,
  direction: 0
};
var lerp = 0.1;

var onTouchDown = function onTouchDown(e) {
  isDown = true;
  console.log('down'); // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐

  x.start = e.touches ? e.touches[0].clientX : e.clientX;
  y.start = e.touches ? e.touches[0].clientY : e.clientY; // 過去の移動量を取得しておく

  x.scroll = x.save;
  y.scroll = y.save;
  mouseStartEl.style.color = 'red';
  mouseEndEl.style.color = 'red';
  mouseDistanceEl.style.color = 'red';
  scrollEl.style.color = 'red';
};

var onTouchMove = function onTouchMove(e) {
  // downしていない時は処理を返す
  if (!isDown) return;
  console.log('move');
  body.style.cursor = 'grabbing';
  list.style.pointerEvents = 'none'; // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐

  x.end = e.touches ? e.touches[0].clientX : e.clientX;
  y.end = e.touches ? e.touches[0].clientY : e.clientY; // down後に動いた移動量を取得

  x.distance = x.start - x.end;
  y.distance = y.start - y.end; // 目標位置 = down後に動いた移動量 + 過去の移動量

  x.target = x.distance + x.scroll;
  y.target = y.distance + y.scroll;
};

var onTouchUp = function onTouchUp() {
  isDown = false;
  console.log('up');
  body.style.cursor = 'auto';
  list.style.pointerEvents = 'auto';
  x.mouse += x.distance;
  y.mouse += y.distance;
  mouseStartEl.style.color = '';
  mouseEndEl.style.color = '';
  mouseDistanceEl.style.color = '';
  scrollEl.style.color = '';
};

var onMouseWheel = function onMouseWheel(e) {
  e.preventDefault();
  x.wheel += e.deltaX;
  y.wheel += e.deltaY; // 全てのイベントの総移動量から目標位置を計算

  x.target = x.wheel + x.mouse + x.key;
  y.target = y.wheel + y.mouse + y.key;
  wheelEl.style.color = 'red';
  keyEl.style.color = 'red';
  mouseEl.style.color = 'red';
  console.log(x.direction);
  console.log(y.direction); // スクロールを停止して0.1s後に処理を実行

  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    wheelEl.style.color = '';
    keyEl.style.color = '';
    mouseEl.style.color = '';
  }, 100);
};

var onKeyDown = function onKeyDown(e) {
  console.log('down');
  if (keyStrength < 140) keyStrength += 12.0;

  if (e.key === 'ArrowDown') {
    y.key += keyStrength;
  }

  if (e.key === 'ArrowUp') {
    y.key += -keyStrength;
  }

  if (e.key === 'ArrowRight') {
    x.key += keyStrength;
  }

  if (e.key === 'ArrowLeft') {
    x.key += -keyStrength;
  } // 全てのイベントの総移動量から目標位置を計算


  x.target = x.key + x.wheel + x.mouse;
  y.target = y.key + y.wheel + y.mouse;
  wheelEl.style.color = 'red';
  keyEl.style.color = 'red';
  mouseEl.style.color = 'red';
};

var onKeyUp = function onKeyUp() {
  console.log('up');
  keyStrength = 0;
  wheelEl.style.color = '';
  keyEl.style.color = '';
  mouseEl.style.color = '';
};

var raf = function raf() {
  // 線形補完
  x.current = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.interpolate(x.current, x.target, lerp);
  y.current = gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.utils.interpolate(y.current, y.target, lerp); // 移動方向を取得

  if (x.save < x.current) {
    x.direction = 'right';
  } else if (x.save > x.current) {
    x.direction = 'left';
  }

  if (y.save < y.current) {
    y.direction = 'bottom';
  } else if (y.save > y.current) {
    y.direction = 'top';
  }

  x.save = x.current;
  y.save = y.current;

  for (var _i = 0; _i < array.length; _i++) {
    var rect = array[_i].item.getBoundingClientRect(); // windowの画面外に行った時に、wrapper要素の横幅分ずらしていく


    if (x.direction === 'right' && rect.left < -rect.width) {
      console.log('画面外');
      array[_i].extra.x += list.clientWidth;
    } else if (x.direction === 'left' && window.innerWidth < rect.left) {
      console.log('画面外');
      array[_i].extra.x += -list.clientWidth;
    }

    if (y.direction === 'top' && window.innerHeight < rect.top) {
      console.log('画面外');
      array[_i].extra.y += -list.clientHeight;
    } else if (y.direction === 'bottom' && rect.top < -rect.height) {
      console.log('画面外');
      array[_i].extra.y += list.clientHeight;
    }

    var finalX = -x.current + array[_i].extra.x;
    var finalY = -y.current + array[_i].extra.y;
    array[_i].item.style.transform = "translate(".concat(finalX, "px, ").concat(finalY, "px)");
  }

  wheelX.textContent = x.wheel;
  wheelY.textContent = y.wheel;
  keyX.textContent = x.key;
  keyY.textContent = y.key;
  startX.textContent = x.start;
  startY.textContent = y.start;
  endX.textContent = x.end;
  endY.textContent = y.end;
  allDistanceX.textContent = x.mouse;
  allDistanceY.textContent = y.mouse;
  distanceX.textContent = x.distance;
  distanceY.textContent = y.distance;
  scrollX.textContent = x.scroll;
  scrollY.textContent = y.scroll;
  targetX.textContent = x.target;
  targetY.textContent = y.target;
  currentX.textContent = x.current;
  currentY.textContent = y.current;
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('mousedown', onTouchDown);
window.addEventListener('mousemove', onTouchMove);
window.addEventListener('mouseup', onTouchUp);
window.addEventListener('touchstart', onTouchDown);
window.addEventListener('touchmove', onTouchMove);
window.addEventListener('touchend', onTouchUp);
window.addEventListener('wheel', onMouseWheel, {
  passive: false
});
gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.ticker.fps(60);
gsap__WEBPACK_IMPORTED_MODULE_0__.gsap.ticker.add(raf);

/***/ }),

/***/ "./src/assets/stylesheets/app.scss":
/*!*****************************************!*\
  !*** ./src/assets/stylesheets/app.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkwebpack_creativesite_boilerplate"] = self["webpackChunkwebpack_creativesite_boilerplate"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/assets/scripts/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/assets/stylesheets/app.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.js.map