//Listens to all events from the browser so we can appropriate fire off triggers when needed

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
  triggers: [],
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
    this.triggers.forEach(trigger => {
      let isValid = trigger.conditions(selectionState)

      if (isValid && trigger.isRunning) {
        if (trigger.onSelectionChange)
          trigger.onSelectionChange(selectionState)
      } else if (isValid && !trigger.isRunning) {
        trigger.isRunning = true;
        if (trigger.onSelectionStart)
          trigger.onSelectionStart(selectionState)
        if (trigger.onSelectionChange)
          trigger.onSelectionChange(selectionState)
      } else if (trigger.isRunning && !isValid) {
        trigger.isRunning = false;
        if (trigger.onSelectionEnd)
          trigger.onSelectionEnd(selectionState)
      }
    })
  }
}
