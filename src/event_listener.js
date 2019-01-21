//Listens to all events from the browser so we can appropriate fire off selectors when needed

let selectionState = {
  mouseDown: false,
  mouseUp: false,
  mousePosition: false,
  currentKey: false,
  previousKey: false,
  pointerDown: false,
  pointerUp: false,
  pointerPosition: false,
  touchStart: false,
  touchEnd: false,
  touchPosition: false
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
  enabled: true,
  currentSelector: null,
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
  disable: function() {
    this.enabled = false
  },
  enable: function() {
    this.enabled = true
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
    if (!this.enabled)
      return

    //If we have a selector currently running, we check and update that first
    if (this.currentSelector) {
      let selector = this.currentSelector
      let isValid = this.currentSelector.conditions(selectionState)
      if (isValid) {
        if (selector.onSelectionChange)
          selector.onSelectionChange(selectionState)
        return;
      } else {
        selector.isRunning = false;
        if (selector.onSelectionEnd)
          selector.onSelectionEnd(selectionState)
        this.currentSelector = null
      }
    }

    //Finally, if we don't have a current selector, we loop through the available ones
    //finding the first valid one and setting that to our current selection state
    this.selectors.forEach(selector => {
      let isValid = selector.conditions(selectionState)

      if (isValid) {
        selector.isRunning = true;
        this.currentSelector = selector
        if (selector.onSelectionStart)
          selector.onSelectionStart(selectionState)
        if (selector.onSelectionChange)
          selector.onSelectionChange(selectionState)
        return
      }
    })
  }
}
