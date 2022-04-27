var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { defineComponent, getCurrentInstance, ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount, resolveDirective, openBlock, createElementBlock, Fragment, createElementVNode, renderSlot, createBlock, Teleport, normalizeClass, createVNode, Transition, withCtx, withDirectives, normalizeStyle, createCommentVNode, resolveComponent, toDisplayString, watchEffect, mergeProps, toHandlers, useAttrs, onUnmounted, createTextVNode, render, inject, withModifiers, renderList, vShow, provide, h } from "vue";
function defaultConditional() {
  return true;
}
function directive(e, el, binding) {
  const handler = typeof binding.value === "function" ? binding.value : binding.value.handler;
  const isActive = typeof binding.value === "object" && binding.value.closeConditional || defaultConditional;
  if (!e || isActive(e) === false)
    return;
  const elements = (typeof binding.value === "object" && binding.value.include || (() => []))();
  elements.push(el);
  !elements.some((el2) => el2.contains(e.target)) && setTimeout(() => {
    isActive(e) && handler && handler(e);
  }, 0);
}
const ClickOutside = {
  beforeMount(el, binding) {
    const isDisabled = typeof binding.value === "object" && binding.value.isDisabled;
    if (isDisabled) {
      return;
    }
    const onClick = (e) => directive(e, el, binding);
    const app = document.querySelector("[data-app]") || document.body;
    app.addEventListener("click", onClick, true);
    el._clickOutside = onClick;
  },
  unmounted(el) {
    if (!el._clickOutside)
      return;
    const app = document.querySelector("[data-app]") || document.body;
    app && app.removeEventListener("click", el._clickOutside, true);
    delete el._clickOutside;
  }
};
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce$1(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce$1(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
popperGenerator();
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = popperGenerator({
  defaultModifiers
});
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
makeMap(GLOBALS_WHITE_LISTED);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
makeMap(specialBooleanAttrs);
makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
makeMap(HTML_TAGS);
makeMap(SVG_TAGS);
makeMap(VOID_TAGS);
const isObject = (val) => val !== null && typeof val === "object";
makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const getUuid = () => {
  const s = [];
  const hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
};
function debounce(func, wait) {
  let timer;
  return function(...argument) {
    const args = argument;
    clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(this, args);
    }, wait);
  };
}
const mapToArr = (map) => {
  return Array.from(map);
};
const arrDupRemov = (arr, key) => {
  const newObj = {};
  return arr.reduce((preVal, curVal) => {
    newObj[curVal[key]] ? "" : newObj[curVal[key]] = preVal.push(curVal);
    return preVal;
  }, []);
};
const accAdd = (arg1, arg2) => {
  let r1, r2;
  let m = 0;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};
