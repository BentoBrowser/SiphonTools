let selectionState = {
    click: false,
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
    touchPosition: false,
    causingEvent: ""
};
let events = {
    click: (e) => Object.assign(selectionState, { click: e, causingEvent: 'click' }),
    mousedown: (e) => Object.assign(selectionState, { mouseDown: e, mouseUp: false, mousePosition: e, causingEvent: 'mousedown' }),
    mousemove: (e) => Object.assign(selectionState, { mousePosition: e, causingEvent: 'mousemove' }),
    mouseup: (e) => Object.assign(selectionState, { mouseDown: false, mouseUp: e, mousePosition: e, causingEvent: 'mouseup' }),
    contextmenu: (e) => Object.assign(selectionState, { mouseDown: false, mouseUp: e, causingEvent: 'contextmenu' }),
    pointerdown: (e) => Object.assign(selectionState, { pointerDown: e, pointerUp: false, pointerPosition: e, causingEvent: 'pointerdown' }),
    pointerup: (e) => Object.assign(selectionState, { pointerUp: e, pointerDown: false, pointerPosition: e, causingEvent: 'pointerup' }),
    pointermove: (e) => Object.assign(selectionState, { pointerPosition: e, causingEvent: 'pointermove' }),
    keydown: (e) => Object.assign(selectionState, { currentKey: e, causingEvent: 'keydown' }),
    keyup: (e) => Object.assign(selectionState, { previousKey: e, currentKey: false, causingEvent: 'keyup' }),
    wheel: (e) => Object.assign(selectionState, { wheel: e, causingEvent: 'wheel' }),
    scroll: (e) => Object.assign(selectionState, { scroll: e, causingEvent: 'scroll' }),
    touchstart: (e) => Object.assign(selectionState, { touchStart: e, touchEnd: false, touchPosition: e, causingEvent: 'touchstart' }),
    touchmove: (e) => Object.assign(selectionState, { touchPosition: e, causingEvent: 'touchmove' }),
    touchend: (e) => Object.assign(selectionState, { touchEnd: e, touchStart: false, touchPosition: e, causingEvent: 'touchend' }),
    touchcancel: (e) => Object.assign(selectionState, { touchEnd: e, touchStart: false, touchPosition: e, causingEvent: 'touchcancel' })
};
let currentListeners = {};
export default {
    selectors: [],
    enabled: true,
    currentSelector: null,
    init: function () {
        Object.keys(events).forEach((eventName) => {
            let listener = (e) => {
                events[eventName](e);
                this.checkConditions();
            };
            window.addEventListener(eventName, listener, true);
            currentListeners[eventName] = listener;
        });
    },
    disable: function () {
        this.enabled = false;
    },
    enable: function () {
        this.enabled = true;
    },
    getSelectionState: function () {
        return selectionState;
    },
    teardown: function () {
        Object.keys(currentListeners).forEach((listenerName) => {
            window.removeEventListener(listenerName, currentListeners[listenerName]);
        });
        currentListeners = {};
    },
    checkConditions: function () {
        if (!this.enabled)
            return;
        //If we have a selector currently running, we check and update that first
        if (this.currentSelector) {
            let selector = this.currentSelector;
            let isValid = selector.conditions(selectionState);
            if (isValid) {
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState);
                return;
            }
            else {
                selector.isRunning = false;
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState);
                if (selector.onSelectionEnd)
                    selector.onSelectionEnd(selectionState);
                this.currentSelector = null;
            }
        }
        //Finally, if we don't have a current selector, we loop through the available ones
        //finding the first valid one and setting that to our current selection state
        this.selectors.forEach((selector) => {
            let isValid = selector.conditions(selectionState);
            if (isValid) {
                selector.isRunning = true;
                this.currentSelector = selector;
                if (selector.onSelectionStart)
                    selector.onSelectionStart(selectionState);
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState);
                return;
            }
        });
    }
};
//# sourceMappingURL=event_listener.js.map