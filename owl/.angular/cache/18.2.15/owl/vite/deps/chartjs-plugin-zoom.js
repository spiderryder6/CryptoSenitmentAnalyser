import {
  _isPointInArea,
  almostEquals,
  callback,
  each,
  getRelativePosition,
  sign,
  valueOrDefault
} from "./chunk-ELB7Y5NA.js";
import {
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-TXDUYLVM.js";

// node_modules/hammerjs/hammer.js
var require_hammer = __commonJS({
  "node_modules/hammerjs/hammer.js"(exports, module) {
    (function(window2, document2, exportName, undefined2) {
      "use strict";
      var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
      var TEST_ELEMENT = document2.createElement("div");
      var TYPE_FUNCTION = "function";
      var round = Math.round;
      var abs = Math.abs;
      var now = Date.now;
      function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
      }
      function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
          each2(arg, context[fn], context);
          return true;
        }
        return false;
      }
      function each2(obj, iterator, context) {
        var i;
        if (!obj) {
          return;
        }
        if (obj.forEach) {
          obj.forEach(iterator, context);
        } else if (obj.length !== undefined2) {
          i = 0;
          while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
          }
        } else {
          for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
          }
        }
      }
      function deprecate(method, name, message) {
        var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
        return function() {
          var e = new Error("get-stack-trace");
          var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
          var log = window2.console && (window2.console.warn || window2.console.log);
          if (log) {
            log.call(window2.console, deprecationMessage, stack);
          }
          return method.apply(this, arguments);
        };
      }
      var assign;
      if (typeof Object.assign !== "function") {
        assign = function assign2(target) {
          if (target === undefined2 || target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
          }
          var output = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined2 && source !== null) {
              for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
      } else {
        assign = Object.assign;
      }
      var extend = deprecate(function extend2(dest, src, merge3) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
          if (!merge3 || merge3 && dest[keys[i]] === undefined2) {
            dest[keys[i]] = src[keys[i]];
          }
          i++;
        }
        return dest;
      }, "extend", "Use `assign`.");
      var merge2 = deprecate(function merge3(dest, src) {
        return extend(dest, src, true);
      }, "merge", "Use `assign`.");
      function inherit(child, base, properties) {
        var baseP = base.prototype, childP;
        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;
        if (properties) {
          assign(childP, properties);
        }
      }
      function bindFn(fn, context) {
        return function boundFn() {
          return fn.apply(context, arguments);
        };
      }
      function boolOrFn(val, args) {
        if (typeof val == TYPE_FUNCTION) {
          return val.apply(args ? args[0] || undefined2 : undefined2, args);
        }
        return val;
      }
      function ifUndefined(val1, val2) {
        return val1 === undefined2 ? val2 : val1;
      }
      function addEventListeners(target, types, handler) {
        each2(splitStr(types), function(type) {
          target.addEventListener(type, handler, false);
        });
      }
      function removeEventListeners(target, types, handler) {
        each2(splitStr(types), function(type) {
          target.removeEventListener(type, handler, false);
        });
      }
      function hasParent(node, parent) {
        while (node) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      }
      function inStr(str, find) {
        return str.indexOf(find) > -1;
      }
      function splitStr(str) {
        return str.trim().split(/\s+/g);
      }
      function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
          return src.indexOf(find);
        } else {
          var i = 0;
          while (i < src.length) {
            if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
              return i;
            }
            i++;
          }
          return -1;
        }
      }
      function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
      }
      function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;
        while (i < src.length) {
          var val = key ? src[i][key] : src[i];
          if (inArray(values, val) < 0) {
            results.push(src[i]);
          }
          values[i] = val;
          i++;
        }
        if (sort) {
          if (!key) {
            results = results.sort();
          } else {
            results = results.sort(function sortUniqueArray(a, b) {
              return a[key] > b[key];
            });
          }
        }
        return results;
      }
      function prefixed(obj, property) {
        var prefix, prop;
        var camelProp = property[0].toUpperCase() + property.slice(1);
        var i = 0;
        while (i < VENDOR_PREFIXES.length) {
          prefix = VENDOR_PREFIXES[i];
          prop = prefix ? prefix + camelProp : property;
          if (prop in obj) {
            return prop;
          }
          i++;
        }
        return undefined2;
      }
      var _uniqueId = 1;
      function uniqueId() {
        return _uniqueId++;
      }
      function getWindowForElement(element) {
        var doc = element.ownerDocument || element;
        return doc.defaultView || doc.parentWindow || window2;
      }
      var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
      var SUPPORT_TOUCH = "ontouchstart" in window2;
      var SUPPORT_POINTER_EVENTS = prefixed(window2, "PointerEvent") !== undefined2;
      var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
      var INPUT_TYPE_TOUCH = "touch";
      var INPUT_TYPE_PEN = "pen";
      var INPUT_TYPE_MOUSE = "mouse";
      var INPUT_TYPE_KINECT = "kinect";
      var COMPUTE_INTERVAL = 25;
      var INPUT_START = 1;
      var INPUT_MOVE = 2;
      var INPUT_END = 4;
      var INPUT_CANCEL = 8;
      var DIRECTION_NONE = 1;
      var DIRECTION_LEFT = 2;
      var DIRECTION_RIGHT = 4;
      var DIRECTION_UP = 8;
      var DIRECTION_DOWN = 16;
      var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
      var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
      var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
      var PROPS_XY = ["x", "y"];
      var PROPS_CLIENT_XY = ["clientX", "clientY"];
      function Input(manager, callback2) {
        var self2 = this;
        this.manager = manager;
        this.callback = callback2;
        this.element = manager.element;
        this.target = manager.options.inputTarget;
        this.domHandler = function(ev) {
          if (boolOrFn(manager.options.enable, [manager])) {
            self2.handler(ev);
          }
        };
        this.init();
      }
      Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function() {
        },
        /**
         * bind the events
         */
        init: function() {
          this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
          this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
          this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },
        /**
         * unbind the events
         */
        destroy: function() {
          this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
          this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
          this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
      };
      function createInputInstance(manager) {
        var Type;
        var inputClass = manager.options.inputClass;
        if (inputClass) {
          Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
          Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
          Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
          Type = MouseInput;
        } else {
          Type = TouchMouseInput;
        }
        return new Type(manager, inputHandler);
      }
      function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;
        if (isFirst) {
          manager.session = {};
        }
        input.eventType = eventType;
        computeInputData(manager, input);
        manager.emit("hammer.input", input);
        manager.recognize(input);
        manager.session.prevInput = input;
      }
      function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;
        if (!session.firstInput) {
          session.firstInput = simpleCloneInputData(input);
        }
        if (pointersLength > 1 && !session.firstMultiple) {
          session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
          session.firstMultiple = false;
        }
        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
        var center = input.center = getCenter2(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;
        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);
        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);
        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
        input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
        computeIntervalInputData(session, input);
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
          target = input.srcEvent.target;
        }
        input.target = target;
      }
      function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};
        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
          prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
          };
          offset = session.offsetDelta = {
            x: center.x,
            y: center.y
          };
        }
        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
      }
      function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input, deltaTime = input.timeStamp - last.timeStamp, velocity, velocityX, velocityY, direction;
        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined2)) {
          var deltaX = input.deltaX - last.deltaX;
          var deltaY = input.deltaY - last.deltaY;
          var v = getVelocity(deltaTime, deltaX, deltaY);
          velocityX = v.x;
          velocityY = v.y;
          velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
          direction = getDirection(deltaX, deltaY);
          session.lastInterval = input;
        } else {
          velocity = last.velocity;
          velocityX = last.velocityX;
          velocityY = last.velocityY;
          direction = last.direction;
        }
        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
      }
      function simpleCloneInputData(input) {
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
          pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
          };
          i++;
        }
        return {
          timeStamp: now(),
          pointers,
          center: getCenter2(pointers),
          deltaX: input.deltaX,
          deltaY: input.deltaY
        };
      }
      function getCenter2(pointers) {
        var pointersLength = pointers.length;
        if (pointersLength === 1) {
          return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
          };
        }
        var x = 0, y = 0, i = 0;
        while (i < pointersLength) {
          x += pointers[i].clientX;
          y += pointers[i].clientY;
          i++;
        }
        return {
          x: round(x / pointersLength),
          y: round(y / pointersLength)
        };
      }
      function getVelocity(deltaTime, x, y) {
        return {
          x: x / deltaTime || 0,
          y: y / deltaTime || 0
        };
      }
      function getDirection(x, y) {
        if (x === y) {
          return DIRECTION_NONE;
        }
        if (abs(x) >= abs(y)) {
          return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
      }
      function getDistance(p1, p2, props) {
        if (!props) {
          props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.sqrt(x * x + y * y);
      }
      function getAngle(p1, p2, props) {
        if (!props) {
          props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
      }
      function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
      }
      function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
      }
      var MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
      };
      var MOUSE_ELEMENT_EVENTS = "mousedown";
      var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
      function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;
        this.pressed = false;
        Input.apply(this, arguments);
      }
      inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
          var eventType = MOUSE_INPUT_MAP[ev.type];
          if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
          }
          if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
          }
          if (!this.pressed) {
            return;
          }
          if (eventType & INPUT_END) {
            this.pressed = false;
          }
          this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
          });
        }
      });
      var POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
      };
      var IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT
        // see https://twitter.com/jacobrossi/status/480596438489890816
      };
      var POINTER_ELEMENT_EVENTS = "pointerdown";
      var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
      if (window2.MSPointerEvent && !window2.PointerEvent) {
        POINTER_ELEMENT_EVENTS = "MSPointerDown";
        POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
      }
      function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;
        Input.apply(this, arguments);
        this.store = this.manager.session.pointerEvents = [];
      }
      inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
          var store = this.store;
          var removePointer = false;
          var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
          var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
          var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
          var isTouch = pointerType == INPUT_TYPE_TOUCH;
          var storeIndex = inArray(store, ev.pointerId, "pointerId");
          if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
              store.push(ev);
              storeIndex = store.length - 1;
            }
          } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
          }
          if (storeIndex < 0) {
            return;
          }
          store[storeIndex] = ev;
          this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType,
            srcEvent: ev
          });
          if (removePointer) {
            store.splice(storeIndex, 1);
          }
        }
      });
      var SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
      };
      var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
      var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
      function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;
        Input.apply(this, arguments);
      }
      inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
          var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
          if (type === INPUT_START) {
            this.started = true;
          }
          if (!this.started) {
            return;
          }
          var touches = normalizeSingleTouches.call(this, ev, type);
          if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
          }
          this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
          });
        }
      });
      function normalizeSingleTouches(ev, type) {
        var all = toArray(ev.touches);
        var changed = toArray(ev.changedTouches);
        if (type & (INPUT_END | INPUT_CANCEL)) {
          all = uniqueArray(all.concat(changed), "identifier", true);
        }
        return [all, changed];
      }
      var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
      };
      var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
      function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};
        Input.apply(this, arguments);
      }
      inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
          var type = TOUCH_INPUT_MAP[ev.type];
          var touches = getTouches.call(this, ev, type);
          if (!touches) {
            return;
          }
          this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
          });
        }
      });
      function getTouches(ev, type) {
        var allTouches = toArray(ev.touches);
        var targetIds = this.targetIds;
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
          targetIds[allTouches[0].identifier] = true;
          return [allTouches, allTouches];
        }
        var i, targetTouches, changedTouches = toArray(ev.changedTouches), changedTargetTouches = [], target = this.target;
        targetTouches = allTouches.filter(function(touch) {
          return hasParent(touch.target, target);
        });
        if (type === INPUT_START) {
          i = 0;
          while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
          }
        }
        i = 0;
        while (i < changedTouches.length) {
          if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
          }
          if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
          }
          i++;
        }
        if (!changedTargetTouches.length) {
          return;
        }
        return [
          // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
          uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
          changedTargetTouches
        ];
      }
      var DEDUP_TIMEOUT = 2500;
      var DEDUP_DISTANCE = 25;
      function TouchMouseInput() {
        Input.apply(this, arguments);
        var handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);
        this.primaryTouch = null;
        this.lastTouches = [];
      }
      inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
          var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH, isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
          if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
          }
          if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
          } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
          }
          this.callback(manager, inputEvent, inputData);
        },
        /**
         * remove the event listeners
         */
        destroy: function destroy() {
          this.touch.destroy();
          this.mouse.destroy();
        }
      });
      function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
          this.primaryTouch = eventData.changedPointers[0].identifier;
          setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
          setLastTouch.call(this, eventData);
        }
      }
      function setLastTouch(eventData) {
        var touch = eventData.changedPointers[0];
        if (touch.identifier === this.primaryTouch) {
          var lastTouch = {
            x: touch.clientX,
            y: touch.clientY
          };
          this.lastTouches.push(lastTouch);
          var lts = this.lastTouches;
          var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
              lts.splice(i, 1);
            }
          };
          setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
      }
      function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
          var t = this.lastTouches[i];
          var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
          if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
          }
        }
        return false;
      }
      var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
      var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined2;
      var TOUCH_ACTION_COMPUTE = "compute";
      var TOUCH_ACTION_AUTO = "auto";
      var TOUCH_ACTION_MANIPULATION = "manipulation";
      var TOUCH_ACTION_NONE = "none";
      var TOUCH_ACTION_PAN_X = "pan-x";
      var TOUCH_ACTION_PAN_Y = "pan-y";
      var TOUCH_ACTION_MAP = getTouchActionProps();
      function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
      }
      TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function(value) {
          if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
          }
          if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
          }
          this.actions = value.toLowerCase().trim();
        },
        /**
         * just re-set the touchAction value
         */
        update: function() {
          this.set(this.manager.options.touchAction);
        },
        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function() {
          var actions = [];
          each2(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
              actions = actions.concat(recognizer.getTouchAction());
            }
          });
          return cleanTouchActions(actions.join(" "));
        },
        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function(input) {
          var srcEvent = input.srcEvent;
          var direction = input.offsetDirection;
          if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
          }
          var actions = this.actions;
          var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
          var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
          var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
          if (hasNone) {
            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;
            if (isTapPointer && isTapMovement && isTapTouchTime) {
              return;
            }
          }
          if (hasPanX && hasPanY) {
            return;
          }
          if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
            return this.preventSrc(srcEvent);
          }
        },
        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function(srcEvent) {
          this.manager.session.prevented = true;
          srcEvent.preventDefault();
        }
      };
      function cleanTouchActions(actions) {
        if (inStr(actions, TOUCH_ACTION_NONE)) {
          return TOUCH_ACTION_NONE;
        }
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        if (hasPanX && hasPanY) {
          return TOUCH_ACTION_NONE;
        }
        if (hasPanX || hasPanY) {
          return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
          return TOUCH_ACTION_MANIPULATION;
        }
        return TOUCH_ACTION_AUTO;
      }
      function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
          return false;
        }
        var touchMap = {};
        var cssSupports = window2.CSS && window2.CSS.supports;
        ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
          touchMap[val] = cssSupports ? window2.CSS.supports("touch-action", val) : true;
        });
        return touchMap;
      }
      var STATE_POSSIBLE = 1;
      var STATE_BEGAN = 2;
      var STATE_CHANGED = 4;
      var STATE_ENDED = 8;
      var STATE_RECOGNIZED = STATE_ENDED;
      var STATE_CANCELLED = 16;
      var STATE_FAILED = 32;
      function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});
        this.id = uniqueId();
        this.manager = null;
        this.options.enable = ifUndefined(this.options.enable, true);
        this.state = STATE_POSSIBLE;
        this.simultaneous = {};
        this.requireFail = [];
      }
      Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},
        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function(options) {
          assign(this.options, options);
          this.manager && this.manager.touchAction.update();
          return this;
        },
        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
            return this;
          }
          var simultaneous = this.simultaneous;
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
          }
          return this;
        },
        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
            return this;
          }
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          delete this.simultaneous[otherRecognizer.id];
          return this;
        },
        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
            return this;
          }
          var requireFail = this.requireFail;
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
          }
          return this;
        },
        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
            return this;
          }
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          var index = inArray(this.requireFail, otherRecognizer);
          if (index > -1) {
            this.requireFail.splice(index, 1);
          }
          return this;
        },
        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function() {
          return this.requireFail.length > 0;
        },
        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function(otherRecognizer) {
          return !!this.simultaneous[otherRecognizer.id];
        },
        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function(input) {
          var self2 = this;
          var state = this.state;
          function emit(event) {
            self2.manager.emit(event, input);
          }
          if (state < STATE_ENDED) {
            emit(self2.options.event + stateStr(state));
          }
          emit(self2.options.event);
          if (input.additionalEvent) {
            emit(input.additionalEvent);
          }
          if (state >= STATE_ENDED) {
            emit(self2.options.event + stateStr(state));
          }
        },
        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function(input) {
          if (this.canEmit()) {
            return this.emit(input);
          }
          this.state = STATE_FAILED;
        },
        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function() {
          var i = 0;
          while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
              return false;
            }
            i++;
          }
          return true;
        },
        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function(inputData) {
          var inputDataClone = assign({}, inputData);
          if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
          }
          if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
          }
          this.state = this.process(inputDataClone);
          if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
          }
        },
        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function(inputData) {
        },
        // jshint ignore:line
        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function() {
        },
        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function() {
        }
      };
      function stateStr(state) {
        if (state & STATE_CANCELLED) {
          return "cancel";
        } else if (state & STATE_ENDED) {
          return "end";
        } else if (state & STATE_CHANGED) {
          return "move";
        } else if (state & STATE_BEGAN) {
          return "start";
        }
        return "";
      }
      function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
          return "down";
        } else if (direction == DIRECTION_UP) {
          return "up";
        } else if (direction == DIRECTION_LEFT) {
          return "left";
        } else if (direction == DIRECTION_RIGHT) {
          return "right";
        }
        return "";
      }
      function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
          return manager.get(otherRecognizer);
        }
        return otherRecognizer;
      }
      function AttrRecognizer() {
        Recognizer.apply(this, arguments);
      }
      inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
          /**
           * @type {Number}
           * @default 1
           */
          pointers: 1
        },
        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function(input) {
          var optionPointers = this.options.pointers;
          return optionPointers === 0 || input.pointers.length === optionPointers;
        },
        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function(input) {
          var state = this.state;
          var eventType = input.eventType;
          var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
          var isValid = this.attrTest(input);
          if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
          } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
              return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
              return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
          }
          return STATE_FAILED;
        }
      });
      function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);
        this.pX = null;
        this.pY = null;
      }
      inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
          event: "pan",
          threshold: 10,
          pointers: 1,
          direction: DIRECTION_ALL
        },
        getTouchAction: function() {
          var direction = this.options.direction;
          var actions = [];
          if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
          }
          if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
          }
          return actions;
        },
        directionTest: function(input) {
          var options = this.options;
          var hasMoved = true;
          var distance = input.distance;
          var direction = input.direction;
          var x = input.deltaX;
          var y = input.deltaY;
          if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
              direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
              hasMoved = x != this.pX;
              distance = Math.abs(input.deltaX);
            } else {
              direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
              hasMoved = y != this.pY;
              distance = Math.abs(input.deltaY);
            }
          }
          input.direction = direction;
          return hasMoved && distance > options.threshold && direction & options.direction;
        },
        attrTest: function(input) {
          return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
        },
        emit: function(input) {
          this.pX = input.deltaX;
          this.pY = input.deltaY;
          var direction = directionStr(input.direction);
          if (direction) {
            input.additionalEvent = this.options.event + direction;
          }
          this._super.emit.call(this, input);
        }
      });
      function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
          event: "pinch",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_NONE];
        },
        attrTest: function(input) {
          return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },
        emit: function(input) {
          if (input.scale !== 1) {
            var inOut = input.scale < 1 ? "in" : "out";
            input.additionalEvent = this.options.event + inOut;
          }
          this._super.emit.call(this, input);
        }
      });
      function PressRecognizer() {
        Recognizer.apply(this, arguments);
        this._timer = null;
        this._input = null;
      }
      inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
          event: "press",
          pointers: 1,
          time: 251,
          // minimal time of the pointer to be pressed
          threshold: 9
          // a minimal movement is ok, but keep it low
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_AUTO];
        },
        process: function(input) {
          var options = this.options;
          var validPointers = input.pointers.length === options.pointers;
          var validMovement = input.distance < options.threshold;
          var validTime = input.deltaTime > options.time;
          this._input = input;
          if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
            this.reset();
          } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
              this.state = STATE_RECOGNIZED;
              this.tryEmit();
            }, options.time, this);
          } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
          }
          return STATE_FAILED;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function(input) {
          if (this.state !== STATE_RECOGNIZED) {
            return;
          }
          if (input && input.eventType & INPUT_END) {
            this.manager.emit(this.options.event + "up", input);
          } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
          }
        }
      });
      function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
          event: "rotate",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_NONE];
        },
        attrTest: function(input) {
          return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
      });
      function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
          event: "swipe",
          threshold: 10,
          velocity: 0.3,
          direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
          pointers: 1
        },
        getTouchAction: function() {
          return PanRecognizer.prototype.getTouchAction.call(this);
        },
        attrTest: function(input) {
          var direction = this.options.direction;
          var velocity;
          if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
          } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
          } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
          }
          return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },
        emit: function(input) {
          var direction = directionStr(input.offsetDirection);
          if (direction) {
            this.manager.emit(this.options.event + direction, input);
          }
          this.manager.emit(this.options.event, input);
        }
      });
      function TapRecognizer() {
        Recognizer.apply(this, arguments);
        this.pTime = false;
        this.pCenter = false;
        this._timer = null;
        this._input = null;
        this.count = 0;
      }
      inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
          event: "tap",
          pointers: 1,
          taps: 1,
          interval: 300,
          // max time between the multi-tap taps
          time: 250,
          // max time of the pointer to be down (like finger on the screen)
          threshold: 9,
          // a minimal movement is ok, but keep it low
          posThreshold: 10
          // a multi-tap can be a bit off the initial position
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_MANIPULATION];
        },
        process: function(input) {
          var options = this.options;
          var validPointers = input.pointers.length === options.pointers;
          var validMovement = input.distance < options.threshold;
          var validTouchTime = input.deltaTime < options.time;
          this.reset();
          if (input.eventType & INPUT_START && this.count === 0) {
            return this.failTimeout();
          }
          if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
              return this.failTimeout();
            }
            var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
            this.pTime = input.timeStamp;
            this.pCenter = input.center;
            if (!validMultiTap || !validInterval) {
              this.count = 1;
            } else {
              this.count += 1;
            }
            this._input = input;
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
              if (!this.hasRequireFailures()) {
                return STATE_RECOGNIZED;
              } else {
                this._timer = setTimeoutContext(function() {
                  this.state = STATE_RECOGNIZED;
                  this.tryEmit();
                }, options.interval, this);
                return STATE_BEGAN;
              }
            }
          }
          return STATE_FAILED;
        },
        failTimeout: function() {
          this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
          }, this.options.interval, this);
          return STATE_FAILED;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function() {
          if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
          }
        }
      });
      function Hammer2(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer2.defaults.preset);
        return new Manager(element, options);
      }
      Hammer2.VERSION = "2.0.7";
      Hammer2.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,
        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,
        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,
        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,
        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,
        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
          // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
          [RotateRecognizer, {
            enable: false
          }],
          [PinchRecognizer, {
            enable: false
          }, ["rotate"]],
          [SwipeRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }],
          [PanRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }, ["swipe"]],
          [TapRecognizer],
          [TapRecognizer, {
            event: "doubletap",
            taps: 2
          }, ["tap"]],
          [PressRecognizer]
        ],
        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
          /**
           * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
           * @type {String}
           * @default 'none'
           */
          userSelect: "none",
          /**
           * Disable the Windows Phone grippers when pressing an element.
           * @type {String}
           * @default 'none'
           */
          touchSelect: "none",
          /**
           * Disables the default callout shown when you touch and hold a touch target.
           * On iOS, when you touch and hold a touch target such as a link, Safari displays
           * a callout containing information about the link. This property allows you to disable that callout.
           * @type {String}
           * @default 'none'
           */
          touchCallout: "none",
          /**
           * Specifies whether zooming is enabled. Used by IE10>
           * @type {String}
           * @default 'none'
           */
          contentZooming: "none",
          /**
           * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
           * @type {String}
           * @default 'none'
           */
          userDrag: "none",
          /**
           * Overrides the highlight color shown when the user taps a link or a JavaScript
           * clickable element in iOS. This property obeys the alpha value, if specified.
           * @type {String}
           * @default 'rgba(0,0,0,0)'
           */
          tapHighlightColor: "rgba(0,0,0,0)"
        }
      };
      var STOP = 1;
      var FORCED_STOP = 2;
      function Manager(element, options) {
        this.options = assign({}, Hammer2.defaults, options || {});
        this.options.inputTarget = this.options.inputTarget || element;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};
        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);
        toggleCssProps(this, true);
        each2(this.options.recognizers, function(item) {
          var recognizer = this.add(new item[0](item[1]));
          item[2] && recognizer.recognizeWith(item[2]);
          item[3] && recognizer.requireFailure(item[3]);
        }, this);
      }
      Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function(options) {
          assign(this.options, options);
          if (options.touchAction) {
            this.touchAction.update();
          }
          if (options.inputTarget) {
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
          }
          return this;
        },
        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function(force) {
          this.session.stopped = force ? FORCED_STOP : STOP;
        },
        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function(inputData) {
          var session = this.session;
          if (session.stopped) {
            return;
          }
          this.touchAction.preventDefaults(inputData);
          var recognizer;
          var recognizers = this.recognizers;
          var curRecognizer = session.curRecognizer;
          if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
            curRecognizer = session.curRecognizer = null;
          }
          var i = 0;
          while (i < recognizers.length) {
            recognizer = recognizers[i];
            if (session.stopped !== FORCED_STOP && // 1
            (!curRecognizer || recognizer == curRecognizer || // 2
            recognizer.canRecognizeWith(curRecognizer))) {
              recognizer.recognize(inputData);
            } else {
              recognizer.reset();
            }
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
              curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
          }
        },
        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function(recognizer) {
          if (recognizer instanceof Recognizer) {
            return recognizer;
          }
          var recognizers = this.recognizers;
          for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
              return recognizers[i];
            }
          }
          return null;
        },
        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function(recognizer) {
          if (invokeArrayArg(recognizer, "add", this)) {
            return this;
          }
          var existing = this.get(recognizer.options.event);
          if (existing) {
            this.remove(existing);
          }
          this.recognizers.push(recognizer);
          recognizer.manager = this;
          this.touchAction.update();
          return recognizer;
        },
        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function(recognizer) {
          if (invokeArrayArg(recognizer, "remove", this)) {
            return this;
          }
          recognizer = this.get(recognizer);
          if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);
            if (index !== -1) {
              recognizers.splice(index, 1);
              this.touchAction.update();
            }
          }
          return this;
        },
        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function(events, handler) {
          if (events === undefined2) {
            return;
          }
          if (handler === undefined2) {
            return;
          }
          var handlers = this.handlers;
          each2(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
          });
          return this;
        },
        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function(events, handler) {
          if (events === undefined2) {
            return;
          }
          var handlers = this.handlers;
          each2(splitStr(events), function(event) {
            if (!handler) {
              delete handlers[event];
            } else {
              handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
          });
          return this;
        },
        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function(event, data) {
          if (this.options.domEvents) {
            triggerDomEvent(event, data);
          }
          var handlers = this.handlers[event] && this.handlers[event].slice();
          if (!handlers || !handlers.length) {
            return;
          }
          data.type = event;
          data.preventDefault = function() {
            data.srcEvent.preventDefault();
          };
          var i = 0;
          while (i < handlers.length) {
            handlers[i](data);
            i++;
          }
        },
        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function() {
          this.element && toggleCssProps(this, false);
          this.handlers = {};
          this.session = {};
          this.input.destroy();
          this.element = null;
        }
      };
      function toggleCssProps(manager, add) {
        var element = manager.element;
        if (!element.style) {
          return;
        }
        var prop;
        each2(manager.options.cssProps, function(value, name) {
          prop = prefixed(element.style, name);
          if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
          } else {
            element.style[prop] = manager.oldCssProps[prop] || "";
          }
        });
        if (!add) {
          manager.oldCssProps = {};
        }
      }
      function triggerDomEvent(event, data) {
        var gestureEvent = document2.createEvent("Event");
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
      }
      assign(Hammer2, {
        INPUT_START,
        INPUT_MOVE,
        INPUT_END,
        INPUT_CANCEL,
        STATE_POSSIBLE,
        STATE_BEGAN,
        STATE_CHANGED,
        STATE_ENDED,
        STATE_RECOGNIZED,
        STATE_CANCELLED,
        STATE_FAILED,
        DIRECTION_NONE,
        DIRECTION_LEFT,
        DIRECTION_RIGHT,
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL,
        DIRECTION_ALL,
        Manager,
        Input,
        TouchAction,
        TouchInput,
        MouseInput,
        PointerEventInput,
        TouchMouseInput,
        SingleTouchInput,
        Recognizer,
        AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,
        on: addEventListeners,
        off: removeEventListeners,
        each: each2,
        merge: merge2,
        extend,
        assign,
        inherit,
        bindFn,
        prefixed
      });
      var freeGlobal = typeof window2 !== "undefined" ? window2 : typeof self !== "undefined" ? self : {};
      freeGlobal.Hammer = Hammer2;
      if (typeof define === "function" && define.amd) {
        define(function() {
          return Hammer2;
        });
      } else if (typeof module != "undefined" && module.exports) {
        module.exports = Hammer2;
      } else {
        window2[exportName] = Hammer2;
      }
    })(window, document, "Hammer");
  }
});

