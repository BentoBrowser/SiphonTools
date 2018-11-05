//Listens to all events from the browser so we can appropriate fire off selectors when needed

let selectionState = {
  mouseDown: false,
  mouseUp: false,
  mousePosition: false,
  currentKey: false,
  previousKey: false,
  pointerDown: false,
  pointerUp: false,
  pointerPosition: false
}

let events = {
  mousedown: (e) => Object.assign(selectionState, {mouseDown: e, mouseUp: false, mousePosition: e}),
  mousemove: (e) => Object.assign(selectionState, {mousePosition: e}),
  mouseup: (e) => Object.assign(selectionState, {mouseDown: false, mouseUp: e, mousePosition: e}),
  contextmenu: (e) => Object.assign(selectionState, {mouseDown: false, mouseUp: e}),
  pointerdown: (e) => Object.assign(selectionState, {pointerDown: e, pointerUp: false, pointerPosition: e}),
  pointerup: (e) => Object.assign(selectionState, {pointerUp: e, pointerDown: false, pointerPosition: e}),
  pointermove: (e) => Object.assign(selectionState, {pointerPosition: e}),
  keydown: (e) => Object.assign(selectionState, {currentKey: e}),
  keyup: (e) => Object.assign(selectionState, {previousKey: e, currentKey: false}),
  wheel: (e) => Object.assign(selectionState, {wheel: e}),
  scroll: (e) => Object.assign(selectionState, {scroll: e}),
  touchstart: (e) => Object.assign(selectionState, {touchStart: e, touchEnd: false, touchPosition: e}),
  touchmove: (e) => Object.assign(selectionState, {touchPosition: e}),
  touchEnd: (e) => Object.assign(selectionState, {touchEnd: e, touchStart: false, touchPosition: e}),
  touchcancel: (e) => Object.assign(selectionState, {touchEnd: e, touchStart: false, touchPosition: e})
}
let currentListeners = {}

export default {
  selectors: [],
  init: function() {
    currentListeners = Object.keys(events).forEach(eventName => {
      let listener = (e) => {
        events[eventName](e)
        this.checkConditions(e)
      }
      window.addEventListener(eventName, listener)
      return listener;
    })
  },
  getSelectionState: function() {
    return selectionState
  },
  teardown: function() {
    Object.keys(currentListeners).forEach(listenerName => {
      window.removeEventListener(listenerName, currentListeners[listenerName])
    })
    currentListeners = {}
  },
  checkConditions: function() {
    this.selectors.forEach(selector => {
      let isValid = selector.conditions(selectionState)

      if (isValid && selector.isRunning) {
        if (selector.onSelectionChange)
          selector.onSelectionChange(selectionState)
      } else if (isValid && !selector.isRunning) {
        selector.isRunning = true;
        if (selector.onSelectionStart)
          selector.onSelectionStart(selectionState)
        if (selector.onSelectionChange)
          selector.onSelectionChange(selectionState)
      } else if (selector.isRunning && !isValid) {
        selector.isRunning = false;
        if (selector.onSelectionEnd)
          selector.onSelectionEnd(selectionState)
      }
    })
  }
}