const getMaxDecimalLength = (val) => {
  let maxDecimalLength = 0;
  val.forEach((x) => {
    const strVal = x.toString(), dotIndex = strVal.indexOf(".");
    if (dotIndex > -1) {
      const curDecimalLength = strVal.length - 1 - dotIndex;
      if (curDecimalLength > maxDecimalLength) {
        maxDecimalLength = curDecimalLength;
      }
    }
  });
  return maxDecimalLength;
};
const accSub = (arg) => {
  let sum = 0;
  const maxDecimalLength = getMaxDecimalLength(arg);
  arg.forEach((x, index2) => {
    const nurVal = Math.round(x * Math.pow(10, maxDecimalLength));
    if (index2 === 0)
      sum = nurVal;
    else
      sum -= nurVal;
  });
  return sum / Math.pow(10, maxDecimalLength);
};
const checkNumber = (str) => {
  const reg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/;
  if (reg.test(str)) {
    return true;
  }
  return false;
};
const jsonClone = (val) => JSON.parse(JSON.stringify(val));
const isBool = (val) => typeof val === "boolean";
const isString = (val) => typeof val == "string" && val.constructor == String;
const isNumber = (val) => typeof val === "number";
const isFunction = (val) => Object.prototype.toString.call(val) === "[object Function]";
const arrayDeduplicationt = (val, key) => {
  const obj = {};
  return val.reduce((cur, next) => {
    obj[next[key]] ? "" : obj[next[key]] = cur.push(next);
    return cur;
  }, []);
};
var bePopover_vue_vue_type_style_index_0_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$i = defineComponent({
  name: "BePopover",
  directives: { ClickOutside },
  props: {
    placement: {
      type: String,
      default: "top"
    },
    raw: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ""
    },
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    width: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 100
    },
    duration: {
      type: Number,
      default: 100
    },
    trigger: {
      type: String,
      default: "hover"
    },
    triggerElm: {
      type: String,
      default: ""
    }
  },
  emits: ["update"],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    let show = ref(false);
    const close2 = () => {
      setTimeout(() => {
        show.value = false;
        isEnterPopover.value = false;
        ctx.emit("update", show.value);
      }, props.duration);
    };
    const changeDisplay = (showParams) => {
      let delay = 0;
      const isShow = showParams === "manual" ? !show.value : showParams;
      if (isShow) {
        delay = props.delay;
      } else {
        delay = props.duration;
      }
      setTimeout(() => {
        if (isEnterPopover.value && !isShow && props.trigger === "hover") {
          return;
        }
        show.value = isShow;
        observer.disconnect();
        nextTick(() => {
          if (show.value) {
            computePosition(props.placement);
          }
          ctx.emit("update", show.value);
        });
      }, delay);
    };
    let stylePopover = reactive({
      left: "0px",
      top: "0px",
      zIndex: "2000"
    });
    let popperJS = ref();
    const computePosition = (placement, type = "") => {
      var _a;
      if (type === "update") {
        (_a = popperJS.value) == null ? void 0 : _a.update();
        return;
      }
      if (popperJS.value && popperJS.value.destroy) {
        popperJS.value.destroy();
      }
      const popover = document.getElementById(`be_popover_${internalInstance.uid}`);
      const arrow2 = document.getElementById(`be_popover_arrow${internalInstance.uid}`);
      let popoverOption = {
        placement,
        modifiers: [
          {
            name: "arrow",
            options: {
              element: arrow2
            }
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["top", "right", "bottom"]
            }
          },
          {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          }
        ],
        strategy: "fixed"
      };
      if (props.x && props.y) {
        let VNodeTrigger = {
          getBoundingClientRect: generateGetBoundingClientRect()
        };
        popperJS.value = createPopper(VNodeTrigger, popover, popoverOption);
        VNodeTrigger.getBoundingClientRect = generateGetBoundingClientRect(props.x, props.y);
        popperJS.value.update();
      } else {
        popperJS.value = createPopper(computeDom, popover, popoverOption);
      }
      observer.observe(popover, {
        attributes: true,
        attributeFilter: ["style"]
      });
    };
    let observer = new MutationObserver(() => {
      var _a;
      (_a = popperJS.value) == null ? void 0 : _a.update();
    });
    const generateGetBoundingClientRect = (x = 0, y = 0) => {
      const rect = {
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x
      };
      return () => rect;
    };
    let triggerDom = null;
    let computeDom = null;
    const matchDom = (root) => {
      for (let i = 0; i < root.childNodes.length; i++) {
        let node = root.childNodes[i];
        if (node.nodeType !== 3 && node.nodeType !== 8 && node.nodeName !== "SCRIPT") {
          let triggerWidth = Number(window.getComputedStyle(node).width.split("px")[0]);
          let triggerHeight = node.getBoundingClientRect().height;
          if (triggerWidth !== 0 || triggerHeight !== 0) {
            return node;
          } else {
            return matchDom(node);
          }
        }
      }
    };
    const evtList = {
      click: changeDisplay.bind(this, true),
      mouseenter: changeDisplay.bind(this, true),
      mouseleave: changeDisplay.bind(this, false),
      manual: changeDisplay.bind(this, "manual")
    };
    const addEvent = (trigger) => {
      if (ctx.slots.trigger) {
        const triggerElm = trigger || props.triggerElm;
        if (triggerElm) {
          triggerDom = isString(triggerElm) ? document.getElementById(triggerElm) : triggerElm;
          computeDom = matchDom(internalInstance.refs.bePopoverTrigger) || triggerDom || internalInstance.refs.bePopoverTrigger;
        } else {
          triggerDom = matchDom(internalInstance.refs.bePopoverTrigger) || internalInstance.refs.bePopoverTrigger;
          computeDom = triggerDom || internalInstance.refs.bePopoverTrigger;
        }
        if (triggerDom && props.trigger === "click") {
          triggerDom.addEventListener("click", evtList["click"], false);
        }
        if (triggerDom && props.trigger === "hover") {
          triggerDom.addEventListener("mouseenter", evtList["mouseenter"], false);
          triggerDom.addEventListener("mouseleave", evtList["mouseleave"], false);
        }
        if (triggerDom && props.trigger === "manual") {
          triggerDom.addEventListener("click", evtList["manual"], false);
        }
      } else {
        console.error("Please set the trigger element");
      }
    };
    const isDisabled = computed(() => {
      return props.disabled;
    });
    watch(isDisabled, (nVal) => {
      if (nVal) {
        removeEvt();
      } else {
        addEvent();
      }
    });
    const removeEvt = () => {
      if (triggerDom) {
        triggerDom.removeEventListener("click", evtList["click"], false);
        triggerDom.removeEventListener("mouseenter", evtList["mouseenter"], false);
        triggerDom.removeEventListener("mouseleave", evtList["mouseleave"], false);
        triggerDom.removeEventListener("mouseleave", evtList["manual"], false);
      }
    };
    let outsideDisabled = ref(false);
    onMounted(() => {
      if (props.trigger === "hover" || props.trigger === "manual") {
        outsideDisabled.value = true;
      }
      if (props.disabled) {
        return;
      }
      if (props.width) {
        stylePopover.width = props.width + "px";
      }
      nextTick(() => {
        addEvent();
      });
    });
    onBeforeUnmount(() => {
      removeEvt();
      if (popperJS.value && popperJS.value.destroy) {
        popperJS.value.destroy();
      }
      observer.disconnect();
    });
    const isEnterPopover = ref(false);
    const handlePopoverDomEnter = () => {
      if (props.trigger === "hover") {
        isEnterPopover.value = true;
      }
    };
    const handlePopoverDomLeave = () => {
      if (props.trigger === "hover") {
        isEnterPopover.value = false;
        changeDisplay(false);
      }
    };
    return {
      handlePopoverDomLeave,
      handlePopoverDomEnter,
      uid: internalInstance.uid,
      addEvent,
      stylePopover,
      outsideDisabled,
      show,
      close: close2,
      changeDisplay,
      computePosition
    };
  }
});
const _hoisted_1$a = ["id"];
const _hoisted_2$4 = ["id"];
const _hoisted_3$3 = ["id"];
const _hoisted_4$3 = ["id"];
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", {
      id: `be_popover_trigger${_ctx.uid}`,
      ref: "bePopoverTrigger",
      "aria-describedby": "tooltip",
      class: "be-popover--trigger"
    }, [
      renderSlot(_ctx.$slots, "trigger")
    ], 8, _hoisted_1$a),
    (openBlock(), createBlock(Teleport, { to: "body" }, [
      createElementVNode("div", {
        class: normalizeClass(_ctx.customClass),
        onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.handlePopoverDomEnter && _ctx.handlePopoverDomEnter(...args)),
        onMouseleave: _cache[1] || (_cache[1] = (...args) => _ctx.handlePopoverDomLeave && _ctx.handlePopoverDomLeave(...args))
      }, [
        createVNode(Transition, { name: "be-fade-in-linear" }, {
          default: withCtx(() => [
            _ctx.show ? withDirectives((openBlock(), createElementBlock("div", {
              id: `be_popover_${_ctx.uid}`,
              key: `be_popover_${_ctx.uid}`,
              class: "be-popover",
              role: "tooltip",
              style: normalizeStyle(_ctx.stylePopover)
            }, [
              createElementVNode("div", {
                id: `be_popover_body${_ctx.uid}`,
                class: "be-popover--body"
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 8, _hoisted_3$3),
              _ctx.raw ? (openBlock(), createElementBlock("div", {
                key: 0,
                id: `be_popover_arrow${_ctx.uid}`,
                class: normalizeClass(`be-popover--arrow`)
              }, null, 8, _hoisted_4$3)) : createCommentVNode("", true)
            ], 12, _hoisted_2$4)), [
              [_directive_click_outside, { handler: _ctx.close, isDisabled: _ctx.outsideDisabled }]
            ]) : createCommentVNode("", true)
          ]),
          _: 3
        })
      ], 34)
    ]))
  ], 64);
}
var BePopover$1 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i]]);
const _sfc_main$h = defineComponent({
  name: "BeTooltip",
  components: {
    "be-popover": BePopover$1
  },
  props: {
    placement: {
      type: String,
      default: "top"
    },
    raw: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ""
    },
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    width: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 100
    },
    duration: {
      type: Number,
      default: 100
    },
    trigger: {
      type: String,
      default: "hover"
    },
    content: {
      type: String,
      default: ""
    }
  }
});
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_popover = resolveComponent("be-popover");
  return openBlock(), createBlock(_component_be_popover, {
    placement: _ctx.placement,
    raw: _ctx.raw,
    "custom-class": _ctx.customClass,
    disabled: _ctx.disabled,
    delay: _ctx.delay,
    duration: _ctx.duration,
    x: _ctx.x,
    y: _ctx.y,
    width: _ctx.width,
    trigger: _ctx.trigger
  }, {
    trigger: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    default: withCtx(() => [
      createElementVNode("span", null, toDisplayString(_ctx.content), 1)
    ]),
    _: 3
  }, 8, ["placement", "raw", "custom-class", "disabled", "delay", "duration", "x", "y", "width", "trigger"]);
}
var beTooltip = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h]]);
const _sfc_main$g = defineComponent({
  name: "BeEllipsis",
  components: {
    "be-tooltip": beTooltip
  },
  props: {
    content: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    expandTrigger: {
      type: Boolean,
      default: false
    },
    lineClamp: {
      type: Number,
      default: null
    },
    elpNum: {
      type: Number,
      default: 5
    },
    placement: {
      type: String,
      default: "left"
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const state = reactive({
      isExpand: false,
      textCache: "",
      textInner: props.text
    });
    const handleText = () => {
      if (props.elpNum === 0)
        return;
      if (props.placement === "left") {
        state.textInner = props.text.slice(0, props.text.length - props.elpNum) + "...";
      }
      if (props.placement === "center") {
        let elpNumCenter = props.elpNum / 2;
        let lenCenter = props.text.length / 2;
        let subStrHead = props.text.substr(0, lenCenter - elpNumCenter);
        let subStrFoot = props.text.substr(lenCenter + elpNumCenter, props.text.length);
        state.textInner = subStrHead + "..." + subStrFoot;
      }
      if (props.placement === "right") {
        state.textInner = "..." + props.text.substring(props.elpNum, props.text.length);
      }
    };
    watchEffect(() => {
      state.textCache = props.text;
      handleText();
    });
    const styleStr = ref(``);
    styleStr.value = !props.lineClamp ? "" : `
      -webkit-line-clamp:${props.lineClamp};
      display:-webkit-inline-box;
      -webkit-box-orient:vertical;
      overflow:hidden;`;
    const expandTriggerFunc = () => {
      if (!props.expandTrigger)
        return;
      state.isExpand = !state.isExpand;
      styleStr.value = state.isExpand ? "" : `
      -webkit-line-clamp:${props.lineClamp};
      display:-webkit-inline-box;
      -webkit-box-orient:vertical;
      overflow:hidden;`;
      state.isExpand && (state.textInner = state.textCache);
      !state.isExpand && handleText();
    };
    return {
      state,
      styleStr,
      handleText,
      expandTriggerFunc,
      attrs: internalInstance.attrs
    };
  }
});
const _hoisted_1$9 = ["innerHTML"];
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_tooltip = resolveComponent("be-tooltip");
  return openBlock(), createBlock(_component_be_tooltip, {
    content: _ctx.content,
    placement: "top"
  }, {
    default: withCtx(() => [
      createElementVNode("span", mergeProps(_ctx.attrs, {
        style: _ctx.styleStr,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.expandTriggerFunc && _ctx.expandTriggerFunc(...args)),
        innerHTML: _ctx.state.textInner
      }), null, 16, _hoisted_1$9)
    ]),
    _: 1
  }, 8, ["content"]);
}
var beEllipsis = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g]]);
beEllipsis.install = (app) => {
  app.component(beEllipsis.name, beEllipsis);
};
const BeEllipsis = beEllipsis;
var beIcon_vue_vue_type_style_index_0_lang = "";
const _sfc_main$f = defineComponent({
  name: "BeIcon",
  props: {
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    color: {
      type: String,
      default: ""
    },
    icon: {
      type: String
    },
    customClass: {
      type: String,
      default: ""
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const iconName = computed(() => `${props.icon}`);
    const spinClass = computed(() => props.spin ? "be-icon-spin " + props.customClass : "" + props.customClass);
    return {
      props,
      iconName,
      spinClass
    };
  }
});
const _hoisted_1$8 = ["width", "height"];
const _hoisted_2$3 = ["xlink:href", "fill"];
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["be-icon-container", _ctx.spinClass]
  }, toHandlers(_ctx.$attrs)), [
    (openBlock(), createElementBlock("svg", {
      class: "be-icon",
      width: _ctx.width,
      height: _ctx.height,
      "aria-hidden": "true"
    }, [
      createElementVNode("use", {
        "xlink:href": `#${_ctx.iconName}`,
        fill: _ctx.color
      }, null, 8, _hoisted_2$3)
    ], 8, _hoisted_1$8))
  ], 16);
}
var BeIcon$1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f]]);
const createCustom = (template) => {
  return {
    name: "BeCustomIcon",
    props: {
      spin: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const attrs = useAttrs();
      const customClass = props.customClass ? props.customClass : "";
      const spinClass = computed(() => props.spin ? "be-icon-spin " + customClass : "" + customClass);
      return () => {
        return createVNode("div", mergeProps({
          "class": `be-icon-container ${spinClass.value}`
        }, attrs), [template]);
      };
    }
  };
};
var svgDict = {
  accountBook: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="accountBook"  t="1623251462819" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9999"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M810.666667 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128v-128H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333H128V384H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333H128V192a128 128 0 0 1 128-128h554.666667z m0 64H256a64 64 0 0 0-63.893333 60.245333L192 192v640a64 64 0 0 0 60.245333 63.893333L256 896h554.666667a64 64 0 0 0 63.893333-60.245333L874.666667 832V192a64 64 0 0 0-60.245334-63.893333L810.666667 128z m-155.029334 132.202667l33.173334 33.194666a8.533333 8.533333 0 0 1 0 12.053334L588.906667 405.333333H716.8c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H576v64h140.8c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H576v140.8a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V597.333333h-140.8a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334H512v-64h-140.8a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h127.872l-99.882667-99.882666a8.533333 8.533333 0 0 1 0-12.053334l33.173334-33.194666a8.533333 8.533333 0 0 1 12.074666 0l99.562667 99.562666 99.562667-99.562666a8.533333 8.533333 0 0 1 12.074666 0z"          p-id="10000"></path></symbol>',
  addCircle: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="addCircle"  t="1623251308022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2718"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m34.133333 213.333333c4.693333 0 8.533333 3.84 8.533334 8.533333V469.333333h140.8c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H554.666667v140.8a8.533333 8.533333 0 0 1-8.533334 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533334V533.333333h-140.8a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334H490.666667v-140.8c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333z"          p-id="2719"></path></symbol>',
  add: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="add"  t="1623251395878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6976"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M524.8 64c4.693333 0 8.533333 3.84 8.533333 8.533333V490.666667h418.133334c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H533.333333v418.133333a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333V554.666667H51.2a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H469.333333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333h46.933333z"          p-id="6977"></path></symbol>',
  addressBook: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="addressBook"  t="1623251450397" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9171"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M518.72 85.333333a203.050667 203.050667 0 0 1 203.050667 203.050667v96.469333c0 56.298667-22.613333 110.229333-62.805334 149.674667l-42.794666 42.026667a3.562667 3.562667 0 0 0-1.066667 2.538666v6.016c0 0.405333 0.234667 0.768 0.597333 0.938667l295.808 139.413333a103.104 103.104 0 0 1 59.157334 93.269334v10.752A87.850667 87.850667 0 0 1 882.816 917.333333H141.184c-46.442667 0-84.8-36.16-87.722667-83.328l-0.128-4.522666v-10.752c0-37.717333 20.586667-72.362667 54.421334-90.88l4.736-2.389334 296.192-139.562666c0.085333 0.042667 0.128 0.256 0.085333 0.746666l0.128-1.536v-6.016c0-0.853333-0.298667-1.642667 0.213333-1.066666l-1.28-1.493334-42.794666-42.005333a210.112 210.112 0 0 1-62.698667-142.613333l-0.106667-7.061334v-96.469333c0-109.781333 87.253333-199.594667 197.226667-202.965333L505.28 85.333333z m0 64h-12.949333l-4.842667 0.064a139.050667 139.050667 0 0 0-134.698667 138.986667v95.872l0.085334 5.909333a145.770667 145.770667 0 0 0 43.562666 98.709334l43.904 43.157333 3.456 3.84c10.112 12.117333 15.658667 27.392 15.658667 43.221333l-0.042667 7.552-0.256 4.693334a65.024 65.024 0 0 1-37.013333 52.608L140.650667 782.912l-2.986667 1.514667a39.104 39.104 0 0 0-20.330667 34.304v9.749333l0.042667 2.538667A23.850667 23.850667 0 0 0 141.184 853.333333h741.632c13.162667 0 23.850667-10.666667 23.850667-23.850666v-10.752c0-15.146667-8.746667-28.928-22.442667-35.392l-295.808-139.392a65.024 65.024 0 0 1-37.312-58.837334v-6.016c0-18.133333 7.296-35.498667 20.224-48.213333l42.794667-42.026667a145.770667 145.770667 0 0 0 43.648-104v-96.469333c0-76.8-62.250667-139.050667-139.050667-139.050667zM951.466667 533.333333c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333h-89.6a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334h89.6z m0-128c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333h-153.6a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334h153.6z m0-128c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333h-153.6a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334h153.6z"          p-id="9172"></path></symbol>',
  address: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="address"  t="1623251503681" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="12202" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M455.338667 117.333333a193.557333 193.557333 0 0 1 193.557333 193.557334v90.752a200.042667 200.042667 0 0 1-60.330667 143.146666l-39.936 38.997334a3.562667 3.562667 0 0 0-1.066666 2.538666l-0.021334 4.224 278.421334 130.453334a103.104 103.104 0 0 1 59.264 88.597333l0.106666 4.778667v7.530666a84.757333 84.757333 0 0 1-84.757333 84.757334H95.424a84.757333 84.757333 0 0 1-84.586667-79.210667l-0.106666-2.517333L10.666667 820.693333l0.021333-6.336c0-37.76 20.629333-72.490667 53.76-90.538666l1.984-1.024 4.48-2.24 277.525333-130.005334 0.021334-4.245333a3.562667 3.562667 0 0 0-0.362667-1.6l-0.277333-0.384-0.704-0.789333-39.68-38.762667a200.490667 200.490667 0 0 1-59.797334-129.642667l-0.384-7.125333-0.128-6.997333v-90.133334c0-104.490667 82.986667-190.144 188.373334-193.493333l5.696-0.064z m0 64h-14.165334l-4.714666 0.064a129.557333 129.557333 0 0 0-125.354667 129.493334v90.133333l0.106667 5.845333a136.042667 136.042667 0 0 0 40.917333 92.117334l41.066667 40.149333 3.498666 3.84c10.154667 12.138667 15.744 27.477333 15.744 43.349333l-0.021333 6.336-0.256 4.522667a63.125333 63.125333 0 0 1-36.053333 51.093333L98.048 778.538667l-2.986667 1.493333c-12.544 6.826667-20.394667 20.010667-20.394666 34.346667v6.506666l0.042666 2.432a20.757333 20.757333 0 0 0 20.693334 19.349334h705.173333a20.757333 20.757333 0 0 0 20.757333-20.757334v-7.530666c0-15.168-8.768-28.992-22.528-35.413334L519.893333 648.277333a63.104 63.104 0 0 1-36.330666-57.152v-4.8c0-18.197333 7.338667-35.626667 20.352-48.341333l39.957333-38.997333a136.042667 136.042667 0 0 0 41.024-97.344v-90.752A129.557333 129.557333 0 0 0 455.338667 181.333333z m222.741333 0.149334a155.541333 155.541333 0 0 1 148.501333 150.186666l0.085334 5.205334V405.333333a159.786667 159.786667 0 0 1-45.546667 111.744l-4.48 4.394667-27.008 25.536 208.192 94.485333a94.613333 94.613333 0 0 1 55.061333 76.949334l0.341334 4.565333 0.106666 4.629333a72.341333 72.341333 0 0 1-64.746666 71.957334c-5.546667-29.077333-11.861333-50.282667-18.922667-63.637334l11.328 0.021334a8.32 8.32 0 0 0 8.341333-8.32c0-11.029333-5.909333-21.12-15.317333-26.517334l-2.645333-1.365333-62.933334-28.586667a167.125333 167.125333 0 0 0-15.317333-8.170666l-153.450667-71.893334A55.466667 55.466667 0 0 1 682.666667 551.168c0-16.917333 6.4-33.130667 17.770666-45.504l3.242667-3.264 29.013333-27.413333a95.786667 95.786667 0 0 0 29.824-64.362667L762.666667 405.333333v-68.48a91.562667 91.562667 0 0 0-56.469334-84.586666c-3.626667-15.616-13.013333-39.232-28.117333-70.805334z"          p-id="12203"></path></symbol>',
  anger: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="anger"  t="1623251369381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5202"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m0 448a425.066667 425.066667 0 0 1 187.242667 43.2 8.533333 8.533333 0 0 1 4.778666 7.68V666.048a4.266667 4.266667 0 0 1-6.464 3.669333c-4.629333-2.773333-8.341333-4.906667-11.136-6.464A361.045333 361.045333 0 0 0 512 618.666667a361.024 361.024 0 0 0-185.557333 51.029333 4.266667 4.266667 0 0 1-6.464-3.648v-60.544a8.533333 8.533333 0 0 1 4.8-7.658667A425.045333 425.045333 0 0 1 512 554.666667z m-149.333333-170.666667a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m298.666666 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"          p-id="5203"></path></symbol>',
  bankCard: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="bankCard"  t="1623251491705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="11513" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M832 128a128 128 0 0 1 128 128v512a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h640z m64 256H128v384a64 64 0 0 0 60.245333 63.893333L192 832h640a64 64 0 0 0 63.893333-60.245333L896 768V384zM354.133333 682.666667c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334h-132.266666a8.533333 8.533333 0 0 1-8.533334-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533333h132.266666zM832 192H192a64 64 0 0 0-63.893333 60.245333L128 256v64h768v-64a64 64 0 0 0-60.245333-63.893333L832 192z"          p-id="11514"></path></symbol>',
  barChart: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="barChart"  t="1623251494494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="11649" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M874.666667 277.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v448a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334a85.333333 85.333333 0 0 1-85.333333-85.333333V362.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334zM554.666667 128a85.333333 85.333333 0 0 1 85.333333 85.333333v597.333334a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334zM234.666667 490.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v234.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H149.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V576a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334z m640-149.333334h-85.333334a21.333333 21.333333 0 0 0-21.184 18.837334L768 362.666667v448a21.333333 21.333333 0 0 0 18.837333 21.184L789.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L896 810.666667V362.666667a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 341.333333zM554.666667 192h-85.333334a21.333333 21.333333 0 0 0-21.184 18.837333L448 213.333333v597.333334a21.333333 21.333333 0 0 0 18.837333 21.184L469.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L576 810.666667V213.333333a21.333333 21.333333 0 0 0-18.837333-21.184L554.666667 192zM234.666667 554.666667H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 576v234.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L256 810.666667V576a21.333333 21.333333 0 0 0-18.837333-21.184L234.666667 554.666667z"          p-id="11650"></path></symbol>',
  calculator: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="calculator"  t="1623251428297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8069"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 64a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h554.666666zM469.333333 533.333333H128v256a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h234.666666V533.333333zM789.333333 128H533.333333v768h256a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V234.666667a106.666667 106.666667 0 0 0-102.037333-106.56L789.333333 128zM396.8 682.666667c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334h-174.933333a8.533333 8.533333 0 0 1-8.533334-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533333h174.933333z m405.333333-149.333334c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333h-174.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h174.933333z m0-106.666666c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334h-174.933333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h174.933333zM469.333333 128H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v234.666666h341.333333V128z m-136.533333 85.333333c4.693333 0 8.533333 3.84 8.533333 8.533334V277.333333h55.466667c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H341.333333v55.466667a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333V341.333333h-55.466666a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334H277.333333v-55.466666c0-4.693333 3.84-8.533333 8.533334-8.533334h46.933333z"          p-id="8070"></path></symbol>',
  calendar: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="calendar"  t="1623251443896" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8760"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M375.466667 64c4.693333 0 8.533333 3.84 8.533333 8.533333V128h256V72.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533333V128h106.666667a128 128 0 0 1 128 128v554.666667a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h106.666667V72.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933334zM874.666667 405.333333H149.333333v405.333334a64 64 0 0 0 60.245334 63.893333L213.333333 874.666667h597.333334a64 64 0 0 0 63.893333-60.245334L874.666667 810.666667V405.333333zM810.666667 192H213.333333a64 64 0 0 0-63.893333 60.245333L149.333333 256v85.333333h725.333334v-85.333333a64 64 0 0 0-60.245334-63.893333L810.666667 192z"          p-id="8761"></path></symbol>',
  card: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="card"  t="1623251414062" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7795"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M832 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h640zM501.333333 704a160.064 160.064 0 0 1-150.890666-106.666667H128v234.666667a64 64 0 0 0 60.245333 63.893333L192 896h640a64 64 0 0 0 63.893333-60.245333L896 832V597.333333H652.224a160.064 160.064 0 0 1-150.890667 106.666667z m-95.424-170.666667a96 96 0 1 0 190.826667 0H896v-170.666666H128v170.666666h277.909333zM832 128H192a64 64 0 0 0-63.893333 60.245333L128 192v106.666667h768V192a64 64 0 0 0-60.245333-63.893333L832 128z"          p-id="7796"></path></symbol>',
  chatAdd: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="chatAdd"  t="1623251454691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9447"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m34.133333 213.333333c4.693333 0 8.533333 3.84 8.533334 8.533334V469.333333h119.466666c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H554.666667v119.466667a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V533.333333h-119.466667a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334H490.666667v-119.466666c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333z"          p-id="9448"></path></symbol>',
  chatRight: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="chatRight"  t="1623251465170" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10137" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m218.602667 256a8.533333 8.533333 0 0 1 6.037333 14.570667L495.616 639.573333c-5.461333 5.461333-12.416 8.533333-19.562667 9.216l-3.050666 0.149334c-8.192 0-16.384-3.114667-22.634667-9.365334l-134.336-134.357333a8.533333 8.533333 0 0 1 6.037333-14.570667h66.346667a8.533333 8.533333 0 0 1 6.037333 2.496l78.528 78.528 185.216-185.173333a8.533333 8.533333 0 0 1 6.037334-2.517333h66.368z"          p-id="10138"></path></symbol>',
  chatWrong: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="chatWrong"  t="1623251474522" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10688" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m-100.309333 234.666667a8.533333 8.533333 0 0 1 6.037333 2.496l93.909333 93.909333 93.866667-93.909333a8.533333 8.533333 0 0 1 6.058667-2.496h66.389333a8.533333 8.533333 0 0 1 6.037333 14.570666l-127.104 127.082667 121.109334 121.109333a8.533333 8.533333 0 0 1-6.037334 14.570667h-66.346666a8.533333 8.533333 0 0 1-6.037334-2.496l-87.936-87.936-87.957333 87.936a8.533333 8.533333 0 0 1-6.037333 2.496h-66.346667a8.533333 8.533333 0 0 1-6.016-14.570667l121.109333-121.109333-127.104-127.082667a8.533333 8.533333 0 0 1 6.037334-14.570666h66.368z"          p-id="10689"></path></symbol>',
  chat: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="chat"  t="1623251496673" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="11787" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m-157.696 341.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m159.018667 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m158.997333 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z"          p-id="11788"></path></symbol>',
  classification: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="classification"  t="1623251511091" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="12752" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M160 682.666667a96 96 0 1 1 0 192 96 96 0 0 1 0-192z m0 64a32 32 0 1 0 0 64 32 32 0 0 0 0-64z m791.466667 0c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H328.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h622.933334zM160 405.333333a96 96 0 1 1 0 192 96 96 0 0 1 0-192z m0 64a32 32 0 1 0 0 64 32 32 0 0 0 0-64z m791.466667 0c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H328.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h622.933334zM160 128a96 96 0 1 1 0 192 96 96 0 0 1 0-192z m0 64a32 32 0 1 0 0 64 32 32 0 0 0 0-64z m791.466667 0c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533333 8.533333H328.533333a8.533333 8.533333 0 0 1-8.533333-8.533333V200.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h622.933334z"          p-id="12753"></path></symbol>',
  closeVolume: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="closeVolume"  t="1623251536264" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="14128" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M150.933333 170.666667a8.533333 8.533333 0 0 1 6.037334 2.496l708.266666 708.266666a8.533333 8.533333 0 0 1-6.037333 14.549334h-66.346667a8.533333 8.533333 0 0 1-6.037333-2.496l-189.504-189.504 0.021333 93.610666a85.333333 85.333333 0 0 1-129.237333 73.173334l-171.242667-102.784L192 768a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 50.218666-77.802666l-78.314666-78.293334A8.533333 8.533333 0 0 1 84.608 170.666667h66.346667zM213.333333 320H192a21.333333 21.333333 0 0 0-21.184 18.837333L170.666667 341.333333v341.333334a21.333333 21.333333 0 0 0 18.837333 21.184L192 704h122.581333l186.453334 111.872a21.333333 21.333333 0 0 0 32.149333-15.786667l0.149333-2.496-0.021333-157.610666-320-320z m614.698667-108.906667l0.042667 0.085334a722.773333 722.773333 0 0 1 69.653333 310.442666 723.626667 723.626667 0 0 1-47.701333 259.242667l-50.069334-50.069333a660.650667 660.650667 0 0 0 33.770667-209.173334 658.986667 658.986667 0 0 0-63.296-282.602666 8.533333 8.533333 0 0 1 3.968-11.306667l14.293333-6.976 16.213334-7.872 11.712-5.717333a8.533333 8.533333 0 0 1 11.413333 3.946666z m-115.114667 56.042667l0.042667 0.085333a595.221333 595.221333 0 0 1 56.746667 254.4c0 54.634667-7.317333 107.562667-21.056 157.845334L695.466667 626.261333a535.893333 535.893333 0 0 0 10.24-104.64 531.541333 531.541333 0 0 0-50.432-226.581333 8.533333 8.533333 0 0 1 3.989333-11.306667c3.072-1.493333 5.546667-2.709333 7.509333-3.626666l27.349334-13.333334 7.381333-3.584a8.533333 8.533333 0 0 1 11.413333 3.946667zM585.173333 180.437333a85.333333 85.333333 0 0 1 12.16 43.904l-0.021333 303.786667-64-63.957333L533.333333 224.341333a21.333333 21.333333 0 0 0-1.706666-8.405333l-1.344-2.56a21.333333 21.333333 0 0 0-27.050667-8.490667l-2.218667 1.173334-141.141333 84.650666-46.656-46.634666 154.88-92.906667a85.333333 85.333333 0 0 1 117.077333 29.269333z"          p-id="14129"></path></symbol>',
  coin: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="coin"  t="1623251331052" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3408"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z m0 64C299.925333 128 128 299.925333 128 512s171.925333 384 384 384 384-171.925333 384-384S724.074667 128 512 128z m104.32 165.717333l33.173333 33.194667a8.533333 8.533333 0 0 1 0 12.053333L561.770667 426.666667H674.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334H554.666667v42.666666h119.466666c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H554.666667v119.466667a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V597.333333h-119.466667a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334H490.666667v-42.666666h-119.466667a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h106.538667l-87.701334-87.68a8.533333 8.533333 0 0 1 0-12.074667l33.173334-33.194667a8.533333 8.533333 0 0 1 12.074666 0l84.48 84.48 84.48-84.48a8.533333 8.533333 0 0 1 12.053334 0z"          p-id="3409"></path></symbol>',
  collect: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="collect"  t="1623251426021" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7931"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 64a128 128 0 0 1 128 128v607.488l32.64-7.744 1.493334-0.149333a8.533333 8.533333 0 0 1 8.362666 6.826666l0.170667 1.706667v46.464a8.533333 8.533333 0 0 1-4.992 7.765333l-1.557333 0.533334-439.466667 104.64a8.533333 8.533333 0 0 1-3.968 0l-439.466667-104.64A8.533333 8.533333 0 0 1 64 846.592v-46.464a8.533333 8.533333 0 0 1 10.517333-8.298667L106.666667 799.488V192a128 128 0 0 1 128-128h554.666666z m0 64H234.666667a64 64 0 0 0-63.893334 60.245333L170.666667 192v622.72l339.349333 80.810667a8.533333 8.533333 0 0 0 3.968 0L853.333333 814.72V192a64 64 0 0 0-60.245333-63.893333L789.333333 128z m-157.930666 131.456l33.173333 33.173333a8.533333 8.533333 0 0 1 0 12.074667L561.792 407.466667H695.466667c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H554.666667v42.666666h140.8c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H554.666667v162.133334a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-162.133334h-140.8a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334H490.666667v-42.666666h-140.8a8.533333 8.533333 0 0 1-8.533334-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533333h127.829333l-102.741333-102.762667a8.533333 8.533333 0 0 1 0-12.074667l33.173333-33.173333a8.533333 8.533333 0 0 1 12.074667 0l99.562666 99.541333 99.562667-99.541333a8.533333 8.533333 0 0 1 12.074667 0z"          p-id="7932"></path></symbol>',
  collection: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="collection"  t="1623251476401" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10826" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M530.88 79.488a42.666667 42.666667 0 0 1 19.370667 19.370667l118.485333 240.064 264.96 38.506666a42.666667 42.666667 0 0 1 23.637333 72.768l-191.722666 186.88L810.88 900.906667a42.666667 42.666667 0 0 1-61.909333 44.992L512 821.333333l-236.970667 124.586667A42.666667 42.666667 0 0 1 213.12 900.906667l45.269333-263.850667-191.722666-186.88a42.666667 42.666667 0 0 1 23.658666-72.768l264.938667-38.506667 118.485333-240.064a42.666667 42.666667 0 0 1 57.130667-19.370666z m95.36 317.930667L512 165.909333l-114.24 231.509334L142.293333 434.56l184.853334 180.181333-43.648 254.421334L512 749.034667l228.48 120.106666-43.626667-254.421333 184.832-180.181333-255.445333-37.12z"          p-id="10827"></path></symbol>',
  compass: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="compass"  t="1623251346068" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3960"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m195.029333 235.818666a42.666667 42.666667 0 0 1 0 29.162667l-75.818666 208.512a85.333333 85.333333 0 0 1-51.050667 51.050667l-208.512 75.818666a42.666667 42.666667 0 0 1-54.677333-54.677333l75.818666-208.512a85.333333 85.333333 0 0 1 51.050667-51.050667l208.512-75.818666a42.666667 42.666667 0 0 1 54.677333 25.514666zM631.253333 392.746667l-165.546666 60.202666a21.333333 21.333333 0 0 0-11.690667 10.282667l-1.066667 2.474667-60.202666 165.546666 165.546666-60.202666a21.333333 21.333333 0 0 0 11.690667-10.282667l1.066667-2.474667 60.202666-165.546666z"          p-id="3961"></path></symbol>',
  content: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="content"  t="1623251499745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="11925" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M426.666667 128c38.229333 0 72.533333 16.768 96 43.328a127.701333 127.701333 0 0 1 90.005333-43.2L618.666667 128h234.666666a128 128 0 0 1 127.914667 123.2L981.333333 256v512a128 128 0 0 1-123.2 127.914667L853.333333 896H613.162667a117.098667 117.098667 0 0 1-90.496 42.666667 117.098667 117.098667 0 0 1-90.496-42.666667H192a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h234.666667z m43.733333 704a53.333333 53.333333 0 0 0 104.533333 0H853.333333l3.754667-0.106667a64 64 0 0 0 60.138667-60.138666L917.333333 768V256l-0.106666-3.754667A64 64 0 0 0 853.333333 192H618.666667l-3.754667 0.106667a64 64 0 0 0-60.138667 60.138666L554.666667 256v460.8a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V256a64 64 0 0 0-56.533334-63.573333l-3.712-0.32L426.666667 192H192a64 64 0 0 0-63.893333 60.245333L128 256v512a64 64 0 0 0 60.245333 63.893333L192 832h278.4z"          p-id="11926"></path>    <path d="M200.533333 405.333333h217.6c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H200.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334zM200.533333 533.333333h217.6c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H200.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334zM627.2 405.333333h217.6c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H627.2a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334zM627.2 533.333333h217.6c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H627.2a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334z"          p-id="11927"></path></symbol>',
  coupon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="coupon"  t="1623251509023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="12614" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M290.986667 128a8.533333 8.533333 0 0 1 8.469333 7.466667c0.789333 6.165333 1.792 10.88 2.965333 14.186666a64.021333 64.021333 0 0 0 120.341334 0.384 71.253333 71.253333 0 0 0 3.093333-14.592A8.533333 8.533333 0 0 1 434.346667 128H832a128 128 0 0 1 128 128v512a128 128 0 0 1-128 128H434.346667a8.533333 8.533333 0 0 1-8.448-7.466667 69.76 69.76 0 0 0-2.688-13.333333 64.021333 64.021333 0 0 0-121.002667-0.256c-1.088 3.157333-2.026667 7.68-2.773333 13.589333a8.533333 8.533333 0 0 1-8.448 7.466667H192a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h98.986667z m-39.168 64H192a64 64 0 0 0-63.893333 60.245333L128 256v512a64 64 0 0 0 60.245333 63.893333L192 832h59.797333l1.109334-1.898667a127.957333 127.957333 0 0 1 104.96-62.016L362.666667 768a127.936 127.936 0 0 1 109.76 62.101333l1.088 1.898667H832a64 64 0 0 0 63.893333-60.245333L896 768V256a64 64 0 0 0-60.245333-63.893333L832 192H473.493333l-1.066666 1.898667A127.936 127.936 0 0 1 362.666667 256a127.936 127.936 0 0 1-109.76-62.101333L251.818667 192z m123.648 192c4.693333 0 8.533333 3.84 8.533333 8.533333v238.933334a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533333V392.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933334z"          p-id="12615"></path></symbol>',
  deleteIc: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="deleteIc"  t="1623251392398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6704"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M213.717333 173.162667l287.274667 287.232L788.202667 173.162667A8.533333 8.533333 0 0 1 794.24 170.666667h66.901333a8.533333 8.533333 0 0 1 6.037334 14.570666L546.496 505.898667l332.842667 332.864a8.533333 8.533333 0 0 1-6.037334 14.570666h-66.389333a8.533333 8.533333 0 0 1-6.037333-2.496L501.248 551.146667 201.514667 850.837333a8.533333 8.533333 0 0 1-6.016 2.496H128.64a8.533333 8.533333 0 0 1-6.037333-14.570666l333.12-333.12-320.426667-320.426667A8.533333 8.533333 0 0 1 141.333333 170.666667h66.346667a8.533333 8.533333 0 0 1 6.037333 2.496z"          p-id="6705"></path></symbol>',
  down2: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="down2"  t="1623251333701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3546"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m162.133333 294.592c4.693333 0 8.533333 3.818667 8.533334 8.533333v66.346667a8.533333 8.533333 0 0 1-2.496 6.037333l-153.088 153.088-2.005334 1.770667a21.248 21.248 0 0 1-11.818666 4.437333h-2.517334a21.248 21.248 0 0 1-13.824-6.186667l-153.088-153.088a8.533333 8.533333 0 0 1-2.496-6.016v-66.389333a8.533333 8.533333 0 0 1 14.570667-6.037333l156.074667 156.074666 156.117333-156.074666a8.533333 8.533333 0 0 1 6.037333-2.496z"          p-id="3547"></path></symbol>',
  downland: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="downland"  t="1623251520805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13302" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M311.466667 64c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533333 8.533333H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V234.666667a106.666667 106.666667 0 0 0-102.037333-106.56L789.333333 128h-55.466666a8.533333 8.533333 0 0 1-8.533334-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333H789.333333a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h76.8z m234.666666 0c4.693333 0 8.533333 3.84 8.533334 8.533333v454.976l156.096-156.096a8.533333 8.533333 0 0 1 14.570666 6.037334v66.389333a8.533333 8.533333 0 0 1-2.496 6.016l-185.386666 185.408a21.226667 21.226667 0 0 1-11.328 5.909333l-2.517334 0.298667h-2.517333a21.248 21.248 0 0 1-13.824-6.186667l-184.746667-184.810666a8.533333 8.533333 0 0 1-2.517333-6.016v-66.368a8.533333 8.533333 0 0 1 14.570667-6.037334L490.666667 528.149333V72.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333z"          p-id="13303"></path></symbol>',
  edit: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="edit"  t="1623251434415" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8345"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M816.277333 165.056a128 128 0 0 1 0 181.013333L309.653333 852.693333a21.333333 21.333333 0 0 1-15.082666 6.229334H165.056a42.666667 42.666667 0 0 1-42.666667-42.666667v-129.493333a21.333333 21.333333 0 0 1 6.229334-15.104L635.306667 165.056a128 128 0 0 1 180.992 0z m-45.226666 45.226667a64 64 0 0 0-87.786667-2.56l-2.752 2.56L188.885333 701.930667a8.533333 8.533333 0 0 0-2.496 6.037333v78.464c0 4.714667 3.818667 8.533333 8.533334 8.533333h78.421333a8.533333 8.533333 0 0 0 6.037333-2.517333l491.648-491.605333a64 64 0 0 0 2.581334-87.786667l-2.56-2.730667z"          p-id="8346"></path>    <path d="M590.016 210.304l181.013333 181.013333-45.248 45.248-181.013333-181.013333z" p-id="8347"></path>    <path d="M490.666667 795.733333m8.533333 0l345.6 0q8.533333 0 8.533333 8.533334l0 46.933333q0 8.533333-8.533333 8.533333l-345.6 0q-8.533333 0-8.533333-8.533333l0-46.933333q0-8.533333 8.533333-8.533334Z"          p-id="8348"></path>    <path d="M661.333333 667.733333m8.533334 0l174.933333 0q8.533333 0 8.533333 8.533334l0 46.933333q0 8.533333-8.533333 8.533333l-174.933333 0q-8.533333 0-8.533334-8.533333l0-46.933333q0-8.533333 8.533334-8.533334Z"          p-id="8349"></path></symbol>',
  error: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="error"  t="1623251317710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2994"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m-104.746667 256a8.533333 8.533333 0 0 1 6.037334 2.496L512 463.850667l98.688-98.688a8.533333 8.533333 0 0 1 6.037333-2.496h66.346667a8.533333 8.533333 0 0 1 6.037333 14.570666l-131.84 131.861334 137.642667 137.664a8.533333 8.533333 0 0 1-6.037333 14.570666h-66.346667a8.533333 8.533333 0 0 1-6.037333-2.496L512 554.346667l-104.512 104.490666a8.533333 8.533333 0 0 1-6.037333 2.496h-66.346667a8.533333 8.533333 0 0 1-6.016-14.570666l137.664-137.664-131.861333-131.861334A8.533333 8.533333 0 0 1 340.906667 362.666667h66.346666z"          p-id="2995"></path></symbol>',
  express: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="express"  t="1623251448368" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9035"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M533.333333 128a85.333333 85.333333 0 0 1 85.333334 85.333333v21.312L839.317333 234.666667a85.333333 85.333333 0 0 1 56.832 21.674666l3.52 3.328 77.994667 77.994667a85.333333 85.333333 0 0 1 24.874667 55.509333l0.128 4.842667V725.333333a85.333333 85.333333 0 0 1-81.066667 85.226667L917.333333 810.666667h-25.749333a117.376 117.376 0 0 1-225.834667 0L618.666667 810.666667V810.666667l-196.416 0.021333a117.376 117.376 0 0 1-225.834667 0L106.666667 810.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V213.333333a85.333333 85.333333 0 0 1 85.333334-85.333333h426.666666zM309.333333 725.333333a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667z m469.333334 0a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667zM533.333333 192H106.666667a21.333333 21.333333 0 0 0-21.184 18.837333L85.333333 213.333333v512a21.333333 21.333333 0 0 0 18.837334 21.184L106.666667 746.666667h89.749333a117.376 117.376 0 0 1 225.834667 0H554.666667V213.333333a21.333333 21.333333 0 0 0-16.426667-20.778666l-2.410667-0.426667L533.333333 192z m305.984 106.666667H618.666667v448h47.082666a117.376 117.376 0 0 1 225.834667 0H917.333333l2.496-0.149334a21.333333 21.333333 0 0 0 18.688-18.688L938.666667 725.333333V398.016l-0.192-2.816a21.333333 21.333333 0 0 0-4.202667-10.154667l-1.856-2.133333-78.016-77.994667-2.112-1.856a21.333333 21.333333 0 0 0-10.154667-4.202666L839.317333 298.666667z"          p-id="9036"></path></symbol>',
  eye: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="eye"  t="1623251458455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9723"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M511.978667 149.312c85.717333 0 164.202667 32.384 224.810666 86.058667l7.616 6.848c43.413333 39.552 111.936 110.229333 205.525334 212.053333a85.333333 85.333333 0 0 1 3.136 111.893333l-3.093334 3.562667-33.770666 36.586667c-82.133333 88.533333-142.229333 149.546667-180.352 183.061333-60.48 53.205333-138.581333 85.269333-223.872 85.269333-85.802667 0-164.352-32.448-224.981334-86.229333l-7.594666-6.826667c-43.370667-39.552-111.808-110.165333-205.333334-211.84a85.333333 85.333333 0 0 1-3.093333-111.978666l3.114667-3.562667 41.706666-45.098667c77.610667-83.328 134.677333-141.162667 171.157334-173.546666C347.584 181.76 426.154667 149.312 512 149.312z m0 64c-67.712 0-131.712 25.024-182.549334 70.122667l-7.253333 6.528c-37.674667 34.389333-96.725333 94.933333-176.384 180.906666l-24.597333 26.666667a21.333333 21.333333 0 0 0 0 28.885333L153.6 561.493333c80.938667 87.168 139.818667 147.072 175.850667 179.029334 50.837333 45.077333 114.794667 70.101333 182.506666 70.101333 67.285333 0 130.901333-24.725333 181.610667-69.333333l7.296-6.506667c37.952-34.389333 97.28-95.146667 177.237333-181.546667l24.704-26.816a21.333333 21.333333 0 0 0 0-28.864l-40.234666-43.498666c-77.013333-82.730667-133.333333-139.882667-168.256-170.794667-50.816-45.013333-114.730667-69.973333-182.357334-69.973333zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384z m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z m0 42.666667a85.333333 85.333333 0 1 1-85.226667 89.6L426.666667 512h64a21.333333 21.333333 0 0 0 21.184-18.837333L512 490.666667v-64z"          p-id="9724"></path></symbol>',
  faceRecognition: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="faceRecognition"  t="1623251478210" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10964" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M64 490.666667m8.533333 0l878.933334 0q8.533333 0 8.533333 8.533333l0 46.933333q0 8.533333-8.533333 8.533334l-878.933334 0q-8.533333 0-8.533333-8.533334l0-46.933333q0-8.533333 8.533333-8.533333Z"          p-id="10965"></path>    <path d="M128 669.866667v154.133333a72 72 0 0 0 67.776 71.893333l4.224 0.106667H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H205.482667A141.482667 141.482667 0 0 1 64 818.517333V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m832 0v148.650666A141.482667 141.482667 0 0 1 818.517333 960H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533334-8.533333h154.133333a72 72 0 0 0 71.893333-67.776l0.106667-4.224V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m-597.333333-597.333334v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H200a72 72 0 0 0-71.893333 67.776L128 200V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334V205.482667A141.482667 141.482667 0 0 1 205.482667 64H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333zM818.517333 64A141.482667 141.482667 0 0 1 960 205.482667V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V200a72 72 0 0 0-67.776-71.893333L824 128H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333h148.650666zM694.058667 618.688L748.074667 618.666667a4.970667 4.970667 0 0 1 4.906666 5.781333 243.669333 243.669333 0 0 1-234.666666 207.466667L512 832a243.669333 243.669333 0 0 1-240.618667-205.226667 7.082667 7.082667 0 0 1 7.04-8.106666h1.152a543233.92 543233.92 0 0 0 48.298667 0 8.533333 8.533333 0 0 1 8.341333 6.826666l0.362667 1.706667c17.621333 79.765333 87.317333 138.176 169.045333 140.714667l5.546667 0.085333 5.504-0.064a179.669333 179.669333 0 0 0 171.52-144.405333 5.973333 5.973333 0 0 1 5.866667-4.842667zM512 192c144.426667 0 261.482667 117.077333 261.482667 261.482667 0 11.562667-0.768 23.104-2.282667 34.56L762.304 554.666667h-64.576l10.026667-75.093334a197.482667 197.482667 0 1 0-392.192-5.674666l0.682666 5.696 9.984 75.072h-64.554666l-8.874667-66.624c-19.072-143.146667 81.493333-274.666667 224.64-293.76A261.482667 261.482667 0 0 1 512 192z"          p-id="10966"></path></symbol>',
  fillIn: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="fillIn"  t="1623251501631" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="12064" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M662.058667 64a8.533333 8.533333 0 0 1 6.037333 14.570667l-46.933333 46.933333a8.533333 8.533333 0 0 1-6.058667 2.496H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V408.874667a8.533333 8.533333 0 0 1 2.496-6.037334l46.933333-46.933333a8.533333 8.533333 0 0 1 14.570667 6.037333V789.333333a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h427.392zM926.933333 94.442667a105.685333 105.685333 0 0 1 3.2 146.133333l-3.882666 4.010667-310.4 304.661333a85.333333 85.333333 0 0 1-59.754667 24.448h-71.786667a42.666667 42.666667 0 0 1-42.666666-42.666667v-71.04a85.333333 85.333333 0 0 1 25.322666-60.672l308.693334-305.28a107.264 107.264 0 0 1 151.274666 0.426667z m-172.992 111.082666L511.957333 444.8a21.333333 21.333333 0 0 0-6.144 12.330667l-0.170666 2.837333v49.706667h50.453333a21.333333 21.333333 0 0 0 12.821333-4.309334l2.112-1.813333 242.709334-238.250667-59.797334-59.797333z m69.12-68.16l-2.389333 2.176-21.226667 20.992 59.968 59.946667 22.272-21.824c16.277333-16.277333 16.277333-42.666667 0-58.944a43.264 43.264 0 0 0-58.645333-2.346667z"          p-id="12065"></path></symbol>',
  folder: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="folder"  t="1623251507248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="12478" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v152.021333c36.821333 9.493333 64 42.88 64 82.645333v405.333334a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V298.666667a85.376 85.376 0 0 1 64-82.645334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h597.333334zM128.149333 296.170667L128 298.666667v512a64 64 0 0 0 60.245333 63.893333L192 874.666667h640a64 64 0 0 0 63.893333-60.245334L896 810.666667V405.333333a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 384H638.165333l-122.069333-101.717333a21.333333 21.333333 0 0 0-10.688-4.736l-2.986667-0.213334H149.333333a21.333333 21.333333 0 0 0-21.184 18.837334zM535.189333 213.333333l127.978667 106.666667H832V170.666667a21.333333 21.333333 0 0 0-18.837333-21.184L810.666667 149.333333H213.333333a21.333333 21.333333 0 0 0-21.184 18.837334L192 170.666667v42.666666h343.168z"          p-id="12479"></path></symbol>',
  friendDelete: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="friendDelete"  t="1623251472642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10549" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M518.72 96a203.050667 203.050667 0 0 1 203.050667 203.050667v96.469333c0 56.298667-22.613333 110.229333-62.805334 149.674667l-42.794666 42.026666a3.562667 3.562667 0 0 0-1.066667 2.538667v6.016c0 0.405333 0.234667 0.768 0.597333 0.938667l33.664 15.850666a224.64 224.64 0 0 0-37.909333 52.906667l-23.04-10.88a65.024 65.024 0 0 1-37.312-58.816v-6.016c0-18.133333 7.296-35.498667 20.224-48.213333l42.794667-42.026667a145.770667 145.770667 0 0 0 43.648-104v-96.469333c0-76.8-62.250667-139.050667-139.050667-139.050667h-12.949333l-4.842667 0.064a139.050667 139.050667 0 0 0-134.698667 138.986667v95.872l0.085334 5.909333a145.770667 145.770667 0 0 0 43.562666 98.709333l43.904 43.157334 3.456 3.84c10.112 12.117333 15.658667 27.392 15.658667 43.221333l-0.042667 7.552-0.256 4.693333a65.024 65.024 0 0 1-37.013333 52.608L140.650667 793.578667l-2.986667 1.514666a39.104 39.104 0 0 0-20.330667 34.304v9.749334l0.042667 2.538666A23.850667 23.850667 0 0 0 141.184 864h467.050667a224.576 224.576 0 0 0 45.674666 64H141.184c-46.442667 0-84.8-36.16-87.722667-83.328l-0.128-4.522667v-10.752c0-37.717333 20.586667-72.362667 54.421334-90.88l4.736-2.389333 296.192-139.562667c0.085333 0.042667 0.128 0.256 0.085333 0.746667l0.128-1.536v-6.016c0-0.853333-0.298667-1.642667 0.213333-1.066667l-1.28-1.493333-42.794666-42.005333a210.112 210.112 0 0 1-62.698667-142.613334l-0.106667-7.061333v-96.469333c0-109.781333 87.253333-199.594667 197.226667-202.965334l5.824-0.085333z"          p-id="10550"></path>    <path d="M810.666667 597.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 64a106.666667 106.666667 0 1 0 0 213.333334 106.666667 106.666667 0 0 0 0-213.333334z"          p-id="10551"></path>    <path d="M780.496777 692.575277m6.033978 6.033978l93.526657 93.526656q6.033978 6.033978 0 12.067956l-33.186878 33.186878q-6.033978 6.033978-12.067956 0l-93.526657-93.526656q-6.033978-6.033978 0-12.067956l33.186878-33.186878q6.033978-6.033978 12.067956 0Z"          p-id="10552"></path>    <path d="M840.834816 692.575998m-6.033978 6.033977l-93.526657 93.526657q-6.033978 6.033978 0 12.067956l33.186878 33.186878q6.033978 6.033978 12.067956 0l93.526657-93.526657q6.033978-6.033978 0-12.067955l-33.186878-33.186879q-6.033978-6.033978-12.067956 0Z"          p-id="10553"></path></symbol>',
  friendDelete2: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="friendDelete2"  t="1623251479873" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="11101" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M518.72 96a203.050667 203.050667 0 0 1 202.986667 197.269333l0.064 5.781334v96.469333c0 53.952-20.778667 105.749333-57.877334 144.682667l-4.906666 4.992-42.816 42.026666a3.562667 3.562667 0 0 0-0.938667 1.6l-0.128 0.938667v6.016c0 0.277333 0.106667 0.512 0.277333 0.704l0.32 0.213333 33.664 15.872a224.64 224.64 0 0 0-37.909333 52.906667l-23.04-10.88a65.024 65.024 0 0 1-37.162667-54.634667l-0.149333-4.181333v-6.016c0-16.64 6.122667-32.597333 17.109333-44.949333l3.114667-3.264 42.794667-42.026667a145.770667 145.770667 0 0 0 43.52-97.493333l0.128-6.506667v-96.469333a139.050667 139.050667 0 0 0-134.058667-138.965334l-4.992-0.085333h-12.949333l-4.842667 0.064a139.050667 139.050667 0 0 0-134.613333 133.994667l-0.085334 4.992v95.872l0.085334 5.909333a145.770667 145.770667 0 0 0 38.976 93.994667l4.586666 4.693333 43.904 43.178667 3.456 3.84c9.088 10.88 14.506667 24.384 15.488 38.485333l0.170667 4.736-0.042667 7.552-0.256 4.693333a65.024 65.024 0 0 1-33.194666 50.645334l-3.818667 1.962666-294.933333 138.965334-2.986667 1.514666a39.104 39.104 0 0 0-20.202667 31.018667l-0.128 3.285333v9.749334l0.042667 2.538666c0.725333 11.648 9.856 20.992 21.333333 22.186667l2.474667 0.128h467.050667a224.576 224.576 0 0 0 45.674666 64H141.184c-45.013333 0-82.389333-33.92-87.338667-78.933333l-0.384-4.394667-0.128-4.522667v-10.752c0-36.074667 18.837333-69.333333 50.090667-88.384l4.330667-2.496 4.736-2.389333 296.192-139.562667c0.064 0.021333 0.106667 0.128 0.106666 0.341334L408.746667 597.333333l0.128-1.536v-6.016c0-0.64-0.170667-1.237333-0.021334-1.28l0.256 0.213334-1.301333-1.493334-42.794667-42.005333a209.984 209.984 0 0 1-62.314666-135.552l-0.384-7.04-0.106667-7.082667v-96.469333c0-107.861333 84.224-196.437333 191.466667-202.709333l5.76-0.256 5.824-0.085334h13.44zM810.666667 608a160 160 0 1 1 0 320 160 160 0 0 1 0-320z m0 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z m44.8 64c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533333 8.533333h-89.6a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533334-8.533333h89.6z"          p-id="11102"></path></symbol>',
  friendSettings: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="friendSettings"  t="1623251436583" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8484"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M540.053333 96a203.050667 203.050667 0 0 1 202.986667 197.269333l0.064 5.781334v96.469333c0 53.952-20.778667 105.749333-57.877333 144.682667l-4.906667 4.992-42.816 42.026666a3.562667 3.562667 0 0 0-0.938667 1.6l-0.128 0.938667v6.016c0 0.277333 0.106667 0.512 0.277334 0.704l0.32 0.213333 35.413333 16.704a8.533333 8.533333 0 0 1 3.626667 12.16l-24.618667 40.277334a8.533333 8.533333 0 0 1-10.922667 3.264l-30.784-14.506667a65.024 65.024 0 0 1-37.162666-54.634667l-0.149334-4.181333v-6.016c0-16.64 6.122667-32.597333 17.109334-44.949333l3.114666-3.264 42.794667-42.026667a145.770667 145.770667 0 0 0 43.52-97.493333l0.128-6.506667v-96.469333a139.050667 139.050667 0 0 0-134.058667-138.965334l-4.992-0.085333h-12.949333l-4.842667 0.064a139.050667 139.050667 0 0 0-134.613333 133.994667l-0.085333 4.992v95.872l0.085333 5.909333a145.770667 145.770667 0 0 0 38.976 93.994667l4.586667 4.693333 43.904 43.178667 3.456 3.84c9.088 10.88 14.506667 24.384 15.488 38.485333l0.170666 4.736-0.042666 7.552-0.256 4.693333a65.024 65.024 0 0 1-33.194667 50.645334l-3.818667 1.962666-294.933333 138.965334-2.986667 1.514666a39.104 39.104 0 0 0-20.202666 31.018667l-0.128 3.285333v4.330667l0.042666 2.389333a18.517333 18.517333 0 0 0 16.085334 17.066667l2.389333 0.149333h448.96a8.533333 8.533333 0 0 1 7.488 4.416l25.813333 46.933334a8.533333 8.533333 0 0 1-7.466666 12.650666H157.162667c-42.069333 0-77.077333-31.573333-81.984-73.728l-0.405334-4.266666-0.128-4.522667v-5.418667c0-36.074667 18.837333-69.333333 50.090667-88.384l4.330667-2.496 4.736-2.389333 296.192-139.562667 0.085333 0.106667v0.64l0.128-1.536v-6.016l-0.085333-1.066667c0-0.106667 0-0.192 0.064-0.213333l0.256 0.213333-1.301334-1.493333-42.794666-42.005333a209.984 209.984 0 0 1-62.314667-135.552l-0.384-7.04-0.106667-7.082667v-96.469333c0-107.861333 84.224-196.437333 191.466667-202.709334l5.76-0.256 5.824-0.085333h13.44z m330.581334 565.312a8.533333 8.533333 0 0 1 7.402666 4.266667l67.712 117.653333a8.533333 8.533333 0 0 1 0.064 8.384l-67.072 121.301333a8.533333 8.533333 0 0 1-7.466666 4.394667h-140.074667a8.533333 8.533333 0 0 1-7.402667-4.266667l-70.272-121.301333a8.533333 8.533333 0 0 1 0.064-8.682667l70.933334-117.632a8.533333 8.533333 0 0 1 7.317333-4.117333z m-36.992 64h-65.664a8.533333 8.533333 0 0 0-7.317334 4.117333l-32.725333 54.272a8.533333 8.533333 0 0 0-0.064 8.682667l32.810667 56.682667a8.533333 8.533333 0 0 0 7.402666 4.245333h65.450667a8.533333 8.533333 0 0 0 7.466667-4.394667l31.338666-56.682666a8.533333 8.533333 0 0 0-0.085333-8.384L841.024 729.6a8.533333 8.533333 0 0 0-7.381333-4.266667z"          p-id="8485"></path></symbol>',
  friendsAdd: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="friendsAdd"  t="1623251531662" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13852" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M529.386667 85.333333a203.050667 203.050667 0 0 1 202.986666 197.269334l0.064 5.781333v96.469333c0 53.952-20.778667 105.749333-57.877333 144.682667l-4.906667 4.992-42.816 42.026667a3.562667 3.562667 0 0 0-0.938666 1.6l-0.128 0.938666v6.016c0 0.277333 0.106667 0.512 0.277333 0.704l0.32 0.213334 51.413333 24.234666a8.533333 8.533333 0 0 1 4.885334 7.722667V669.866667a8.533333 8.533333 0 0 1-12.16 7.722666l-71.424-33.642666a65.024 65.024 0 0 1-37.162667-54.656l-0.149333-4.181334v-6.016c0-16.64 6.122667-32.597333 17.109333-44.949333l3.114667-3.264 42.794666-42.026667a145.770667 145.770667 0 0 0 43.52-97.493333l0.128-6.506667v-96.469333a139.050667 139.050667 0 0 0-134.058666-138.965333L529.386667 149.333333h-12.949334l-4.842666 0.064a139.050667 139.050667 0 0 0-134.613334 133.994667l-0.085333 4.992v95.872l0.085333 5.909333a145.770667 145.770667 0 0 0 38.976 93.994667l4.586667 4.693333 43.904 43.178667 3.456 3.84c9.088 10.88 14.506667 24.384 15.488 38.485333l0.170667 4.736-0.042667 7.552-0.256 4.693334a65.024 65.024 0 0 1-33.194667 50.645333l-3.818666 1.962667-294.933334 138.965333-2.986666 1.514667a39.104 39.104 0 0 0-20.202667 31.018666L128 818.730667v9.749333l0.042667 2.538667c0.725333 11.648 9.856 20.992 21.333333 22.186666l2.474667 0.128H674.133333c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H151.850667c-45.013333 0-82.389333-33.92-87.338667-78.933333l-0.384-4.394667L64 829.482667v-10.752c0-36.074667 18.837333-69.333333 50.090667-88.384l4.330666-2.496 4.736-2.389334 296.192-139.562666 0.085334 0.106666v0.64l0.128-1.536v-6.016l-0.085334-1.066666c0-0.106667 0-0.192 0.064-0.213334l0.256 0.213334-1.301333-1.493334-42.794667-42.005333a209.984 209.984 0 0 1-62.314666-135.552l-0.384-7.04-0.106667-7.082667v-96.469333c0-107.861333 84.224-196.437333 191.466667-202.709333l5.76-0.256 5.824-0.085334h13.44z"          p-id="13853"></path>    <path d="M797.866667 682.666667h46.933333c4.693333 0 8.533333 3.84 8.533333 8.533333v217.6a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333V691.2c0-4.693333 3.84-8.533333 8.533334-8.533333z"          p-id="13854"></path>    <path d="M712.533333 768h217.6c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H712.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333z"          p-id="13855"></path></symbol>',
  gift: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="gift"  t="1623251526474" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13576" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M256 960a128 128 0 0 1-128-128V466.645333A85.376 85.376 0 0 1 64 384v-106.666667a85.333333 85.333333 0 0 1 85.333333-85.333333h290.901334l-68.629334-68.629333a8.533333 8.533333 0 0 1 0-12.074667l33.194667-33.173333a8.533333 8.533333 0 0 1 12.053333 0l84.48 84.48 84.48-84.48a8.533333 8.533333 0 0 1 12.053334 0l33.194666 33.173333a8.533333 8.533333 0 0 1 0 12.074667l-68.650666 68.608L874.666667 192a85.333333 85.333333 0 0 1 85.333333 85.333333v106.666667a85.376 85.376 0 0 1-64 82.645333V832a128 128 0 0 1-128 128H256z m213.333333-490.666667H192v362.666667a64 64 0 0 0 60.245333 63.893333L256 896h213.333333V469.333333z m362.666667 0H533.333333v426.666667h234.666667a64 64 0 0 0 63.893333-60.245333L832 832V469.333333zM469.333333 256H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 277.333333v106.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 405.333333h320v-149.333333z m405.333334 0H533.333333v149.333333h341.333334a21.333333 21.333333 0 0 0 21.184-18.837333L896 384v-106.666667a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 256z"          p-id="13577"></path></symbol>',
  good: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="good"  t="1623251529664" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13714" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M192 938.666667a128 128 0 0 1-128-128V469.333333a128 128 0 0 1 128-128h83.797333l45.76-183.338666a85.333333 85.333333 0 0 1 102.784-62.293334l32.149334 7.744a128 128 0 0 1 98.005333 124.736L554.368 277.333333h200.170667a170.666667 170.666667 0 0 1 170.176 183.616l-21.333334 280.554667A213.333333 213.333333 0 0 1 690.645333 938.666667H192z m85.290667-533.333334H192a64 64 0 0 0-63.893333 60.245334L128 469.333333v341.333334a64 64 0 0 0 60.245333 63.893333L192 874.666667h85.312l-0.021333-469.333334z m107.093333-234.197333l-0.746667 2.346667L341.333333 342.954667V874.666667h349.312a149.333333 149.333333 0 0 0 148.437334-132.842667l0.469333-5.162667 21.333333-280.576a106.666667 106.666667 0 0 0-101.738666-114.645333L754.56 341.333333h-264.32l0.277333-113.28a64 64 0 0 0-45.312-61.376l-3.690666-1.002666-32.149334-7.744a21.333333 21.333333 0 0 0-24.96 13.205333z"          p-id="13715"></path></symbol>',
  home: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="home"  t="1623251630236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="19616" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M149.333333 960a85.333333 85.333333 0 0 1-85.333333-85.333333V331.221333a85.333333 85.333333 0 0 1 48.64-77.056l362.666667-172.693333a85.333333 85.333333 0 0 1 73.386666 0l362.666667 172.693333A85.333333 85.333333 0 0 1 960 331.221333V874.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H149.333333zM505.386667 138.24l-2.56 1.024-362.666667 172.693333a21.333333 21.333333 0 0 0-11.989333 16.554667L128 331.221333V874.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 896h192V661.333333a85.333333 85.333333 0 0 1 85.333334-85.333333h170.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v234.666667h192a21.333333 21.333333 0 0 0 21.184-18.837333L896 874.666667V331.221333a21.333333 21.333333 0 0 0-9.792-17.941333l-2.368-1.322667-362.666667-172.693333a21.333333 21.333333 0 0 0-15.786666-1.024zM597.333333 640h-170.666666a21.333333 21.333333 0 0 0-21.184 18.837333L405.333333 661.333333v234.666667h213.333334V661.333333a21.333333 21.333333 0 0 0-18.837334-21.184L597.333333 640z"          p-id="19617"></path></symbol>',
  huititle: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="huititle"  t="1623251618367" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18930" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M596.693333 48.384l277.333334 158.485333A170.666667 170.666667 0 0 1 960 355.050667v313.898666a170.666667 170.666667 0 0 1-85.973333 148.181334l-277.333334 158.485333a170.666667 170.666667 0 0 1-169.386666 0l-277.333334-158.485333A170.666667 170.666667 0 0 1 64 668.949333V355.050667a170.666667 170.666667 0 0 1 85.973333-148.181334l277.333334-158.485333a170.666667 170.666667 0 0 1 169.386666 0zM463.786667 101.397333l-4.736 2.56-277.333334 158.464a106.666667 106.666667 0 0 0-53.632 87.637334L128 355.050667v313.898666a106.666667 106.666667 0 0 0 49.493333 90.048l4.266667 2.56 277.333333 158.506667a106.666667 106.666667 0 0 0 101.098667 2.538667l4.736-2.56 277.333333-158.464a106.666667 106.666667 0 0 0 53.632-87.637334l0.106667-4.992V355.050667a106.666667 106.666667 0 0 0-49.493333-90.048l-4.266667-2.56-277.333333-158.506667a106.666667 106.666667 0 0 0-101.098667-2.538667z m257.194666 229.077334a42.666667 42.666667 0 0 1 0 26.24l-75.562666 233.770666a85.333333 85.333333 0 0 1-54.954667 54.954667l-233.770667 75.562667a42.666667 42.666667 0 0 1-53.717333-53.717334l75.562667-233.770666a85.333333 85.333333 0 0 1 54.954666-54.954667l233.770667-75.562667a42.666667 42.666667 0 0 1 53.717333 27.477334z m-73.706666 46.229333l-194.112 62.741333a21.333333 21.333333 0 0 0-12.8 11.370667l-0.938667 2.368-62.72 194.090667 194.090667-62.72a21.333333 21.333333 0 0 0 12.8-11.370667l0.938666-2.368 62.741334-194.112zM512 469.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z"          p-id="18931"></path></symbol>',
  info: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="info"  t="1623251367443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5064"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m34.133333 320c4.693333 0 8.533333 3.84 8.533334 8.533333v281.6a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V490.666667h-34.133334a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h89.6z m-23.466666-128a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"          p-id="5065"></path></symbol>',
  informationAdd: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="informationAdd"  t="1623251599689" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="17698" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M546.133333 64c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V477.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334V789.333333a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h311.466666z m234.666667 0c4.693333 0 8.533333 3.84 8.533333 8.533333V234.666667h162.133334c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H789.333333v162.133333a8.533333 8.533333 0 0 1-6.826666 8.362667L780.8 469.333333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333V298.666667h-162.133333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H725.333333V72.533333a8.533333 8.533333 0 0 1 6.826667-8.362666L733.866667 64z"          p-id="17699"></path></symbol>',
  key: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="key"  t="1623251582106" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16599" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M843.861333 176.789333c129.130667 129.130667 129.130667 338.496 0 467.626667-121.493333 121.493333-314.026667 128.682667-443.904 21.546667l-106.709333 106.666666 99.584 99.562667a8.533333 8.533333 0 0 1 0 12.074667l-33.194667 33.194666a8.533333 8.533333 0 0 1-12.053333 0l-99.584-99.584-99.541333 99.584a8.533333 8.533333 0 0 1-12.074667 0L103.189333 884.266667a8.533333 8.533333 0 0 1 0-12.074667l105.514667-105.493333a8.704 8.704 0 0 1 0.085333-0.085334l33.194667-33.194666 112.704-112.725334c-107.136-129.898667-99.946667-322.410667 21.546667-443.904 129.130667-129.130667 338.496-129.130667 467.626666 0z m-422.378666 45.248c-104.128 104.149333-104.128 272.981333 0 377.130667 104.149333 104.128 272.981333 104.128 377.130666 0 104.149333-104.149333 104.149333-272.981333 0-377.130667-104.149333-104.128-272.981333-104.128-377.130666 0z"          p-id="16600"></path></symbol>',
  left: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="left"  t="1623251376006" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5616"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M670.954667 86.826667L269.44 488.362667a32 32 0 0 0-2.090667 42.965333l2.090667 2.282667L670.933333 935.168a8.533333 8.533333 0 0 0 6.037334 2.496h66.368a8.533333 8.533333 0 0 0 6.037333-14.570667L337.28 511.018667 749.397333 98.901333a8.533333 8.533333 0 0 0-6.037333-14.570666h-66.346667a8.533333 8.533333 0 0 0-6.058666 2.496z"          p-id="5617"></path></symbol>',
  link: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="link"  t="1623251562728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="15362" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M426.112 488.938667l-46.613333 46.570666a64.042667 64.042667 0 0 0-70.101334 9.92l-2.752 2.581334-120.661333 120.682666a64 64 0 0 0-2.602667 87.765334l2.602667 2.752 90.496 90.496a64 64 0 0 0 87.786667 2.581333l2.730666-2.56 120.682667-120.704c13.397333-13.397333 19.605333-31.253333 18.645333-48.789333l51.626667-51.648a128.042667 128.042667 0 0 1-25.024 145.706666l-120.682667 120.682667a128 128 0 0 1-181.013333 0l-90.517333-90.517333a128 128 0 0 1 0-181.013334l120.682666-120.682666a128.042667 128.042667 0 0 1 164.693334-13.824zM804.458667 140.714667l90.517333 90.517333a128 128 0 0 1 0 181.013333l-120.682667 120.682667a128.042667 128.042667 0 0 1-145.706666 25.024l51.648-51.626667a63.850667 63.850667 0 0 0 46.08-16.064l2.709333-2.581333 120.682667-120.682667a64 64 0 0 0 2.581333-87.786666l-2.56-2.730667-90.517333-90.496a64 64 0 0 0-87.786667-2.602667l-2.730667 2.602667-120.682666 120.661333a64.021333 64.021333 0 0 0-12.501334 72.853334l-46.570666 46.613333a128.042667 128.042667 0 0 1 13.824-164.714667l120.682666-120.682666a128 128 0 0 1 181.013334 0z"          p-id="15363"></path>    <path d="M624.938667 380.586667a8.533333 8.533333 0 0 1 12.074666 0l33.194667 33.173333a8.533333 8.533333 0 0 1 0 12.074667L425.813333 670.208a8.533333 8.533333 0 0 1-12.074666 0l-33.194667-33.194667a8.533333 8.533333 0 0 1 0-12.074666L624.938667 380.586667z"          p-id="15364"></path></symbol>',
  live: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="live"  t="1623251547494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="14402" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M682.666667 106.666667a128 128 0 0 1 127.573333 117.397333l93.056-15.509333A85.333333 85.333333 0 0 1 1002.666667 292.736v438.528a85.333333 85.333333 0 0 1-99.370667 84.181333l-93.056-15.509333A128 128 0 0 1 682.666667 917.333333H149.333333a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h533.333334z m0 64H149.333333a64 64 0 0 0-63.893333 60.245333L85.333333 234.666667v554.666666a64 64 0 0 0 60.245334 63.893334L149.333333 853.333333h533.333334a64 64 0 0 0 63.893333-60.245333L746.666667 789.333333V234.666667a64 64 0 0 0-60.245334-63.893334L682.666667 170.666667z m233.642666 100.757333l-2.474666 0.256-103.168 17.194667v446.229333l104.021333 17.322667 2.645333 0.170666a21.333333 21.333333 0 0 0 21.184-18.837333l0.149334-2.496V292.736a21.333333 21.333333 0 0 0-22.357334-21.333333zM650.666667 234.666667a32 32 0 1 1 0 64 32 32 0 0 1 0-64z"          p-id="14403"></path></symbol>',
  loading: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="loading"  t="1636076324730" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3862"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"          p-id="3863"></path></symbol>',
  location: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="location"  t="1623251627752" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="19478" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c212.074667 0 384 170.282667 384 380.373333 0 93.866667-34.346667 179.84-91.306667 246.186667l-6.613333 7.616c-43.904 49.877333-124.586667 130.432-242.069333 241.664a64 64 0 0 1-84.864 2.816l-3.157334-2.816-36.544-34.752c-103.573333-98.901333-174.293333-170.389333-212.117333-214.485333A376.746667 376.746667 0 0 1 128 444.373333C128 234.282667 299.925333 64 512 64z m0 64C335.146667 128 192 269.781333 192 444.373333c0 76.010667 27.136 147.754667 75.882667 204.544l6.357333 7.296c39.957333 45.354667 113.450667 119.018667 219.669333 219.989334l18.090667 17.173333 52.224-49.749333c93.482667-89.664 157.674667-154.858667 191.914667-194.752A312.661333 312.661333 0 0 0 832 444.373333C832 269.781333 688.853333 128 512 128z m0 170.666667a149.333333 149.333333 0 1 1 0 298.666666 149.333333 149.333333 0 0 1 0-298.666666z m0 64a85.333333 85.333333 0 1 0 0 170.666666 85.333333 85.333333 0 0 0 0-170.666666z"          p-id="19479"></path></symbol>',
  lock: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="lock"  t="1623251573078" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16049" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 64c153.173333 0 277.333333 124.16 277.333333 277.333333v128a128 128 0 0 1 128 128v234.666667a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V597.333333a128 128 0 0 1 128-128v-128c0-153.173333 124.16-277.333333 277.333333-277.333333z m277.333333 469.333333H234.666667a64 64 0 0 0-63.893334 60.245334L170.666667 597.333333v234.666667a64 64 0 0 0 60.245333 63.893333L234.666667 896h554.666666a64 64 0 0 0 63.893334-60.245333L853.333333 832V597.333333a64 64 0 0 0-60.245333-63.893333L789.333333 533.333333z m-243.2 106.666667c4.693333 0 8.533333 3.84 8.533334 8.533333v110.933334a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-110.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333zM512 128c-115.84 0-210.090667 92.309333-213.248 207.36L298.666667 341.333333v128h426.666666v-128c0-115.84-92.309333-210.090667-207.36-213.248L512 128z"          p-id="16050"></path></symbol>',
  loop: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="loop"  t="1623251577984" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16323" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M576 106.666667c223.850667 0 405.333333 181.482667 405.333333 405.333333 0 203.584-150.101333 372.138667-345.685333 400.981333l39.744 39.744a4.266667 4.266667 0 0 1-3.029333 7.274667h-71.488a8.533333 8.533333 0 0 1-6.037334-2.496L497.92 860.586667a4.266667 4.266667 0 0 1 3.029333-7.274667H576c188.522667 0 341.333333-152.810667 341.333333-341.333333 0-173.013333-128.725333-315.946667-295.616-338.304L554.666667 106.666667h21.333333z m-128 64C259.477333 170.666667 106.666667 323.477333 106.666667 512c0 173.013333 128.725333 315.946667 295.616 338.304L469.333333 917.333333h-21.333333C224.149333 917.333333 42.666667 735.850667 42.666667 512 42.666667 308.394667 192.768 139.861333 388.352 111.018667l-39.744-39.744A4.266667 4.266667 0 0 1 351.637333 64h71.488a8.533333 8.533333 0 0 1 6.037334 2.496L526.08 163.413333a4.266667 4.266667 0 0 1-3.029333 7.274667H448z"          p-id="16324"></path></symbol>',
  mail: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="mail"  t="1623251591904" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="17289" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 128a170.666667 170.666667 0 0 1 170.666667 170.666667v426.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V298.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h554.666666z m106.666667 243.797333l-310.613333 147.925334a170.666667 170.666667 0 0 1-146.773334 0L128 371.797333V725.333333a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 832h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 725.333333V371.797333zM789.333333 192H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 300.928l338.133333 161.024a106.666667 106.666667 0 0 0 86.549334 2.282667l5.184-2.282667L896 300.906667V298.666667a106.666667 106.666667 0 0 0-102.037333-106.56L789.333333 192z"          p-id="17290"></path></symbol>',
  mark: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="mark"  t="1623251575072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16187" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M917.333333 851.669333a85.333333 85.333333 0 0 1-105.322666 82.944l-290.005334-69.866666a42.666667 42.666667 0 0 0-20.010666 0L211.989333 934.613333A85.333333 85.333333 0 0 1 106.666667 851.669333V192a128 128 0 0 1 128-128h554.666666a128 128 0 0 1 128 128v659.669333zM853.333333 320H170.666667v531.669333a21.333333 21.333333 0 0 0 23.893333 21.184l2.432-0.448 290.026667-69.888a106.666667 106.666667 0 0 1 43.776-1.28l6.186666 1.28 290.026667 69.888a21.333333 21.333333 0 0 0 26.176-18.261333l0.149333-2.474667V320z m-64-192H234.666667a64 64 0 0 0-63.893334 60.245333L170.666667 192v64h682.666666V192a64 64 0 0 0-60.245333-63.893333L789.333333 128z"          p-id="16188"></path></symbol>',
  me: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="me"  t="1623251524691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13440" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M500.928 160.064l4.842667-0.064h12.949333c76.8 0 139.050667 62.250667 139.050667 139.050667v96.469333a145.770667 145.770667 0 0 1-43.648 104.021333l-42.794667 42.026667a67.562667 67.562667 0 0 0-20.224 48.192v6.016c0 25.173333 14.549333 48.085333 37.312 58.837333l295.808 139.392a39.104 39.104 0 0 1 22.442667 35.392v10.752c0 13.162667-10.666667 23.850667-23.850667 23.850667H141.184c-12.586667 0-23.04-9.813333-23.808-22.314667l-0.064-2.538666 0.021333-9.749334c0-14.293333 7.808-27.456 20.309334-34.304l2.986666-1.493333 294.954667-138.986667a65.024 65.024 0 0 0 37.013333-52.608l0.256-4.693333 0.042667-7.552c0-15.829333-5.546667-31.104-15.658667-43.242667l-3.456-3.818666-43.904-43.157334a145.770667 145.770667 0 0 1-43.562666-98.709333l-0.106667-5.909333v-95.872a139.050667 139.050667 0 0 1 134.72-138.986667z m-92.032 435.712L408.746667 597.333333c0.042667-0.490667 0-0.704-0.085334-0.746666L112.490667 736.128l-4.736 2.389333c-33.834667 18.517333-54.421333 53.162667-54.421334 90.88v10.752l0.128 4.522667C56.384 891.84 94.72 928 141.184 928h741.632a87.850667 87.850667 0 0 0 87.850667-87.850667v-10.752a103.104 103.104 0 0 0-59.157334-93.269333L615.701333 596.693333a1.024 1.024 0 0 1-0.597333-0.938666v-6.016c0-0.96 0.384-1.877333 1.066667-2.56l42.794666-42.005334a209.770667 209.770667 0 0 0 62.805334-149.674666v-96.469334A203.050667 203.050667 0 0 0 518.72 96h-13.44l-5.824 0.085333c-109.973333 3.370667-197.226667 93.184-197.226667 202.965334v96.469333l0.106667 7.061333a210.112 210.112 0 0 0 62.698667 142.613334l42.794666 42.026666 1.28 1.472c-0.512-0.576-0.213333 0.213333-0.213333 1.066667v6.016z"          p-id="13441"></path></symbol>',
  minus: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="minus"  t="1623251311340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2856"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m183.466667 362.666666c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H349.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334h345.6z"          p-id="2857"></path></symbol>',
  more: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="more"  t="1623251398268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7112"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M522.666667 522.666667m-53.333334 0a53.333333 53.333333 0 1 0 106.666667 0 53.333333 53.333333 0 1 0-106.666667 0Z"          p-id="7113"></path>    <path d="M266.666667 522.666667m-53.333334 0a53.333333 53.333333 0 1 0 106.666667 0 53.333333 53.333333 0 1 0-106.666667 0Z"          p-id="7114"></path>    <path d="M778.666667 522.666667m-53.333334 0a53.333333 53.333333 0 1 0 106.666667 0 53.333333 53.333333 0 1 0-106.666667 0Z"          p-id="7115"></path></symbol>',
  movie: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="movie"  t="1623251560514" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="15224" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333a467.84 467.84 0 0 1-136.064 330.453333l-2.858666 2.837334-5.824 5.674666a8.533333 8.533333 0 0 1-5.930667 2.389334H744.682667a4.266667 4.266667 0 0 1-2.389334-7.786667c2.197333-1.493333 4.053333-2.816 5.610667-3.904C850.496 768.106667 917.333333 647.850667 917.333333 512c0-223.850667-181.482667-405.333333-405.333333-405.333333S106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333h418.133333c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H520.533333l-0.810666-0.064L512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667z m0 576a106.666667 106.666667 0 1 1 0 213.333333 106.666667 106.666667 0 0 1 0-213.333333z m0 64a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333zM298.666667 405.333333a106.666667 106.666667 0 1 1 0 213.333334 106.666667 106.666667 0 0 1 0-213.333334z m426.666666 0a106.666667 106.666667 0 1 1 0 213.333334 106.666667 106.666667 0 0 1 0-213.333334z m-426.666666 64a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z m426.666666 0a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334zM512 192a106.666667 106.666667 0 1 1 0 213.333333 106.666667 106.666667 0 0 1 0-213.333333z m0 64a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333z"          p-id="15225"></path></symbol>',
  network: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="network"  t="1623251354451" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4512"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M522.666667 42.666667c3.776 0 7.530667 0.170667 11.242666 0.490666C782.954667 54.613333 981.333333 260.138667 981.333333 512c0 251.861333-198.4 457.386667-447.424 468.821333-3.712 0.341333-7.466667 0.512-11.242666 0.512l-3.285334-0.064C516.906667 981.333333 514.474667 981.333333 512 981.333333 252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667l7.658667 0.042666L522.666667 42.666667zM490.666667 533.333333h-149.056c4.842667 191.082667 74.069333 342.08 149.056 376.576V533.333333z m213.056 0H554.666667v376.576c74.986667-34.517333 144.213333-185.514667 149.056-376.554666z m-426.133334 0H107.221333c8.746667 168.853333 120.853333 310.4 274.261334 362.517334-60.16-81.109333-100.394667-212.650667-103.893334-362.496z m639.189334 0h-149.034667c-3.349333 143.104-40.170667 269.504-95.872 351.253334C810.048 825.216 908.586667 691.221333 916.778667 533.333333zM381.482667 128.128c-146.986667 50.069333-255.936 181.909333-272.597334 341.226667h169.450667c6.634667-140.970667 45.866667-263.978667 103.146667-341.226667zM342.4 469.333333H490.666667V114.090667C418.496 147.285333 351.637333 288.426667 342.4 469.333333zM554.666667 114.090667L554.666667 469.333333h148.266666C693.674667 288.448 626.837333 147.306667 554.666667 114.090667z m117.184 25.322666l1.834666 2.730667c51.904 77.674667 87.04 194.474667 93.290667 327.189333h148.117333c-15.530667-148.565333-111.317333-273.237333-243.242666-329.92z"          p-id="4513"></path></symbol>',
  noEye: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="noEye"  t="1623251470250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10413" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M93.866667 322.773333a8.533333 8.533333 0 0 1 6.613333 3.114667c5.589333 6.848 10.261333 12.373333 14.058667 16.64 97.664 109.056 239.552 177.706667 397.482666 177.706667 162.752 0 308.48-72.917333 406.314667-187.84 1.493333-1.792 3.242667-3.882667 5.184-6.272a8.533333 8.533333 0 0 1 15.146667 5.376v9.813333l0.021333 8.32v51.754667a8.533333 8.533333 0 0 1-2.517333 6.037333 599.893333 599.893333 0 0 1-99.584 81.002667l82.474666 98.261333a8.533333 8.533333 0 0 1-1.066666 12.010667l-35.946667 30.165333a8.533333 8.533333 0 0 1-12.010667-1.045333l-89.813333-107.050667a593.045333 593.045333 0 0 1-145.450667 50.837333l44.074667 121.024a8.533333 8.533333 0 0 1-5.098667 10.944l-44.096 16.042667a8.533333 8.533333 0 0 1-10.944-5.098667l-48.448-133.098666a604.586667 604.586667 0 0 1-130.88-1.557334L390.4 714.517333a8.533333 8.533333 0 0 1-10.944 5.12l-44.096-16.064a8.533333 8.533333 0 0 1-5.12-10.944l45.184-124.096a593.066667 593.066667 0 0 1-131.584-47.744l-89.813333 107.029334a8.533333 8.533333 0 0 1-12.032 1.066666L106.026667 598.677333a8.533333 8.533333 0 0 1-1.066667-12.010666l82.474667-98.261334a599.872 599.872 0 0 1-80.981334-62.976c-4.352-4.032-10.56-10.026667-18.602666-18.005333A8.533333 8.533333 0 0 1 85.333333 401.386667v-70.101334c0-4.693333 3.84-8.533333 8.533334-8.533333z"          p-id="10414"></path></symbol>',
  no: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="no"  t="1623251360916" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4926"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m306.304 203.861333L246.528 818.304A403.754667 403.754667 0 0 0 512 917.333333c223.850667 0 405.333333-181.482667 405.333333-405.333333 0-101.546667-37.333333-194.346667-99.029333-265.472zM512 106.666667C288.149333 106.666667 106.666667 288.149333 106.666667 512c0 99.285333 35.690667 190.229333 94.954666 260.693333l571.093334-571.072A403.712 403.712 0 0 0 512 106.666667z"          p-id="4927"></path></symbol>',
  openMail: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="openMail"  t="1623251584003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16737" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M768 106.666667a85.376 85.376 0 0 1 82.986667 65.408A128 128 0 0 1 960 298.666667v490.666666a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V298.666667a128.021333 128.021333 0 0 1 109.013333-126.592A85.333333 85.333333 0 0 1 256 106.666667h512z m128 265.130666l-347.306667 165.397334a85.333333 85.333333 0 0 1-73.386666 0L128 371.797333V789.333333a64 64 0 0 0 60.245333 63.893334L192 853.333333h640a64 64 0 0 0 63.893333-60.245333L896 789.333333V371.797333zM768 170.666667H256a21.333333 21.333333 0 0 0-21.184 18.837333L234.666667 192v152.448l267.797333 133.888a21.333333 21.333333 0 0 0 16.426667 1.109333l2.645333-1.109333L789.333333 344.426667V192a21.333333 21.333333 0 0 0-18.837333-21.184L768 170.666667zM128.106667 294.912L128 298.666667v2.261333l42.666667 20.288v-82.901333a64.042667 64.042667 0 0 0-42.56 56.597333z m725.248-56.597333L853.333333 321.194667l42.666667-20.288V298.666667a64.021333 64.021333 0 0 0-42.666667-60.352z"          p-id="16738"></path></symbol>',
  pageFirst: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pageFirst"  t="1627224396877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2731"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css">@font-face { font-family: feedback-iconfont; src:            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.eot?#iefix") format("embedded-opentype"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.woff2") format("woff2"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.woff") format("woff"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.ttf") format("truetype"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.svg#iconfont") format("svg"); }        </style>    </defs>    <path d="M768 278.624l-45.248-45.248L444.128 512l278.624 278.624L768 745.376 534.624 512zM288 832h64V192H288z"          p-id="2732"></path></symbol>',
  pageLast: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pageLast"  t="1627224408407" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2863"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css">@font-face { font-family: feedback-iconfont; src:            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.eot?#iefix") format("embedded-opentype"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.woff2") format("woff2"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.woff") format("woff"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.ttf") format("truetype"),            url("//at.alicdn.com/t/font_1031158_1uhr8ri0pk5.svg#iconfont") format("svg"); }        </style>    </defs>    <path d="M256 278.624L489.376 512 256 745.376l45.248 45.248L579.872 512 301.248 233.376zM672 832h64V192h-64z"          p-id="2864"></path></symbol>',
  payCollect: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="payCollect"  t="1623251452625" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9309"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M72.533333 353.408a8.533333 8.533333 0 0 1 6.037334 2.496l132.266666 132.266667a8.533333 8.533333 0 0 1 2.496 6.037333v61.184a8.533333 8.533333 0 0 1-14.570666 6.037333L128 490.666667v333.333333a72 72 0 0 0 67.776 71.893333l4.224 0.106667h624a72 72 0 0 0 71.893333-67.776l0.106667-4.224v-99.413333a8.533333 8.533333 0 0 1 14.570667-6.016l46.933333 46.933333a8.533333 8.533333 0 0 1 2.496 6.037333v46.976A141.482667 141.482667 0 0 1 818.517333 960H205.482667A141.482667 141.482667 0 0 1 64 818.517333V361.941333c0-4.714667 3.84-8.533333 8.533333-8.533333z m540.437334-98.389333l33.173333 33.194666a8.533333 8.533333 0 0 1 0 12.074667L541.077333 405.333333H674.133333c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H533.333333v42.666667h140.8c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H533.333333v162.133333a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533334V576h-140.8a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333H469.333333v-42.666667h-140.8a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h133.034667l-105.045333-105.045333a8.533333 8.533333 0 0 1 0-12.074667l33.173333-33.194666a8.533333 8.533333 0 0 1 12.074667 0l99.562666 99.562666 99.562667-99.562666a8.533333 8.533333 0 0 1 12.074667 0zM818.517333 64A141.482667 141.482667 0 0 1 960 205.482667v456.576a8.533333 8.533333 0 0 1-14.570667 6.037333l-132.266666-132.266667a8.533333 8.533333 0 0 1-2.496-6.037333v-61.184a8.533333 8.533333 0 0 1 14.570666-6.037333L896 533.333333V200a72 72 0 0 0-67.776-71.893333L824 128H200a72 72 0 0 0-71.893333 67.776L128 200v99.413333a8.533333 8.533333 0 0 1-14.570667 6.016l-46.933333-46.933333A8.533333 8.533333 0 0 1 64 252.458667V205.482667A141.482667 141.482667 0 0 1 205.482667 64h613.034666z"          p-id="9310"></path></symbol>',
  pay: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pay"  t="1623251406200" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7524"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M832 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h640z m0 64H192a64 64 0 0 0-63.893333 60.245333L128 192v640a64 64 0 0 0 60.245333 63.893333L192 896h640a64 64 0 0 0 63.893333-60.245333L896 832V192a64 64 0 0 0-60.245333-63.893333L832 128zM311.466667 341.333333c4.693333 0 8.533333 3.84 8.533333 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V349.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334z m149.333333 0c4.693333 0 8.533333 3.84 8.533333 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533334V349.866667c0-4.693333 3.84-8.533333 8.533334-8.533334h46.933333z m149.333333 0c4.693333 0 8.533333 3.84 8.533334 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533334 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533334V349.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333z m149.333334 0c4.693333 0 8.533333 3.84 8.533333 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V349.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334z"          p-id="7525"></path></symbol>',
  payment: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="payment"  t="1623251549615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="14538" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M565.333333 85.333333C747.946667 85.333333 896 233.386667 896 416c0 76.096-25.706667 146.197333-68.906667 202.069333A99.946667 99.946667 0 0 1 928 682.666667a90.624 90.624 0 0 1-48.832 114.965333l-4.693333 1.877333-265.642667 97.877334a192 192 0 0 1-110.357333 6.72L192 832H93.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334a8.533333 8.533333 0 0 1 8.512-8.533333h105.6l313.685334 73.813333a128 128 0 0 0 67.626666-2.474666l5.952-2.005334 265.792-97.92c13.76-5.184 20.736-20.522667 15.573334-34.282666a35.989333 35.989333 0 0 0-40-22.784l-3.157334 0.704L669.909333 725.333333H477.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334h66.133333a32 32 0 0 0 3.072-63.850666L544 597.333333H93.845333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0.021333-4.693333 3.84-8.533333 8.554667-8.533334l162.24 0.021334A329.92 329.92 0 0 1 234.666667 416C234.666667 233.386667 382.72 85.333333 565.333333 85.333333z m0 64C418.048 149.333333 298.666667 268.714667 298.666667 416c0 42.112 9.770667 81.92 27.136 117.333333H533.333333v-42.666666H456.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h76.778667v-21.333334H456.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h65.386667l-56.149333-56.128a8.533333 8.533333 0 0 1 0-12.074666l33.194666-33.194667a8.533333 8.533333 0 0 1 12.053334 0l54.314666 54.314667 54.314667-54.314667a8.533333 8.533333 0 0 1 12.053333 0l33.194667 33.194667a8.533333 8.533333 0 0 1 0 12.074666L608.725333 341.333333H674.133333c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333h-76.821333v21.333334H674.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334h-76.821333v58.816a95.914667 95.914667 0 0 1 37.226667 111.872L661.333333 661.333333l21.397334-5.824A266.666667 266.666667 0 0 0 832 416C832 268.714667 712.618667 149.333333 565.333333 149.333333z"          p-id="14539"></path></symbol>',
  pepole: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pepole"  t="1623251460088" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9861"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M455.338667 117.333333a193.557333 193.557333 0 0 1 193.557333 193.557334v90.752a200.042667 200.042667 0 0 1-60.330667 143.146666l-39.936 38.997334a3.562667 3.562667 0 0 0-1.066666 2.538666l-0.021334 4.224 278.421334 130.453334a103.104 103.104 0 0 1 59.264 88.597333l0.106666 4.778667v7.530666a84.757333 84.757333 0 0 1-84.757333 84.757334H95.424a84.757333 84.757333 0 0 1-84.586667-79.210667l-0.106666-2.517333L10.666667 820.693333l0.021333-6.336c0-37.76 20.629333-72.490667 53.76-90.538666l1.984-1.024 4.48-2.24 277.525333-130.005334 0.021334-4.245333a3.562667 3.562667 0 0 0-0.362667-1.6l-0.277333-0.384-0.704-0.789333-39.68-38.762667a200.490667 200.490667 0 0 1-59.797334-129.642667l-0.384-7.125333-0.128-6.997333v-90.133334c0-104.490667 82.986667-190.144 188.373334-193.493333l5.696-0.064z m0 64h-14.165334l-4.714666 0.064a129.557333 129.557333 0 0 0-125.354667 129.493334v90.133333l0.106667 5.845333a136.042667 136.042667 0 0 0 40.917333 92.117334l41.066667 40.149333 3.498666 3.84c10.154667 12.138667 15.744 27.477333 15.744 43.349333l-0.021333 6.336-0.256 4.522667a63.125333 63.125333 0 0 1-36.053333 51.093333L98.048 778.538667l-2.986667 1.493333c-12.544 6.826667-20.394667 20.010667-20.394666 34.346667v6.506666l0.042666 2.432a20.757333 20.757333 0 0 0 20.693334 19.349334h705.173333a20.757333 20.757333 0 0 0 20.757333-20.757334v-7.530666c0-15.168-8.768-28.992-22.528-35.413334L519.893333 648.277333a63.104 63.104 0 0 1-36.330666-57.152v-4.8c0-18.197333 7.338667-35.626667 20.352-48.341333l39.957333-38.997333a136.042667 136.042667 0 0 0 41.024-97.344v-90.752A129.557333 129.557333 0 0 0 455.338667 181.333333z m222.741333 0.149334a155.541333 155.541333 0 0 1 148.501333 150.186666l0.085334 5.205334V405.333333a159.786667 159.786667 0 0 1-45.546667 111.744l-4.48 4.394667-27.008 25.536 208.192 94.485333a94.613333 94.613333 0 0 1 55.061333 76.949334l0.341334 4.565333 0.106666 4.629333a72.341333 72.341333 0 0 1-64.746666 71.957334c-5.546667-29.077333-11.861333-50.282667-18.922667-63.637334l11.328 0.021334a8.32 8.32 0 0 0 8.341333-8.32c0-11.029333-5.909333-21.12-15.317333-26.517334l-2.645333-1.365333-62.933334-28.586667a167.125333 167.125333 0 0 0-15.317333-8.170666l-153.450667-71.893334A55.466667 55.466667 0 0 1 682.666667 551.168c0-16.917333 6.4-33.130667 17.770666-45.504l3.242667-3.264 29.013333-27.413333a95.786667 95.786667 0 0 0 29.824-64.362667L762.666667 405.333333v-68.48a91.562667 91.562667 0 0 0-56.469334-84.586666c-3.626667-15.616-13.013333-39.232-28.117333-70.805334z"          p-id="9862"></path></symbol>',
  personal: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="personal"  t="1623251352294" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4374"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 960c-102.464 0-196.906667-34.410667-272.384-92.288l-2.730667-2.133333-0.469333-0.341334a450.133333 450.133333 0 0 1-9.749333-7.829333l10.218666 8.192a450.154667 450.154667 0 0 1-51.2-46.634667l-2.517333-2.709333A446.4 446.4 0 0 1 64 512C64 264.576 264.576 64 512 64s448 200.576 448 448c0 117.461333-45.226667 224.362667-119.168 304.256l-2.517333 2.709333-0.426667 0.448c-2.602667 2.773333-5.248 5.504-7.936 8.192l8.362667-8.64a450.816 450.816 0 0 1-51.2 46.634667l-2.730667 2.133333A446.037333 446.037333 0 0 1 512 960z m6.72-682.666667h-12.949333l-4.842667 0.064a139.050667 139.050667 0 0 0-134.613333 133.994667l-0.085334 4.992v95.872l0.085334 5.909333a145.770667 145.770667 0 0 0 38.976 93.994667l4.586666 4.693333 43.904 43.178667 3.456 3.84c9.088 10.88 14.506667 24.384 15.488 38.485333l0.170667 4.736-0.042667 7.552-0.256 4.693334a65.024 65.024 0 0 1-33.194666 50.645333l-3.818667 1.962667-132.394667 62.378666A382.208 382.208 0 0 0 512 896c77.013333 0 148.693333-22.656 208.810667-61.674667l-132.394667-62.378666a65.024 65.024 0 0 1-37.162667-54.656l-0.149333-4.181334v-6.016c0-16.64 6.122667-32.597333 17.109333-44.949333l3.114667-3.264 42.794667-42.026667a145.770667 145.770667 0 0 0 43.52-97.493333l0.128-6.506667v-96.469333a139.050667 139.050667 0 0 0-134.058667-138.965333L518.72 277.333333zM512 128C299.925333 128 128 299.925333 128 512c0 109.376 45.738667 208.085333 119.125333 278.016l161.557334-76.117333c0.064 0.021333 0.106667 0.128 0.106666 0.341333l-0.021333 0.405333 0.128-1.536v-6.016c0-0.64-0.170667-1.237333-0.021333-1.28l0.256 0.213334-1.301334-1.493334-42.794666-42.005333a209.984 209.984 0 0 1-62.314667-135.552l-0.384-7.04-0.106667-7.082667v-96.469333c0-107.861333 84.224-196.437333 191.466667-202.709333l5.76-0.256 5.824-0.085334h13.44a203.050667 203.050667 0 0 1 202.986667 197.269334l0.064 5.781333v96.469333c0 53.952-20.778667 105.749333-57.877334 144.682667l-4.906666 4.992-42.816 42.026667a3.562667 3.562667 0 0 0-0.938667 1.6l-0.128 0.938666v6.016c0 0.277333 0.106667 0.512 0.277333 0.704l0.32 0.213334 161.194667 75.968A382.912 382.912 0 0 0 896 512c0-212.074667-171.925333-384-384-384z"          p-id="4375"></path></symbol>',
  picture: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="picture"  t="1623251624834" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="19340" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M640.469333 85.333333a64 64 0 0 1 58.816 38.784L728.384 192H832a128 128 0 0 1 128 128v490.666667a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V320a128 128 0 0 1 128-128h103.616l29.098667-67.882667A64 64 0 0 1 383.530667 85.333333h256.938666z m0 64H383.530667l-45.717334 106.666667H192a64 64 0 0 0-63.893333 60.245333L128 320v490.666667a64 64 0 0 0 60.245333 63.893333L192 874.666667h640a64 64 0 0 0 63.893333-60.245334L896 810.666667V320a64 64 0 0 0-60.245333-63.893333L832 256h-145.813333l-45.717334-106.666667zM512 341.333333c117.824 0 213.333333 95.509333 213.333333 213.333334s-95.509333 213.333333-213.333333 213.333333-213.333333-95.509333-213.333333-213.333333 95.509333-213.333333 213.333333-213.333334z m0 64a149.333333 149.333333 0 1 0 0 298.666667 149.333333 149.333333 0 0 0 0-298.666667z m288-85.333333a32 32 0 1 1 0 64 32 32 0 0 1 0-64z"          p-id="19341"></path></symbol>',
  pieChart1: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pieChart1"  t="1623251347989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4098"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667zM106.666667 512c0 223.850667 181.482667 405.333333 405.333333 405.333333 100.416 0 192.298667-36.522667 263.104-96.981333L491.2 536.448a74.666667 74.666667 0 0 1-21.717333-48.234667L469.333333 483.669333V108.885333C265.514667 130.218667 106.666667 302.549333 106.666667 512z m810.112 21.333333H578.581333l241.770667 241.770667A403.584 403.584 0 0 0 916.778667 533.333333zM533.333333 107.221333V469.333333h381.802667C894.528 272.512 733.034667 117.546667 533.333333 107.242667z"          p-id="4099"></path></symbol>',
  pieChart2: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="pieChart2"  t="1623251350293" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4236"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M503.338667 42.773333a8.533333 8.533333 0 0 1 8.469333 6.698667l0.192 1.856V418.133333a93.866667 93.866667 0 0 0 93.866667 93.866667h366.805333c4.714667 0 8.533333 3.84 8.533333 8.533333v0.149334c-0.106667 5.674667-0.213333 10.176-0.384 13.504C969.237333 783.104 763.776 981.333333 512 981.333333 252.8 981.333333 42.666667 771.2 42.666667 512 42.666667 260.373333 240.682667 54.997333 489.386667 43.2l12.096-0.384 1.856-0.042667zM441.6 119.253333l-6.144 1.130667C251.434667 156.117333 113.066667 318.250667 113.066667 512c0 220.330667 178.602667 398.933333 398.933333 398.933333 193.984 0 355.626667-138.453333 391.509333-321.92l1.216-6.613333H605.866667a164.266667 164.266667 0 0 1-164.181334-159.061333L441.6 418.133333V119.253333z m149.333333-69.76h0.725334l9.130666 1.621334c2.56 0.469333 4.821333 0.896 6.826667 1.301333l2.858667 0.597333c182.229333 38.912 325.269333 183.594667 361.792 366.698667l2.154666 11.925333a8.533333 8.533333 0 0 1-6.954666 9.834667l-1.450667 0.128H629.333333a46.933333 46.933333 0 0 1-46.805333-43.584l-0.128-3.370667V58.026667a8.533333 8.533333 0 0 1 8.533333-8.533334z m62.144 93.802667a4.266667 4.266667 0 0 0-0.298666 1.557333v222.058667c0 2.346667 1.92 4.266667 4.266666 4.266667h222.08a4.266667 4.266667 0 0 0 3.968-5.824A400.512 400.512 0 0 0 658.602667 140.885333a4.266667 4.266667 0 0 0-5.546667 2.410667z"          p-id="4237"></path></symbol>',
  play: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="play"  t="1623251613654" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18654" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M213.333333 65.386667a85.333333 85.333333 0 0 1 43.904 12.16L859.370667 438.826667a85.333333 85.333333 0 0 1 0 146.346666L257.237333 946.453333A85.333333 85.333333 0 0 1 128 873.28V150.72a85.333333 85.333333 0 0 1 85.333333-85.333333z m0 64a21.333333 21.333333 0 0 0-21.184 18.837333L192 150.72v722.56a21.333333 21.333333 0 0 0 30.101333 19.456l2.197334-1.152L826.453333 530.282667a21.333333 21.333333 0 0 0 2.048-35.178667l-2.048-1.386667L224.298667 132.416A21.333333 21.333333 0 0 0 213.333333 129.386667z"          p-id="18655"></path></symbol>',
  query: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="query"  t="1623251358742" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4788"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m10.666667 586.666666a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334zM512 277.333333a149.333333 149.333333 0 0 1 42.688 292.48L554.666667 652.8a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-132.266667c0-4.693333 3.84-8.533333 8.533333-8.533333H533.333333c37.013333-9.322667 64-45.44 64-85.333333a85.333333 85.333333 0 0 0-168.96-17.024c-0.469333 2.282667-0.853333 5.354667-1.194666 9.216a8.533333 8.533333 0 0 1-8.490667 7.808h-47.082667a8.533333 8.533333 0 0 1-8.533333-9.024 153.6 153.6 0 0 1 1.088-12.224A149.376 149.376 0 0 1 512 277.333333z"          p-id="4789"></path></symbol>',
  redPacket: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="redPacket"  t="1623251593967" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="17425" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 42.666667a128 128 0 0 1 128 128v682.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V170.666667a128 128 0 0 1 128-128h554.666666z m0 64H234.666667a64 64 0 0 0-63.893334 60.245333L170.666667 170.666667v682.666666a64 64 0 0 0 60.245333 63.893334L234.666667 917.333333h554.666666a64 64 0 0 0 63.893334-60.245333L853.333333 853.333333V170.666667a64 64 0 0 0-60.245333-63.893334L789.333333 106.666667z"          p-id="17426"></path>    <path d="M512 405.333333c158.08 0 301.269333-63.658667 405.333333-166.762666v86.058666A637.354667 637.354667 0 0 1 512 469.333333a637.354667 637.354667 0 0 1-405.376-144.725333v-86.08A574.165333 574.165333 0 0 0 512 405.333333z"          p-id="17427"></path></symbol>',
  refresh: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="refresh"  t="1623251585854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16875" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M866.133333 85.333333c4.693333 0 8.533333 3.84 8.533334 8.533334v194.133333a32 32 0 0 1-28.928 31.850667L842.666667 320h-194.133334a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h120.341334A361.536 361.536 0 0 0 512 149.333333C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667c185.813333 0 339.008-139.776 360.170667-319.914667 0.384-3.328 0.810667-7.829333 1.28-13.546667a8.533333 8.533333 0 0 1 8.512-7.850666h47.061333a8.533333 8.533333 0 0 1 8.533333 9.109333c-0.426667 5.696-0.789333 10.218667-1.130666 13.589333C914.346667 770.986667 732.778667 938.666667 512 938.666667 276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333c116.288 0 221.717333 46.506667 298.666667 121.984V93.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333z"          p-id="16876"></path></symbol>',
  right: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="right"  t="1623251380193" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5888"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M353.045333 86.826667L754.56 488.362667a32 32 0 0 1 2.090667 42.965333l-2.090667 2.282667L353.066667 935.168a8.533333 8.533333 0 0 1-6.037334 2.496h-66.368a8.533333 8.533333 0 0 1-6.037333-14.570667L686.72 511.018667 274.602667 98.901333a8.533333 8.533333 0 0 1 6.037333-14.570666h66.346667a8.533333 8.533333 0 0 1 6.058666 2.496z"          p-id="5889"></path></symbol>',
  scan: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="scan"  t="1623251404445" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7388"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M128 669.866667v154.133333a72 72 0 0 0 67.776 71.893333l4.224 0.106667H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H205.482667A141.482667 141.482667 0 0 1 64 818.517333V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m832 0v148.650666A141.482667 141.482667 0 0 1 818.517333 960H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533334-8.533333h154.133333a72 72 0 0 0 71.893333-67.776l0.106667-4.224V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m0-170.666667v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h878.933334c4.693333 0 8.533333 3.84 8.533333 8.533333z m-597.333333-426.666667v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H200a72 72 0 0 0-71.893333 67.776L128 200V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334V205.482667A141.482667 141.482667 0 0 1 205.482667 64H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333zM818.517333 64A141.482667 141.482667 0 0 1 960 205.482667V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V200a72 72 0 0 0-67.776-71.893333L824 128H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333h148.650666z"          p-id="7389"></path></symbol>',
  search: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="search"  t="1623251568821" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="15775" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M743.232 210.837333c144.896 144.896 149.781333 376.789333 14.656 527.573334l160.32 160.298666a8.533333 8.533333 0 0 1 0 12.074667l-33.173333 33.173333a8.533333 8.533333 0 0 1-12.074667 0l-161.557333-161.557333c-150.762667 120.746667-371.477333 111.253333-511.232-28.501333-149.973333-149.973333-149.973333-393.109333 0-543.061334 149.973333-149.973333 393.088-149.973333 543.061333 0z m-497.813333 45.248c-124.970667 124.970667-124.970667 327.594667 0 452.565334 124.970667 124.949333 327.594667 124.949333 452.565333 0 124.949333-124.970667 124.949333-327.594667 0-452.565334-124.970667-124.970667-327.594667-124.970667-452.565333 0z"          p-id="15776"></path></symbol>',
  select: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="select"  t="1623251394246" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6840"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M908.245333 213.952h65.706667a8.533333 8.533333 0 0 1 6.037333 14.570667L445.226667 763.306667a31.786667 31.786667 0 0 1-42.517334 2.176l-2.773333-2.56-343.04-343.04a8.533333 8.533333 0 0 1 6.037333-14.570667H130.133333a8.533333 8.533333 0 0 1 6.037334 2.496l287.338666 287.36 478.698667-478.72a8.533333 8.533333 0 0 1 6.037333-2.496z"          p-id="6841"></path></symbol>',
  send: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="send"  t="1623251558326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="15088" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M555.392 64a8.533333 8.533333 0 0 1 6.037333 14.570667l-46.933333 46.933333a8.533333 8.533333 0 0 1-6.058667 2.496H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V515.541333a8.533333 8.533333 0 0 1 2.496-6.037333l46.933333-46.933333a8.533333 8.533333 0 0 1 14.570667 6.037333V789.333333a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h320.725333zM928 64A32 32 0 0 1 960 96v241.792a8.533333 8.533333 0 0 1-2.496 6.037333l-46.933333 46.933334a8.533333 8.533333 0 0 1-14.570667-6.037334V162.581333L547.2 511.381333a8.533333 8.533333 0 0 1-12.074667 0l-33.173333-33.194666a8.533333 8.533333 0 0 1 0-12.074667L840.064 128h-200.789333a8.533333 8.533333 0 0 1-6.037334-14.570667l46.933334-46.933333A8.533333 8.533333 0 0 1 686.208 64H928z"          p-id="15089"></path></symbol>',
  shop: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="shop"  t="1623251611769" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18518" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M938.666667 832a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h597.333334a128 128 0 0 1 128 128v640z m-64-64H149.333333v64a64 64 0 0 0 60.245334 63.893333L213.333333 896h597.333334a64 64 0 0 0 63.893333-60.245333L874.666667 832v-64zM810.666667 128H213.333333a64 64 0 0 0-63.893333 60.245333L149.333333 192v512h725.333334V192a64 64 0 0 0-60.245334-63.893333L810.666667 128z m-405.333334 93.866667V277.333333a106.666667 106.666667 0 0 0 102.037334 106.56L512 384a106.666667 106.666667 0 0 0 106.56-102.037333L618.666667 277.333333v-55.466666c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333c4.693333 0 8.533333 3.84 8.533334 8.533334V277.333333a170.666667 170.666667 0 1 1-341.333334 0v-55.466666c0-4.693333 3.84-8.533333 8.533334-8.533334h46.933333c4.693333 0 8.533333 3.84 8.533333 8.533334z"          p-id="18519"></path></symbol>',
  slice: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="slice"  t="1623251606404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18108" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M874.666667 64a85.333333 85.333333 0 0 1 85.333333 85.333333v192a85.333333 85.333333 0 0 1-85.333333 85.333334h-64v448a85.333333 85.333333 0 0 1-85.333334 85.333333H298.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V426.666667H149.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V149.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h725.333334z m-128 234.666667H277.333333v576a21.333333 21.333333 0 0 0 18.837334 21.184L298.666667 896h426.666666a21.333333 21.333333 0 0 0 21.184-18.837333L746.666667 874.666667V298.666667z m-153.216 108.8l33.194666 33.194666a8.533333 8.533333 0 0 1 0 12.074667L567.36 512H642.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333h-98.133333v42.666667h98.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334h-98.133333v98.133333a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533333V682.666667h-98.133333a8.533333 8.533333 0 0 1-8.533334-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533333h98.133333v-42.666667h-98.133333a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533334-8.533333h74.752l-59.264-59.264a8.533333 8.533333 0 0 1 0-12.074667l33.194666-33.173333a8.533333 8.533333 0 0 1 12.053334 0L512 476.864l69.418667-69.376a8.533333 8.533333 0 0 1 12.053333 0zM874.666667 128H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 149.333333v192a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 362.666667h64v-106.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h554.666666a21.333333 21.333333 0 0 1 21.333334 21.333333v106.666667h64a21.333333 21.333333 0 0 0 21.184-18.837334L896 341.333333V149.333333a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 128z"          p-id="18109"></path></symbol>',
  smile: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="smile"  t="1623251372049" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5340"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m187.733333 469.077333c2.368 0 4.266667 1.92 4.266667 4.266667l0.021333 44.288v16.234666a8.533333 8.533333 0 0 1-4.778666 7.68c-2.922667 1.408-5.269333 2.56-7.04 3.370667A425.045333 425.045333 0 0 1 512 691.392a425.109333 425.109333 0 0 1-187.2-43.2 8.533333 8.533333 0 0 1-4.8-7.68V580.053333a4.266667 4.266667 0 0 1 6.442667-3.669333A361.002667 361.002667 0 0 0 512 627.413333a361.002667 361.002667 0 0 0 185.557333-51.029333 4.266667 4.266667 0 0 1 2.197334-0.618667zM362.666667 384a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m298.666666 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"          p-id="5341"></path></symbol>',
  success: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="success"  t="1623251325290" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3132"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m236.714667 256a8.533333 8.533333 0 0 1 6.037333 14.570666L495.616 636.373333c-5.461333 5.461333-12.416 8.533333-19.562667 9.237334l-3.050666 0.149333c-8.192 0-16.384-3.136-22.634667-9.386667l-152.448-152.469333a8.533333 8.533333 0 0 1 6.037333-14.570667h66.346667a8.533333 8.533333 0 0 1 6.016 2.496l96.661333 96.64 203.349334-203.306666a8.533333 8.533333 0 0 1 6.037333-2.496h66.346667z"          p-id="3133"></path></symbol>',
  systemPhonebook: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="systemPhonebook"  t="1623251304273" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2580"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M810.666667 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128v-21.333333H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H128v-192H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H128v-192H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333H128V192a128 128 0 0 1 128-128h554.666667z m0 64H256a64 64 0 0 0-63.893333 60.245333L192 192v640a64 64 0 0 0 60.245333 63.893333L256 896h554.666667a64 64 0 0 0 63.893333-60.245333L874.666667 832V192a64 64 0 0 0-60.245334-63.893333L810.666667 128z m-387.648 149.333333c23.552 0 44.586667 10.026667 60.650666 26.304l0.768 0.64 6.08 5.909334 16.362667 16.490666 26.794667 26.709334c16.341333 16.277333 26.752 36.821333 26.752 61.013333 0 24.170667-10.410667 44.714667-26.752 60.970667l-5.952 5.973333 4.544 5.866667c16.704 20.501333 33.728 37.013333 52.117333 50.517333l1.152 0.832 6.272-6.229333c14.933333-14.848 33.898667-24.597333 55.466667-25.92l5.056-0.149334c26.176 0 46.442667 11.477333 61.653333 27.776l49.002667 48.64c34.048 33.877333 34.816 82.517333 4.522666 117.12l-3.242666 3.52c-4.117333 4.373333-8.106667 8.32-13.376 13.354667l-5.013334 4.864a175.168 175.168 0 0 0-5.44 5.546667l-4.757333 5.333333C713.749333 755.968 685.205333 768 652.8 768h-2.005333l-6.421334-0.298667c-33.152-2.112-61.952-11.584-96.106666-27.776a472.469333 472.469333 0 0 1-157.525334-122.794666c-35.754667-42.816-60.586667-83.946667-77.12-128.384-11.669333-31.018667-16.661333-58.624-14.421333-86.570667a108.074667 108.074667 0 0 1 31.957333-68.010667l32.042667-31.872c16.085333-15.466667 36.842667-24.96 59.797333-24.96z m0 64c-5.205333 0-10.581333 2.432-15.466667 7.104l-31.232 31.104a44.117333 44.117333 0 0 0-13.354667 28.416c-1.344 16.789333 1.92 35.264 10.581334 58.24 13.930667 37.461333 35.029333 72.384 66.346666 109.930667a408.256 408.256 0 0 0 136.149334 106.133333c19.242667 9.109333 44.864 19.818667 72.405333 21.568l4.373333 0.170667c14.869333 0 26.368-4.842667 36.053334-15.210667 5.546667-6.613333 11.648-12.458667 17.536-18.133333l5.76-5.546667 5.418666-5.568c10.24-10.624 10.325333-21.482667 0.256-31.509333l-52.181333-51.84c-3.264-3.029333-7.872-5.930667-13.333333-5.930667-5.226667 0-10.517333 2.602667-15.381334 7.445334l-31.424 31.253333c-1.408 1.429333-5.781333 5.696-12.501333 5.696a17.621333 17.621333 0 0 1-8.149333-2.090667l-3.797334-2.218666a149.077333 149.077333 0 0 0-6.378666-3.306667l-3.669334-1.856a81.472 81.472 0 0 1-7.402666-4.16c-29.226667-18.474667-55.786667-42.453333-80.981334-73.386667-14.016-17.557333-23.018667-32.256-29.482666-47.722666l-0.725334-2.218667c-1.344-4.8-1.6-10.752 4.693334-17.002667l8.256-7.637333c5.141333-4.906667 10.133333-9.941333 15.338666-15.189333l7.808-7.850667c5.205333-5.184 7.893333-10.453333 7.893334-15.637333s-2.688-10.453333-7.893334-15.616l-25.024-24.917334-8.746666-8.853333-11.093334-11.114667-5.546666-5.269333c-4.778667-4.842667-9.984-7.274667-15.104-7.274667z"          p-id="2581"></path></symbol>',
  systemQRcode: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="systemQRcode"  t="1623251294899" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2442"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M384 554.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v234.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H149.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V640a85.333333 85.333333 0 0 1 85.333333-85.333333h234.666667z m226.133333 277.333333c4.693333 0 8.533333 3.84 8.533334 8.533333V896h183.466666c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H563.2a8.533333 8.533333 0 0 1-8.533333-8.533333v-110.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333z m341.333334 0c4.693333 0 8.533333 3.84 8.533333 8.533333v110.933334a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533333v-110.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933334zM384 618.666667H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 640v234.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 896h234.666667a21.333333 21.333333 0 0 0 21.184-18.837333L405.333333 874.666667V640a21.333333 21.333333 0 0 0-18.837333-21.184L384 618.666667z m418.133333 149.333333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333zM298.666667 704a21.333333 21.333333 0 0 1 21.333333 21.333333v64a21.333333 21.333333 0 0 1-21.333333 21.333334h-64a21.333333 21.333333 0 0 1-21.333334-21.333334v-64a21.333333 21.333333 0 0 1 21.333334-21.333333h64z m503.466666-149.333333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334H618.666667v64h119.466666c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334h-174.933333a8.533333 8.533333 0 0 1-8.533333-8.533334v-174.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h238.933333z m149.333334 128c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334h-132.266667a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h132.266667z m0-128c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933334zM384 64a85.333333 85.333333 0 0 1 85.333333 85.333333v234.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H149.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V149.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h234.666667z m490.666667 0a85.333333 85.333333 0 0 1 85.333333 85.333333v234.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H640a85.333333 85.333333 0 0 1-85.333333-85.333333V149.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h234.666667zM384 128H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 149.333333v234.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 405.333333h234.666667a21.333333 21.333333 0 0 0 21.184-18.837333L405.333333 384V149.333333a21.333333 21.333333 0 0 0-18.837333-21.184L384 128z m490.666667 0H640a21.333333 21.333333 0 0 0-21.184 18.837333L618.666667 149.333333v234.666667a21.333333 21.333333 0 0 0 18.837333 21.184L640 405.333333h234.666667a21.333333 21.333333 0 0 0 21.184-18.837333L896 384V149.333333a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 128z m-576 85.333333a21.333333 21.333333 0 0 1 21.333333 21.333334v64a21.333333 21.333333 0 0 1-21.333333 21.333333h-64a21.333333 21.333333 0 0 1-21.333334-21.333333v-64a21.333333 21.333333 0 0 1 21.333334-21.333334h64z m490.666666 0a21.333333 21.333333 0 0 1 21.333334 21.333334v64a21.333333 21.333333 0 0 1-21.333334 21.333333h-64a21.333333 21.333333 0 0 1-21.333333-21.333333v-64a21.333333 21.333333 0 0 1 21.333333-21.333334h64z"          p-id="2443"></path></symbol>',
  target: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="target"  t="1623251596201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="17562" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M841.28 64a42.666667 42.666667 0 0 1 41.386667 53.077333L815.552 384l67.114667 266.922667A42.666667 42.666667 0 0 1 841.28 704H192v247.466667a8.533333 8.533333 0 0 1-8.533333 8.533333H136.533333a8.533333 8.533333 0 0 1-8.533333-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h704.746667z m-27.370667 64H192v512h621.909333l-64.362666-256 64.362666-256z"          p-id="17563"></path></symbol>',
  textDeletion: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="textDeletion"  t="1623251587361" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="17013" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M832 128a128 128 0 0 1 128 128v512a128 128 0 0 1-128 128H356.416a170.666667 170.666667 0 0 1-149.184-87.786667l-118.528-213.333333a170.666667 170.666667 0 0 1 0-165.76l118.528-213.333333A170.666667 170.666667 0 0 1 356.416 128H832z m0 64H356.416a106.666667 106.666667 0 0 0-90.688 50.517333l-2.56 4.352-118.506667 213.333334a106.666667 106.666667 0 0 0-2.56 98.709333l2.56 4.906667 118.506667 213.333333a106.666667 106.666667 0 0 0 88.213333 54.72l5.034667 0.128H832a64 64 0 0 0 63.893333-60.245333L896 768V256a64 64 0 0 0-60.245333-63.893333L832 192z m-356.309333 192a8.533333 8.533333 0 0 1 6.037333 2.496l82.026667 82.026667 82.026666-82.026667a8.533333 8.533333 0 0 1 6.037334-2.496h66.368a8.533333 8.533333 0 0 1 6.037333 14.570667l-115.221333 115.2 111.68 111.658666a8.533333 8.533333 0 0 1-6.037334 14.570667h-66.389333a8.533333 8.533333 0 0 1-6.037333-2.496l-78.464-78.464-78.485334 78.464a8.533333 8.533333 0 0 1-6.037333 2.496h-66.346667a8.533333 8.533333 0 0 1-6.016-14.570667l111.616-111.658666-115.2-115.2a8.533333 8.533333 0 0 1 6.058667-14.570667h66.346667z"          p-id="17014"></path></symbol>',
  text: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="text"  t="1623251579827" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="16461" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M668.650667 64a85.333333 85.333333 0 0 1 60.352 25.002667l163.328 163.328A85.333333 85.333333 0 0 1 917.333333 312.682667V832a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h433.984zM618.666667 128H234.666667a64 64 0 0 0-63.893334 60.245333L170.666667 192v640a64 64 0 0 0 60.245333 63.893333L234.666667 896h554.666666a64 64 0 0 0 63.893334-60.245333L853.333333 832V362.666667h-170.666666a64 64 0 0 1-64-64V128z m140.8 405.333333c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H264.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h494.933334z m-256-128c4.693333 0 8.533333 3.84 8.533333 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533333 8.533333H264.533333a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h238.933334zM682.666667 133.312V298.666667h165.354666l-0.938666-1.066667-163.349334-163.349333-1.066666-0.938667z"          p-id="16462"></path></symbol>',
  trash: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="trash"  t="1623251570681" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="15913" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M640 64a64 64 0 0 1 64 64v85.333333h226.133333c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H874.666667v554.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V277.333333H93.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533334-8.533334H320V128a64 64 0 0 1 64-64h256z m170.666667 213.333333H213.333333v554.666667a64 64 0 0 0 60.245334 63.893333L277.333333 896h469.333334a64 64 0 0 0 63.893333-60.245333L810.666667 832V277.333333z m-392.533334 128c4.693333 0 8.533333 3.84 8.533334 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533334 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533334V413.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333z m234.666667 0c4.693333 0 8.533333 3.84 8.533333 8.533334v324.266666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533334V413.866667c0-4.693333 3.84-8.533333 8.533334-8.533334h46.933333zM640 128H384v85.333333h256V128z"          p-id="15914"></path></symbol>',
  travel: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="travel"  t="1623251410298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7662"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M128 669.866667v154.133333a72 72 0 0 0 67.776 71.893333l4.224 0.106667H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H205.482667A141.482667 141.482667 0 0 1 64 818.517333V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m832 0v148.650666A141.482667 141.482667 0 0 1 818.517333 960H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333v-46.933334c0-4.693333 3.84-8.533333 8.533334-8.533333h154.133333a72 72 0 0 0 71.893333-67.776l0.106667-4.224V669.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933334c4.693333 0 8.533333 3.84 8.533333 8.533334z m-597.333333-597.333334v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H200a72 72 0 0 0-71.893333 67.776L128 200V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334H72.533333a8.533333 8.533333 0 0 1-8.533333-8.533334V205.482667A141.482667 141.482667 0 0 1 205.482667 64H354.133333c4.693333 0 8.533333 3.84 8.533334 8.533333zM818.517333 64A141.482667 141.482667 0 0 1 960 205.482667V354.133333a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V200a72 72 0 0 0-67.776-71.893333L824 128H669.866667a8.533333 8.533333 0 0 1-8.533334-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333h148.650666z"          p-id="7663"></path>    <path d="M551.146667 780.629333a14.506667 14.506667 0 0 1-27.093334-1.28l-39.978666-125.781333a85.333333 85.333333 0 0 1 11.648-75.136l103.104-145.770667-160.213334 93.589334a85.333333 85.333333 0 0 1-71.744 6.677333l-122.709333-43.861333a14.464 14.464 0 0 1-0.597333-26.901334l447.808-186.666666a42.666667 42.666667 0 0 1 55.530666 56.448l-195.754666 448.682666z"          p-id="7664"></path></symbol>',
  type: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="type"  t="1623251556417" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="14952" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M149.333333 736a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m748.8 10.666667c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533334H275.2a8.533333 8.533333 0 0 1-8.533333-8.533334v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533333h622.933333zM149.333333 458.666667a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m748.8 10.666666c4.693333 0 8.533333 3.84 8.533334 8.533334v46.933333a8.533333 8.533333 0 0 1-8.533334 8.533333H275.2a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h622.933333zM149.333333 181.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m748.8 10.666667c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H275.2a8.533333 8.533333 0 0 1-8.533333-8.533333V200.533333c0-4.693333 3.84-8.533333 8.533333-8.533333h622.933333z"          p-id="14953"></path></symbol>',
  under: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="under"  t="1623251388381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6432"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M87.829333 352.021333L489.386667 753.578667a32 32 0 0 0 42.986666 2.069333l2.282667-2.069333 401.536-401.557334a8.533333 8.533333 0 0 0 2.496-6.037333v-66.346667a8.533333 8.533333 0 0 0-14.570667-6.037333L512.021333 685.674667 99.904 273.6a8.533333 8.533333 0 0 0-14.570667 6.037333v66.346667a8.533333 8.533333 0 0 0 2.496 6.037333z"          p-id="6433"></path></symbol>',
  up: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="up"  t="1623251390396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6568"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M936.170667 669.952L534.613333 268.394667a32 32 0 0 0-42.986666-2.069334l-2.282667 2.069334L87.829333 669.952a8.533333 8.533333 0 0 0-2.496 6.037333v66.346667a8.533333 8.533333 0 0 0 14.570667 6.058667l412.074667-412.096 412.117333 412.096a8.533333 8.533333 0 0 0 14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 0-2.496-6.058667z"          p-id="6569"></path></symbol>',
  up2: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="up2"  t="1623251337729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3684"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m1.258667 254.506666c4.202667 0.256 8.32 1.749333 11.818666 4.458667l2.005334 1.770667 153.088 153.088a8.533333 8.533333 0 0 1 2.496 6.016v66.368a8.533333 8.533333 0 0 1-14.570667 6.037333L512 442.837333l-156.074667 156.074667A8.533333 8.533333 0 0 1 341.333333 592.853333v-66.389333a8.533333 8.533333 0 0 1 2.496-6.016l153.088-153.066667a21.248 21.248 0 0 1 13.824-6.208h2.517334z"          p-id="3685"></path></symbol>',
  upload: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="upload"  t="1623251534092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="13990" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M311.466667 64c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533333 8.533333H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h554.666666a106.666667 106.666667 0 0 0 106.56-102.037333L896 789.333333V234.666667a106.666667 106.666667 0 0 0-102.037333-106.56L789.333333 128h-55.466666a8.533333 8.533333 0 0 1-8.533334-8.533333V72.533333c0-4.693333 3.84-8.533333 8.533334-8.533333H789.333333a170.666667 170.666667 0 0 1 170.666667 170.666667v554.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h76.8z m212.138666 0l2.517334 0.298667c4.138667 0.746667 8.106667 2.709333 11.306666 5.909333l185.386667 185.386667a8.533333 8.533333 0 0 1 2.517333 6.058666v66.368a8.533333 8.533333 0 0 1-14.570666 6.037334L554.666667 177.962667V632.96a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V177.322667l-156.096 156.096a8.533333 8.533333 0 0 1-14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 1 2.496-6.037334l184.768-184.789333A21.248 21.248 0 0 1 521.088 64h2.517333z"          p-id="13991"></path></symbol>',
  voiceClose: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="voiceClose"  t="1623251445983" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8896"     xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M227.541333 533.354667a8.533333 8.533333 0 0 1 8.448 7.36 320 320 0 0 0 2.282667 14.570666C263.530667 688.554667 380.608 789.333333 521.237333 789.333333c78.762667 0 150.144-31.616 202.133334-82.858666l45.269333 45.248a350.869333 350.869333 0 0 1-215.424 100.181333V951.466667a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533333v-99.562667c-161.514667-14.570667-291.562667-138.24-315.904-296.746667a355.477333 355.477333 0 0 1-1.6-12.288 8.533333 8.533333 0 0 1 7.488-9.450666l0.512-0.042667h47.829333z m91.008-231.722667l64 64V501.333333a138.666667 138.666667 0 0 0 235.221334 99.52l45.269333 45.269334A202.666667 202.666667 0 0 1 318.570667 501.333333l-0.021334-199.701333z m543.722667 231.722667a8.533333 8.533333 0 0 1 8.469333 9.514666c-0.597333 5.162667-1.130667 9.301333-1.621333 12.394667a350.037333 350.037333 0 0 1-59.093333 147.349333l-46.122667-46.122666A286.293333 286.293333 0 0 0 804.309333 554.666667c0.64-3.392 1.344-8.021333 2.176-13.952a8.533333 8.533333 0 0 1 8.448-7.36h47.338667zM521.237333 64a202.666667 202.666667 0 0 1 202.666667 202.666667v234.666666a201.813333 201.813333 0 0 1-22.4 92.714667l-48.725333-48.704a138.282667 138.282667 0 0 0 7.04-39.04l0.085333-4.970667v-234.666666a138.666667 138.666667 0 0 0-277.248-4.970667l-0.085333 4.970667-0.021334 8.448-57.92-57.898667C346.709333 129.194667 426.346667 64 521.237333 64z"          p-id="8897"></path>    <path d="M199.637333 173.162667l708.266667 708.266666a8.533333 8.533333 0 0 1-6.037333 14.549334h-66.346667a8.533333 8.533333 0 0 1-6.037333-2.496l-708.266667-708.266667A8.533333 8.533333 0 0 1 127.296 170.666667h66.346667a8.533333 8.533333 0 0 1 6.016 2.496z"          p-id="8898"></path></symbol>',
  voice: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="voice"  t="1623251430978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8207"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M207.637333 533.354667a8.533333 8.533333 0 0 1 8.448 7.36 320 320 0 0 0 2.282667 14.570666C243.626667 688.554667 360.746667 789.333333 501.333333 789.333333c140.842667 0 258.069333-101.098667 283.072-234.666666 0.64-3.392 1.365333-8.021333 2.176-13.952a8.533333 8.533333 0 0 1 8.448-7.36h47.338667a8.533333 8.533333 0 0 1 8.469333 9.514666c-0.597333 5.162667-1.130667 9.301333-1.6 12.394667C824.853333 713.728 694.826667 837.354667 533.333333 851.904V951.466667a8.533333 8.533333 0 0 1-8.533333 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533334-8.533333l-0.021333-99.562667c-161.493333-14.570667-291.562667-138.24-315.882667-296.746667a355.477333 355.477333 0 0 1-1.6-12.288 8.533333 8.533333 0 0 1 7.466667-9.450666l0.512-0.042667h47.829333zM501.333333 64a202.666667 202.666667 0 0 1 202.666667 202.666667v234.666666a202.666667 202.666667 0 0 1-405.333333 0v-234.666666A202.666667 202.666667 0 0 1 501.333333 64z m0 64a138.666667 138.666667 0 0 0-138.581333 133.696L362.666667 266.666667v234.666666a138.666667 138.666667 0 0 0 277.248 4.970667L640 501.333333v-234.666666A138.666667 138.666667 0 0 0 501.333333 128z"          p-id="8208"></path></symbol>',
  volumeClose: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="volumeClose"  t="1623251467768" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="10275" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M150.933333 170.666667a8.533333 8.533333 0 0 1 6.037334 2.496l708.266666 708.266666a8.533333 8.533333 0 0 1-6.037333 14.549334h-66.346667a8.533333 8.533333 0 0 1-6.037333-2.496l-189.504-189.504 0.021333 93.610666a85.333333 85.333333 0 0 1-129.237333 73.173334l-171.242667-102.784L192 768a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 50.218666-77.802666l-78.314666-78.293334A8.533333 8.533333 0 0 1 84.608 170.666667h66.346667zM213.333333 320H192a21.333333 21.333333 0 0 0-21.184 18.837333L170.666667 341.333333v341.333334a21.333333 21.333333 0 0 0 18.837333 21.184L192 704h122.581333l186.453334 111.872a21.333333 21.333333 0 0 0 32.149333-15.786667l0.149333-2.496-0.021333-157.610666-320-320z m614.698667-108.906667l0.042667 0.085334a722.773333 722.773333 0 0 1 69.653333 310.442666 723.626667 723.626667 0 0 1-47.701333 259.242667l-50.069334-50.069333a660.650667 660.650667 0 0 0 33.770667-209.173334 658.986667 658.986667 0 0 0-63.296-282.602666 8.533333 8.533333 0 0 1 3.968-11.306667l14.293333-6.976 16.213334-7.872 11.712-5.717333a8.533333 8.533333 0 0 1 11.413333 3.946666z m-115.114667 56.042667l0.042667 0.085333a595.221333 595.221333 0 0 1 56.746667 254.4c0 54.634667-7.317333 107.562667-21.056 157.845334L695.466667 626.261333a535.893333 535.893333 0 0 0 10.24-104.64 531.541333 531.541333 0 0 0-50.432-226.581333 8.533333 8.533333 0 0 1 3.989333-11.306667c3.072-1.493333 5.546667-2.709333 7.509333-3.626666l27.349334-13.333334 7.381333-3.584a8.533333 8.533333 0 0 1 11.413333 3.946667zM585.173333 180.437333a85.333333 85.333333 0 0 1 12.16 43.904l-0.021333 303.786667-64-63.957333L533.333333 224.341333a21.333333 21.333333 0 0 0-1.706666-8.405333l-1.344-2.56a21.333333 21.333333 0 0 0-27.050667-8.490667l-2.218667 1.173334-141.141333 84.650666-46.656-46.634666 154.88-92.906667a85.333333 85.333333 0 0 1 117.077333 29.269333z"          p-id="10276"></path></symbol>',
  volume: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="volume"  t="1623251456745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9585"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M585.173333 180.437333a85.333333 85.333333 0 0 1 12.16 43.904v573.226667a85.333333 85.333333 0 0 1-129.237333 73.173333L296.853333 768 192 768a85.333333 85.333333 0 0 1-85.333333-85.333333V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h101.376l174.72-104.832a85.333333 85.333333 0 0 1 117.077333 29.269333z m242.858667 30.656l0.042667 0.085334a722.773333 722.773333 0 0 1 69.653333 310.442666 722.773333 722.773333 0 0 1-69.653333 310.464 8.533333 8.533333 0 0 1-11.456 4.010667 31057561.877333 31057561.877333 0 0 1-27.818667-13.525333l-14.4-7.04a8.533333 8.533333 0 0 1-3.989333-11.306667 659.072 659.072 0 0 0 63.317333-282.602667 658.986667 658.986667 0 0 0-63.296-282.602666 8.533333 8.533333 0 0 1 3.968-11.306667l14.293333-6.976 16.213334-7.872 11.712-5.717333a8.533333 8.533333 0 0 1 11.413333 3.946666z m-324.8-6.186666l-2.218667 1.152-189.909333 113.92L192 320a21.333333 21.333333 0 0 0-21.184 18.837333L170.666667 341.333333v341.333334a21.333333 21.333333 0 0 0 18.837333 21.184L192 704h122.581333l186.453334 111.872a21.333333 21.333333 0 0 0 32.149333-15.786667l0.149333-2.496v-573.226666a21.333333 21.333333 0 0 0-1.706666-8.426667l-1.344-2.56a21.333333 21.333333 0 0 0-27.050667-8.490667z m209.685333 62.229333l0.042667 0.085333a595.221333 595.221333 0 0 1 56.746667 254.4c0 84.16-17.386667 164.245333-48.789334 236.864-1.856 4.266667-4.501333 10.112-7.978666 17.493334a8.533333 8.533333 0 0 1-11.456 4.053333l-14.890667-7.253333-16.576-8.064-10.752-5.226667a8.533333 8.533333 0 0 1-3.989333-11.285333c3.477333-7.466667 6.144-13.354667 7.978666-17.685334a531.626667 531.626667 0 0 0 42.453334-208.896 531.541333 531.541333 0 0 0-50.432-226.581333 8.533333 8.533333 0 0 1 3.989333-11.306667c3.072-1.493333 5.546667-2.709333 7.509333-3.626666l27.349334-13.333334 7.381333-3.584a8.533333 8.533333 0 0 1 11.413333 3.946667z"          p-id="9586"></path></symbol>',
  wallet: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="wallet"  t="1623251620667" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="19068" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M787.584 164.138667a85.333333 85.333333 0 0 1 1.493333 15.936v13.653333A128.042667 128.042667 0 0 1 896 320v88.021333c36.821333 9.493333 64 42.88 64 82.645334v149.333333a85.376 85.376 0 0 1-64 82.645333V810.666667a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V320a128 128 0 0 1 127.744-128v-1.429333L687.829333 96.213333a85.333333 85.333333 0 0 1 99.776 67.904zM768 256H192a64 64 0 0 0-63.893333 60.245333L128 320v490.666667a64 64 0 0 0 60.245333 63.893333L192 874.666667h576a64 64 0 0 0 63.893333-60.245334L832 810.666667v-85.333334h-181.333333a160 160 0 0 1 0-320H832v-85.333333a64 64 0 0 0-60.245333-63.893333L768 256z m106.666667 213.333333H650.666667a96 96 0 0 0-4.522667 191.893334L650.666667 661.333333H874.666667a21.333333 21.333333 0 0 0 21.184-18.837333L896 640v-149.333333a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 469.333333z m-224 64a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m51.584-374.549333l-2.474667 0.341333-172.949333 32.853334h198.229333v-12.906667l-0.341333-2.986667a21.333333 21.333333 0 0 0-22.464-17.28z"          p-id="19069"></path></symbol>',
  warning: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="warning"  t="1623251328148" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3270"     xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m10.666667 522.666666a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334zM546.133333 277.333333c4.693333 0 8.533333 3.84 8.533334 8.533334v281.6a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333V285.866667c0-4.693333 3.84-8.533333 8.533333-8.533334h46.933333z"          p-id="3271"></path></symbol>',
  zoomOut: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="zoomOut"  t="1623251609908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18380" xmlns:xlink="http://www.w3.org/1999/xlink"  >    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 64a170.666667 170.666667 0 0 1 170.581334 165.333333L960 234.666667v311.466666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V234.666667l-0.106667-4.629334a106.666667 106.666667 0 0 0-101.802666-101.930666L789.333333 128H234.666667l-4.629334 0.106667a106.666667 106.666667 0 0 0-101.930666 101.802666L128 234.666667v554.666666l0.106667 4.629334a106.666667 106.666667 0 0 0 101.802666 101.930666L234.666667 896h311.466666c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H234.666667a170.666667 170.666667 0 0 1-170.581334-165.333333L64 789.333333V234.666667a170.666667 170.666667 0 0 1 165.333333-170.581334L234.666667 64h554.666666z m85.333334 554.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v170.666667a85.333333 85.333333 0 0 1-85.333333 85.333333h-170.666667a85.333333 85.333333 0 0 1-85.333333-85.333333v-170.666667a85.333333 85.333333 0 0 1 85.333333-85.333333z m0 64h-170.666667l-2.496 0.149333A21.333333 21.333333 0 0 0 682.666667 704v170.666667l0.149333 2.496A21.333333 21.333333 0 0 0 704 896h170.666667l2.496-0.149333A21.333333 21.333333 0 0 0 896 874.666667v-170.666667l-0.149333-2.496A21.333333 21.333333 0 0 0 874.666667 682.666667zM240.149333 194.901333L469.333333 424.064V264.533333c0-4.693333 3.84-8.533333 8.533334-8.533333h46.933333c4.693333 0 8.533333 3.84 8.533333 8.533333V469.333333a64 64 0 0 1-60.245333 63.893334L469.333333 533.333333h-204.8a8.533333 8.533333 0 0 1-8.533333-8.533333v-46.933333c0-4.693333 3.84-8.533333 8.533333-8.533334h159.530667L194.901333 240.149333l45.248-45.248z"          p-id="18381"></path></symbol>',
  zoom: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><symbol id="zoom"  t="1623251608192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"     p-id="18244" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 200 200">    <defs>        <style type="text/css"></style>    </defs>    <path d="M789.333333 64a170.666667 170.666667 0 0 1 170.666667 170.666667v311.466666a8.533333 8.533333 0 0 1-8.533333 8.533334h-46.933334a8.533333 8.533333 0 0 1-8.533333-8.533334V234.666667a106.666667 106.666667 0 0 0-102.037333-106.56L789.333333 128H234.666667a106.666667 106.666667 0 0 0-106.56 102.037333L128 234.666667v554.666666a106.666667 106.666667 0 0 0 102.037333 106.56L234.666667 896h311.466666c4.693333 0 8.533333 3.84 8.533334 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533334 8.533333H234.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V234.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h554.666666z m85.333334 554.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v170.666667a85.333333 85.333333 0 0 1-85.333333 85.333333h-170.666667a85.333333 85.333333 0 0 1-85.333333-85.333333v-170.666667a85.333333 85.333333 0 0 1 85.333333-85.333333h170.666667z m0 64h-170.666667a21.333333 21.333333 0 0 0-21.184 18.837333L682.666667 704v170.666667a21.333333 21.333333 0 0 0 18.837333 21.184L704 896h170.666667a21.333333 21.333333 0 0 0 21.184-18.837333L896 874.666667v-170.666667a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 682.666667zM460.8 192c4.693333 0 8.533333 3.84 8.533333 8.533333v46.933334a8.533333 8.533333 0 0 1-8.533333 8.533333h-159.530667l229.162667 229.184-45.248 45.248L256 301.269333V460.8a8.533333 8.533333 0 0 1-8.533333 8.533333H200.533333a8.533333 8.533333 0 0 1-8.533333-8.533333V256a64 64 0 0 1 60.245333-63.893333L256 192h204.8z"          p-id="18245"></path></symbol>'
};
class SvgDom {
  constructor(isAll = true) {
    this.isAllLoad = true;
    this.svgElm = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgElm.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.svgElm.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.svgElm.style.position = "absolute";
    this.svgElm.style.width = "0";
    this.svgElm.style.height = "0";
    if (isAll) {
      this.isAllLoad = isAll;
      this.loadAllIconXML();
    }
  }
  loadIconXML(name) {
    if (this.isAllLoad)
      return;
    this.svgElm.innerHTML = this.svgElm.innerHTML + svgDict[name];
    this.appendToBody();
  }
  loadAllIconXML() {
    Object.keys(svgDict).forEach((key) => {
      this.svgElm.innerHTML = this.svgElm.innerHTML + svgDict[key];
    });
    this.appendToBody();
  }
  appendToBody() {
    document.body.insertBefore(this.svgElm, document.body.firstElementChild);
  }
}
const initIcon = () => {
  new SvgDom();
};
initIcon();
BeIcon$1.install = (app) => {
  app.component(BeIcon$1.name, BeIcon$1);
};
const BeIcon = BeIcon$1;
BeIcon.BeIconComponets = (name, option) => {
  const tempStr = option.template;
  if (!tempStr) {
    console.error("The \u2018template\u2019 field in the parameter \u2018option\u2019 is required");
    return;
  }
  const compInstance = defineComponent(createCustom(tempStr));
  compInstance.install = (app) => {
    app.component(name, compInstance);
  };
  return compInstance;
};
const customCache = /* @__PURE__ */ new Set();
BeIcon.createFromIconfontCN = (url) => {
  if (typeof document !== "undefined" && typeof window !== "undefined" && typeof document.createElement === "function" && typeof url === "string" && url.length && !customCache.has(url)) {
    const script = document.createElement("script");
    script.setAttribute("src", url);
    script.setAttribute("data-namespace", url);
    customCache.add(url);
    document.body.appendChild(script);
  }
};
BeIcon.BeIconComponets;
BeIcon.createFromIconfontCN;
BePopover$1.install = (app) => {
  app.component(BePopover$1.name, BePopover$1);
};
const BePopover = BePopover$1;
beTooltip.install = (app) => {
  app.component(beTooltip.name, beTooltip);
};
const BeTooltip = beTooltip;
function useComponentId(Instance) {
  return Instance.uid;
}
var BeButton$1 = defineComponent({
  name: "BeButton",
  components: {
    BeIcon: BeIcon$1
  },
  props: {
    size: {
      type: String,
      default: "medium"
    },
    round: {
      type: [Number, String],
      default: 2
    },
    type: {
      type: String,
      default: "default"
    },
    bordered: {
      type: Boolean,
      default: false
    },
    ghost: {
      type: Boolean,
      default: false
    },
    dashed: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ""
    },
    flex: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prevIcon: {
      type: String,
      default: ""
    },
    nextIcon: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    const uid = ref(useComponentId(internalInstance));
    const btnStyle = computed(() => {
      return {
        background: props.ghost ? "transparent !important" : "",
        cursor: props.disabled ? "not-allowed" : "pointer",
        "border-style": props.dashed ? "dashed" : "solid",
        "border-radius": `${props.round}px`,
        display: props.flex ? "flex" : ""
      };
    });
    const borderStyle = computed(() => {
      return props.bordered ? "__border" : "";
    });
    const disabledStyle = computed(() => {
      return props.disabled || props.loading ? "be-button__inner__disabled" : "";
    });
    const prevIconStyle = computed(() => {
      if (props.loading) {
        return "loading";
      }
      if (props.prevIcon) {
        return props.prevIcon;
      } else {
        return "";
      }
    });
    const nextIconStyle = computed(() => {
      if (props.nextIcon) {
        if (props.loading) {
          return "";
        } else {
          return props.nextIcon;
        }
      } else {
        return "";
      }
    });
    const prevIconRender = () => {
      return props.prevIcon || props.loading ? createVNode(resolveComponent("be-icon"), {
        "icon": prevIconStyle.value,
        "spin": props.loading,
        "custom-class": `be-button-prevIcon be-button-prevIcon__${props.type}`
      }, null) : "";
    };
    const nextIconRender = () => {
      return !props.nextIcon ? "" : createVNode(resolveComponent("be-icon"), {
        "icon": nextIconStyle.value,
        "custom-class": `be-button-nextIcon be-button-nextIcon__${props.type}`
      }, null);
    };
    return () => {
      return createVNode("button", mergeProps({
        "type": "button"
      }, ctx.attrs, {
        "style": btnStyle.value,
        "id": `be_button_${uid.value}`,
        "class": `
                    be-button 
                    be-button__inner ${disabledStyle.value} 
                    be-button__${props.size} 
                    be-button__${props.type}${borderStyle.value} 
                    ${props.customClass}`,
        "disabled": props.disabled || props.loading
      }), [createVNode("div", {
        "class": "be-button-body",
        "style": "margin: 0 auto;display: flex"
      }, [prevIconRender(), createVNode("div", {
        "class": "be-button-slot"
      }, [ctx.slots.default && ctx.slots.default()]), nextIconRender()])]);
    };
  }
});
var beButton = "";
const button = BeButton$1;
button.install = (app) => {
  app.component(button.name || "", button);
};
const BeButton = button;
const dragDirective = {
  beforeMount(el, binding) {
    const op = el;
    op.style.transform = "translate(0%, 0%)";
    op.style.position = "absolute";
    if (binding.value && (binding.value.isDrag === false || binding.value.isDrag === "false")) {
      return;
    }
    if (op.firstChild) {
      op.firstChild.style.cursor = "move";
    }
    let otherEle = null;
    const childrenList = op.children;
    for (let i = 0; i < childrenList.length; i++) {
      if (childrenList[i].className && childrenList[i].className.indexOf("info-tag") > -1) {
        otherEle = childrenList[i];
        break;
      }
    }
    el.onmousedown = (e) => {
      let isTitle = false;
      const E = e;
      if (E.path) {
        for (let i = 0; i < E.path.length; i++) {
          if (op.firstChild === E.path[i] || otherEle === E.path[i]) {
            isTitle = true;
            break;
          }
          if (op.firstChild === E.path[i]) {
            isTitle = false;
            break;
          }
        }
      } else {
        isTitle = true;
      }
      if (!isTitle) {
        return;
      }
      const offsetWidth = document.body.offsetWidth;
      const offsetHeight = document.body.offsetHeight;
      if (offsetWidth === 0 || offsetHeight === 0) {
        console.error("Please set the width and height of the body element");
        return;
      }
      const disX = e.clientX - op.offsetLeft;
      const disY = e.clientY - op.offsetTop;
      const curTarget = e.currentTarget;
      const eWidth = curTarget.offsetWidth;
      const eHeight = curTarget.offsetHeight;
      let ix = 0;
      document.onmousemove = (e2) => {
        if (ix > 1) {
          let left2 = e2.clientX - disX;
          let top2 = e2.clientY - disY;
          const maxLeft = offsetWidth - eWidth;
          const maxBottom = offsetHeight - eHeight;
          if (top2 < 0) {
            top2 = 0;
          }
          if (left2 < 0) {
            left2 = 0;
          }
          if (top2 > maxBottom) {
            top2 = maxBottom;
          }
          if (left2 > maxLeft) {
            left2 = maxLeft;
          }
          op.style.left = left2 + "px";
          op.style.top = top2 + "px";
          op.style.transform = "translate(0%, 0%)";
          if (binding.value && Object.prototype.toString.call(binding.value) === "[object Function]") {
            binding.value({ left: left2, top: top2 });
          }
        }
        ix++;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
    };
  }
};
var beDialog_vue_vue_type_style_index_0_lang = "";
const _sfc_main$e = defineComponent({
  name: "BeDialog",
  components: { BeIcon: BeIcon$1, BeButton: BeButton$1 },
  directives: { drag: dragDirective },
  props: {
    isDrag: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    titles: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ""
    },
    isOpenModal: {
      type: Boolean,
      default: true
    },
    escExit: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: "center"
    }
  },
  emits: [
    "confirm",
    "close",
    "update:isShow",
    "escEvt"
  ],
  setup(props, ctx) {
    const customClassStyle = computed(() => props.customClass);
    const internalInstance = getCurrentInstance();
    const handleConfirm = () => {
      ctx.emit("confirm");
      handleClose();
    };
    const handleClose = (type) => {
      if (type === "btn" || type === "keyboard") {
        ctx.emit("close");
      }
      ctx.emit("update:isShow", false);
    };
    const show = computed(() => props.isShow);
    watch(show, (nVal) => {
      if (nVal) {
        nextTick(() => {
          listenerEscExitFunc();
        });
      } else {
        removeEscExitFunc();
      }
    });
    const listenerEscExitFunc = () => {
      if (props.escExit) {
        document.body.onkeydown = (e) => {
          if (e && e.key === "Escape") {
            ctx.emit("escEvt");
            handleClose("keyboard");
          }
        };
      }
    };
    const removeEscExitFunc = () => {
      document.body.onkeydown = null;
    };
    const dialogModels = ref("");
    onMounted(() => {
      if (props.isOpenModal) {
        dialogModels.value = "be-dialog-modal";
      }
      if (props.isShow) {
        listenerEscExitFunc();
      }
    });
    onUnmounted(() => {
      removeEscExitFunc();
    });
    return {
      dialogModels,
      customClassStyle,
      handleClose,
      handleConfirm,
      uid: internalInstance.uid
    };
  }
});
const _hoisted_1$7 = {
  key: 0,
  class: "be-dialog"
};
const _hoisted_2$2 = ["id"];
const _hoisted_3$2 = { class: "be-dialog-title" };
const _hoisted_4$2 = ["id"];
const _hoisted_5$2 = { class: "be-dialog-close" };
const _hoisted_6$2 = { class: "be-dialog-body" };
const _hoisted_7$1 = { class: "be-dialog-body__inner" };
const _hoisted_8$1 = /* @__PURE__ */ createTextVNode("\u786E\u5B9A ");
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_icon = resolveComponent("be-icon");
  const _component_be_button = resolveComponent("be-button");
  const _directive_drag = resolveDirective("drag");
  return openBlock(), createElementBlock(Fragment, null, [
    _ctx.isShow ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(_ctx.dialogModels)
    }, null, 2)) : createCommentVNode("", true),
    createVNode(Transition, { name: "dialog-fade" }, {
      default: withCtx(() => [
        _ctx.isShow ? (openBlock(), createElementBlock("div", _hoisted_1$7, [
          withDirectives((openBlock(), createElementBlock("div", {
            id: `be_dialog_container${_ctx.uid}`,
            class: normalizeClass(["be-dialog-container", _ctx.customClassStyle])
          }, [
            createElementVNode("div", _hoisted_3$2, [
              createElementVNode("div", {
                id: `be_head${_ctx.uid}`,
                class: "be-dialog-container-head"
              }, [
                createElementVNode("span", null, toDisplayString(_ctx.titles), 1),
                createElementVNode("div", _hoisted_5$2, [
                  renderSlot(_ctx.$slots, "headerIcon", {}, () => [
                    createVNode(_component_be_icon, {
                      icon: "deleteIc",
                      "custom-class": "be-dialog-close-btn",
                      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleClose("btn"))
                    })
                  ])
                ])
              ], 8, _hoisted_4$2)
            ]),
            createElementVNode("div", _hoisted_6$2, [
              createElementVNode("div", _hoisted_7$1, [
                renderSlot(_ctx.$slots, "default")
              ])
            ]),
            _ctx.showFooter ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(`be-dialog-footer be-dialog-footer__${_ctx.layout}`)
            }, [
              renderSlot(_ctx.$slots, "footer", {}, () => [
                createVNode(_component_be_button, {
                  type: "primary",
                  bordered: "",
                  round: "3",
                  "custom-class": "be-dialog-footer-btn",
                  onClick: _ctx.handleConfirm
                }, {
                  default: withCtx(() => [
                    _hoisted_8$1
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ], 2)) : createCommentVNode("", true)
          ], 10, _hoisted_2$2)), [
            [_directive_drag, { isDrag: _ctx.isDrag }]
          ])
        ])) : createCommentVNode("", true)
      ]),
      _: 3
    })
  ], 64);
}
var beDialog = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
beDialog.install = (app) => {
  app.component(beDialog.name, beDialog);
};
const BeDialog = beDialog;
const renderCircle = function(color) {
  return createVNode("div", {
    "class": "circleBox"
  }, [createVNode("span", {
    "style": `background-color:${color}`
  }, null), createVNode("span", {
    "style": `background-color:${color}`
  }, null), createVNode("span", {
    "style": `background-color:${color}`
  }, null), createVNode("span", {
    "style": `background-color:${color}`
  }, null)]);
};
var BeLoadingAnimate = defineComponent({
  name: "BeLoadingAnimate",
  inject: ["$$BeLoading"],
  render() {
    const loadingAnim = [];
    if (this.$$BeLoading.customRender()) {
      loadingAnim[0] = this.$$BeLoading.customRender();
    } else {
      for (let i = 0; i <= 2; i++) {
        loadingAnim.push(renderCircle(this.$$BeLoading.color));
      }
    }
    return createVNode("div", {
      "style": `border-radius: ${this.$$BeLoading.round}px;`,
      "class": `be-loader be-loader__${this.$$BeLoading.sizeLoader} ${this.$$BeLoading.isBackgroundStyle}`
    }, [loadingAnim]);
  }
});
const _sfc_main$d = defineComponent({
  name: "BeLoading",
  components: { BeLoadingAnimate },
  provide() {
    return {
      $$BeLoading: this
    };
  },
  props: {
    delay: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "#4F60A7FF"
    },
    colorText: {
      type: String,
      default: "black"
    },
    text: {
      type: String,
      default: ""
    },
    round: {
      type: [Number, String],
      default: 5
    },
    size: {
      type: String,
      default: "default"
    },
    isBackground: {
      type: Boolean,
      default: true
    },
    mdColor: {
      type: String,
      default: "rgba(255,255,255,.5)"
    },
    customClass: {
      type: String,
      default: ""
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    customRender: {
      type: Function,
      default: () => null
    }
  },
  setup(props) {
    const left2 = ref("50%");
    const top2 = ref("50%");
    const leftLoader = ref("");
    const topLoader = ref("");
    const timer = ref(null);
    const sizeLoader = computed(() => props.size);
    const containerHeight = ref("");
    const containerWidth = ref("");
    const containerLeft = ref("50%");
    const containerTop = ref("50%");
    const isBackgroundStyle = computed(() => props.isBackground ? "be-loader__bg" : "");
    const isFullScreenStyle = ref("");
    const loaderWidth = ref("");
    const loaderHeight = ref("");
    const leftTxt = ref("");
    const topTxt = ref("");
    const setText = () => {
      if (props.text) {
        nextTick(() => {
          let loaderElem = document.querySelector(".be-loader");
          if (!loaderElem)
            return;
          let loaderElemHeight = Number(window.getComputedStyle(loaderElem).height.split("px")[0]);
          leftTxt.value = left2.value;
          let topVal = null;
          if (top2.value.split("px").length > 1) {
            topVal = top2.value.split("px");
            topTxt.value = Number(topVal[0]) + loaderElemHeight / 2 + 20 + "px";
          } else {
            topVal = top2.value.split("%");
            topTxt.value = `calc(${Number(topVal[0])}% + ${loaderElemHeight / 2 + 20}px)`;
          }
        });
      }
    };
    const getAbsolutePosition = (slotElem) => {
      if (!slotElem)
        return null;
      let w = slotElem.offsetWidth, h2 = slotElem.offsetHeight;
      let t, l;
      for (t = slotElem.offsetTop, l = slotElem.offsetLeft; slotElem = slotElem.offsetParent; ) {
        t += slotElem.offsetTop;
        l += slotElem.offsetLeft;
      }
      let r = document.body.offsetWidth - w - l;
      let b = document.body.offsetHeight - h2 - t;
      return { width: w, height: h2, top: t, left: l, right: r, bottom: b };
    };
    const internalInstance = getCurrentInstance();
    const initComp = () => {
      isFullScreenStyle.value = computed(() => props.isFullScreen ? "be-load-container__fullScreen" : "").value;
      if (props.isFullScreen) {
        return;
      }
      getParentDomAttr(internalInstance == null ? void 0 : internalInstance.proxy.$el.parentElement);
    };
    const getParentDomAttr = (parentDom) => {
      if (!parentDom)
        return;
      const parentStylr = getAbsolutePosition(parentDom);
      containerWidth.value = window.getComputedStyle(parentDom).width;
      containerHeight.value = window.getComputedStyle(parentDom).height;
      if (parentStylr) {
        containerLeft.value = "0px";
        containerTop.value = "0px";
      }
      setText();
    };
    const isShowLoader = computed(() => props.show);
    const isShowLoaderInner = ref(false);
    const delayShow = (show) => {
      if (show) {
        timer.value = setTimeout(() => {
          nextTick(() => {
            isShowLoaderInner.value = show;
            initComp();
          });
        }, props.delay);
      } else {
        isShowLoaderInner.value = show;
        clearTimeout(timer);
        timer.value = null;
      }
    };
    watchEffect(() => {
      let show = props.show;
      delayShow(show);
    });
    watch(isShowLoader, (nVal) => {
      delayShow(nVal);
    });
    return {
      uid: internalInstance.uid,
      containerHeight,
      containerWidth,
      containerLeft,
      containerTop,
      isFullScreenStyle,
      leftLoader,
      topLoader,
      loaderWidth,
      loaderHeight,
      leftTxt,
      topTxt,
      left: left2,
      top: top2,
      sizeLoader,
      isShowLoader,
      isShowLoaderInner,
      isBackgroundStyle
    };
  }
});
const _hoisted_1$6 = ["id"];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BeLoadingAnimate = resolveComponent("BeLoadingAnimate");
  return openBlock(), createElementBlock("div", {
    id: `be_load_${_ctx.uid}`,
    style: normalizeStyle(`position: absolute;height: ${_ctx.containerHeight};width: ${_ctx.containerWidth};left: ${_ctx.containerLeft};top: ${_ctx.containerTop};`)
  }, [
    createVNode(Transition, { name: "be-fade-in-linear" }, {
      default: withCtx(() => [
        _ctx.isShowLoaderInner ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["be-load-container flex-col", `${_ctx.customClass} ${_ctx.isFullScreenStyle}`]),
          style: normalizeStyle(`
                 background-color: ${_ctx.mdColor};
                 left: ${_ctx.leftLoader};
                 top: ${_ctx.topLoader};
                 width:${_ctx.loaderWidth};
                 height:${_ctx.loaderHeight}`)
        }, [
          createVNode(_component_BeLoadingAnimate),
          _ctx.text ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["be-loader-text", `be-loader-text__${_ctx.sizeLoader}`]),
            style: normalizeStyle(`color:${_ctx.colorText};`)
          }, toDisplayString(_ctx.text), 7)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ]),
      _: 1
    })
  ], 12, _hoisted_1$6);
}
var beLoadingComponents = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const closeLoading = (instance) => {
  render(null, instance.beLoadingElm);
};
const initLoading = (options = {}) => {
  const defaultOption = {
    isBackground: true,
    bgColor: "rgba(255,255,255,.5)",
    customRender: () => null,
    text: "",
    size: "default",
    customClass: "",
    color: "#4F60A7FF",
    colorText: "black",
    delay: 0,
    round: 5,
    show: false,
    isFullScreen: true
  };
  const option = Object.assign({}, defaultOption, options);
  const instanceInner = createVNode(beLoadingComponents, __spreadValues({}, option));
  instanceInner.props.show = true;
  instanceInner.props.isFullScreen = true;
  const elm = document.createElement("div");
  render(instanceInner, elm);
  const bodyElement = document.querySelector("body");
  if (bodyElement && bodyElement.append) {
    bodyElement.append(instanceInner.el);
  } else {
    bodyElement && bodyElement.appendChild(instanceInner.el);
  }
  instanceInner.beLoadingElm = elm;
  return instanceInner;
};
const beLoading$1 = {
  close: closeLoading,
  init: initLoading
};
var beLoading = "";
const load$1 = beLoadingComponents;
load$1.install = (app) => {
  app.component(load$1.name || "", load$1);
};
const BeLoading = load$1;
const pagersDynamicList = ($$BePaginProps) => {
  if ($$BePaginProps.isDynamic) {
    const array = [];
    const currentPage = Number($$BePaginProps.currentPage) >= 1 ? Number($$BePaginProps.currentPage) : 1;
    const showPageCount = Number($$BePaginProps.pagerShowCount);
    const halfPagerCount = parseInt(String(showPageCount / 2));
    if (currentPage <= halfPagerCount) {
      for (let i = 1; i <= showPageCount; i++) {
        array.push(i);
      }
    }
    if (currentPage > halfPagerCount) {
      const offset2 = currentPage - halfPagerCount;
      for (let i = offset2; i < showPageCount + offset2; i++) {
        array.push(i);
      }
    }
    return array;
  }
  return [];
};
const pagersList = ($$BePaginProps, maxPageNum, showPrevMore, showNextMore) => {
  if ($$BePaginProps.isFront || $$BePaginProps.isDynamic)
    return [];
  let pagerShowCount = $$BePaginProps.pagerShowCount;
  const halfPagerCount = (pagerShowCount - 1) / 2;
  const pageCount = Number($$BePaginProps.pageCount);
  maxPageNum.value = Math.ceil(pageCount / Number($$BePaginProps.pageSize));
  const currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
  pagerShowCount = maxPageNum.value <= pagerShowCount ? maxPageNum.value : pagerShowCount;
  let showPrevMoreIner = false;
  let showNextMoreIner = false;
  if (maxPageNum.value > pagerShowCount) {
    if (currentPage > pagerShowCount - halfPagerCount) {
      showPrevMoreIner = true;
    }
    if (currentPage < maxPageNum.value - (pagerShowCount - 2)) {
      showNextMoreIner = true;
    }
  }
  const array = [];
  if (showPrevMoreIner && !showNextMoreIner) {
    const startPage = maxPageNum.value - (pagerShowCount - 2);
    for (let i = startPage; i < maxPageNum.value; i++) {
      array.push(i);
    }
  } else if (!showPrevMoreIner && showNextMoreIner || !showPrevMoreIner && !showNextMoreIner) {
    for (let i = 2; i < pagerShowCount; i++) {
      array.push(i);
    }
  } else if (showPrevMoreIner && showNextMoreIner) {
    const offset2 = Math.floor(pagerShowCount / 2) - 1;
    for (let i = currentPage - offset2; i < currentPage + offset2 + 1; i++) {
      array.push(i);
    }
  }
  showPrevMore.value = showPrevMoreIner;
  showNextMore.value = showNextMoreIner;
  return array;
};
const pagerFront = ($$BePaginProps, $$BePaginMix, maxPageNum, showPrev, showNext, inst) => {
  if ($$BePaginProps.isFront) {
    const sliceList = /* @__PURE__ */ new Map();
    const pageFrontData = computed(() => {
      const pageSize = $$BePaginMix.pageNumVal ? Number($$BePaginMix.pageNumVal.split("/")[0]) : $$BePaginProps.pageSize;
      maxPageNum.value = Math.ceil($$BePaginProps.pageData.length / pageSize);
      $$BePaginMix.pageParamsFront.maxPageNum = maxPageNum.value;
      if (!$$BePaginProps.pageData.length || $$BePaginProps.pageData.length === 0) {
        sliceList.set(1, []);
        $$BePaginMix.pageParamsFront.maxPageNum = 1;
      }
      inst.emit("getPageCount", $$BePaginMix.pageParamsFront);
      for (let i = 1; i <= maxPageNum.value; i++) {
        const slice = $$BePaginProps.pageData.slice((i - 1) * pageSize, i * pageSize);
        sliceList.set(i, slice);
      }
      let pagerShowCount = $$BePaginProps.pagerShowCount;
      const halfPagerCount = (pagerShowCount - 1) / 2;
      pagerShowCount = maxPageNum.value <= pagerShowCount ? maxPageNum.value : pagerShowCount;
      const currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
      if (currentPage === 1) {
        inst.emit("updatePage", { data: sliceList.get(1) });
      }
      let showPrevMore = false;
      let showNextMore = false;
      if (maxPageNum.value > pagerShowCount) {
        if (currentPage > pagerShowCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < maxPageNum.value - (pagerShowCount - 2)) {
          showNextMore = true;
        }
      }
      const array = [];
      if (showPrevMore && !showNextMore) {
        const startPage = maxPageNum.value - (pagerShowCount - 2);
        for (let i = startPage; i < maxPageNum.value; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore || !showPrevMore && !showNextMore) {
        for (let i = 2; i < pagerShowCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset2 = Math.floor(pagerShowCount / 2) - 1;
        for (let i = currentPage - offset2; i < currentPage + offset2 + 1; i++) {
          array.push(i);
        }
      }
      showPrev.value = showPrevMore;
      showNext.value = showNextMore;
      return array;
    });
    const prePageFront = () => {
      let currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
      if (currentPage !== 1 && currentPage > 0 && $$BePaginProps.isFront) {
        inst.emit("updatePage", { data: sliceList.get(--currentPage) });
      }
    };
    const nextPageFront = () => {
      let currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
      if (currentPage !== $$BePaginMix.pageParamsFront.maxPageNum && $$BePaginProps.isFront) {
        inst.emit("updatePage", { data: sliceList.get(++currentPage) });
      }
    };
    return {
      sliceList,
      frontList: pageFrontData.value,
      prePageFront,
      nextPageFront
    };
  } else {
    return {
      sliceList: void 0,
      frontList: void 0,
      prePageFront: void 0,
      nextPageFront: void 0
    };
  }
};
const _sfc_main$c = defineComponent({
  name: "BePager",
  components: { BeIcon },
  emits: ["changePage", "updatePage"],
  setup(props, ctx) {
    const $$BePaginMix = inject("$$BePaginMix");
    const $$BePaginProps = inject("$$BePaginProps");
    let maxPageNum = ref(0);
    let showPrevMore = ref(false);
    let showNextMore = ref(false);
    let pagers = computed(() => {
      return pagersList($$BePaginProps, maxPageNum, showPrevMore, showNextMore);
    });
    let pagersDynamic = computed(() => {
      return pagersDynamicList($$BePaginProps);
    });
    let pagerFrontParam = reactive(pagerFront($$BePaginProps, $$BePaginMix, maxPageNum, showPrevMore, showNextMore, ctx));
    let sliceList = ref(pagerFrontParam ? pagerFrontParam.sliceList : null);
    let frontList = ref(pagerFrontParam ? pagerFrontParam.frontList : null);
    let nextPageFront = ref(pagerFrontParam ? pagerFrontParam.nextPageFront : null);
    let prePageFront = ref(pagerFrontParam ? pagerFrontParam.prePageFront : null);
    watch($$BePaginProps, (nva) => {
      pagerFrontParam = pagerFront(nva, $$BePaginMix, maxPageNum, showPrevMore, showNextMore, ctx);
      frontList.value = pagerFrontParam ? pagerFrontParam.frontList : null;
      sliceList.value = pagerFrontParam ? pagerFrontParam.sliceList : null;
      nextPageFront.value = pagerFrontParam ? pagerFrontParam.nextPageFront : null;
      prePageFront.value = pagerFrontParam ? pagerFrontParam.prePageFront : null;
    });
    const isNaNPage = (newPage, maxPageNum2, $$BePaginProps2) => {
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }
        if (newPage > maxPageNum2.value && !$$BePaginProps2.isDynamic) {
          newPage = maxPageNum2.value;
        }
      }
    };
    const changePage = (type) => {
      let currentPage = 0;
      if ($$BePaginProps.isDynamic) {
        currentPage = Number($$BePaginProps.currentPage);
      } else {
        currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
      }
      let newPage = 0;
      if (type === "next") {
        newPage = $$BePaginProps.isDynamic ? currentPage + 1 : currentPage >= maxPageNum.value ? currentPage : currentPage + 1;
      } else {
        newPage = currentPage - 1;
        newPage = newPage <= 0 ? 1 : newPage;
      }
      isNaNPage(newPage, maxPageNum, $$BePaginProps);
      if (newPage !== currentPage) {
        if ($$BePaginProps.isFront) {
          if (type === "next") {
            nextPageFront.value && nextPageFront.value();
          } else {
            prePageFront.value && prePageFront.value();
          }
        }
        const resData = {
          currentPage: newPage,
          pageCount: $$BePaginProps.isFront ? $$BePaginMix.pageParamsFront.maxPageNum : $$BePaginProps.pageCount,
          pageSize: $$BePaginMix.pageNumVal ? Number($$BePaginMix.pageNumVal.split("/")[0]) : $$BePaginProps.pageSize
        };
        ctx.emit("changePage", resData);
      }
    };
    const onPagerClick = (event, jump) => {
      let currentPage = 0;
      if ($$BePaginProps.isDynamic) {
        currentPage = Number($$BePaginProps.currentPage);
      } else {
        currentPage = Number($$BePaginProps.currentPage) > maxPageNum.value ? maxPageNum.value : Number($$BePaginProps.currentPage);
      }
      let newPage = jump;
      if (!jump) {
        let target = event == null ? void 0 : event.target;
        if (target.tagName === "UL" || $$BePaginProps.disabled) {
          return;
        }
        newPage = Number(target.textContent);
        const pagerCountOffset = $$BePaginProps.pagerShowCount;
        if (target.className && Object.prototype.toString.call(target.className) === "[object String]" && (target.className.indexOf("pageLast") !== -1 || target.className.indexOf("pageFirst") !== -1)) {
          const childNodes = target.childNodes[0];
          if (childNodes.className.indexOf("quickprev") !== -1) {
            newPage = currentPage - pagerCountOffset;
            newPage = newPage < 1 ? 1 : newPage;
          } else if (childNodes.className.indexOf("quicknext") !== -1) {
            newPage = currentPage + pagerCountOffset;
            newPage = newPage > maxPageNum.value ? maxPageNum.value : newPage;
          }
        }
        const classNameSVG = event == null ? void 0 : event.target;
        if (target.className && Object.prototype.toString.call(target.className) === "[object SVGAnimatedString]" && classNameSVG.className.baseVal && classNameSVG.className.baseVal.toString().indexOf("be-icon") !== -1) {
          if (target.parentElement && target.parentElement.className.indexOf("quickprev") !== -1) {
            newPage = currentPage - pagerCountOffset;
            newPage = newPage < 1 ? 1 : newPage;
          } else if (target.parentElement && target.parentElement.className.indexOf("quicknext") !== -1) {
            newPage = currentPage + pagerCountOffset;
            newPage = newPage > maxPageNum.value ? maxPageNum.value : newPage;
          }
        }
      }
      isNaNPage(Number(newPage), maxPageNum, $$BePaginProps);
      if (newPage !== currentPage) {
        if ($$BePaginProps.isFront && sliceList.value) {
          ctx.emit("updatePage", { data: sliceList.value.get(Number(newPage)) });
        }
        const resData = {
          currentPage: Number(newPage),
          pageCount: $$BePaginProps.isFront ? $$BePaginMix.pageParamsFront.maxPageNum : $$BePaginProps.pageCount,
          pageSize: $$BePaginMix.pageNumVal ? Number($$BePaginMix.pageNumVal.split("/")[0]) : $$BePaginProps.pageSize
        };
        ctx.emit("changePage", resData);
      }
    };
    const prePage = () => {
      if ($$BePaginProps.disabled)
        return;
      changePage("pre");
    };
    const nextPage = () => {
      if ($$BePaginProps.disabled)
        return;
      changePage("next");
    };
    let quicknextIconClass = ref("more");
    let quickprevIconClass = ref("more");
    let hoverNextIconClass = ref("#303133");
    let hoverprevIconClass = ref("#303133");
    watchEffect(() => {
      if (!showPrevMore.value) {
        quickprevIconClass.value = "more";
      }
    });
    watchEffect(() => {
      if (!showNextMore.value) {
        quicknextIconClass.value = "more";
      }
    });
    watch([showNextMore, showPrevMore], ([valNext, valPre]) => {
      if (!valNext) {
        quicknextIconClass.value = "more";
      }
      if (!valPre) {
        quickprevIconClass.value = "more";
      }
    });
    const onMouseenter = (direction) => {
      if ($$BePaginProps.disabled)
        return;
      if (direction === "left") {
        hoverprevIconClass.value = "#409EFF";
        quickprevIconClass.value = "pageFirst";
      } else {
        hoverNextIconClass.value = "#409EFF";
        quicknextIconClass.value = "pageLast";
      }
    };
    onMounted(() => {
      if ($$BePaginProps.isFront) {
        const pageSize = $$BePaginMix.pageNumVal ? Number($$BePaginMix.pageNumVal.split("/")[0]) : $$BePaginProps.pageSize;
        maxPageNum.value = Math.ceil($$BePaginProps.pageData.length / pageSize);
      } else {
        const pageCount = Number($$BePaginProps.pageCount);
        maxPageNum.value = Math.ceil(pageCount / Number($$BePaginProps.pageSize));
      }
    });
    return {
      pagerMix: $$BePaginMix,
      pagerProps: $$BePaginProps,
      frontList,
      quickprevIconClass,
      hoverprevIconClass,
      quicknextIconClass,
      hoverNextIconClass,
      pagers,
      pagersDynamic,
      showPrevMore,
      showNextMore,
      maxPageNum,
      prePage,
      nextPage,
      onPagerClick,
      onMouseenter
    };
  }
});
const _hoisted_1$5 = { style: { "display": "flex" } };
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_icon = resolveComponent("be-icon");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createElementVNode("ul", {
      class: normalizeClass(["be-pager", { "be-pager__disabled": _ctx.pagerProps.disabled }])
    }, [
      createElementVNode("li", {
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.prePage && _ctx.prePage(...args))
      }, [
        createVNode(_component_be_icon, { icon: "left" })
      ])
    ], 2),
    !_ctx.pagerProps.isDynamic && !_ctx.pagerProps.isFront ? (openBlock(), createElementBlock("ul", {
      key: 0,
      class: normalizeClass(["be-pager", { "be-pager__disabled": _ctx.pagerProps.disabled }]),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onPagerClick && _ctx.onPagerClick(...args))
    }, [
      _ctx.pagerProps.pageCount > 0 ? (openBlock(), createElementBlock("li", {
        key: 0,
        class: normalizeClass([{ active: _ctx.pagerProps.currentPage === 1, disabled: _ctx.pagerProps.disabled }, "number"])
      }, " 1 ", 2)) : createCommentVNode("", true),
      _ctx.showPrevMore ? (openBlock(), createElementBlock("li", {
        key: 1,
        class: normalizeClass([_ctx.quickprevIconClass, { disabled: _ctx.pagerProps.disabled }]),
        onMouseenter: _cache[1] || (_cache[1] = ($event) => _ctx.onMouseenter("left")),
        onMouseleave: _cache[2] || (_cache[2] = () => {
          _ctx.hoverprevIconClass = "#303133";
          _ctx.quickprevIconClass = "more";
        })
      }, [
        createVNode(_component_be_icon, {
          icon: _ctx.quickprevIconClass,
          class: "more btn-quickprev",
          color: _ctx.hoverprevIconClass,
          onClick: withModifiers(_ctx.onPagerClick, ["stop"])
        }, null, 8, ["icon", "color", "onClick"])
      ], 34)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pagers, (pager) => {
        return openBlock(), createElementBlock("li", {
          key: pager,
          class: normalizeClass([{ active: _ctx.pagerProps.currentPage === pager, disabled: _ctx.pagerProps.disabled }, "number"])
        }, toDisplayString(pager), 3);
      }), 128)),
      _ctx.showNextMore ? (openBlock(), createElementBlock("li", {
        key: 2,
        class: normalizeClass([_ctx.quicknextIconClass, { disabled: _ctx.pagerProps.disabled }]),
        onMouseenter: _cache[3] || (_cache[3] = ($event) => _ctx.onMouseenter("right")),
        onMouseleave: _cache[4] || (_cache[4] = () => {
          _ctx.hoverNextIconClass = "#303133";
          _ctx.quicknextIconClass = "more";
        })
      }, [
        createVNode(_component_be_icon, {
          icon: _ctx.quicknextIconClass,
          class: "more btn-quicknext",
          color: _ctx.hoverNextIconClass,
          onClick: withModifiers(_ctx.onPagerClick, ["stop"])
        }, null, 8, ["icon", "color", "onClick"])
      ], 34)) : createCommentVNode("", true),
      _ctx.maxPageNum > 1 ? (openBlock(), createElementBlock("li", {
        key: 3,
        class: normalizeClass([{
          active: _ctx.pagerProps.currentPage < _ctx.maxPageNum ? false : true,
          disabled: _ctx.pagerProps.disabled
        }, "number"])
      }, toDisplayString(_ctx.maxPageNum), 3)) : createCommentVNode("", true)
    ], 2)) : _ctx.pagerProps.isDynamic && !_ctx.pagerProps.isFront ? (openBlock(), createElementBlock("ul", {
      key: 1,
      class: normalizeClass(["be-pager", { "be-pager__disabled": _ctx.pagerProps.disabled }]),
      onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onPagerClick && _ctx.onPagerClick(...args))
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pagersDynamic, (pager) => {
        return openBlock(), createElementBlock("li", {
          key: pager,
          class: normalizeClass([{ active: _ctx.pagerProps.currentPage === pager, disabled: _ctx.pagerProps.disabled }, "number"])
        }, toDisplayString(pager), 3);
      }), 128))
    ], 2)) : !_ctx.pagerProps.isDynamic && _ctx.pagerProps.isFront ? (openBlock(), createElementBlock("ul", {
      key: 2,
      class: normalizeClass(["be-pager", { "be-pager__disabled": _ctx.pagerProps.disabled }]),
      onClick: _cache[11] || (_cache[11] = (...args) => _ctx.onPagerClick && _ctx.onPagerClick(...args))
    }, [
      _ctx.pagerMix.pageParamsFront.maxPageNum > 0 ? (openBlock(), createElementBlock("li", {
        key: 0,
        class: normalizeClass([{ active: _ctx.pagerProps.currentPage === 1, disabled: _ctx.pagerProps.disabled }, "number"])
      }, " 1 ", 2)) : createCommentVNode("", true),
      _ctx.showPrevMore ? (openBlock(), createElementBlock("li", {
        key: 1,
        class: normalizeClass([_ctx.quickprevIconClass, { disabled: _ctx.pagerProps.disabled }]),
        onMouseenter: _cache[7] || (_cache[7] = ($event) => _ctx.onMouseenter("left")),
        onMouseleave: _cache[8] || (_cache[8] = () => {
          _ctx.hoverprevIconClass = "#303133";
          _ctx.quickprevIconClass = "more";
        })
      }, [
        createVNode(_component_be_icon, {
          icon: _ctx.quickprevIconClass,
          class: "more btn-quickprev",
          color: _ctx.hoverprevIconClass,
          onClick: withModifiers(_ctx.onPagerClick, ["stop"])
        }, null, 8, ["icon", "color", "onClick"])
      ], 34)) : createCommentVNode("", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.frontList, (pager) => {
        return openBlock(), createElementBlock("li", {
          key: pager,
          class: normalizeClass([{ active: _ctx.pagerProps.currentPage === pager, disabled: _ctx.pagerProps.disabled }, "number"])
        }, toDisplayString(pager), 3);
      }), 128)),
      _ctx.showNextMore ? (openBlock(), createElementBlock("li", {
        key: 2,
        class: normalizeClass([_ctx.quicknextIconClass, { disabled: _ctx.pagerProps.disabled }]),
        onMouseenter: _cache[9] || (_cache[9] = ($event) => _ctx.onMouseenter("right")),
        onMouseleave: _cache[10] || (_cache[10] = () => {
          _ctx.hoverNextIconClass = "#303133";
          _ctx.quicknextIconClass = "more";
        })
      }, [
        createVNode(_component_be_icon, {
          icon: _ctx.quicknextIconClass,
          class: "more btn-quicknext",
          color: _ctx.hoverNextIconClass,
          onClick: withModifiers(_ctx.onPagerClick, ["stop"])
        }, null, 8, ["icon", "color", "onClick"])
      ], 34)) : createCommentVNode("", true),
      _ctx.pagerMix.pageParamsFront.maxPageNum > 1 ? (openBlock(), createElementBlock("li", {
        key: 3,
        class: normalizeClass([{
          active: _ctx.pagerProps.currentPage < _ctx.maxPageNum ? _ctx.pagerProps.currentPage === _ctx.pagerMix.pageParamsFront.maxPageNum : _ctx.maxPageNum === _ctx.pagerMix.pageParamsFront.maxPageNum,
          disabled: _ctx.pagerProps.disabled
        }, "number"])
      }, toDisplayString(_ctx.pagerMix.pageParamsFront.maxPageNum), 3)) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true),
    createElementVNode("ul", {
      class: normalizeClass(["be-pager", { "be-pager__disabled": _ctx.pagerProps.disabled }])
    }, [
      createElementVNode("li", {
        onClick: _cache[12] || (_cache[12] = (...args) => _ctx.nextPage && _ctx.nextPage(...args))
      }, [
        createVNode(_component_be_icon, { icon: "right" })
      ])
    ], 2)
  ]);
}
var Pager = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
var beSelect$1 = "";
var beInputSelect_vue_vue_type_style_index_0_lang = "";
const _sfc_main$b = defineComponent({
  name: "BeInputSelect",
  props: {
    selectList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectStyle: {
      type: Object,
      default: () => {
        return { left: "0px", top: "0px" };
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    keyValue: {
      type: String,
      default: "id"
    },
    labelValue: {
      type: String,
      default: "label"
    }
  },
  emits: ["select"],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    const handleSelect = (value, index2) => {
      ctx.emit("select", value, index2);
    };
    const list = computed(() => {
      return props.selectList;
    });
    return {
      uid: internalInstance.uid,
      handleSelect,
      list
    };
  }
});
const _hoisted_1$4 = ["id"];
const _hoisted_2$1 = ["id"];
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = /* @__PURE__ */ createElementVNode("li", { class: "be-input-select__line" }, null, -1);
const _hoisted_5$1 = /* @__PURE__ */ createElementVNode("li", {
  class: "be-input-select__inner",
  style: { "text-align": "center" }
}, "\u8F7D\u5165\u4E2D...", -1);
const _hoisted_6$1 = [
  _hoisted_4$1,
  _hoisted_5$1
];
const _hoisted_7 = /* @__PURE__ */ createElementVNode("li", { class: "be-input-select__inner" }, "\u6682\u65E0\u6570\u636E", -1);
const _hoisted_8 = [
  _hoisted_7
];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "be-zoom-in-top" }, {
    default: withCtx(() => [
      createElementVNode("div", {
        id: `be_input_select${_ctx.uid}`,
        class: "be-input-select",
        style: normalizeStyle(_ctx.selectStyle)
      }, [
        _ctx.list.length > 0 ? withDirectives((openBlock(), createElementBlock("ul", {
          id: `be_input_select_ul${_ctx.uid}`,
          key: `be_input_select_ul${_ctx.uid}`,
          style: normalizeStyle(_ctx.selectStyle)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.list, (item, index2) => {
            return openBlock(), createElementBlock("li", {
              key: item[_ctx.keyValue],
              class: "be-input-select__inner",
              onClick: ($event) => _ctx.handleSelect(item, index2)
            }, [
              renderSlot(_ctx.$slots, "cus-temp", { item }, () => [
                createTextVNode(toDisplayString(item[_ctx.labelValue]), 1)
              ])
            ], 8, _hoisted_3$1);
          }), 128))
        ], 12, _hoisted_2$1)), [
          [vShow, !_ctx.loading]
        ]) : createCommentVNode("", true),
        withDirectives((openBlock(), createElementBlock("ul", {
          key: `be-input-select${_ctx.uid}-loading`
        }, _hoisted_6$1)), [
          [vShow, _ctx.loading]
        ]),
        withDirectives((openBlock(), createElementBlock("ul", {
          key: `be-input-select${_ctx.uid}-loading`
        }, _hoisted_8)), [
          [vShow, _ctx.loading && _ctx.list.length === 0]
        ])
      ], 12, _hoisted_1$4)
    ]),
    _: 3
  });
}
var BeInputSelect = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
var composition = (props, ctx) => {
  const internalInstance = getCurrentInstance();
  const uid = internalInstance.uid;
  const dataList = ref([]);
  const list = computed(() => {
    return props.list;
  });
  const listCache = [];
  const readonlyInput = ref(true);
  if (props.search) {
    readonlyInput.value = false;
  }
  const cursor = props.disabled ? "not-allowed" : readonlyInput.value ? "pointer" : "";
  const selectStyle = reactive({ width: "0px" });
  const computedPosition = () => {
    const $eventDom = document.getElementById(`be-select-body${uid}`);
    if (!$eventDom)
      return;
    selectStyle.width = Number(window.getComputedStyle($eventDom).width.split("px")[0]) + "px";
  };
  const updatePopover = () => {
    const curInstPopover = internalInstance.refs.beSelectPopover;
    curInstPopover.computePosition(null, "update");
  };
  const curAttrs = useAttrs();
  const iconType = ref(computed(() => props.selectIcon).value);
  const focusClass = ref("");
  const handleFocus = (event) => {
    var _a;
    (_a = event.target.querySelector("input")) == null ? void 0 : _a.focus();
    ctx.emit("focus", event);
  };
  const handleBlur = (event) => {
    ctx.emit("blur", event);
  };
  const selectOpenChange = (showPopover) => {
    if (showPopover) {
      focusClass.value = "be-select-body__focus";
    } else {
      focusClass.value = "";
    }
    if (showPopover && curAttrs.onScroll) {
      nextTick(() => {
        const dom = document.getElementById(`be_select_option_container_${uid}`);
        dom == null ? void 0 : dom.addEventListener("scroll", handleScroll);
      });
    }
    ctx.emit("openChange", showPopover);
  };
  const changeIcon = (type) => {
    if (props.clear && props.modelValue) {
      iconType.value = type || "error";
      return;
    }
  };
  const handleMouseEnter = (event) => {
    changeIcon(void 0);
    ctx.emit("MouseEnter", event);
  };
  const handleMouseLeave = (event) => {
    changeIcon(props.selectIcon);
    ctx.emit("MouseLeave", event);
  };
  const handleScroll = () => {
    ctx.emit("scroll");
  };
  const addScrollEvt = () => {
    const dom = document.getElementById(`be_select_option_container_${uid}`);
    dom == null ? void 0 : dom.addEventListener("scroll", handleScroll);
  };
  const addItem = ref("");
  const handleInput = (value) => {
    addItem.value = value;
  };
  const addItemToList = () => {
    if (addItem.value) {
      const item = {};
      const keyValue = props.keyValue || "id";
      const labelValue = props.labelValue || "label";
      item[keyValue] = getUuid();
      item[labelValue] = addItem.value;
      dataList.value.push(item);
      addItem.value = "";
    }
  };
  const trigger = ref("click");
  if (props.remote && isFunction(props.remoteFunc)) {
    trigger.value = "none";
  }
  const loading = ref(false);
  const addItemList = ref([]);
  return {
    internalInstance,
    uid,
    dataList,
    list,
    listCache,
    readonlyInput,
    cursor,
    selectStyle,
    iconType,
    trigger,
    loading,
    addItemList,
    addItem,
    handleInput,
    addItemToList,
    computedPosition,
    updatePopover,
    addScrollEvt,
    handleScroll,
    handleMouseLeave,
    handleMouseEnter,
    selectOpenChange,
    handleBlur,
    handleFocus,
    changeIcon,
    focusClass
  };
};
var beSelect = defineComponent({
  name: "BeSelect",
  components: {
    BeInputSelect,
    BePopover: BePopover$1,
    BeIcon: BeIcon$1
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    list: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String
    },
    labelValue: {
      type: String,
      default: "label"
    },
    keyValue: {
      type: String
    },
    placeholder: {
      type: String,
      default: "\u8BF7\u9009\u62E9"
    },
    clear: {
      type: Boolean,
      default: false
    },
    selectIcon: {
      type: String,
      default: "under"
    },
    group: {
      type: Boolean,
      default: false
    },
    extend: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    searchFunc: {
      type: Function
    },
    sortFunc: {
      type: Function
    },
    remote: {
      type: Boolean,
      default: false
    },
    remoteFunc: {
      type: Function
    },
    customClass: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "select", "focus", "blur", "openChange", "clear", "search", "MouseEnter", "MouseLeave", "scroll"],
  setup(props, ctx) {
    const {
      internalInstance,
      uid,
      dataList,
      list,
      readonlyInput,
      cursor,
      selectStyle,
      iconType,
      trigger,
      loading,
      addItem,
      handleInput,
      addItemToList,
      computedPosition,
      addScrollEvt,
      handleMouseLeave,
      handleMouseEnter,
      selectOpenChange,
      handleBlur,
      handleFocus,
      focusClass,
      changeIcon
    } = composition(props, ctx);
    let {
      listCache
    } = composition(props, ctx);
    watch(list, (nVal, oVal) => {
      if (nVal !== oVal) {
        handleList(props.list);
      }
    });
    const handleList = (list2) => {
      if (props.group) {
        const arr = [];
        list2.forEach((res) => {
          var _a;
          res.isSelect = false;
          const group = __spreadValues({}, res);
          delete group.children;
          arr.push(group);
          if (((_a = res.children) == null ? void 0 : _a.length) > 0) {
            res.children.forEach((childRes) => {
              arr.push(childRes);
            });
          }
        });
        dataList.value = arr;
      } else {
        if (!props.keyValue) {
          list2.forEach((val) => {
            val.isSelect = false;
            val.id = getUuid();
          });
        }
        if (props.keyValue) {
          list2.forEach((val) => {
            val.isSelect = false;
            if (!val[props.keyValue || "id"]) {
              val[props.keyValue || "id"] = getUuid();
            }
          });
        }
        dataList.value = list2;
      }
      listCache = jsonClone(dataList.value);
    };
    const handleSelect = (value, index2) => {
      resetSelect();
      updateValue(value);
      ctx.emit("select", value, index2);
      const curInstPopover = internalInstance.refs.beSelectPopover;
      curInstPopover.close();
    };
    const updateValue = (value) => {
      if (isString(value)) {
        ctx.emit("update:modelValue", value);
      } else {
        ctx.emit("update:modelValue", value[props.labelValue]);
      }
    };
    const resetSelect = () => {
      dataList.value.map((val) => val.isSelect = false);
    };
    const handleClear = () => {
      updateValue("");
      ctx.emit("clear");
      changeIcon(props.selectIcon);
      dataList.value = listCache;
      resetSelect();
    };
    const renderExtendElm = () => {
      if (props.extend && !props.group) {
        return createVNode("div", {
          "class": `
                        be-select-option__extend`
        }, [createVNode(resolveComponent("be-input"), {
          "value": addItem.value,
          "onInput": handleInput
        }, null), createVNode(resolveComponent("be-icon"), {
          "icon": "add",
          "onClick": addItemToList
        }, null)]);
      }
    };
    const matchSuggestions = (value, ordData) => {
      const filter = (value2, ordData2, labelValue) => {
        const arr = value2 ? ordData2.filter((val) => {
          return val[labelValue].toString().toLowerCase().indexOf(value2.toLowerCase()) >= 0;
        }) : ordData2;
        return arr.length > 0 ? arr : ordData2;
      };
      const filterRes = props.searchFunc ? props.searchFunc(value, ordData, props.labelValue) : filter(value, ordData, props.labelValue);
      if (props.sortFunc) {
        filterRes.sort(props.sortFunc);
      }
      ctx.emit("search", filterRes);
      dataList.value = filterRes;
    };
    const inputChange = (event) => {
      const $eventDom = event.target;
      updateValue($eventDom.value);
      const curInstPopover = internalInstance.refs.beSelectPopover;
      if (props.remote && isFunction(props.remoteFunc) && props.remoteFunc) {
        const handleRemote = function() {
          if (!$eventDom.value) {
            curInstPopover.close();
            return;
          }
          curInstPopover.changeDisplay(true);
          loading.value = true;
          props.remoteFunc && props.remoteFunc((query) => {
            loading.value = false;
            handleList(query);
            matchSuggestions($eventDom.value, listCache);
          });
        };
        return debounce(handleRemote, 300).call(this);
      }
      matchSuggestions($eventDom.value, listCache);
    };
    onMounted(() => {
      handleList(props.list);
      addScrollEvt();
    });
    const renderOption = () => {
      const keyValue = (props == null ? void 0 : props.keyValue) || "id";
      const optionList = [];
      dataList.value.forEach((val, index2) => {
        if (props.modelValue === val[props.labelValue]) {
          val.isSelect = true;
        }
        optionList.push(createVNode("div", {
          "class": `
                        ellipsis
                        ${val.type === "group" && index2 !== 0 ? "be-select-option__line" : ""}
                        ${val.isSelect ? "be-select-option__choice" : ""}
                        ${val.type === "group" ? "be-select-option__group" : "be-select-option"}
                        ${val.disabled ? "be-select-option__disabled" : ""}`,
          "key": val[keyValue],
          "onClick": () => {
            if (val.disabled || val.type === "group")
              return;
            handleSelect(val, index2);
          }
        }, [internalInstance.slots.default ? internalInstance.slots.default(val, index2) : val[props.labelValue]]));
      });
      return optionList;
    };
    return () => {
      return createVNode("div", {
        "id": `be_select-${uid}`,
        "class": "be-select"
      }, [createVNode(resolveComponent("be-popover"), {
        "onUpdate": selectOpenChange,
        "trigger": trigger.value,
        "placement": "bottom",
        "ref": "beSelectPopover",
        "trigger-elm": `be_select-${uid}`,
        "custom-class": "be-select-popover"
      }, {
        default: createVNode("div", {
          "style": selectStyle,
          "class": "be-select-option-body"
        }, [createVNode("div", {
          "class": `
                                    be-select-option-container 
                                    scroll-diy 
                                    ${loading.value ? "be-select-loading " : ""}`,
          "id": `be_select_option_container_${uid}`
        }, [loading.value ? createVNode(resolveComponent("be-icon"), {
          "icon": "loading",
          "spin": true,
          "width": "25",
          "height": "25",
          "fill": "#606266"
        }, null) : renderOption()]), renderExtendElm()]),
        trigger: createVNode("div", {
          "class": `be-select-body ${focusClass.value} ${props.customClass}`,
          "id": `be-select-body${uid}`,
          "style": {
            cursor
          },
          "tabindex": `0`,
          "onMouseenter": ($event) => handleMouseEnter($event),
          "onMouseleave": ($event) => handleMouseLeave($event),
          "onFocus": ($event) => handleFocus($event),
          "onBlur": ($event) => handleBlur($event)
        }, [createVNode("input", {
          "readonly": readonlyInput.value,
          "tabindex": `-1`,
          "onFocus": computedPosition,
          "value": props.modelValue,
          "placeholder": props.placeholder,
          "disabled": props.disabled,
          "onInput": ($event) => inputChange($event),
          "style": {
            cursor
          },
          "class": `be-select-input be-select-input__${props.size}`
        }, null), createVNode(resolveComponent("be-icon"), {
          "icon": iconType.value,
          "onClick": ($event) => {
            if (iconType.value === "error") {
              handleClear();
              $event.stopPropagation();
            }
          },
          "class": `be-select-icon`
        }, null)])
      })]);
    };
  }
});
var paginationComponents = defineComponent({
  name: "BePagination",
  components: {
    Pager,
    BeSelect: beSelect
  },
  props: {
    pageSize: {
      type: Number,
      default: 5,
      validator: (value) => {
        return value <= 0 ? false : true;
      }
    },
    currentPage: {
      type: Number,
      default: 1,
      validator: (value) => {
        return value <= 0 ? false : true;
      }
    },
    pageCount: {
      type: Number
    },
    disabled: Boolean,
    disabledJump: Boolean,
    pagerShowCount: {
      type: Number,
      validator: (value) => {
        return value > 2 ? true : false;
      }
    },
    pageNum: {
      type: Array,
      default: () => [{
        label: 100
      }, {
        label: 200
      }, {
        label: 300
      }, {
        label: 400
      }]
    },
    layout: {
      type: Array,
      default: () => ["prev", "page", "jump", "info", "next", "pNum"]
    },
    isOrdianry: {
      type: Boolean,
      default: true
    },
    isDynamic: {
      type: Boolean,
      default: false
    },
    isFront: {
      type: Boolean,
      default: false
    },
    pageData: {
      type: Array,
      default: () => []
    },
    pageUnit: {
      type: String,
      default: "\u9875"
    }
  },
  emits: ["updateNum", "updatePage", "changePage"],
  setup(props, ctx) {
    var _a;
    const curInst = getCurrentInstance();
    let pageParamsFront = reactive({
      maxPageNum: 0
    });
    const jumpPage = ref("");
    const jumpTo = (value) => {
      const curInstRefs = curInst.refs.pager;
      curInstRefs.onPagerClick(null, value);
    };
    const handleEnterEvn = (e) => {
      if (e.key === "Enter" && e.target !== null) {
        const pageCount = props.pageCount ? props.pageCount : 0;
        const maxPageNum = Math.ceil(pageCount / Number(props.pageSize));
        const total = props.isFront ? pageParamsFront.maxPageNum : maxPageNum;
        const value = e.target.value;
        if (/^\d+$/.test(value) && Number(value) <= total) {
          jumpTo(value);
        } else {
          e.target.value = "";
        }
      }
    };
    const pageNumVal = ref("");
    const getPageNum = (data) => {
      const pageCount = props.pageCount ? props.pageCount : 0;
      const maxPageNum = Math.ceil(pageCount / Number(data.label));
      const total = props.isFront ? pageParamsFront.maxPageNum : maxPageNum;
      pageNumVal.value = data.label;
      ctx.emit("updateNum", {
        pageSize: Number(data.label.split(" / ")[0]),
        currentPage: props.currentPage > total ? total : props.currentPage
      });
    };
    const pageNumInner = ref([]);
    const initPageSelect = () => {
      pageNumVal.value = props.pageSize + " / " + props.pageUnit;
      pageNumInner.value = props.pageNum;
      pageNumInner.value.unshift({
        label: props.pageSize
      });
      pageNumInner.value = arrayDeduplicationt(pageNumInner.value, "label");
      pageNumInner.value.sort((a, b) => a.label - b.label);
      pageNumInner.value.map((val) => {
        val.label = val.label + " / " + props.pageUnit;
      });
    };
    if ((_a = props.layout) == null ? void 0 : _a.includes("pNum")) {
      initPageSelect();
    }
    const handleUpdatePage = (data) => {
      ctx.emit("updatePage", data);
    };
    const getPageCount = (data) => {
      pageParamsFront = data;
    };
    const handleChange = (data) => {
      ctx.emit("changePage", data);
    };
    const pageInfoComponent = () => {
      if (props.isDynamic) {
        return;
      }
      const pageCount = props.pageCount ? props.pageCount : 0;
      const maxPageNum = Math.ceil(pageCount / Number(props.pageSize));
      const total = props.isFront ? pageParamsFront.maxPageNum : maxPageNum;
      return createVNode("span", {
        "class": "be-pager--info"
      }, [createTextVNode("\u7B2C"), props.currentPage > total ? total : props.currentPage, createTextVNode("\u9875/\u5171"), total, createTextVNode("\u9875")]);
    };
    const pageJumpComponent = () => {
      const disabled = props.disabled ? true : props.disabledJump ? true : false;
      return createVNode("div", {
        "class": "be-pager--jump"
      }, [createTextVNode("\u8DF3\u81F3"), createVNode("input", {
        "disabled": disabled,
        "class": "be-pager--jump__input",
        "type": "text",
        "value": jumpPage.value,
        "onKeyup": handleEnterEvn
      }, null), createTextVNode("\u9875")]);
    };
    provide("$$BePaginProps", props);
    const pagerMix = reactive({
      jumpPage: jumpPage.value,
      pageParamsFront,
      pageNumVal: pageNumVal.value
    });
    provide("$$BePaginMix", pagerMix);
    return () => {
      var _a2;
      const onEvt = {
        onUpdatePage: handleUpdatePage,
        onChangePage: handleChange,
        onGetPageCount: getPageCount
      };
      const nextSlot = curInst.slots.next ? curInst.slots.next : () => {
      };
      const prevSlot = curInst.slots.prev ? curInst.slots.prev : () => {
      };
      const renderList2 = {
        page: createVNode(Pager, mergeProps({
          "ref": "pager"
        }, onEvt), null),
        jump: pageJumpComponent.call(this),
        info: pageInfoComponent.call(this),
        next: nextSlot(),
        prev: prevSlot(),
        pNum: void 0
      };
      if (!props.isDynamic && ((_a2 = props.layout) == null ? void 0 : _a2.includes("pNum"))) {
        renderList2.pNum = createVNode(resolveComponent("be-select"), {
          "modelValue": pageNumVal.value,
          "onUpdate:modelValue": ($event) => pageNumVal.value = $event,
          "keyValue": "id",
          "disabled": props.disabled,
          "labelValue": "label",
          "custom-class": "be-pager-select",
          "list": pageNumInner.value,
          "onSelect": getPageNum
        }, null);
      }
      return createVNode("div", {
        "class": "be-pager-container"
      }, [props.layout.map((v) => {
        return Object(renderList2)[v];
      })]);
    };
  }
});
var bePager = "";
paginationComponents.install = (app) => {
  app.component(paginationComponents.name, paginationComponents);
};
const BePagination = paginationComponents;
let hiddenTextarea;
const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
const CONTEXT_STYLE = [
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "font-family",
  "font-weight",
  "font-size",
  "text-rendering",
  "text-transform",
  "width",
  "text-indent",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing"
];
function computeNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement);
  const boxSizing = style.getPropertyValue("box-sizing");
  const paddingSize = parseFloat(style.getPropertyValue("padding-bottom")) + parseFloat(style.getPropertyValue("padding-top"));
  const borderSize = parseFloat(style.getPropertyValue("border-bottom-width")) + parseFloat(style.getPropertyValue("border-top-width"));
  const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
  return { contextStyle, paddingSize, borderSize, boxSizing };
}
function computeSingleRowH(scrollHeight, paddingSize) {
  return scrollHeight - paddingSize;
}
function computeMinRowH(height, singleRowHeight, minRows, boxSizing, paddingSize, borderSize) {
  let minHeight = singleRowHeight * minRows;
  if (boxSizing === "border-box") {
    minHeight = minHeight + paddingSize + borderSize;
  }
  return minHeight;
}
function computeMaxRowH(height, singleRowHeight, maxRows, boxSizing, paddingSize, borderSize) {
  if (!maxRows)
    return;
  let maxHeight = singleRowHeight * maxRows;
  if (boxSizing === "border-box") {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  return Math.min(maxHeight, height);
}
function compTextareaHeight(targetElement, minRows = 1, maxRows = null) {
  var _a;
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    document.body.appendChild(hiddenTextarea);
  }
  const { paddingSize, borderSize, boxSizing, contextStyle } = computeNodeStyling(targetElement);
  hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
  let height = hiddenTextarea.scrollHeight;
  const result = {};
  if (boxSizing === "border-box") {
    height = height + borderSize;
  } else if (boxSizing === "content-box") {
    height = height - paddingSize;
  }
  hiddenTextarea.value = "";
  const singleRowHeight = computeSingleRowH(hiddenTextarea.scrollHeight, paddingSize);
  if (minRows !== null) {
    const minHeight = computeMinRowH(height, singleRowHeight, minRows, boxSizing, paddingSize, borderSize);
    result.minHeight = `${minHeight}px`;
  }
  if (maxRows !== null) {
    height = computeMaxRowH(height, singleRowHeight, maxRows, boxSizing, paddingSize, borderSize) || height;
  }
  result.height = `${height}px`;
  (_a = hiddenTextarea.parentNode) == null ? void 0 : _a.removeChild(hiddenTextarea);
  hiddenTextarea = null;
  return result;
}
var beInput_vue_vue_type_style_index_0_lang = "";
const _sfc_main$a = defineComponent({
  name: "BeInput",
  components: { BeIcon: BeIcon$1 },
  props: {
    id: String,
    modelValue: {
      type: [String, Number],
      default: ""
    },
    customClass: {
      type: String,
      default: ""
    },
    maxlength: {
      type: Number,
      default: null
    },
    placeholder: String,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    prevIcon: {
      type: String,
      default: ""
    },
    nextIcon: {
      type: String,
      default: ""
    },
    label: {
      type: String
    },
    tabindex: {
      type: [Number, String]
    },
    inputStyle: {
      type: Object
    },
    rows: {
      type: Number,
      default: 3
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    isInner: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "prevIconClick",
    "nextIconClick",
    "update:modelValue",
    "input",
    "change",
    "clear",
    "focus",
    "blur",
    "keydown",
    "mouseleave",
    "mouseenter"
  ],
  setup(props, ctx) {
    const attrs = useAttrs();
    const internalInstance = getCurrentInstance();
    const inputType = ref(props.type);
    const isPassWord = ref(props.type === "password" ? true : false);
    const handlePassword = () => {
      isPassWord.value = !isPassWord.value;
      if (!isPassWord.value) {
        inputType.value = "text";
      } else {
        inputType.value = props.type;
      }
    };
    const handleChange = (event) => {
      const target = event.target;
      ctx.emit("change", target.value);
    };
    const handleInput = (val) => {
      ctx.emit("update:modelValue", val);
      ctx.emit("input", val);
    };
    const isFocusClass = ref("");
    const handleBlur = (value, event) => {
      isFocusClass.value = "";
      ctx.emit("blur", value, event);
    };
    const handleFocus = (value, event) => {
      isFocusClass.value = "be-input__focus";
      ctx.emit("focus", value, event);
    };
    const handleKeydown = (e) => {
      ctx.emit("keydown", e);
    };
    const handleClear = () => {
      handleInput("");
      ctx.emit("clear");
    };
    const handleIcon = (type) => {
      if (type === "prev") {
        ctx.emit("prevIconClick");
      } else {
        ctx.emit("nextIconClick");
      }
    };
    let showClearIcon = ref(false);
    const handleEnter = (type) => {
      if (type !== "noInputElm") {
        ctx.emit("mouseenter");
      }
      if (props.clearable && type === "noInputElm") {
        showClearIcon.value = true;
      }
    };
    const handleLeave = (type) => {
      if (type !== "noInputElm") {
        ctx.emit("mouseleave");
      }
      if (props.clearable && type === "noInputElm") {
        showClearIcon.value = false;
      }
    };
    const areaStyle = ref({});
    const resizeTextarea = () => {
      const { autosize } = props;
      if (inputType.value !== "textarea")
        return;
      if (autosize) {
        const minRows = isObject(autosize) ? autosize.minRows : void 0;
        const maxRows = isObject(autosize) ? autosize.maxRows : void 0;
        areaStyle.value = __spreadValues({}, compTextareaHeight(curInstAreaRefs, minRows, maxRows));
      } else {
        areaStyle.value = {
          minHeight: compTextareaHeight(curInstAreaRefs, props.rows).minHeight
        };
      }
    };
    const computedTextareaStyle = computed(() => __spreadValues(__spreadValues({}, props.inputStyle), areaStyle.value));
    watch(() => props.modelValue, () => {
      nextTick(resizeTextarea);
    });
    const beInputInner = ref(null);
    let curInstInputRefs = null;
    let curInstAreaRefs = null;
    nextTick(() => {
      curInstInputRefs = internalInstance.refs.beInputInner && reactive(internalInstance.refs.beInputInner);
      curInstAreaRefs = internalInstance.refs.beInputAreaInner && reactive(internalInstance.refs.beInputAreaInner);
      beInputInner.value = inputType.value === "textarea" ? curInstAreaRefs : curInstInputRefs;
    });
    const inputOrTextarea = computed(() => {
      return beInputInner.value;
    });
    const focus = () => {
      nextTick(() => {
        inputOrTextarea.value.focus();
      });
    };
    const blur = () => {
      inputOrTextarea.value.blur();
    };
    const select = () => {
      inputOrTextarea.value.select();
    };
    onMounted(() => {
      nextTick(resizeTextarea);
    });
    return {
      isFocusClass,
      uid: internalInstance.uid,
      attrs,
      beInputInner,
      inputOrTextarea,
      inputType,
      isPassWord,
      computedTextareaStyle,
      focus,
      select,
      handleKeydown,
      blur,
      showClearIcon,
      handleChange,
      handlePassword,
      handleInput,
      handleIcon,
      handleClear,
      handleFocus,
      handleBlur,
      handleEnter,
      handleLeave
    };
  }
});
const _hoisted_1$3 = ["id"];
const _hoisted_2 = ["id", "disabled", "placeholder", "value", "maxlength", "tabindex", "aria-label", "type"];
const _hoisted_3 = {
  key: 2,
  class: "be-input-close-body"
};
const _hoisted_4 = { class: "be-input-close-body" };
const _hoisted_5 = {
  key: 1,
  class: "be-input-body"
};
const _hoisted_6 = ["tabindex", "aria-label", "value", "disabled", "placeholder"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_icon = resolveComponent("be-icon");
  return openBlock(), createElementBlock("div", {
    id: `be_input_${_ctx.uid}`,
    class: normalizeClass(`
        be-input
        be-input__${_ctx.size}
        ${_ctx.isFocusClass}
        ${_ctx.disabled ? "be-input__disabled " : ""}
        ${_ctx.inputType === "textarea" ? "be-input__textarea" : ""}
        ${_ctx.customClass}`)
  }, [
    renderSlot(_ctx.$slots, "prev"),
    _ctx.inputType !== "textarea" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "be-input-body",
      onMouseenter: _cache[9] || (_cache[9] = ($event) => _ctx.handleEnter("noInputElm")),
      onMouseleave: _cache[10] || (_cache[10] = ($event) => _ctx.handleLeave("noInputElm"))
    }, [
      _ctx.prevIcon ? (openBlock(), createBlock(_component_be_icon, {
        key: 0,
        icon: _ctx.prevIcon,
        class: "be-input-prevIcon",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleIcon("prev"))
      }, null, 8, ["icon"])) : createCommentVNode("", true),
      createElementVNode("input", mergeProps({
        id: _ctx.id,
        ref: "beInputInner",
        disabled: _ctx.disabled,
        placeholder: _ctx.placeholder,
        value: _ctx.modelValue,
        maxlength: _ctx.maxlength,
        tabindex: _ctx.tabindex,
        "aria-label": _ctx.label,
        type: _ctx.inputType,
        style: _ctx.computedTextareaStyle
      }, _ctx.attrs, {
        class: `be-input__inner ${_ctx.disabled ? "be-input__disabled" : ""}`,
        onFocus: _cache[1] || (_cache[1] = ($event) => _ctx.handleFocus($event.target.value, $event)),
        onBlur: _cache[2] || (_cache[2] = ($event) => _ctx.handleBlur($event.target.value, $event)),
        onChange: _cache[3] || (_cache[3] = (...args) => _ctx.handleChange && _ctx.handleChange(...args)),
        onKeydown: _cache[4] || (_cache[4] = (...args) => _ctx.handleKeydown && _ctx.handleKeydown(...args)),
        onMouseenter: _cache[5] || (_cache[5] = (...args) => _ctx.handleEnter && _ctx.handleEnter(...args)),
        onMouseleave: _cache[6] || (_cache[6] = (...args) => _ctx.handleLeave && _ctx.handleLeave(...args)),
        onInput: _cache[7] || (_cache[7] = ($event) => _ctx.handleInput($event.target.value))
      }), null, 16, _hoisted_2),
      _ctx.nextIcon ? (openBlock(), createBlock(_component_be_icon, {
        key: 1,
        icon: _ctx.nextIcon,
        class: "be-input-nextIcon",
        onClick: _cache[8] || (_cache[8] = ($event) => _ctx.handleIcon("next"))
      }, null, 8, ["icon"])) : createCommentVNode("", true),
      !_ctx.isInner && _ctx.showClearIcon ? (openBlock(), createElementBlock("div", _hoisted_3, [
        createVNode(_component_be_icon, {
          icon: "deleteIc",
          class: "be-input-icon be-input-close",
          onClick: _ctx.handleClear
        }, null, 8, ["onClick"])
      ])) : createCommentVNode("", true),
      withDirectives(createElementVNode("div", _hoisted_4, [
        createVNode(_component_be_icon, {
          icon: `${_ctx.isPassWord ? "noEye" : "eye"}`,
          class: "be-input-icon be-input-password",
          onClick: _ctx.handlePassword
        }, null, 8, ["icon", "onClick"])
      ], 512), [
        [vShow, _ctx.showPassword]
      ])
    ], 32)) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "next"),
    _ctx.inputType === "textarea" ? (openBlock(), createElementBlock("div", _hoisted_5, [
      createElementVNode("textarea", mergeProps({
        ref: "beInputAreaInner",
        class: "be-input__textarea__inner"
      }, _ctx.attrs, {
        tabindex: _ctx.tabindex,
        "aria-label": _ctx.label,
        value: _ctx.modelValue,
        style: _ctx.computedTextareaStyle,
        disabled: _ctx.disabled,
        placeholder: _ctx.placeholder,
        onFocus: _cache[11] || (_cache[11] = ($event) => _ctx.handleFocus($event.target.value, $event)),
        onBlur: _cache[12] || (_cache[12] = ($event) => _ctx.handleBlur($event.target.value, $event)),
        onChange: _cache[13] || (_cache[13] = (...args) => _ctx.handleChange && _ctx.handleChange(...args)),
        onKeydown: _cache[14] || (_cache[14] = (...args) => _ctx.handleKeydown && _ctx.handleKeydown(...args)),
        onInput: _cache[15] || (_cache[15] = ($event) => _ctx.handleInput($event.target.value))
      }), "\r\n      ", 16, _hoisted_6)
    ])) : createCommentVNode("", true)
  ], 10, _hoisted_1$3);
}
var BeInput$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
BeInput$1.install = (app) => {
  app.component(BeInput$1.name, BeInput$1);
};
const BeInput = BeInput$1;
const _sfc_main$9 = defineComponent({
  name: "BeAutocomplete",
  components: { BeInputSelect, BeInput: BeInput$1, BePopover: BePopover$1 },
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: ""
    },
    focusTrigger: {
      type: Boolean,
      default: true
    },
    suggestionList: {
      type: Array,
      default: () => []
    },
    labelValue: {
      type: String,
      default: "label"
    },
    keyValue: {
      type: String,
      default: "id"
    },
    fetchSuggestions: {
      type: Function
    }
  },
  emits: [
    "update:modelValue",
    "input",
    "change",
    "focus",
    "blur",
    "clear",
    "prevIconClick",
    "nextIconClick",
    "select"
  ],
  setup(props, ctx) {
    const attrs = useAttrs();
    const internalInstance = getCurrentInstance();
    const valInner = ref("");
    const handleChange = () => {
      ctx.emit("change", valInner.value);
    };
    const handleInput = () => {
      let suggestionList = props.suggestionList.length > 0 ? props.suggestionList : listDataCache;
      if (props.focusTrigger) {
        matchSuggestions(valInner.value, suggestionList);
      } else {
        if (props.fetchSuggestions) {
          getSuggestions((list) => {
            matchSuggestions(valInner.value, list);
            showPopover();
          });
        } else {
          matchSuggestions(valInner.value, suggestionList);
          showPopover();
        }
      }
      ctx.emit("update:modelValue", valInner.value);
      ctx.emit("input", valInner.value);
    };
    const handleBlur = () => {
      ctx.emit("blur", valInner.value);
    };
    let eventDom = null;
    const handleFocus = (value, event) => {
      const $eventDom = event.target.parentElement;
      eventDom = $eventDom;
      computedPosition($eventDom);
      ctx.emit("focus", valInner.value);
      if (props.fetchSuggestions && props.focusTrigger) {
        getSuggestions();
      }
    };
    const handleClear = () => {
      ctx.emit("clear");
    };
    const handleIconClickPrev = () => {
      ctx.emit("prevIconClick");
    };
    const handleIconClickNext = () => {
      ctx.emit("nextIconClick");
    };
    let selectStyle = reactive({ width: "0px" });
    let selectList = ref(props.suggestionList);
    const computedPosition = ($eventDom) => {
      if (!$eventDom)
        return;
      selectStyle.width = Number(window.getComputedStyle($eventDom).width.split("px")[0]) + "px";
    };
    const matchSuggestions = (value, ordData) => {
      nextTick(() => {
        selectList.value = value ? ordData.filter((val) => {
          return val[props.labelValue].toString().toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }) : ordData;
      });
    };
    const showPopover = () => {
      const curInstPopover = internalInstance.refs.beInputPopover;
      curInstPopover.changeDisplay(true);
    };
    let listDataCache = [];
    const loading = ref(false);
    const getSuggestions = (cb = () => {
    }) => {
      nextTick(() => {
        if (props.fetchSuggestions) {
          loading.value = true;
          props.fetchSuggestions((listData) => {
            selectList.value = jsonClone(listData);
            listDataCache = jsonClone(listData);
            if (cb)
              cb(listDataCache);
            loading.value = false;
          });
        }
      });
    };
    const handleSelect = (value, index2) => {
      valInner.value = value[props.labelValue];
      ctx.emit("update:modelValue", value);
      handleChange();
      ctx.emit("select", value, index2);
      const curInstPopover = internalInstance.refs.beInputPopover;
      curInstPopover.close();
      listDataCache = [];
    };
    const modelValComp = computed(() => {
      return props.modelValue;
    });
    watch(modelValComp, (nVal) => {
      if (isString(nVal)) {
        valInner.value = nVal;
      }
      if (isObject(nVal)) {
        valInner.value = Object(nVal[props.labelValue]);
      }
    });
    const initInnerVal = (nVal) => {
      if (isString(nVal)) {
        valInner.value = nVal;
      }
      if (isObject(nVal)) {
        valInner.value = Object(nVal[props.labelValue]);
      }
    };
    onMounted(() => {
      initInnerVal(props.modelValue);
      const $eventDom = eventDom;
      computedPosition($eventDom);
    });
    return {
      loading,
      selectList,
      handleSelect,
      selectStyle,
      uid: internalInstance.uid,
      attrs,
      valInner,
      handleChange,
      handleInput,
      handleBlur,
      handleFocus,
      handleIconClickPrev,
      handleIconClickNext,
      handleClear
    };
  }
});
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_be_input = resolveComponent("be-input");
  const _component_be_input_select = resolveComponent("be-input-select");
  const _component_be_popover = resolveComponent("be-popover");
  return openBlock(), createBlock(_component_be_popover, {
    ref: "beInputPopover",
    trigger: _ctx.focusTrigger ? "click" : "none",
    placement: "bottom",
    "trigger-elm": `be_input_select_inner_${_ctx.uid}`,
    "custom-class": "be-input-select-popover"
  }, {
    trigger: withCtx(() => [
      createVNode(_component_be_input, mergeProps({
        id: `be_input_select_inner_${_ctx.uid}`
      }, _ctx.attrs, {
        ref: "beInputInner",
        modelValue: _ctx.valInner,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.valInner = $event),
        onChange: _ctx.handleChange,
        onInput: _ctx.handleInput,
        onFocus: _ctx.handleFocus,
        onBlur: _ctx.handleBlur,
        onClear: _ctx.handleClear,
        onPrevIconClick: _ctx.handleIconClickPrev,
        onNextIconClick: _ctx.handleIconClickNext
      }), {
        prev: withCtx(() => [
          renderSlot(_ctx.$slots, "prev")
        ]),
        next: withCtx(() => [
          renderSlot(_ctx.$slots, "next")
        ]),
        _: 3
      }, 16, ["id", "modelValue", "onChange", "onInput", "onFocus", "onBlur", "onClear", "onPrevIconClick", "onNextIconClick"])
    ]),
    default: withCtx(() => [
      createVNode(Transition, { name: "dialog-fade" }, {
        default: withCtx(() => [
          createVNode(_component_be_input_select, {
            loading: _ctx.loading,
            "key-value": _ctx.keyValue,
            "label-value": _ctx.labelValue,
            "select-style": _ctx.selectStyle,
            "select-list": _ctx.selectList,
            onSelect: _ctx.handleSelect
          }, {
            "cus-temp": withCtx((slotProps) => [
              renderSlot(_ctx.$slots, "cus-temp", {
                item: slotProps.item
              })
            ]),
            _: 3
          }, 8, ["loading", "key-value", "label-value", "select-style", "select-list", "onSelect"])
        ]),
        _: 3
      })
    ]),
    _: 3
  }, 8, ["trigger", "trigger-elm"]);
}
var beAutocomplete = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
beAutocomplete.install = (app) => {
  app.component(beAutocomplete.name, beAutocomplete);
};
const BeAutocomplete = beAutocomplete;
var beTag_vue_vue_type_style_index_0_lang = "";
const _sfc_main$8 = defineComponent({
  name: "BeTag",
  components: { BeIcon: BeIcon$1 },
  props: {
    size: {
      type: String,
      default: "medium"
    },
    type: {
      type: String,
      default: "default"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: [Number, String],
      default: 0
    },
    isClose: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default: () => {
        return {};
      }
    },
    customClass: {
      type: String,
      default: ""
    }
  },
  emits: ["close"],
  setup(props, ctx) {
    var _a, _b, _c;
    const handleClose = (event) => {
      event.stopPropagation();
      if (props.disabled) {
        return;
      }
      ctx.emit("close", event);
    };
    let styleOption = reactive({});
    styleOption = {
      borderRadius: `${props.round}px`,
      backgroundColor: ((_a = props.option) == null ? void 0 : _a.backgroundColor) || "",
      border: ((_b = props.option) == null ? void 0 : _b.border) || "",
      color: ((_c = props.option) == null ? void 0 : _c.color) || ""
    };
    return {
      handleClose,
      styleOption
    };
  }
});
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b;
  const _component_be_icon = resolveComponent("be-icon");
  return openBlock(), createElementBlock("div", {
    style: normalizeStyle(_ctx.styleOption),
    class: normalizeClass(`
  be-tag
  be-tag__${_ctx.disabled ? "disabled" : ""}
  be-tag__${_ctx.type}
  be-tag__${_ctx.size}
  ${_ctx.customClass}
  `)
  }, [
    createElementVNode("span", {
      style: normalizeStyle({ color: (_a = _ctx.styleOption) == null ? void 0 : _a.color }),
      class: normalizeClass({ "be\u2014tag--close": _ctx.isClose })
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 6),
    _ctx.isClose ? (openBlock(), createBlock(_component_be_icon, {
      key: 0,
      icon: "deleteIc",
      class: "be-tag_close",
      style: normalizeStyle({ fill: (_b = _ctx.styleOption) == null ? void 0 : _b.color }),
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleClose($event))
    }, null, 8, ["style"])) : createCommentVNode("", true)
  ], 6);
}
var BeTag$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const tag = BeTag$1;
tag.install = (app) => {
  app.component(tag.name || "", tag);
};
const BeTag = tag;
var beInputNumber$1 = defineComponent({
  name: "BeInputNumber",
  components: {
    beInput: BeInput,
    beIcon: BeIcon
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    size: {
      type: String,
      default: "medium"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    keyboard: {
      type: Boolean,
      default: false
    },
    parser: {
      type: Function,
      default: (val) => val
    },
    formatter: {
      type: Function,
      default: (val) => val
    },
    max: {
      type: [String, Number],
      default: ""
    },
    min: {
      type: [String, Number],
      default: ""
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: ["update:modelValue", "change", "blur", "focus", "select", "step", "pressEnter"],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    const uid = internalInstance.uid;
    const attrs = useAttrs();
    const tabindex = ref(1);
    const handleFocus = (event) => {
      ctx.emit("focus", event);
      tabindex.value = -1;
    };
    const handleBlur = (val) => {
      ctx.emit("blur", val);
      tabindex.value = 1;
    };
    const inputInnerVal = ref("");
    const handleInput = (value) => {
      let parserRes = props.parser(value);
      let pointCheck = false;
      const splitRes = parserRes.split(".");
      splitRes.forEach((val) => {
        if (!val) {
          pointCheck = true;
        }
      });
      if (!pointCheck && !checkNumber(parserRes)) {
        parserRes = "";
      }
      inputInnerVal.value = "";
      nextTick(() => {
        if (pointCheck) {
          inputInnerVal.value = props.formatter(parserRes);
        } else {
          const val = limitValue(parserRes).val;
          inputInnerVal.value = props.formatter(val);
          updateInput(val);
        }
      });
    };
    const updateInput = (value) => {
      ctx.emit("update:modelValue", value);
    };
    const limitValue = (value) => {
      if (!value)
        return {
          val: value,
          type: ""
        };
      const val = Number(value);
      const max2 = props.max !== "" ? Number(props.max) : null;
      const min2 = props.min !== "" ? Number(props.min) : null;
      if (max2 && min2 && min2 <= val && val <= max2 && max2 && min2 || !max2 && !min2 || min2 && val >= min2 && !max2 || max2 && val <= max2 && !min2) {
        return {
          val,
          type: ""
        };
      }
      if (min2 && val < min2) {
        return {
          val: min2,
          type: "limit"
        };
      }
      if (max2 && val > max2) {
        return {
          val: max2,
          type: "limit"
        };
      }
    };
    const handleChange = (value) => {
      const val = props.parser(value);
      if (!val) {
        inputInnerVal.value = props.formatter(val);
      }
      ctx.emit("change", val);
    };
    const handleReduce = () => {
      if (props.disabled)
        return;
      const res = accSub([Number(props.modelValue), Number(props.step)]);
      updateInput(limitValue(res).val);
      ctx.emit("step", {
        value: res,
        type: "reduce"
      });
    };
    const handleIncrease = () => {
      if (props.disabled)
        return;
      const res = accAdd(Number(props.modelValue), Number(props.step));
      updateInput(limitValue(res).val);
      ctx.emit("step", {
        value: res,
        type: "increase"
      });
    };
    const handleKeyDown = (event) => {
      if (!props.keyboard)
        return;
      if (event.key === "ArrowUp") {
        handleIncrease();
      }
      if (event.key === "ArrowDown") {
        handleReduce();
      }
      if (event.key === "Enter") {
        ctx.emit("pressEnter", props.modelValue);
      }
    };
    const beInputInner = ref(null);
    nextTick(() => {
      beInputInner.value = internalInstance.refs[`beInputInner${uid}`] && reactive(internalInstance.refs[`beInputInner${uid}`]);
    });
    const inputInnerInst = computed(() => {
      return beInputInner.value;
    });
    const focus = () => {
      nextTick(() => {
        inputInnerInst.value.focus();
        ctx.emit("focus");
      });
    };
    const blur = () => {
      inputInnerInst.value.blur();
      ctx.emit("blur");
    };
    const select = () => {
      inputInnerInst.value.select();
      ctx.emit("select");
    };
    const renderPreSlot = () => {
      if (internalInstance.slots.pre) {
        return createVNode("div", {
          "class": "be-input-number__pre"
        }, [internalInstance.slots.pre()]);
      } else {
        return "";
      }
    };
    const renderNextSlot = () => {
      if (internalInstance.slots.next) {
        return createVNode("div", {
          "class": "be-input-number__next"
        }, [internalInstance.slots.next()]);
      } else {
        return "";
      }
    };
    const init = () => {
      if (props.modelValue && checkNumber(props.modelValue.toString()) || props.modelValue === 0) {
        inputInnerVal.value = props.formatter(props.modelValue);
      }
    };
    const modelVal = computed(() => props.modelValue);
    watch(modelVal, (nVal) => {
      if (nVal) {
        inputInnerVal.value = props.formatter(nVal);
      }
    });
    const showLimit = computed(() => {
      return limitValue(props.modelValue).type;
    });
    onMounted(() => {
      init();
    });
    return {
      uid,
      attrs,
      inputInnerVal,
      showLimit,
      tabindex,
      blur,
      select,
      focus,
      handleFocus,
      handleBlur,
      handleChange,
      renderPreSlot,
      handleInput,
      handleIncrease,
      handleReduce,
      renderNextSlot,
      handleKeyDown
    };
  },
  render() {
    return createVNode("div", {
      "class": `
                     be-input-number 
                     ${this.disabled ? "be-input-number__disabled " : ""}`,
      "id": `be_input_number${this.uid}`,
      "onFocus": ($event) => this.handleFocus($event),
      "onBlur": ($event) => this.handleBlur($event),
      "onKeydown": ($event) => this.handleKeyDown($event),
      "tabindex": "0"
    }, [this.renderPreSlot(), createVNode("div", {
      "class": `be-input-number__${this.size} be-input-number__default`
    }, [createVNode(resolveComponent("be-input"), mergeProps({
      "tabindex": this.tabindex,
      "ref": `beInputInner${this.uid}`
    }, this.attrs, {
      "size": this.size,
      "isInner": true,
      "onChange": this.handleChange,
      "disabled": this.disabled,
      "onFocus": (val, $event) => this.handleFocus($event),
      "onBlur": (val) => this.handleBlur(val),
      "custom-class": `be-input-number__inner be-input-number__${this.showLimit}`,
      "value": this.inputInnerVal,
      "onInput": this.handleInput
    }), null), createVNode("div", {
      "class": `
                         be-input-number__op 
                         ${this.disabled ? "be-input-number__op__disabled " : ""}`,
      "onBlur": ($event) => this.handleBlur($event),
      "onFocus": ($event) => this.handleFocus($event),
      "tabindex": "1"
    }, [createVNode(resolveComponent("be-icon"), {
      "icon": "up",
      "class": "be-input-number__up",
      "tabindex": "2",
      "onClick": this.handleIncrease,
      "className": "be-input-number__up"
    }, null), createVNode(resolveComponent("be-icon"), {
      "icon": "under",
      "class": "be-input-number__down",
      "tabindex": "2",
      "onClick": this.handleReduce
    }, null)])]), this.renderNextSlot()]);
  }
});
var beInputNumber = "";
beInputNumber$1.install = (app) => {
  app.component(beInputNumber$1.name, beInputNumber$1);
};
const BeInputNumber = beInputNumber$1;
var beSelectMultiple = defineComponent({
  name: "BeSelectMultiple",
  components: {
    BeInputSelect,
    BePopover: BePopover$1,
    BeIcon: BeIcon$1,
    BeTag: BeTag$1
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    list: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    labelValue: {
      type: String,
      default: "label"
    },
    keyValue: {
      type: String
    },
    placeholder: {
      type: String,
      default: "\u8BF7\u9009\u62E9"
    },
    clear: {
      type: Boolean,
      default: false
    },
    selectIcon: {
      type: String,
      default: "under"
    },
    group: {
      type: Boolean,
      default: false
    },
    extend: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    searchFunc: {
      type: Function
    },
    sortFunc: {
      type: Function
    },
    remote: {
      type: Boolean,
      default: false
    },
    remoteFunc: {
      type: Function
    },
    customClass: {
      type: String,
      default: ""
    },
    maxTag: {
      type: String
    },
    max: {
      type: String
    }
  },
  emits: ["update:modelValue", "select", "focus", "blur", "openChange", "clear", "search", "MouseEnter", "MouseLeave", "scroll", "closeTag", "Deselect", "change"],
  setup(props, ctx) {
    const {
      focusClass,
      internalInstance,
      uid,
      dataList,
      list,
      readonlyInput,
      cursor,
      selectStyle,
      iconType,
      trigger,
      loading,
      addItemList,
      addItem,
      handleInput,
      addItemToList,
      computedPosition,
      updatePopover,
      addScrollEvt,
      handleMouseLeave,
      handleMouseEnter,
      selectOpenChange,
      handleBlur,
      handleFocus,
      changeIcon
    } = composition(props, ctx);
    let {
      listCache
    } = composition(props, ctx);
    watch(list, (nVal, oVal) => {
      if (nVal !== oVal) {
        handleList(props.list);
      }
    });
    const handleList = (propList) => {
      const list2 = jsonClone(propList);
      if (props.group) {
        const arr = [];
        list2.forEach((res) => {
          var _a;
          res.isSelect = false;
          const group = __spreadValues({}, res);
          delete group.children;
          arr.push(group);
          if (((_a = res.children) == null ? void 0 : _a.length) > 0) {
            res.children.forEach((childRes) => {
              arr.push(childRes);
            });
          }
        });
        dataList.value = arr;
      } else {
        if (!props.keyValue) {
          list2.forEach((val) => {
            val.isSelect = false;
            val.id = getUuid();
          });
        }
        if (props.keyValue) {
          list2.forEach((val) => {
            val.isSelect = false;
            if (!val[props.keyValue || "id"]) {
              val[props.keyValue || "id"] = getUuid();
            }
          });
        }
        dataList.value = list2;
      }
      listCache = jsonClone(dataList.value);
    };
    const renderExtendElm = () => {
      if (props.extend && !props.group) {
        return createVNode("div", {
          "class": `
                        be-select-option__extend`
        }, [createVNode(resolveComponent("be-input"), {
          "value": addItem.value,
          "onInput": handleInput
        }, null), createVNode(resolveComponent("be-icon"), {
          "icon": "add",
          "onClick": addItemToList
        }, null)]);
      }
    };
    const matchSuggestions = (inputValue, ordData) => {
      if (tagList.value.length >= Number(props.max) && props.max) {
        return;
      }
      const value = jsonClone(inputValue);
      const filter = (value2, ordData2, labelValue) => {
        const arr = value2 ? ordData2.filter((val) => {
          return val[labelValue].toString().toLowerCase().indexOf(value2.toLowerCase()) >= 0;
        }) : ordData2;
        return {
          data: arr.length > 0 ? jsonClone(arr) : jsonClone(ordData2),
          isHas: arr.length > 0
        };
      };
      const dataL = jsonClone(ordData);
      let filterRes = [];
      if (value) {
        const isHasComma = value.indexOf(",") >= 0;
        if (isHasComma)
          inputMultiple.value = "";
        let inputVal = value.split(",").filter((res) => res);
        inputVal = Array.from(new Set(inputVal));
        const tagListLabel = tagList.value.map((res) => res.label);
        inputVal = [.../* @__PURE__ */ new Set([...tagListLabel, ...inputVal])];
        let hasList = [];
        const addList = [];
        inputVal.forEach((res) => {
          const filterResult = filter(res, dataL, label);
          const item = {};
          item[label] = res;
          if (!filterResult.isHas) {
            item[keyId] = getUuid();
            if (isHasComma) {
              item.isAutoAdd = true;
              selectMap.set(item[keyId], item);
              updateValue();
              addItemList.value.push(item);
            }
            item.isAutoAdd = true;
            addList.push(item);
            dataL.push(item);
          } else {
            if (isHasComma) {
              let isHas = false;
              dataList.value.forEach((dataRes) => {
                if (res === dataRes[label]) {
                  isHas = true;
                  if (!selectMap.has(dataRes[keyId])) {
                    selectMap.set(dataRes[keyId], dataRes);
                  }
                }
              });
              if (!isHas) {
                item.isAutoAdd = true;
                item[keyId] = getUuid();
                selectMap.set(item[keyId], item);
                addList.push(item);
                dataL.push(item);
              }
              updateValue();
            }
            hasList = arrDupRemov([...filterResult.data, ...hasList], keyId);
          }
        });
        filterRes = hasList.concat(addList);
        if (props.sortFunc) {
          filterRes.sort(props.sortFunc);
        }
        ctx.emit("search", filterRes);
        dataList.value = isHasComma ? dataL : filterRes;
      } else {
        dataList.value = jsonClone(ordData);
      }
      tagList.value.forEach((tag2) => {
        setSelectState(true, tag2[keyId]);
      });
    };
    const inputChange = (event) => {
      const $eventDom = event.target;
      inputMultiple.value = $eventDom.value;
      txtWidth.value = textWidth($eventDom.value);
      updatePopover();
      ctx.emit("change", $eventDom);
      const curInstPopover = internalInstance.refs.beSelectPopover;
      if (props.remote && isFunction(props.remoteFunc) && props.remoteFunc) {
        const handleRemote = function() {
          if (!$eventDom.value) {
            curInstPopover.close();
            return;
          }
          curInstPopover.changeDisplay(true);
          loading.value = true;
          props.remoteFunc && props.remoteFunc((query) => {
            loading.value = false;
            handleList(query);
            matchSuggestions($eventDom.value, listCache);
          });
        };
        return debounce(handleRemote, 300).call(this);
      }
      matchSuggestions($eventDom.value, listCache.concat(addItemList.value));
    };
    const tagList = ref([]);
    const inputMultiple = ref("");
    const txtWidth = ref(0);
    const label = props.labelValue || "label";
    const keyId = props.keyValue || "id";
    let selectMap = /* @__PURE__ */ new Map();
    const handleSelect = (value, index2) => {
      if (tagList.value.length >= Number(props.max) && props.max) {
        return;
      }
      const itemLabel = value[keyId];
      if (selectMap.has(itemLabel)) {
        if (value.isAutoAdd) {
          addItemList.value = addItemList.value.filter((val) => val[keyId] !== value[keyId]);
        }
        selectMap.delete(itemLabel);
        value.isSelect = false;
        ctx.emit("Deselect", value, index2);
      } else {
        if (value.isAutoAdd) {
          addItemList.value.push(value);
        }
        selectMap.set(itemLabel, value);
        value.isSelect = true;
        ctx.emit("select", value, index2);
      }
      ctx.emit("change", value);
      inputMultiple.value = "";
      dataList.value = listCache.concat(addItemList.value);
      updateValue();
      tagList.value.forEach((tag2) => {
        setSelectState(tag2.isSelect, tag2[keyId]);
      });
      updatePopover();
    };
    const updateValue = () => {
      const res = jsonClone(mapToArr(selectMap));
      tagList.value = res;
      ctx.emit("update:modelValue", res);
    };
    const handleClear = () => {
      selectMap = /* @__PURE__ */ new Map();
      tagList.value = [];
      inputMultiple.value = "";
      txtWidth.value = 0;
      ctx.emit("clear");
      updateValue();
      changeIcon(props.selectIcon);
      dataList.value = listCache;
    };
    const initTagList = () => {
      tagList.value = props.modelValue;
      tagList.value.forEach((tag2) => {
        tag2.isSelect = true;
        selectMap.set(tag2[keyId], tag2);
        setSelectState(true, tag2[keyId]);
      });
    };
    const setSelectState = (state, match) => {
      dataList.value.forEach((select) => {
        if (select[keyId] === match) {
          select.isSelect = state;
        }
      });
    };
    const textWidth = (text) => {
      const sensor = document.createElement("a");
      sensor.innerHTML = text;
      const body = document.getElementsByTagName("body")[0];
      body.appendChild(sensor);
      const width = sensor.offsetWidth;
      body.removeChild(sensor);
      return width;
    };
    const closeTag = (closeVal) => {
      const value = closeVal.isNum ? tagList.value.pop() : closeVal;
      selectMap.delete(value[keyId]);
      setSelectState(false, value[keyId]);
      if (value.isAutoAdd) {
        addItemList.value = addItemList.value.filter((val) => val[keyId] !== value[keyId]);
        dataList.value = listCache.concat(addItemList.value);
      }
      updateValue();
      updatePopover();
      ctx.emit("closeTag", value);
    };
    onMounted(() => {
      handleList(props.list);
      addScrollEvt();
      initTagList();
    });
    const renderTags = () => {
      var _a;
      if (!tagList.value || ((_a = tagList.value) == null ? void 0 : _a.length) === 0) {
        return;
      }
      let renderTag = jsonClone(tagList.value);
      if (props.maxTag && tagList.value.length > Number(props.maxTag)) {
        renderTag = renderTag.slice(0, Number(props.maxTag));
        const numTag = {};
        numTag[keyId] = getUuid();
        numTag[label] = `+${tagList.value.length - Number(props.maxTag)}`;
        numTag.isNum = true;
        renderTag.push(numTag);
      }
      const list2 = [];
      renderTag.forEach((val, index2) => {
        list2.push(createVNode("div", {
          "class": "be-select-tag"
        }, [internalInstance.slots.tag ? internalInstance.slots.tag({
          data: val,
          index: index2
        }) : createVNode(resolveComponent("be-tag"), {
          "key": val.label + "tag",
          "isClose": true,
          "type": "info",
          "size": "mini",
          "customClass": "ellipsis",
          "onClose": () => closeTag(val)
        }, {
          default: () => [val[label]]
        })]));
      });
      return list2;
    };
    const renderOption = () => {
      const keyValue = (props == null ? void 0 : props.keyValue) || "id";
      const optionList = [];
      dataList.value.forEach((val, index2) => {
        optionList.push(createVNode("div", {
          "class": `
                        ellipsis
                        ${val.type === "group" && index2 !== 0 ? "be-select-option__line" : ""}
                         ${val.isSelect ? "be-select-option__choice" : ""}
                        ${val.type === "group" ? "be-select-option__group" : "be-select-option"}
                        ${val.disabled ? "be-select-option__disabled" : ""}`,
          "key": val[keyValue],
          "onClick": () => {
            if (val.disabled || val.type === "group")
              return;
            handleSelect(val, index2);
          }
        }, [internalInstance.slots.default ? internalInstance.slots.default({
          data: val,
          index: index2
        }) : val[props.labelValue], val.isSelect ? createVNode(resolveComponent("be-icon"), {
          "icon": "select",
          "custom-class": `be-select-hook`
        }, null) : ""]));
      });
      return optionList;
    };
    return () => {
      return createVNode("div", {
        "id": `be_select-${uid}`,
        "class": "be-select"
      }, [createVNode(resolveComponent("be-popover"), {
        "onUpdate": selectOpenChange,
        "trigger": trigger.value,
        "placement": "bottom",
        "ref": "beSelectPopover",
        "trigger-elm": `be_select-${uid}`,
        "custom-class": "be-select-popover"
      }, {
        default: createVNode("div", {
          "style": selectStyle,
          "class": "be-select-option-body"
        }, [createVNode("div", {
          "class": `
                                    be-select-option-container 
                                    scroll-diy 
                                    ${loading.value ? "be-select-loading " : ""}`,
          "id": `be_select_option_container_${uid}`
        }, [loading.value ? createVNode(resolveComponent("be-icon"), {
          "icon": "loading",
          "spin": true,
          "width": "25",
          "height": "25",
          "fill": "#606266"
        }, null) : renderOption()]), renderExtendElm()]),
        trigger: createVNode("div", {
          "class": `be-select-body ${focusClass.value} ${props.customClass}`,
          "id": `be-select-body${uid}`,
          "style": {
            cursor
          },
          "tabindex": `0`,
          "onMouseenter": ($event) => handleMouseEnter($event),
          "onMouseleave": ($event) => handleMouseLeave($event),
          "onFocus": ($event) => handleFocus($event),
          "onBlur": ($event) => handleBlur($event)
        }, [renderTags(), createVNode("input", {
          "readonly": readonlyInput.value,
          "tabindex": `-1`,
          "onFocus": computedPosition,
          "value": inputMultiple.value,
          "disabled": props.disabled,
          "onInput": ($event) => inputChange($event),
          "style": {
            cursor,
            width: txtWidth.value + "px"
          },
          "class": `be-select-input be-select-input__${props.size}`
        }, null), createVNode(resolveComponent("be-icon"), {
          "icon": iconType.value,
          "onClick": ($event) => {
            if (iconType.value === "error") {
              handleClear();
              $event.stopPropagation();
            }
          },
          "class": `be-select-icon`
        }, null)])
      })]);
    };
  }
});
beSelect.install = (app) => {
  app.component(beSelect.name, beSelect);
};
const BeSelect = beSelect;
beSelectMultiple.install = (app) => {
  app.component(beSelectMultiple.name, beSelectMultiple);
};
const BeSelectMultiple = beSelectMultiple;
var beSwitch$1 = defineComponent({
  name: "BeSwitch",
  components: {
    BeIcon: BeIcon$1
  },
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default"
    },
    customClass: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    checkedValue: {
      type: [String, Boolean, Number],
      default: true
    },
    unCheckedValue: {
      type: [String, Boolean, Number],
      default: false
    }
  },
  emits: ["update:modelValue", "change", "click"],
  setup(props, ctx) {
    const innerState = ref(false);
    const switching = ref("");
    const internalInstance = getCurrentInstance();
    let changeData = {};
    let isUpdateModel = false;
    const switchState = () => {
      changeClass();
      const modelValue = setInnerState();
      emitChangeEvt();
      ctx.emit("update:modelValue", modelValue);
      isUpdateModel = true;
    };
    const setInnerState = () => {
      if (innerState.value) {
        innerState.value = false;
        changeData = {
          newVal: props.unCheckedValue ? props.unCheckedValue : false,
          oldVal: props.checkedValue ? props.checkedValue : true
        };
        return props.unCheckedValue ? props.unCheckedValue : false;
      }
      innerState.value = true;
      changeData = {
        newVal: props.checkedValue ? props.checkedValue : true,
        oldVal: props.unCheckedValue ? props.unCheckedValue : false
      };
      return props.checkedValue ? props.checkedValue : true;
    };
    watch(() => props.modelValue, () => {
      if (isUpdateModel) {
        isUpdateModel = false;
        return;
      }
      setInnerState();
      emitChangeEvt();
    });
    const emitChangeEvt = () => {
      ctx.emit("change", changeData);
    };
    const changeClass = () => {
      switching.value = "be-switching";
      setTimeout(() => {
        switching.value = "";
      }, 500);
    };
    const handleClick = async ($event) => {
      if (props.disabled || props.isLoading)
        return;
      await switchState();
      ctx.emit("click", $event);
    };
    const init = () => {
      if (props.unCheckedValue !== void 0 && props.unCheckedValue !== "" && (isBool(props.unCheckedValue) || isString(props.unCheckedValue) || isNumber(props.unCheckedValue)) && props.modelValue === props.unCheckedValue) {
        innerState.value = false;
      }
      if (props.checkedValue !== void 0 && props.checkedValue !== "" && (isBool(props.checkedValue) || isString(props.checkedValue) || isNumber(props.checkedValue)) && props.modelValue === props.checkedValue) {
        innerState.value = true;
      }
    };
    onMounted(() => {
      init();
    });
    return () => {
      const unCheckedRender = internalInstance.slots.unCheckedRender ? createVNode("div", {
        "class": `be-switch__${props.size}_slot__unChecked`
      }, [" ", internalInstance.slots.unCheckedRender(innerState.value)]) : "";
      const checkedRender = internalInstance.slots.checkedRender ? createVNode("div", {
        "class": `be-switch__${props.size}_slot__checked`
      }, [internalInstance.slots.checkedRender(innerState.value)]) : "";
      return createVNode("div", {
        "class": `
                        be-switch
                        be-switch__${props.size}
                        ${props.disabled || props.isLoading ? "be-switch__disabled" : ""}
                        ${innerState.value ? "be-switch__checked" : "be-switch__unChecked"}
                        ${switching.value}
                        ${props.customClass}
                    `,
        "tabindex": "0",
        "onClick": ($event) => handleClick($event)
      }, [innerState.value ? unCheckedRender : "", createVNode("div", {
        "class": "be-switch--circle"
      }, [props.isLoading ? createVNode(resolveComponent("be-icon"), {
        "spin": true,
        "icon": "loading",
        "customClass": "be-switch--circle--icon"
      }, null) : ""]), !innerState.value ? checkedRender : ""]);
    };
  }
});
var beSwitch = "";
const switchComp = beSwitch$1;
switchComp.install = (app) => {
  app.component(switchComp.name || "", switchComp);
};
const BeSwitch = switchComp;
var beBreadcrumb$1 = defineComponent({
  name: "BeBreadcrumb",
  setup() {
    const internalInstance = getCurrentInstance();
    const slots = internalInstance.slots.default ? internalInstance.slots.default() : [];
    if (slots.length > 0 && slots[slots.length - 1].type.name === "BeBreadcrumbItem") {
      slots[slots.length - 1].beBreadcrumbIndex = "last";
    }
    return () => {
      return createVNode("div", {
        "class": "be-breadcrumb",
        "aria-label": "BeBreadcrumb"
      }, [slots]);
    };
  }
});
const hasWindow = typeof window !== "undefined";
const defaultWindow = hasWindow ? window : null;
const useBrowserLocation = (customWindow = defaultWindow) => {
  const getWindowLocation = () => {
    const { hash: hash2, host, hostname, href, origin, pathname, port, protocol, search } = (customWindow == null ? void 0 : customWindow.location) || {};
    return {
      hash: hash2,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search
    };
  };
  const updateLocation = () => {
    locationState.value = getWindowLocation();
  };
  const locationState = ref(getWindowLocation());
  onMounted(() => {
    if (customWindow) {
      customWindow.addEventListener("popstate", updateLocation);
      customWindow.addEventListener("hashchange", updateLocation);
    }
  });
  onUnmounted(() => {
    if (customWindow) {
      customWindow.removeEventListener("popstate", updateLocation);
      customWindow.removeEventListener("hashchange", updateLocation);
    }
  });
  return locationState;
};
var beBreadcrumbItem = defineComponent({
  name: "BeBreadcrumbItem",
  components: {
    "be-popover": BePopover
  },
  props: {
    separator: {
      type: String,
      default: "/"
    },
    option: {
      type: Array,
      default: () => []
    },
    to: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function
    },
    clickOption: {
      type: Function
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const uid = internalInstance.uid;
    const browserLocationRef = useBrowserLocation();
    const htmlTag = computed(() => props.to && !props.click ? "a" : "span");
    const ariaCurrentRef = computed(() => browserLocationRef.value.href === props.to ? "location" : null);
    const handleClick = (event) => {
      if (internalInstance.vnode.beBreadcrumbIndex === "last" || optionList.value.length > 0 || props.disabled) {
        event.preventDefault();
        return;
      }
      if (props.click && !props.disabled) {
        event.preventDefault();
        props.click(event);
      }
    };
    const handleClickItem = (val) => {
      if (props.clickOption) {
        props.clickOption(val);
      }
      const curInstPopover = internalInstance.refs.beBreadcrumbPopover;
      curInstPopover.close();
    };
    const optionList = computed(() => props.option);
    const renderOption = () => {
      const renderList2 = [];
      optionList.value.forEach((val) => {
        renderList2.push(createVNode("li", {
          "key": val.id,
          "class": "be-breadcrumb--li",
          "onClick": () => handleClickItem(val)
        }, [val.label]));
      });
      return renderList2;
    };
    const renderContent = () => {
      return createVNode("div", {
        "class": "be-breadcrumb--item__content",
        "ref": "BeBreadcrumbItem",
        "id": `be_breadcrumb_item__content${uid}`,
        "onClick": ($event) => handleClick($event)
      }, [h(htmlTag.value, {
        "aria-current": ariaCurrentRef.value,
        href: props.to
      }, internalInstance.slots.default ? internalInstance.slots.default() : "")]);
    };
    onMounted(() => {
      nextTick(() => {
        const curInstPopover = internalInstance.refs.beBreadcrumbPopover;
        optionList.value.length > 0 && curInstPopover.addEvent(internalInstance.refs.BeBreadcrumbItem);
      });
    });
    return () => {
      return createVNode("div", {
        "class": `
                     be-breadcrumb--item
                     ${props.disabled ? "be-breadcrumb--item__disabled" : ""} `,
        "aria-label": "BeBreadcrumbItem"
      }, [optionList.value.length > 0 ? createVNode(resolveComponent("be-popover"), {
        "ref": "beBreadcrumbPopover",
        "customClass": "be-breadcrumb--popover",
        "placement": "bottom",
        "trigger": props.disabled ? "none" : "click"
      }, {
        default: () => createVNode("ul", null, [renderOption()]),
        trigger: () => renderContent()
      }) : renderContent(), createVNode("div", {
        "class": "be-breadcrumb--item__separator"
      }, [internalInstance.slots.separator ? internalInstance.slots.separator() : props.separator])]);
    };
  }
});
var beBreadcrumb = "";
const breadcrumbComp = beBreadcrumb$1;
breadcrumbComp.install = (app) => {
  app.component(breadcrumbComp.name || "", breadcrumbComp);
};
const breadcrumbItemComp = beBreadcrumbItem;
const BeBreadcrumb = breadcrumbComp;
breadcrumbItemComp.install = (app) => {
  app.component(breadcrumbItemComp.name || "", breadcrumbItemComp);
};
const BeBreadcrumbItem = breadcrumbItemComp;
const _sfc_main$7 = defineComponent({
  name: "BeContextmenu",
  props: {
    eventType: {
      type: String,
      default: "contextmenu"
    },
    theme: {
      type: String,
      default: "default"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["show", "hide", "contextmenu"],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    const beContextmenuId = internalInstance.uid;
    provide("$$contextmenu", internalInstance);
    const contextmenuCls = computed(() => ["be-contextmenu", `be-contextmenu__${props.theme}`]);
    const visible = ref(false);
    const references = ref([]);
    watch(visible, (nVal) => {
      if (nVal) {
        ctx.emit("show", internalInstance);
        document.body.addEventListener("click", handleBodyClick);
        document.body.addEventListener("mousedown", handleBodyClick);
        document.body.addEventListener("mousewheel", handleBodyClick);
      } else {
        ctx.emit("hide", internalInstance);
        document.body.removeEventListener("click", handleBodyClick);
        document.body.removeEventListener("mousedown", handleBodyClick);
        document.body.removeEventListener("mousewheel", handleBodyClick);
      }
    });
    onMounted(() => {
      document.body.appendChild(internalInstance.vnode.el);
      nextTick(() => {
        if (window.$BeContextmenu) {
          window.$BeContextmenu[beContextmenuId] = internalInstance;
        } else {
          window.$BeContextmenu = { [beContextmenuId]: internalInstance };
        }
      });
    });
    onBeforeUnmount(() => {
      document.body.removeChild(internalInstance.vnode.el);
      delete window.$BeContextmenu[beContextmenuId];
      references.value.forEach((ref2) => {
        ref2.el.removeEventListener(props.eventType, handleReferenceContextmenu);
      });
      document.body.removeEventListener("click", handleBodyClick);
      document.body.removeEventListener("mousedown", handleBodyClick);
      document.body.removeEventListener("scroll", handleBodyClick);
    });
    const addRef = (ref2) => {
      references.value.push(ref2);
      ref2.el.addEventListener(props.eventType, handleReferenceContextmenu);
    };
    let style = reactive({ top: 0, left: 0 });
    const handleReferenceContextmenu = (evt) => {
      const event = evt;
      event.preventDefault();
      if (props.disabled)
        return;
      const target = event.target;
      const rootDom = document.getElementById("app") || document.body;
      const reference2 = references.value.find((ref2) => {
        ref2.el.contains = rootDom.contains;
        return ref2.el.contains(target);
      });
      ctx.emit("contextmenu", reference2 ? reference2.vnode : null);
      const eventX = event.pageX;
      const eventY = event.pageY;
      show();
      nextTick(() => {
        let contextmenuPosition = {
          top: eventY,
          left: eventX
        };
        const curInst = internalInstance.refs.contextmenu;
        const contextmenuWidth = curInst.clientWidth;
        const contextmenuHeight = curInst.clientHeight;
        if (contextmenuHeight + eventY >= window.innerHeight) {
          contextmenuPosition.top -= contextmenuHeight;
        }
        if (contextmenuWidth + eventX >= window.innerWidth) {
          contextmenuPosition.left -= contextmenuWidth;
        }
        style.top = `${contextmenuPosition.top}px`;
        style.left = `${contextmenuPosition.left + 3}px`;
      });
    };
    const show = (position) => {
      Object.keys(window.$BeContextmenu).forEach((key) => {
        if (key !== beContextmenuId.toString()) {
          window.$BeContextmenu[key].proxy.hide();
        }
      });
      if (position) {
        style.top = `${position.top}px`;
        style.left = `${position.left}px`;
      }
      visible.value = true;
    };
    const isClick = computed(() => props.eventType === "click");
    const handleBodyClick = (event) => {
      const target = event.target;
      const notOutside = internalInstance.vnode.el.contains(target) || isClick.value && references.value.some((ref2) => ref2.el.contains(target));
      if (!notOutside) {
        visible.value = false;
      }
    };
    const hide2 = () => {
      visible.value = false;
    };
    const hideAll = () => {
      Object.keys(window.$BeContextmenu).forEach((key) => {
        window.$BeContextmenu[key].proxy.hide();
      });
    };
    return {
      addRef,
      hide: hide2,
      hideAll,
      beContextmenuId,
      visible,
      style,
      contextmenuCls,
      attrs: internalInstance.attrs
    };
  }
});
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("ul", mergeProps({ ref: "contextmenu" }, _ctx.attrs, {
    class: _ctx.contextmenuCls,
    style: _ctx.style
  }), [
    renderSlot(_ctx.$slots, "default")
  ], 16)), [
    [vShow, _ctx.visible]
  ]);
}
var beContextmenu$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = defineComponent({
  name: "BeContextmenuItem",
  props: {
    divider: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autoHide: {
      type: Boolean,
      default: true
    }
  },
  emits: ["mouseenter", "mouseleave", "click"],
  setup(props, ctx) {
    const hover = ref(false);
    const internalInstance = getCurrentInstance();
    const $$contextmenu = inject("$$contextmenu");
    const classname = computed(() => {
      return {
        "be-contextmenu-item": !props.divider,
        "be-contextmenu-item__hover": hover.value,
        "be-contextmenu-item__disabled": props.disabled
      };
    });
    const handleMouseenter = (event) => {
      if (props.disabled)
        return;
      hover.value = true;
      ctx.emit("mouseenter", internalInstance, event);
    };
    const handleMouseleave = (event) => {
      if (props.disabled)
        return;
      hover.value = false;
      ctx.emit("mouseleave", internalInstance, event);
    };
    const handleClick = (event) => {
      if (props.disabled)
        return;
      ctx.emit("click", internalInstance, event);
      props.autoHide && $$contextmenu.proxy.hide();
    };
    return {
      classname,
      handleClick,
      handleMouseleave,
      handleMouseenter
    };
  }
});
const _hoisted_1$2 = {
  key: 0,
  class: "be-contextmenu-divider"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.divider ? (openBlock(), createElementBlock("li", _hoisted_1$2)) : (openBlock(), createElementBlock("li", {
    key: 1,
    class: normalizeClass(_ctx.classname),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args)),
    onMouseenter: _cache[1] || (_cache[1] = (...args) => _ctx.handleMouseenter && _ctx.handleMouseenter(...args)),
    onMouseleave: _cache[2] || (_cache[2] = (...args) => _ctx.handleMouseleave && _ctx.handleMouseleave(...args))
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 34));
}
var beContextmenuItem = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = defineComponent({
  name: "BeContextmenuSubMenu",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  emits: ["mouseenter", "mouseleave"],
  setup(props, ctx) {
    const hover = ref(false);
    const submenuPlacement = ref([]);
    const internalInstance = getCurrentInstance();
    const classname = computed(() => {
      return {
        "be-contextmenu-item": true,
        "be-contextmenu-submenu": true,
        "be-contextmenu-item__hover": hover.value,
        "be-contextmenu-item__disabled": props.disabled
      };
    });
    const submenuCls = computed(() => {
      return ["be-contextmenu", ...submenuPlacement.value];
    });
    const handleMouseenter = (event) => {
      if (props.disabled)
        return;
      const { target } = event;
      const targetDimension = target.getBoundingClientRect();
      hover.value = true;
      ctx.emit("mouseenter", internalInstance, event);
      nextTick(() => {
        const internalInstanceSubMenu = internalInstance.refs.submenu;
        const submenuWidth = internalInstanceSubMenu.clientWidth;
        const submenuHeight = internalInstanceSubMenu.clientHeight;
        const submenuPlacementInner = [];
        if (targetDimension.right + submenuWidth >= window.innerWidth) {
          submenuPlacementInner.push("left");
        } else {
          submenuPlacementInner.push("right");
        }
        if (targetDimension.bottom + submenuHeight >= window.innerHeight) {
          submenuPlacementInner.push("bottom");
        } else {
          submenuPlacementInner.push("top");
        }
        submenuPlacement.value = submenuPlacementInner;
      });
    };
    const handleMouseleave = (event) => {
      if (props.disabled)
        return;
      hover.value = false;
      ctx.emit("mouseleave", internalInstance, event);
    };
    return {
      hover,
      classname,
      submenuCls,
      handleMouseenter,
      handleMouseleave
    };
  }
});
const _hoisted_1$1 = { class: "be-contextmenu-submenu__title" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(_ctx.classname),
    onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.handleMouseenter && _ctx.handleMouseenter(...args)),
    onMouseleave: _cache[1] || (_cache[1] = (...args) => _ctx.handleMouseleave && _ctx.handleMouseleave(...args))
  }, [
    createElementVNode("span", _hoisted_1$1, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ]),
    withDirectives(createElementVNode("div", {
      ref: "submenu",
      class: normalizeClass(_ctx.submenuCls)
    }, [
      createElementVNode("ul", null, [
        renderSlot(_ctx.$slots, "default")
      ])
    ], 2), [
      [vShow, _ctx.hover]
    ])
  ], 34);
}
var beContextmenuSubMenu = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
var beContextmenu = "";
beContextmenu$1.install = (app) => {
  app.component(beContextmenu$1.name || "", beContextmenu$1);
};
const BeContextmenu = beContextmenu$1;
beContextmenuItem.install = (app) => {
  app.component(beContextmenuItem.name || "", beContextmenuItem);
};
const BeContextmenuItem = beContextmenuItem;
beContextmenuSubMenu.install = (app) => {
  app.component(beContextmenuSubMenu.name || "", beContextmenuSubMenu);
};
const BeContextmenuSubMenu = beContextmenuSubMenu;
const _sfc_main$4 = defineComponent({
  name: "BeContainer",
  props: {
    direction: {
      type: String,
      default: ""
    }
  },
  setup(props, { slots }) {
    const isVertical = computed(() => {
      if (props.direction === "vertical") {
        return true;
      } else if (props.direction === "horizontal") {
        return false;
      }
      if (slots && slots.default) {
        const vNodes = slots.default();
        return vNodes.some((vNode) => {
          const tag2 = vNode.type.name;
          return tag2 === "BeHeader" || tag2 === "BeFooter";
        });
      } else {
        return false;
      }
    });
    return {
      isVertical
    };
  }
});
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("section", {
    class: normalizeClass(["be-container", { "be-container__vertical": _ctx.isVertical }])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var beContainer$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = defineComponent({
  name: "BeAside",
  props: {
    width: {
      type: String,
      default: null
    }
  },
  setup(props) {
    return {
      style: computed(() => props.width ? { width: props.width } : {})
    };
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("aside", {
    class: "be-aside",
    style: normalizeStyle(_ctx.style)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 4);
}
var beAside$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = defineComponent({
  name: "BeMain"
});
const _hoisted_1 = { class: "be-main" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", _hoisted_1, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var beMain$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = defineComponent({
  name: "BeFooter",
  props: {
    height: {
      type: String,
      default: null
    }
  },
  setup(props) {
    return {
      style: computed(() => props.height ? { height: props.height } : {})
    };
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("footer", {
    class: "be-footer",
    style: normalizeStyle(_ctx.style)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 4);
}
var beFooter$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = defineComponent({
  name: "BeHeader",
  props: {
    height: {
      type: String,
      default: null
    }
  },
  setup(props) {
    return {
      style: computed(() => props.height ? { height: props.height } : {})
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("header", {
    class: "be-header",
    style: normalizeStyle(_ctx.style)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 4);
}
var beHeader$1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
var beMain = "";
var beAside = "";
var beFooter = "";
var beHeader = "";
var beContainer = "";
beContainer$1.install = (app) => {
  app.component(beContainer$1.name || "", beContainer$1);
};
const BeContainer = beContainer$1;
beAside$1.install = (app) => {
  app.component(beAside$1.name || "", beAside$1);
};
const BeAside = beAside$1;
beMain$1.install = (app) => {
  app.component(beMain$1.name || "", beMain$1);
};
const BeMain = beMain$1;
beFooter$1.install = (app) => {
  app.component(beFooter$1.name || "", beFooter$1);
};
const BeFooter = beFooter$1;
beHeader$1.install = (app) => {
  app.component(beHeader$1.name || "", beHeader$1);
};
const BeHeader = beHeader$1;
var beProgress$1 = defineComponent({
  name: "BeProgress",
  props: {
    type: {
      type: String,
      default: "line"
    },
    trailColor: {
      type: String,
      default: ""
    },
    color: {
      type: [String, Object],
      default: ""
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    percent: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: "normal"
    },
    strokeLinecap: {
      type: String,
      default: "round"
    },
    strokeWidth: {
      type: Number
    },
    success: {
      type: Object
    },
    width: {
      type: Number,
      default: 132
    },
    gap: {
      type: Number,
      default: 75
    },
    gapPosition: {
      type: String,
      default: "bottom"
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const innerStrokeWidth = computed(() => {
      if (props.type === "line" && !props.strokeWidth && props.strokeWidth !== 0) {
        return 10;
      }
      if ((props.type === "circle" || props.type === "dashboard") && !props.strokeWidth && props.strokeWidth !== 0) {
        return 6;
      }
      return props.strokeWidth;
    });
    const innerStyleTypeLine = computed(() => {
      return setStyleTypeLine();
    });
    const setStyleTypeLine = () => {
      const styleIns = {};
      if (isObject(props.color)) {
        styleIns.backgroundImage = `linear-gradient(to right, ${props.color.from} 0%, ${props.color.to} 100%)`;
      } else {
        styleIns.backgroundColor = props.color;
      }
      styleIns.width = `${props.percent >= 100 ? 100 : props.percent}%`;
      styleIns.height = `${innerStrokeWidth.value}px`;
      return styleIns;
    };
    const innerStyleStatus = computed(() => {
      if (props.percent >= 100) {
        return "success";
      } else {
        return props.status;
      }
    });
    const setCircleContainerStyle = computed(() => {
      if (props.type === "circle" || props.type === "dashboard") {
        return {
          width: `${props.width}px`,
          height: `${props.width}px`
        };
      }
      return {};
    });
    const relativeStrokeWidth = computed(() => {
      return (innerStrokeWidth.value / props.width * 100).toFixed(1);
    });
    const radius = computed(() => {
      if (props.type === "circle" || props.type === "dashboard") {
        return parseInt(`${50 - parseFloat(relativeStrokeWidth.value) / 2}`, 10);
      } else {
        return 0;
      }
    });
    const trackPath = computed(() => {
      const r = radius.value;
      const isDashboard = props.type === "dashboard" ? true : false;
      const pathM = `M 50 50`;
      const pathA = `a ${r} ${r} 0 1 1`;
      if (isDashboard) {
        if (props.gapPosition === "bottom") {
          return `${pathM} m 0 ${r} ${pathA} 0 -${r * 2} ${pathA} 0 ${r * 2}`;
        }
        if (props.gapPosition === "left") {
          return `${pathM} m -${r} 0 ${pathA} ${r * 2} 0 ${pathA} -${r * 2} 0`;
        }
        if (props.gapPosition === "right") {
          return `${pathM} m ${r} 0 ${pathA} -${r * 2} 0 ${pathA} ${r * 2} 0`;
        }
      }
      return `${pathM} m 0 -${r} ${pathA} 0 ${r * 2} ${pathA} 0 -${r * 2}`;
    });
    const perimeter = computed(() => {
      return 2 * Math.PI * radius.value;
    });
    const rate = computed(() => {
      return props.type === "dashboard" ? props.gap / 100 : 1;
    });
    const strokeDashoffset = computed(() => {
      const offset2 = -1 * perimeter.value * (1 - rate.value) / 2;
      return `${offset2}px`;
    });
    const trailPathStyle = computed(() => {
      return {
        strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value
      };
    });
    const circlePathStyle = computed(() => {
      return createCirclePathStyle(props.percent);
    });
    const createCirclePathStyle = (percent) => {
      return {
        strokeDasharray: `${perimeter.value * rate.value * (percent / 100)}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value,
        transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease"
      };
    };
    const circlePathColor = computed(() => {
      if (props.status === "normal" && !props.color || isObject(props.color)) {
        return "rgba(64, 158, 255, .94)";
      }
      if (props.status === "error" && !props.color) {
        return "#F14E53FF";
      }
      if (props.status === "success" && !props.color) {
        return "#22C416FF";
      }
      return props.color;
    });
    const renderSuccess = () => {
      if (isObject(props.success) && props.success.color && props.success.percent && props.type === "line") {
        return createVNode("div", {
          "class": `
                                            be-progress-line-path  
                                            be-progress-line-path__success
                                            ${props.strokeLinecap === "round" ? "be-progress-line-path__round" : ""}  
                                            `,
          "style": innerStyleTypeLineSuccess.value
        }, null);
      }
      if (isObject(props.success) && props.success.color && props.success.percent && (props.type === "circle" || props.type === "dashboard")) {
        return createVNode("path", {
          "class": "be-progress-circle__success",
          "d": trackPath.value,
          "stroke": innerStyleTypeLineSuccess.value.color,
          "fill": "none",
          "stroke-linecap": props.strokeLinecap,
          "stroke-width": relativeStrokeWidth.value,
          "style": circleSuccessPathStyle.value
        }, null);
      }
      return;
    };
    const circleSuccessPathStyle = computed(() => {
      var _a;
      return createCirclePathStyle((_a = props.success) == null ? void 0 : _a.percent);
    });
    const innerStyleTypeLineSuccess = computed(() => {
      var _a, _b, _c, _d;
      const styleIns = {};
      if (props.type === "line") {
        styleIns.backgroundColor = (_a = props.success) == null ? void 0 : _a.color;
        styleIns.width = `${((_b = props.success) == null ? void 0 : _b.percent) >= 100 ? 100 : (_c = props.success) == null ? void 0 : _c.percent}%`;
        styleIns.height = `${innerStrokeWidth.value}px`;
        return styleIns;
      }
      styleIns.color = (_d = props.success) == null ? void 0 : _d.color;
      return styleIns;
    });
    return () => {
      const rightRender = internalInstance.slots.default ? internalInstance.slots.default() : createVNode("span", {
        "class": "percent"
      }, [`${props.percent}%`]);
      const centerRender = internalInstance.slots.center ? internalInstance.slots.center() : createVNode("span", {
        "class": "percent"
      }, [`${props.percent}%`]);
      return createVNode("div", {
        "class": `${props.type === "line" ? "be-progress" : "be-progress be-progress-circle-dashboard"}`
      }, [props.type === "line" ? createVNode("div", {
        "class": "be-progress-body be-progress-line"
      }, [createVNode("div", {
        "class": `
                                        be-progress-line--track
                                        ${props.strokeLinecap === "round" ? "be-progress-line-path__round" : ""}`,
        "style": `background-color:${props.trailColor}`
      }, [createVNode("div", {
        "class": `
                                            be-progress-line-path  
                                            ${props.strokeLinecap === "round" ? "be-progress-line-path__round" : ""}  
                                            be-progress__${innerStyleStatus.value}`,
        "style": innerStyleTypeLine.value
      }, null), renderSuccess()]), props.showInfo ? rightRender : ""]) : "", props.type === "circle" || props.type === "dashboard" ? createVNode("div", {
        "class": "be-progress-body be-progress-circle",
        "style": setCircleContainerStyle.value
      }, [createVNode("svg", {
        "viewBox": "0 0 100 100"
      }, [createVNode("path", {
        "class": "be-progress-circle__track",
        "d": trackPath.value,
        "stroke-linecap": props.strokeLinecap,
        "stroke": props.trailColor ? props.trailColor : "#f5f5f5",
        "stroke-width": relativeStrokeWidth.value,
        "fill": "none",
        "style": trailPathStyle.value
      }, null), createVNode("path", {
        "class": "be-progress-circle__path",
        "d": trackPath.value,
        "stroke": circlePathColor.value,
        "fill": "none",
        "stroke-linecap": props.strokeLinecap,
        "stroke-width": relativeStrokeWidth.value,
        "style": circlePathStyle.value
      }, null), renderSuccess()]), createVNode("div", {
        "class": "be-progress-circle--text"
      }, [props.showInfo ? centerRender : ""])]) : ""]);
    };
  }
});
var beProgress = "";
const progressComp = beProgress$1;
progressComp.install = (app) => {
  app.component(progressComp.name || "", progressComp);
};
const BeProgress = progressComp;
var beNotifyComponents = defineComponent({
  name: "BeNotification",
  components: {
    BeIcon: BeIcon$1
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          isShow: false,
          style: {},
          close: false,
          placementSelf: "",
          titles: "",
          customClass: "",
          msgType: "info",
          offsetTop: 0,
          offsetBottom: 0,
          placement: "topRight",
          bodyRender: null,
          iconPreRender: null,
          closeRender: null,
          description: "",
          duration: 4500,
          loading: false,
          key: "",
          onClose: null,
          onClick: null
        };
      }
    },
    compType: {
      type: String,
      default: "notification"
    }
  },
  setup(props) {
    var _a;
    const internalInstance = getCurrentInstance();
    const option = ref(props.option);
    let timer = 0;
    const isLoading = ref((_a = props.option) == null ? void 0 : _a.loading);
    const offsetTopStyle = computed(() => option.value.offsetTop);
    if (option.value.placementSelf === "topLeft" || option.value.placementSelf === "topRight" || option.value.placementSelf === "topCenter") {
      option.value.style = {
        top: offsetTopStyle.value + "px"
      };
    }
    const offsetBottomStyle = computed(() => option.value.offsetBottom);
    if (option.value.placementSelf === "bottomLeft" || option.value.placementSelf === "bottomRight") {
      option.value.style = {
        bottom: offsetBottomStyle.value + "px"
      };
    }
    const placementStyle = computed(() => option.value.placement);
    option.value.placementSelf = placementStyle.value;
    if (option.value.placementSelf === "bottomLeft" || option.value.placementSelf === "bottomRight") {
      option.value.style = {
        bottom: option.value.offsetBottom + "px"
      };
    }
    if (option.value.placementSelf === "topLeft" || option.value.placementSelf === "topRight" || option.value.placementSelf === "topCenter") {
      option.value.style = {
        top: option.value.offsetTop + "px"
      };
    }
    const selfEvent = reactive({
      onClose: props.option.onClose,
      onClick: props.option.onClick
    });
    const close2 = (event) => {
      event && event.stopPropagation();
      props.option.closeNotify(internalInstance, false, true);
    };
    const handleClickClose = (event) => {
      clearTimer();
      close2(event);
    };
    const onClick = (event) => {
      selfEvent.onClick && selfEvent.onClick(event);
    };
    const clearTimer = () => {
      clearTimeout(timer);
      timer = 0;
    };
    const startTimer = () => {
      if (option.value.duration > 0) {
        timer = setTimeout(() => {
          close2(null);
        }, option.value.duration);
      }
    };
    const containerClass = ref("");
    const setAnimate = () => {
      const classStr = `be-${props.compType} be-${props.compType}__${option.value.msgType} be-${props.compType}__${option.value.placement} 
      ${option.value.customClass ? option.value.customClass : ""}`;
      containerClass.value = classStr;
      if (option.value.placement === "bottomRight" || option.value.placement === "topRight" && !option.value.isUpdate) {
        containerClass.value = classStr + ` be-${props.compType}-animation-right-in be-${props.compType}__bottom`;
      }
      if (option.value.placement === "bottomLeft" || option.value.placement === "topLeft" && !option.value.isUpdate) {
        containerClass.value = classStr + ` be-${props.compType}-animation-left-in be-${props.compType}__top`;
      }
      if (option.value.placement === "topCenter" && !option.value.isUpdate) {
        containerClass.value = classStr + ` be-${props.compType}-animation-top-center-in be-${props.compType}__top`;
      }
    };
    setAnimate();
    const uid = internalInstance.uid;
    const renderBody = function(h2) {
      const evt = {
        onClick: (event) => handleClickClose(event)
      };
      return h2(createVNode("div", {
        "class": `be-${props.compType}--container be-${props.compType}--container__${option.value.placement}`
      }, [createVNode("div", {
        "class": `be-${props.compType}--title`
      }, [createVNode("div", {
        "class": `be-${props.compType}--head`,
        "id": `be_${props.compType}_head${uid}`
      }, [createVNode("div", null, [isLoading.value ? createVNode(BeIcon$1, {
        "icon": "loading",
        "spin": true,
        "customClass": `icon__${option.value.msgType}`
      }, null) : option.value.iconPreRender ? option.value.iconPreRender : createVNode(BeIcon$1, {
        "icon": `${option.value.msgType}`,
        "customClass": `icon__${option.value.msgType}`
      }, null), createVNode("span", {
        "class": `txt__${option.value.msgType}`
      }, [option.value.titles])]), createVNode("div", {
        "id": `be_${props.compType}_close_icon${uid}`
      }, [option.value.closeRender ? option.value.closeRender : option.value.close ? createVNode(BeIcon$1, mergeProps({
        "icon": "deleteIc"
      }, evt), null) : ""])])]), props.compType === "notification" ? createVNode("div", {
        "class": `be-${props.compType}--body`
      }, [option.value.bodyRender ? option.value.bodyRender() : createVNode("p", {
        "class": `be-${props.compType}--description`
      }, [option.value.description])]) : ""]));
    };
    return () => {
      clearTimer();
      startTimer();
      return createVNode("div", {
        "key": `be_${props.compType}${uid}`,
        "style": option.value.style,
        "onClick": (event) => {
          onClick(event);
        },
        "class": containerClass.value,
        "id": `be_${props.compType}${uid}`
      }, [option.value.isShow ? renderBody.call(this, h) : ""]);
    };
  }
});
let instanceMap = {
  topLeft: [],
  topRight: [],
  bottomLeft: [],
  topCenter: [],
  bottomRight: []
};
let isCache = false;
const closeNotify = function(instance, isAll = false) {
  if (!instance)
    return;
  let index2 = -1;
  const placement = instance.props && instance.props.option.placement;
  const instanceUid = instance.component && instance.component.uid || instance.uid;
  const instanceEl = instance.el || instance.proxy.$el;
  const instancesList = Object(instanceMap)[placement];
  const direction = /top/.test(placement) ? "top" : "bottom";
  const len = instancesList.length;
  if (isAll) {
    closeAll();
    return;
  }
  try {
    instancesList.forEach((val, i) => {
      if (instanceUid === val.instance.component.uid) {
        index2 = i;
        throw new Error("EndIterative");
      }
    });
  } catch (e) {
    if (e.message !== "EndIterative")
      throw e;
  }
  if (index2 < 0)
    return;
  const currentInstance = instancesList[index2];
  instancesList.splice(index2, 1);
  if (len < 1)
    return;
  const removedHeight = instanceEl.children[0].offsetHeight;
  for (let i = index2; i < len - 1; i++) {
    instancesList[i].instance.el.style[direction] = parseInt(instancesList[i].instance.el.style[direction], 10) - removedHeight - 35 + "px";
  }
  Object(instanceMap)[placement] = Object(instanceMap)[placement].filter((val) => {
    return val.instance.component.uid !== instanceUid;
  });
  instance.props.option.onClose && instance.props.option.onClose();
  close(instanceEl, currentInstance.elm);
};
const close = (compInstance, elm) => {
  if (compInstance && compInstance.parentNode) {
    setCloseAnimate(compInstance);
    setTimeout(() => {
      render(null, elm);
    }, 300);
  }
};
const setCloseAnimate = (compInstance) => {
  let className = compInstance.className;
  if (className.indexOf("be-message") < 0) {
    return;
  }
  if (className.indexOf("-in") >= 0) {
    className = className.replace(/-in/, "-out");
  } else {
    className = className + " be-message-animation-top-center-out";
  }
  compInstance.className = className;
};
const closeAll = () => {
  Object.keys(instanceMap).forEach((placement) => {
    Object(instanceMap)[placement].forEach((val) => {
      close(val.instance.el, val.elm);
    });
  });
  resetNotifyInstMap();
};
const resetNotifyInstMap = () => {
  instanceMap = {
    topLeft: [],
    topRight: [],
    bottomLeft: [],
    topCenter: [],
    bottomRight: []
  };
};
const computeOffset = (option, instanceArr, isCache2, instance) => {
  const offset2 = 35;
  let verticalOffset = 30;
  let direction = "";
  if (option.placement === "topLeft" || option.placement === "topRight" || option.placement === "topCenter") {
    verticalOffset = option.offsetTop || 30;
    direction = "top";
  }
  if (option.placement === "bottomLeft" || option.placement === "bottomRight") {
    verticalOffset = option.offsetBottom || 30;
    direction = "bottom";
  }
  if (!isCache2) {
    instanceArr.forEach((item, index2) => {
      verticalOffset += (item.instance.el.childNodes[0].offsetHeight || 0) + offset2;
      if (index2 === 0 && (option == null ? void 0 : option.compType) === "message") {
        const offsetInit = /top/.test(String(option.placement)) ? option.offsetTop || 0 : option.offsetBottom || 0;
        verticalOffset = 30 + offsetInit;
      }
    });
  }
  instance.el.style[direction] = verticalOffset + "px";
};
const componentRender$1 = (option, instanceArr, isCacheInner, instance, isUpdate = false) => {
  let elm = null;
  let instanceInner = instance;
  if (!instanceInner) {
    option.isUpdate = isUpdate;
    instanceInner = createVNode(beNotifyComponents, { option, compType: option.compType });
    instanceInner.props.option.isShow = true;
    elm = document.createElement("div");
    render(instanceInner, elm);
    const bodyElement = document.querySelector("body");
    if (bodyElement && bodyElement.append) {
      bodyElement.append(instanceInner.el);
    } else {
      bodyElement && bodyElement.appendChild(instanceInner.el);
    }
  } else {
    const placement = option.placement || "topRight";
    const instancesList = Object(instanceMap)[placement];
    let instanceCache = null;
    let indexCache = null;
    instancesList.forEach((val, index2) => {
      if (val.instance.component.uid === instanceInner.instance.component.uid) {
        instanceCache = val.elm;
        indexCache = index2;
      }
    });
    if (!instanceCache || !indexCache && indexCache !== 0)
      return;
    instancesList.splice(indexCache, 1);
    render(null, instanceCache);
    instanceInner = componentRender$1(option, instanceArr, false, null, true);
  }
  if (!isCacheInner) {
    instanceArr.push({ instance: instanceInner, elm });
  }
  return instanceInner;
};
const createNotify = function(options) {
  isCache = false;
  const defaultOption = {
    isShow: false,
    close: false,
    style: {},
    placementSelf: "",
    titles: "",
    customClass: "",
    msgType: "info",
    offsetTop: 0,
    offsetBottom: 0,
    placement: "topRight",
    bodyRender: null,
    iconPreRender: null,
    closeRender: null,
    description: "",
    duration: 4500,
    key: "",
    onClose: void 0,
    onClick: void 0,
    closeNotify
  };
  const optCopy = jsonClone(options);
  let option = Object.assign({}, defaultOption, options);
  let instanceArr = [];
  if (option.placement === void 0) {
    instanceArr = instanceMap.topRight;
  } else {
    instanceArr = Object(instanceMap)[option.placement];
  }
  let instance = null;
  if (option.key) {
    instanceArr.forEach((val) => {
      if (val.instance.props.option.key === option.key) {
        isCache = true;
        option = Object.assign({}, val.instance.props.option, optCopy);
        instance = val;
      }
    });
  }
  instance = componentRender$1(option, instanceArr, isCache, instance);
  computeOffset(option, instanceArr, isCache, instance);
  return { notify: instance, close: closeNotify.bind(this, instance) };
};
const BeNotify = (options) => {
  return createNotify(options);
};
var beNotification = "";
var beMessage = "";
var index$3 = {
  service: BeNotify
};
var beMsgComponents = defineComponent({
  name: "BeMessageBox",
  directives: {
    drag: dragDirective
  },
  components: {
    BeIcon
  },
  props: {
    titles: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ""
    },
    isOpenModal: {
      type: Boolean,
      default: true
    },
    msgType: {
      type: String,
      default: "info"
    },
    footerType: {
      type: String,
      default: "center"
    },
    footerRender: {
      type: Function,
      default: null
    },
    bodyRender: {
      type: Function,
      default: null
    },
    iconPreRender: {
      type: Function,
      default: null
    },
    iconNextRender: {
      type: Function,
      default: null
    },
    isDrag: {
      type: Boolean,
      default: false
    },
    onConfirm: {
      type: Function,
      default: null
    },
    onClose: {
      type: Function,
      default: null
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const _uid = internalInstance.uid;
    const show = ref(props.isShow);
    const close2 = () => {
      props.onClose && props.onClose();
    };
    const confirmFunc = () => {
      props.onConfirm && props.onConfirm();
      show.value = false;
    };
    const dialogModels = ref("");
    const openModal = computed(() => props.isOpenModal);
    watch(openModal, (val) => {
      if (val) {
        dialogModels.value = "be-modal";
      } else {
        dialogModels.value = "";
      }
    });
    const containerClass = ref("");
    const containerstyle = computed(() => containerClass.value);
    const setAnimate = () => {
      const containerCls = `be-message-box--container`;
      const animateClass = " be-fadeOut";
      containerClass.value = containerCls + animateClass;
      setTimeout(() => {
        containerClass.value = containerCls + " be-fadeIn";
      }, 100);
    };
    onMounted(() => {
      if (props.isOpenModal) {
        dialogModels.value = "be-modal";
      }
      setAnimate();
    });
    return () => {
      if (show.value) {
        return createVNode("div", {
          "class": `be-message-box be-message-box__${props.msgType} ${dialogModels.value} ${props.customClass}`
        }, [withDirectives(createVNode("div", {
          "class": containerstyle.value,
          "id": `be_message_box_container${_uid}`
        }, [createVNode("div", {
          "class": "be-message-box--title"
        }, [createVNode("div", {
          "class": "be-message-box--head",
          "id": `be_message_box_head${_uid}`
        }, [createVNode("div", null, [props.iconPreRender ? props.iconPreRender() : createVNode(resolveComponent("be-icon"), {
          "icon": `${props.msgType}`,
          "class": `icon-${props.msgType}`
        }, null), createVNode("span", {
          "class": `text-${props.msgType}`
        }, [props.titles])]), createVNode("div", {
          "class": "be-message-box--head-close"
        }, [props.iconNextRender ? createVNode("div", {
          "onClick": () => close2()
        }, [props.iconNextRender()]) : createVNode(resolveComponent("be-icon"), {
          "icon": "deleteIc",
          "onClick": () => close2()
        }, null)])])]), createVNode("div", {
          "class": "be-message-box--body"
        }, [props.bodyRender ? props.bodyRender() : ""]), createVNode("div", {
          "class": `be-message-box--footer be-message-box--footer__${props.footerType}`
        }, [props.footerRender ? createVNode("div", {
          "onClick": () => confirmFunc()
        }, [props.footerRender()]) : createVNode("button", {
          "class": `be-button be-button__mini be-button__${props.msgType} ${props.msgType === "info" ? "border" : ""}`,
          "onClick": () => confirmFunc()
        }, [createTextVNode("\u77E5\u9053\u4E86")])])]), [[resolveDirective("drag"), {
          isDrag: props.isDrag
        }]])]);
      }
    };
  }
});
const componentRender = (option) => {
  const elm = document.createElement("div");
  const close2 = option.onClose;
  const onCloseFunc = () => {
    render(null, elm);
    close2 && close2();
  };
  option.onClose = onCloseFunc;
  const instanceInner = createVNode(beMsgComponents, __spreadValues({}, option));
  instanceInner.props && (instanceInner.props.isShow = true);
  render(instanceInner, elm);
  const bodyElement = document.querySelector("body");
  if (bodyElement && bodyElement.append) {
    bodyElement.append(instanceInner.el);
  } else {
    bodyElement && bodyElement.appendChild(instanceInner.el);
  }
};
const createMsg = (options) => {
  const defaultOption = {
    isDrag: false,
    titles: "",
    customClass: "",
    msgType: "info",
    footerType: "center",
    footerRender: null,
    bodyRender: null,
    iconPreRender: null,
    iconNextRender: null,
    isOpenModal: true
  };
  const option = Object.assign({}, defaultOption, options);
  const instance = componentRender(option);
  return { msg: instance };
};
const BeMsg = (options) => {
  return createMsg(options);
};
var beMessageBox = "";
var index$2 = {
  service: BeMsg
};
const load = {
  close: beLoading$1.close,
  init: beLoading$1.init
};
const BeLoadingSer = load;
const createMessage = function(options) {
  const option = {
    titles: options.titles || "message",
    msgType: options.msgType || "info",
    offsetTop: options.offsetTop,
    close: options.close || false,
    placement: "topCenter",
    compType: "message",
    customClass: options.customClass,
    duration: options.duration || options.duration === null ? options.duration : 4500,
    key: options.key,
    onClose: options.onClose,
    iconPreRender: options.iconPreRender,
    closeRender: options.closeRender,
    loading: options.loading
  };
  const notifyInst = BeNotify(option);
  return {
    message: notifyInst.notify,
    close: notifyInst.close,
    update: (options2) => {
      const option2 = {
        titles: options2.titles,
        msgType: options2.msgType,
        offsetTop: options2.offsetTop,
        close: options2.close,
        placement: "topCenter",
        compType: "message",
        customClass: options2.customClass,
        duration: options2.duration,
        key: options2.key,
        onClose: options2.onClose,
        iconPreRender: options2.iconPreRender,
        closeRender: options2.closeRender,
        loading: options2.loading
      };
      return BeNotify(option2);
    }
  };
};
const BeMessage = (options) => {
  return createMessage(options);
};
var index$1 = {
  service: BeMessage
};
const contextmenu = {
  mounted(el, binding, vnode) {
    var _a;
    const contextmenu2 = (_a = binding.instance) == null ? void 0 : _a.$refs[binding.arg || binding.value];
    if (!contextmenu2)
      return;
    contextmenu2.addRef({ el, vnode });
  }
};
var components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BeEllipsis,
  BeIcon,
  BePopover,
  BeTooltip,
  BeButton,
  BeDialog,
  BeLoading,
  BePagination,
  BeInput,
  BeAutocomplete,
  BeTag,
  BeInputNumber,
  BeSelect,
  BeSelectMultiple,
  BeSwitch,
  BeBreadcrumb,
  BeBreadcrumbItem,
  BeContextmenu,
  BeContextmenuItem,
  BeContextmenuSubMenu,
  BeMain,
  BeFooter,
  BeAside,
  BeHeader,
  BeContainer,
  BeProgress,
  BeNotification: index$3,
  BeMsg: index$2,
  BeLoadingSer,
  BeMessage: index$1,
  ClickOutside,
  contextmenu,
  dragDirective
}, Symbol.toStringTag, { value: "Module" }));
var windi = "";
const componentList = components;
const install = function(app) {
  Object.keys(componentList).forEach((key) => {
    const component = componentList[key];
    if (component["install"]) {
      app.use(component);
    }
  });
  return app;
};
const version = "1.0.2";
var index = {
  version,
  install
};
export { BeAside, BeAutocomplete, BeBreadcrumb, BeBreadcrumbItem, BeButton, BeContainer, BeContextmenu, BeContextmenuItem, BeContextmenuSubMenu, BeDialog, BeEllipsis, BeFooter, BeHeader, BeIcon, BeInput, BeInputNumber, BeLoading, BeLoadingSer, BeMain, index$1 as BeMessage, index$2 as BeMsg, index$3 as BeNotification, BePagination, BePopover, BeProgress, BeSelect, BeSelectMultiple, BeSwitch, BeTag, BeTooltip, ClickOutside, contextmenu, index as default, dragDirective, install, version };