// node_modules/chartjs-plugin-zoom/dist/chartjs-plugin-zoom.esm.js
var import_hammerjs = __toESM(require_hammer());
var getModifierKey = (opts) => opts && opts.enabled && opts.modifierKey;
var keyPressed = (key, event) => key && event[key + "Key"];
var keyNotPressed = (key, event) => key && !event[key + "Key"];
function directionEnabled(mode, dir, chart) {
  if (mode === void 0) {
    return true;
  } else if (typeof mode === "string") {
    return mode.indexOf(dir) !== -1;
  } else if (typeof mode === "function") {
    return mode({
      chart
    }).indexOf(dir) !== -1;
  }
  return false;
}
function directionsEnabled(mode, chart) {
  if (typeof mode === "function") {
    mode = mode({
      chart
    });
  }
  if (typeof mode === "string") {
    return {
      x: mode.indexOf("x") !== -1,
      y: mode.indexOf("y") !== -1
    };
  }
  return {
    x: false,
    y: false
  };
}
function debounce2(fn, delay) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
    return delay;
  };
}
function getScaleUnderPoint({
  x,
  y
}, chart) {
  const scales = chart.scales;
  const scaleIds = Object.keys(scales);
  for (let i = 0; i < scaleIds.length; i++) {
    const scale = scales[scaleIds[i]];
    if (y >= scale.top && y <= scale.bottom && x >= scale.left && x <= scale.right) {
      return scale;
    }
  }
  return null;
}
function getEnabledScalesByPoint(options, point, chart) {
  const {
    mode = "xy",
    scaleMode,
    overScaleMode
  } = options || {};
  const scale = getScaleUnderPoint(point, chart);
  const enabled = directionsEnabled(mode, chart);
  const scaleEnabled = directionsEnabled(scaleMode, chart);
  if (overScaleMode) {
    const overScaleEnabled = directionsEnabled(overScaleMode, chart);
    for (const axis of ["x", "y"]) {
      if (overScaleEnabled[axis]) {
        scaleEnabled[axis] = enabled[axis];
        enabled[axis] = false;
      }
    }
  }
  if (scale && scaleEnabled[scale.axis]) {
    return [scale];
  }
  const enabledScales = [];
  each(chart.scales, function(scaleItem) {
    if (enabled[scaleItem.axis]) {
      enabledScales.push(scaleItem);
    }
  });
  return enabledScales;
}
var chartStates = /* @__PURE__ */ new WeakMap();
function getState(chart) {
  let state = chartStates.get(chart);
  if (!state) {
    state = {
      originalScaleLimits: {},
      updatedScaleLimits: {},
      handlers: {},
      panDelta: {},
      dragging: false,
      panning: false
    };
    chartStates.set(chart, state);
  }
  return state;
}
function removeState(chart) {
  chartStates.delete(chart);
}
function zoomDelta(val, min, range, newRange) {
  const minPercent = Math.max(0, Math.min(1, (val - min) / range || 0));
  const maxPercent = 1 - minPercent;
  return {
    min: newRange * minPercent,
    max: newRange * maxPercent
  };
}
function getValueAtPoint(scale, point) {
  const pixel = scale.isHorizontal() ? point.x : point.y;
  return scale.getValueForPixel(pixel);
}
function linearZoomDelta(scale, zoom2, center) {
  const range = scale.max - scale.min;
  const newRange = range * (zoom2 - 1);
  const centerValue = getValueAtPoint(scale, center);
  return zoomDelta(centerValue, scale.min, range, newRange);
}
function logarithmicZoomRange(scale, zoom2, center) {
  const centerValue = getValueAtPoint(scale, center);
  if (centerValue === void 0) {
    return {
      min: scale.min,
      max: scale.max
    };
  }
  const logMin = Math.log10(scale.min);
  const logMax = Math.log10(scale.max);
  const logCenter = Math.log10(centerValue);
  const logRange = logMax - logMin;
  const newLogRange = logRange * (zoom2 - 1);
  const delta = zoomDelta(logCenter, logMin, logRange, newLogRange);
  return {
    min: Math.pow(10, logMin + delta.min),
    max: Math.pow(10, logMax - delta.max)
  };
}
function getScaleLimits(scale, limits) {
  return limits && (limits[scale.id] || limits[scale.axis]) || {};
}
function getLimit(state, scale, scaleLimits, prop, fallback) {
  let limit = scaleLimits[prop];
  if (limit === "original") {
    const original = state.originalScaleLimits[scale.id][prop];
    limit = valueOrDefault(original.options, original.scale);
  }
  return valueOrDefault(limit, fallback);
}
function linearRange(scale, pixel0, pixel1) {
  const v0 = scale.getValueForPixel(pixel0);
  const v1 = scale.getValueForPixel(pixel1);
  return {
    min: Math.min(v0, v1),
    max: Math.max(v0, v1)
  };
}
function fixRange(range, {
  min,
  max,
  minLimit,
  maxLimit
}, originalLimits) {
  const offset = (range - max + min) / 2;
  min -= offset;
  max += offset;
  const origMin = originalLimits.min.options ?? originalLimits.min.scale;
  const origMax = originalLimits.max.options ?? originalLimits.max.scale;
  const epsilon = range / 1e6;
  if (almostEquals(min, origMin, epsilon)) {
    min = origMin;
  }
  if (almostEquals(max, origMax, epsilon)) {
    max = origMax;
  }
  if (min < minLimit) {
    min = minLimit;
    max = Math.min(minLimit + range, maxLimit);
  } else if (max > maxLimit) {
    max = maxLimit;
    min = Math.max(maxLimit - range, minLimit);
  }
  return {
    min,
    max
  };
}
function updateRange(scale, {
  min,
  max
}, limits, zoom2 = false) {
  const state = getState(scale.chart);
  const {
    options: scaleOpts
  } = scale;
  const scaleLimits = getScaleLimits(scale, limits);
  const {
    minRange = 0
  } = scaleLimits;
  const minLimit = getLimit(state, scale, scaleLimits, "min", -Infinity);
  const maxLimit = getLimit(state, scale, scaleLimits, "max", Infinity);
  if (zoom2 === "pan" && (min < minLimit || max > maxLimit)) {
    return true;
  }
  const scaleRange = scale.max - scale.min;
  const range = zoom2 ? Math.max(max - min, minRange) : scaleRange;
  if (zoom2 && range === minRange && scaleRange <= minRange) {
    return true;
  }
  const newRange = fixRange(range, {
    min,
    max,
    minLimit,
    maxLimit
  }, state.originalScaleLimits[scale.id]);
  scaleOpts.min = newRange.min;
  scaleOpts.max = newRange.max;
  state.updatedScaleLimits[scale.id] = newRange;
  return scale.parse(newRange.min) !== scale.min || scale.parse(newRange.max) !== scale.max;
}
function zoomNumericalScale(scale, zoom2, center, limits) {
  const delta = linearZoomDelta(scale, zoom2, center);
  const newRange = {
    min: scale.min + delta.min,
    max: scale.max - delta.max
  };
  return updateRange(scale, newRange, limits, true);
}
function zoomLogarithmicScale(scale, zoom2, center, limits) {
  const newRange = logarithmicZoomRange(scale, zoom2, center);
  return updateRange(scale, newRange, limits, true);
}
function zoomRectNumericalScale(scale, from, to, limits) {
  updateRange(scale, linearRange(scale, from, to), limits, true);
}
var integerChange = (v) => v === 0 || isNaN(v) ? 0 : v < 0 ? Math.min(Math.round(v), -1) : Math.max(Math.round(v), 1);
function existCategoryFromMaxZoom(scale) {
  const labels = scale.getLabels();
  const maxIndex = labels.length - 1;
  if (scale.min > 0) {
    scale.min -= 1;
  }
  if (scale.max < maxIndex) {
    scale.max += 1;
  }
}
function zoomCategoryScale(scale, zoom2, center, limits) {
  const delta = linearZoomDelta(scale, zoom2, center);
  if (scale.min === scale.max && zoom2 < 1) {
    existCategoryFromMaxZoom(scale);
  }
  const newRange = {
    min: scale.min + integerChange(delta.min),
    max: scale.max - integerChange(delta.max)
  };
  return updateRange(scale, newRange, limits, true);
}
function scaleLength(scale) {
  return scale.isHorizontal() ? scale.width : scale.height;
}
function panCategoryScale(scale, delta, limits) {
  const labels = scale.getLabels();
  const lastLabelIndex = labels.length - 1;
  let {
    min,
    max
  } = scale;
  const range = Math.max(max - min, 1);
  const stepDelta = Math.round(scaleLength(scale) / Math.max(range, 10));
  const stepSize = Math.round(Math.abs(delta / stepDelta));
  let applied;
  if (delta < -stepDelta) {
    max = Math.min(max + stepSize, lastLabelIndex);
    min = range === 1 ? max : max - range;
    applied = max === lastLabelIndex;
  } else if (delta > stepDelta) {
    min = Math.max(0, min - stepSize);
    max = range === 1 ? min : min + range;
    applied = min === 0;
  }
  return updateRange(scale, {
    min,
    max
  }, limits) || applied;
}
var OFFSETS = {
  second: 500,
  minute: 30 * 1e3,
  hour: 30 * 60 * 1e3,
  day: 12 * 60 * 60 * 1e3,
  week: 3.5 * 24 * 60 * 60 * 1e3,
  month: 15 * 24 * 60 * 60 * 1e3,
  quarter: 60 * 24 * 60 * 60 * 1e3,
  year: 182 * 24 * 60 * 60 * 1e3
};
function panNumericalScale(scale, delta, limits, pan2 = false) {
  const {
    min: prevStart,
    max: prevEnd,
    options
  } = scale;
  const round = options.time && options.time.round;
  const offset = OFFSETS[round] || 0;
  const newMin = scale.getValueForPixel(scale.getPixelForValue(prevStart + offset) - delta);
  const newMax = scale.getValueForPixel(scale.getPixelForValue(prevEnd + offset) - delta);
  if (isNaN(newMin) || isNaN(newMax)) {
    return true;
  }
  return updateRange(scale, {
    min: newMin,
    max: newMax
  }, limits, pan2 ? "pan" : false);
}
function panNonLinearScale(scale, delta, limits) {
  return panNumericalScale(scale, delta, limits, true);
}
var zoomFunctions = {
  category: zoomCategoryScale,
  default: zoomNumericalScale,
  logarithmic: zoomLogarithmicScale
};
var zoomRectFunctions = {
  default: zoomRectNumericalScale
};
var panFunctions = {
  category: panCategoryScale,
  default: panNumericalScale,
  logarithmic: panNonLinearScale,
  timeseries: panNonLinearScale
};
function shouldUpdateScaleLimits(scale, originalScaleLimits, updatedScaleLimits) {
  const {
    id,
    options: {
      min,
      max
    }
  } = scale;
  if (!originalScaleLimits[id] || !updatedScaleLimits[id]) {
    return true;
  }
  const previous = updatedScaleLimits[id];
  return previous.min !== min || previous.max !== max;
}
function removeMissingScales(limits, scales) {
  each(limits, (opt, key) => {
    if (!scales[key]) {
      delete limits[key];
    }
  });
}
function storeOriginalScaleLimits(chart, state) {
  const {
    scales
  } = chart;
  const {
    originalScaleLimits,
    updatedScaleLimits
  } = state;
  each(scales, function(scale) {
    if (shouldUpdateScaleLimits(scale, originalScaleLimits, updatedScaleLimits)) {
      originalScaleLimits[scale.id] = {
        min: {
          scale: scale.min,
          options: scale.options.min
        },
        max: {
          scale: scale.max,
          options: scale.options.max
        }
      };
    }
  });
  removeMissingScales(originalScaleLimits, scales);
  removeMissingScales(updatedScaleLimits, scales);
  return originalScaleLimits;
}
function doZoom(scale, amount, center, limits) {
  const fn = zoomFunctions[scale.type] || zoomFunctions.default;
  callback(fn, [scale, amount, center, limits]);
}
function doZoomRect(scale, from, to, limits) {
  const fn = zoomRectFunctions[scale.type] || zoomRectFunctions.default;
  callback(fn, [scale, from, to, limits]);
}
function getCenter(chart) {
  const ca = chart.chartArea;
  return {
    x: (ca.left + ca.right) / 2,
    y: (ca.top + ca.bottom) / 2
  };
}
function zoom(chart, amount, transition = "none", trigger = "api") {
  const {
    x = 1,
    y = 1,
    focalPoint = getCenter(chart)
  } = typeof amount === "number" ? {
    x: amount,
    y: amount
  } : amount;
  const state = getState(chart);
  const {
    options: {
      limits,
      zoom: zoomOptions
    }
  } = state;
  storeOriginalScaleLimits(chart, state);
  const xEnabled = x !== 1;
  const yEnabled = y !== 1;
  const enabledScales = getEnabledScalesByPoint(zoomOptions, focalPoint, chart);
  each(enabledScales || chart.scales, function(scale) {
    if (scale.isHorizontal() && xEnabled) {
      doZoom(scale, x, focalPoint, limits);
    } else if (!scale.isHorizontal() && yEnabled) {
      doZoom(scale, y, focalPoint, limits);
    }
  });
  chart.update(transition);
  callback(zoomOptions.onZoom, [{
    chart,
    trigger
  }]);
}
function zoomRect(chart, p0, p1, transition = "none", trigger = "api") {
  const state = getState(chart);
  const {
    options: {
      limits,
      zoom: zoomOptions
    }
  } = state;
  const {
    mode = "xy"
  } = zoomOptions;
  storeOriginalScaleLimits(chart, state);
  const xEnabled = directionEnabled(mode, "x", chart);
  const yEnabled = directionEnabled(mode, "y", chart);
  each(chart.scales, function(scale) {
    if (scale.isHorizontal() && xEnabled) {
      doZoomRect(scale, p0.x, p1.x, limits);
    } else if (!scale.isHorizontal() && yEnabled) {
      doZoomRect(scale, p0.y, p1.y, limits);
    }
  });
  chart.update(transition);
  callback(zoomOptions.onZoom, [{
    chart,
    trigger
  }]);
}
function zoomScale(chart, scaleId, range, transition = "none", trigger = "api") {
  const state = getState(chart);
  storeOriginalScaleLimits(chart, state);
  const scale = chart.scales[scaleId];
  updateRange(scale, range, void 0, true);
  chart.update(transition);
  callback(state.options.zoom?.onZoom, [{
    chart,
    trigger
  }]);
}
function resetZoom(chart, transition = "default") {
  const state = getState(chart);
  const originalScaleLimits = storeOriginalScaleLimits(chart, state);
  each(chart.scales, function(scale) {
    const scaleOptions = scale.options;
    if (originalScaleLimits[scale.id]) {
      scaleOptions.min = originalScaleLimits[scale.id].min.options;
      scaleOptions.max = originalScaleLimits[scale.id].max.options;
    } else {
      delete scaleOptions.min;
      delete scaleOptions.max;
    }
    delete state.updatedScaleLimits[scale.id];
  });
  chart.update(transition);
  callback(state.options.zoom.onZoomComplete, [{
    chart
  }]);
}
function getOriginalRange(state, scaleId) {
  const original = state.originalScaleLimits[scaleId];
  if (!original) {
    return;
  }
  const {
    min,
    max
  } = original;
  return valueOrDefault(max.options, max.scale) - valueOrDefault(min.options, min.scale);
}
function getZoomLevel(chart) {
  const state = getState(chart);
  let min = 1;
  let max = 1;
  each(chart.scales, function(scale) {
    const origRange = getOriginalRange(state, scale.id);
    if (origRange) {
      const level = Math.round(origRange / (scale.max - scale.min) * 100) / 100;
      min = Math.min(min, level);
      max = Math.max(max, level);
    }
  });
  return min < 1 ? min : max;
}
function panScale(scale, delta, limits, state) {
  const {
    panDelta
  } = state;
  const storedDelta = panDelta[scale.id] || 0;
  if (sign(storedDelta) === sign(delta)) {
    delta += storedDelta;
  }
  const fn = panFunctions[scale.type] || panFunctions.default;
  if (callback(fn, [scale, delta, limits])) {
    panDelta[scale.id] = 0;
  } else {
    panDelta[scale.id] = delta;
  }
}
function pan(chart, delta, enabledScales, transition = "none") {
  const {
    x = 0,
    y = 0
  } = typeof delta === "number" ? {
    x: delta,
    y: delta
  } : delta;
  const state = getState(chart);
  const {
    options: {
      pan: panOptions,
      limits
    }
  } = state;
  const {
    onPan
  } = panOptions || {};
  storeOriginalScaleLimits(chart, state);
  const xEnabled = x !== 0;
  const yEnabled = y !== 0;
  each(enabledScales || chart.scales, function(scale) {
    if (scale.isHorizontal() && xEnabled) {
      panScale(scale, x, limits, state);
    } else if (!scale.isHorizontal() && yEnabled) {
      panScale(scale, y, limits, state);
    }
  });
  chart.update(transition);
  callback(onPan, [{
    chart
  }]);
}
function getInitialScaleBounds(chart) {
  const state = getState(chart);
  storeOriginalScaleLimits(chart, state);
  const scaleBounds = {};
  for (const scaleId of Object.keys(chart.scales)) {
    const {
      min,
      max
    } = state.originalScaleLimits[scaleId] || {
      min: {},
      max: {}
    };
    scaleBounds[scaleId] = {
      min: min.scale,
      max: max.scale
    };
  }
  return scaleBounds;
}
function getZoomedScaleBounds(chart) {
  const state = getState(chart);
  const scaleBounds = {};
  for (const scaleId of Object.keys(chart.scales)) {
    scaleBounds[scaleId] = state.updatedScaleLimits[scaleId];
  }
  return scaleBounds;
}
function isZoomedOrPanned(chart) {
  const scaleBounds = getInitialScaleBounds(chart);
  for (const scaleId of Object.keys(chart.scales)) {
    const {
      min: originalMin,
      max: originalMax
    } = scaleBounds[scaleId];
    if (originalMin !== void 0 && chart.scales[scaleId].min !== originalMin) {
      return true;
    }
    if (originalMax !== void 0 && chart.scales[scaleId].max !== originalMax) {
      return true;
    }
  }
  return false;
}
function isZoomingOrPanning(chart) {
  const state = getState(chart);
  return state.panning || state.dragging;
}
var clamp = (x, from, to) => Math.min(to, Math.max(from, x));
function removeHandler(chart, type) {
  const {
    handlers
  } = getState(chart);
  const handler = handlers[type];
  if (handler && handler.target) {
    handler.target.removeEventListener(type, handler);
    delete handlers[type];
  }
}
function addHandler(chart, target, type, handler) {
  const {
    handlers,
    options
  } = getState(chart);
  const oldHandler = handlers[type];
  if (oldHandler && oldHandler.target === target) {
    return;
  }
  removeHandler(chart, type);
  handlers[type] = (event) => handler(chart, event, options);
  handlers[type].target = target;
  const passive = type === "wheel" ? false : void 0;
  target.addEventListener(type, handlers[type], {
    passive
  });
}
function mouseMove(chart, event) {
  const state = getState(chart);
  if (state.dragStart) {
    state.dragging = true;
    state.dragEnd = event;
    chart.update("none");
  }
}
function keyDown(chart, event) {
  const state = getState(chart);
  if (!state.dragStart || event.key !== "Escape") {
    return;
  }
  removeHandler(chart, "keydown");
  state.dragging = false;
  state.dragStart = state.dragEnd = null;
  chart.update("none");
}
function getPointPosition(event, chart) {
  if (event.target !== chart.canvas) {
    const canvasArea = chart.canvas.getBoundingClientRect();
    return {
      x: event.clientX - canvasArea.left,
      y: event.clientY - canvasArea.top
    };
  }
  return getRelativePosition(event, chart);
}
function zoomStart(chart, event, zoomOptions) {
  const {
    onZoomStart,
    onZoomRejected
  } = zoomOptions;
  if (onZoomStart) {
    const point = getPointPosition(event, chart);
    if (callback(onZoomStart, [{
      chart,
      event,
      point
    }]) === false) {
      callback(onZoomRejected, [{
        chart,
        event
      }]);
      return false;
    }
  }
}
function mouseDown(chart, event) {
  if (chart.legend) {
    const point = getRelativePosition(event, chart);
    if (_isPointInArea(point, chart.legend)) {
      return;
    }
  }
  const state = getState(chart);
  const {
    pan: panOptions,
    zoom: zoomOptions = {}
  } = state.options;
  if (event.button !== 0 || keyPressed(getModifierKey(panOptions), event) || keyNotPressed(getModifierKey(zoomOptions.drag), event)) {
    return callback(zoomOptions.onZoomRejected, [{
      chart,
      event
    }]);
  }
  if (zoomStart(chart, event, zoomOptions) === false) {
    return;
  }
  state.dragStart = event;
  addHandler(chart, chart.canvas.ownerDocument, "mousemove", mouseMove);
  addHandler(chart, window.document, "keydown", keyDown);
}
function applyAspectRatio({
  begin,
  end
}, aspectRatio) {
  let width = end.x - begin.x;
  let height = end.y - begin.y;
  const ratio = Math.abs(width / height);
  if (ratio > aspectRatio) {
    width = Math.sign(width) * Math.abs(height * aspectRatio);
  } else if (ratio < aspectRatio) {
    height = Math.sign(height) * Math.abs(width / aspectRatio);
  }
  end.x = begin.x + width;
  end.y = begin.y + height;
}
function applyMinMaxProps(rect, chartArea, points, {
  min,
  max,
  prop
}) {
  rect[min] = clamp(Math.min(points.begin[prop], points.end[prop]), chartArea[min], chartArea[max]);
  rect[max] = clamp(Math.max(points.begin[prop], points.end[prop]), chartArea[min], chartArea[max]);
}
function getRelativePoints(chart, pointEvents, maintainAspectRatio) {
  const points = {
    begin: getPointPosition(pointEvents.dragStart, chart),
    end: getPointPosition(pointEvents.dragEnd, chart)
  };
  if (maintainAspectRatio) {
    const aspectRatio = chart.chartArea.width / chart.chartArea.height;
    applyAspectRatio(points, aspectRatio);
  }
  return points;
}
function computeDragRect(chart, mode, pointEvents, maintainAspectRatio) {
  const xEnabled = directionEnabled(mode, "x", chart);
  const yEnabled = directionEnabled(mode, "y", chart);
  const {
    top,
    left,
    right,
    bottom,
    width: chartWidth,
    height: chartHeight
  } = chart.chartArea;
  const rect = {
    top,
    left,
    right,
    bottom
  };
  const points = getRelativePoints(chart, pointEvents, maintainAspectRatio && xEnabled && yEnabled);
  if (xEnabled) {
    applyMinMaxProps(rect, chart.chartArea, points, {
      min: "left",
      max: "right",
      prop: "x"
    });
  }
  if (yEnabled) {
    applyMinMaxProps(rect, chart.chartArea, points, {
      min: "top",
      max: "bottom",
      prop: "y"
    });
  }
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  return __spreadProps(__spreadValues({}, rect), {
    width,
    height,
    zoomX: xEnabled && width ? 1 + (chartWidth - width) / chartWidth : 1,
    zoomY: yEnabled && height ? 1 + (chartHeight - height) / chartHeight : 1
  });
}
function mouseUp(chart, event) {
  const state = getState(chart);
  if (!state.dragStart) {
    return;
  }
  removeHandler(chart, "mousemove");
  const {
    mode,
    onZoomComplete,
    drag: {
      threshold = 0,
      maintainAspectRatio
    }
  } = state.options.zoom;
  const rect = computeDragRect(chart, mode, {
    dragStart: state.dragStart,
    dragEnd: event
  }, maintainAspectRatio);
  const distanceX = directionEnabled(mode, "x", chart) ? rect.width : 0;
  const distanceY = directionEnabled(mode, "y", chart) ? rect.height : 0;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  state.dragStart = state.dragEnd = null;
  if (distance <= threshold) {
    state.dragging = false;
    chart.update("none");
    return;
  }
  zoomRect(chart, {
    x: rect.left,
    y: rect.top
  }, {
    x: rect.right,
    y: rect.bottom
  }, "zoom", "drag");
  state.dragging = false;
  state.filterNextClick = true;
  callback(onZoomComplete, [{
    chart
  }]);
}
function wheelPreconditions(chart, event, zoomOptions) {
  if (keyNotPressed(getModifierKey(zoomOptions.wheel), event)) {
    callback(zoomOptions.onZoomRejected, [{
      chart,
      event
    }]);
    return;
  }
  if (zoomStart(chart, event, zoomOptions) === false) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  if (event.deltaY === void 0) {
    return;
  }
  return true;
}
function wheel(chart, event) {
  const {
    handlers: {
      onZoomComplete
    },
    options: {
      zoom: zoomOptions
    }
  } = getState(chart);
  if (!wheelPreconditions(chart, event, zoomOptions)) {
    return;
  }
  const rect = event.target.getBoundingClientRect();
  const speed = zoomOptions.wheel.speed;
  const percentage = event.deltaY >= 0 ? 2 - 1 / (1 - speed) : 1 + speed;
  const amount = {
    x: percentage,
    y: percentage,
    focalPoint: {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  };
  zoom(chart, amount, "zoom", "wheel");
  callback(onZoomComplete, [{
    chart
  }]);
}
function addDebouncedHandler(chart, name, handler, delay) {
  if (handler) {
    getState(chart).handlers[name] = debounce2(() => callback(handler, [{
      chart
    }]), delay);
  }
}
function addListeners(chart, options) {
  const canvas = chart.canvas;
  const {
    wheel: wheelOptions,
    drag: dragOptions,
    onZoomComplete
  } = options.zoom;
  if (wheelOptions.enabled) {
    addHandler(chart, canvas, "wheel", wheel);
    addDebouncedHandler(chart, "onZoomComplete", onZoomComplete, 250);
  } else {
    removeHandler(chart, "wheel");
  }
  if (dragOptions.enabled) {
    addHandler(chart, canvas, "mousedown", mouseDown);
    addHandler(chart, canvas.ownerDocument, "mouseup", mouseUp);
  } else {
    removeHandler(chart, "mousedown");
    removeHandler(chart, "mousemove");
    removeHandler(chart, "mouseup");
    removeHandler(chart, "keydown");
  }
}
function removeListeners(chart) {
  removeHandler(chart, "mousedown");
  removeHandler(chart, "mousemove");
  removeHandler(chart, "mouseup");
  removeHandler(chart, "wheel");
  removeHandler(chart, "click");
  removeHandler(chart, "keydown");
}
function createEnabler(chart, state) {
  return function(recognizer, event) {
    const {
      pan: panOptions,
      zoom: zoomOptions = {}
    } = state.options;
    if (!panOptions || !panOptions.enabled) {
      return false;
    }
    const srcEvent = event && event.srcEvent;
    if (!srcEvent) {
      return true;
    }
    if (!state.panning && event.pointerType === "mouse" && (keyNotPressed(getModifierKey(panOptions), srcEvent) || keyPressed(getModifierKey(zoomOptions.drag), srcEvent))) {
      callback(panOptions.onPanRejected, [{
        chart,
        event
      }]);
      return false;
    }
    return true;
  };
}
function pinchAxes(p0, p1) {
  const pinchX = Math.abs(p0.clientX - p1.clientX);
  const pinchY = Math.abs(p0.clientY - p1.clientY);
  const p = pinchX / pinchY;
  let x, y;
  if (p > 0.3 && p < 1.7) {
    x = y = true;
  } else if (pinchX > pinchY) {
    x = true;
  } else {
    y = true;
  }
  return {
    x,
    y
  };
}
function handlePinch(chart, state, e) {
  if (state.scale) {
    const {
      center,
      pointers
    } = e;
    const zoomPercent = 1 / state.scale * e.scale;
    const rect = e.target.getBoundingClientRect();
    const pinch = pinchAxes(pointers[0], pointers[1]);
    const mode = state.options.zoom.mode;
    const amount = {
      x: pinch.x && directionEnabled(mode, "x", chart) ? zoomPercent : 1,
      y: pinch.y && directionEnabled(mode, "y", chart) ? zoomPercent : 1,
      focalPoint: {
        x: center.x - rect.left,
        y: center.y - rect.top
      }
    };
    zoom(chart, amount, "zoom", "pinch");
    state.scale = e.scale;
  }
}
function startPinch(chart, state, event) {
  if (state.options.zoom.pinch.enabled) {
    const point = getRelativePosition(event, chart);
    if (callback(state.options.zoom.onZoomStart, [{
      chart,
      event,
      point
    }]) === false) {
      state.scale = null;
      callback(state.options.zoom.onZoomRejected, [{
        chart,
        event
      }]);
    } else {
      state.scale = 1;
    }
  }
}
function endPinch(chart, state, e) {
  if (state.scale) {
    handlePinch(chart, state, e);
    state.scale = null;
    callback(state.options.zoom.onZoomComplete, [{
      chart
    }]);
  }
}
function handlePan(chart, state, e) {
  const delta = state.delta;
  if (delta) {
    state.panning = true;
    pan(chart, {
      x: e.deltaX - delta.x,
      y: e.deltaY - delta.y
    }, state.panScales);
    state.delta = {
      x: e.deltaX,
      y: e.deltaY
    };
  }
}
function startPan(chart, state, event) {
  const {
    enabled,
    onPanStart,
    onPanRejected
  } = state.options.pan;
  if (!enabled) {
    return;
  }
  const rect = event.target.getBoundingClientRect();
  const point = {
    x: event.center.x - rect.left,
    y: event.center.y - rect.top
  };
  if (callback(onPanStart, [{
    chart,
    event,
    point
  }]) === false) {
    return callback(onPanRejected, [{
      chart,
      event
    }]);
  }
  state.panScales = getEnabledScalesByPoint(state.options.pan, point, chart);
  state.delta = {
    x: 0,
    y: 0
  };
  handlePan(chart, state, event);
}
function endPan(chart, state) {
  state.delta = null;
  if (state.panning) {
    state.panning = false;
    state.filterNextClick = true;
    callback(state.options.pan.onPanComplete, [{
      chart
    }]);
  }
}
var hammers = /* @__PURE__ */ new WeakMap();
function startHammer(chart, options) {
  const state = getState(chart);
  const canvas = chart.canvas;
  const {
    pan: panOptions,
    zoom: zoomOptions
  } = options;
  const mc = new import_hammerjs.default.Manager(canvas);
  if (zoomOptions && zoomOptions.pinch.enabled) {
    mc.add(new import_hammerjs.default.Pinch());
    mc.on("pinchstart", (e) => startPinch(chart, state, e));
    mc.on("pinch", (e) => handlePinch(chart, state, e));
    mc.on("pinchend", (e) => endPinch(chart, state, e));
  }
  if (panOptions && panOptions.enabled) {
    mc.add(new import_hammerjs.default.Pan({
      threshold: panOptions.threshold,
      enable: createEnabler(chart, state)
    }));
    mc.on("panstart", (e) => startPan(chart, state, e));
    mc.on("panmove", (e) => handlePan(chart, state, e));
    mc.on("panend", () => endPan(chart, state));
  }
  hammers.set(chart, mc);
}
function stopHammer(chart) {
  const mc = hammers.get(chart);
  if (mc) {
    mc.remove("pinchstart");
    mc.remove("pinch");
    mc.remove("pinchend");
    mc.remove("panstart");
    mc.remove("pan");
    mc.remove("panend");
    mc.destroy();
    hammers.delete(chart);
  }
}
function hammerOptionsChanged(oldOptions, newOptions) {
  const {
    pan: oldPan,
    zoom: oldZoom
  } = oldOptions;
  const {
    pan: newPan,
    zoom: newZoom
  } = newOptions;
  if (oldZoom?.zoom?.pinch?.enabled !== newZoom?.zoom?.pinch?.enabled) {
    return true;
  }
  if (oldPan?.enabled !== newPan?.enabled) {
    return true;
  }
  if (oldPan?.threshold !== newPan?.threshold) {
    return true;
  }
  return false;
}
var version = "2.2.0";
function draw(chart, caller, options) {
  const dragOptions = options.zoom.drag;
  const {
    dragStart,
    dragEnd
  } = getState(chart);
  if (dragOptions.drawTime !== caller || !dragEnd) {
    return;
  }
  const {
    left,
    top,
    width,
    height
  } = computeDragRect(chart, options.zoom.mode, {
    dragStart,
    dragEnd
  }, dragOptions.maintainAspectRatio);
  const ctx = chart.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = dragOptions.backgroundColor || "rgba(225,225,225,0.3)";
  ctx.fillRect(left, top, width, height);
  if (dragOptions.borderWidth > 0) {
    ctx.lineWidth = dragOptions.borderWidth;
    ctx.strokeStyle = dragOptions.borderColor || "rgba(225,225,225)";
    ctx.strokeRect(left, top, width, height);
  }
  ctx.restore();
}
var plugin = {
  id: "zoom",
  version,
  defaults: {
    pan: {
      enabled: false,
      mode: "xy",
      threshold: 10,
      modifierKey: null
    },
    zoom: {
      wheel: {
        enabled: false,
        speed: 0.1,
        modifierKey: null
      },
      drag: {
        enabled: false,
        drawTime: "beforeDatasetsDraw",
        modifierKey: null
      },
      pinch: {
        enabled: false
      },
      mode: "xy"
    }
  },
  start: function(chart, _args, options) {
    const state = getState(chart);
    state.options = options;
    if (Object.prototype.hasOwnProperty.call(options.zoom, "enabled")) {
      console.warn("The option `zoom.enabled` is no longer supported. Please use `zoom.wheel.enabled`, `zoom.drag.enabled`, or `zoom.pinch.enabled`.");
    }
    if (Object.prototype.hasOwnProperty.call(options.zoom, "overScaleMode") || Object.prototype.hasOwnProperty.call(options.pan, "overScaleMode")) {
      console.warn("The option `overScaleMode` is deprecated. Please use `scaleMode` instead (and update `mode` as desired).");
    }
    if (import_hammerjs.default) {
      startHammer(chart, options);
    }
    chart.pan = (delta, panScales, transition) => pan(chart, delta, panScales, transition);
    chart.zoom = (args, transition) => zoom(chart, args, transition);
    chart.zoomRect = (p0, p1, transition) => zoomRect(chart, p0, p1, transition);
    chart.zoomScale = (id, range, transition) => zoomScale(chart, id, range, transition);
    chart.resetZoom = (transition) => resetZoom(chart, transition);
    chart.getZoomLevel = () => getZoomLevel(chart);
    chart.getInitialScaleBounds = () => getInitialScaleBounds(chart);
    chart.getZoomedScaleBounds = () => getZoomedScaleBounds(chart);
    chart.isZoomedOrPanned = () => isZoomedOrPanned(chart);
    chart.isZoomingOrPanning = () => isZoomingOrPanning(chart);
  },
  beforeEvent(chart, {
    event
  }) {
    if (isZoomingOrPanning(chart)) {
      return false;
    }
    if (event.type === "click" || event.type === "mouseup") {
      const state = getState(chart);
      if (state.filterNextClick) {
        state.filterNextClick = false;
        return false;
      }
    }
  },
  beforeUpdate: function(chart, args, options) {
    const state = getState(chart);
    const previousOptions = state.options;
    state.options = options;
    if (hammerOptionsChanged(previousOptions, options)) {
      stopHammer(chart);
      startHammer(chart, options);
    }
    addListeners(chart, options);
  },
  beforeDatasetsDraw(chart, _args, options) {
    draw(chart, "beforeDatasetsDraw", options);
  },
  afterDatasetsDraw(chart, _args, options) {
    draw(chart, "afterDatasetsDraw", options);
  },
  beforeDraw(chart, _args, options) {
    draw(chart, "beforeDraw", options);
  },
  afterDraw(chart, _args, options) {
    draw(chart, "afterDraw", options);
  },
  stop: function(chart) {
    removeListeners(chart);
    if (import_hammerjs.default) {
      stopHammer(chart);
    }
    removeState(chart);
  },
  panFunctions,
  zoomFunctions,
  zoomRectFunctions
};
export {
  plugin as default,
  pan,
  resetZoom,
  zoom,
  zoomRect,
  zoomScale
};
/*! Bundled license information:

hammerjs/hammer.js:
  (*! Hammer.JS - v2.0.7 - 2016-04-22
   * http://hammerjs.github.io/
   *
   * Copyright (c) 2016 Jorik Tangelder;
   * Licensed under the MIT license *)

chart.js/dist/helpers.js:
  (*!
   * Chart.js v4.4.8
   * https://www.chartjs.org
   * (c) 2025 Chart.js Contributors
   * Released under the MIT License
   *)

chartjs-plugin-zoom/dist/chartjs-plugin-zoom.esm.js:
  (*!
  * chartjs-plugin-zoom v2.2.0
  * https://www.chartjs.org/chartjs-plugin-zoom/2.2.0/
   * (c) 2016-2024 chartjs-plugin-zoom Contributors
   * Released under the MIT License
   *)
*/
//# sourceMappingURL=chartjs-plugin-zoom.js.map
